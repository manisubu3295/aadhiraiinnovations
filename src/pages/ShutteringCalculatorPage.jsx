import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Shuttering / Formwork Calculator', 'description': 'Free shuttering calculator. Find the number of plywood sheets needed for a given contact area.', 'url': 'https://www.aadhiraiinnovations.com/tools/shuttering-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is contact area in shuttering?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The total surface area of formwork touching the fresh concrete — for a slab this is the soffit area, for a column/beam it\'s the side and bottom surface area.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ShutteringCalculator() {
  const [area, setArea] = useState('')
  const [sheetLength, setSheetLength] = useState('2.44')
  const [sheetWidth, setSheetWidth] = useState('1.22')
  const [wastage, setWastage] = useState(10)
  const hasInputs = area !== '' && sheetLength !== '' && sheetWidth !== ''
  const result = hasInputs ? (() => {
    const sheetArea = Number(sheetLength) * Number(sheetWidth)
    const sheets = Math.ceil((Number(area) / sheetArea) * (1 + wastage / 100))
    return { sheetArea, sheets }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Contact Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wastage (%)</label><input type="number" value={wastage} onChange={(e) => setWastage(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Sheet Length (m)</label><input type="number" value={sheetLength} onChange={(e) => setSheetLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Sheet Width (m)</label><input type="number" value={sheetWidth} onChange={(e) => setSheetWidth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Plywood Sheets Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.sheets}</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter contact area and sheet size to calculate sheets needed</p></div>)}
    </div>
  )
}

export default function ShutteringCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Shuttering / Formwork Calculator" description="Find the number of plywood sheets needed for a given concrete contact area." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Shuttering Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ShutteringCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Shuttering Questions" items={[{ q: 'What is contact area?', a: 'The formwork surface touching fresh concrete — soffit for slabs, sides+bottom for beams/columns.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
