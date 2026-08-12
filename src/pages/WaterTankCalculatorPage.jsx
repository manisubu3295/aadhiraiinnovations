import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Water Tank Capacity Calculator', 'description': 'Free water tank capacity calculator for cylindrical and rectangular tanks, in litres.', 'url': 'https://www.aadhiraiinnovations.com/tools/water-tank-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is tank capacity converted to litres?', 'acceptedAnswer': { '@type': 'Answer', 'text': '1 cubic metre = 1000 litres. Calculate the tank\'s volume in m³ (cylindrical: π×r²×height; rectangular: L×W×H) and multiply by 1000.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function WaterTankCalculator() {
  const [shape, setShape] = useState('cylindrical')
  const [a, setA] = useState('') // diameter or length
  const [b, setB] = useState('') // width (rectangular only)
  const [height, setHeight] = useState('')
  const hasInputs = a !== '' && height !== '' && (shape === 'cylindrical' || b !== '')
  const liters = hasInputs ? (() => {
    const h = Number(height)
    const volumeM3 = shape === 'cylindrical' ? Math.PI * Math.pow(Number(a) / 2, 2) * h : Number(a) * Number(b) * h
    return volumeM3 * 1000
  })() : null
  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'cylindrical', l: 'Cylindrical' }, { k: 'rectangular', l: 'Rectangular' }].map((s) => (<button key={s.k} onClick={() => setShape(s.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${shape === s.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{s.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{shape === 'cylindrical' ? 'Diameter (m)' : 'Length (m)'}</label><input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        {shape === 'rectangular' && <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Width (m)</label><input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>}
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Height (m)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {liters !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Tank Capacity</span><span className="text-lg font-bold text-[#0B1F3A]">{liters.toFixed(0)} litres</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter tank dimensions to calculate capacity</p></div>)}
    </div>
  )
}

export default function WaterTankCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Water Tank Capacity Calculator" description="Calculate the capacity of a cylindrical or rectangular water tank, in litres." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Water Tank Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><WaterTankCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Water Tank Questions" items={[{ q: 'How is capacity converted to litres?', a: '1 m³ = 1000 litres — calculate volume in m³ then multiply by 1000.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
