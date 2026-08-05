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
      'name': 'Percentage Calculator',
      'description': 'Free online percentage calculator. Find X% of a number, what percentage one number is of another, or the percentage change between two numbers.',
      'url': 'https://www.aadhiraiinnovations.com/tools/percentage-calculator',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How do I calculate X% of a number?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Multiply the number by the percentage, then divide by 100. For example, 20% of 500 = (20 × 500) / 100 = 100.' },
        },
        {
          '@type': 'Question',
          'name': 'How do I find what percentage one number is of another?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Divide the first number by the second, then multiply by 100. For example, 50 is what % of 200 → (50 / 200) × 100 = 25%.' },
        },
        {
          '@type': 'Question',
          'name': 'How is percentage change calculated?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Percentage change = ((New Value − Old Value) / Old Value) × 100. A positive result is an increase, a negative result is a decrease.' },
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
    return () => { wpScript.remove(); faqScript.remove() }
  }, [])
}

const MODES = [
  { key: 'of', label: 'X% of Y' },
  { key: 'isWhatPercent', label: 'X is what % of Y' },
  { key: 'change', label: '% Change' },
]

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value)
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function PercentageCalculator() {
  const [mode, setMode] = useState('of')
  const [x, setX] = useState('')
  const [y, setY] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const numX = Number(x)
  const numY = Number(y)
  const hasInputs = x !== '' && y !== ''

  let result = null
  let resultLabel = ''
  if (hasInputs) {
    if (mode === 'of') {
      result = (numX / 100) * numY
      resultLabel = `${x}% of ${y}`
    } else if (mode === 'isWhatPercent') {
      if (numY !== 0) {
        result = (numX / numY) * 100
        resultLabel = `${x} as a % of ${y}`
      }
    } else if (mode === 'change') {
      if (numX !== 0) {
        result = ((numY - numX) / numX) * 100
        resultLabel = `Change from ${x} to ${y}`
      }
    }
  }

  const copyResults = async () => {
    if (result === null) return
    const text = `${resultLabel}: ${formatNumber(result)}${mode === 'of' ? '' : '%'}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setX('')
    setY('')
  }

  const xLabel = mode === 'of' ? 'Percentage (%)' : mode === 'isWhatPercent' ? 'Value' : 'Old Value'
  const yLabel = mode === 'of' ? 'Number' : mode === 'isWhatPercent' ? 'Total' : 'New Value'

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              mode === m.key
                ? 'bg-[#0B1F3A] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{xLabel}</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="e.g. 20"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{yLabel}</label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="e.g. 500"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
      </div>

      {result !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">{resultLabel}</span>
              <span className="text-lg font-bold text-[#0B1F3A]">
                {formatNumber(result)}{mode === 'of' ? '' : '%'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyResults}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
              }`}
            >
              <Copy className="h-4 w-4" />
              {copyFeedback ? 'Copied!' : 'Copy Result'}
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
          <p className="text-sm">Enter both values to calculate</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function PercentageCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Percentage Calculator"
        description="Find X% of a number, what percentage one number is of another, or the percentage change between two values."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Percentage Calculator' }]}
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
              <PercentageCalculator />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding Percentages</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Three ways to work with percentages
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                <strong>X% of Y</strong> answers "what is 20% of 500?" — multiply Y by X, divide by 100.
              </p>
              <p>
                <strong>X is what % of Y</strong> answers "50 out of 200 is what percentage?" — divide X by Y, multiply by 100.
              </p>
              <p>
                <strong>% Change</strong> answers "prices went from 200 to 250 — what's the percentage increase?" — divide the difference by the original value, multiply by 100. Useful for discounts, growth rates, and comparing two periods.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Percentage Calculator Questions"
        items={[
          { q: 'How do I calculate X% of a number?', a: 'Multiply the number by the percentage, then divide by 100. 20% of 500 = (20 × 500) / 100 = 100.' },
          { q: 'How do I find what percentage one number is of another?', a: 'Divide the first number by the second, then multiply by 100. 50 out of 200 = (50 / 200) × 100 = 25%.' },
          { q: 'How is percentage change calculated?', a: 'Percentage change = ((New − Old) / Old) × 100. Positive means an increase, negative means a decrease.' },
          { q: 'Can I use this for discounts and markups?', a: 'Yes — for a straightforward discount/margin workflow, use the dedicated Discount / Margin Calculator instead.' },
        ]}
      />

      <ToolCta
        headline="Need pricing and margin logic built into your software?"
        body="Aadhirai Innovations builds custom billing and pricing systems with margin, discount, and tax calculations built in — for pharmacies and growing businesses."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
