import React, { useState, useRef, useEffect } from 'react';

export default function EditableText({ value, onChange, className = '', placeholder = '', style = {}, multiline = false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value || '');
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  return editing ? (
    multiline ? (
      <textarea
        ref={ref}
        className={`editable-textarea ${className}`}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
        style={style}
        rows={2}
      />
    ) : (
      <input
        ref={ref}
        className={`editable-input ${className}`}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
        style={style}
      />
    )
  ) : (
    <span
      className={`editable-text ${className}`}
      style={{ cursor: 'pointer', ...style, borderBottom: '1px dashed #cbd5e1', minWidth: 24 }}
      tabIndex={0}
      onClick={() => setEditing(true)}
      onFocus={() => setEditing(true)}
      title="Click to edit"
    >
      {value || <span className="print-hidden" style={{ color: '#94a3b8' }}>{placeholder}</span>}
    </span>
  );
}
