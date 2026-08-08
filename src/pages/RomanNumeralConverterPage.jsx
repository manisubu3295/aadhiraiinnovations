import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Roman Numeral Converter', 'description': 'Free Roman numeral converter. Convert numbers to Roman numerals and back, instantly.', 'url': 'https://www.aadhiraiinnovations.com/tools/roman-numeral-converter', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the valid range for Roman numerals?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Standard Roman numerals represent 1 to 3999. Larger numbers need special notation (a bar over a numeral for ×1000) not handled here.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const NUMERALS = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]

function toRoman(num) {
  let result = ''
  let n = num
  for (const [value, symbol] of NUMERALS) { while (n >= value) { result += symbol; n -= value } }
  return result
}

function fromRoman(str) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  const s = str.toUpperCase()
  for (let i = 0; i < s.length; i++) {
    const current = map[s[i]], next = map[s[i + 1]]
    if (!current) return null
    if (next && current < next) total -= current
    else total += current
  }
  return total
}

function RomanNumeralConverter() {
  const [number, setNumber] = useState('')
  const [roman, setRoman] = useState('')

  const numberResult = number !== '' && Number(number) >= 1 && Number(number) <= 3999 ? toRoman(Number(number)) : null
  const romanResult = roman !== '' ? fromRoman(roman) : null

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number (1–3999)</label>
        <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 1994" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        {numberResult && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-lg font-bold text-[#0B1F3A]">{numberResult}</motion.p>}
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Roman Numeral</label>
        <input type="text" value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="e.g. MCMXCIV" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm uppercase" />
        {roman !== '' && (romanResult !== null ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-lg font-bold text-[#0B1F3A]">{romanResult}</motion.p> : <p className="mt-2 text-sm text-red-600">Not a valid Roman numeral</p>)}
      </div>
    </div>
  )
}

export default function RomanNumeralConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Roman Numeral Converter" description="Convert numbers to Roman numerals and back, instantly." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Roman Numeral Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RomanNumeralConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Roman Numeral Converter Questions" items={[
        { q: 'What is the valid range for Roman numerals?', a: '1 to 3999 using standard notation.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
