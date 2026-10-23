const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const {failure,loadMenu,saveMenu,generateMenuScript,validateMenu,atomicWrite} = require('./menu-store.cjs');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon'};

function body(req, limit) {
  return new Promise((resolve,reject) => {
    const chunks = []; let size = 0; let rejected = false;
    req.on('data',chunk => {
      size += chunk.length;
      if(size > limit) { if(!rejected) reject(failure('Файл слишком большой. Выберите изображение поменьше.',413)); rejected = true; chunks.length = 0; }
      else if(!rejected) chunks.push(chunk);
    });
    req.on('end',()=>{if(!rejected) resolve(Buffer.concat(chunks));});
    req.on('error',reject);
  });
}
function createAdminServer({root, publisher}) {
  const key = crypto.randomBytes(32).toString('hex');
  const publicRoot = path.join(__dirname,'public');
  const server = http.createServer(async (req,res) => {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('X-Frame-Options','DENY');
    const send = (status,data) => { res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(data)); };
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      if(req.headers.host !== origin.slice(7)) throw failure('Доступ запрещен.',403);
      const rawPath = decodeURIComponent(req.url.split('?')[0]);
      if(rawPath.includes('..') || rawPath.includes('\\') || rawPath.includes('\0')) throw failure('Страница не найдена.',404);
      if(rawPath.startsWith('/api/')) {
        const supplied = Buffer.from(String(req.headers['x-chilli-key'] || ''));
        if(supplied.length !== key.length || !crypto.timingSafeEqual(supplied,Buffer.from(key)) || (req.headers.origin && req.headers.origin !== origin) || req.headers['sec-fetch-site'] === 'cross-site') throw failure('Доступ запрещен. Откройте панель через файл запуска.',403);
        if(req.method !== 'GET' && req.headers.origin !== origin) throw failure('Доступ запрещен.',403);
        if(req.method === 'GET' && rawPath === '/api/menu') return send(200,loadMenu(root));
        if(req.method === 'PUT' && rawPath === '/api/menu') {
          const input = JSON.parse((await body(req,2000000)).toString('utf8'));
          return send(200,saveMenu(root,input.data,input.revision));
        }
        if(req.method === 'POST' && rawPath === '/api/images') {
          if(req.headers['content-type'] !== 'image/webp') throw failure('Нужна фотография в формате WebP.');
          const bytes = await body(req,2000000);
          if(bytes.length < 30 || bytes.toString('ascii',0,4)!=='RIFF' || bytes.toString('ascii',8,12)!=='WEBP' || bytes.readUInt32LE(4)!==bytes.length-8 || !['VP8 ','VP8L','VP8X'].includes(bytes.toString('ascii',12,16))) throw failure('Не удалось прочитать фотографию.');
          const image = `assets/upload-${crypto.randomUUID()}.webp`;
          fs.mkdirSync(path.join(root,'assets'),{recursive:true});
          fs.writeFileSync(path.join(root,image),bytes,{flag:'wx'});
          return send(200,{image});
        }
        if(req.method === 'POST' && rawPath === '/api/publish') {
          if(publisher.status().busy)throw failure('Публикация уже выполняется.',409);
          const input = JSON.parse((await body(req,2000000)).toString('utf8'));
          const snapshot = saveMenu(root,input.data,input.revision);
          publisher.start(snapshot);
          return send(202,{...snapshot,publication:publisher.status()});
        }
        if(req.method === 'GET' && rawPath === '/api/publication') return send(200,publisher.status());
        throw failure('Страница не найдена.',404);
      }
      if(req.method !== 'GET' && req.method !== 'HEAD') throw failure('Страница не найдена.',404);
      let file;
      if(rawPath.startsWith('/preview/')) {
        const relative = rawPath.slice('/preview/'.length) || 'index.html';
        if(!/^(index\.html|script\.js|style\.css|menu-data\.js|assets\/[a-zA-Z0-9_./-]+)$/.test(relative) || relative.split('/').some(v=>v.startsWith('.'))) throw failure('Страница не найдена.',404);
        file = path.join(root,relative);
      } else {
        const relative = rawPath === '/' ? 'index.html' : rawPath.slice(1);
        if(!['index.html','app.js','style.css','lucide.js'].includes(relative)) throw failure('Страница не найдена.',404);
        file = path.join(publicRoot,relative);
        res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
      }
      if(!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) throw failure('Страница не найдена.',404);
      const base = rawPath.startsWith('/preview/') ? root : publicRoot;
      if(!fs.realpathSync(file).startsWith(fs.realpathSync(base)+path.sep)) throw failure('Страница не найдена.',404);
      res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
      if(req.method === 'HEAD') return res.end();
      fs.createReadStream(file).pipe(res);
    } catch(error) {
      if(res.headersSent) { res.end(); return; }
      send(error.status || (error instanceof SyntaxError ? 400 : 500),{error:error.status || error instanceof SyntaxError ? error.message : 'Не удалось выполнить действие. Проверьте файлы проекта и повторите.'});
    }
  });
  return {server,key};
}
if(require.main === module) {
  const root = path.resolve(__dirname,'..');
  const {createPublisher} = require('./publish.cjs');
  const data = validateMenu(loadMenu(root).data,root);
  atomicWrite(path.join(root,'menu-data.js'),generateMenuScript(data));
  const publisher = createPublisher({root});
  const app = createAdminServer({root,publisher});
  app.server.listen(0,'127.0.0.1',() => {
    const url = `http://127.0.0.1:${app.server.address().port}`;
    console.log(`Панель Chilli запущена: ${url}\nДля остановки закройте это окно или нажмите Ctrl+C.`);
    if(!process.argv.includes('--no-open')) spawn('cmd.exe',['/d','/c','start','',`${url}/#${app.key}`],{windowsHide:true,stdio:'ignore'});
  });
}
module.exports = {createAdminServer};
