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
      'name': 'Discount & Margin Calculator',
      'description': 'Free online discount and profit margin calculator. Calculate discounted prices, or find profit margin and markup from cost and selling price.',
      'url': 'https://www.aadhiraiinnovations.com/tools/discount-calculator',
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
          'name': 'How do I calculate a discounted price?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Discounted price = Original price − (Original price × Discount% / 100). A ₹1000 item at 20% off becomes ₹800.' },
        },
        {
          '@type': 'Question',
          'name': 'What is the difference between margin and markup?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Margin is profit as a percentage of selling price. Markup is profit as a percentage of cost price. The same ₹ profit gives a lower margin % than markup %.' },
        },
        {
          '@type': 'Question',
          'name': 'How do I calculate profit margin?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Margin % = (Selling price − Cost price) / Selling price × 100. Markup % = (Selling price − Cost price) / Cost price × 100.' },
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

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function DiscountMarginCalculator() {
  const [mode, setMode] = useState('discount')

  // Discount mode
  const [price, setPrice] = useState('')
  const [discountPct, setDiscountPct] = useState('')

  // Margin mode
  const [cost, setCost] = useState('')
  const [selling, setSelling] = useState('')

  const [copyFeedback, setCopyFeedback] = useState(false)

  const discountResult = price !== '' && discountPct !== ''
    ? (() => {
        const p = Number(price)
        const d = Number(discountPct)
        const saved = (p * d) / 100
        return { finalPrice: p - saved, saved }
      })()
    : null

  const marginResult = cost !== '' && selling !== '' && Number(selling) !== 0 && Number(cost) !== 0
    ? (() => {
        const c = Number(cost)
        const s = Number(selling)
        const profit = s - c
        return { profit, marginPct: (profit / s) * 100, markupPct: (profit / c) * 100 }
      })()
    : null

  const copyResults = async () => {
    let text = ''
    if (mode === 'discount' && discountResult) {
      text = `Original Price: ${formatCurrency(Number(price))}\nDiscount: ${discountPct}%\nYou Save: ${formatCurrency(discountResult.saved)}\nFinal Price: ${formatCurrency(discountResult.finalPrice)}`
    } else if (mode === 'margin' && marginResult) {
      text = `Cost Price: ${formatCurrency(Number(cost))}\nSelling Price: ${formatCurrency(Number(selling))}\nProfit: ${formatCurrency(marginResult.profit)}\nMargin: ${marginResult.marginPct.toFixed(2)}%\nMarkup: ${marginResult.markupPct.toFixed(2)}%`
    }
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setPrice(''); setDiscountPct(''); setCost(''); setSelling('')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {[{ key: 'discount', label: 'Discount' }, { key: 'margin', label: 'Margin / Markup' }].map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              mode === m.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'discount' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Original Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 1000"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Discount (%)</label>
            <input type="number" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} placeholder="e.g. 20"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Cost Price (₹)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g. 400"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Selling Price (₹)</label>
            <input type="number" value={selling} onChange={(e) => setSelling(e.target.value)} placeholder="e.g. 500"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
        </div>
      )}

      {(mode === 'discount' ? discountResult : marginResult) ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            {mode === 'discount' ? (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-[#0B1F3A]">Final Price</span>
                  <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(discountResult.finalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-slate-600">You Save</span>
                  <span className="font-medium text-slate-700">{formatCurrency(discountResult.saved)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-[#0B1F3A]">Profit</span>
                  <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(marginResult.profit)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-slate-600">Margin (% of selling price)</span>
                  <span className="font-medium text-slate-700">{marginResult.marginPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Markup (% of cost price)</span>
                  <span className="font-medium text-slate-700">{marginResult.markupPct.toFixed(2)}%</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyResults}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
              }`}
            >
              <Copy className="h-4 w-4" />
              {copyFeedback ? 'Copied!' : 'Copy Results'}
            </button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">{mode === 'discount' ? 'Enter price and discount % to calculate' : 'Enter cost and selling price to calculate'}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function DiscountCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Discount & Margin Calculator"
        description="Calculate a discounted price, or find your profit margin and markup from cost and selling price."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Discount & Margin Calculator' }]}
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
              <DiscountMarginCalculator />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding Margin vs Markup</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Margin and markup measure profit differently
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                <strong>Margin</strong> is profit as a percentage of your <em>selling price</em> — it tells you what share of each rupee a customer pays is profit.
              </p>
              <p>
                <strong>Markup</strong> is profit as a percentage of your <em>cost price</em> — it tells you how much you added on top of what you paid.
              </p>
              <p>
                The same ₹100 profit on a ₹400 cost item (sold at ₹500) is a 20% margin but a 25% markup. Confusing the two is a common pricing mistake — this calculator gives you both from the same inputs.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Discount & Margin Calculator Questions"
        items={[
          { q: 'How do I calculate a discounted price?', a: 'Discounted price = Original price − (Original price × Discount% / 100). A ₹1000 item at 20% off becomes ₹800.' },
          { q: 'What is the difference between margin and markup?', a: 'Margin is profit ÷ selling price. Markup is profit ÷ cost price. The same profit gives a lower margin % than markup %.' },
          { q: 'How do I calculate profit margin?', a: 'Margin % = (Selling price − Cost price) / Selling price × 100.' },
          { q: 'Which should I use for pricing decisions?', a: 'Retailers typically price using margin (target % of revenue as profit); markup is more common in manufacturing/wholesale costing.' },
        ]}
      />

      <ToolCta
        headline="Need pricing rules built into your billing system?"
        body="Aadhirai Billing and Medora+ handle per-product pricing, margin rules, and GST-compliant invoicing automatically — no manual calculation at the counter."
        ctas={[
          { label: 'See Pricing', href: '/pricing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
