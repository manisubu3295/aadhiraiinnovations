import React from 'react';
import EditableText from './EditableText';
import EditableNumber from './EditableNumber';

export default function EditableTable({ items, onChange }) {
  const handleCell = (idx, key, value) => {
    const updated = items.map((row, i) => i === idx ? { ...row, [key]: value } : row);
    onChange(updated);
  };
  const handleAdd = () => onChange([...items, { description: '', quantity: 1, unitPrice: 0, tax: 0 }]);
  const handleRemove = idx => onChange(items.filter((_, i) => i !== idx));

  return (
    <>
      <table className="w-full border-collapse text-sm mb-4">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">Description</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit Price</th>
            <th className="p-2">Tax %</th>
            <th className="p-2">Amount</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="p-2"><EditableText value={row.description} onChange={v => handleCell(idx, 'description', v)} placeholder="Description" /></td>
              <td className="p-2"><EditableNumber value={row.quantity} onChange={v => handleCell(idx, 'quantity', v)} min={1} /></td>
              <td className="p-2"><EditableNumber value={row.unitPrice} onChange={v => handleCell(idx, 'unitPrice', v)} min={0} step={0.01} /></td>
              <td className="p-2"><EditableNumber value={row.tax} onChange={v => handleCell(idx, 'tax', v)} min={0} max={100} step={0.01} /></td>
              <td className="p-2 font-semibold text-right">{((row.quantity * row.unitPrice) * (1 + row.tax / 100)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
              <td className="p-2"><button className="text-red-500 hover:underline" onClick={() => handleRemove(idx)} title="Delete row">✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300 text-sm" onClick={handleAdd}>+ Add Row</button>
    </>
  );
}
