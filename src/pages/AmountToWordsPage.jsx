import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { amountToIndianWords } from '../utils/numberToWords'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Amount to Words Converter',
      'description': 'Free online tool to convert a rupee amount into words using the Indian numbering system, for invoices and cheques.',
      'url': 'https://www.aadhiraiinnovations.com/tools/amount-to-words',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How do I write an amount in words for an invoice?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Enter the rupee amount into the calculator and it instantly writes it out using the Indian numbering system (Lakh, Crore) in the standard invoice format, e.g. "Rupees One Lakh Twenty Three Thousand Only".',
          },
        },
        {
          '@type': 'Question',
          'name': 'Does it support paise?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. If you enter an amount with decimals, e.g. 1234.50, it converts the paise portion too: "Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only".',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why does it use Lakh and Crore instead of Million and Billion?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "This is the numbering system used on Indian invoices, cheques, and GST documents (1 Lakh = 100,000, 1 Crore = 10,000,000), matching what businesses and banks expect in India.",
          },
        },
        {
          '@type': 'Question',
          'name': 'Is there a limit to how large an amount I can convert?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The converter supports amounts up to 999 crore, which covers virtually all invoicing and billing use cases.',
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

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function AmountToWordsConverter() {
  const [amount, setAmount] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const numericAmount = Number(amount)
  const words = amount !== '' && !Number.isNaN(numericAmount) ? amountToIndianWords(numericAmount) : null

  const copyWords = async () => {
    if (!words) return
    try {
      await navigator.clipboard.writeText(words)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Amount (₹)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount, e.g. 123456.50"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
        />
      </div>

      {words ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Words</span>
            <p className="mt-2 text-lg font-semibold text-[#0B1F3A] leading-relaxed">{words}</p>
          </div>

          <button
            onClick={copyWords}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              copyFeedback
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
            }`}
          >
            <Copy className="h-4 w-4" />
            {copyFeedback ? 'Copied!' : 'Copy Words'}
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">Enter an amount to see it in words</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function AmountToWordsPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Amount to Words Converter"
        description="Convert any ₹ amount into words using the Indian numbering system — Lakh, Crore, and paise — for invoices, cheques, and quotations."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Amount to Words' },
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
              <AmountToWordsConverter />
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
                Why This Matters
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why invoices need amounts written in words
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Indian invoices, cheques, and GST documents conventionally spell out the total amount in words alongside the numeral — it removes any ambiguity from a stray digit or decimal point, and is often expected by accountants, auditors, and banks.
              </p>
              <p>
                This converter uses the Indian numbering system (Lakh = 1,00,000, Crore = 1,00,00,000) rather than the Western Million/Billion system, matching what shows up on Indian financial documents. Paise are converted automatically when you enter a decimal amount.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Amount to Words Questions"
        items={[
          {
            q: 'How do I write an amount in words for an invoice?',
            a: 'Enter the rupee amount and it instantly writes it out using the Indian numbering system in the standard invoice format, e.g. "Rupees One Lakh Twenty Three Thousand Only".',
          },
          {
            q: 'Does it support paise?',
            a: 'Yes. An amount like 1234.50 converts to "Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only".',
          },
          {
            q: 'Why Lakh and Crore instead of Million and Billion?',
            a: 'This is the numbering system used on Indian invoices, cheques, and GST documents, matching what businesses and banks expect in India.',
          },
          {
            q: 'Is there a limit to the amount I can convert?',
            a: 'The converter supports amounts up to 999 crore, which covers virtually all invoicing and billing use cases.',
          },
        ]}
      />

      <ToolCta
        headline="Need a full invoicing workflow, not just one line?"
        body="Aadhirai Innovations builds GST-compliant billing and invoicing software for Indian businesses — including Aadhirai Billing, our multi-tenant billing platform."
        ctas={[
          { label: 'Explore Aadhirai Billing', href: '/products/billing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
