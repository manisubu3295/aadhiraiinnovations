import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Column Size Estimator', 'description': 'Free preliminary column size estimator from axial load and concrete grade, for early planning only.', 'url': 'https://www.aadhiraiinnovations.com/tools/column-size-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is preliminary column size estimated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A common thumb rule: Required Area = Axial Load ÷ (0.4 × fck), where fck is the concrete grade\'s characteristic strength — this ignores reinforcement contribution and slenderness, so it\'s a rough starting size only.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ColumnSizeEstimator() {
  const [load, setLoad] = useState('')
  const [fck, setFck] = useState('20')
  const hasInputs = load !== '' && fck !== '' && Number(load) > 0
  const result = hasInputs ? (() => {
    const areaMm2 = (Number(load) * 1000) / (0.4 * Number(fck)) // load in kN -> N
    const side = Math.sqrt(areaMm2)
    return { areaMm2, side }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Axial Load (kN)</label><input type="number" value={load} onChange={(e) => setLoad(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Concrete Grade (fck, N/mm²)</label><input type="number" value={fck} onChange={(e) => setFck(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Preliminary Square Column Size</span><span className="text-lg font-bold text-[#0B1F3A]">{result.side.toFixed(0)} × {result.side.toFixed(0)} mm</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Required Cross-Section Area</span><span className="font-medium text-slate-700">{result.areaMm2.toFixed(0)} mm²</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter axial load and concrete grade to estimate column size</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Preliminary thumb-rule sizing only — ignores reinforcement contribution, slenderness, and eccentricity. Never a substitute for structural design by a qualified engineer.</p>
      </div>
    </div>
  )
}

export default function ColumnSizeEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Column Size Estimator" description="Get a preliminary column size from axial load and concrete grade — for early planning only." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Column Size Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ColumnSizeEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Column Size Questions" items={[{ q: 'How is size estimated?', a: 'Area = Load ÷ (0.4 × fck) — a rough thumb rule ignoring reinforcement and slenderness.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
