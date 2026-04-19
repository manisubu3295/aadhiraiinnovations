import React from 'react';

export default function FaqSection({ faqs }) {
  return (
    <section style={{ margin: '32px 0' }}>
      <h2>Frequently Asked Questions</h2>
      <div>
        {faqs.map((faq, i) => (
          <details key={i} style={{ marginBottom: 12, background: '#f1f5f9', borderRadius: 6, padding: 12 }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{faq.q}</summary>
            <div style={{ marginTop: 8 }}>{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
