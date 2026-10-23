const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {createAdminServer} = require('../admin/server.cjs');
test('local API rejects outside requests, unsafe paths, uploads and stale saves', async () => {
  const root = path.resolve(__dirname,'..');
  const dir = fs.mkdtempSync(path.join(root,'.admin-state-test-'));
  fs.copyFileSync(path.join(root,'menu.json'),path.join(dir,'menu.json'));
  const app = createAdminServer({root:dir, publisher:{status:()=>({state:'idle'}),start:()=>{}}});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  const url = `http://127.0.0.1:${app.server.address().port}`;
  const headers = {'x-chilli-key':app.key,'origin':url,'content-type':'application/json'};
  try {
    assert.equal((await fetch(url+'/api/menu')).status,403);
    const badHostStatus = await new Promise((resolve,reject) => {
      const req = http.get(url+'/api/menu',{headers:{...headers,host:'evil.test'}},res=>{res.resume();resolve(res.statusCode);}); req.on('error',reject);
    });
    assert.equal(badHostStatus,403);
    const good = await fetch(url+'/api/menu',{headers}); assert.equal(good.status,200);
    const snapshot = await good.json();
    assert.equal((await fetch(url+'/api/menu',{method:'PUT',headers:{...headers,origin:'https://evil.test'},body:JSON.stringify(snapshot)})).status,403);
    assert.equal((await fetch(url+'/api/menu',{method:'PUT',headers,body:JSON.stringify({...snapshot,revision:'old'})})).status,409);
    for(const target of ['/preview/.git/config','/preview/admin/server.cjs','/preview/%2e%2e%2fscript.js','/api/../.env']) assert.equal((await fetch(url+target,{headers})).status,404);
    assert.equal((await fetch(url+'/api/images',{method:'POST',headers:{...headers,'content-type':'image/webp'},body:'not a webp'})).status,400);
    assert.equal((await fetch(url+'/api/images',{method:'POST',headers:{...headers,'content-type':'image/svg+xml'},body:'<svg/>'})).status,400);
    assert.equal((await fetch(url+'/api/images',{method:'POST',headers:{...headers,'content-type':'image/webp'},body:Buffer.alloc(2100000)})).status,413);
    assert.equal((await fetch(url+'/preview/menu.json',{headers})).status,404);
    assert.equal((await fetch(url+'/api/menu',{headers:{...headers,'sec-fetch-site':'cross-site'}})).status,403);
  } finally { await new Promise(resolve=>app.server.close(resolve)); fs.rmSync(dir,{recursive:true,force:true}); }
});
test('busy publication rejects before changing the saved revision',async()=>{
  const root=path.resolve(__dirname,'..');const dir=fs.mkdtempSync(path.join(root,'.admin-state-test-'));
  const data={version:1,categories:['A'],items:[{id:'a',name:'A',subtitle:'',volume:'',category:'A',pickupPrice:10,deliveryPrice:null,image:'',visible:true,popular:true}]};
  fs.writeFileSync(path.join(dir,'menu.json'),JSON.stringify(data));
  const {loadMenu}=require('../admin/menu-store.cjs');const before=loadMenu(dir);
  const app=createAdminServer({root:dir,publisher:{status:()=>({busy:true}),start:()=>{throw new Error('should not start');}}});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${app.server.address().port}`;
  try {
    data.items[0].pickupPrice=20;
    const result=await fetch(url+'/api/publish',{method:'POST',headers:{'x-chilli-key':app.key,origin:url,'content-type':'application/json'},body:JSON.stringify({data,revision:before.revision})});
    assert.equal(result.status,409);assert.equal(loadMenu(dir).revision,before.revision);
  }finally{await new Promise(resolve=>app.server.close(resolve));fs.rmSync(dir,{recursive:true,force:true});}
});
