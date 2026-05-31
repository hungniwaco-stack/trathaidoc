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
