import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Concrete Volume Calculator', 'description': 'Free concrete volume calculator for slabs, beams, columns, and footings. Get volume in cubic metres and cubic feet.', 'url': 'https://www.aadhiraiinnovations.com/tools/concrete-volume-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is concrete volume calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Volume = Length × Width × Height (or thickness), in consistent units. For an irregular member, break it into rectangular sections and sum the volumes.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const SHAPES = [
  { key: 'slab', label: 'Slab', dims: ['Length (m)', 'Width (m)', 'Thickness (m)'] },
  { key: 'beam', label: 'Beam', dims: ['Length (m)', 'Width (m)', 'Depth (m)'] },
  { key: 'column', label: 'Column', dims: ['Width (m)', 'Depth (m)', 'Height (m)'] },
  { key: 'footing', label: 'Footing', dims: ['Length (m)', 'Width (m)', 'Depth (m)'] },
]

function ConcreteVolumeCalculator() {
  const [shape, setShape] = useState('slab')
  const [a, setA] = useState(''), [b, setB] = useState(''), [c, setC] = useState('')
  const [count, setCount] = useState(1)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const shapeConfig = SHAPES.find((s) => s.key === shape)
  const hasInputs = a !== '' && b !== '' && c !== ''
  const volumeM3 = hasInputs ? Number(a) * Number(b) * Number(c) * Number(count || 1) : null
  const volumeCft = volumeM3 !== null ? volumeM3 * 35.3147 : null

  const copyResults = async () => {
    if (volumeM3 === null) return
    const text = `Shape: ${shapeConfig.label}\nVolume: ${volumeM3.toFixed(3)} m³ (${volumeCft.toFixed(2)} cft)`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setA(''); setB(''); setC(''); setCount(1) }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Member Type</label>
        <div className="flex flex-wrap gap-2">{SHAPES.map((s) => (<button key={s.key} onClick={() => setShape(s.key)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${shape === s.key ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{s.label}</button>))}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{shapeConfig.dims[0]}</label><input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{shapeConfig.dims[1]}</label><input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{shapeConfig.dims[2]}</label><input type="number" value={c} onChange={(e) => setC(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      <div className="max-w-[160px]"><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Members</label><input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" /></div>

      {volumeM3 !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Volume</span><span className="text-lg font-bold text-[#0B1F3A]">{volumeM3.toFixed(3)} m³</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">In Cubic Feet</span><span className="font-medium text-slate-700">{volumeCft.toFixed(2)} cft</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter dimensions to calculate concrete volume</p></div>)}
    </div>
  )
}

export default function ConcreteVolumeCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Concrete Volume Calculator" description="Calculate concrete volume for slabs, beams, columns, and footings, in m³ and cubic feet." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Concrete Volume Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ConcreteVolumeCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Concrete Volume Questions" items={[{ q: 'How is concrete volume calculated?', a: 'Volume = Length × Width × Height/Thickness. Break irregular members into rectangular sections and sum.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
