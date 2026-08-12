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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Rental Yield Calculator', 'description': 'Free rental yield calculator. Find the gross and net rental yield of a property investment.', 'url': 'https://www.aadhiraiinnovations.com/tools/rental-yield-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a good rental yield in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Residential rental yields in Indian cities typically range from 2-4% gross — lower than many other countries, since property price appreciation is usually the primary return driver, not rental income.' } },
      { '@type': 'Question', 'name': 'What is the difference between gross and net yield?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Gross yield ignores expenses; net yield subtracts annual costs (maintenance, property tax, insurance) from rent before dividing by property value.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [annualExpenses, setAnnualExpenses] = useState('0')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = propertyValue !== '' && monthlyRent !== '' && Number(propertyValue) > 0
  const result = hasInputs ? (() => {
    const annualRent = Number(monthlyRent) * 12
    const grossYield = (annualRent / Number(propertyValue)) * 100
    const netYield = ((annualRent - Number(annualExpenses || 0)) / Number(propertyValue)) * 100
    return { annualRent, grossYield, netYield }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Property Value: ${formatINR(Number(propertyValue))}\nAnnual Rent: ${formatINR(result.annualRent)}\nGross Yield: ${result.grossYield.toFixed(2)}%\nNet Yield: ${result.netYield.toFixed(2)}%`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setPropertyValue(''); setMonthlyRent(''); setAnnualExpenses('0') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Value (₹)</label><input type="number" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Rent (₹)</label><input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual Expenses (₹)</label><input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Gross Rental Yield</span><span className="text-lg font-bold text-[#0B1F3A]">{result.grossYield.toFixed(2)}%</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Net Rental Yield</span><span className="font-medium text-slate-700">{result.netYield.toFixed(2)}%</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Annual Rent</span><span className="font-medium text-slate-700">{formatINR(result.annualRent)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter property value and rent to calculate yield</p></div>)}
    </div>
  )
}

export default function RentalYieldCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Rental Yield Calculator" description="Find the gross and net rental yield of a property investment." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Rental Yield Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RentalYieldCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Rental Yield Questions" items={[
        { q: 'What is a good rental yield in India?', a: 'Typically 2-4% gross in Indian cities — appreciation usually drives returns more than rent.' },
        { q: 'Gross vs net yield?', a: 'Gross ignores expenses; net subtracts annual costs before dividing by property value.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
