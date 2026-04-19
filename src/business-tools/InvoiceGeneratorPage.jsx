import React, { useState } from 'react';

import DocumentBuilderLayout from './components/DocumentBuilderLayout';
import LeftPanelSection from './components/LeftPanelSection';
import ItemTable from './components/ItemTable';
import PricingSummary from './components/PricingSummary';
import PrintButton from './components/PrintButton';
import PrintView from './components/PrintView';
import SaveDraftButton from './components/SaveDraftButton';
import BusinessFooter from './components/BusinessFooter';
import FaqSection from './components/FaqSection';
import DocumentPreview from './components/DocumentPreview';
import { calculateTotals } from './utils/invoiceUtils';

const defaultSeller = { businessName: '', contactPerson: '', address: '', phone: '', email: '', gst: '' };
const defaultCustomer = { name: '', company: '', address: '', phone: '', email: '', gst: '' };
const defaultDetails = { invoiceNumber: '', invoiceDate: '', dueDate: '', currency: 'INR', notes: '', terms: '' };
const defaultItem = { description: '', quantity: 1, unitPrice: 0, tax: 0 };

export default function InvoiceGeneratorPage() {
  const [seller, setSeller] = useState(defaultSeller);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [details, setDetails] = useState(defaultDetails);
  const [items, setItems] = useState([{ ...defaultItem }]);
  const [discount, setDiscount] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

  const totals = calculateTotals(items, discount);

  // Draft save/load/clear
  const handleSaveDraft = () => {
    localStorage.setItem('invoiceDraft', JSON.stringify({ seller, customer, details, items, discount, logoUrl, notes, terms }));
    alert('Draft saved!');
  };
  const handleLoadDraft = () => {
    const draft = localStorage.getItem('invoiceDraft');
    if (draft) {
      const d = JSON.parse(draft);
      setSeller(d.seller); setCustomer(d.customer); setDetails(d.details); setItems(d.items); setDiscount(d.discount); setLogoUrl(d.logoUrl); setNotes(d.notes); setTerms(d.terms);
    }
  };
  const handleClear = () => {
    setSeller(defaultSeller); setCustomer(defaultCustomer); setDetails(defaultDetails); setItems([{ ...defaultItem }]); setDiscount(0); setLogoUrl(''); setNotes(''); setTerms('');
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
    <>
      <div className="pt-8 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-2">Free Invoice Generator India</h1>
        <p className="text-slate-500 text-lg mb-6">Create & Download GST-compliant invoices. Professional, fast, and always free.</p>
      </div>
      <DocumentBuilderLayout
        left={
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <LeftPanelSection title="Business Details" icon={<span>🏢</span>}>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">Logo</label>
                <input type="file" accept="image/*" onChange={handleLogo} className="mb-2" />
                <input className="input w-full" placeholder="Business Name" value={seller.businessName} onChange={e => setSeller(s => ({ ...s, businessName: e.target.value }))} />
                <input className="input w-full" placeholder="Contact Person" value={seller.contactPerson} onChange={e => setSeller(s => ({ ...s, contactPerson: e.target.value }))} />
                <input className="input w-full" placeholder="Address" value={seller.address} onChange={e => setSeller(s => ({ ...s, address: e.target.value }))} />
                <input className="input w-full" placeholder="Phone" value={seller.phone} onChange={e => setSeller(s => ({ ...s, phone: e.target.value }))} />
                <input className="input w-full" placeholder="Email" value={seller.email} onChange={e => setSeller(s => ({ ...s, email: e.target.value }))} />
                <input className="input w-full" placeholder="GST Number (optional)" value={seller.gst} onChange={e => setSeller(s => ({ ...s, gst: e.target.value }))} />
              </div>
            </LeftPanelSection>
            <LeftPanelSection title="Client Details" icon={<span>👤</span>}>
              <div className="space-y-2">
                <input className="input w-full" placeholder="Client Name" value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
                <input className="input w-full" placeholder="Company Name (optional)" value={customer.company} onChange={e => setCustomer(c => ({ ...c, company: e.target.value }))} />
                <input className="input w-full" placeholder="Address" value={customer.address} onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))} />
                <input className="input w-full" placeholder="Phone" value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} />
                <input className="input w-full" placeholder="Email" value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} />
                <input className="input w-full" placeholder="GST Number (optional)" value={customer.gst} onChange={e => setCustomer(c => ({ ...c, gst: e.target.value }))} />
              </div>
            </LeftPanelSection>
            <LeftPanelSection title="Document Details" icon={<span>📄</span>}>
              <div className="space-y-2">
                <input className="input w-full" placeholder="Invoice Number" value={details.invoiceNumber} onChange={e => setDetails(d => ({ ...d, invoiceNumber: e.target.value }))} />
                <input className="input w-full" type="date" placeholder="Invoice Date" value={details.invoiceDate} onChange={e => setDetails(d => ({ ...d, invoiceDate: e.target.value }))} />
                <input className="input w-full" type="date" placeholder="Due Date" value={details.dueDate} onChange={e => setDetails(d => ({ ...d, dueDate: e.target.value }))} />
                <input className="input w-full" placeholder="Currency (e.g. INR, USD)" value={details.currency} onChange={e => setDetails(d => ({ ...d, currency: e.target.value }))} />
              </div>
            </LeftPanelSection>
            <LeftPanelSection title="Items" icon={<span>🧾</span>}>
              <ItemTable
                items={items}
                onChange={setItems}
                onAdd={() => setItems([...items, { ...defaultItem }])}
                onRemove={idx => setItems(items.filter((_, i) => i !== idx))}
              />
            </LeftPanelSection>
            <LeftPanelSection title="Pricing Summary" icon={<span>💰</span>}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Discount:</span>
                  <input type="number" min={0} className="input w-24" value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                <PricingSummary
                  subtotal={totals.subtotal}
                  taxTotal={totals.taxTotal}
                  discount={totals.discount}
                  grandTotal={totals.grandTotal}
                  currency={details.currency || 'INR'}
                />
              </div>
            </LeftPanelSection>
            <LeftPanelSection title="Additional Info" icon={<span>📝</span>}>
              <textarea className="input w-full" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
              <textarea className="input w-full mt-2" placeholder="Terms & Conditions" value={terms} onChange={e => setTerms(e.target.value)} />
            </LeftPanelSection>
            <div className="flex gap-2 mt-4">
              <SaveDraftButton onSave={handleSaveDraft} onLoad={handleLoadDraft} onClear={handleClear} />
            </div>
          </form>
        }
        right={
          <>
            <div className="mb-4 flex justify-end">
              <PrintButton targetId="invoice-preview" />
            </div>
            <PrintView>
              <div id="invoice-preview">
                <DocumentPreview
                  type="invoice"
                  seller={seller}
                  customer={customer}
                  details={details}
                  items={items}
                  totals={totals}
                  notes={notes}
                  terms={terms}
                  logoUrl={logoUrl}
                />
              </div>
            </PrintView>
          </>
        }
      />
      <section className="max-w-2xl mx-auto mt-12 mb-8 px-2">
        <h2 className="text-xl font-semibold text-[#0B1F3A] mb-2">What is an invoice generator?</h2>
        <p className="mb-4 text-slate-600">An invoice generator helps you create professional invoices for your business, ready to print or save as PDF. It saves time, ensures accuracy, and helps you get paid faster.</p>
        <h2 className="text-lg font-semibold text-[#0B1F3A] mb-2">When to use an invoice?</h2>
        <p className="mb-4 text-slate-600">Use an invoice whenever you need to request payment for goods or services provided to a customer.</p>
        <h2 className="text-lg font-semibold text-[#0B1F3A] mb-2">How to create a professional invoice?</h2>
        <ol className="list-decimal list-inside text-slate-600 space-y-1">
          <li>Fill in your business and customer details</li>
          <li>Add line items and taxes</li>
          <li>Review the live preview</li>
          <li>Print or save as PDF</li>
        </ol>
      </section>
      <FaqSection faqs={[
        { q: 'Is this invoice generator free?', a: 'Yes, it is 100% free and requires no login.' },
        { q: 'Can I save my invoice as PDF?', a: 'Yes, use the Print button and select "Save as PDF" in your browser.' },
        { q: 'Is my data private?', a: 'All data stays in your browser and is never uploaded.' },
        { q: 'Can I add my logo?', a: 'Yes, you can upload a logo to appear on your invoice.' },
        { q: 'Can I save drafts?', a: 'Yes, you can save and load drafts locally.' },
        { q: 'Is this tool mobile friendly?', a: 'Yes, it works on all devices.' },
        { q: 'Can I add taxes and discounts?', a: 'Yes, you can add tax % per item and a discount.' },
        { q: 'Who built this tool?', a: 'Aadhirai Innovations, focused on practical business solutions.' },
      ]} />
      <BusinessFooter />
    </>
  );
}
