import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Solar Rooftop Panel Estimator', 'description': 'Free solar rooftop panel estimator. Find the number of panels needed for a target system size, or the system size a given roof area can hold.', 'url': 'https://www.aadhiraiinnovations.com/tools/solar-panel-estimator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How much roof area does 1 kW of solar need?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Roughly 80-100 sqft (7.5-9 m²) per kW with typical panels, though this varies by panel wattage and efficiency — this calculator uses your specified panel size and wattage for an exact figure.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function SolarPanelEstimator() {
  const [mode, setMode] = useState('bySize') // 'bySize' | 'byArea'
  const [targetKw, setTargetKw] = useState('')
  const [roofArea, setRoofArea] = useState('')
  const [panelWattage, setPanelWattage] = useState('400')
  const [panelArea, setPanelArea] = useState('2')

  const result = (() => {
    if (mode === 'bySize' && targetKw !== '') {
      const panels = Math.ceil((Number(targetKw) * 1000) / Number(panelWattage))
      return { panels, area: panels * Number(panelArea) }
    }
    if (mode === 'byArea' && roofArea !== '') {
      const panels = Math.floor(Number(roofArea) / Number(panelArea))
      const systemKw = (panels * Number(panelWattage)) / 1000
      return { panels, systemKw }
    }
    return null
  })()

  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'bySize', l: 'From Target System Size' }, { k: 'byArea', l: 'From Available Roof Area' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-3">
        {mode === 'bySize' ? (
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target System Size (kW)</label><input type="number" value={targetKw} onChange={(e) => setTargetKw(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        ) : (
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Available Roof Area (m²)</label><input type="number" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        )}
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Panel Wattage (W)</label><input type="number" value={panelWattage} onChange={(e) => setPanelWattage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Panel Area (m² each)</label><input type="number" value={panelArea} onChange={(e) => setPanelArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Number of Panels</span><span className="text-lg font-bold text-[#0B1F3A]">{result.panels}</span></div>
          {mode === 'bySize' ? (
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Roof Area Needed</span><span className="font-medium text-slate-700">{result.area.toFixed(1)} m²</span></div>
          ) : (
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Resulting System Size</span><span className="font-medium text-slate-700">{result.systemKw.toFixed(2)} kW</span></div>
          )}
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter your target size or available roof area to estimate panels needed</p></div>)}
    </div>
  )
}

export default function SolarPanelEstimatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Solar Rooftop Panel Estimator" description="Find the number of solar panels needed for a target system size, or the system size your roof area can hold." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Solar Panel Estimator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SolarPanelEstimator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Solar Panel Questions" items={[{ q: 'How much roof area per kW?', a: 'Roughly 80-100 sqft (7.5-9 m²) per kW with typical panels — varies by wattage and efficiency.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
