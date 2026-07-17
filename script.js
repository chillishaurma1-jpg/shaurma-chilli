/*
  Р“РґРµ РјРµРЅСЏС‚СЊ РґР°РЅРЅС‹Рµ:
  1. РЎСЃС‹Р»РєРё РјРµРЅСЏСЋС‚СЃСЏ РІ РѕР±СЉРµРєС‚Рµ LINKS.
  2. РњРµРЅСЋ Рё С†РµРЅС‹ РјРµРЅСЏСЋС‚СЃСЏ РІ РјР°СЃСЃРёРІРµ MENU.
  3. Р¤РѕС‚Рѕ Р±Р»СЋРґ РјРµРЅСЏСЋС‚СЃСЏ РІ РїРѕР»Рµ image. Р¤Р°Р№Р»С‹ Р»РµР¶Р°С‚ РІ assets.
*/
const LINKS = {
  delivery: "https://eda.yandex.ru/r/saurma_chilli",
  pickup: "https://2gis.ru/krasnodar/branches/70000001055983784",
  vk: "https://vk.com/shaurma_chilli",
  telegram: "https://t.me/Shaurma_Chilli",
  instagram: "https://www.instagram.com/shaurma_chilli/",
  whatsapp: "https://wa.me/79604856060",
  phone: "tel:+79604856060",
};

const METRIKA_COUNTER_ID = 110630017;

const LINK_GOALS = {
  vk: "click_vk",
  telegram: "click_telegram",
  instagram: "click_instagram",
  whatsapp: "click_whatsapp",
};

const MENU = [
  { name: "Шаурма Большая", subtitle: "", category: "Шаурма", pickupPrice: 290, deliveryPrice: 450, image: "assets/menu-shaurma-big-card.webp" },
  { name: "Шаурма Мини", subtitle: "", category: "Шаурма", pickupPrice: 240, deliveryPrice: 370, image: "assets/menu-shaurma-mini-card.webp" },
  { name: "Шаурма Большая", subtitle: "В сырном лаваше", category: "Шаурма", pickupPrice: 300, deliveryPrice: 465, image: "assets/menu-shaurma-big-cheese-card.webp" },
  { name: "Шаурма Мини", subtitle: "В сырном лаваше", category: "Шаурма", pickupPrice: 250, deliveryPrice: 385, image: "assets/menu-shaurma-mini-cheese-card.webp" },
  { name: "Донар", subtitle: "", category: "Донар", pickupPrice: 320, deliveryPrice: 495, image: "assets/menu-donar-card.webp" },
  { name: "Донар", subtitle: "на Тарелке", category: "Донар", pickupPrice: 350, deliveryPrice: 540, image: "assets/menu-donar-plate-card.webp" },
  { name: "Гирос", subtitle: "Фирменный", category: "Прочее", pickupPrice: 320, deliveryPrice: 495, image: "assets/menu-gyros-card.webp" },
  { name: "Фахитос", subtitle: "", category: "Прочее", pickupPrice: 320, deliveryPrice: 495, image: "assets/menu-fajitos-card.webp" },
  { name: "Хот-Дог", subtitle: "", category: "Прочее", pickupPrice: 240, deliveryPrice: 370, image: "assets/menu-hot-dog-card.webp" },
  { name: "Скепасти", subtitle: "", category: "Прочее", pickupPrice: 400, deliveryPrice: 620, image: "assets/menu-skepasti-card.webp" },
  { name: "Сендвич", subtitle: "", category: "Прочее", pickupPrice: 320, deliveryPrice: 495, image: "assets/menu-sandwich-card.webp" },
  { name: "Картошка Фри", subtitle: "", category: "Закуски", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-fries-card.webp" },
  { name: "Нагетсы", subtitle: "", category: "Закуски", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-nuggets-card.webp" },
  { name: "Сыр", subtitle: "Слайс", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-cheese-card.webp" },
  { name: "Лук", subtitle: "Маринованный", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-onion-card.webp" },
  { name: "Огурец", subtitle: "Солёный", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-pickle-card.webp" },
  { name: "Перец", subtitle: "Халапеньо", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-jalapeno-card.webp" },
  { name: "Грибы", subtitle: "Шампиньоны", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-mushrooms-card.webp" },
  { name: "Мясо", subtitle: "Филе куриное", category: "Добавки", pickupPrice: 100, deliveryPrice: 150, image: "assets/menu-meat-card.webp" },
  { name: "Кетчуп", subtitle: "", category: "Соусы", pickupPrice: 50, deliveryPrice: 65, image: "assets/menu-ketchup-card.webp" },
  { name: "Сырный соус", subtitle: "", category: "Соусы", pickupPrice: 50, deliveryPrice: 65, image: "assets/menu-cheese-sauce-card.webp" },
  { name: "Чесночный соус", subtitle: "", category: "Соусы", pickupPrice: 50, deliveryPrice: 65, image: "assets/menu-garlic-sauce-card.webp" },
  { name: "Кофе", subtitle: "", category: "Напитки", pickupPrice: 50, deliveryPrice: null, image: "assets/menu-coffee-card.webp" },
  { name: "Чай", subtitle: "", category: "Напитки", pickupPrice: 50, deliveryPrice: null, image: "assets/menu-tea-card.webp" },
  { name: "Компот Чили", subtitle: "Ягоды", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-compot-berries-card.webp" },
  { name: "Компот Чили", subtitle: "Сухофрукты", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-compot-dried-fruits-card.webp" },
  { name: "Тан Чили", subtitle: "Домашний", category: "Напитки", pickupPrice: 110, deliveryPrice: 170, image: "assets/menu-tan-card.webp" },
  { name: "Добрый Кола", subtitle: "", category: "Напитки", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-dobry-cola-1l-card.webp" },
  { name: "Добрый Кола", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-cola-05-card.webp" },
  { name: "Добрый Кола", subtitle: "", category: "Напитки", pickupPrice: 80, deliveryPrice: 125, image: "assets/menu-dobry-cola-033-card.webp" },
  { name: "Добрый Кола Б/С", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-cola-zero-05-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", category: "Напитки", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-dobry-orange-1l-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-orange-05-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", category: "Напитки", pickupPrice: 80, deliveryPrice: 125, image: "assets/menu-dobry-orange-033-card.webp" },
  { name: "Лео Груша", subtitle: "", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-pear-card.webp" },
  { name: "Лео Лимон", subtitle: "", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-lemon-card.webp" },
  { name: "Лео Тархун", subtitle: "", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-tarhun-card.webp" },
  { name: "Натахтари Тархун", subtitle: "", category: "Напитки", pickupPrice: 120, deliveryPrice: 185, image: "assets/menu-natakhtari-tarhun-card.webp" },
  { name: "Натахтари Фейхоа", subtitle: "", category: "Напитки", pickupPrice: 120, deliveryPrice: 185, image: "assets/menu-natakhtari-feijoa-card.webp" },
  { name: "Палпи Апельсин", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-pulpy-orange-card.webp" },
  { name: "Палпи Тропик", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-pulpy-tropic-card.webp" },
  { name: "Сок Добрый", subtitle: "Апельсин", category: "Напитки", pickupPrice: 80, deliveryPrice: 125, image: "assets/menu-juice-orange-card.webp" },
  { name: "Сок Добрый", subtitle: "Томат", category: "Напитки", pickupPrice: 80, deliveryPrice: 125, image: "assets/menu-juice-tomato-card.webp" },
  { name: "Сок Добрый", subtitle: "Яблоко", category: "Напитки", pickupPrice: 80, deliveryPrice: 125, image: "assets/menu-juice-apple-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "Малина", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-raspberry-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "Манго", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-mango-card.webp" },
  { name: "Чай Рич Чёрный", subtitle: "Лимон", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-black-lemon-card.webp" },
  { name: "Чай Рич Чёрный", subtitle: "Персик", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-black-peach-card.webp" },
  { name: "Вода", subtitle: "без газа", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-water-still-05-card.webp" },
  { name: "Адреналин Раш", subtitle: "", category: "Напитки", pickupPrice: 150, deliveryPrice: null, image: "assets/menu-adrenaline-rush-card.webp" },
  { name: "Бёрн Энерджи", subtitle: "", category: "Напитки", pickupPrice: 150, deliveryPrice: null, image: "assets/menu-burn-energy-card.webp" },
  { name: "Флеш Энерджи", subtitle: "", category: "Напитки", pickupPrice: 100, deliveryPrice: null, image: "assets/menu-flash-energy-card.webp" },
  { name: "Флеш Энерджи", subtitle: "Ультра", category: "Напитки", pickupPrice: 100, deliveryPrice: null, image: "assets/menu-flash-energy-ultra-card.webp" },
];
const DRINK_VOLUMES = new Map([
  ["Кофе||50", "0,2 л"],
  ["Чай||50", "0,2 л"],
  ["Компот Чили|Ягоды|90", "0,5 л"],
  ["Компот Чили|Сухофрукты|90", "0,5 л"],
  ["Тан Чили|Домашний|110", "0,5 л"],
  ["Добрый Кола||150", "1 л"],
  ["Добрый Кола||100", "0,5 л"],
  ["Добрый Кола||80", "0,33 л"],
  ["Добрый Кола Б/С||100", "0,5 л"],
  ["Добрый Апельсин||150", "1 л"],
  ["Добрый Апельсин||100", "0,5 л"],
  ["Добрый Апельсин||80", "0,33 л"],
  ["Лео Груша||90", "0,5 л"],
  ["Лео Лимон||90", "0,5 л"],
  ["Лео Тархун||90", "0,5 л"],
  ["Натахтари Тархун||120", "0,5 л"],
  ["Натахтари Фейхоа||120", "0,5 л"],
  ["Палпи Апельсин||100", "0,45 л"],
  ["Палпи Тропик||100", "0,45 л"],
  ["Сок Добрый|Апельсин|80", "0,3 л"],
  ["Сок Добрый|Томат|80", "0,3 л"],
  ["Сок Добрый|Яблоко|80", "0,3 л"],
  ["Чай Рич Зелёный||100", "0,5 л"],
  ["Чай Рич Зелёный|Малина|100", "0,5 л"],
  ["Чай Рич Зелёный|Манго|100", "0,5 л"],
  ["Чай Рич Чёрный|Лимон|100", "0,5 л"],
  ["Чай Рич Чёрный|Персик|100", "0,5 л"],
  ["Вода|без газа|100", "0,5 л"],
  ["Адреналин Раш||150", "0,45 л"],
  ["Бёрн Энерджи||150", "0,45 л"],
  ["Флеш Энерджи||100", "0,45 л"],
  ["Флеш Энерджи|Ультра|100", "0,45 л"],
]);

const SAUCE_VOLUMES = new Map([
  ["Кетчуп", "25 гр"],
  ["Сырный соус", "25 гр"],
  ["Чесночный соус", "25 гр"],
]);
const POPULAR_ITEMS = [
  "Шаурма Большая",
  "Шаурма Мини В сырном лаваше",
  "Донар",
  "Гирос Фирменный",
  "Хот-Дог",
  "Картошка Фри",
  "Перец Халапеньо",
  "Добрый Кола 0,5 л",
  "Добрый Апельсин 0,5 л",
  "Флеш Энерджи 0,45 л",
];

const HERO_IMAGES = [
  "assets/hero-cover-1.png",
  "assets/hero-cover-2.png",
];
const HERO_AUTOPLAY_DELAY = 5000;

function formatPrice(value) {
  return value === null ? "нет" : `${value} ₽`;
}

function getDishVolume(item) {
  if (item.category === "Соусы") return SAUCE_VOLUMES.get(item.name) || "";
  if (item.category !== "Напитки") return "";
  return DRINK_VOLUMES.get(`${item.name}|${item.subtitle}|${item.pickupPrice}`) || "";
}

function formatDishSubtitle(item) {
  const parts = [item.subtitle, getDishVolume(item)].filter(Boolean);
  if (parts.length === 0) return "";
  return parts.join(" · ").replace(/^./, (letter) => letter.toLowerCase());
}

function getDishLabel(item) {
  return [item.name, item.subtitle, getDishVolume(item)].filter(Boolean).join(" ");
}

function formatDishName(item) {
  const subtitle = formatDishSubtitle(item);
  const name = item.category === "Добавки" ? `${item.name} (добавка)` : item.name;
  return `${name}${subtitle ? `<span class="dish-subtitle">${subtitle}</span>` : ""}`;
}

function bindLinks() {
  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.dataset.link;
    if (LINKS[key]) {
      element.href = LINKS[key];
      if (!LINKS[key].startsWith("tel:")) {
        element.target = "_blank";
        element.rel = "noopener";
      }
    }
  });
}

function getMetrikaGoal(link) {
  if (link.dataset.goal) {
    return link.dataset.goal;
  }

  if (link.classList.contains("order-card")) {
    return link.dataset.link === "delivery" ? "click_delivery_top" : "click_pickup_top";
  }

  if (link.classList.contains("price")) {
    return link.dataset.link === "delivery" ? "click_menu_delivery" : "click_menu_pickup";
  }

  return LINK_GOALS[link.dataset.link] || null;
}

function trackMetrikaGoal(goal, params = {}) {
  if (!goal || typeof window.ym !== "function") return;
  window.ym(METRIKA_COUNTER_ID, "reachGoal", goal, params);
}

function bindAnalytics() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    trackMetrikaGoal(getMetrikaGoal(link), {
      href: link.href,
      label: link.innerText.trim().slice(0, 80),
      dish: link.dataset.dish || undefined,
    });
  });
}

function renderFilters() {
  const toolbar = document.querySelector(".menu-toolbar");
  const categories = [...new Set(MENU.map((item) => item.category))];

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "menu-filter";
    button.type = "button";
    button.dataset.category = category;
    button.textContent = category;
    toolbar.append(button);
  });
}

const preloadedMenuImages = new Set();

function preloadMenuImages(items) {
  items
    .map((item) => item.image)
    .filter(Boolean)
    .forEach((src) => {
      if (preloadedMenuImages.has(src)) return;
      preloadedMenuImages.add(src);
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
}

function scheduleMenuImageWarmup() {
  const warmup = () => preloadMenuImages(MENU);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmup, { timeout: 2500 });
  } else {
    window.setTimeout(warmup, 900);
  }
}

function renderMenu(category = "all") {
  const menuList = document.querySelector("#menuList");
  const items =
    category === "popular"
      ? MENU.filter((item) => POPULAR_ITEMS.includes(getDishLabel(item)))
      : category === "all"
        ? MENU
        : MENU.filter((item) => item.category === category);

  menuList.innerHTML = items
    .map(
      (item, index) => `
        <article class="menu-item">
          ${
            item.image
              ? `<button class="menu-photo-button" type="button" data-menu-photo="${item.image}" data-menu-photo-alt="${getDishLabel(item)}">
                  <img src="${item.image}" alt="${getDishLabel(item)}" loading="${index < 6 ? "eager" : "lazy"}" decoding="async" fetchpriority="${index < 2 ? "high" : "auto"}">
                </button>`
              : `<div class="menu-photo-placeholder" role="img" aria-label="Фото блюда пока не добавлено"><span>Фото скоро</span></div>`
          }
          <div class="menu-item-body">
            ${POPULAR_ITEMS.includes(getDishLabel(item)) ? `<span class="dish-badge">Хит</span>` : ""}
            <h3>${formatDishName(item)}</h3>
            <div class="price-row">
              <a class="price" data-link="pickup" data-dish="${getDishLabel(item)}" href="${LINKS.pickup}" target="_blank" rel="noopener">
                <small>Самовывоз</small>
                <strong>${formatPrice(item.pickupPrice)}</strong>
              </a>
              <a class="price" data-link="delivery" data-dish="${getDishLabel(item)}" href="${LINKS.delivery}" target="_blank" rel="noopener">
                <small>Яндекс Еда</small>
                <strong>${formatPrice(item.deliveryPrice)}</strong>
              </a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  preloadMenuImages(items);
}

function bindFilters() {
  document.querySelector(".menu-toolbar").addEventListener("click", (event) => {
    const button = event.target.closest(".menu-filter");
    if (!button) return;

    document.querySelectorAll(".menu-filter").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    renderMenu(button.dataset.category);
  });
}

function bindHeroCarousel() {
  const carousel = document.querySelector("[data-hero-carousel]");
  const swipeArea = carousel?.closest(".hero-grid") || carousel;
  const image = document.querySelector("[data-hero-image]");
  const dots = document.querySelector("[data-hero-dots]");
  const buttons = document.querySelectorAll("[data-hero-direction]");
  if (!carousel || !swipeArea || !image || HERO_IMAGES.length < 2) return;

  let activeHeroIndex = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerId = null;
  let autoplayTimer = null;
  let transitionTimer = null;

  if (dots) {
    dots.innerHTML = HERO_IMAGES.map((_, index) => `<span data-hero-dot="${index}"></span>`).join("");
  }

  const setHeroImage = (index, animate = true) => {
    activeHeroIndex = (index + HERO_IMAGES.length) % HERO_IMAGES.length;
    window.clearTimeout(transitionTimer);
    if (animate) {
      image.classList.add("is-changing");
      transitionTimer = window.setTimeout(() => {
        image.src = HERO_IMAGES[activeHeroIndex];
      }, 130);
    } else {
      image.src = HERO_IMAGES[activeHeroIndex];
      image.classList.remove("is-changing");
    }
    image.classList.remove("is-swiping");
    dots?.querySelectorAll("[data-hero-dot]").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeHeroIndex);
    });
  };

  const startAutoplay = () => {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = window.setTimeout(() => {
      showNextHero(1, false);
      startAutoplay();
    }, HERO_AUTOPLAY_DELAY);
  };

  const showNextHero = (direction, resetAutoplay = true) => {
    image.classList.add("is-swiping");
    setHeroImage(activeHeroIndex + direction);
    if (resetAutoplay) startAutoplay();
  };

  const startSwipe = (x, y) => {
    pointerStartX = x;
    pointerStartY = y;
  };

  const finishSwipe = (x, y) => {
    const deltaX = x - pointerStartX;
    const deltaY = y - pointerStartY;
    pointerId = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    showNextHero(deltaX < 0 ? 1 : -1);
  };

  image.addEventListener("load", () => {
    window.setTimeout(() => {
      image.classList.remove("is-changing");
    }, 30);
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showNextHero(Number(button.dataset.heroDirection));
    });
  });

  swipeArea.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button")) return;
    startSwipe(event.clientX, event.clientY);
    pointerId = event.pointerId;
  });

  swipeArea.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) return;
    finishSwipe(event.clientX, event.clientY);
  });

  swipeArea.addEventListener("pointercancel", () => {
    pointerId = null;
  });

  swipeArea.addEventListener("touchstart", (event) => {
    if (event.target.closest("a, button") || event.touches.length !== 1) return;
    startSwipe(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  swipeArea.addEventListener("touchend", (event) => {
    if (event.changedTouches.length !== 1) return;
    finishSwipe(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  }, { passive: true });

  setHeroImage(0, false);
  startAutoplay();
}

function bindReviewControls() {
  const carousel = document.querySelector(".reviews-carousel");
  const swipeArea = document.querySelector("[data-reviews-frame]") || carousel;
  const buttons = document.querySelectorAll("[data-review-direction]");
  const slides = [...document.querySelectorAll(".review-slide")];
  if (!carousel || !swipeArea || buttons.length === 0 || slides.length === 0) return;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  firstClone.classList.add("review-slide-clone");
  lastClone.classList.add("review-slide-clone");
  carousel.prepend(lastClone);
  carousel.append(firstClone);

  const trackSlides = [...carousel.querySelectorAll(".review-slide")];
  let activeReviewIndex = 1;
  let isAnimatingReview = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerId = null;

  const updateCarouselHeight = () => {
    const activeSlide = trackSlides[activeReviewIndex];
    if (activeSlide) {
      carousel.style.height = `${activeSlide.offsetHeight}px`;
    }
  };

  const setReviewPosition = (index, animate = true) => {
    activeReviewIndex = index;
    carousel.style.transition = animate ? "transform 260ms ease" : "none";
    carousel.style.transform = `translateX(${-activeReviewIndex * 100}%)`;
    updateCarouselHeight();
  };

  const showReview = (direction) => {
    if (isAnimatingReview) return;
    isAnimatingReview = true;
    setReviewPosition(activeReviewIndex + direction, true);
  };

  const startSwipe = (x, y) => {
    pointerStartX = x;
    pointerStartY = y;
  };

  const finishSwipe = (x, y) => {
    const deltaX = x - pointerStartX;
    const deltaY = y - pointerStartY;
    pointerId = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    showReview(deltaX < 0 ? 1 : -1);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showReview(Number(button.dataset.reviewDirection));
    });
  });

  carousel.addEventListener("transitionend", () => {
    isAnimatingReview = false;
    if (activeReviewIndex === 0) {
      setReviewPosition(slides.length, false);
    } else if (activeReviewIndex === trackSlides.length - 1) {
      setReviewPosition(1, false);
    }
  });

  swipeArea.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button")) return;
    startSwipe(event.clientX, event.clientY);
    pointerId = event.pointerId;
  });

  swipeArea.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) return;
    finishSwipe(event.clientX, event.clientY);
  });

  swipeArea.addEventListener("pointercancel", () => {
    pointerId = null;
  });

  swipeArea.addEventListener("touchstart", (event) => {
    if (event.target.closest("a, button") || event.touches.length !== 1) return;
    startSwipe(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  swipeArea.addEventListener("touchend", (event) => {
    if (event.changedTouches.length !== 1) return;
    finishSwipe(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  }, { passive: true });

  window.addEventListener("resize", () => setReviewPosition(activeReviewIndex, false));
  trackSlides.forEach((slide) => {
    const image = slide.querySelector("img");
    if (image && !image.complete) {
      image.addEventListener("load", updateCarouselHeight, { once: true });
    }
  });
  setReviewPosition(1, false);
}

function bindMenuPhotoModal() {
  const modal = document.querySelector("#menuPhotoModal");
  if (!modal) return;

  const modalImage = modal.querySelector("img");
  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
    modalImage.alt = "";
    document.body.classList.remove("menu-photo-modal-open");
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-menu-photo]");
    if (button) {
      modalImage.src = button.dataset.menuPhoto;
      modalImage.alt = button.dataset.menuPhotoAlt || "Р¤РѕС‚Рѕ Р±Р»СЋРґР°";
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-photo-modal-open");
      return;
    }

    if (event.target.closest("[data-menu-modal-close]") || event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
}

bindLinks();
bindAnalytics();
bindHeroCarousel();
renderFilters();
renderMenu("popular");
scheduleMenuImageWarmup();
bindFilters();
bindReviewControls();
bindMenuPhotoModal();



