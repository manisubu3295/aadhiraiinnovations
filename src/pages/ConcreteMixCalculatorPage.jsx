import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { DRY_VOLUME_FACTOR, CEMENT_DENSITY_KG_PER_M3, CEMENT_BAG_M3, CONCRETE_MIX_RATIOS } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Concrete Mix Ratio Calculator', 'description': 'Free concrete mix calculator. Get cement, sand, and aggregate quantities for M10/M15/M20/M25 grade concrete from wet volume.', 'url': 'https://www.aadhiraiinnovations.com/tools/concrete-mix-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Why is dry volume more than wet volume?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Dry materials (cement, sand, aggregate) have air voids between particles that get filled once water is added and the mix is compacted — so you need about 1.54× the wet (final) concrete volume in dry materials.' } },
      { '@type': 'Question', 'name': 'What do M10, M15, M20, M25 mean?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The number is the characteristic compressive strength in N/mm² (MPa) at 28 days. Each nominal grade has a standard cement:sand:aggregate ratio — M20 (1:1.5:3) is common for RCC slabs and beams in residential construction.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ConcreteMixCalculator() {
  const [wetVolume, setWetVolume] = useState('')
  const [gradeKey, setGradeKey] = useState('M20')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const grade = CONCRETE_MIX_RATIOS.find((g) => g.grade === gradeKey)
  const hasInputs = wetVolume !== '' && Number(wetVolume) > 0
  const result = hasInputs ? (() => {
    const dryVolume = Number(wetVolume) * DRY_VOLUME_FACTOR
    const [c, s, a] = grade.ratio
    const sum = c + s + a
    const cementVol = (dryVolume * c) / sum
    const sandVol = (dryVolume * s) / sum
    const aggVol = (dryVolume * a) / sum
    const cementBags = cementVol / CEMENT_BAG_M3
    const cementKg = cementVol * CEMENT_DENSITY_KG_PER_M3
    return { dryVolume, cementVol, sandVol, aggVol, cementBags, cementKg }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Grade: ${gradeKey} (${grade.ratio.join(':')})\nWet Volume: ${wetVolume} m³\nDry Volume: ${result.dryVolume.toFixed(3)} m³\nCement: ${result.cementVol.toFixed(3)} m³ (${result.cementBags.toFixed(1)} bags)\nSand: ${result.sandVol.toFixed(3)} m³\nAggregate: ${result.aggVol.toFixed(3)} m³`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => setWetVolume('')

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Concrete Grade</label>
        <div className="flex flex-wrap gap-2">{CONCRETE_MIX_RATIOS.map((g) => (<button key={g.grade} onClick={() => setGradeKey(g.grade)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${gradeKey === g.grade ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{g.grade} ({g.ratio.join(':')})</button>))}</div>
      </div>
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wet Concrete Volume (m³)</label><input type="number" value={wetVolume} onChange={(e) => setWetVolume(e.target.value)} placeholder="e.g. 1" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Cement Required</span><span className="text-lg font-bold text-[#0B1F3A]">{result.cementBags.toFixed(1)} bags</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Dry Volume (×1.54)</span><span className="font-medium text-slate-700">{result.dryVolume.toFixed(3)} m³</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Cement</span><span className="font-medium text-slate-700">{result.cementVol.toFixed(3)} m³ ({result.cementKg.toFixed(0)} kg)</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Sand</span><span className="font-medium text-slate-700">{result.sandVol.toFixed(3)} m³</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Aggregate</span><span className="font-medium text-slate-700">{result.aggVol.toFixed(3)} m³</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter wet concrete volume to calculate material quantities</p></div>)}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Uses nominal mix ratios and a standard 1.54× dry-volume factor — actual material yield varies by aggregate size, moisture content, and wastage. For structural work, follow your engineer's design mix.</p>
      </div>
    </div>
  )
}

export default function ConcreteMixCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Concrete Mix Ratio Calculator" description="Get cement, sand, and aggregate quantities for M10/M15/M20/M25 grade concrete from wet volume." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Concrete Mix Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ConcreteMixCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Concrete Mix Questions" items={[
        { q: 'Why is dry volume more than wet volume?', a: 'Dry materials have air voids that get filled once water is added and compacted — the standard factor is 1.54×.' },
        { q: 'What do M10/M15/M20/M25 mean?', a: 'The compressive strength in N/mm² at 28 days. M20 (1:1.5:3) is common for residential RCC.' },
      ]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
