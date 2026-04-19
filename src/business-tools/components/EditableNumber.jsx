import React, { useState, useRef, useEffect } from 'react';

export default function EditableNumber({ value, onChange, className = '', placeholder = '', style = {}, min = 0, max, step = 1 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || 0);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value || 0);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    let num = parseFloat(draft);
    if (isNaN(num)) num = min || 0;
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    if (num !== value) onChange(num);
  };

  return editing ? (
    <input
      ref={ref}
      type="number"
      className={`editable-input ${className}`}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
      style={style}
      min={min}
      max={max}
      step={step}
    />
  ) : (
    <span
      className={`editable-text ${className}`}
      style={{ cursor: 'pointer', ...style, borderBottom: '1px dashed #cbd5e1', minWidth: 24 }}
      tabIndex={0}
      onClick={() => setEditing(true)}
      onFocus={() => setEditing(true)}
      title="Click to edit"
    >
      {value !== undefined && value !== null ? value : <span style={{ color: '#94a3b8' }}>{placeholder}</span>}
    </span>
  );
}
