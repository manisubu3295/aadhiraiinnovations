import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { WALLPAPER_ROLL_COVERAGE_M2 } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Wallpaper Calculator', 'description': 'Free wallpaper calculator. Find the number of rolls needed for a wall area, including wastage.', 'url': 'https://www.aadhiraiinnovations.com/tools/wallpaper-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the standard wallpaper roll size?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A common European standard roll is 0.53m wide by 10m long (about 5.3 m² coverage), though sizes vary by brand — check your specific roll\'s dimensions.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function WallpaperCalculator() {
  const [area, setArea] = useState('')
  const [rollCoverage, setRollCoverage] = useState(WALLPAPER_ROLL_COVERAGE_M2)
  const [wastage, setWastage] = useState(15)
  const hasInputs = area !== '' && Number(area) > 0
  const rolls = hasInputs ? Math.ceil((Number(area) / Number(rollCoverage)) * (1 + wastage / 100)) : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wall Area (m²)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Roll Coverage (m²)</label><input type="number" value={rollCoverage} onChange={(e) => setRollCoverage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wastage (%)</label><input type="number" value={wastage} onChange={(e) => setWastage(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {rolls !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Rolls Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{rolls}</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter wall area to calculate rolls needed</p></div>)}
    </div>
  )
}

export default function WallpaperCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Wallpaper Calculator" description="Find the number of wallpaper rolls needed for a wall area, including wastage." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Wallpaper Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><WallpaperCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Wallpaper Questions" items={[{ q: 'Standard roll size?', a: 'Commonly 0.53m × 10m (~5.3 m²) — check your specific brand.' }]} />
      <ToolCta headline="Need custom software for your interior design business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
