import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Staircase Calculator', 'description': 'Free staircase calculator. Find the number of steps, riser height, and tread depth from total rise and run.', 'url': 'https://www.aadhiraiinnovations.com/tools/staircase-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a comfortable riser height?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Typically 150-180mm for residential staircases — this calculator targets 175mm by default and rounds to a whole number of steps.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function StaircaseCalculator() {
  const [totalRise, setTotalRise] = useState('')
  const [totalRun, setTotalRun] = useState('')
  const [targetRiser, setTargetRiser] = useState('175')
  const hasInputs = totalRise !== '' && totalRun !== '' && targetRiser !== ''
  const result = hasInputs ? (() => {
    const steps = Math.round(Number(totalRise) / Number(targetRiser))
    const actualRiser = Number(totalRise) / steps
    const tread = Number(totalRun) / steps
    return { steps, actualRiser, tread }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Rise / Floor Height (mm)</label><input type="number" value={totalRise} onChange={(e) => setTotalRise(e.target.value)} placeholder="e.g. 3000" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Run / Available Length (mm)</label><input type="number" value={totalRun} onChange={(e) => setTotalRun(e.target.value)} placeholder="e.g. 3600" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Riser Height (mm)</label><input type="number" value={targetRiser} onChange={(e) => setTargetRiser(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Number of Steps</span><span className="text-lg font-bold text-[#0B1F3A]">{result.steps}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Actual Riser Height</span><span className="font-medium text-slate-700">{result.actualRiser.toFixed(1)} mm</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Tread Depth</span><span className="font-medium text-slate-700">{result.tread.toFixed(1)} mm</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter total rise and run to calculate staircase dimensions</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Preliminary layout only — check local building code minimums for riser/tread dimensions and headroom before finalizing.</p>
      </div>
    </div>
  )
}

export default function StaircaseCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Staircase Calculator" description="Find the number of steps, riser height, and tread depth from total rise and run." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Staircase Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><StaircaseCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Staircase Calculator Questions" items={[{ q: 'What is a comfortable riser height?', a: '150-180mm typically — this defaults to 175mm.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
