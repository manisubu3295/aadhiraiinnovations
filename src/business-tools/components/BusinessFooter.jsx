import React from 'react';

export default function BusinessFooter() {
  return (
    <footer style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#0B1F3A', background: '#f8fafc' }}>
      <div>Built by <strong>Aadhirai Innovations</strong></div>
      <div style={{ fontSize: 14, marginTop: 4, color: '#64748b' }}>
        Need a full billing or business software solution? <a href="/products" style={{ color: '#0B1F3A', textDecoration: 'underline' }}>Explore our products</a>.
      </div>
    </footer>
  );
}
