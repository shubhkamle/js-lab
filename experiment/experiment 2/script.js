const itemName = document.getElementById('itemName');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const discountInput = document.getElementById('discount');
const taxInput = document.getElementById('tax');
const calculateBtn = document.getElementById('calculateBtn');
const output = document.getElementById('output');

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function calculateBilling() {
  const values = {
    name: itemName.value || 'Item',
    price: parseFloat(priceInput.value) || 0,
    quantity: parseInt(quantityInput.value, 10) || 0,
    discountRate: parseFloat(discountInput.value) || 0,
    taxRate: parseFloat(taxInput.value) || 0,
  };

  const { name, price, quantity, discountRate, taxRate } = values;

  const subTotal = price * quantity;
  const discountAmount = subTotal * (discountRate / 100);
  const taxedAmount = (subTotal - discountAmount) * (taxRate / 100);
  const total = subTotal - discountAmount + taxedAmount;

  const message = `
    Billing for: ${name}
    Unit price: ${formatMoney(price)}
    Quantity: ${quantity}
    Subtotal: ${formatMoney(subTotal)}
    Discount: ${discountRate}% (${formatMoney(discountAmount)})
    Tax: ${taxRate}% (${formatMoney(taxedAmount)})
    Total due: ${formatMoney(total)}
  `;

  output.innerHTML = `
    <p><strong>${name}</strong> billing summary:</p>
    <p>Unit price: <strong>${formatMoney(price)}</strong></p>
    <p>Quantity: <strong>${quantity}</strong></p>
    <p>Subtotal: <strong>${formatMoney(subTotal)}</strong></p>
    <p>Discount: <strong>${discountRate}%</strong> (${formatMoney(discountAmount)})</p>
    <p>Tax: <strong>${taxRate}%</strong> (${formatMoney(taxedAmount)})</p>
    <p><strong>Total due: ${formatMoney(total)}</strong></p>
  `;
  console.log('Billing output:', message);
}

calculateBtn.addEventListener('click', calculateBilling);

// Optional live calculation using let for intermediate state
let lastTotal = 0;

function updateLastTotal() {
  const currentPrice = parseFloat(priceInput.value) || 0;
  const currentQty = parseInt(quantityInput.value, 10) || 0;
  lastTotal = currentPrice * currentQty;
}

priceInput.addEventListener('input', updateLastTotal);
quantityInput.addEventListener('input', updateLastTotal);
updateLastTotal();
