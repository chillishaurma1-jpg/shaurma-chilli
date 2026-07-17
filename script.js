/*
  Где менять данные:
  1. Ссылки меняются в объекте LINKS.
  2. Меню и цены меняются в массиве MENU.
  3. Фото блюд меняются в поле image. Файлы лежат в assets.
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
  { name: "Шаурма Большая", subtitle: "", volume: "490 гр", category: "Шаурма", pickupPrice: 300, deliveryPrice: 465, image: "assets/menu-shaurma-big-card.webp" },
  { name: "Шаурма Мини", subtitle: "", volume: "350 гр", category: "Шаурма", pickupPrice: 250, deliveryPrice: 385, image: "assets/menu-shaurma-mini-card.webp" },
  { name: "Шаурма Большая", subtitle: "В сырном лаваше", volume: "490 гр", category: "Шаурма", pickupPrice: 310, deliveryPrice: 480, image: "assets/menu-shaurma-big-cheese-card.webp" },
  { name: "Шаурма Мини", subtitle: "В сырном лаваше", volume: "350 гр", category: "Шаурма", pickupPrice: 260, deliveryPrice: 400, image: "assets/menu-shaurma-mini-cheese-card.webp" },
  { name: "Донар", subtitle: "", volume: "485 гр", category: "Донар", pickupPrice: 330, deliveryPrice: 510, image: "assets/menu-donar-card.webp" },
  { name: "Донар", subtitle: "на Тарелке", volume: "500 гр", category: "Донар", pickupPrice: 360, deliveryPrice: 555, image: "assets/menu-donar-plate-card.webp" },
  { name: "Гирос", subtitle: "Фирменный", volume: "410 гр", category: "Прочее", pickupPrice: 330, deliveryPrice: 510, image: "assets/menu-gyros-card.webp" },
  { name: "Фахитос", subtitle: "", volume: "400 гр", category: "Прочее", pickupPrice: 330, deliveryPrice: 510, image: "assets/menu-fajitos-card.webp" },
  { name: "Хот-Дог", subtitle: "", volume: "265 гр", category: "Прочее", pickupPrice: 250, deliveryPrice: 385, image: "assets/menu-hot-dog-card.webp" },
  { name: "Скепасти", subtitle: "", volume: "530 гр", category: "Прочее", pickupPrice: 410, deliveryPrice: 635, image: "assets/menu-skepasti-card.webp" },
  { name: "Сендвич", subtitle: "", volume: "310 гр", category: "Прочее", pickupPrice: 330, deliveryPrice: 510, image: "assets/menu-sandwich-card.webp" },
  { name: "Картошка Фри", subtitle: "", volume: "110 гр", category: "Закуски", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-fries-card.webp" },
  { name: "Нагетсы", subtitle: "", volume: "110 гр", category: "Закуски", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-nuggets-card.webp" },
  { name: "Сыр", subtitle: "Слайс", volume: "20 гр", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-cheese-card.webp" },
  { name: "Лук", subtitle: "Маринованный", volume: "25 гр", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-onion-card.webp" },
  { name: "Огурец", subtitle: "Солёный", volume: "25 гр", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-pickle-card.webp" },
  { name: "Перец", subtitle: "Халапеньо", volume: "20 гр", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-jalapeno-card.webp" },
  { name: "Грибы", subtitle: "Шампиньоны", volume: "25 гр", category: "Добавки", pickupPrice: 30, deliveryPrice: 45, image: "assets/menu-mushrooms-card.webp" },
  { name: "Мясо", subtitle: "Филе куриное", volume: "50 гр", category: "Добавки", pickupPrice: 100, deliveryPrice: 150, image: "assets/menu-meat-card.webp" },
  { name: "Кетчуп", subtitle: "", volume: "25 гр", category: "Соусы", pickupPrice: 40, deliveryPrice: 65, image: "assets/menu-ketchup-card.webp" },
  { name: "Сырный соус", subtitle: "", volume: "25 гр", category: "Соусы", pickupPrice: 40, deliveryPrice: 65, image: "assets/menu-cheese-sauce-card.webp" },
  { name: "Чесночный соус", subtitle: "", volume: "25 гр", category: "Соусы", pickupPrice: 40, deliveryPrice: 65, image: "assets/menu-garlic-sauce-card.webp" },
  { name: "Кофе", subtitle: "", volume: "0,2 л", category: "Напитки", pickupPrice: 50, deliveryPrice: null, image: "assets/menu-coffee-card.webp" },
  { name: "Чай", subtitle: "", volume: "0,2 л", category: "Напитки", pickupPrice: 50, deliveryPrice: null, image: "assets/menu-tea-card.webp" },
  { name: "Компот Чили", subtitle: "Ягоды", volume: "0,5 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-compot-berries-card.webp" },
  { name: "Компот Чили", subtitle: "Сухофрукты", volume: "0,5 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-compot-dried-fruits-card.webp" },
  { name: "Тан Чили", subtitle: "Домашний", volume: "0,5 л", category: "Напитки", pickupPrice: 110, deliveryPrice: 170, image: "assets/menu-tan-card.webp" },
  { name: "Добрый Кола", subtitle: "", volume: "1 л", category: "Напитки", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-dobry-cola-1l-card.webp" },
  { name: "Добрый Кола", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-cola-05-card.webp" },
  { name: "Добрый Кола", subtitle: "", volume: "0,33 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-dobry-cola-033-card.webp" },
  { name: "Добрый Кола Б/С", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-cola-zero-05-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", volume: "1 л", category: "Напитки", pickupPrice: 150, deliveryPrice: 235, image: "assets/menu-dobry-orange-1l-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-dobry-orange-05-card.webp" },
  { name: "Добрый Апельсин", subtitle: "", volume: "0,33 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-dobry-orange-033-card.webp" },
  { name: "Лео Груша", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-pear-card.webp" },
  { name: "Лео Лимон", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-lemon-card.webp" },
  { name: "Лео Тархун", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-leo-tarhun-card.webp" },
  { name: "Натахтари Тархун", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 130, deliveryPrice: 200, image: "assets/menu-natakhtari-tarhun-card.webp" },
  { name: "Натахтари Фейхоа", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 130, deliveryPrice: 200, image: "assets/menu-natakhtari-feijoa-card.webp" },
  { name: "Палпи Апельсин", subtitle: "", volume: "0,45 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-pulpy-orange-card.webp" },
  { name: "Палпи Тропик", subtitle: "", volume: "0,45 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-pulpy-tropic-card.webp" },
  { name: "Сок Добрый", subtitle: "Апельсин", volume: "0,3 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-juice-orange-card.webp" },
  { name: "Сок Добрый", subtitle: "Томат", volume: "0,3 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-juice-tomato-card.webp" },
  { name: "Сок Добрый", subtitle: "Яблоко", volume: "0,3 л", category: "Напитки", pickupPrice: 90, deliveryPrice: 140, image: "assets/menu-juice-apple-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "Малина", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-raspberry-card.webp" },
  { name: "Чай Рич Зелёный", subtitle: "Манго", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-green-mango-card.webp" },
  { name: "Чай Рич Чёрный", subtitle: "Лимон", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-black-lemon-card.webp" },
  { name: "Чай Рич Чёрный", subtitle: "Персик", volume: "0,5 л", category: "Напитки", pickupPrice: 100, deliveryPrice: 155, image: "assets/menu-rich-tea-black-peach-card.webp" },
  { name: "Вода", subtitle: "без газа", volume: "0,5 л", category: "Напитки", pickupPrice: 50, deliveryPrice: 80, image: "assets/menu-water-still-05-card.webp" },
  { name: "Адреналин Раш", subtitle: "", volume: "0,45 л", category: "Напитки", pickupPrice: 150, deliveryPrice: null, image: "assets/menu-adrenaline-rush-card.webp" },
  { name: "Бёрн Энерджи", subtitle: "", volume: "0,45 л", category: "Напитки", pickupPrice: 150, deliveryPrice: null, image: "assets/menu-burn-energy-card.webp" },
  { name: "Флеш Энерджи", subtitle: "", volume: "0,45 л", category: "Напитки", pickupPrice: 100, deliveryPrice: null, image: "assets/menu-flash-energy-card.webp" },
  { name: "Флеш Энерджи", subtitle: "Ультра", volume: "0,45 л", category: "Напитки", pickupPrice: 100, deliveryPrice: null, image: "assets/menu-flash-energy-ultra-card.webp" },
];
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
  if (item.category === "Напитки" || item.category === "Соусы") {
    return item.volume || "";
  }
  return "";
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
      modalImage.alt = button.dataset.menuPhotoAlt || "Фото блюда";
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



