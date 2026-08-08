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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PPF Calculator', 'description': 'Free PPF (Public Provident Fund) calculator for India. Estimate maturity value from yearly contributions over the 15-year term.', 'url': 'https://www.aadhiraiinnovations.com/tools/ppf-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is PPF maturity calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'PPF compounds annually, with interest credited on the lowest balance between the 5th and last day of each month. This calculator assumes one contribution per year (at the start of the year) and compounds annually — the standard simplification used by most PPF calculators.' } },
      { '@type': 'Question', 'name': 'What is the current PPF interest rate?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The PPF rate is set by the government every quarter and has recently been around 7.1% p.a. — check the current rate on the India Post or your bank\'s website, and enter it here.' } },
      { '@type': 'Question', 'name': 'Is PPF interest taxable?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No. PPF is an EEE (Exempt-Exempt-Exempt) investment — contributions (up to ₹1.5L under 80C), interest, and maturity amount are all tax-free.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PpfCalculator() {
  const [yearly, setYearly] = useState('')
  const [rate, setRate] = useState('7.1')
  const [years, setYears] = useState('15')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = yearly !== '' && rate !== '' && years !== ''
  const result = hasInputs ? (() => {
    const C = Number(yearly), r = Number(rate) / 100, n = Number(years)
    let balance = 0
    for (let i = 0; i < n; i++) balance = (balance + C) * (1 + r)
    const invested = C * n
    return { amount: balance, invested, interest: balance - invested }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Yearly Contribution: ${formatINR(Number(yearly))}\nRate: ${rate}% p.a.\nTenure: ${years} years\nTotal Invested: ${formatINR(result.invested)}\nInterest Earned: ${formatINR(result.interest)}\nMaturity Value: ${formatINR(result.amount)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setYearly(''); setRate('7.1'); setYears('15') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Yearly Contribution (₹)</label><input type="number" value={yearly} onChange={(e) => setYearly(e.target.value)} placeholder="e.g. 150000" max="150000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Interest Rate (% p.a.)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tenure (years)</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
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
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter your yearly contribution to estimate PPF maturity value</p></div>)}

      <p className="text-xs text-slate-400">Assumes one contribution per year, compounded annually — a standard simplification. Actual PPF interest is calculated monthly on the lowest balance; real returns will vary slightly.</p>
    </div>
  )
}

export default function PpfCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="PPF Calculator" description="Estimate your Public Provident Fund maturity value from yearly contributions, interest rate, and tenure." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PPF Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PpfCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="PPF Calculator Questions" items={[
        { q: 'How is PPF maturity calculated?', a: 'This assumes one yearly contribution, compounded annually — a standard simplification; real PPF interest compounds monthly on the lowest balance.' },
        { q: 'What is the current PPF interest rate?', a: 'Set quarterly by the government, recently around 7.1% p.a. — check the latest rate and enter it here.' },
        { q: 'Is PPF interest taxable?', a: 'No — PPF is fully tax-exempt (EEE): contributions, interest, and maturity amount.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
