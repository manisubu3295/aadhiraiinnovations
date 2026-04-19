import React from "react";

export default function DocumentBuilderLayout({ left, right }) {
  return (
    <div className="flex w-full max-w-6xl mx-auto min-h-[80vh] py-8 gap-8 md:gap-12 lg:gap-16">
      <aside className="w-full max-w-[400px] flex-shrink-0 overflow-y-auto bg-white rounded-xl shadow-md border border-slate-100 p-6 h-fit sticky top-24">
        {left}
      </aside>
      <main className="flex-1 min-w-0 flex flex-col items-center justify-start">
        {right}
      </main>
    </div>
  );
}
