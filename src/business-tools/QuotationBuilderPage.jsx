import React, { useState } from 'react';
import ItemTable from './components/ItemTable';
import DocumentPreview from './components/DocumentPreview';
import PrintButton from './components/PrintButton';
import SaveDraftButton from './components/SaveDraftButton';
import BusinessFooter from './components/BusinessFooter';
import FaqSection from './components/FaqSection';
import { calculateTotals } from './utils/invoiceUtils';

const defaultSeller = { businessName: '', contactPerson: '', address: '', phone: '', email: '', gst: '' };
const defaultClient = { name: '', company: '', address: '', phone: '', email: '', gst: '' };
const defaultDetails = { quotationNumber: '', date: '', validUntil: '', subject: '', notes: '', terms: '' };
const defaultItem = { description: '', quantity: 1, unitPrice: 0, tax: 0 };

export default function QuotationBuilderPage() {
  const [seller, setSeller] = useState(defaultSeller);
  const [client, setClient] = useState(defaultClient);
  const [details, setDetails] = useState(defaultDetails);
  const [items, setItems] = useState([{ ...defaultItem }]);
  const [discount, setDiscount] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [acceptance, setAcceptance] = useState('');

  const totals = calculateTotals(items, discount);

  // Draft save/load/clear
  const handleSaveDraft = () => {
    localStorage.setItem('quotationDraft', JSON.stringify({ seller, client, details, items, discount, logoUrl, notes, terms, acceptance }));
    alert('Draft saved!');
  };
  const handleLoadDraft = () => {
    const draft = localStorage.getItem('quotationDraft');
    if (draft) {
      const d = JSON.parse(draft);
      setSeller(d.seller); setClient(d.client); setDetails(d.details); setItems(d.items); setDiscount(d.discount); setLogoUrl(d.logoUrl); setNotes(d.notes); setTerms(d.terms); setAcceptance(d.acceptance);
    }
  };
  const handleClear = () => {
    setSeller(defaultSeller); setClient(defaultClient); setDetails(defaultDetails); setItems([{ ...defaultItem }]); setDiscount(0); setLogoUrl(''); setNotes(''); setTerms(''); setAcceptance('');
  };

  // Logo upload
  const handleLogo = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setLogoUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#0B1F3A', fontSize: 32, fontWeight: 700 }}>Quotation / Estimate Builder</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
        <form style={{ flex: 1, minWidth: 320, background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #f1f5f9' }} onSubmit={e => e.preventDefault()}>
          <h2>Seller Details</h2>
          <input placeholder="Business Name" value={seller.businessName} onChange={e => setSeller(s => ({ ...s, businessName: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Contact Person" value={seller.contactPerson} onChange={e => setSeller(s => ({ ...s, contactPerson: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Address" value={seller.address} onChange={e => setSeller(s => ({ ...s, address: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Phone" value={seller.phone} onChange={e => setSeller(s => ({ ...s, phone: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Email" value={seller.email} onChange={e => setSeller(s => ({ ...s, email: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="GST Number (optional)" value={seller.gst} onChange={e => setSeller(s => ({ ...s, gst: e.target.value }))} style={{ width: '100%', marginBottom: 16 }} />
          <h2>Client Details</h2>
          <input placeholder="Client Name" value={client.name} onChange={e => setClient(c => ({ ...c, name: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Company Name (optional)" value={client.company} onChange={e => setClient(c => ({ ...c, company: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Address" value={client.address} onChange={e => setClient(c => ({ ...c, address: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Phone" value={client.phone} onChange={e => setClient(c => ({ ...c, phone: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Email" value={client.email} onChange={e => setClient(c => ({ ...c, email: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="GST Number (optional)" value={client.gst} onChange={e => setClient(c => ({ ...c, gst: e.target.value }))} style={{ width: '100%', marginBottom: 16 }} />
          <h2>Quotation Details</h2>
          <input placeholder="Quotation Number" value={details.quotationNumber} onChange={e => setDetails(d => ({ ...d, quotationNumber: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input type="date" placeholder="Date" value={details.date} onChange={e => setDetails(d => ({ ...d, date: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input type="date" placeholder="Valid Until" value={details.validUntil} onChange={e => setDetails(d => ({ ...d, validUntil: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <input placeholder="Subject / Project Title" value={details.subject} onChange={e => setDetails(d => ({ ...d, subject: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={e => setTerms(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <label style={{ display: 'block', margin: '8px 0' }}>Logo (optional): <input type="file" accept="image/*" onChange={handleLogo} /></label>
          <h2>Items</h2>
          <ItemTable
            items={items}
            onChange={setItems}
            onAdd={() => setItems([...items, { ...defaultItem }])}
            onRemove={idx => setItems(items.filter((_, i) => i !== idx))}
          />
          <div style={{ margin: '12px 0' }}>
            Discount: <input type="number" value={discount} min={0} onChange={e => setDiscount(e.target.value)} style={{ width: 80, marginLeft: 8 }} />
          </div>
          <SaveDraftButton onSave={handleSaveDraft} onLoad={handleLoadDraft} onClear={handleClear} />
        </form>
        <div style={{ flex: 1, minWidth: 340 }}>
          <div id="quotation-preview">
            <DocumentPreview
              type="quotation"
              seller={seller}
              customer={client}
              details={details}
              items={items}
              totals={totals}
              notes={notes}
              terms={terms}
              logoUrl={logoUrl}
              extra={acceptance && <div style={{ marginTop: 24 }}><strong>Acceptance Note:</strong> {acceptance}</div>}
            />
          </div>
          <div style={{ margin: '24px 0' }}>
            <PrintButton targetId="quotation-preview" />
          </div>
        </div>
      </div>
      <section style={{ maxWidth: 800, margin: '40px auto' }}>
        <h2>What is a quotation builder?</h2>
        <p>A quotation builder helps you create professional quotations or estimates for your business, ready to print or save as PDF. It helps you communicate pricing and terms clearly to clients.</p>
        <h2>When to use a quotation?</h2>
        <p>Use a quotation when you need to provide a price estimate for goods or services before a sale is confirmed.</p>
        <h2>How to create a professional quotation?</h2>
        <ol>
          <li>Fill in your business and client details</li>
          <li>Add line items and taxes</li>
          <li>Review the live preview</li>
          <li>Print or save as PDF</li>
        </ol>
      </section>
      <FaqSection faqs={[
        { q: 'Is this quotation builder free?', a: 'Yes, it is 100% free and requires no login.' },
        { q: 'Can I save my quotation as PDF?', a: 'Yes, use the Print button and select "Save as PDF" in your browser.' },
        { q: 'Is my data private?', a: 'All data stays in your browser and is never uploaded.' },
        { q: 'Can I add my logo?', a: 'Yes, you can upload a logo to appear on your quotation.' },
        { q: 'Can I save drafts?', a: 'Yes, you can save and load drafts locally.' },
        { q: 'Is this tool mobile friendly?', a: 'Yes, it works on all devices.' },
        { q: 'Can I add taxes and discounts?', a: 'Yes, you can add tax % per item and a discount.' },
        { q: 'Who built this tool?', a: 'Aadhirai Innovations, focused on practical business solutions.' },
      ]} />
      <BusinessFooter />
    </div>
  );
}
