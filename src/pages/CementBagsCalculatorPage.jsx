import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { CEMENT_BAG_M3, CEMENT_DENSITY_KG_PER_M3 } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Cement Bags Calculator', 'description': 'Free cement bags calculator. Find how many 50kg cement bags a given volume of cement requires.', 'url': 'https://www.aadhiraiinnovations.com/tools/cement-bags-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How many bags of cement are in 1 m³?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A 50kg bag of cement occupies about 0.0347 m³ (density 1440 kg/m³), so 1 m³ of cement needs about 28.8 bags — but you rarely need a full m³ of pure cement; use the Concrete Mix Calculator to find the cement volume needed for a given concrete volume first.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function CementBagsCalculator() {
  const [mode, setMode] = useState('volume') // 'volume' | 'weight'
  const [value, setValue] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = value !== '' && Number(value) > 0
  const bags = hasInputs ? (mode === 'volume' ? Number(value) / CEMENT_BAG_M3 : (Number(value) * 1000) / 50) : null
  const kg = hasInputs ? (mode === 'volume' ? Number(value) * CEMENT_DENSITY_KG_PER_M3 : Number(value) * 1000) : null

  const copyResults = async () => {
    if (bags === null) return
    const text = `Cement ${mode === 'volume' ? 'Volume' : 'Weight (tonnes)'}: ${value}\nBags Needed: ${bags.toFixed(1)}\nTotal Weight: ${kg.toFixed(0)} kg`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => setValue('')

  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'volume', l: 'By Volume (m³)' }, { k: 'weight', l: 'By Weight (tonnes)' }].map((m) => (<button key={m.k} onClick={() => { setMode(m.k); setValue('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Cement {mode === 'volume' ? 'Volume (m³)' : 'Weight (tonnes)'}</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>

      {bags !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Bags Needed (50kg each)</span><span className="text-lg font-bold text-[#0B1F3A]">{bags.toFixed(1)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Total Weight</span><span className="font-medium text-slate-700">{kg.toFixed(0)} kg</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter cement volume or weight to calculate bags needed</p></div>)}
    </div>
  )
}

export default function CementBagsCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Cement Bags Calculator" description="Find how many 50kg cement bags a given volume or weight of cement requires." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Cement Bags Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><CementBagsCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Cement Bags Questions" items={[{ q: 'How many bags of cement are in 1 m³?', a: 'About 28.8 bags (50kg each) at 1440 kg/m³ density — use the Concrete Mix Calculator to find cement volume for a given concrete quantity.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
