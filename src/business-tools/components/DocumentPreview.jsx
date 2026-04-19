import React from 'react';

export default function DocumentPreview({ type, seller, customer, details, items, totals, notes, terms, logoUrl, extra }) {
  // type: 'invoice' | 'quotation'
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 700, margin: '0 auto', boxShadow: '0 2px 12px #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0B1F3A' }}>{type === 'invoice' ? 'INVOICE' : 'QUOTATION'}</h2>
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
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
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
      </div>
      {notes && <div style={{ marginTop: 24 }}><strong>Notes:</strong> {notes}</div>}
      {terms && <div style={{ marginTop: 12 }}><strong>Terms:</strong> {terms}</div>}
      {extra}
    </div>
  );
}
