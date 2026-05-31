const products = document.querySelectorAll(".product");
const GA_MEASUREMENT_ID = "G-WYJTXB1CFN";

const sendAnalyticsEvent = (eventName, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

if (GA_MEASUREMENT_ID && !window.google_tag_manager) {
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

products.forEach((product) => {
  const oldPriceEl = product.querySelector(".old-price");
  const newPriceEl = product.querySelector(".new-price");

  if (!oldPriceEl || !newPriceEl) return;

  const oldPrice = Number(oldPriceEl.textContent.replace(/[^\d]/g, ""));
  const newPrice = Number(newPriceEl.textContent.replace(/[^\d]/g, ""));

  if (!oldPrice || !newPrice) return;

  if (newPrice === oldPrice) {
    oldPriceEl.remove();
    return;
  }

  if (newPrice > oldPrice) return;

  const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  const badge = document.createElement("span");
  badge.className = "discount-badge";
  badge.textContent = `-${discountPercent}%`;
  product.appendChild(badge);
});

const affiliateLinks = document.querySelectorAll(".affiliate-link");
affiliateLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const key = "affiliate_click_stats";
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    const product = link.dataset.product || "unknown";
    current[product] = (current[product] || 0) + 1;
    current.last_click_at = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(current));
    sendAnalyticsEvent("affiliate_click", { product });
  });
});

const ctaVariants = [
  { label: "Xem sản phẩm tốt nhất hôm nay", key: "variant_a" },
  { label: "So sánh giá và mua trên Shopee", key: "variant_b" }
];
const ctaVariantKey = "cta_variant_2026_05";
const ctaVariant = localStorage.getItem(ctaVariantKey) || ctaVariants[Math.floor(Math.random() * ctaVariants.length)].key;
localStorage.setItem(ctaVariantKey, ctaVariant);
const chosenVariant = ctaVariants.find((item) => item.key === ctaVariant);

if (chosenVariant) {
  document.querySelectorAll("[data-cta-slot='hero-primary'], [data-cta-slot='bottom-primary']").forEach((cta) => {
    cta.textContent = chosenVariant.label;
    cta.addEventListener("click", () => {
      sendAnalyticsEvent("cta_click", { slot: cta.dataset.ctaSlot, variant: chosenVariant.key });
    });
  });
}

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    if (!item) return;

    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((opened) => {
      opened.classList.remove("open");
      const openedBtn = opened.querySelector(".faq-question");
      const openedAnswer = opened.querySelector(".faq-answer");
      if (openedBtn) openedBtn.setAttribute("aria-expanded", "false");
      if (openedAnswer) openedAnswer.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuBackdrop = document.querySelector(".menu-backdrop");

if (menuToggle && mobileMenu) {
  const openMenu = () => {
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    if (menuBackdrop) menuBackdrop.classList.add("open");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    if (menuBackdrop) menuBackdrop.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("click", (event) => {
    if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target) && !menuBackdrop?.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}
