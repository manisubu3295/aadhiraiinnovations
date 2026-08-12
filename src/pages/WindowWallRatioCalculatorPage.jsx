import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Window-to-Wall Ratio Calculator', 'description': 'Free window-to-wall ratio calculator for building design and energy planning.', 'url': 'https://www.aadhiraiinnovations.com/tools/window-wall-ratio-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a good window-to-wall ratio?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Commonly 15-30% for residential buildings, balancing natural light with energy efficiency — higher ratios increase heat gain/loss through glazing.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function WindowWallRatioCalculator() {
  const [windowArea, setWindowArea] = useState('')
  const [wallArea, setWallArea] = useState('')
  const hasInputs = windowArea !== '' && wallArea !== '' && Number(wallArea) > 0
  const ratio = hasInputs ? (Number(windowArea) / Number(wallArea)) * 100 : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Window Area (m²)</label><input type="number" value={windowArea} onChange={(e) => setWindowArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Wall Area (m²)</label><input type="number" value={wallArea} onChange={(e) => setWallArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {ratio !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Window-to-Wall Ratio</span><span className="text-lg font-bold text-[#0B1F3A]">{ratio.toFixed(1)}%</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter window and wall area to calculate the ratio</p></div>)}
    </div>
  )
}

export default function WindowWallRatioCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Window-to-Wall Ratio Calculator" description="Calculate window area as a percentage of wall area, for building design and energy planning." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Window-to-Wall Ratio Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><WindowWallRatioCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Window-to-Wall Ratio Questions" items={[{ q: 'What is a good ratio?', a: '15-30% is common for residential, balancing light and energy efficiency.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
