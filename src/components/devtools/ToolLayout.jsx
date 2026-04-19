import React from 'react';

export default function ToolLayout({ left, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 32, flexWrap: 'wrap', margin: '32px 0' }}>
      <div style={{ flex: 1, minWidth: 320 }}>{left}</div>
      <div style={{ flex: 1, minWidth: 320 }}>{right}</div>
    </div>
  );
}
