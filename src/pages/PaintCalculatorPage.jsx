import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { PAINT_COVERAGE_SQFT_PER_LITER } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Paint Calculator', 'description': 'Free paint calculator. Find how many litres of paint you need for a wall area and number of coats.', 'url': 'https://www.aadhiraiinnovations.com/tools/paint-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How much area does 1 litre of paint cover?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Around 120 sq.ft per litre per coat for typical emulsion paint, though this varies by paint brand, surface texture, and application method — check your paint tin\'s coverage rating for accuracy.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PaintCalculator() {
  const [area, setArea] = useState('')
  const [coats, setCoats] = useState(2)
  const [coverage, setCoverage] = useState(PAINT_COVERAGE_SQFT_PER_LITER)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = area !== '' && Number(area) > 0
  const liters = hasInputs ? (Number(area) * Number(coats)) / Number(coverage) : null

  const copyResults = async () => {
    if (liters === null) return
    const text = `Area: ${area} sqft\nCoats: ${coats}\nPaint Needed: ${liters.toFixed(1)} litres`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setArea(''); setCoats(2); setCoverage(PAINT_COVERAGE_SQFT_PER_LITER) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Area (sqft)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Coats</label><input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Coverage (sqft/L/coat)</label><input type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>

      {liters !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Paint Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{liters.toFixed(1)} litres</span></div></div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter wall area to calculate paint needed</p></div>)}
    </div>
  )
}

export default function PaintCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Paint Calculator" description="Find how many litres of paint you need for a wall area and number of coats." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Paint Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PaintCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Paint Calculator Questions" items={[{ q: 'How much area does 1 litre cover?', a: 'Around 120 sqft per litre per coat for typical emulsion — check your paint tin for exact coverage.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
