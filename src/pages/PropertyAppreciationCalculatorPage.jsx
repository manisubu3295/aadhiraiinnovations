import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Property Appreciation Calculator', 'description': 'Free property appreciation calculator. Estimate a property\'s future value at a given annual growth rate.', 'url': 'https://www.aadhiraiinnovations.com/tools/property-appreciation-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is future property value calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Future Value = Current Value × (1 + annual appreciation rate)^years — the same compound growth formula used for any investment.' } },
      { '@type': 'Question', 'name': 'What appreciation rate should I use?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Historical Indian residential real estate appreciation has varied widely by city and cycle — commonly cited long-term averages are 5-10% p.a., but use local market data for your specific area.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PropertyAppreciationCalculator() {
  const [value, setValue] = useState('')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = value !== '' && rate !== '' && years !== ''
  const result = hasInputs ? (() => {
    const futureValue = Number(value) * Math.pow(1 + Number(rate) / 100, Number(years))
    return { futureValue, gain: futureValue - Number(value) }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Current Value: ${formatINR(Number(value))}\nRate: ${rate}% p.a.\nYears: ${years}\nFuture Value: ${formatINR(result.futureValue)}\nGain: ${formatINR(result.gain)}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setValue(''); setRate('7'); setYears('') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Property Value (₹)</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual Appreciation (%)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Future Value</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.futureValue)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Total Gain</span><span className="font-medium text-slate-700">{formatINR(result.gain)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter property value, rate, and years to project future value</p></div>)}
    </div>
  )
}

export default function PropertyAppreciationCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Property Appreciation Calculator" description="Estimate a property's future value at a given annual growth rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Property Appreciation Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PropertyAppreciationCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Property Appreciation Questions" items={[
        { q: 'How is future value calculated?', a: 'Future Value = Current Value × (1 + rate)^years.' },
        { q: 'What rate should I use?', a: 'Historical Indian averages are 5-10% p.a., but use local market data for your area.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
