export function calculateTotals(items, discount = 0) {
  let subtotal = 0, taxTotal = 0;
  items.forEach(item => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const tax = parseFloat(item.tax) || 0;
    const line = qty * price;
    subtotal += line;
    taxTotal += line * (tax / 100);
  });
  const grandTotal = subtotal + taxTotal - (parseFloat(discount) || 0);
  return { subtotal, taxTotal, discount: parseFloat(discount) || 0, grandTotal };
}
