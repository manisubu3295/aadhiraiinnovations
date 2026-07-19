export function calculateTotals(items, discount = 0) {
  let subtotal = 0, taxTotal = 0;
  items.forEach(item => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const tax = parseFloat(item.tax ?? item.taxPercent) || 0;
    const line = qty * price;
    subtotal += line;
    taxTotal += line * (tax / 100);
  });
  const grandTotal = subtotal + taxTotal - (parseFloat(discount) || 0);
  return { subtotal, taxTotal, discount: parseFloat(discount) || 0, grandTotal };
}

export function calculateTds(grandTotal, rate = 0) {
  const tdsRate = parseFloat(rate) || 0
  const tdsAmount = grandTotal * (tdsRate / 100)
  return { tdsRate, tdsAmount, netPayable: grandTotal - tdsAmount }
}
