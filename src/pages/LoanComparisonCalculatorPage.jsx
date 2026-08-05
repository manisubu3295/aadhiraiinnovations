import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Loan Comparison Calculator',
      'description': 'Free online loan comparison calculator. Compare EMI, total interest, and total payment across up to 3 loan offers side by side.',
      'url': 'https://www.aadhiraiinnovations.com/tools/loan-comparison-calculator',
      'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How are the loans compared?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Each loan\'s EMI, total interest, and total payment are calculated using the standard reducing-balance formula, then shown side by side with the lowest total interest highlighted.' } },
        { '@type': 'Question', 'name': 'Does this account for processing fees?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, this compares principal, rate, and tenure only. Add any processing fees or charges manually when comparing real offers.' } },
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

function calculateEmi(principal, annualRatePercent, tenureYears) {
  if (!principal || !annualRatePercent || !tenureYears) return null
  const n = tenureYears * 12
  const r = annualRatePercent / 12 / 100
  const factor = Math.pow(1 + r, n)
  const emi = (principal * r * factor) / (factor - 1)
  const totalPayment = emi * n
  return { emi, totalPayment, totalInterest: totalPayment - principal }
}

const emptyLoan = () => ({ principal: '', rate: '', years: '' })

function LoanComparisonCalculator() {
  const [loans, setLoans] = useState([emptyLoan(), emptyLoan(), emptyLoan()])

  const results = loans.map((loan) =>
    loan.principal && loan.rate && loan.years
      ? calculateEmi(Number(loan.principal), Number(loan.rate), Number(loan.years))
      : null
  )

  const validResults = results.filter(Boolean)
  const lowestInterest = validResults.length > 1 ? Math.min(...validResults.map((r) => r.totalInterest)) : null

  const update = (idx, field, value) => {
    setLoans(loans.map((loan, i) => (i === idx ? { ...loan, [field]: value } : loan)))
  }

  const reset = () => setLoans([emptyLoan(), emptyLoan(), emptyLoan()])

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-3">
        {loans.map((loan, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan {idx + 1}</h3>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Principal (₹)</label>
              <input type="number" value={loan.principal} onChange={(e) => update(idx, 'principal', e.target.value)} placeholder="500000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Rate (% p.a.)</label>
              <input type="number" value={loan.rate} onChange={(e) => update(idx, 'rate', e.target.value)} placeholder="9.5"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Tenure (years)</label>
              <input type="number" value={loan.years} onChange={(e) => update(idx, 'years', e.target.value)} placeholder="5"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
            </div>

            {results[idx] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-lg p-3 space-y-1.5 ${
                results[idx].totalInterest === lowestInterest ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'
              }`}>
                {results[idx].totalInterest === lowestInterest && validResults.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700 mb-1">
                    <Trophy className="h-3 w-3" /> Lowest Interest
                  </div>
                )}
                <div className="flex justify-between text-xs"><span className="text-slate-500">EMI</span><span className="font-semibold text-[#0B1F3A]">{formatCurrency(results[idx].emi)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Total Interest</span><span className="font-semibold text-[#0B1F3A]">{formatCurrency(results[idx].totalInterest)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Total Payment</span><span className="font-semibold text-[#0B1F3A]">{formatCurrency(results[idx].totalPayment)}</span></div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors mx-auto">
        <RotateCcw className="h-4 w-4" />
        Reset All
      </button>
    </div>
  )
}

export default function LoanComparisonCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Loan Comparison Calculator"
        description="Compare EMI, total interest, and total payment across up to 3 loan offers side by side."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Loan Comparison Calculator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <LoanComparisonCalculator />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Loan Comparison Questions"
        items={[
          { q: 'How are the loans compared?', a: 'Each loan\'s EMI, total interest, and total payment are calculated with the standard reducing-balance formula and shown side by side.' },
          { q: 'Does this include processing fees?', a: 'No, only principal, rate, and tenure. Add fees manually when comparing real offers.' },
        ]}
      />
      <ToolCta
        headline="Need financial calculations built into your software?"
        body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
