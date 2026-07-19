import React from "react";

export default function DocumentBuilderLayout({ left, right }) {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto min-h-[80vh] py-4 sm:py-8 gap-6 md:gap-12 lg:gap-16">
      <aside className="w-full md:max-w-[400px] md:flex-shrink-0 overflow-y-auto bg-white rounded-xl shadow-md border border-slate-100 p-4 sm:p-6 h-fit md:sticky md:top-24">
        {left}
      </aside>
      <main className="flex-1 min-w-0 flex flex-col items-center justify-start">
        {right}
      </main>
    </div>
  );
}
