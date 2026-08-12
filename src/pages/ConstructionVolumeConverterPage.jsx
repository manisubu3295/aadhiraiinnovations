import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Construction Volume Unit Converter', 'description': 'Free volume unit converter for construction — cubic feet, cubic metre, litres, and cubic yard.', 'url': 'https://www.aadhiraiinnovations.com/tools/construction-volume-converter', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How many cubic feet in a cubic metre?', 'acceptedAnswer': { '@type': 'Answer', 'text': '1 cubic metre = 35.3147 cubic feet — commonly needed when comparing concrete/material quantities quoted in different units.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const UNITS = [
  { key: 'cft', label: 'Cubic Feet', toM3: 0.0283168 },
  { key: 'm3', label: 'Cubic Metre', toM3: 1 },
  { key: 'liter', label: 'Litres', toM3: 0.001 },
  { key: 'cyd', label: 'Cubic Yard', toM3: 0.764555 },
]

function ConstructionVolumeConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m3')
  const from = UNITS.find((u) => u.key === fromUnit)
  const m3 = value !== '' ? Number(value) * from.toM3 : null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Value</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white">{UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}</select>
        </div>
      </div>
      {m3 !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2">
          {UNITS.filter((u) => u.key !== fromUnit).map((u) => (<div key={u.key} className="flex justify-between items-center text-sm"><span className="text-slate-600">{u.label}</span><span className="font-medium text-slate-700">{(m3 / u.toM3).toFixed(4).replace(/\.?0+$/, '')}</span></div>))}
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter a value to convert across volume units</p></div>)}
    </div>
  )
}

export default function ConstructionVolumeConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Construction Volume Unit Converter" description="Convert between cubic feet, cubic metre, litres, and cubic yard." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Construction Volume Unit Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ConstructionVolumeConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Volume Converter Questions" items={[{ q: 'How many cubic feet in a cubic metre?', a: '1 m³ = 35.3147 cubic feet.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
