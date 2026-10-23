/*
  Где менять данные:
  1. Ссылки меняются в объекте LINKS.
  2. Меню и цены меняются через локальную панель (menu.json).
  3. Фото блюд меняются в поле image. Файлы лежат в assets.
*/
(function startChilliSite() {
  // An older cached index may not yet include the new menu data script.
  if (!window.CHILLI_MENU_DATA) {
    const loader = document.createElement("script");
    loader.src = "menu-data.js";
    loader.onload = startChilliSite;
    document.head.append(loader);
    return;
  }
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

const MENU_DATA = window.CHILLI_MENU_DATA;
const MENU = MENU_DATA.items.filter((item) => item.visible);
const POPULAR_ITEMS = new Set(MENU.filter((item) => item.popular).map((item) => item.id));

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
  return `${escapeHtml(name)}${subtitle ? `<span class="dish-subtitle">${escapeHtml(subtitle)}</span>` : ""}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
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
  const categories = MENU_DATA.categories.filter((category) => MENU.some((item) => item.category === category));

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
      ? MENU.filter((item) => POPULAR_ITEMS.has(item.id))
      : category === "all"
        ? MENU
        : MENU.filter((item) => item.category === category);

  menuList.innerHTML = items
    .map(
      (item, index) => `
        <article class="menu-item">
          ${
            item.image
              ? `<button class="menu-photo-button" type="button" data-menu-photo="${escapeHtml(item.image)}" data-menu-photo-alt="${escapeHtml(getDishLabel(item))}">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(getDishLabel(item))}" loading="${index < 6 ? "eager" : "lazy"}" decoding="async" fetchpriority="${index < 2 ? "high" : "auto"}">
                </button>`
              : `<div class="menu-photo-placeholder" role="img" aria-label="Фото блюда пока не добавлено"><span>Фото скоро</span></div>`
          }
          <div class="menu-item-body">
            ${POPULAR_ITEMS.has(item.id) ? `<span class="dish-badge">Хит</span>` : ""}
            <h3>${formatDishName(item)}</h3>
            <div class="price-row">
              <a class="price" data-link="pickup" data-dish="${escapeHtml(getDishLabel(item))}" href="${LINKS.pickup}" target="_blank" rel="noopener">
                <small>Самовывоз</small>
                <strong>${formatPrice(item.pickupPrice)}</strong>
              </a>
              <a class="price" data-link="delivery" data-dish="${escapeHtml(getDishLabel(item))}" href="${LINKS.delivery}" target="_blank" rel="noopener">
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
})();



