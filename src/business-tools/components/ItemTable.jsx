import React from 'react';

export default function ItemTable({ items, onChange, onAdd, onRemove }) {
  const handleChange = (idx, field, value) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    onChange(updated);
  };
  return (
    <div style={{ margin: '24px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
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
      <button onClick={onAdd} style={{ marginTop: 12, background: '#0B1F3A', color: '#fff', padding: '6px 16px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>Add Item</button>
    </div>
  );
}
