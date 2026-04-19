import React, { useState } from 'react';
import DocumentCanvas from './components/DocumentCanvas';
import EditableText from './components/EditableText';
import EditableNumber from './components/EditableNumber';
import EditableTable from './components/EditableTable';
import TotalsSection from './components/TotalsSection';

const defaultBusiness = { name: 'Your Business Name', address: 'Business Address', phone: '', email: '', gst: '' };
const defaultClient = { name: 'Client Name', company: '', address: '', contact: '' };
const defaultItems = [{ description: '', quantity: 1, unitPrice: 0, tax: 0 }];
const defaultNotes = '';
const defaultTerms = '';

export default function InlineDocumentBuilderPage() {
  const [business, setBusiness] = useState(defaultBusiness);
  const [client, setClient] = useState(defaultClient);
  const [items, setItems] = useState(defaultItems);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState(defaultNotes);
  const [terms, setTerms] = useState(defaultTerms);
  const [docType, setDocType] = useState('INVOICE');

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="flex justify-center mb-4">
        <button className={`px-4 py-2 rounded-l ${docType==='INVOICE'?'bg-blue-900 text-white':'bg-slate-200'}`} onClick={()=>setDocType('INVOICE')}>INVOICE</button>
        <button className={`px-4 py-2 rounded-r ${docType==='QUOTATION'?'bg-blue-900 text-white':'bg-slate-200'}`} onClick={()=>setDocType('QUOTATION')}>QUOTATION</button>
      </div>
      <div className="print-area">
        <DocumentCanvas>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <EditableText value={business.name} onChange={v=>setBusiness(b=>({...b, name:v}))} className="text-2xl font-bold text-blue-900" placeholder="Business Name" />
            <EditableText value={business.address} onChange={v=>setBusiness(b=>({...b, address:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Address" />
            <EditableText value={business.phone} onChange={v=>setBusiness(b=>({...b, phone:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Phone" />
            <EditableText value={business.email} onChange={v=>setBusiness(b=>({...b, email:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Email" />
            <EditableText value={business.gst} onChange={v=>setBusiness(b=>({...b, gst:v}))} className="block text-sm text-slate-600 mt-1" placeholder="GST Number" />
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-900">{docType}</span>
          </div>
        </div>
        {/* Client Section */}
        <div className="mb-4">
          <div className="font-semibold text-slate-700 mb-1">Bill To:</div>
          <EditableText value={client.name} onChange={v=>setClient(c=>({...c, name:v}))} className="block text-base font-semibold text-blue-900" placeholder="Client Name" />
          <EditableText value={client.company} onChange={v=>setClient(c=>({...c, company:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Company" />
          <EditableText value={client.address} onChange={v=>setClient(c=>({...c, address:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Address" />
          <EditableText value={client.contact} onChange={v=>setClient(c=>({...c, contact:v}))} className="block text-sm text-slate-600 mt-1" placeholder="Contact" />
        </div>
        {/* Items Table */}
        <EditableTable items={items} onChange={setItems} />
        {/* Totals Section */}
        <TotalsSection items={items} discount={discount} onDiscountChange={setDiscount} />
        {/* Footer */}
        <div className="mt-8">
          <div className="font-semibold text-slate-700 mb-1">Notes</div>
          <EditableText value={notes} onChange={setNotes} className="block text-sm text-slate-600" placeholder="Add notes..." multiline />
          <div className="font-semibold text-slate-700 mb-1 mt-4">Terms & Conditions</div>
          <EditableText value={terms} onChange={setTerms} className="block text-sm text-slate-600" placeholder="Add terms..." multiline />
          <div className="mt-8 text-right text-slate-400 italic">Signature</div>
        </div>
        </DocumentCanvas>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <button className="px-4 py-2 bg-blue-900 text-white rounded" onClick={()=>window.print()}>Print / Save as PDF</button>
        <button className="px-4 py-2 bg-slate-200 rounded" onClick={()=>{
          setBusiness(defaultBusiness); setClient(defaultClient); setItems(defaultItems); setDiscount(0); setNotes(''); setTerms('');
        }}>Reset</button>
      </div>
    </div>
  );
}
