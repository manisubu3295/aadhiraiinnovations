import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Modular Furniture Cost Estimator', 'description': 'Free modular kitchen/wardrobe cost estimator from running feet and a per-foot rate.', 'url': 'https://www.aadhiraiinnovations.com/tools/modular-furniture-cost-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is "running feet" pricing?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Modular kitchens/wardrobes are commonly priced per running foot of cabinet length (not floor area) — rates vary by material (laminate, acrylic, PU) and hardware quality.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ModularFurnitureCostEstimator() {
  const [type, setType] = useState('kitchen')
  const [runningFeet, setRunningFeet] = useState('')
  const [rate, setRate] = useState('1200')
  const hasInputs = runningFeet !== '' && rate !== ''
  const total = hasInputs ? Number(runningFeet) * Number(rate) : null
  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'kitchen', l: 'Modular Kitchen' }, { k: 'wardrobe', l: 'Wardrobe' }].map((t) => (<button key={t.k} onClick={() => setType(t.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${type === t.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{t.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Running Feet</label><input type="number" value={runningFeet} onChange={(e) => setRunningFeet(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rate per Running Foot (₹)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {total !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Estimated Cost</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(total)}</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter running feet and rate to estimate cost</p></div>)}
    </div>
  )
}

export default function ModularFurnitureCostEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Modular Furniture Cost Estimator" description="Estimate modular kitchen or wardrobe cost from running feet and a per-foot rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Modular Furniture Cost Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ModularFurnitureCostEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Modular Furniture Questions" items={[{ q: 'What is running feet pricing?', a: 'Priced per running foot of cabinet length, not floor area — rates vary by material and hardware.' }]} />
      <ToolCta headline="Need custom software for your interior design business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
