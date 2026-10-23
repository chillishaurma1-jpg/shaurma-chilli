const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { validateMenu, generateMenuScript, loadMenu, saveMenu } = require('../admin/menu-store.cjs');
const root = path.resolve(__dirname, '..');
const sample = () => ({ version: 1, categories: ['Напитки'], items: [{ id: 'tea', name: 'Чай "<вкусный>"', subtitle: '', volume: '0,2 л', category: 'Напитки', pickupPrice: 50, deliveryPrice: null, image: '', visible: true, popular: false }] });
test('validation preserves text and rejects unsafe or invalid input', () => {
  assert.equal(validateMenu(sample(), root).items[0].name, 'Чай "<вкусный>"');
  for (const patch of [{name:''}, {category:'none'}, {pickupPrice:-1}, {pickupPrice:'50'}, {deliveryPrice:NaN}, {image:'assets/../script.js'}, {image:'assets/no-such-photo.webp'}]) {
    const data = sample(); Object.assign(data.items[0], patch);
    assert.throws(() => validateMenu(data, root));
  }
  const duplicate = sample(); duplicate.items.push({...duplicate.items[0]});
  assert.throws(() => validateMenu(duplicate, root));
});
test('generated data retains hidden products and escapes script delimiters', () => {
  const data = sample(); data.items[0].visible = false; data.items[0].name = '</script>';
  const source = generateMenuScript(data);
  assert.ok(!source.includes('</script>'));
  const context = {window:{}}; vm.runInNewContext(source, context);
  assert.equal(context.window.CHILLI_MENU_DATA.items[0].name, '</script>');
  assert.equal(context.window.CHILLI_MENU_DATA.items[0].visible, false);
});
test('save survives reload; stale revision and invalid data cannot overwrite it', () => {
  const dir = fs.mkdtempSync(path.join(root, '.admin-state-test-'));
  try {
    fs.writeFileSync(path.join(dir,'menu.json'), JSON.stringify(sample()));
    const before = loadMenu(dir); const changed = structuredClone(before.data);
    changed.items[0].pickupPrice = 70;
    const saved = saveMenu(dir, changed, before.revision);
    assert.equal(loadMenu(dir).data.items[0].pickupPrice, 70);
    assert.equal(fs.readFileSync(path.join(dir,'menu-data.js'),'utf8'), generateMenuScript(saved.data));
    assert.throws(() => saveMenu(dir, before.data, before.revision), /409|другой/);
    changed.items[0].pickupPrice = -1;
    assert.throws(() => saveMenu(dir, changed, saved.revision));
    assert.equal(loadMenu(dir).revision, saved.revision);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
test('a lock from a terminated process does not prevent future saves', () => {
  const dir = fs.mkdtempSync(path.join(root,'.admin-state-test-'));
  try {
    fs.writeFileSync(path.join(dir,'menu.json'),JSON.stringify(sample()));
    fs.mkdirSync(path.join(dir,'.admin-state'));fs.writeFileSync(path.join(dir,'.admin-state','save.lock'),JSON.stringify({pid:2147483647}));
    const before=loadMenu(dir);
    assert.doesNotThrow(()=>saveMenu(dir,before.data,before.revision));
    assert.ok(!fs.existsSync(path.join(dir,'.admin-state','save.lock')));
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('valid fractional prices are accepted and sub-cent prices rejected',()=>{
  const data=sample();data.items[0].pickupPrice=.29;
  assert.equal(validateMenu(data,root).items[0].pickupPrice,.29);
  data.items[0].pickupPrice=.291;assert.throws(()=>validateMenu(data,root));
});
test('failed derived script write does not commit a new authoritative menu',()=>{
  const dir=fs.mkdtempSync(path.join(root,'.admin-state-test-'));
  try {
    fs.writeFileSync(path.join(dir,'menu.json'),JSON.stringify(sample()));fs.mkdirSync(path.join(dir,'menu-data.js'));
    const before=loadMenu(dir);const changed=structuredClone(before.data);changed.items[0].pickupPrice=80;
    assert.throws(()=>saveMenu(dir,changed,before.revision));
    assert.equal(loadMenu(dir).revision,before.revision);
  } finally{fs.rmSync(dir,{recursive:true,force:true});}
});
