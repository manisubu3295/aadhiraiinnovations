import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'SIP Calculator',
      'description': 'Free online SIP (Systematic Investment Plan) calculator. Estimate the maturity value of monthly mutual fund investments.',
      'url': 'https://www.aadhiraiinnovations.com/tools/sip-calculator',
      'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is SIP maturity value calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'M = P × [(1+i)^n − 1] / i × (1+i), where P is the monthly investment, i is the monthly rate of return, and n is the total number of months.' } },
        { '@type': 'Question', 'name': 'Is the expected return rate guaranteed?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this is an illustrative projection based on the return rate you enter. Actual mutual fund returns vary and are not guaranteed.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

function SipCalculator() {
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = monthly !== '' && rate !== '' && years !== ''
  const result = hasInputs
    ? (() => {
        const P = Number(monthly), i = Number(rate) / 100 / 12, n = Number(years) * 12
        const maturity = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
        const invested = P * n
        return { maturity, invested, returns: maturity - invested }
      })()
    : null

  const copyResults = async () => {
    if (!result) return
    const text = `Monthly Investment: ${formatCurrency(Number(monthly))}\nExpected Return: ${rate}% p.a.\nDuration: ${years} years\nTotal Invested: ${formatCurrency(result.invested)}\nEstimated Returns: ${formatCurrency(result.returns)}\nMaturity Value: ${formatCurrency(result.maturity)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => { setMonthly(''); setRate(''); setYears('') }
  const investedShare = result ? (result.invested / result.maturity) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Investment (₹)</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="e.g. 5000"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Expected Return (% p.a.)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 12"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Duration (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 10"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Maturity Value</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.maturity)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Total Invested</span>
              <span className="font-medium text-slate-700">{formatCurrency(result.invested)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Estimated Returns</span>
              <span className="font-medium text-slate-700">{formatCurrency(result.returns)}</span>
            </div>
            <div className="pt-2">
              <div className="h-2.5 w-full rounded-full bg-[#0B1F3A]/10 overflow-hidden flex">
                <div className="h-full bg-[#0B1F3A]" style={{ width: `${investedShare}%` }} />
                <div className="h-full bg-[#0B1F3A]/30 flex-1" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Invested ({investedShare.toFixed(0)}%)</span>
                <span>Returns ({(100 - investedShare).toFixed(0)}%)</span>
              </div>
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
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter monthly investment, return rate, and duration to calculate</p></div>
      )}

      <p className="text-xs text-slate-400">
        This is an illustrative projection, not a guaranteed return. Actual mutual fund returns vary with market performance.
      </p>
    </div>
  )
}

export default function SipCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="SIP Calculator"
        description="Estimate the maturity value of monthly mutual fund (SIP) investments over time."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'SIP Calculator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <SipCalculator />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="SIP Calculator Questions"
        items={[
          { q: 'How is SIP maturity value calculated?', a: 'M = P × [(1+i)^n − 1] / i × (1+i) — monthly investment, monthly rate of return, and number of months.' },
          { q: 'Is the expected return rate guaranteed?', a: 'No — this is an illustrative projection. Actual mutual fund returns vary and are not guaranteed.' },
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
