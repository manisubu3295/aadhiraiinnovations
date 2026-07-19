import React from 'react';

const DEFAULT_LABELS = { description: 'Description', quantity: 'Qty', unitPrice: 'Unit Price', add: 'Add Item' };
const LABELS_BY_BILLING_TYPE = {
  MILESTONE: { description: 'Milestone / Deliverable', quantity: 'Qty', unitPrice: 'Amount', add: 'Add Milestone' },
  HOURLY: { description: 'Task', quantity: 'Hours', unitPrice: 'Rate', add: 'Add Entry' },
};

export default function ItemTable({ items, onChange, onAdd, onRemove, billingType }) {
  const labels = LABELS_BY_BILLING_TYPE[billingType] || DEFAULT_LABELS;
  const handleChange = (idx, field, value) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    onChange(updated);
  };
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>{labels.description}</th>
            <th>{labels.quantity}</th>
            <th>{labels.unitPrice}</th>
            <th>Tax %</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td><input value={item.description} onChange={e => handleChange(idx, 'description', e.target.value)} style={{ width: '100%' }} /></td>
              <td><input type="number" value={item.quantity} min={1} onChange={e => handleChange(idx, 'quantity', e.target.value)} style={{ width: 60 }} /></td>
              <td><input type="number" value={item.unitPrice} min={0} onChange={e => handleChange(idx, 'unitPrice', e.target.value)} style={{ width: 80 }} /></td>
              <td><input type="number" value={item.tax} min={0} onChange={e => handleChange(idx, 'tax', e.target.value)} style={{ width: 60 }} /></td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>
                {((item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.tax || 0) / 100)).toFixed(2)}
              </td>
              <td>
                <button onClick={() => onRemove(idx)} style={{ color: '#e53e3e', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={onAdd} style={{ marginTop: 12, background: '#0B1F3A', color: '#fff', padding: '6px 16px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>{labels.add}</button>
    </div>
  );
}
