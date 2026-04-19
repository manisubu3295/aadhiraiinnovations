import React from 'react';
import { Link } from 'react-router-dom';
import BusinessFooter from './components/BusinessFooter';
import FaqSection from './components/FaqSection';

const tools = [
  { path: '/invoice-generator', label: 'Invoice Generator', desc: 'Create, print, and save professional invoices online.' },
  { path: '/quotation-builder', label: 'Quotation Builder', desc: 'Build and print quotations or estimates instantly.' },
  { path: '/gst-calculator', label: 'GST Calculator', desc: 'Calculate GST for your invoices. (Coming soon)' },
  { path: '/profit-calculator', label: 'Profit Calculator', desc: 'Estimate your profit margins. (Coming soon)' },
];

const faqs = [
  { q: 'What are business tools?', a: 'Business tools help small businesses, freelancers, and professionals manage billing, quotations, and calculations easily online.' },
  { q: 'Is this free to use?', a: 'Yes, all tools are free and require no login.' },
  { q: 'Can I print or save invoices?', a: 'Yes, you can print or save as PDF using the browser print dialog.' },
  { q: 'Is my data private?', a: 'All data stays in your browser and is never uploaded.' },
  { q: 'Can I save drafts?', a: 'Yes, you can save and load drafts locally.' },
  { q: 'Are these tools mobile friendly?', a: 'Yes, all tools are fully responsive.' },
  { q: 'Will more tools be added?', a: 'Yes, more business tools are planned for the future.' },
  { q: 'Who built these tools?', a: 'Aadhirai Innovations, focused on practical business solutions.' },
];

export default function BusinessToolsHubPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ color: '#0B1F3A', fontSize: 36, fontWeight: 700 }}>Free Business Tools for SMEs & Professionals</h1>
        <p style={{ color: '#334155', fontSize: 18, marginTop: 16 }}>Create invoices, quotations, and more — no login required. Fast, secure, and professional.</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
        {tools.map(tool => (
          <Link key={tool.path} to={tool.path} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 32, textDecoration: 'none', color: '#0B1F3A', boxShadow: '0 2px 8px #f1f5f9' }}>
            <h2 style={{ margin: 0 }}>{tool.label}</h2>
            <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>{tool.desc}</p>
          </Link>
        ))}
      </div>
      <section style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2>Why use these business tools?</h2>
        <ul>
          <li>Save time on paperwork</li>
          <li>Professional, print-ready documents</li>
          <li>No login or signup required</li>
          <li>Mobile and desktop friendly</li>
        </ul>
      </section>
      <FaqSection faqs={faqs} />
      <BusinessFooter />
    </div>
  );
}
