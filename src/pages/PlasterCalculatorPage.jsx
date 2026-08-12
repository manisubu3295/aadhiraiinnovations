import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { PLASTER_DRY_FACTOR, CEMENT_BAG_M3 } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Plaster Calculator', 'description': 'Free plaster calculator. Get cement and sand quantities for plastering a wall area at a given thickness and ratio.', 'url': 'https://www.aadhiraiinnovations.com/tools/plaster-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What plaster thickness should I use?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Typically 12mm for internal walls and 15-20mm for external walls, applied in one or two coats depending on wall condition.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PlasterCalculator() {
  const [area, setArea] = useState('')
  const [thickness, setThickness] = useState('12')
  const [ratio, setRatio] = useState(6) // 1:ratio
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = area !== '' && thickness !== ''
  const result = hasInputs ? (() => {
    const wetVolume = Number(area) * (Number(thickness) / 1000)
    const dryVolume = wetVolume * PLASTER_DRY_FACTOR
    const sum = 1 + Number(ratio)
    const cementVol = dryVolume / sum
    const sandVol = (dryVolume * Number(ratio)) / sum
    return { wetVolume, dryVolume, cementBags: cementVol / CEMENT_BAG_M3, sandVol }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Area: ${area} m²\nThickness: ${thickness}mm\nRatio: 1:${ratio}\nCement: ${result.cementBags.toFixed(1)} bags\nSand: ${result.sandVol.toFixed(3)} m³`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setArea(''); setThickness('12'); setRatio(6) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Thickness (mm)</label><input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Mix Ratio (1:X)</label>
          <select value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white">{[3, 4, 5, 6].map((r) => <option key={r} value={r}>1:{r}</option>)}</select>
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Cement Required</span><span className="text-lg font-bold text-[#0B1F3A]">{result.cementBags.toFixed(1)} bags</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Sand Required</span><span className="font-medium text-slate-700">{result.sandVol.toFixed(3)} m³</span></div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200"><span className="text-slate-600">Wet / Dry Volume</span><span className="font-medium text-slate-700">{result.wetVolume.toFixed(3)} / {result.dryVolume.toFixed(3)} m³</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter area and thickness to calculate plaster materials</p></div>)}
    </div>
  )
}

export default function PlasterCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Plaster Calculator" description="Get cement and sand quantities for plastering a wall, at your chosen thickness and mix ratio." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Plaster Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PlasterCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Plaster Calculator Questions" items={[{ q: 'What plaster thickness should I use?', a: 'Typically 12mm internal, 15-20mm external, in one or two coats.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
