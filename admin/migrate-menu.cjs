const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {validateMenu,generateMenuScript} = require('./menu-store.cjs');
const root = path.resolve(__dirname,'..');
if(fs.existsSync(path.join(root,'menu.json'))) throw new Error('menu.json already exists; migration refused.');
const source = fs.readFileSync(path.join(root,'script.js'),'utf8');
const start = source.indexOf('const MENU = [');
const end = source.indexOf('const HERO_IMAGES');
if(start < 0 || end < start) throw new Error('Legacy menu not found.');
const legacy = vm.runInNewContext(source.slice(start,end)+'\n({MENU,POPULAR_ITEMS})',Object.create(null),{timeout:1000});
function label(item) { return [item.name,item.subtitle, ['Напитки','Соусы'].includes(item.category) ? item.volume : ''].filter(Boolean).join(' '); }
const data = validateMenu({version:1,categories:[...new Set(legacy.MENU.map(i=>i.category))],items:legacy.MENU.map((item,index)=>({...item,id:`dish-${index+1}`,visible:true,popular:legacy.POPULAR_ITEMS.includes(label(item))}))},root);
if(data.items.length!==54 || data.items.filter(i=>i.popular).length!==10) throw new Error('Unexpected migration counts.');
fs.writeFileSync(path.join(root,'menu.json'),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(root,'menu-data.js'),generateMenuScript(data),{flag:'wx'});
console.log(`Migrated ${data.items.length} products; ${data.items.filter(i=>i.popular).length} popular.`);
