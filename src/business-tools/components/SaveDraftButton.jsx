import React from 'react';

export default function SaveDraftButton({ onSave, onLoad, onClear, disabled }) {
  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
      <button onClick={onSave} disabled={disabled} style={{ background: '#0B1F3A', color: '#fff', padding: '6px 16px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
      <button onClick={onLoad} style={{ background: '#64748b', color: '#fff', padding: '6px 16px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>Load Draft</button>
      <button onClick={onClear} style={{ background: '#e53e3e', color: '#fff', padding: '6px 16px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
    </div>
  );
}
