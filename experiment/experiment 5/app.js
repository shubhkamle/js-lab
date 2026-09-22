const products = [
  { id: "mug", name: "Cloud mug", category: "Ceramics", price: 18, emoji: "☕" },
  { id: "vase", name: "Soft vase", category: "Homeware", price: 32, emoji: "♢" },
  { id: "tote", name: "Daily tote", category: "Textiles", price: 24, emoji: "▱" },
  { id: "candle", name: "Sunday candle", category: "Fragrance", price: 16, emoji: "◒" },
  { id: "notebook", name: "Dot notebook", category: "Stationery", price: 12, emoji: "▤" },
  { id: "socks", name: "Happy socks", category: "Apparel", price: 14, emoji: "⌁" },
];

let cart = [
  { productId: "mug", quantity: 1 },
  { productId: "tote", quantity: 2 },
  { productId: "candle", quantity: 1 },
];

const money = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
}).format(amount);
const getProduct = (productId) => products.find(({ id }) => id === productId);

function getDiscount(subtotal) {
  if (subtotal >= 100) return { rate: 0.15, label: "15% off" };
  if (subtotal >= 60) return { rate: 0.1, label: "10% off" };
  return { rate: 0, label: "(none)" };
}

function calculateCart() {
  const subtotal = cart
    .map(({ productId, quantity }) => getProduct(productId).price * quantity)
    .reduce((total, lineTotal) => total + lineTotal, 0);
  const discount = subtotal * getDiscount(subtotal).rate;
  const delivery = subtotal >= 80 || subtotal === 0 ? 0 : 4;
  const tax = (subtotal - discount) * 0.08;

  return { subtotal, discount, delivery, tax, total: subtotal - discount + delivery + tax };
}

function renderProducts() {
  document.querySelector("#product-grid").innerHTML = products
    .map((product) => `
      <article class="product-card">
        <div class="product-visual" aria-hidden="true">${product.emoji}</div>
        <div class="product-meta">
          <div><strong>${product.name}</strong><p>${product.category}</p></div>
          <div><strong>${money(product.price)}</strong><button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name}">+</button></div>
        </div>
      </article>
    `)
    .join("");
}

function renderCart() {
  const cartList = document.querySelector("#cart-list");
  const emptyState = document.querySelector("#empty-state");
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector("#cart-count").textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  emptyState.hidden = cart.length > 0;

  cartList.innerHTML = cart.map(({ productId, quantity }) => {
    const product = getProduct(productId);
    return `
      <article class="cart-item">
        <div class="product-image" style="background: ${product.id === "mug" ? "var(--butter)" : product.id === "tote" ? "var(--mint)" : "var(--peach)"}" aria-hidden="true">${product.emoji}</div>
        <div class="cart-info"><h3>${product.name}</h3><p>${product.category} · ${money(product.price)} each</p><div class="quantity"><button type="button" data-decrease="${product.id}" aria-label="Decrease ${product.name} quantity">−</button><span>${quantity}</span><button type="button" data-increase="${product.id}" aria-label="Increase ${product.name} quantity">+</button></div></div>
        <div class="item-price">${money(product.price * quantity)}</div>
      </article>
    `;
  }).join("");

  const totals = calculateCart();
  const discountInfo = getDiscount(totals.subtotal);
  document.querySelector("#subtotal").textContent = money(totals.subtotal);
  document.querySelector("#discount").textContent = `−${money(totals.discount)}`;
  document.querySelector("#discount-label").textContent = discountInfo.label;
  document.querySelector("#delivery").textContent = totals.delivery === 0 ? "Free" : money(totals.delivery);
  document.querySelector("#tax").textContent = money(totals.tax);
  document.querySelector("#total").textContent = money(totals.total);
  document.querySelector("#savings-message").textContent = totals.subtotal >= 100
    ? "Best price unlocked: 15% off your order."
    : totals.subtotal >= 80
      ? "You unlocked free delivery."
      : `Spend ${money(Math.max(80 - totals.subtotal, 0))} more to unlock free delivery.`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  renderCart();
  showToast(`${getProduct(productId).name} added to your cart`);
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const increaseButton = event.target.closest("[data-increase]");
  if (increaseButton) addToCart(increaseButton.dataset.increase);

  const decreaseButton = event.target.closest("[data-decrease]");
  if (decreaseButton) {
    const item = cart.find(({ productId }) => productId === decreaseButton.dataset.decrease);
    item.quantity -= 1;
    cart = cart.filter(({ quantity }) => quantity > 0);
    renderCart();
  }
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

document.querySelector("#checkout").addEventListener("click", () => {
  if (cart.length === 0) showToast("Your cart is empty");
  else if (document.querySelector("#customer-form").reportValidity()) {
    const customerName = document.querySelector("#customer-name").value.trim();
    showToast(`Thanks, ${customerName}. Checkout is ready`);
  }
});

renderProducts();
renderCart();
