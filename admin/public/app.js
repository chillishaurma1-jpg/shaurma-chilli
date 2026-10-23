/* Local editor: all product text is rendered with DOM textContent/value. */
const $ = (selector) => document.querySelector(selector);
let key = location.hash.slice(1) || sessionStorage.getItem('chilli-session');
if(key) sessionStorage.setItem('chilli-session',key);
history.replaceState(null,'',location.pathname);
let data, revision, selectedId, dirty = false, busy = false, pollTimer;
async function menuHash() {
  const bytes=new TextEncoder().encode(JSON.stringify(data));
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
const form = $('#editor');
const fields = ['name','subtitle','category','pickupPrice','deliveryPrice','volume','visible','popular'];
const icons = () => window.lucide?.createIcons();
const icon = (name) => { const el = document.createElement('i'); el.dataset.lucide = name; return el; };
function notice(message,error = false) { $('#notice').textContent = message; $('#notice').classList.toggle('error',error); }
function markDirty() { dirty = true; $('#savedState').textContent = 'Есть несохраненные изменения'; }
function current() { return data?.items.find(item=>item.id===selectedId); }
function button(symbol,title,action) {
  const el = document.createElement('button'); el.type='button'; el.className='icon'; el.title=title; el.setAttribute('aria-label',title); el.append(icon(symbol)); el.onclick=action; return el;
}
async function api(url,options = {}) {
  const response = await fetch('/api/'+url,{...options,headers:{'x-chilli-key':key,'content-type':'application/json',...options.headers}});
  const result = await response.json();
  if(!response.ok) throw new Error(result.error || 'Не удалось выполнить действие.');
  return result;
}
function options(select, values, first) {
  const value = select.value; select.replaceChildren();
  if(first) select.add(new Option(first,''));
  values.forEach(v=>select.add(new Option(v,v))); select.value=value;
}
function renderCategories() {
  options($('#filter'),data.categories,'Все категории');
  options(form.elements.category,data.categories);
}
function renderList() {
  const query = $('#search').value.toLocaleLowerCase('ru').trim(); const category = $('#filter').value;
  const items = data.items.filter(i=>(!category || i.category===category) && [i.name,i.subtitle,i.category].join(' ').toLocaleLowerCase('ru').includes(query));
  $('#count').textContent = `${items.length} из ${data.items.length}`;
  const list = $('#products'); list.replaceChildren();
  items.forEach(item=>{
    const el = document.createElement('button'); el.type='button'; el.className='product'; el.setAttribute('aria-current',String(item.id===selectedId));
    const thumb = document.createElement(item.image ? 'img':'div'); thumb.className='thumb';
    if(item.image) { thumb.src='/preview/'+item.image; thumb.alt=''; thumb.loading='lazy'; }
    const text = document.createElement('span'); text.className='product-text';
    const name = document.createElement('strong'); name.textContent = item.name || 'Новый товар';
    const sub = document.createElement('small'); sub.textContent = [item.subtitle,item.category,!item.visible?'Скрыт':''].filter(Boolean).join(' · '); if(!item.visible) sub.className='hidden-label';
    text.append(name,sub); const price = document.createElement('span'); price.className='product-price'; price.textContent = Number.isFinite(item.pickupPrice) ? `${item.pickupPrice} ₽`:'';
    el.append(thumb,text,price); el.onclick=()=>{selectedId=item.id;renderEditor();renderList();}; list.append(el);
  });
  if(!items.length) { const empty=document.createElement('div');empty.className='empty-list';empty.textContent='Товары не найдены';list.append(empty); }
}
function renderPhoto() {
  const item=current(); $('#photo').hidden=!item?.image; $('#noPhoto').hidden=!!item?.image;
  if(item?.image) $('#photo').src='/preview/'+item.image; else $('#photo').removeAttribute('src');
  $('#removePhoto').disabled=!item?.image;
}
function renderEditor() {
  const item = current(); form.hidden=!item; $('#empty').hidden=!!item;
  if(!item) return;
  $('#heading').textContent=item.name || 'Новый товар';
  fields.forEach(name=>{const el=form.elements[name]; el.classList.remove('field-error'); if(el.type==='checkbox') el.checked=item[name]; else el.value=item[name] ?? '';});
  $('#volumeField').hidden=!['Напитки','Соусы'].includes(item.category);
  const index=data.items.indexOf(item); $('#up').disabled=index===0; $('#down').disabled=index===data.items.length-1;
  renderPhoto();
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('input',event=>{
  const item=current(); const el=event.target; const name=el.name;
  if(!item || !fields.includes(name)) return;
  item[name]=el.type==='checkbox' ? el.checked : el.type==='number' ? (el.value==='' ? (name==='deliveryPrice'?null:NaN) : el.valueAsNumber) : el.value;
  el.classList.toggle('field-error',!el.checkValidity()); markDirty();
  $('#heading').textContent=item.name || 'Новый товар'; $('#volumeField').hidden=!['Напитки','Соусы'].includes(item.category); renderList();
});
$('#search').oninput=renderList; $('#filter').onchange=renderList;
$('#add').onclick=()=>{
  if(!data.categories.length) data.categories.push('Прочее');
  const category=$('#filter').value || data.categories[0];
  const item={id:crypto.randomUUID(),name:'Новый товар',subtitle:'',volume:'',category,pickupPrice:0,deliveryPrice:null,image:'',visible:true,popular:false};
  data.items.push(item);selectedId=item.id;$('#search').value='';renderCategories();markDirty();renderList();renderEditor();form.elements.name.focus();form.elements.name.select();
};
$('#delete').onclick=()=>{
  const item=current(); if(!item || !confirm(`Удалить товар «${item.name}»?`)) return;
  const index=data.items.indexOf(item);data.items.splice(index,1);selectedId=data.items[Math.min(index,data.items.length-1)]?.id;markDirty();renderList();renderEditor();
};
function moveItem(delta) {
  const item=current();const index=data.items.indexOf(item);const target=index+delta;
  if(!item || target<0 || target>=data.items.length) return;
  [data.items[index],data.items[target]]=[data.items[target],data.items[index]];markDirty();renderList();renderEditor();
}
$('#up').onclick=()=>moveItem(-1);$('#down').onclick=()=>moveItem(1);
$('#removePhoto').onclick=()=>{current().image='';markDirty();renderPhoto();renderList();};
$('#upload').onchange=async event=>{
  const file=event.target.files[0]; const item=current(); event.target.value='';if(!file || !item) return;
  try {
    if(!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>20000000) throw new Error('Выберите PNG, JPEG или WebP размером до 20 МБ.');
    setBusy(true);notice('Подготовка фотографии…');
    const bitmap=await createImageBitmap(file);
    if(bitmap.width*bitmap.height>40000000) {bitmap.close();throw new Error('Слишком большое разрешение фотографии.');}
    const scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.88));
    if(!blob || blob.type!=='image/webp' || blob.size>2000000) throw new Error('Не удалось подготовить фото. Выберите другое изображение.');
    const uploaded=await api('images',{method:'POST',headers:{'content-type':'image/webp'},body:blob});
    item.image=uploaded.image;markDirty();renderPhoto();renderList();notice('Фотография добавлена. Сохраните изменения.');
  } catch(error) {notice(error.message,true);} finally {setBusy(false);}
};
function renderCategoryDialog() {
  const list=$('#categoryList');list.replaceChildren();
  data.categories.forEach((category,index)=>{
    const row=document.createElement('div');row.className='category-row';
    const input=document.createElement('input');input.value=category;input.maxLength=80;input.setAttribute('aria-label',`Название категории ${category}`);
    input.onchange=()=>{const name=input.value.trim();if(!name || (name!==category && data.categories.includes(name))) {input.value=category;notice('Название категории не должно быть пустым или повторяться.',true);return;}
      data.categories[index]=name;data.items.forEach(item=>{if(item.category===category)item.category=name;});
      if($('#filter').value===category)$('#filter').value=''; markDirty();renderCategories();renderEditor();renderList();renderCategoryDialog();
    };
    const move=delta=>{const target=index+delta;if(target<0 || target>=data.categories.length)return;[data.categories[index],data.categories[target]]=[data.categories[target],data.categories[index]];markDirty();renderCategories();renderEditor();renderList();renderCategoryDialog();};
    const up=button('arrow-up','Категория выше',()=>move(-1));up.disabled=index===0;
    const down=button('arrow-down','Категория ниже',()=>move(1));down.disabled=index===data.categories.length-1;
    const remove=button('trash-2','Удалить пустую категорию',()=>{data.categories.splice(index,1);markDirty();renderCategories();renderEditor();renderList();renderCategoryDialog();});
    remove.disabled=data.items.some(item=>item.category===category);
    row.append(input,up,down,remove);list.append(row);
  });icons();
}
$('#categories').onclick=()=>{renderCategoryDialog();$('#categoryDialog').showModal();};
$('#closeCategories').onclick=()=>$('#categoryDialog').close();
$('#newCategory').onsubmit=event=>{event.preventDefault();const name=$('#categoryName').value.trim();if(!name || data.categories.includes(name)){notice('Такая категория уже существует или название пустое.',true);return;}data.categories.push(name);$('#categoryName').value='';markDirty();renderCategories();renderEditor();renderList();renderCategoryDialog();};
function invalidItem() {
  return data.items.find(item=>!item.name.trim() || !data.categories.includes(item.category) || !Number.isFinite(item.pickupPrice) || item.pickupPrice<0 || item.pickupPrice>1000000 || (item.deliveryPrice!==null && (!Number.isFinite(item.deliveryPrice) || item.deliveryPrice<0 || item.deliveryPrice>1000000)));
}
function setBusy(value) {busy=value;$('.workspace').inert=value;$('#save').disabled=value;$('#publish').disabled=value;}
async function save(publish=false) {
  if(busy) return;
  const invalid=invalidItem();
  if(invalid) {selectedId=invalid.id;renderEditor();renderList();form.reportValidity();notice('Проверьте название, категорию и цены выделенного товара.',true);return;}
  setBusy(true);notice(publish?'Сохранение и подготовка публикации…':'Сохранение…');
  try {
    const result=await api(publish?'publish':'menu',{method:publish?'POST':'PUT',body:JSON.stringify({data,revision})});
    data=result.data;revision=result.revision;dirty=false;$('#savedState').textContent='Сохранено на компьютере';renderCategories();renderEditor();renderList();
    notice(publish?'Меню сохранено. Проверяется публикация.':'Изменения сохранены на компьютере.');
    if(publish) pollPublication();
  } catch(error) {notice(error.message,true);} finally {setBusy(false);}
}
$('#save').onclick=()=>save();$('#publish').onclick=()=>save(true);
$('#preview').onclick=event=>{if(dirty && !confirm('Есть несохраненные изменения. Открыть последнюю сохраненную версию?'))event.preventDefault();};
async function pollPublication() {
  clearTimeout(pollTimer);
  try {
    const result=await api('publication');$('#publication').textContent=result.message || 'Публикаций пока нет';
    const active=result.busy;$('#publish').disabled=busy || active;
    if(result.state==='published') {
      if(!dirty && result.menuHash===await menuHash())notice('Меню опубликовано на сайте.');
      else {notice('На сайте опубликована предыдущая версия. Текущие изменения еще не опубликованы.');$('#publication').textContent+=' · есть новые локальные изменения';}
    }
    if(result.state==='failed')notice(result.message,true);
    if(active)pollTimer=setTimeout(pollPublication,2500);
  } catch(error) {notice('Не удалось проверить публикацию. Повторяем проверку…',true);$('#publish').disabled=busy;pollTimer=setTimeout(pollPublication,2500);}
}
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
(async()=>{
  icons();
  try {if(!key)throw new Error('Откройте панель двойным щелчком по файлу «Управление меню.cmd».');const result=await api('menu');data=result.data;revision=result.revision;selectedId=data.items[0]?.id;renderCategories();renderList();renderEditor();$('#savedState').textContent='Сохранено на компьютере';pollPublication();}
  catch(error){notice(error.message,true);$('.workspace').inert=true;$('#save').disabled=true;$('#publish').disabled=true;}
})();
