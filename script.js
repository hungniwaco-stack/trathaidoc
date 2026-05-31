const form = document.querySelector(".lead-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Cảm ơn bạn! Đội ngũ tư vấn sẽ liên hệ trong thời gian sớm nhất.");
    form.reset();
  });
}

const products = document.querySelectorAll(".product");

products.forEach((product) => {
  const oldPriceEl = product.querySelector(".old-price");
  const newPriceEl = product.querySelector(".new-price");

  if (!oldPriceEl || !newPriceEl) {
    return;
  }

  const oldPrice = Number(oldPriceEl.textContent.replace(/[^\d]/g, ""));
  const newPrice = Number(newPriceEl.textContent.replace(/[^\d]/g, ""));

  if (!oldPrice || !newPrice || newPrice >= oldPrice) {
    return;
  }

  const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  const badge = document.createElement("span");
  badge.className = "discount-badge";
  badge.textContent = `-${discountPercent}%`;
  product.appendChild(badge);
});
