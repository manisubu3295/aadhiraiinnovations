import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'
import stampDutyRates from '../data/stampDutyRates'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Stamp Duty & Registration Calculator', 'description': 'Free stamp duty and registration fee calculator for property purchases in India, by state.', 'url': 'https://www.aadhiraiinnovations.com/tools/stamp-duty-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is stamp duty calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Stamp duty is a percentage of the property\'s sale value (or circle rate/guidance value, whichever is higher), set by each state government. Registration charges are a separate, usually smaller, percentage.' } },
      { '@type': 'Question', 'name': 'Do stamp duty rates vary by gender or location?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — many states offer a discount for female or joint female buyers, and rates can differ for rural vs urban areas. This calculator shows a standard reference rate; confirm the exact applicable rate with your sub-registrar office.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function StampDutyCalculator() {
  const [value, setValue] = useState('')
  const [stateName, setStateName] = useState(stampDutyRates[0].state)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const rateInfo = stampDutyRates.find((s) => s.state === stateName)
  const hasInputs = value !== '' && Number(value) > 0
  const result = hasInputs ? (() => {
    const V = Number(value)
    const stampDuty = V * (rateInfo.stampDuty / 100)
    const registration = V * (rateInfo.registration / 100)
    return { stampDuty, registration, total: stampDuty + registration }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Property Value: ${formatINR(Number(value))}\nState: ${stateName}\nStamp Duty (${rateInfo.stampDuty}%): ${formatINR(result.stampDuty)}\nRegistration (${rateInfo.registration}%): ${formatINR(result.registration)}\nTotal Payable: ${formatINR(result.total)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => setValue('')

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Value (₹)</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 5000000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">State</label>
          <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
            {stampDutyRates.map((s) => <option key={s.state} value={s.state}>{s.state}</option>)}
          </select>
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Payable</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.total)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Stamp Duty ({rateInfo.stampDuty}%)</span><span className="font-medium text-slate-700">{formatINR(result.stampDuty)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Registration Fee ({rateInfo.registration}%)</span><span className="font-medium text-slate-700">{formatINR(result.registration)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter the property value and select a state to estimate stamp duty and registration charges</p></div>)}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Standard reference rates only — actual rates vary by gender, rural/urban location, property type, and change periodically by state notification. Confirm the current rate with your local sub-registrar office before a transaction.</p>
      </div>
    </div>
  )
}

export default function StampDutyCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Stamp Duty & Registration Calculator" description="Estimate stamp duty and registration charges for a property purchase, by state." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Stamp Duty Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><StampDutyCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Stamp Duty Calculator Questions" items={[
        { q: 'How is stamp duty calculated?', a: 'A state-set percentage of the property\'s sale value or circle rate, whichever is higher, plus a separate registration fee percentage.' },
        { q: 'Do rates vary by gender or location?', a: 'Yes, many states discount rates for female buyers and vary rural vs urban rates — this tool shows a standard reference rate only.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
