const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredFiles = [
  "index.html",
  "style.css",
  "script.js",
  "assets/logo-chilli.png",
  "assets/hero-cover-1.png",
  "assets/hero-cover-2.png",
  "assets/logo-pattern.webp",
  "assets/icons/vk.svg",
  "assets/icons/telegram.svg",
  "assets/icons/instagram.svg",
  "assets/icons/whatsapp.svg",
  "assets/menu-shaurma-big-card.webp",
  "assets/menu-shaurma-mini-cheese-card.webp",
  "assets/menu-jalapeno-card.webp",
  "assets/menu-dobry-cola-1l-card.webp",
  "assets/menu-dobry-cola-05-card.webp",
  "assets/menu-flash-energy-card.webp",
  "assets/menu-tea-card.webp",
  "assets/review-zapadny-45.webp",
  "assets/review-krasnyh-1.webp",
  "assets/review-nevkipelogo-1.webp",
  "assets/review-nevkipelogo-2.webp",
  "ya/index.html",
  "2g/index.html",
  "qr/index.html",
  "in/index.html",
  "vk/index.html",
  "tg/index.html",
  "wa/index.html",
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing ${file}`);
}

const html = read("index.html");
const css = read("style.css");
const js = read("script.js");
const menu = JSON.parse(read("menu.json"));
assert(html.indexOf('src="menu-data.js"') < html.indexOf('src="script.js"'), "Menu data must load before site code");
assert(read("menu-data.js") === require("../admin/menu-store.cjs").generateMenuScript(menu), "Generated menu must match JSON");
require("../admin/menu-store.cjs").validateMenu(menu, root);

const redirectTargets = {
  "ya/index.html": "utm_source=yandex_maps&utm_medium=maps&utm_campaign=profile_link",
  "2g/index.html": "utm_source=2gis&utm_medium=maps&utm_campaign=profile_link",
  "qr/index.html": "utm_source=qr_bottle&utm_medium=offline&utm_campaign=bottle_qr",
  "in/index.html": "utm_source=instagram&utm_medium=social&utm_campaign=profile_link",
  "vk/index.html": "utm_source=vk&utm_medium=social&utm_campaign=profile_link",
  "tg/index.html": "utm_source=telegram&utm_medium=social&utm_campaign=profile_link",
  "wa/index.html": "utm_source=whatsapp&utm_medium=messenger&utm_campaign=profile_link",
};

for (const [file, target] of Object.entries(redirectTargets)) {
  const redirectHtml = read(file);
  assert(redirectHtml.includes(target), `${file} should redirect to ${target}`);
  assert(redirectHtml.includes("window.location.replace"), `${file} should use a JS redirect`);
  assert(redirectHtml.includes("http-equiv=\"refresh\""), `${file} should include a meta refresh fallback`);
  assert(redirectHtml.includes("name=\"robots\" content=\"noindex\""), `${file} should not be indexed`);
}

assert(html.includes("Шаурма Chilli"), "HTML should mention brand");
assert(html.includes("<!-- Yandex.Metrika counter -->"), "Metrika placeholder missing");
assert(html.includes("110630017"), "Yandex Metrika counter id missing");
assert(html.includes("mc.yandex.ru/metrika/tag.js?id=110630017"), "Yandex Metrika script missing");
assert(html.includes("mc.yandex.ru/watch/110630017"), "Yandex Metrika noscript pixel missing");
assert(html.includes("id=\"menu\""), "Menu section missing");
assert(html.includes("id=\"reviews\""), "Reviews placeholder section missing");
assert(html.includes("id=\"map\""), "Map section missing");
assert(!html.includes("Горячий стрит-фуд"), "Hero street-food title should be removed");
assert(html.includes("assets/hero-cover-1.png"), "Hero should use the first cover image");
assert(html.includes("hero-overlay"), "Hero text and order block should overlay the image");
assert(html.includes("data-hero-carousel"), "Hero cover should support swipe carousel");
assert(html.includes("data-hero-image"), "Hero carousel image should be addressable from JS");
assert(html.includes("data-hero-dots"), "Hero carousel should render visual slide dots");
assert(html.includes("data-hero-direction"), "Hero carousel should include subtle side arrows");
assert(!html.includes("data-menu-scroll"), "Menu category side arrows should be removed");
assert(!html.includes("order-title"), "Order panel should not use a separate title");
assert(html.includes("в Яндекс Еде"), "Delivery button should mention Yandex Food without extra wording");
assert(html.includes("data-category=\"popular\""), "Popular menu filter should be first and available");
assert(html.includes("ближайшая точка"), "Pickup helper text should be short enough for mobile buttons");
assert(!html.includes("найти ближайшую точку"), "Pickup helper text should not use the long old wording");
assert(!html.includes("Краснодар · вкусно рядом"), "Old hero eyebrow should be removed");
assert(!html.includes("Доставка через Яндекс Еду или самовывоз"), "Old hero lead should be removed");
assert(!html.includes("Открыть точки в 2ГИС"), "2GIS button should be removed from map block");
assert(html.includes("Отзывы гостей"), "Reviews heading should be updated");
assert(html.includes("reviews-carousel"), "Reviews should render as a carousel area");
assert(html.includes("review-zapadny-45.webp"), "Reviews carousel should use real review screenshots");
assert(html.includes("data-review-direction"), "Reviews carousel should include arrow controls");
assert(html.includes("data-reviews-frame"), "Reviews carousel should have a swipe frame");
assert(!html.includes("review-controls"), "Reviews should not use detached bottom arrow controls");
assert(html.includes("id=\"menuPhotoModal\""), "Menu photo modal should be present");
assert(html.includes("data-menu-modal-close"), "Menu photo modal should have a close control");
assert(html.includes("dg-widget-link"), "2GIS embedded map link should be present");
assert(html.includes("DGWidgetLoader"), "2GIS embedded map script should be present");
assert(html.includes("data-goal=\"click_map_2gis\""), "2GIS map link should have a Metrika goal");
assert(html.includes("Чили в соцсетях"), "Social heading should be shortened");
assert(html.includes("Соцсети не принимают заказы еды"), "Social ordering note missing");
assert(!html.includes("WhatsApp не принимает заказы еды"), "Old WhatsApp-only ordering note should be removed");
assert(html.includes("Почему Chilli"), "Why section heading should be updated");
assert(html.includes("Мы рядом, когда город стоит"), "Campaign heading missing");

assert(js.includes("eda.yandex.ru/r/saurma_chilli"), "Yandex Food direct link missing");
assert(js.includes("2gis.ru/krasnodar/branches/70000001055983784"), "2GIS direct link missing");
assert(js.includes("vk.com/shaurma_chilli"), "VK direct link missing");
assert(js.includes("t.me/Shaurma_Chilli"), "Telegram direct link missing");
assert(js.includes("instagram.com/shaurma_chilli"), "Instagram direct link missing");
assert(js.includes("wa.me/79604856060"), "WhatsApp direct link missing");
assert(!js.includes("l.instagram.com"), "Instagram redirect wrapper should not be used");
assert(!js.includes("const DEFAULT_IMAGE"), "Missing menu photos should not reuse a default food image");
assert(js.includes("menu-photo-placeholder"), "Menu items without photos should render placeholders");
assert(menu.items.every(i => typeof i.subtitle === "string"), "Menu items should support small subtitle text");
assert(menu.items.every(i => typeof i.volume === "string"), "Menu items should support volume text");
assert(js.includes("formatDishSubtitle"), "Menu subtitles should be rendered separately");
assert(!js.includes("DRINK_VOLUMES"), "Drink volumes should come from menu item data");
assert(!js.includes("SAUCE_VOLUMES"), "Sauce volumes should come from menu item data");
assert(js.includes("(добавка)"), "Add-ons should be marked in dish titles");
assert(menu.items.some(i => i.image === "assets/menu-dobry-cola-1l-card.webp"), "Dobry Cola 1l should use the optimized card image");
assert(menu.items.some(i => i.image === "assets/menu-tea-card.webp"), "Tea menu item should use the optimized tea photo");
assert(!js.includes("assets/menu-dobry-cola-1l.png"), "Menu cards should not use heavy PNG images");
assert(js.includes("preloadMenuImages"), "Menu images should be preloaded for faster category switching");
assert(js.includes("scheduleMenuImageWarmup"), "Menu images should warm up in the background");
assert(js.includes("fetchpriority"), "Visible menu images should get higher load priority");
assert(js.includes("decoding=\"async\""), "Menu images should decode asynchronously");
assert(js.includes("const HERO_IMAGES"), "Hero carousel should use configured images");
assert(js.includes("HERO_AUTOPLAY_DELAY = 5000"), "Hero carousel should auto-switch every 5 seconds");
assert(js.includes("assets/hero-cover-1.png"), "Hero carousel should use cover images instead of menu dishes");
assert(!js.includes("...new Set(MENU.map((item) => item.image).filter(Boolean))"), "Hero carousel should not reuse all menu dish photos");
assert(js.includes("bindHeroCarousel"), "Hero swipe carousel should be wired in JS");
assert(js.includes("startAutoplay"), "Hero carousel autoplay should be wired in JS");
assert(!js.includes("bindMenuToolbarControls"), "Menu category arrow controls should be removed from JS");
assert(!js.includes("data-menu-scroll"), "Menu category arrow data attributes should be removed from JS");
assert(js.includes("closest(\".hero-grid\")"), "Hero carousel should listen on the full hero area above the overlay");
assert(js.includes("pointerdown"), "Hero carousel should listen for swipe start");
assert(js.includes("pointerup"), "Hero carousel should listen for swipe end");
assert(js.includes("touchstart"), "Hero carousel should listen for mobile touch start");
assert(js.includes("touchend"), "Hero carousel should listen for mobile touch end");
assert(js.includes("const POPULAR_ITEMS"), "Popular menu items should be configured explicitly");
assert(js.includes("renderMenu(\"popular\")"), "Popular menu should render by default");
assert(!js.includes("Шаурма Мини В сырном лаваше 350 гр"), "Dish weights should not be part of visible labels");
assert(!js.includes("Перец Халапеньо 20 гр"), "Add-on weights should not be part of visible labels");
assert(js.includes("bindReviewControls"), "Reviews carousel controls should be wired in JS");
assert(js.includes("data-reviews-frame"), "Reviews swipe should be attached to the reviews frame");
assert(js.includes("updateCarouselHeight"), "Reviews carousel height should follow the active screenshot");
assert(js.includes("activeReviewIndex"), "Reviews carousel should keep an active slide index");
assert(js.includes("review-slide-clone"), "Reviews carousel should use cloned edge slides for seamless looping");
assert(js.includes("transitionend"), "Reviews carousel should reset from clones after animation");
assert(js.includes("translateX"), "Reviews carousel should animate as a transform track");
assert(!js.includes("isEdgeJump ? \"auto\" : \"smooth\""), "Reviews carousel edge loop should animate instead of jumping");
assert(js.includes("bindMenuPhotoModal"), "Menu photos should open in a modal");
assert(js.includes("METRIKA_COUNTER_ID = 110630017"), "Metrika counter id should be configured in JS");
assert(js.includes("reachGoal"), "Metrika click goals should be sent via reachGoal");
assert(js.includes("click_delivery_top"), "Top delivery button goal missing");
assert(js.includes("click_pickup_top"), "Top pickup button goal missing");
assert(js.includes("click_menu_delivery"), "Menu delivery price goal missing");
assert(js.includes("click_menu_pickup"), "Menu pickup price goal missing");
assert(js.includes("click_vk"), "VK click goal missing");
assert(js.includes("click_telegram"), "Telegram click goal missing");
assert(js.includes("click_instagram"), "Instagram click goal missing");
assert(js.includes("click_whatsapp"), "WhatsApp click goal missing");
assert(js.includes("data-menu-photo"), "Menu item images should expose modal image data");
assert(js.includes("data-dish"), "Menu price goals should include dish names");
assert(js.includes("data-link=\"pickup\""), "Pickup prices should link to the pickup map");
assert(js.includes("data-link=\"delivery\""), "Delivery prices should link to Yandex Food");
assert(js.includes("dish-badge"), "Popular dishes should get visual badges");

assert(menu.items.length > 0, "Menu must contain products");
assert(js.includes("item.category === \"Напитки\" || item.category === \"Соусы\""), "Only drinks and sauces should display volume");
assert(menu.categories.includes("Напитки"), "Drinks category missing");
assert(menu.categories.includes("Добавки"), "Add-ons category missing");
assert(menu.categories.includes("Соусы"), "Sauces category missing");

assert(css.includes("#f8b712"), "Brand orange missing in CSS");
assert(css.includes("#1d1d1e"), "Dark background missing in CSS");
assert(css.includes("@media"), "Responsive CSS missing");
assert(css.includes("--site-width: 430px"), "Site should be locked to a mobile-first shell");
assert(css.includes("width: calc(100% - 16px)"), "Main content should use wider mobile gutters");
assert(css.includes(".map-widget"), "2GIS widget should have a responsive wrapper");
assert(css.includes("aspect-ratio: 1 / 1"), "2GIS map should use a square frame");
assert(css.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "Social links should render two per row");
assert(css.includes(".quick-links a"), "Social links should have horizontal button layout");
assert(css.includes("font-size: 0.76rem"), "Menu note should fit on one mobile line");
assert(css.includes("font-size: 0.82rem"), "WhatsApp note should be compact");
assert(css.includes("white-space: nowrap"), "Key mobile headings should stay on one line");
assert(css.includes("#map-title"), "Map title should have a specific mobile fit rule");
assert(css.includes("#campaign-title"), "Campaign title should have a specific mobile fit rule");
assert(css.includes(".menu-item h3"), "Dish titles should have mobile fit rules");
assert(css.includes(".dish-subtitle"), "Dish subtitles should have mobile fit rules");
assert(css.includes("font-size: 0.98rem"), "Dish title font should be reduced to fit one line");
assert(css.includes(".campaign {"), "Campaign block styles missing");
assert(css.includes("padding-inline: 18px"), "Campaign block should have inner side padding");
assert(css.includes("object-fit: cover"), "Hero carousel images should fill the stable cover frame");
assert(css.includes("aspect-ratio: 4 / 3"), "Hero cover should keep the original 4:3 aspect ratio");
assert(css.includes(".hero-dots"), "Hero carousel dots styling missing");
assert(css.includes(".hero-visual img.is-changing"), "Hero carousel should have a smooth image-change state");
assert(css.includes(".side-nav"), "Shared subtle side arrow styling missing");
assert(!css.includes(".menu-toolbar-frame"), "Menu category arrow frame styling should be removed");
assert(!css.includes(".menu-nav"), "Menu category side arrow styling should be removed");
assert(css.includes("scroll-behavior: smooth"), "Menu category toolbar should scroll smoothly");
assert(css.includes("cursor: grab"), "Hero carousel should signal desktop drag support");
assert(css.includes("touch-action: pan-y"), "Swipe areas should preserve vertical page scrolling");
assert(css.includes("text-shadow: 0 1px 5px"), "Order button text should have readable text shadow");
assert(css.includes("scrollbar-color"), "Dark scrollbar styling missing");
assert(css.includes(".social-icon"), "Social icons styling missing");
assert(css.includes(".review-slide"), "Review carousel slide styling missing");
assert(css.includes(".review-nav {\n  top: 74px;\n  bottom: auto;"), "Review carousel arrows should keep a fixed top position independent of review height");
assert(css.includes("scrollbar-width: none"), "Review carousel should hide the native scrollbar");
assert(css.includes("overflow: hidden"), "Review carousel should disable manual horizontal scrolling");
assert(css.includes("touch-action: pan-y"), "Review carousel should keep vertical touch scrolling only");
assert(css.includes("will-change: transform"), "Review carousel should optimize transform animation");
assert(css.includes("align-items: flex-start"), "Review slides should not stretch to the tallest screenshot");
assert(css.includes(".reviews-frame"), "Review swipe frame styling missing");
assert(css.includes("font-size: 1.3rem"), "Map title should be larger while staying on one line");
assert(css.includes(".menu-photo-modal"), "Menu photo modal styling missing");
assert(css.includes("backdrop-filter: blur"), "Menu photo modal should blur the page behind it");
assert(css.includes("--glass"), "Premium glass surface token missing");
assert(css.includes(".dish-badge"), "Dish badge styling missing");
assert(css.includes("linear-gradient(135deg, #ffd36a"), "Primary CTA should use a warmer premium gradient");
assert(css.includes("logo-pattern.webp"), "Logo pattern background missing");
assert(css.includes(".section-title-accent::before"), "Heading brush highlight missing");

console.log("Static site checks passed");
