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
      'name': 'Simple Interest Calculator',
      'description': 'Free online simple interest calculator. Calculate interest earned and total amount for a given principal, rate, and time.',
      'url': 'https://www.aadhiraiinnovations.com/tools/simple-interest-calculator',
      'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is simple interest calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'SI = (P × R × T) / 100, where P is principal, R is annual rate, and T is time in years.' } },
        { '@type': 'Question', 'name': 'How is this different from compound interest?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Simple interest is calculated only on the original principal every period. Compound interest also earns interest on previously earned interest.' } },
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

function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = principal !== '' && rate !== '' && years !== ''
  const result = hasInputs
    ? (() => {
        const P = Number(principal), R = Number(rate), T = Number(years)
        const interest = (P * R * T) / 100
        return { interest, total: P + interest }
      })()
    : null

  const copyResults = async () => {
    if (!result) return
    const text = `Principal: ${formatCurrency(Number(principal))}\nRate: ${rate}%\nTime: ${years} years\nInterest: ${formatCurrency(result.interest)}\nTotal Amount: ${formatCurrency(result.total)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => { setPrincipal(''); setRate(''); setYears('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Principal (₹)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 100000"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rate (% p.a.)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 7"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Time (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 3"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Total Amount</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(result.total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Interest</span>
              <span className="font-medium text-slate-700">{formatCurrency(result.interest)}</span>
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
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter principal, rate, and time to calculate</p></div>
      )}
    </div>
  )
}

export default function SimpleInterestCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Simple Interest Calculator"
        description="Calculate interest earned and total amount for a given principal, rate, and time."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Simple Interest Calculator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <SimpleInterestCalculator />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Simple Interest Questions"
        items={[
          { q: 'How is simple interest calculated?', a: 'SI = (P × R × T) / 100 — principal, annual rate, and time in years.' },
          { q: 'How is this different from compound interest?', a: 'Simple interest applies only to the original principal each period; compound interest also earns interest on interest.' },
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
