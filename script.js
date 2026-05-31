const products = document.querySelectorAll(".product");

products.forEach((product) => {
  const oldPriceEl = product.querySelector(".old-price");
  const newPriceEl = product.querySelector(".new-price");

  if (!oldPriceEl || !newPriceEl) return;

  const oldPrice = Number(oldPriceEl.textContent.replace(/[^\d]/g, ""));
  const newPrice = Number(newPriceEl.textContent.replace(/[^\d]/g, ""));

  if (!oldPrice || !newPrice || newPrice >= oldPrice) return;

  const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  const badge = document.createElement("span");
  badge.className = "discount-badge";
  badge.textContent = `-${discountPercent}%`;
  product.appendChild(badge);
});

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
