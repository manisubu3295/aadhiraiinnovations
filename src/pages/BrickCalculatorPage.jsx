import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { BRICK_SIZE_M } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Brick Calculator', 'description': 'Free brick calculator. Find the number of bricks needed for a wall from its dimensions.', 'url': 'https://www.aadhiraiinnovations.com/tools/brick-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the number of bricks calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Wall volume ÷ volume of one brick including its mortar joint. This tool uses a standard 190×90×90mm brick with a 10mm mortar joint (200×100×100mm effective size).' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const brickVolume = BRICK_SIZE_M.l * BRICK_SIZE_M.w * BRICK_SIZE_M.h

function BrickCalculator() {
  const [length, setLength] = useState('')
  const [height, setHeight] = useState('')
  const [thickness, setThickness] = useState('0.23')
  const [wastage, setWastage] = useState(5)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = length !== '' && height !== '' && thickness !== ''
  const result = hasInputs ? (() => {
    const wallVolume = Number(length) * Number(height) * Number(thickness)
    const baseBricks = wallVolume / brickVolume
    const withWastage = baseBricks * (1 + Number(wastage) / 100)
    return { wallVolume, bricks: Math.ceil(withWastage) }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Wall: ${length}m × ${height}m × ${thickness}m\nWall Volume: ${result.wallVolume.toFixed(3)} m³\nBricks Needed (incl. ${wastage}% wastage): ${result.bricks}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setLength(''); setHeight(''); setThickness('0.23'); setWastage(5) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Length (m)</label><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Height (m)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Thickness (m)</label><input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="e.g. 0.23 (9 inch)" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      <div className="max-w-[200px]"><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wastage (%)</label><input type="number" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" /></div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Bricks Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.bricks.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Wall Volume</span><span className="font-medium text-slate-700">{result.wallVolume.toFixed(3)} m³</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter wall dimensions to calculate bricks needed</p></div>)}
    </div>
  )
}

export default function BrickCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Brick Calculator" description="Find the number of bricks needed for a wall, including a wastage allowance." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Brick Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BrickCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Brick Calculator Questions" items={[{ q: 'How is the number of bricks calculated?', a: 'Wall volume ÷ brick volume (190×90×90mm + 10mm mortar joint = 200×100×100mm effective).' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
