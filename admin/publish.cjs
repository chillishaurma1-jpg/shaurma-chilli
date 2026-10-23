const fs = require('node:fs');
const path = require('node:path');
const {execFile} = require('node:child_process');
const {promisify} = require('node:util');
const {failure,hash,validateMenu,generateMenuScript,atomicWrite} = require('./menu-store.cjs');
const exec = promisify(execFile);
const {acquireLock}=require('./lock.cjs');
const digest = text => hash(text.replace(/\r\n/g,'\n'));
const liveDigest = text => digest(text.replace(/^\uFEFF/,'').trimEnd());
const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));

function createPublisher({root,remote='https://github.com/chillishaurma1-jpg/shaurma-chilli.git',branch='main',liveUrl='https://shaurma-chilli.ru',baseline=require('./site-baseline.json'),fetchLive,runGit,verifyConnection=true,attempts=30,pollMs=5000,workdir:providedWorkdir} = {}) {
  const stateDir = path.join(root,'.admin-state');fs.mkdirSync(stateDir,{recursive:true});
  const existing = path.join(root,'.codex-backups','deploy-shaurma-chilli');
  const workdir = providedWorkdir || (fs.existsSync(path.join(existing,'.git')) ? existing : path.join(stateDir,'publish'));
  const stateFile = path.join(stateDir,'publication.json'); const lockFile=path.join(stateDir,'publish.lock');
  const stored = () => fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile,'utf8')) : {files:{},pendingCommit:null};
  let status = {state:'idle',message:'Публикаций из панели пока нет.'}, task = null;
  const git = runGit || (async (cwd,...args)=>{
    try {const result=await exec('git',args,{cwd,encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:4000000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}});return result.stdout.trimEnd();}
    catch {throw failure('GitHub: не удалось выполнить операцию. Проверьте интернет и вход в GitHub; локальные изменения сохранены.',500);}
  });
  const readLive = fetchLive || (async relative=>{
    const response=await fetch(`${liveUrl}/${relative}?v=${Date.now()}`,{signal:AbortSignal.timeout(15000),cache:'no-store'});
    if(!response.ok)throw new Error('Publication pending');return response.text();
  });
  const update = (state,message,extra={}) => {status={...status,state,message,...extra};};
  async function run(snapshot) {
    let release;
    try {
      try {release=acquireLock(lockFile);}
      catch {throw failure('Другая публикация уже выполняется. Закройте другие окна панели.');}
      update('checking','Проверка меню и версии на GitHub…');
      const data=validateMenu(snapshot.data,root);
      const snapshotHash=hash(JSON.stringify(data));
      status.menuHash=snapshotHash;
      const sources={
        'index.html':fs.readFileSync(path.join(root,'index.html'),'utf8'),
        'script.js':fs.readFileSync(path.join(root,'script.js'),'utf8'),
        'menu.json':JSON.stringify(data,null,2)+'\n',
        'menu-data.js':generateMenuScript(data),
      };
      if(!sources['index.html'].includes('src="menu-data.js"') || !sources['script.js'].includes('window.CHILLI_MENU_DATA')) throw failure('Не найдено подключение нового меню.');
      const images=new Map([...new Set(data.items.map(i=>i.image).filter(Boolean))].map(file=>[file,fs.readFileSync(path.join(root,file))]));
      let saved=stored();
      if(!fs.existsSync(path.join(workdir,'.git'))) {
        fs.mkdirSync(path.dirname(workdir),{recursive:true});
        await git(root,'clone','--single-branch','--branch',branch,remote,workdir);
      }
      if((await git(workdir,'remote','get-url','origin')).trim()!==remote)throw failure('У рабочей копии публикации другой адрес GitHub.');
      if((await git(workdir,'branch','--show-current')).trim()!==branch)throw failure('В рабочей копии публикации выбрана другая ветка.');
      if((await git(workdir,'status','--porcelain')).trim()) {
        const draft=saved.draft;
        const dirtyPaths=[...(await git(workdir,'diff','--name-only')).split(/\r?\n/),...(await git(workdir,'diff','--cached','--name-only')).split(/\r?\n/),...(await git(workdir,'ls-files','--others','--exclude-standard')).split(/\r?\n/)].filter(Boolean);
        const ownWrites=draft && draft.baseHead===(await git(workdir,'rev-parse','HEAD')).trim() && dirtyPaths.every(file=>draft.files[file] && fs.existsSync(path.join(workdir,file)) && !fs.lstatSync(path.join(workdir,file)).isSymbolicLink() && hash(fs.readFileSync(path.join(workdir,file)))===draft.files[file]);
        if(!ownWrites)throw failure('В папке публикации есть изменения. Они сохранены: публикация остановлена.');
      }
      await git(workdir,'fetch','origin',branch);
      const head=(await git(workdir,'rev-parse','HEAD')).trim();
      const remoteHead=(await git(workdir,'rev-parse',`origin/${branch}`)).trim();
      if(head!==remoteHead) {
        let ahead=false;
        try {ahead=(await git(workdir,'merge-base',head,remoteHead)).trim()===remoteHead;}catch{}
        if(ahead) {if(saved.pendingCommit!==head)throw failure('В рабочей копии есть неизвестные commits. Публикация остановлена.');}
        else await git(workdir,'merge','--ff-only',`origin/${branch}`);
      }
      const currentFiles=(await git(workdir,'ls-tree','-r','--name-only',`origin/${branch}`)).split(/\r?\n/);
      for(const [file,desired] of Object.entries(sources)) {
        if(!currentFiles.includes(file)) {
          if(saved.files[file] || baseline[file])throw failure(`Файл ${file} удален на GitHub. Публикация остановлена, чтобы сохранить чужое изменение.`);
          continue;
        }
        const remoteText=await git(workdir,'show',`origin/${branch}:${file}`);
        const actual=digest(remoteText.trimEnd());
        const known=saved.files[file] || baseline[file];
        if(actual!==digest(desired.trimEnd()) && actual!==known)throw failure(`Файл ${file} изменен на GitHub. Публикация остановлена, чтобы сохранить эти изменения.`);
      }
      for(const [file,bytes] of images) {
        const target=path.join(workdir,file);
        const parent=path.dirname(target);
        if(fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink())throw failure('Недопустимая папка фотографий.');
        if(fs.existsSync(target)) {if(fs.lstatSync(target).isSymbolicLink() || hash(fs.readFileSync(target))!==hash(bytes))throw failure(`Фотография ${file} отличается на GitHub. Автоматическая замена остановлена.`);}
      }
      // All collision checks precede writes, so conflicts leave the checkout clean.
      saved.draft={baseHead:(await git(workdir,'rev-parse','HEAD')).trim(),files:Object.fromEntries([...Object.entries(sources).map(([file,text])=>[file,hash(Buffer.from(text))]),...[...images].map(([file,bytes])=>[file,hash(bytes)])])};
      atomicWrite(stateFile,JSON.stringify(saved,null,2));
      for(const [file,text] of Object.entries(sources)) {
        const target=path.join(workdir,file);if(fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())throw failure('Недопустимый файл публикации.');
        fs.writeFileSync(target,text);
      }
      for(const [file,bytes] of images) {const target=path.join(workdir,file);if(!fs.existsSync(target)){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});}}
      const files=[...Object.keys(sources),...images.keys()];
      await git(workdir,'add','--',...files);
      const changed=(await git(workdir,'diff','--cached','--name-only')).trim();
      if(changed) {
        const staged=changed.split(/\r?\n/);if(staged.some(f=>!files.includes(f)))throw failure('Обнаружены посторонние файлы публикации.');
        await git(workdir,'-c','user.name=Chilli Menu Editor','-c','user.email=menu-editor@users.noreply.github.com','-c','maintenance.auto=false','commit','-m','Update menu from local Chilli editor');
      }
      const commit=(await git(workdir,'rev-parse','HEAD')).trim();
      saved={...saved,pendingCommit:commit,draft:null};atomicWrite(stateFile,JSON.stringify(saved,null,2));
      update('pushing','Отправка меню на GitHub…',{commit});
      await git(workdir,'push','origin',`HEAD:${branch}`);
      saved={files:Object.fromEntries(Object.entries(sources).map(([file,text])=>[file,digest(text.trimEnd())])),pendingCommit:null,draft:null,commit,menuHash:snapshotHash};atomicWrite(stateFile,JSON.stringify(saved,null,2));
      update('waiting','Отправлено на GitHub. Ожидается обновление сайта…',{commit});
      for(let attempt=0;attempt<attempts;attempt++) {
        try {
          const live=await readLive('menu-data.js');
          if(liveDigest(live)!==liveDigest(sources['menu-data.js']))throw new Error('Older menu');
          if(verifyConnection) for(const file of ['index.html','script.js']) if(liveDigest(await readLive(file))!==liveDigest(sources[file]))throw new Error('Older connection');
          update('published','Опубликовано на сайте · '+commit.slice(0,7),{commit});return;
        } catch{}
        if(attempt+1<attempts)await delay(pollMs);
      }
      update('waiting','Меню отправлено на GitHub. Сайт пока не подтвердил обновление; нажмите «Опубликовать» для повторной проверки.',{commit});
    } catch(error) {update('failed',error.status?error.message:'Не удалось опубликовать меню. Локальные данные сохранены; повторите попытку.');}
    finally {if(release)release();}
  }
  return {
    workdir,
    status:()=>({...status,busy:!!task}),
    start(snapshot) {
      if(task)throw failure('Публикация уже выполняется.',409);
      const immutable=structuredClone(snapshot);
      task=Promise.resolve().then(()=>run(immutable)).finally(()=>{task=null;});
    },
    wait:()=>task,
  };
}
module.exports={createPublisher};
