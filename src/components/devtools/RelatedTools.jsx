import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { path: '/tools/json-formatter', label: 'JSON Formatter' },
  { path: '/tools/xml-formatter', label: 'XML Formatter' },
  { path: '/tools/text-formatter', label: 'Text Formatter' },
  { path: '/tools/json-to-xml', label: 'JSON → XML Converter' },
  { path: '/tools/xml-to-json', label: 'XML → JSON Converter' },
];

export default function RelatedTools({ current }) {
  return (
    <div style={{ margin: '32px 0' }}>
      <h3>Related Tools</h3>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 16, listStyle: 'none', padding: 0 }}>
        {tools.filter(t => t.path !== current).map(t => (
          <li key={t.path}>
            <Link to={t.path} style={{ color: '#0B1F3A', textDecoration: 'underline' }}>{t.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
