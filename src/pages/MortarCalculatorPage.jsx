import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { DRY_VOLUME_FACTOR, CEMENT_BAG_M3, MORTAR_RATIOS } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Mortar Ratio Calculator', 'description': 'Free mortar calculator. Get cement and sand quantities for masonry mortar at a given ratio and volume.', 'url': 'https://www.aadhiraiinnovations.com/tools/mortar-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What mortar ratio should I use?', 'acceptedAnswer': { '@type': 'Answer', 'text': '1:4 or 1:6 (cement:sand) is common for brickwork/blockwork; richer ratios like 1:3 are used for plaster or where higher strength is needed.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function MortarCalculator() {
  const [volume, setVolume] = useState('')
  const [ratio, setRatio] = useState('1:6')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = volume !== '' && Number(volume) > 0
  const result = hasInputs ? (() => {
    const parts = Number(ratio.split(':')[1])
    const dryVolume = Number(volume) * DRY_VOLUME_FACTOR
    const cementVol = dryVolume / (1 + parts)
    const sandVol = (dryVolume * parts) / (1 + parts)
    return { dryVolume, cementBags: cementVol / CEMENT_BAG_M3, sandVol }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Volume: ${volume} m³ (ratio ${ratio})\nCement: ${result.cementBags.toFixed(1)} bags\nSand: ${result.sandVol.toFixed(3)} m³`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setVolume(''); setRatio('1:6') }
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Mortar Ratio</label>
        <div className="flex flex-wrap gap-2">{MORTAR_RATIOS.map((r) => (<button key={r} onClick={() => setRatio(r)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${ratio === r ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{r}</button>))}</div>
      </div>
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wet Mortar Volume (m³)</label><input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Cement Required</span><span className="text-lg font-bold text-[#0B1F3A]">{result.cementBags.toFixed(1)} bags</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Sand Required</span><span className="font-medium text-slate-700">{result.sandVol.toFixed(3)} m³</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter mortar volume to calculate cement and sand needed</p></div>)}
    </div>
  )
}

export default function MortarCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Mortar Ratio Calculator" description="Get cement and sand quantities for masonry mortar at a given ratio and volume." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Mortar Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><MortarCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Mortar Calculator Questions" items={[{ q: 'What ratio should I use?', a: '1:4 or 1:6 for brickwork/blockwork; richer ratios like 1:3 for plaster or higher-strength needs.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
