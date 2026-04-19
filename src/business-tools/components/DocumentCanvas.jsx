import React from 'react';

export default function DocumentCanvas({ children }) {
  return (
    <div className="bg-white shadow-xl rounded-lg mx-auto my-8 p-8" style={{ maxWidth: 800, minHeight: 1122, width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0' }}>
      {children}
    </div>
  );
}
