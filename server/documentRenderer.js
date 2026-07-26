// Plain-JS port of src/business-tools/components/DocumentPreview.jsx's markup, used to
// render an invoice/quotation to a standalone HTML string for server-side PDF generation
// (that component itself renders in the browser and can't be reused here).

const DEFAULT_COLUMN_LABELS = { description: 'Description', quantity: 'Qty', unitPrice: 'Unit Price' }
const COLUMN_LABELS_BY_BILLING_TYPE = {
  MILESTONE: { description: 'Milestone / Deliverable', quantity: 'Qty', unitPrice: 'Amount' },
  HOURLY: { description: 'Task', quantity: 'Hours', unitPrice: 'Rate' },
}

const SOW_SECTIONS = [
  ['scopeOfWork', 'Scope of Work'],
  ['outOfScope', 'Out of Scope'],
  ['assumptions', 'Assumptions'],
  ['revisionPolicy', 'Revision Policy'],
  ['warrantyPeriod', 'Warranty'],
  ['ipOwnership', 'IP Ownership'],
  ['techStack', 'Technology Stack'],
]

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function money(n) {
  return (Number(n) || 0).toFixed(2)
}

// Multi-line terms (one clause per line) render as a bulleted list; a plain single-line
// string (the common case for existing hand-typed invoice/quotation terms) renders unchanged.
function termsHtml(terms) {
  if (!terms) return ''
  const lines = terms.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length <= 1) {
    return `<div style="margin-top:12px"><strong>Terms:</strong> ${esc(terms)}</div>`
  }
  return `<div style="margin-top:12px">
    <strong>Terms:</strong>
    <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:#334155;line-height:1.6">
      ${lines.map((line) => `<li>${esc(line)}</li>`).join('')}
    </ul>
  </div>`
}

export function renderDocumentHtml({
  type, seller, customer, details, items, totals, notes, terms, logoUrl, billingType, milestoneLabel, sow, tds, bankDetails,
}) {
  const columnLabels = COLUMN_LABELS_BY_BILLING_TYPE[billingType] || DEFAULT_COLUMN_LABELS
  const hasSow = sow && Object.values(sow).some(Boolean)
  const hasBankDetails = type === 'invoice' && bankDetails && Object.values(bankDetails).some(Boolean)

  const detailsRows = Object.entries(details)
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><strong>${esc(k.replace(/([A-Z])/g, ' $1'))}: </strong>${esc(v)}</div>`)
    .join('')

  const itemRows = items
    .map((item) => {
      const qty = Number(item.quantity) || 0
      const price = Number(item.unitPrice) || 0
      const tax = Number(item.tax) || 0
      const amount = qty * price * (1 + tax / 100)
      return `<tr>
        <td>${esc(item.description)}</td>
        <td>${esc(item.quantity)}</td>
        <td>${esc(item.unitPrice)}</td>
        <td>${esc(item.tax)}</td>
        <td style="text-align:right">${money(amount)}</td>
      </tr>`
    })
    .join('')

  const sowHtml = hasSow
    ? `<div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:16px">
        ${SOW_SECTIONS.filter(([key]) => sow[key])
          .map(
            ([key, label]) =>
              `<div style="margin-top:12px;font-size:14px"><strong>${esc(label)}:</strong><div style="white-space:pre-wrap;color:#334155">${esc(sow[key])}</div></div>`
          )
          .join('')}
      </div>`
    : ''

  const bankHtml = hasBankDetails
    ? `<div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:16px;font-size:14px">
        <strong>Payment Details:</strong>
        ${bankDetails.bankName ? `<div>Bank: ${esc(bankDetails.bankName)}</div>` : ''}
        ${bankDetails.accountNumber ? `<div>Account No: ${esc(bankDetails.accountNumber)}</div>` : ''}
        ${bankDetails.ifsc ? `<div>IFSC: ${esc(bankDetails.ifsc)}</div>` : ''}
        ${bankDetails.upiId ? `<div>UPI: ${esc(bankDetails.upiId)}</div>` : ''}
      </div>`
    : ''

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; margin: 0; }
  table { width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 6px 4px; }
  thead tr { background: #f1f5f9; }
</style>
</head>
<body>
  <div style="background:#fff;padding:32px;max-width:700px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h2 style="margin:0;color:#0B1F3A">${type === 'invoice' ? 'INVOICE' : 'QUOTATION'}</h2>
        ${milestoneLabel ? `<div style="font-size:13px;color:#475569;margin-top:4px">For Milestone: ${esc(milestoneLabel)}</div>` : ''}
        ${logoUrl ? `<img src="${esc(logoUrl)}" alt="Logo" style="max-height:48px;margin-top:8px" />` : ''}
      </div>
      <div style="text-align:right;font-size:14px">
        <div><strong>${esc(seller.businessName)}</strong></div>
        <div>${esc(seller.contactPerson)}</div>
        <div>${esc(seller.address)}</div>
        <div>${esc(seller.phone)}</div>
        <div>${esc(seller.email)}</div>
        ${seller.gst ? `<div>GST: ${esc(seller.gst)}</div>` : ''}
      </div>
    </div>
    <hr style="margin:24px 0" />
    <div style="display:flex;justify-content:space-between;font-size:14px">
      <div>
        <div style="font-weight:600">Bill To:</div>
        <div>${esc(customer.name)}</div>
        ${customer.company ? `<div>${esc(customer.company)}</div>` : ''}
        <div>${esc(customer.address)}</div>
        <div>${esc(customer.phone)}</div>
        <div>${esc(customer.email)}</div>
        ${customer.gst ? `<div>GST: ${esc(customer.gst)}</div>` : ''}
      </div>
      <div style="text-align:right">${detailsRows}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>${esc(columnLabels.description)}</th>
          <th>${esc(columnLabels.quantity)}</th>
          <th>${esc(columnLabels.unitPrice)}</th>
          <th>Tax %</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="text-align:right;font-size:15px">
      <div>Subtotal: <strong>${money(totals.subtotal)}</strong></div>
      <div>Tax: <strong>${money(totals.taxTotal)}</strong></div>
      ${totals.discount > 0 ? `<div>Discount: <strong>${money(totals.discount)}</strong></div>` : ''}
      <div style="font-size:18px;margin-top:8px">Grand Total: <strong>${money(totals.grandTotal)}</strong></div>
      ${
        tds?.applicable
          ? `<div>Less TDS @ ${esc(tds.tdsRate)}%: <strong>-${money(tds.tdsAmount)}</strong></div>
             <div style="font-size:18px;margin-top:4px;color:#0B1F3A">Net Payable: <strong>${money(tds.netPayable)}</strong></div>`
          : ''
      }
    </div>
    ${notes ? `<div style="margin-top:24px"><strong>Notes:</strong> ${esc(notes)}</div>` : ''}
    ${termsHtml(terms)}
    ${sowHtml}
    ${bankHtml}
  </div>
</body>
</html>`
}
