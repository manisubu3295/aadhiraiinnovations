import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Curtain Fabric Calculator', 'description': 'Free curtain fabric calculator. Find the fabric length needed for a window from width, fullness, and drop.', 'url': 'https://www.aadhiraiinnovations.com/tools/curtain-fabric-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a fullness factor?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'How much wider the flat fabric is than the window/track, to create gathered folds — 2x (double) is standard, 2.5x for a fuller look.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function CurtainFabricCalculator() {
  const [windowWidth, setWindowWidth] = useState('')
  const [dropHeight, setDropHeight] = useState('')
  const [fullness, setFullness] = useState('2')
  const [fabricWidth, setFabricWidth] = useState('1.4')
  const [hem, setHem] = useState('0.3')
  const hasInputs = windowWidth !== '' && dropHeight !== '' && fabricWidth !== ''
  const result = hasInputs ? (() => {
    const totalFlatWidth = Number(windowWidth) * Number(fullness)
    const widths = Math.ceil(totalFlatWidth / Number(fabricWidth))
    const dropWithHem = Number(dropHeight) + Number(hem || 0)
    const totalFabric = widths * dropWithHem
    return { widths, totalFabric }
  })() : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Window/Track Width (m)</label><input type="number" value={windowWidth} onChange={(e) => setWindowWidth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Drop Height (m)</label><input type="number" value={dropHeight} onChange={(e) => setDropHeight(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Fullness Factor</label><input type="number" value={fullness} onChange={(e) => setFullness(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Fabric Roll Width (m)</label><input type="number" value={fabricWidth} onChange={(e) => setFabricWidth(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Hem/Heading Allowance (m)</label><input type="number" value={hem} onChange={(e) => setHem(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Fabric Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.totalFabric.toFixed(2)} m</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Fabric Widths Required</span><span className="font-medium text-slate-700">{result.widths}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter window dimensions to calculate fabric needed</p></div>)}
    </div>
  )
}

export default function CurtainFabricCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Curtain Fabric Calculator" description="Find the fabric length needed for a window, from width, fullness, and drop." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Curtain Fabric Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><CurtainFabricCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Curtain Fabric Questions" items={[{ q: 'What is a fullness factor?', a: 'How much wider the flat fabric is than the track — 2x is standard, 2.5x for a fuller look.' }]} />
      <ToolCta headline="Need custom software for your interior design business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
