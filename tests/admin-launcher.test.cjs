const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn,execFile}=require('node:child_process');
const path=require('node:path');
test('Windows command launcher starts the editor even with an old Explorer PATH',{skip:process.platform!=='win32'},async()=>{
  const root=path.resolve(__dirname,'..');
  const child=spawn('cmd.exe',['/d','/c','call','"Управление меню.cmd"','--no-open'],{cwd:root,windowsHide:true,windowsVerbatimArguments:true,env:{...process.env,PATH:path.join(process.env.SystemRoot,'System32')}});
  let output='';let exited=false;
  try {
    const url=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Launcher timeout: '+output)),12000);
      child.stdout.on('data',chunk=>{output+=chunk.toString('utf8');const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
      child.stderr.on('data',chunk=>{output+=chunk.toString('utf8');});
      child.on('exit',code=>{exited=true;clearTimeout(timer);reject(new Error(`Launcher exited ${code}: ${output}`));});
      child.on('error',error=>{clearTimeout(timer);reject(error);});
      child.stdin.end();
    });
    assert.equal((await fetch(url)).status,200);
    assert.equal((await fetch(url+'/api/menu')).status,403);
  } finally {
    if(!exited)await new Promise(resolve=>execFile('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true},()=>resolve()));
  }
});
