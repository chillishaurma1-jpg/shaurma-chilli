const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createAdminServer}=require('../admin/server.cjs');
const {generateMenuScript,loadMenu}=require('../admin/menu-store.cjs');
const project=path.resolve(__dirname,'..');
const {chromium}=require(process.env.PLAYWRIGHT_PATH || path.join(project,'.codex-backups/metrika-network-check/node_modules/playwright'));
(async()=>{
  const root=fs.mkdtempSync(path.join(project,'.admin-state-test-ui-'));
  let browser,app;
  try {
    const original=JSON.parse(fs.readFileSync(path.join(project,'menu.json'),'utf8'));
    fs.writeFileSync(path.join(root,'menu.json'),JSON.stringify(original));fs.writeFileSync(path.join(root,'menu-data.js'),generateMenuScript(original));
    for(const file of ['index.html','script.js','style.css',...new Set(original.items.map(i=>i.image).filter(Boolean)),'assets/logo-chilli.png','assets/hero-cover-1.png','assets/hero-cover-2.png','assets/logo-pattern.webp']) {
      fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.copyFileSync(path.join(project,file),path.join(root,file));
    }
    let publication={state:'idle',message:'Тестовая публикация',busy:false};
    app=createAdminServer({root,publisher:{start:()=>{},status:()=>publication}});
    await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${app.server.address().port}`;
    browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
    const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url+'/#'+app.key);await page.locator('.product').first().waitFor();assert.equal(await page.locator('.product').count(),54);
    await page.locator('[name="pickupPrice"]').fill('333');await page.locator('#save').click();await page.getByText('Изменения сохранены на компьютере.',{exact:true}).waitFor();
    await page.reload();await page.locator('.product').first().waitFor();assert.equal(await page.locator('[name="pickupPrice"]').inputValue(),'333');
    await page.locator('#categories').click();await page.locator('#categoryName').fill('Проверка');await page.locator('#newCategory button').click();await page.locator('#closeCategories').click();
    await page.locator('#add').click();await page.locator('[name="name"]').fill('Тест "<название>"');await page.locator('[name="category"]').selectOption('Проверка');await page.locator('[name="pickupPrice"]').fill('123');await page.locator('[name="popular"]').check();
    await page.locator('#upload').setInputFiles(path.join(project,'assets/logo-chilli.png'));await page.getByText('Фотография добавлена. Сохраните изменения.',{exact:true}).waitFor();
    assert.ok(await page.locator('#photo').evaluate(image=>image.complete && image.naturalWidth>0));
    await page.locator('#save').click();await page.getByText('Изменения сохранены на компьютере.',{exact:true}).waitFor();
    const snapshot=loadMenu(root);assert.equal(snapshot.data.items.length,55);const added=snapshot.data.items.at(-1);assert.equal(added.name,'Тест "<название>"');assert.ok(added.image.startsWith('assets/upload-'));
    const preview=await browser.newPage({viewport:{width:430,height:932}});await preview.goto(url+'/preview/');await preview.locator('.menu-item').first().waitFor();assert.ok(await preview.locator('.menu-item h3').allTextContents().then(names=>names.some(n=>n.includes('Тест "<название>"'))));
    await preview.getByRole('button',{name:'Проверка',exact:true}).click();assert.equal(await preview.locator('.menu-item').count(),1);
    await page.locator('[name="visible"]').uncheck();await page.locator('#save').click();await page.getByText('Изменения сохранены на компьютере.',{exact:true}).waitFor();await preview.reload();await preview.locator('.menu-item').first().waitFor();assert.equal(await preview.getByRole('button',{name:'Проверка',exact:true}).count(),0);
    const evidence=path.join(project,'.admin-state');fs.mkdirSync(evidence,{recursive:true});
    await page.screenshot({path:path.join(evidence,'admin-desktop.png'),fullPage:true});
    await page.setViewportSize({width:430,height:932});await page.screenshot({path:path.join(evidence,'admin-mobile.png'),fullPage:true});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    let polls=0;publication={state:'waiting',message:'Проверка версии',busy:true,revision:'older-version'};
    await page.route('**/api/publication',async route=>{polls++;if(polls===1)await route.abort();else await route.continue();});
    await page.reload();await page.locator('.product').first().waitFor();await page.waitForTimeout(3200);
    assert.ok(polls>=2,'Publication polling must recover after a transient network error');
    publication={state:'published',message:'Опубликовано на сайте',busy:false,revision:'older-version'};
    await page.waitForTimeout(2800);
    assert.ok((await page.locator('#notice').textContent()).includes('предыдущая версия'),'Published status must distinguish an older snapshot');
    const legacy=await browser.newPage();
    await legacy.route(url+'/preview/',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'index.html'),'utf8').replace('    <script src="menu-data.js"></script>\n','')}));
    await legacy.goto(url+'/preview/');await legacy.locator('.menu-item').first().waitFor({timeout:3000});
    assert.deepEqual(errors,[]);console.log('UI passed: price/reload, category, add, WebP upload, special text, preview, hide, desktop/mobile, polling recovery and snapshot status.');
  } finally {if(browser)await browser.close();if(app)await new Promise(resolve=>app.server.close(resolve));fs.rmSync(root,{recursive:true,force:true,maxRetries:10,retryDelay:100});}
})().catch(error=>{console.error(error);process.exitCode=1;});
