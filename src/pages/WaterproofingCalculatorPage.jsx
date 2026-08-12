import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Waterproofing Calculator', 'description': 'Free waterproofing material calculator. Find the quantity and cost of waterproofing compound for a given area.', 'url': 'https://www.aadhiraiinnovations.com/tools/waterproofing-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What coverage rate should I use?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Coverage varies significantly by product (cementitious coating, liquid membrane, etc.) — check the manufacturer\'s technical data sheet for the exact kg/m² rate per coat.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function WaterproofingCalculator() {
  const [area, setArea] = useState('')
  const [coverageRate, setCoverageRate] = useState('1.5')
  const [coats, setCoats] = useState(2)
  const [pricePerKg, setPricePerKg] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = area !== '' && coverageRate !== ''
  const result = hasInputs ? (() => {
    const kg = Number(area) * Number(coverageRate) * Number(coats)
    const cost = pricePerKg ? kg * Number(pricePerKg) : null
    return { kg, cost }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Area: ${area} m²\nMaterial Needed: ${result.kg.toFixed(1)} kg${result.cost ? `\nEstimated Cost: ${formatINR(result.cost)}` : ''}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setArea(''); setCoverageRate('1.5'); setCoats(2); setPricePerKg('') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Coverage Rate (kg/m²/coat)</label><input type="number" value={coverageRate} onChange={(e) => setCoverageRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Coats</label><input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Price per kg (₹, optional)</label><input type="number" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Material Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.kg.toFixed(1)} kg</span></div>
            {result.cost !== null && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Estimated Cost</span><span className="font-medium text-slate-700">{formatINR(result.cost)}</span></div>}
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter area and coverage rate to calculate waterproofing material needed</p></div>)}
    </div>
  )
}

export default function WaterproofingCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Waterproofing Calculator" description="Find the quantity and cost of waterproofing compound needed for a given area." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Waterproofing Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><WaterproofingCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Waterproofing Questions" items={[{ q: 'What coverage rate should I use?', a: 'Check your product\'s technical data sheet — it varies significantly by material type.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
