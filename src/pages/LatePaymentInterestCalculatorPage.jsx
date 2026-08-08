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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Late Payment Interest Calculator', 'description': 'Free late payment interest calculator. Calculate interest due on an overdue invoice or payment.', 'url': 'https://www.aadhiraiinnovations.com/tools/late-payment-interest-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is late payment interest calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Interest = Overdue Amount × Annual Interest Rate × (Days Overdue ÷ 365). This is simple (non-compounding) interest for the exact overdue period.' } },
      { '@type': 'Question', 'name': 'What interest rate can I charge on a late invoice?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Under the MSME Development Act, buyers who delay payment to a registered MSME beyond the agreed period (max 45 days) owe interest at 3x the RBI bank rate, compounded monthly. For other B2B contracts, the rate is whatever your invoice/contract terms specify.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function LatePaymentInterestCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('')
  const [days, setDays] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = amount !== '' && rate !== '' && days !== ''
  const result = hasInputs ? (() => {
    const A = Number(amount), r = Number(rate) / 100, d = Number(days)
    const interest = A * r * (d / 365)
    return { interest, total: A + interest }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Overdue Amount: ${formatINR(Number(amount))}\nAnnual Rate: ${rate}%\nDays Overdue: ${days}\nInterest Due: ${formatINR(result.interest)}\nTotal Payable: ${formatINR(result.total)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setAmount(''); setRate(''); setDays('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Overdue Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual Interest Rate (%)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 18" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Days Overdue</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="e.g. 45" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Payable</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.total)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Original Amount</span><span className="font-medium text-slate-700">{formatINR(Number(amount))}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Interest Due</span><span className="font-medium text-slate-700">{formatINR(result.interest)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter the overdue amount, rate, and days overdue to calculate interest due</p></div>)}
    </div>
  )
}

export default function LatePaymentInterestCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Late Payment Interest Calculator" description="Calculate interest due on an overdue invoice or payment, for a given rate and number of days late." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Late Payment Interest Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><LatePaymentInterestCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Late Payment Interest Questions" items={[
        { q: 'How is late payment interest calculated?', a: 'Interest = Overdue Amount × Annual Rate × (Days Overdue ÷ 365).' },
        { q: 'What rate can I charge on a late invoice?', a: 'MSME-registered sellers can charge 3x the RBI bank rate under the MSME Development Act; otherwise, whatever your contract specifies.' },
      ]} />
      <ToolCta headline="Need overdue tracking built into your billing?" body="Aadhirai Innovations' Transport & Logistics and Billing platforms include statement of account and aging reports for overdue tracking." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
