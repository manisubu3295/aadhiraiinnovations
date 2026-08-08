import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Number Base Converter', 'description': 'Free online number base converter. Convert between binary, decimal, hexadecimal, and octal instantly.', 'url': 'https://www.aadhiraiinnovations.com/tools/number-base-converter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What number bases does this support?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Type a value into any field and the others update instantly.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const BASES = [{ key: 'bin', label: 'Binary', base: 2 }, { key: 'oct', label: 'Octal', base: 8 }, { key: 'dec', label: 'Decimal', base: 10 }, { key: 'hex', label: 'Hexadecimal', base: 16 }]

function NumberBaseConverter() {
  const [decimalValue, setDecimalValue] = useState(null)
  const [fields, setFields] = useState({ bin: '', oct: '', dec: '', hex: '' })
  const [error, setError] = useState('')

  function handleChange(key, base, value) {
    setError('')
    if (value === '') { setFields({ bin: '', oct: '', dec: '', hex: '' }); setDecimalValue(null); return }
    const parsed = parseInt(value, base)
    if (Number.isNaN(parsed)) { setFields((f) => ({ ...f, [key]: value })); setError(`"${value}" is not a valid ${BASES.find((b) => b.key === key).label.toLowerCase()} number`); return }
    setDecimalValue(parsed)
    setFields({ bin: parsed.toString(2), oct: parsed.toString(8), dec: parsed.toString(10), hex: parsed.toString(16).toUpperCase() })
  }

  return (
    <div className="space-y-6">
      {BASES.map((b) => (
        <div key={b.key}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{b.label} (base {b.base})</label>
          <input type="text" value={fields[b.key]} onChange={(e) => handleChange(b.key, b.base, e.target.value.trim())} placeholder={`e.g. ${(255).toString(b.base)}`} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
        </div>
      ))}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {decimalValue !== null && !error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-400">Decimal value: {decimalValue}</motion.p>}
    </div>
  )
}

export default function NumberBaseConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Number Base Converter" description="Convert between binary, octal, decimal, and hexadecimal instantly — type into any field." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Number Base Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><NumberBaseConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Number Base Converter Questions" items={[
        { q: 'What number bases does this support?', a: 'Binary, octal, decimal, and hexadecimal — type into any field and the others update instantly.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
