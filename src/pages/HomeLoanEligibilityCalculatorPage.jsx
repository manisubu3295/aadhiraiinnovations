import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Home Loan Eligibility Calculator', 'description': 'Free home loan eligibility calculator. Estimate the maximum loan you can get based on income, existing EMIs, and tenure.', 'url': 'https://www.aadhiraiinnovations.com/tools/home-loan-eligibility-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is home loan eligibility calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Lenders typically cap your total EMIs (all loans combined) at 40-50% of monthly income — the FOIR (Fixed Obligation to Income Ratio). Max affordable EMI = (income × FOIR%) − existing EMIs. The loan amount is then derived by reversing the standard EMI formula at your interest rate and tenure.' } },
      { '@type': 'Question', 'name': 'Is this the exact amount a bank will offer?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — actual eligibility also depends on credit score, employment type, property valuation, and the specific lender\'s policy. This gives a reasonable estimate to plan around.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function HomeLoanEligibilityCalculator() {
  const [income, setIncome] = useState('')
  const [existingEmis, setExistingEmis] = useState('0')
  const [rate, setRate] = useState('8.5')
  const [tenure, setTenure] = useState('20')
  const [foir, setFoir] = useState(50)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = income !== '' && rate !== '' && tenure !== ''
  const result = hasInputs ? (() => {
    const maxEmi = Math.max(0, Number(income) * (foir / 100) - Number(existingEmis || 0))
    const r = Number(rate) / 12 / 100
    const n = Number(tenure) * 12
    const maxLoan = r > 0 ? (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : maxEmi * n
    return { maxEmi, maxLoan }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Monthly Income: ${formatINR(Number(income))}\nExisting EMIs: ${formatINR(Number(existingEmis || 0))}\nMax Affordable EMI: ${formatINR(result.maxEmi)}\nEstimated Max Loan Eligibility: ${formatINR(result.maxLoan)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setIncome(''); setExistingEmis('0'); setRate('8.5'); setTenure('20'); setFoir(50) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Income (₹)</label><input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Existing Monthly EMIs (₹)</label><input type="number" value={existingEmis} onChange={(e) => setExistingEmis(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Interest Rate (% p.a.)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tenure (years)</label><input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">FOIR — Max EMI as % of Income: {foir}%</label><input type="range" min="30" max="60" value={foir} onChange={(e) => setFoir(Number(e.target.value))} className="w-full accent-[#0B1F3A]" /></div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Estimated Max Loan Eligibility</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.maxLoan)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Max Affordable EMI</span><span className="font-medium text-slate-700">{formatINR(result.maxEmi)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter your income and loan terms to estimate eligibility</p></div>)}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">An estimate based on the FOIR rule of thumb — actual bank offers also depend on credit score, employment type, and property valuation.</p>
      </div>
    </div>
  )
}

export default function HomeLoanEligibilityCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Home Loan Eligibility Calculator" description="Estimate the maximum home loan you can get, based on income, existing EMIs, and tenure." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Home Loan Eligibility Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><HomeLoanEligibilityCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Home Loan Eligibility Questions" items={[
        { q: 'How is eligibility calculated?', a: 'Max EMI = income × FOIR% − existing EMIs, then the loan amount is derived by reversing the EMI formula.' },
        { q: 'Is this the exact bank offer?', a: 'No, actual eligibility depends on credit score, employment type, and property valuation too.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
