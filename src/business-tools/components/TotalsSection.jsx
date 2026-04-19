import React from 'react';

export default function TotalsSection({ items, discount, currency = 'INR', onDiscountChange }) {
  const subtotal = items.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);
  const taxTotal = items.reduce((sum, row) => sum + (row.quantity * row.unitPrice * (row.tax / 100)), 0);
  const grandTotal = subtotal + taxTotal - (discount || 0);

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg max-w-md ml-auto">
      <div className="flex justify-between mb-1"><span>Subtotal</span><span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency })}</span></div>
      <div className="flex justify-between mb-1"><span>Tax</span><span>{taxTotal.toLocaleString('en-IN', { style: 'currency', currency })}</span></div>
      <div className="flex justify-between mb-1"><span>Discount</span><input type="number" className="input w-24 ml-2" value={discount} min={0} onChange={e => onDiscountChange(Number(e.target.value))} /></div>
      <div className="flex justify-between mt-2 text-lg font-bold text-blue-900"><span>Grand Total</span><span>{grandTotal.toLocaleString('en-IN', { style: 'currency', currency })}</span></div>
    </div>
  );
}
