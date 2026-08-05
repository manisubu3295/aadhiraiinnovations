import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Salary / CTC Breakup Calculator',
      'description': 'Free online CTC to in-hand salary breakup calculator. Illustrative estimate of Basic, HRA, PF, and take-home pay from annual CTC.',
      'url': 'https://www.aadhiraiinnovations.com/tools/salary-ctc-calculator',
      'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Is this breakup exact?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this uses common illustrative assumptions (Basic ~50% of CTC, HRA ~50% of Basic, 12% PF). Actual company policy, income tax, professional tax, and ESI will change the real take-home amount.' } },
        { '@type': 'Question', 'name': 'Does this include income tax deductions?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, this only estimates PF deduction. Income tax depends on your tax regime, exemptions, and other income — use this alongside a tax calculator for a fuller picture.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

function SalaryCtcCalculator() {
  const [ctc, setCtc] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const result = ctc !== '' && Number(ctc) > 0
    ? (() => {
        const CTC = Number(ctc)
        const basic = CTC * 0.5
        const hra = basic * 0.5
        const employerPf = basic * 0.12
        const employeePf = basic * 0.12
        const grossSalary = CTC - employerPf
        const specialAllowance = grossSalary - basic - hra
        const estimatedTakeHome = grossSalary - employeePf
        return { basic, hra, employerPf, employeePf, grossSalary, specialAllowance, estimatedTakeHome }
      })()
    : null

  const copyResults = async () => {
    if (!result) return
    const text = `Annual CTC: ${formatCurrency(Number(ctc))}\nBasic: ${formatCurrency(result.basic)}\nHRA: ${formatCurrency(result.hra)}\nSpecial Allowance: ${formatCurrency(result.specialAllowance)}\nEmployer PF: ${formatCurrency(result.employerPf)}\nGross Salary: ${formatCurrency(result.grossSalary)}\nEmployee PF: ${formatCurrency(result.employeePf)}\nEstimated Annual Take-Home: ${formatCurrency(result.estimatedTakeHome)}\nEstimated Monthly Take-Home: ${formatCurrency(result.estimatedTakeHome / 12)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => setCtc('')

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual CTC (₹)</label>
        <input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="e.g. 800000"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Est. Monthly Take-Home</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.estimatedTakeHome / 12)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Basic</span><span className="font-medium text-slate-700">{formatCurrency(result.basic)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">HRA</span><span className="font-medium text-slate-700">{formatCurrency(result.hra)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Special Allowance</span><span className="font-medium text-slate-700">{formatCurrency(result.specialAllowance)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Employer PF Contribution</span><span className="font-medium text-slate-700">{formatCurrency(result.employerPf)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200"><span className="text-slate-600">Gross Salary</span><span className="font-medium text-slate-700">{formatCurrency(result.grossSalary)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Employee PF Deduction</span><span className="font-medium text-slate-700">− {formatCurrency(result.employeePf)}</span></div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-sm font-medium text-[#0B1F3A]">Est. Annual Take-Home</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.estimatedTakeHome)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
              <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}
            </button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
              <RotateCcw className="h-4 w-4" />Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter annual CTC to see an illustrative breakup</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Illustrative only — uses common assumptions (Basic ≈ 50% of CTC, HRA ≈ 50% of Basic, 12% PF) and does not include income tax, professional tax, ESI, or your specific employer's policy. Your actual payslip will differ.
        </p>
      </div>
    </div>
  )
}

export default function SalaryCtcCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Salary / CTC Breakup Calculator"
        description="Get an illustrative breakup of Basic, HRA, PF, and estimated take-home pay from your annual CTC."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Salary / CTC Calculator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <SalaryCtcCalculator />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Salary / CTC Breakup Questions"
        items={[
          { q: 'Is this breakup exact?', a: 'No — it uses common illustrative assumptions. Actual company policy, tax, and deductions will change your real take-home.' },
          { q: 'Does this include income tax?', a: 'No, only PF is estimated. Income tax depends on your regime and exemptions.' },
          { q: 'Why does HRA assume 50% of Basic?', a: 'This is a common metro-city convention used for illustration — your employer may structure HRA differently.' },
        ]}
      />
      <ToolCta
        headline="Need payroll built into your business software?"
        body="Aadhirai Innovations builds custom HR and workforce management systems with attendance-driven payroll data."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
