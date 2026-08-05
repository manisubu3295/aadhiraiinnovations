import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
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
      'name': 'TDS Calculator',
      'description': 'Free TDS (Tax Deducted at Source) calculator for India. Estimate TDS deduction and net payable amount by section — 194C, 194H, 194I, 194J, and more.',
      'url': 'https://www.aadhiraiinnovations.com/tools/tds-calculator',
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
          'name': 'Are the TDS rates shown here always current?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'This tool shows standard TDS rates commonly applicable under the Income Tax Act. Rates, thresholds, and exemptions change with each year\'s Finance Act — always verify current rates on the Income Tax Department\'s e-filing portal or with a CA before filing.' },
        },
        {
          '@type': 'Question',
          'name': 'What is TDS?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'TDS (Tax Deducted at Source) is tax the payer deducts before making certain payments (contractor fees, rent, commission, professional fees, etc.) and deposits directly with the government on the payee\'s behalf.' },
        },
        {
          '@type': 'Question',
          'name': 'What happens if payment is below the threshold?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Most TDS sections only apply once payments in a financial year cross a specified threshold. Below that threshold, no TDS is deducted — check the threshold shown for your section.' },
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

// Standard TDS sections and commonly-applicable rates under the Income Tax Act, 1961.
// Rates/thresholds are set by each year's Finance Act — this is a reference starting point,
// not a substitute for verifying the current rate before filing.
const TDS_SECTIONS = [
  { code: '194A', label: '194A — Interest (other than securities)', rate: 10, threshold: '₹40,000/yr (₹50,000 for senior citizens)' },
  { code: '194C', label: '194C — Payment to contractors (individual/HUF)', rate: 1, threshold: '₹30,000 single / ₹1,00,000 aggregate per year' },
  { code: '194C-other', label: '194C — Payment to contractors (others)', rate: 2, threshold: '₹30,000 single / ₹1,00,000 aggregate per year' },
  { code: '194D', label: '194D — Insurance commission', rate: 5, threshold: '₹15,000/yr' },
  { code: '194H', label: '194H — Commission or brokerage', rate: 5, threshold: '₹15,000/yr' },
  { code: '194I-land', label: '194I — Rent (land, building, furniture)', rate: 10, threshold: '₹2,40,000/yr' },
  { code: '194I-plant', label: '194I — Rent (plant & machinery)', rate: 2, threshold: '₹2,40,000/yr' },
  { code: '194J-prof', label: '194J — Professional fees', rate: 10, threshold: '₹30,000/yr' },
  { code: '194J-tech', label: '194J — Technical services fees', rate: 2, threshold: '₹30,000/yr' },
  { code: '194Q', label: '194Q — Purchase of goods', rate: 0.1, threshold: 'Purchases above ₹50,00,000/yr from one seller' },
]

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function TdsCalculator() {
  const [sectionCode, setSectionCode] = useState(TDS_SECTIONS[1].code)
  const [amount, setAmount] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const section = TDS_SECTIONS.find((s) => s.code === sectionCode)
  const hasAmount = amount !== '' && Number(amount) > 0
  const tdsAmount = hasAmount ? (Number(amount) * section.rate) / 100 : null
  const netPayable = hasAmount ? Number(amount) - tdsAmount : null

  const copyResults = async () => {
    if (tdsAmount === null) return
    const text = `Section: ${section.label}\nGross Amount: ${formatCurrency(Number(amount))}\nTDS Rate: ${section.rate}%\nTDS Deducted: ${formatCurrency(tdsAmount)}\nNet Payable: ${formatCurrency(netPayable)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => setAmount('')

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">TDS Section</label>
        <select
          value={sectionCode}
          onChange={(e) => setSectionCode(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white"
        >
          {TDS_SECTIONS.map((s) => (
            <option key={s.code} value={s.code}>{s.label} — {s.rate}%</option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-400">Threshold: {section.threshold}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Gross Payment Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 50000"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
        />
      </div>

      {tdsAmount !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Net Payable</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatCurrency(netPayable)}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Gross Amount</span>
              <span className="font-medium text-slate-700">{formatCurrency(Number(amount))}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">TDS Deducted ({section.rate}%)</span>
              <span className="font-medium text-slate-700">{formatCurrency(tdsAmount)}</span>
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
          <p className="text-sm">Select a section and enter the payment amount to calculate TDS</p>
        </div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Rates and thresholds shown are standard reference values and can change with each year's Finance Act. Verify current rates on the Income Tax e-filing portal or with a CA before filing.
        </p>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function TdsCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="TDS Calculator"
        description="Estimate TDS deduction and net payable amount for common sections — contractor payments, rent, commission, professional fees, and more."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'TDS Calculator' }]}
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
              <TdsCalculator />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding TDS</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is TDS, and who deducts it?
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                TDS (Tax Deducted at Source) shifts part of the tax-collection responsibility to the payer. When a business pays a contractor, landlord, or professional above a specified threshold, it deducts tax at a fixed percentage before paying and deposits that amount with the government — the payee gets credit for it when filing their own return.
              </p>
              <p>
                Each type of payment falls under a specific section of the Income Tax Act with its own rate and threshold — this calculator covers the sections most relevant to small and mid-sized businesses.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="TDS Calculator Questions"
        items={[
          { q: 'Are the TDS rates shown here always current?', a: 'These are standard reference rates. Rates and thresholds change with each year\'s Finance Act — verify current figures on the Income Tax e-filing portal or with a CA before filing.' },
          { q: 'What is TDS?', a: 'Tax Deducted at Source — the payer deducts tax before certain payments and deposits it with the government on the payee\'s behalf.' },
          { q: 'What happens if payment is below the threshold?', a: 'No TDS applies below the specified threshold for that section — check the threshold shown for your selected section.' },
          { q: 'Does this calculator file my TDS return?', a: 'No, this only estimates the deduction amount. TDS returns (Form 26Q etc.) are filed separately through the Income Tax portal.' },
        ]}
      />

      <ToolCta
        headline="Need TDS and compliance built into your accounting workflow?"
        body="Aadhirai Innovations builds custom business software with tax, billing, and compliance logic built in — from pharmacy management to full ERP systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
