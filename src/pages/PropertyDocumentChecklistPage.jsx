import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Property Document Checklist Generator', 'description': 'Free reference checklist of documents typically required for a resale, new-construction, plot, or rental property transaction in India.', 'url': 'https://www.aadhiraiinnovations.com/tools/property-document-checklist', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Is this the complete legal document list?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This is a general reference checklist — exact document requirements vary by state, property type, and whether it\'s a bank-financed purchase. Always verify with a property lawyer before a transaction.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const CHECKLISTS = {
  resale: {
    label: 'Resale Property',
    items: ['Sale deed (original, chain of previous deeds)', 'Encumbrance Certificate (13-30 years)', 'Property tax receipts (up to date)', 'Occupancy Certificate', 'Approved building plan', 'Society NOC / share certificate (for apartments)', 'Seller\'s ID and PAN', 'Latest electricity/water bills'],
  },
  newConstruction: {
    label: 'New Construction (Builder)',
    items: ['RERA registration certificate', 'Approved building plan', 'Commencement Certificate', 'Land title documents', 'Builder-buyer agreement', 'Allotment letter', 'Payment schedule', 'NOC from relevant authorities (fire, pollution, airport if applicable)'],
  },
  plot: {
    label: 'Plot / Land',
    items: ['Title deed / patta', 'Encumbrance Certificate', 'Land use conversion certificate (if agricultural to non-agricultural)', 'Survey settlement records', 'Layout approval from local authority', 'Property tax receipts', 'Possession certificate'],
  },
  rental: {
    label: 'Rental Agreement',
    items: ['Rental/lease agreement (registered if long-term)', 'Owner\'s ID and address proof', 'Tenant\'s ID and address proof', 'Property tax receipt (to confirm ownership)', 'Police verification (as applicable)', 'Security deposit receipt'],
  },
}

function PropertyDocumentChecklist() {
  const [type, setType] = useState('resale')
  const checklist = CHECKLISTS[type]
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">{Object.entries(CHECKLISTS).map(([key, c]) => (<button key={key} onClick={() => setType(key)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${type === key ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{c.label}</button>))}</div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={type} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2.5">
        {checklist.items.map((item, i) => (<div key={i} className="flex items-start gap-2.5 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-[#0B1F3A] mt-0.5 flex-none" strokeWidth={1.75} />{item}</div>))}
      </motion.div>
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">A general reference checklist — exact requirements vary by state and transaction type. Verify with a property lawyer before proceeding.</p>
      </div>
    </div>
  )
}

export default function PropertyDocumentChecklistPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Property Document Checklist" description="A reference checklist of documents typically required, by transaction type." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Property Document Checklist' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PropertyDocumentChecklist /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Property Document Questions" items={[{ q: 'Is this the complete legal list?', a: 'A general reference only — requirements vary by state and property type. Verify with a property lawyer.' }]} />
      <ToolCta headline="Need custom software for your real estate business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
