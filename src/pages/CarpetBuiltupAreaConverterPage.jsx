import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Carpet Area to Built-up Area Converter', 'description': 'Free carpet area to built-up area converter, and back, using a loading factor.', 'url': 'https://www.aadhiraiinnovations.com/tools/carpet-builtup-area-converter', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a loading factor?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The extra area (walls, common areas, lobbies) added to carpet area to get built-up/super built-up area, expressed as a percentage. Typically 20-35% for apartments — RERA now requires carpet area to be disclosed, since it\'s the actual usable floor space.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function CarpetBuiltupAreaConverter() {
  const [mode, setMode] = useState('carpetToBuiltup')
  const [area, setArea] = useState('')
  const [loading, setLoading] = useState(25)

  const hasInputs = area !== '' && Number(area) > 0
  const result = hasInputs ? (mode === 'carpetToBuiltup' ? Number(area) * (1 + loading / 100) : Number(area) / (1 + loading / 100)) : null

  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'carpetToBuiltup', l: 'Carpet → Built-up' }, { k: 'builtupToCarpet', l: 'Built-up → Carpet' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'carpetToBuiltup' ? 'Carpet Area (sqft)' : 'Built-up Area (sqft)'}</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loading Factor: {loading}%</label><input type="range" min="10" max="40" value={loading} onChange={(e) => setLoading(Number(e.target.value))} className="w-full accent-[#0B1F3A] mt-3" /></div>
      </div>
      {result !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">{mode === 'carpetToBuiltup' ? 'Built-up Area' : 'Carpet Area'}</span><span className="text-lg font-bold text-[#0B1F3A]">{result.toFixed(0)} sqft</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter an area to convert</p></div>)}
    </div>
  )
}

export default function CarpetBuiltupAreaConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Carpet ⇄ Built-up Area Converter" description="Convert between carpet area and built-up area using a loading factor, both directions." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Carpet ⇄ Built-up Area Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><CarpetBuiltupAreaConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Carpet/Built-up Area Questions" items={[{ q: 'What is a loading factor?', a: 'Extra area (walls, common areas) added to carpet area — typically 20-35% for apartments.' }]} />
      <ToolCta headline="Need custom software for your real estate business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
