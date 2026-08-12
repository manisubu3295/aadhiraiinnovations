import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'
import { CONSTRUCTION_COST_PRESETS } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Construction Cost Estimator', 'description': 'Free construction cost estimator. Estimate total building cost from built-up area and a basic/standard/premium rate.', 'url': 'https://www.aadhiraiinnovations.com/tools/construction-cost-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What do basic/standard/premium mean here?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Illustrative per-sqft rate tiers reflecting finish quality — basic (minimal finishes), standard (mid-range branded materials), premium (high-end finishes and fixtures). Actual rates vary hugely by city and current material costs — use your own quote where possible.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ConstructionCostEstimator() {
  const [area, setArea] = useState('')
  const [presetKey, setPresetKey] = useState('standard')
  const [customRate, setCustomRate] = useState('')
  const preset = CONSTRUCTION_COST_PRESETS.find((p) => p.key === presetKey)
  const rate = customRate !== '' ? Number(customRate) : preset.rate
  const total = area !== '' ? Number(area) * rate : null

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Finish Quality</label>
        <div className="flex flex-wrap gap-2">{CONSTRUCTION_COST_PRESETS.map((p) => (<button key={p.key} onClick={() => { setPresetKey(p.key); setCustomRate('') }} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${presetKey === p.key && !customRate ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{p.label}</button>))}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Built-up Area (sqft)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Or Custom Rate (₹/sqft)</label><input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)} placeholder={`e.g. ${preset.rate}`} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {total !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Estimated Total Cost</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(total)}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Rate Used</span><span className="font-medium text-slate-700">₹{rate}/sqft</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter built-up area to estimate construction cost</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Illustrative rates only — actual construction cost varies hugely by city, current material prices, and design. Get a contractor quote for a real budget.</p>
      </div>
    </div>
  )
}

export default function ConstructionCostEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Construction Cost Estimator" description="Estimate total building cost from built-up area and a basic/standard/premium rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Construction Cost Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ConstructionCostEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Construction Cost Questions" items={[{ q: 'What do the quality tiers mean?', a: 'Illustrative per-sqft rates by finish quality — actual rates vary hugely by city; get a contractor quote for a real budget.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
