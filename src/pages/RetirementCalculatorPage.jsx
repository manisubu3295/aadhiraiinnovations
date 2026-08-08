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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Retirement Corpus Calculator', 'description': 'Free retirement planning calculator for India. Estimate the retirement corpus you need based on current expenses, inflation, and expected returns.', 'url': 'https://www.aadhiraiinnovations.com/tools/retirement-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the required retirement corpus calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'First, today\'s annual expenses are inflated forward to your retirement date. Then the corpus needed is the present value (at retirement) of an annuity covering your retirement years, using the "real" return (expected return adjusted for inflation).' } },
      { '@type': 'Question', 'name': 'What return rate should I assume post-retirement?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A more conservative rate than pre-retirement is typical, since retirees generally hold safer assets. Many planners use 6-8% for a balanced post-retirement portfolio, but this depends on your risk tolerance.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RetirementCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState('')
  const [yearsToRetirement, setYearsToRetirement] = useState('')
  const [retirementYears, setRetirementYears] = useState('20')
  const [inflation, setInflation] = useState('6')
  const [returnRate, setReturnRate] = useState('8')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = monthlyExpense !== '' && yearsToRetirement !== '' && retirementYears !== '' && inflation !== '' && returnRate !== ''
  const result = hasInputs ? (() => {
    const E = Number(monthlyExpense) * 12, yTo = Number(yearsToRetirement), yPost = Number(retirementYears)
    const infl = Number(inflation) / 100, ret = Number(returnRate) / 100
    const futureAnnualExpense = E * Math.pow(1 + infl, yTo)
    const realRate = (1 + ret) / (1 + infl) - 1
    const corpus = realRate > 0
      ? futureAnnualExpense * (1 - Math.pow(1 + realRate, -yPost)) / realRate
      : futureAnnualExpense * yPost
    return { futureAnnualExpense, corpus }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Current Monthly Expense: ${formatINR(Number(monthlyExpense))}\nYears to Retirement: ${yearsToRetirement}\nRetirement Duration: ${retirementYears} years\nFuture Annual Expense at Retirement: ${formatINR(result.futureAnnualExpense)}\nRequired Retirement Corpus: ${formatINR(result.corpus)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setMonthlyExpense(''); setYearsToRetirement(''); setRetirementYears('20'); setInflation('6'); setReturnRate('8') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Monthly Expense (₹)</label><input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(e.target.value)} placeholder="e.g. 50000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years to Retirement</label><input type="number" value={yearsToRetirement} onChange={(e) => setYearsToRetirement(e.target.value)} placeholder="e.g. 25" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years After Retirement</label><input type="number" value={retirementYears} onChange={(e) => setRetirementYears(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Expected Inflation (% p.a.)</label><input type="number" value={inflation} onChange={(e) => setInflation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Expected Post-Retirement Return (% p.a.)</label><input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Required Retirement Corpus</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.corpus)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Your Annual Expense at Retirement</span><span className="font-medium text-slate-700">{formatINR(result.futureAnnualExpense)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Fill in the fields above to estimate your required retirement corpus</p></div>)}

      <p className="text-xs text-slate-400">A simplified illustrative model — doesn't account for existing savings, taxes, or changing expenses in retirement. Use alongside professional financial planning advice.</p>
    </div>
  )
}

export default function RetirementCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Retirement Corpus Calculator" description="Estimate how much you need to save for retirement, based on today's expenses, inflation, and expected returns." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Retirement Corpus Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RetirementCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Retirement Calculator Questions" items={[
        { q: 'How is the required retirement corpus calculated?', a: 'Today\'s expenses are inflated to your retirement date, then the corpus is the present value of an annuity covering your retirement years at your expected real (inflation-adjusted) return.' },
        { q: 'What return rate should I assume post-retirement?', a: 'A more conservative rate than pre-retirement — many planners use 6-8% for a balanced portfolio.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
