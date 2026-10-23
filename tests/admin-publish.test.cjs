const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const {createPublisher} = require('../admin/publish.cjs');
const {loadMenu,generateMenuScript,hash} = require('../admin/menu-store.cjs');
const project = path.resolve(__dirname,'..');
const git = (dir,...args) => cp.execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const digest = text => hash(text.replace(/\r\n/g,'\n'));
function fixture() {
  const temp=fs.mkdtempSync(path.join(project,'.admin-state-test-')); const root=path.join(temp,'site'); const remote=path.join(temp,'remote.git');const seed=path.join(temp,'seed');
  fs.mkdirSync(root);fs.mkdirSync(seed);git(temp,'init','--bare',remote);git(seed,'init','-b','main');git(seed,'config','user.name','Test');git(seed,'config','user.email','test@example.invalid');
  for(const dir of [root,seed]) {fs.writeFileSync(path.join(dir,'index.html'),'<script src="menu-data.js"></script><script src="script.js"></script>');fs.writeFileSync(path.join(dir,'script.js'),'window.test = window.CHILLI_MENU_DATA;');}
  const data={version:1,categories:['Test'],items:[{id:'x',name:'Test',subtitle:'',volume:'',category:'Test',pickupPrice:10,deliveryPrice:null,image:'',visible:true,popular:true}]};
  fs.writeFileSync(path.join(root,'menu.json'),JSON.stringify(data));fs.writeFileSync(path.join(root,'menu-data.js'),generateMenuScript(data));
  git(seed,'add','.');git(seed,'commit','-m','Initial');git(seed,'remote','add','origin',remote);git(seed,'push','origin','main');git(temp,'--git-dir',remote,'symbolic-ref','HEAD','refs/heads/main');
  const baseline=Object.fromEntries(['index.html','script.js'].map(f=>[f,digest(fs.readFileSync(path.join(seed,f),'utf8'))]));
  return {temp,root,remote,seed,baseline,cleanup:()=>fs.rmSync(temp,{recursive:true,force:true,maxRetries:10,retryDelay:100})};
}
async function publish(p,snapshot) {p.start(snapshot);await p.wait();return p.status();}
test('publishes allowlisted files; verifies live data; retry is idempotent',async()=>{
  const f=fixture();try {
    fs.writeFileSync(path.join(f.root,'secret.txt'),'never publish');
    const p=createPublisher({...f,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});
    assert.equal((await publish(p,loadMenu(f.root))).state,'published');
    const first=git(f.temp,'--git-dir',f.remote,'rev-parse','main');
    assert.equal((await publish(p,loadMenu(f.root))).state,'published');
    assert.equal(git(f.temp,'--git-dir',f.remote,'rev-parse','main'),first);
    assert.ok(!git(f.temp,'--git-dir',f.remote,'ls-tree','-r','--name-only','main').includes('secret'));
  } finally{f.cleanup();}
});
test('rejects concurrent publishes and foreign remote edits without overwriting',async()=>{
  const f=fixture();try {
    const p=createPublisher({...f,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});
    p.start(loadMenu(f.root));assert.throws(()=>p.start(loadMenu(f.root)),/уже/);await p.wait();
    git(f.seed,'pull','--ff-only','origin','main');fs.appendFileSync(path.join(f.seed,'script.js'),'\n// foreign');git(f.seed,'commit','-am','Foreign');git(f.seed,'push','origin','main');
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');assert.match(p.status().message,/GitHub|измен/);
    assert.ok(git(f.temp,'--git-dir',f.remote,'show','main:script.js').includes('foreign'));
  } finally{f.cleanup();}
});
test('dirty publication copy is preserved; live mismatch never reports success',async()=>{
  const f=fixture();try {
    const p=createPublisher({...f,fetchLive:async()=>{throw new Error('offline');},verifyConnection:false,attempts:1,pollMs:1});
    assert.equal((await publish(p,loadMenu(f.root))).state,'waiting');
    fs.writeFileSync(path.join(p.workdir,'foreign.txt'),'keep me');
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');
    assert.equal(fs.readFileSync(path.join(p.workdir,'foreign.txt'),'utf8'),'keep me');
  } finally{f.cleanup();}
});
test('failed push can be retried without losing the saved commit',async()=>{
  const f=fixture();try {
    let failPush=true;
    const runGit=async(dir,...args)=>{if(args[0]==='push' && failPush){failPush=false;throw new Error('offline');}return git(dir,...args);};
    const p=createPublisher({...f,runGit,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');
    const pending=git(p.workdir,'rev-parse','HEAD');
    assert.equal((await publish(p,loadMenu(f.root))).state,'published');
    assert.equal(git(f.temp,'--git-dir',f.remote,'rev-parse','main'),pending);
  } finally{f.cleanup();}
});
test('remote menu changed outside the panel is preserved',async()=>{
  const f=fixture();try {
    const p=createPublisher({...f,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});await publish(p,loadMenu(f.root));
    git(f.seed,'pull','--ff-only','origin','main');const menu=JSON.parse(fs.readFileSync(path.join(f.seed,'menu.json'),'utf8'));menu.items[0].pickupPrice=999;fs.writeFileSync(path.join(f.seed,'menu.json'),JSON.stringify(menu));git(f.seed,'commit','-am','Foreign price');git(f.seed,'push','origin','main');
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');
    assert.equal(JSON.parse(git(f.temp,'--git-dir',f.remote,'show','main:menu.json')).items[0].pickupPrice,999);
  } finally{f.cleanup();}
});
test('failed commit retries own exact writes while protecting user edits',async()=>{
  const f=fixture();try{
    let failCommit=true;
    const runGit=async(dir,...args)=>{if(args.includes('commit') && failCommit){failCommit=false;throw new Error('commit failed');}return git(dir,...args);};
    const p=createPublisher({...f,runGit,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');
    assert.equal((await publish(p,loadMenu(f.root))).state,'published');
  } finally{f.cleanup();}
});
test('foreign deletion of a required file is a conflict',async()=>{
  const f=fixture();try{
    const p=createPublisher({...f,fetchLive:async()=>fs.readFileSync(path.join(f.root,'menu-data.js'),'utf8'),verifyConnection:false});
    await publish(p,loadMenu(f.root));git(f.seed,'pull','--ff-only','origin','main');git(f.seed,'rm','script.js');git(f.seed,'commit','-m','Foreign delete');git(f.seed,'push','origin','main');
    assert.equal((await publish(p,loadMenu(f.root))).state,'failed');
    assert.ok(!git(f.temp,'--git-dir',f.remote,'ls-tree','--name-only','main').split(/\r?\n/).includes('script.js'));
  }finally{f.cleanup();}
});
test('live verification handles UTF-8 BOM removed by HTTP text decoding',async()=>{
  const f=fixture();try{
    const script=fs.readFileSync(path.join(f.root,'script.js'),'utf8');fs.writeFileSync(path.join(f.root,'script.js'),'\uFEFF'+script);
    const p=createPublisher({...f,attempts:1,pollMs:1,fetchLive:async file=>fs.readFileSync(path.join(f.root,file),'utf8').replace(/^\uFEFF/,'')});
    assert.equal((await publish(p,loadMenu(f.root))).state,'published');
  }finally{f.cleanup();}
});
