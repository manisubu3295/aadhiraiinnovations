import React from "react";

export default function LeftPanelSection({ icon, title, children }) {
  return (
    <section className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-[#0B1F3A] text-lg">{icon}</span>}
        <h3 className="text-[15px] font-semibold text-[#0B1F3A] tracking-wide uppercase">{title}</h3>
      </div>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 shadow-sm">
        {children}
      </div>
    </section>
  );
}
