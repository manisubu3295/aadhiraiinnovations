export function printElementById(targetId) {
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
}
