import React from "react";

export default function PrintView({ children }) {
  return (
    <div className="print:bg-white print:p-0 print:shadow-none print:border-0 print:rounded-none print:w-full print:max-w-none">
      {children}
    </div>
  );
}
