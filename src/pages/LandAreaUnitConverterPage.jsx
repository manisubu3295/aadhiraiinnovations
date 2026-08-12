import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { LAND_AREA_UNITS } from '../data/constructionConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Land Area Unit Converter', 'description': 'Free land area unit converter for India — square feet, square yard, square metre, acre, hectare, cent, ground, guntha, bigha, marla, and kanal.', 'url': 'https://www.aadhiraiinnovations.com/tools/land-area-unit-converter', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Do regional land units like bigha and kanal have fixed sizes?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — bigha, kanal, marla, and guntha vary in size by state and even by district in some cases. This converter uses the most commonly cited conventions (e.g. "pucca bigha" for UP/Bihar) as a starting reference — always confirm the local definition for a real transaction.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function LandAreaUnitConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('sqft')
  const from = LAND_AREA_UNITS.find((u) => u.key === fromUnit)
  const sqft = value !== '' ? Number(value) * from.toSqft : null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Value</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white">{LAND_AREA_UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}</select>
        </div>
      </div>

      {sqft !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2">
          {LAND_AREA_UNITS.filter((u) => u.key !== fromUnit).map((u) => (
            <div key={u.key} className="flex justify-between items-center text-sm"><span className="text-slate-600">{u.label}</span><span className="font-medium text-slate-700">{(sqft / u.toSqft).toFixed(4).replace(/\.?0+$/, '')}</span></div>
          ))}
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter a value to convert across all land area units</p></div>)}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Bigha, kanal, marla, guntha, and ground sizes vary by state/region — this uses commonly cited reference conventions. Confirm the local definition before a real transaction.</p>
      </div>
    </div>
  )
}

export default function LandAreaUnitConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Land Area Unit Converter" description="Convert between square feet, square yard, square metre, acre, hectare, cent, ground, guntha, bigha, marla, and kanal." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Land Area Unit Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><LandAreaUnitConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Land Area Unit Questions" items={[{ q: 'Do bigha and kanal have fixed sizes?', a: 'No, they vary by state/region — this uses commonly cited conventions as a starting reference.' }]} />
      <ToolCta headline="Need custom software for your real estate business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
