import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Slope / Gradient Calculator', 'description': 'Free slope calculator. Find slope percentage, angle, and ratio for a ramp, driveway, or drainage line from rise and run.', 'url': 'https://www.aadhiraiinnovations.com/tools/slope-gradient-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a typical ramp slope for accessibility?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Accessible ramps commonly target a maximum slope of 1:12 (about 8.3%, or 4.8°) — check your local building code\'s specific requirement.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function SlopeGradientCalculator() {
  const [rise, setRise] = useState('')
  const [run, setRun] = useState('')
  const hasInputs = rise !== '' && run !== '' && Number(run) > 0
  const result = hasInputs ? (() => {
    const percent = (Number(rise) / Number(run)) * 100
    const angle = Math.atan(Number(rise) / Number(run)) * (180 / Math.PI)
    const ratio = Number(run) / Number(rise)
    return { percent, angle, ratio }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rise (vertical)</label><input type="number" value={rise} onChange={(e) => setRise(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Run (horizontal)</label><input type="number" value={run} onChange={(e) => setRun(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Slope</span><span className="text-lg font-bold text-[#0B1F3A]">{result.percent.toFixed(1)}%</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Angle</span><span className="font-medium text-slate-700">{result.angle.toFixed(1)}°</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Ratio</span><span className="font-medium text-slate-700">1 : {result.ratio.toFixed(1)}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter rise and run to calculate slope</p></div>)}
    </div>
  )
}

export default function SlopeGradientCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Slope / Gradient Calculator" description="Find slope percentage, angle, and ratio for a ramp, driveway, or drainage line." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Slope / Gradient Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SlopeGradientCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Slope Questions" items={[{ q: 'Typical accessible ramp slope?', a: '1:12 (about 8.3%, 4.8°) is common — check your local building code.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
