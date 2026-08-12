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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Rent Escalation Calculator', 'description': 'Free rent escalation calculator. Project year-by-year rent at a fixed annual escalation rate.', 'url': 'https://www.aadhiraiinnovations.com/tools/rent-escalation-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a typical rent escalation rate in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Residential lease agreements commonly specify 5-10% escalation each renewal (often every 11 months or annually) — check your specific rental agreement.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RentEscalationCalculator() {
  const [rent, setRent] = useState('')
  const [escalation, setEscalation] = useState('5')
  const [years, setYears] = useState('5')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = rent !== '' && escalation !== '' && years !== ''
  const rows = hasInputs ? Array.from({ length: Number(years) }, (_, i) => ({ year: i + 1, rent: Number(rent) * Math.pow(1 + Number(escalation) / 100, i) })) : null
  const copyResults = async () => { if (!rows) return; try { await navigator.clipboard.writeText(rows.map((r) => `Year ${r.year}: ${formatINR(r.rent)}`).join('\n')); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setRent(''); setEscalation('5'); setYears('5') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Monthly Rent (₹)</label><input type="number" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Escalation per Year (%)</label><input type="number" value={escalation} onChange={(e) => setEscalation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {rows ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2">
            {rows.map((r) => (<div key={r.year} className="flex justify-between items-center text-sm"><span className="text-slate-600">Year {r.year}</span><span className="font-medium text-slate-700">{formatINR(r.rent)}/month</span></div>))}
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter current rent, escalation rate, and years to project rent</p></div>)}
    </div>
  )
}

export default function RentEscalationCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Rent Escalation Calculator" description="Project year-by-year rent at a fixed annual escalation rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Rent Escalation Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RentEscalationCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Rent Escalation Questions" items={[{ q: 'What is a typical escalation rate?', a: '5-10% at each renewal is common — check your specific rental agreement.' }]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
