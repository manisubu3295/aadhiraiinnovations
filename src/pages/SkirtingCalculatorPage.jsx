import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Skirting Calculator', 'description': 'Free skirting calculator. Find skirting length and cost from room perimeter and door widths.', 'url': 'https://www.aadhiraiinnovations.com/tools/skirting-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Should door openings be subtracted from skirting length?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — skirting isn\'t needed where a door opening interrupts the wall, so subtract the total width of door openings from the room perimeter.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function SkirtingCalculator() {
  const [perimeter, setPerimeter] = useState('')
  const [doorWidths, setDoorWidths] = useState('')
  const [rate, setRate] = useState('')
  const hasInputs = perimeter !== ''
  const length = hasInputs ? Math.max(0, Number(perimeter) - Number(doorWidths || 0)) : null
  const cost = length !== null && rate !== '' ? length * Number(rate) : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Room Perimeter (m)</label><input type="number" value={perimeter} onChange={(e) => setPerimeter(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Door Widths (m)</label><input type="number" value={doorWidths} onChange={(e) => setDoorWidths(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rate per Metre (₹, optional)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {length !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Skirting Length</span><span className="text-lg font-bold text-[#0B1F3A]">{length.toFixed(2)} m</span></div>
          {cost !== null && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Estimated Cost</span><span className="font-medium text-slate-700">{formatINR(cost)}</span></div>}
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter room perimeter to calculate skirting length</p></div>)}
    </div>
  )
}

export default function SkirtingCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Skirting Calculator" description="Find skirting length and cost from room perimeter and door widths." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Skirting Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SkirtingCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Skirting Questions" items={[{ q: 'Subtract door openings?', a: 'Yes, subtract total door opening widths from the room perimeter.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
