import React from "react";

export default function PricingSummary({ subtotal, taxTotal, discount, grandTotal, currency }) {
  return (
    <div className="space-y-2 text-right mt-2">
      <div className="flex justify-between text-[15px]">
        <span>Subtotal</span>
        <span>{currency} {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-[15px]">
        <span>Tax</span>
        <span>{currency} {taxTotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-[15px]">
          <span>Discount</span>
          <span>-{currency} {discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-[17px] font-bold border-t border-slate-200 pt-2 mt-2">
        <span>Total</span>
        <span className="text-[#0B1F3A]">{currency} {grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
