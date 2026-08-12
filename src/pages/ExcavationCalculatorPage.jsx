import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Excavation Volume Calculator', 'description': 'Free excavation calculator. Find the volume of earth to be excavated for a foundation and the estimated number of truckloads.', 'url': 'https://www.aadhiraiinnovations.com/tools/excavation-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does excavated soil volume equal the pit volume?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — excavated (loose) soil expands ("bulks") compared to its in-ground volume, typically by 15-30% depending on soil type. This calculator shows the pit volume; add a bulking allowance for disposal/haulage planning.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ExcavationCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')
  const [truckCapacity, setTruckCapacity] = useState('6')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = length !== '' && width !== '' && depth !== ''
  const result = hasInputs ? (() => {
    const volumeM3 = Number(length) * Number(width) * Number(depth)
    const trucks = truckCapacity ? Math.ceil(volumeM3 / Number(truckCapacity)) : null
    return { volumeM3, volumeCft: volumeM3 * 35.3147, trucks }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Volume: ${result.volumeM3.toFixed(2)} m³ (${result.volumeCft.toFixed(1)} cft)${result.trucks ? `\nEstimated Truckloads: ${result.trucks}` : ''}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setLength(''); setWidth(''); setDepth(''); setTruckCapacity('6') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Length (m)</label><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Width (m)</label><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Depth (m)</label><input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      <div className="max-w-[220px]"><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Truck Capacity (m³, optional)</label><input type="number" value={truckCapacity} onChange={(e) => setTruckCapacity(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" /></div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Excavation Volume</span><span className="text-lg font-bold text-[#0B1F3A]">{result.volumeM3.toFixed(2)} m³</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">In Cubic Feet</span><span className="font-medium text-slate-700">{result.volumeCft.toFixed(1)} cft</span></div>
            {result.trucks !== null && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Estimated Truckloads</span><span className="font-medium text-slate-700">{result.trucks}</span></div>}
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter dimensions to calculate excavation volume</p></div>)}
    </div>
  )
}

export default function ExcavationCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Excavation Volume Calculator" description="Find the volume of earth to be excavated for a foundation, plus estimated truckloads." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Excavation Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ExcavationCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Excavation Questions" items={[{ q: 'Does excavated volume equal pit volume?', a: 'No, loose soil bulks 15-30% more than in-ground volume — this shows pit volume; add a bulking allowance for haulage planning.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
