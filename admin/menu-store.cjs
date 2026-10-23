const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {acquireLock} = require('./lock.cjs');

function failure(message, status = 400) { const error = new Error(message); error.status = status; return error; }
function hash(text) { return crypto.createHash('sha256').update(text).digest('hex'); }
function validateMenu(data, root) {
  if (!data || data.version !== 1 || !Array.isArray(data.categories) || !Array.isArray(data.items) || data.items.length > 1000) throw failure('Неверный формат меню.');
  const string = (v, field, required = false, max = 200) => {
    if (typeof v !== 'string' || v.length > max || (required && !v.trim()) || /[\x00-\x08\x0b-\x1f]/.test(v)) throw failure(`Проверьте поле «${field}».`);
    return v.trim();
  };
  const categories = data.categories.map(v => string(v, 'Категория', true, 80));
  if (categories.length > 100 || new Set(categories).size !== categories.length) throw failure('Категории не должны повторяться.');
  const ids = new Set();
  const items = data.items.map(item => {
    if (!item || typeof item !== 'object') throw failure('Неверный товар.');
    const id = string(item.id, 'Идентификатор', true, 80);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id)) throw failure('Повторяющийся или неверный идентификатор товара.');
    ids.add(id);
    const name = string(item.name, 'Название', true);
    const category = string(item.category, 'Категория', true, 80);
    if (!categories.includes(category)) throw failure(`Не найдена категория товара «${name}».`);
    const price = (value, nullable) => {
      if (nullable && value === null) return null;
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000000 || Math.abs(Math.round(value * 100) - value * 100) > 0.000001) throw failure(`Проверьте цену товара «${name}».`);
      return value;
    };
    const image = string(item.image, 'Фотография', false, 250);
    if (image) {
      if (!/^assets\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g)$/i.test(image)) throw failure('Недопустимый путь фотографии.');
      const target = path.join(root, image);
      if (!fs.existsSync(target) || !fs.statSync(target).isFile() || fs.lstatSync(target).isSymbolicLink() || !fs.realpathSync(target).startsWith(fs.realpathSync(root) + path.sep)) throw failure(`Фотография товара «${name}» не найдена.`);
    }
    if (typeof item.visible !== 'boolean' || typeof item.popular !== 'boolean') throw failure('Проверьте настройки видимости товара.');
    return {id, name, subtitle:string(item.subtitle,'Подпись'), volume:string(item.volume,'Объем'), category, pickupPrice:price(item.pickupPrice,false), deliveryPrice:price(item.deliveryPrice,true), image, visible:item.visible, popular:item.popular};
  });
  return {version:1,categories,items};
}
function generateMenuScript(data) {
  return `// Generated from menu.json by the local menu editor.\nwindow.CHILLI_MENU_DATA = ${JSON.stringify(data, null, 2).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')};\n`;
}
function loadMenu(root) {
  const text = fs.readFileSync(path.join(root,'menu.json'),'utf8');
  return {data:JSON.parse(text), revision:hash(text)};
}
function atomicWrite(file, text) {
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(temp,text,{flag:'wx'}); fs.renameSync(temp,file); }
  finally { if(fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function saveMenu(root, data, expectedRevision) {
  const state = path.join(root,'.admin-state'); fs.mkdirSync(state,{recursive:true});
  const lock = path.join(state,'save.lock');
  let release;
  try { release = acquireLock(lock); } catch { throw failure('Другое сохранение уже выполняется.',409); }
  try {
    const current = loadMenu(root);
    if(current.revision !== expectedRevision) throw failure('Меню изменено в другой вкладке. Обновите страницу перед сохранением.',409);
    const normalized = validateMenu(data,root);
    // Commit authoritative JSON last; roll back the derived file if that step fails.
    atomicWrite(path.join(root,'menu-data.js'),generateMenuScript(normalized));
    try {atomicWrite(path.join(root,'menu.json'),JSON.stringify(normalized,null,2)+'\n');}
    catch(error) {atomicWrite(path.join(root,'menu-data.js'),generateMenuScript(current.data));throw error;}
    return loadMenu(root);
  } finally { release(); }
}
module.exports = {failure,hash,validateMenu,generateMenuScript,loadMenu,saveMenu,atomicWrite};
