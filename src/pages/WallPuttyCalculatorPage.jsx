import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Wall Putty Calculator', 'description': 'Free wall putty calculator. Find the putty quantity needed for a wall area and number of coats.', 'url': 'https://www.aadhiraiinnovations.com/tools/wall-putty-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How many coats of putty are typically applied?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Usually 2 coats, applied perpendicular to each other, before painting — check your specific putty product\'s recommendation.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function WallPuttyCalculator() {
  const [area, setArea] = useState('')
  const [coverage, setCoverage] = useState('0.4')
  const [coats, setCoats] = useState(2)
  const hasInputs = area !== '' && coverage !== ''
  const kg = hasInputs ? Number(area) * Number(coverage) * Number(coats) : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Coverage (kg/m²/coat)</label><input type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Coats</label><input type="number" value={coats} onChange={(e) => setCoats(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {kg !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Putty Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{kg.toFixed(1)} kg</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter area and coverage to calculate putty needed</p></div>)}
    </div>
  )
}

export default function WallPuttyCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Wall Putty Calculator" description="Find the putty quantity needed for a wall area and number of coats." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Wall Putty Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><WallPuttyCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Wall Putty Questions" items={[{ q: 'How many coats?', a: 'Usually 2, applied perpendicular to each other — check your product recommendation.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
