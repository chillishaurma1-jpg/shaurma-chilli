const fs = require('node:fs');
function terminated(file) {
  try {
    const {pid}=JSON.parse(fs.readFileSync(file,'utf8'));
    if(!Number.isInteger(pid) || pid<=0)return false;
    try {process.kill(pid,0);return false;} catch(error) {return error.code==='ESRCH';}
  } catch {return false;}
}
function acquireLock(file) {
  function open() {
    const fd=fs.openSync(file,'wx');
    try {fs.writeSync(fd,JSON.stringify({pid:process.pid}));}catch(error){fs.closeSync(fd);fs.unlinkSync(file);throw error;}
    return ()=>{fs.closeSync(fd);fs.unlinkSync(file);};
  }
  try {return open();}catch(error){if(error.code!=='EEXIST')throw error;}
  // Serialize recovery so simultaneous launches cannot remove each other's new lock.
  const recovery=file+'.recovery';let guard;
  try {
    guard=fs.openSync(recovery,'wx');
    if(terminated(file))fs.unlinkSync(file);
  } catch(error) {if(error.code!=='EEXIST')throw error;}
  finally {if(guard!==undefined){fs.closeSync(guard);fs.unlinkSync(recovery);}}
  return open();
}
module.exports={acquireLock};
