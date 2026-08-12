import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { STANDARD_DIAMETERS } from '../data/barBendingConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'TMT Steel Weight Calculator', 'description': 'Free TMT steel bar weight calculator. Find the weight of reinforcement bars from diameter and length.', 'url': 'https://www.aadhiraiinnovations.com/tools/tmt-steel-weight-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the formula for TMT bar weight?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Weight (kg/m) = diameter² ÷ 162, the standard IS 1786 formula. Multiply by length and bar count for total weight.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function TmtSteelWeightCalculator() {
  const [dia, setDia] = useState(12)
  const [length, setLength] = useState('')
  const [count, setCount] = useState(1)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = length !== '' && Number(length) > 0
  const result = hasInputs ? (() => {
    const unitWeight = (dia * dia) / 162
    const totalWeight = unitWeight * Number(length) * Number(count || 1)
    return { unitWeight, totalWeight }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Diameter: ${dia}mm\nLength: ${length}m × ${count}\nUnit Weight: ${result.unitWeight.toFixed(3)} kg/m\nTotal Weight: ${result.totalWeight.toFixed(2)} kg`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setLength(''); setCount(1) }
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bar Diameter (mm)</label>
        <select value={dia} onChange={(e) => setDia(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white">{STANDARD_DIAMETERS.map((d) => <option key={d} value={d}>{d} mm</option>)}</select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Length per Bar (m)</label><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Bars</label><input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Weight</span><span className="text-lg font-bold text-[#0B1F3A]">{result.totalWeight.toFixed(2)} kg</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Unit Weight</span><span className="font-medium text-slate-700">{result.unitWeight.toFixed(3)} kg/m</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter bar length to calculate steel weight</p></div>)}
    </div>
  )
}

export default function TmtSteelWeightCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="TMT Steel Weight Calculator" description="Find the weight of TMT reinforcement bars from diameter, length, and count." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'TMT Steel Weight Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><TmtSteelWeightCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="TMT Steel Weight Questions" items={[{ q: 'What is the formula?', a: 'Weight (kg/m) = diameter² ÷ 162 (IS 1786) — multiply by length and count for total weight.' }]} />
      <ToolCta headline="Need a full Bar Bending Schedule instead?" body="For per-shape cutting length and a full steel weight summary, try our Bar Bending Schedule Calculator." ctas={[{ label: 'Open BBS Calculator', href: '/tools/bar-bending-schedule', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
