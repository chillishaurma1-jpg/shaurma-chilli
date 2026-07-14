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
  {
    name: "Шаурма Большая",
    category: "Шаурма",
    pickupPrice: 290,
    deliveryPrice: 450,
    image: "assets/menu-shaurma-big.webp",
  },
  {
    name: "Шаурма Мини",
    category: "Шаурма",
    pickupPrice: 240,
    deliveryPrice: 370,
    image: "assets/menu-shaurma-mini.webp",
  },
  {
    name: "Шаурма Большая в сырном лаваше",
    category: "Шаурма",
    pickupPrice: 300,
    deliveryPrice: 465,
    image: "assets/menu-cheese-shaurma.webp",
  },
  {
    name: "Шаурма Мини в сырном лаваше",
    category: "Шаурма",
    pickupPrice: 250,
    deliveryPrice: 385,
    image: "assets/menu-cheese-shaurma.webp",
  },
  {
    name: "Донар",
    category: "Донар",
    pickupPrice: 320,
    deliveryPrice: 495,
    image: "assets/menu-donar.webp",
  },
  {
    name: "Донар на тарелке",
    category: "Донар",
    pickupPrice: 350,
    deliveryPrice: 540,
    image: "assets/menu-donar-plate.webp",
  },
  {
    name: "Гирос фирменный",
    category: "Прочие вкусности",
    pickupPrice: 320,
    deliveryPrice: 495,
    image: "assets/menu-gyros.webp",
  },
  {
    name: "Фахитос",
    category: "Прочие вкусности",
    pickupPrice: 320,
    deliveryPrice: 495,
    image: null,
  },
  {
    name: "Скепасти",
    category: "Прочие вкусности",
    pickupPrice: 400,
    deliveryPrice: 620,
    image: "assets/menu-skepasti.webp",
  },
  {
    name: "Сендвич",
    category: "Прочие вкусности",
    pickupPrice: 320,
    deliveryPrice: 495,
    image: null,
  },
  {
    name: "Хот-дог",
    category: "Прочие вкусности",
    pickupPrice: 240,
    deliveryPrice: 370,
    image: null,
  },
  {
    name: "Картошка фри",
    category: "Закуски",
    pickupPrice: 150,
    deliveryPrice: 235,
    image: "assets/menu-fries.webp",
  },
  {
    name: "Нагетсы",
    category: "Закуски",
    pickupPrice: 150,
    deliveryPrice: 235,
    image: null,
  },
  {
    name: "Перец халапеньо",
    category: "Добавки",
    pickupPrice: 30,
    deliveryPrice: 45,
    image: null,
  },
  {
    name: "Сыр",
    category: "Добавки",
    pickupPrice: 30,
    deliveryPrice: 45,
    image: null,
  },
  {
    name: "Шампиньоны",
    category: "Добавки",
    pickupPrice: 30,
    deliveryPrice: 45,
    image: null,
  },
  {
    name: "Маринованный лук",
    category: "Добавки",
    pickupPrice: 30,
    deliveryPrice: 45,
    image: null,
  },
  {
    name: "Солёный огурец",
    category: "Добавки",
    pickupPrice: 30,
    deliveryPrice: 45,
    image: null,
  },
  {
    name: "Мясо",
    category: "Добавки",
    pickupPrice: 100,
    deliveryPrice: 150,
    image: null,
  },
  {
    name: "Чай",
    category: "Напитки",
    pickupPrice: 50,
    deliveryPrice: null,
    image: null,
  },
  {
    name: "Кофе",
    category: "Напитки",
    pickupPrice: 50,
    deliveryPrice: null,
    image: null,
  },
];

const POPULAR_ITEMS = [
  "Шаурма Большая",
  "Шаурма Большая в сырном лаваше",
  "Донар",
  "Гирос фирменный",
  "Хот-дог",
  "Картошка фри",
];

function formatPrice(value) {
  return value === null ? "нет" : `${value} ₽`;
}

function formatDishName(name) {
  const cheeseText = " в сырном лаваше";
  if (!name.toLowerCase().includes(cheeseText)) {
    return name;
  }

  return `${name.replace(/ в сырном лаваше/i, "")}<span class="dish-subtitle">в сырном лаваше</span>`;
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

function renderMenu(category = "all") {
  const menuList = document.querySelector("#menuList");
  const items =
    category === "popular"
      ? MENU.filter((item) => POPULAR_ITEMS.includes(item.name))
      : category === "all"
        ? MENU
        : MENU.filter((item) => item.category === category);

  menuList.innerHTML = items
    .map(
      (item) => `
        <article class="menu-item">
          ${
            item.image
              ? `<button class="menu-photo-button" type="button" data-menu-photo="${item.image}" data-menu-photo-alt="${item.name}">
                  <img src="${item.image}" alt="${item.name}" loading="lazy">
                </button>`
              : `<div class="menu-photo-placeholder" role="img" aria-label="Фото блюда пока не добавлено"><span>Фото скоро</span></div>`
          }
          <div class="menu-item-body">
            ${POPULAR_ITEMS.includes(item.name) ? `<span class="dish-badge">Хит</span>` : ""}
            <h3>${formatDishName(item.name)}</h3>
            <div class="price-row">
              <a class="price" data-link="pickup" data-dish="${item.name}" href="${LINKS.pickup}" target="_blank" rel="noopener">
                <small>Самовывоз</small>
                <strong>${formatPrice(item.pickupPrice)}</strong>
              </a>
              <a class="price" data-link="delivery" data-dish="${item.name}" href="${LINKS.delivery}" target="_blank" rel="noopener">
                <small>Яндекс Еда</small>
                <strong>${formatPrice(item.deliveryPrice)}</strong>
              </a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
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

function bindReviewControls() {
  const carousel = document.querySelector(".reviews-carousel");
  const buttons = document.querySelectorAll("[data-review-direction]");
  const slides = [...document.querySelectorAll(".review-slide")];
  if (!carousel || buttons.length === 0) return;

  const updateCarouselHeight = () => {
    const slideWidth = carousel.clientWidth || 1;
    const activeIndex = Math.round(carousel.scrollLeft / slideWidth);
    const activeSlide = slides[Math.max(0, Math.min(activeIndex, slides.length - 1))];
    if (activeSlide) {
      carousel.style.height = `${activeSlide.offsetHeight}px`;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.reviewDirection);
      const slide = carousel.querySelector(".review-slide");
      const slideWidth = slide ? slide.getBoundingClientRect().width : carousel.clientWidth;
      carousel.scrollBy({
        left: direction * slideWidth,
        behavior: "smooth",
      });
    });
  });

  carousel.addEventListener("scroll", () => {
    window.clearTimeout(carousel.reviewScrollTimer);
    carousel.reviewScrollTimer = window.setTimeout(updateCarouselHeight, 80);
  });

  window.addEventListener("resize", updateCarouselHeight);
  slides.forEach((slide) => {
    const image = slide.querySelector("img");
    if (image && !image.complete) {
      image.addEventListener("load", updateCarouselHeight, { once: true });
    }
  });
  updateCarouselHeight();
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
renderFilters();
renderMenu("popular");
bindFilters();
bindReviewControls();
bindMenuPhotoModal();
