import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Beam Depth Estimator', 'description': 'Free preliminary beam depth estimator using the span-to-depth thumb rule, for early planning only.', 'url': 'https://www.aadhiraiinnovations.com/tools/beam-depth-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the span-to-depth thumb rule?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A rough preliminary sizing rule: beam depth ≈ span ÷ 10 to span ÷ 15, depending on load. It\'s a starting point for early planning, never a substitute for structural design by a qualified engineer.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function BeamDepthEstimator() {
  const [span, setSpan] = useState('')
  const hasInputs = span !== '' && Number(span) > 0
  const result = hasInputs ? { min: Number(span) / 15, max: Number(span) / 10 } : null
  return (
    <div className="space-y-8">
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Beam Span (m)</label><input type="number" value={span} onChange={(e) => setSpan(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Preliminary Depth Range</span><span className="text-lg font-bold text-[#0B1F3A]">{(result.min * 1000).toFixed(0)}–{(result.max * 1000).toFixed(0)} mm</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter beam span to estimate a preliminary depth range</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Preliminary/thumb-rule estimate only (span÷10 to span÷15) — never a substitute for structural design by a qualified engineer accounting for actual loads.</p>
      </div>
    </div>
  )
}

export default function BeamDepthEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Beam Depth Estimator" description="Get a preliminary beam depth range from span, using the standard thumb rule — for early planning only." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Beam Depth Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BeamDepthEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Beam Depth Questions" items={[{ q: 'What is the span-to-depth thumb rule?', a: 'Depth ≈ span÷10 to span÷15 — a rough starting point, not a substitute for engineering design.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
