import React from 'react';

export default function PrintButton({ targetId }) {
  const handlePrint = () => {
    if (targetId) {
      const printContents = document.getElementById(targetId).innerHTML;
      const printWindow = window.open('', '', 'height=800,width=600');
      printWindow.document.write('<html><head><title>Print</title>');
      printWindow.document.write('<link rel="stylesheet" href="/print.css" />');
      printWindow.document.write('</head><body >');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    } else {
      window.print();
    }
  };
  return (
    <button onClick={handlePrint} style={{ background: '#0B1F3A', color: '#fff', padding: '8px 20px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>
      Print / Save as PDF
    </button>
  );
}
