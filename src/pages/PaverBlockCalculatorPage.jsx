import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Paver Block Calculator', 'description': 'Free paver block calculator. Find the number of paver blocks needed for a driveway or pathway area.', 'url': 'https://www.aadhiraiinnovations.com/tools/paver-block-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Should I add extra for cutting at edges?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, add 5-10% wastage for cutting paver blocks to fit edges and curves.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PaverBlockCalculator() {
  const [area, setArea] = useState('')
  const [paverLength, setPaverLength] = useState('')
  const [paverWidth, setPaverWidth] = useState('')
  const [wastage, setWastage] = useState(8)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = area !== '' && paverLength !== '' && paverWidth !== ''
  const result = hasInputs ? (() => {
    const paverAreaM2 = (Number(paverLength) / 1000) * (Number(paverWidth) / 1000)
    const count = Math.ceil((Number(area) / paverAreaM2) * (1 + Number(wastage) / 100))
    return { paverAreaM2, count }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Area: ${area} m²\nPaver Size: ${paverLength}×${paverWidth}mm\nPavers Needed: ${result.count}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setArea(''); setPaverLength(''); setPaverWidth(''); setWastage(8) }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wastage (%)</label><input type="number" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Paver Length (mm)</label><input type="number" value={paverLength} onChange={(e) => setPaverLength(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Paver Width (mm)</label><input type="number" value={paverWidth} onChange={(e) => setPaverWidth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Pavers Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.count.toLocaleString('en-IN')}</span></div></div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter area and paver size to calculate pavers needed</p></div>)}
    </div>
  )
}

export default function PaverBlockCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Paver Block Calculator" description="Find the number of paver blocks needed for a driveway or pathway area." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Paver Block Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PaverBlockCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Paver Block Questions" items={[{ q: 'Should I add extra for cutting?', a: 'Yes, 5-10% wastage for edges and curves.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
