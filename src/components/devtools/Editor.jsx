import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function Editor({ value, language, onChange, error, readOnly = false, height = 300 }) {
  return (
    <div style={{ border: error ? '1px solid #e53e3e' : '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 15,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          theme: 'vs',
        }}
      />
      {error && (
        <div style={{ color: '#e53e3e', padding: '8px 16px', fontSize: 14 }}>{error}</div>
      )}
    </div>
  );
}
