import React from 'react';

const DEFAULT_COLUMN_LABELS = { description: 'Description', quantity: 'Qty', unitPrice: 'Unit Price' };
const COLUMN_LABELS_BY_BILLING_TYPE = {
  MILESTONE: { description: 'Milestone / Deliverable', quantity: 'Qty', unitPrice: 'Amount' },
  HOURLY: { description: 'Task', quantity: 'Hours', unitPrice: 'Rate' },
};

const SOW_SECTIONS = [
  ['scopeOfWork', 'Scope of Work'],
  ['outOfScope', 'Out of Scope'],
  ['assumptions', 'Assumptions'],
  ['revisionPolicy', 'Revision Policy'],
  ['warrantyPeriod', 'Warranty'],
  ['ipOwnership', 'IP Ownership'],
  ['techStack', 'Technology Stack'],
];

export default function DocumentPreview({
  type, seller, customer, details, items, totals, notes, terms, logoUrl, extra,
  billingType, milestoneLabel, sow, tds, bankDetails,
}) {
  // type: 'invoice' | 'quotation'
  const columnLabels = COLUMN_LABELS_BY_BILLING_TYPE[billingType] || DEFAULT_COLUMN_LABELS;
  const hasSow = sow && Object.values(sow).some(Boolean);
  const hasBankDetails = type === 'invoice' && bankDetails && Object.values(bankDetails).some(Boolean);

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 700, margin: '0 auto', boxShadow: '0 2px 12px #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0B1F3A' }}>{type === 'invoice' ? 'INVOICE' : 'QUOTATION'}</h2>
          {milestoneLabel && <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>For Milestone: {milestoneLabel}</div>}
          {logoUrl && <img src={logoUrl} alt="Logo" style={{ maxHeight: 48, marginTop: 8 }} />}
        </div>
        <div style={{ textAlign: 'right', fontSize: 14 }}>
          <div><strong>{seller.businessName}</strong></div>
          <div>{seller.contactPerson}</div>
          <div>{seller.address}</div>
          <div>{seller.phone}</div>
          <div>{seller.email}</div>
          {seller.gst && <div>GST: {seller.gst}</div>}
        </div>
      </div>
      <hr style={{ margin: '24px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <div>
          <div style={{ fontWeight: 600 }}>Bill To:</div>
          <div>{customer.name}</div>
          {customer.company && <div>{customer.company}</div>}
          <div>{customer.address}</div>
          <div>{customer.phone}</div>
          <div>{customer.email}</div>
          {customer.gst && <div>GST: {customer.gst}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          {Object.entries(details).map(([k, v]) => v && <div key={k}><strong>{k.replace(/([A-Z])/g, ' $1')}: </strong>{v}</div>)}
        </div>
      </div>
      <table style={{ width: '100%', margin: '24px 0', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>{columnLabels.description}</th>
            <th>{columnLabels.quantity}</th>
            <th>{columnLabels.unitPrice}</th>
            <th>Tax %</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice}</td>
              <td>{item.tax}</td>
              <td style={{ textAlign: 'right' }}>{((item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.tax || 0) / 100)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', fontSize: 15 }}>
        <div>Subtotal: <strong>{totals.subtotal.toFixed(2)}</strong></div>
        <div>Tax: <strong>{totals.taxTotal.toFixed(2)}</strong></div>
        {totals.discount > 0 && <div>Discount: <strong>{totals.discount.toFixed(2)}</strong></div>}
        <div style={{ fontSize: 18, marginTop: 8 }}>Grand Total: <strong>{totals.grandTotal.toFixed(2)}</strong></div>
        {tds?.applicable && (
          <>
            <div>Less TDS @ {tds.tdsRate}%: <strong>-{tds.tdsAmount.toFixed(2)}</strong></div>
            <div style={{ fontSize: 18, marginTop: 4, color: '#0B1F3A' }}>Net Payable: <strong>{tds.netPayable.toFixed(2)}</strong></div>
          </>
        )}
      </div>
      {notes && <div style={{ marginTop: 24 }}><strong>Notes:</strong> {notes}</div>}
      {terms && <div style={{ marginTop: 12 }}><strong>Terms:</strong> {terms}</div>}
      {hasSow && (
        <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
          {SOW_SECTIONS.map(([key, label]) => sow[key] && (
            <div key={key} style={{ marginTop: 12, fontSize: 14 }}>
              <strong>{label}:</strong>
              <div style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{sow[key]}</div>
            </div>
          ))}
        </div>
      )}
      {hasBankDetails && (
        <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16, fontSize: 14 }}>
          <strong>Payment Details:</strong>
          {bankDetails.bankName && <div>Bank: {bankDetails.bankName}</div>}
          {bankDetails.accountNumber && <div>Account No: {bankDetails.accountNumber}</div>}
          {bankDetails.ifsc && <div>IFSC: {bankDetails.ifsc}</div>}
          {bankDetails.upiId && <div>UPI: {bankDetails.upiId}</div>}
        </div>
      )}
      {extra}
    </div>
  );
}
