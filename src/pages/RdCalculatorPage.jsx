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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'RD Calculator', 'description': 'Free Recurring Deposit (RD) calculator for India. Calculate maturity value from monthly deposits with quarterly compounding.', 'url': 'https://www.aadhiraiinnovations.com/tools/rd-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is RD maturity value calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'RD maturity uses M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)], where R is the monthly deposit, i is the quarterly rate (annual rate ÷ 400), and n is the number of quarters — the formula most Indian banks use since interest compounds quarterly on RDs.' } },
      { '@type': 'Question', 'name': 'Is RD interest taxable?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, RD interest is fully taxable as "Income from Other Sources" at your slab rate, and TDS applies above ₹40,000/year (₹50,000 for senior citizens).' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RdCalculator() {
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState('')
  const [months, setMonths] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = monthly !== '' && rate !== '' && months !== ''
  const result = hasInputs ? (() => {
    const R = Number(monthly), i = Number(rate) / 400, n = Number(months) / 3
    const amount = R * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)))
    const invested = R * Number(months)
    return { amount, invested, interest: amount - invested }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Monthly Deposit: ${formatINR(Number(monthly))}\nRate: ${rate}% p.a.\nTenure: ${months} months\nTotal Invested: ${formatINR(result.invested)}\nInterest Earned: ${formatINR(result.interest)}\nMaturity Value: ${formatINR(result.amount)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setMonthly(''); setRate(''); setMonths('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Deposit (₹)</label><input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Interest Rate (% p.a.)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 6.5" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tenure (months)</label><input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="e.g. 24" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Maturity Value</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.amount)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Total Invested</span><span className="font-medium text-slate-700">{formatINR(result.invested)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Interest Earned</span><span className="font-medium text-slate-700">{formatINR(result.interest)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter monthly deposit, rate, and tenure to calculate maturity value</p></div>)}

      <p className="text-xs text-slate-400">Assumes quarterly compounding, the standard for most Indian bank RDs. Actual bank terms and rates vary — confirm with your bank before investing.</p>
    </div>
  )
}

export default function RdCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="RD Calculator" description="Calculate the maturity value of a Recurring Deposit from your monthly deposit, rate, and tenure." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'RD Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RdCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="RD Calculator Questions" items={[
        { q: 'How is RD maturity value calculated?', a: 'M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)], where i is the quarterly rate and n is the number of quarters.' },
        { q: 'Is RD interest taxable?', a: 'Yes, fully taxable at your slab rate, with TDS above ₹40,000/year (₹50,000 for senior citizens).' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
