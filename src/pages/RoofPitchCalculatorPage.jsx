import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Roof Pitch Calculator', 'description': 'Free roof pitch calculator. Find the pitch angle and x:12 ratio from rise and run.', 'url': 'https://www.aadhiraiinnovations.com/tools/roof-pitch-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What does a "6:12" roof pitch mean?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It means the roof rises 6 units for every 12 units of horizontal run — a common way roofing is specified, equivalent to an angle of about 26.6°.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RoofPitchCalculator() {
  const [rise, setRise] = useState('')
  const [run, setRun] = useState('')
  const hasInputs = rise !== '' && run !== '' && Number(run) > 0
  const result = hasInputs ? (() => {
    const angle = Math.atan(Number(rise) / Number(run)) * (180 / Math.PI)
    const ratio12 = (Number(rise) / Number(run)) * 12
    return { angle, ratio12 }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rise</label><input type="number" value={rise} onChange={(e) => setRise(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Run</label><input type="number" value={run} onChange={(e) => setRun(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Pitch Ratio</span><span className="text-lg font-bold text-[#0B1F3A]">{result.ratio12.toFixed(1)}:12</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Pitch Angle</span><span className="font-medium text-slate-700">{result.angle.toFixed(1)}°</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter rise and run to calculate roof pitch</p></div>)}
    </div>
  )
}

export default function RoofPitchCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Roof Pitch Calculator" description="Find the pitch angle and x:12 ratio of a roof from its rise and run." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Roof Pitch Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RoofPitchCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Roof Pitch Questions" items={[{ q: 'What does "6:12" mean?', a: 'Roof rises 6 units per 12 units of run — about 26.6° angle.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
