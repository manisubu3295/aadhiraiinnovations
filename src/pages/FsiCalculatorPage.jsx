import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'FSI / FAR Calculator', 'description': 'Free Floor Space Index (FSI) / Floor Area Ratio (FAR) calculator. Find the permissible built-up area for a plot.', 'url': 'https://www.aadhiraiinnovations.com/tools/fsi-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is FSI/FAR?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Floor Space Index (or Floor Area Ratio) is the ratio of a building\'s total floor area to the plot area, set by local development authorities. Permissible Built-up Area = Plot Area × FSI.' } },
      { '@type': 'Question', 'name': 'Does FSI vary by location?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, significantly — it depends on zone, road width, and local development control regulations. Always confirm the applicable FSI with your local municipal/planning authority.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function FsiCalculator() {
  const [plotArea, setPlotArea] = useState('')
  const [fsi, setFsi] = useState('1.5')
  const hasInputs = plotArea !== '' && fsi !== ''
  const builtUpArea = hasInputs ? Number(plotArea) * Number(fsi) : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Plot Area (sqft)</label><input type="number" value={plotArea} onChange={(e) => setPlotArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">FSI / FAR</label><input type="number" value={fsi} onChange={(e) => setFsi(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {builtUpArea !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Permissible Built-up Area</span><span className="text-lg font-bold text-[#0B1F3A]">{builtUpArea.toFixed(0)} sqft</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter plot area and FSI to calculate permissible built-up area</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">FSI varies significantly by zone, road width, and local regulations — confirm the applicable value with your municipal/planning authority.</p>
      </div>
    </div>
  )
}

export default function FsiCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="FSI / FAR Calculator" description="Find the permissible built-up area for a plot from its Floor Space Index (FSI)." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'FSI Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><FsiCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="FSI/FAR Questions" items={[
        { q: 'What is FSI/FAR?', a: 'The ratio of total floor area to plot area, set by local authorities. Built-up Area = Plot Area × FSI.' },
        { q: 'Does FSI vary by location?', a: 'Yes, by zone, road width, and regulations — confirm with your local planning authority.' },
      ]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
