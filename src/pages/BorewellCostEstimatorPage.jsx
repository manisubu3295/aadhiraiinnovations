import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Borewell Cost Estimator', 'description': 'Free borewell cost estimator from drilling depth, rate per foot, and casing pipe cost.', 'url': 'https://www.aadhiraiinnovations.com/tools/borewell-cost-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What affects borewell cost?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Drilling depth, rock type encountered, casing pipe length and diameter, and local water table depth — actual depth needed can vary significantly by location.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function BorewellCostEstimator() {
  const [depth, setDepth] = useState('')
  const [ratePerFt, setRatePerFt] = useState('')
  const [casingLength, setCasingLength] = useState('')
  const [casingRate, setCasingRate] = useState('')
  const hasInputs = depth !== '' && ratePerFt !== ''
  const result = hasInputs ? (() => {
    const drillingCost = Number(depth) * Number(ratePerFt)
    const casingCost = casingLength && casingRate ? Number(casingLength) * Number(casingRate) : 0
    return { drillingCost, casingCost, total: drillingCost + casingCost }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Drilling Depth (ft)</label><input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Drilling Rate (₹/ft)</label><input type="number" value={ratePerFt} onChange={(e) => setRatePerFt(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Casing Pipe Length (ft, optional)</label><input type="number" value={casingLength} onChange={(e) => setCasingLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Casing Rate (₹/ft, optional)</label><input type="number" value={casingRate} onChange={(e) => setCasingRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Estimated Cost</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.total)}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Drilling Cost</span><span className="font-medium text-slate-700">{formatINR(result.drillingCost)}</span></div>
          {result.casingCost > 0 && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Casing Pipe Cost</span><span className="font-medium text-slate-700">{formatINR(result.casingCost)}</span></div>}
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter drilling depth and rate to estimate borewell cost</p></div>)}
    </div>
  )
}

export default function BorewellCostEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Borewell Cost Estimator" description="Estimate total borewell cost from drilling depth, rate per foot, and casing pipe cost." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Borewell Cost Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BorewellCostEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Borewell Cost Questions" items={[{ q: 'What affects cost?', a: 'Depth, rock type, casing pipe, and local water table — actual depth needed varies by location.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
