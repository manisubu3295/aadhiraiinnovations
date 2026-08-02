import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'EMI Calculator',
      'description': 'Free online EMI calculator. Calculate your loan EMI, total interest, and total payment for any principal, interest rate, and tenure.',
      'url': 'https://www.aadhiraiinnovations.com/tools/emi-calculator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How is EMI calculated?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly instalments.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the difference between total interest and total payment?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Total payment is the EMI multiplied by the number of months — the full amount you repay. Total interest is total payment minus the original principal — the actual cost of borrowing.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Does this work for home loans, car loans, and personal loans?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. The EMI formula is the same for any reducing-balance loan — just enter the principal, annual interest rate, and tenure for your specific loan.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is this calculator accurate for my bank statement?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'It uses the standard reducing-balance EMI formula that most Indian banks and NBFCs use. Minor differences can occur if your lender charges processing fees or uses a slightly different day-count convention.',
          },
        },
      ],
    }

    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webapplication')
    wpScript.text = JSON.stringify(webAppSchema)
    document.head.appendChild(wpScript)

    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-schema', 'faqpage')
    faqScript.text = JSON.stringify(faqSchema)
    document.head.appendChild(faqScript)

    return () => {
      wpScript.remove()
      faqScript.remove()
    }
  }, [])
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function calculateEmi(principal, annualRatePercent, tenureMonths) {
  if (!principal || !annualRatePercent || !tenureMonths) return null

  const monthlyRate = annualRatePercent / 12 / 100
  const factor = Math.pow(1 + monthlyRate, tenureMonths)
  const emi = (principal * monthlyRate * factor) / (factor - 1)
  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal

  return { emi, totalPayment, totalInterest }
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function EmiCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenureUnit, setTenureUnit] = useState('years')
  const [tenure, setTenure] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const tenureMonths = tenure ? (tenureUnit === 'years' ? Number(tenure) * 12 : Number(tenure)) : 0
  const result = calculateEmi(Number(principal), Number(rate), tenureMonths)

  const copyResults = async () => {
    if (!result) return
    const text = `EMI Calculation Results:
Loan Amount: ${formatCurrency(Number(principal))}
Interest Rate: ${rate}% per annum
Tenure: ${tenure} ${tenureUnit}

Monthly EMI: ${formatCurrency(result.emi)}
Total Interest: ${formatCurrency(result.totalInterest)}
Total Payment: ${formatCurrency(result.totalPayment)}`

    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setPrincipal('')
    setRate('')
    setTenure('')
    setTenureUnit('years')
  }

  const principalShare = result ? (Number(principal) / result.totalPayment) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 9.5"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Tenure
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Unit
            </label>
            <div className="flex gap-3">
              {['years', 'months'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setTenureUnit(u)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                    tenureUnit === u
                      ? 'bg-[#0B1F3A] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Monthly EMI</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.emi)}</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Principal Amount</span>
              <span className="font-medium text-slate-700">{formatCurrency(Number(principal))}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Total Interest</span>
              <span className="font-medium text-slate-700">{formatCurrency(result.totalInterest)}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-sm font-medium text-[#0B1F3A]">Total Payment</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.totalPayment)}</span>
            </div>

            {/* Principal vs interest bar */}
            <div className="pt-2">
              <div className="h-2.5 w-full rounded-full bg-[#0B1F3A]/10 overflow-hidden flex">
                <div className="h-full bg-[#0B1F3A]" style={{ width: `${principalShare}%` }} />
                <div className="h-full bg-[#0B1F3A]/30 flex-1" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Principal ({principalShare.toFixed(0)}%)</span>
                <span>Interest ({(100 - principalShare).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyResults}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copyFeedback
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
              }`}
            >
              <Copy className="h-4 w-4" />
              {copyFeedback ? 'Copied!' : 'Copy Results'}
            </button>
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">Enter loan amount, interest rate, and tenure to calculate EMI</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function EmiCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="EMI Calculator"
        description="Calculate your monthly EMI, total interest, and total payment for any loan — home, car, personal, or business."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'EMI Calculator' },
        ]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <EmiCalculator />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Understanding EMI
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is EMI and how is it calculated?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                EMI (Equated Monthly Instalment) is the fixed monthly amount you pay towards a loan, covering both principal and interest, until the loan is fully repaid. It's calculated using the reducing-balance formula:
              </p>
              <p className="font-mono text-sm bg-white rounded-lg border border-slate-200 px-4 py-3 inline-block">
                EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)
              </p>
              <p>
                where <strong>P</strong> is the principal, <strong>r</strong> is the monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>n</strong> is the number of monthly instalments. Early in the loan, a larger share of each EMI goes toward interest; later payments shift more toward principal.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="EMI Calculator Questions"
        items={[
          {
            q: 'How is EMI calculated?',
            a: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan principal, r is the monthly interest rate, and n is the number of monthly instalments.',
          },
          {
            q: 'What is the difference between total interest and total payment?',
            a: 'Total payment is EMI × number of months. Total interest is total payment minus the original principal — the real cost of borrowing.',
          },
          {
            q: 'Does this work for home loans, car loans, and personal loans?',
            a: 'Yes, the same reducing-balance formula applies to any such loan — just enter the principal, annual rate, and tenure.',
          },
          {
            q: 'Is this accurate for my bank statement?',
            a: 'It uses the standard formula most Indian banks and NBFCs use. Minor differences can occur due to processing fees or day-count conventions.',
          },
        ]}
      />

      <ToolCta
        headline="Need automated financial calculations built into your software?"
        body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in — from pharmacy management to ERP systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
