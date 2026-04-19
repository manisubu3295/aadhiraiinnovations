import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react'
import Container from '../components/ui/Container'
import Breadcrumbs from '../components/ui/Breadcrumbs'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'GST Calculator India — Add & Remove GST Online',
      'description': 'Free GST calculator for India. Calculate GST inclusive/exclusive prices, CGST + SGST for intra-state and IGST for inter-state transactions.',
      'url': 'https://www.aadhiraiinnovations.com/tools/gst-calculator',
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://www.aadhiraiinnovations.com',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Tools',
            'item': 'https://www.aadhiraiinnovations.com/tools',
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'GST Calculator',
            'item': 'https://www.aadhiraiinnovations.com/tools/gst-calculator',
          },
        ],
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is GST and how is it calculated in India?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'GST (Goods and Services Tax) is a unified indirect tax in India that replaced VAT, service tax, and excise duty. It is calculated as a percentage of the selling price. You can either add GST to a net amount (GST-exclusive) or extract GST from a total price (GST-inclusive). The formula for adding GST: Gross Amount = Net Amount + (Net Amount × GST Rate / 100). For removing GST: Net Amount = Gross Amount × 100 / (100 + GST Rate).',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the difference between CGST, SGST, and IGST?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'CGST (Central Goods and Services Tax) and SGST (State Goods and Services Tax) are applied together for intra-state transactions (within the same state). Each is 50% of the total GST rate. For example, 18% GST splits into 9% CGST + 9% SGST. IGST (Integrated GST) is applied for inter-state transactions (between different states) and is the full GST amount collected by the central government. This calculator automatically handles both breakdowns.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do I calculate GST-exclusive price (add GST to net amount)?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'To calculate GST-exclusive price, select "Add GST" in the calculator. Enter the net amount (price without GST). The calculator multiplies it by the GST rate and adds the result to get the gross amount. Example: ₹10,000 at 18% GST = ₹10,000 + (₹10,000 × 18/100) = ₹11,800. This is the price customers pay.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do I calculate GST-inclusive price (remove GST from total)?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'To calculate GST-inclusive price, select "Remove GST" in the calculator. Enter the gross amount (total price including GST). The calculator reverses the formula to extract the GST portion and net amount. Formula: Net = Gross × 100 / (100 + GST Rate). Example: ₹11,800 at 18% GST = ₹10,000 net + ₹1,800 GST.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What are the current GST rates in India?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'India has six GST rate slabs: 0% (essential items like grains, milk, eggs), 3% (gold and silver), 5% (processed food, textbooks), 12% (intermediate goods), 18% (most goods and services), and 28% (luxury items, sin goods). Medicines are mostly in 0% and 5% brackets, while pharmacy equipment is typically 18%. This calculator supports all six rates.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How is GST calculated on medicines and pharmacy products?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Most essential medicines and drugs are taxed at 0% GST. Some categories like OTC medicines, supplements, and medical devices fall under 5% or 12% GST. Pharmacy equipment and supplies are typically 18% GST. Pharmacies must use this calculator to determine the correct GST for each item and ensure GST-compliant billing, which is critical for pharmacy audits and compliance.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the formula for GST calculation?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'For adding GST (exclusive → inclusive): GST Amount = Net Amount × (Rate / 100); Gross Amount = Net Amount + GST Amount. For removing GST (inclusive → exclusive): Net Amount = Gross Amount × (100 / (100 + Rate)); GST Amount = Gross Amount − Net Amount. For intra-state, split GST equally into CGST and SGST (50% each). For inter-state, IGST = full GST amount.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Does pharmacy billing software calculate GST automatically?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, professional pharmacy billing software like Medora+ calculates GST automatically for each item based on its category and rate. The software also ensures compliance by maintaining audit trails, generating GST-compliant invoices with CGST/SGST breakdowns, and helping with GST return filing (GSTR-1, GSTR-3B). While this free calculator is useful for quick calculations, billing software is essential for managing pharmacy operations at scale.',
          },
        },
      ],
    }

    // Inject WebPage schema
    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webpage')
    wpScript.text = JSON.stringify(webPageSchema)
    document.head.appendChild(wpScript)

    // Inject FAQ schema
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

/* ─── GST Calculator Logic ──────────────────────────────────────────────── */
function GstCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState(18)
  const [mode, setMode] = useState('add') // 'add' | 'remove'
  const [txnType, setTxnType] = useState('intra') // 'intra' | 'inter'
  const [copyFeedback, setCopyFeedback] = useState(false)

  const gsRates = [0, 3, 5, 12, 18, 28]

  const calculate = () => {
    if (!amount || isNaN(amount) || amount <= 0) return null

    const numAmount = parseFloat(amount)

    let netAmount, gstAmount, grossAmount, cgst, sgst, igst

    if (mode === 'add') {
      // Exclusive: add GST on top
      netAmount = numAmount
      gstAmount = (netAmount * rate) / 100
      grossAmount = netAmount + gstAmount
    } else {
      // Inclusive: remove GST from total
      grossAmount = numAmount
      netAmount = (grossAmount * 100) / (100 + rate)
      gstAmount = grossAmount - netAmount
    }

    if (txnType === 'intra') {
      cgst = gstAmount / 2
      sgst = gstAmount / 2
      igst = null
    } else {
      igst = gstAmount
      cgst = null
      sgst = null
    }

    return { netAmount, gstAmount, grossAmount, cgst, sgst, igst }
  }

  const result = calculate()

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹ 0'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getFormula = () => {
    if (!result) return ''
    if (mode === 'add') {
      return `₹ ${amount} × ${rate}% = ₹ ${result.gstAmount.toFixed(2)} GST | Total = ₹ ${result.grossAmount.toFixed(2)}`
    } else {
      return `₹ ${amount} ÷ (100 + ${rate}) × 100 = ₹ ${result.netAmount.toFixed(2)} Net | GST = ₹ ${result.gstAmount.toFixed(2)}`
    }
  }

  const copyResults = async () => {
    if (!result) return

    const text = `GST Calculation Results:
Net Amount: ${formatCurrency(result.netAmount)}
GST Amount: ${formatCurrency(result.gstAmount)}
${
  txnType === 'intra'
    ? `CGST (${rate / 2}%): ${formatCurrency(result.cgst)}\nSGST (${rate / 2}%): ${formatCurrency(result.sgst)}`
    : `IGST (${rate}%): ${formatCurrency(result.igst)}`
}
Gross Amount: ${formatCurrency(result.grossAmount)}

Formula: ${getFormula()}`

    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setAmount('')
    setRate(18)
    setMode('add')
    setTxnType('intra')
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="space-y-6">
        {/* Mode toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Calculator Mode
          </label>
          <div className="flex gap-3">
            {['add', 'remove'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-[#0B1F3A] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
                }`}
              >
                {m === 'add' ? 'Add GST' : 'Remove GST'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {mode === 'add' ? 'Net Amount (₹)' : 'Gross Amount (₹)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              GST Rate
            </label>
            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
            >
              {gsRates.map((r) => (
                <option key={r} value={r}>
                  {r}% GST
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Transaction Type
          </label>
          <div className="flex gap-3">
            {['intra', 'inter'].map((t) => (
              <button
                key={t}
                onClick={() => setTxnType(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  txnType === t
                    ? 'bg-[#0B1F3A] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
                }`}
              >
                {t === 'intra' ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Result card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-sm text-slate-600">
                {mode === 'add' ? 'Net Amount' : 'Net Amount'}
              </span>
              <span className="text-lg font-semibold text-[#0B1F3A]">
                {formatCurrency(result.netAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">GST ({rate}%)</span>
              <span className="text-lg font-semibold text-[#0B1F3A]">
                {formatCurrency(result.gstAmount)}
              </span>
            </div>

            {txnType === 'intra' ? (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">CGST ({rate / 2}%)</span>
                  <span className="font-medium text-slate-700">{formatCurrency(result.cgst)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">SGST ({rate / 2}%)</span>
                  <span className="font-medium text-slate-700">{formatCurrency(result.sgst)}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-slate-600">IGST ({rate}%)</span>
                <span className="font-medium text-slate-700">{formatCurrency(result.igst)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-sm font-medium text-[#0B1F3A]">
                {mode === 'add' ? 'Gross Amount' : 'Gross Amount'}
              </span>
              <span className="text-lg font-bold text-[#0B1F3A]">
                {formatCurrency(result.grossAmount)}
              </span>
            </div>
          </div>

          {/* Formula */}
          <div className="rounded-lg bg-[#0B1F3A]/5 px-4 py-3 border border-[#0B1F3A]/10">
            <p className="text-xs font-mono text-[#0B1F3A]/70 overflow-x-auto">
              {getFormula()}
            </p>
          </div>

          {/* Action buttons */}
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
      )}

      {/* Empty state */}
      {!result && (
        <div className="text-center py-8 text-slate-400">
          <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter an amount to calculate GST</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function GstCalculatorPage() {
  usePageSchema()

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <div className="mb-8 text-white">
            <Breadcrumbs
              items={[
                { label: 'Tools', href: '/tools' },
                { label: 'GST Calculator' },
              ]}
              isDark={true}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
              GST Calculator India
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Instantly calculate GST inclusive and exclusive prices. Supports all 6 GST rates, CGST + SGST for intra-state, and IGST for inter-state transactions.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Calculator Tool ────────────────────────────────────────────────── */}
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
              <GstCalculator />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── What is GST ────────────────────────────────────────────────────── */}
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
                Understanding GST
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is GST in India?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                GST (Goods and Services Tax) is India's unified indirect tax system that replaced multiple taxes including VAT (Value Added Tax), service tax, and excise duty. Implemented in July 2017, GST simplified India's tax structure and brought transparency to the economy.
              </p>
              <p>
                For businesses, GST is calculated as a percentage of the selling price. You have two ways to think about it:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>GST-Exclusive:</strong> You set a price without GST, then add GST on top. The customer pays the total (price + GST).
                </li>
                <li>
                  <strong>GST-Inclusive:</strong> You set a final price that includes GST. The customer pays this amount, but you must extract the GST portion to remit to the government.
                </li>
              </ul>
              <p>
                For pharmacies in India, this calculator is essential. You'll use it daily to calculate billing, determine profit margins, and ensure GST compliance during audits.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── How to Use ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                How It Works
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-12">
              Using the GST Calculator
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Choose Your Mode',
                  description:
                    'Select "Add GST" to calculate the total price customers pay, or "Remove GST" to find the net amount from a GST-inclusive price.',
                },
                {
                  step: '02',
                  title: 'Enter Amount & Rate',
                  description:
                    'Type in your price and pick the GST rate (0%, 3%, 5%, 12%, 18%, or 28%). Select whether it\'s intra-state or inter-state transaction.',
                },
                {
                  step: '03',
                  title: 'Get Instant Results',
                  description:
                    'See the breakdown: net amount, GST, CGST/SGST (or IGST), and total. Copy results or reset to calculate again.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 md:p-7">
                    <div className="text-4xl font-bold text-slate-200 mb-3 leading-none">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── CGST, SGST, IGST ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                GST Breakdown
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-10">
              CGST, SGST, and IGST Explained
            </h2>

            <div className="mb-10">
              <p className="text-slate-600 leading-relaxed mb-8">
                GST is split differently depending on where the transaction happens. Understanding this is crucial for compliance and accurate billing.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0B1F3A] text-white">
                      <th className="px-5 py-3 text-left font-semibold">GST Slab</th>
                      <th className="px-5 py-3 text-left font-semibold">Key Items</th>
                      <th className="px-5 py-3 text-left font-semibold">CGST</th>
                      <th className="px-5 py-3 text-left font-semibold">SGST</th>
                      <th className="px-5 py-3 text-left font-semibold">IGST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { rate: '0%', items: 'Essential medicines, milk, eggs, grains', cgst: '0%', sgst: '0%', igst: '0%' },
                      {
                        rate: '3%',
                        items: 'Gold, silver, some medicines',
                        cgst: '1.5%',
                        sgst: '1.5%',
                        igst: '3%',
                      },
                      {
                        rate: '5%',
                        items: 'OTC medicines, supplements, textbooks',
                        cgst: '2.5%',
                        sgst: '2.5%',
                        igst: '5%',
                      },
                      { rate: '12%', items: 'Medical devices, equipment', cgst: '6%', sgst: '6%', igst: '12%' },
                      { rate: '18%', items: 'Most goods & services', cgst: '9%', sgst: '9%', igst: '18%' },
                      { rate: '28%', items: 'Luxury goods, sin goods', cgst: '14%', sgst: '14%', igst: '28%' },
                    ].map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-5 py-3 font-semibold text-[#0B1F3A]">{row.rate}</td>
                        <td className="px-5 py-3 text-slate-600">{row.items}</td>
                        <td className="px-5 py-3 text-slate-600">{row.cgst}</td>
                        <td className="px-5 py-3 text-slate-600">{row.sgst}</td>
                        <td className="px-5 py-3 text-slate-600">{row.igst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'CGST (Central GST)',
                  description:
                    'Collected by the Central Government for intra-state transactions. For 18% GST, CGST is 9%.',
                },
                {
                  title: 'SGST (State GST)',
                  description:
                    'Collected by the State Government for intra-state transactions. For 18% GST, SGST is 9%.',
                },
                {
                  title: 'IGST (Integrated GST)',
                  description:
                    'Collected by the Central Government for inter-state transactions. It\'s the full GST amount (no split).',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Common Questions
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="grid gap-4 max-w-3xl">
            {[
              {
                q: 'What is GST and how is it calculated in India?',
                a: 'GST (Goods and Services Tax) is India\'s unified indirect tax that replaced VAT, service tax, and excise duty. It\'s calculated as a percentage of the selling price. For example, 18% GST on ₹10,000 = ₹1,800 tax, total ₹11,800. You can add GST on top of a net price (exclusive) or extract it from a total price (inclusive).',
              },
              {
                q: 'What is the difference between CGST, SGST, and IGST?',
                a: 'CGST (Central GST) and SGST (State GST) are used together for intra-state transactions within the same state, each being 50% of the total rate. IGST (Integrated GST) is used for inter-state transactions between different states and is the full GST amount. For example, 18% splits into 9% CGST + 9% SGST for intra-state, but is 18% IGST for inter-state.',
              },
              {
                q: 'How do I calculate GST-exclusive price (add GST)?',
                a: 'To calculate GST-exclusive, select "Add GST" in the calculator. Enter your net price (before GST). The formula is: Gross = Net + (Net × Rate/100). Example: ₹10,000 at 18% = ₹10,000 + (₹10,000 × 18/100) = ₹11,800. This is the price you charge customers.',
              },
              {
                q: 'How do I calculate GST-inclusive price (remove GST)?',
                a: 'Select "Remove GST" and enter the total price including GST. The formula is: Net = Gross × 100/(100+Rate). Example: ₹11,800 at 18% = ₹11,800 × 100/118 = ₹10,000 net, ₹1,800 GST. Use this when you know the final customer price and need to find your profit.',
              },
              {
                q: 'What are the current GST rates in India?',
                a: 'India has 6 GST slabs: 0% (essential medicines, grains, milk), 3% (gold, silver), 5% (OTC medicines, supplements), 12% (medical devices), 18% (most goods and services), and 28% (luxury items). Pharmacies primarily deal with 0%, 5%, 12%, and 18% rates.',
              },
              {
                q: 'How is GST calculated on medicines and pharmacy products?',
                a: 'Prescription medicines and essential drugs are 0% GST. OTC medicines, supplements, and topicals are typically 5%. Medical equipment, diagnostic kits, and devices are 12% or 18%. Pharmacy billing software like Medora+ automatically assigns the correct GST rate per item, ensuring compliance.',
              },
              {
                q: 'What is the formula for GST calculation?',
                a: 'For adding GST (exclusive): GST = Net × (Rate/100); Gross = Net + GST. For removing GST (inclusive): Net = Gross × (100/(100+Rate)); GST = Gross − Net. For intra-state, split GST equally into CGST and SGST (50% each). For inter-state, IGST = full GST amount.',
              },
              {
                q: 'Does pharmacy billing software calculate GST automatically?',
                a: 'Yes. Professional pharmacy software like Medora+ calculates GST automatically per item, maintains audit trails, generates GST-compliant invoices with CGST/SGST breakdowns, and helps with GST return filing. While this free calculator is useful, billing software is essential for daily pharmacy operations and compliance.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="font-semibold text-[#0B1F3A] mb-3 text-sm md:text-base">{item.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2] mb-4">
              Running a pharmacy? Your billing software should calculate GST automatically.
            </h2>
            <p className="text-base text-white/60 mb-7 leading-relaxed">
              While this calculator helps with quick GST math, Medora+ handles GST compliance at scale—automatically assigning rates per medicine, generating audit-ready invoices, and managing GSTR returns so you focus on customer care.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/products/medora-plus"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                See Medora+
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                Talk to Us
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
