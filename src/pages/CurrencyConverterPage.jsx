import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
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
      'name': 'Currency Converter',
      'description': 'Free online currency converter with live, daily exchange rates for major world currencies.',
      'url': 'https://www.aadhiraiinnovations.com/tools/currency-converter',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.aadhiraiinnovations.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.aadhiraiinnovations.com/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Currency Converter', 'item': 'https://www.aadhiraiinnovations.com/tools/currency-converter' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Where do the exchange rates come from?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Rates come from the European Central Bank's daily reference rates via the Frankfurter API, updated once per business day.",
          },
        },
        {
          '@type': 'Question',
          'name': 'Are these rates suitable for actual money transfers?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'These are reference/mid-market rates for informational purposes. Banks and payment providers add their own margin, so the rate you get on an actual transfer will differ slightly.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How often are rates updated?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Once per business day (rates do not update on weekends or ECB holidays, reflecting the last available business day).',
          },
        },
        {
          '@type': 'Question',
          'name': 'Which currencies are supported?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'All major world currencies including INR, USD, EUR, GBP, JPY, AUD, CAD, SGD, AED, and more.',
          },
        },
      ],
    }

    const scripts = [
      ['webapplication', webAppSchema],
      ['breadcrumblist', breadcrumbSchema],
      ['faqpage', faqSchema],
    ].map(([key, data]) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-schema', key)
      el.text = JSON.stringify(data)
      document.head.appendChild(el)
      return el
    })

    return () => scripts.forEach((el) => el.remove())
  }, [])
}

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CNY', 'CHF', 'ZAR']

/* Fetches the from→to rate from frankfurter.dev (free, keyless, CORS-enabled, ECB-sourced).
   Note: the old api.frankfurter.app host now 301-redirects here, but that redirect response
   itself lacks CORS headers, which browsers correctly block for a cross-origin fetch() — so
   this must call the .dev host directly rather than relying on the redirect. */
function useExchangeRate(from, to) {
  const [state, setState] = useState({ status: 'idle', rate: null, date: null })

  useEffect(() => {
    // Same currency needs no fetch — handled below via the early return in the hook's own result.
    if (from === to) return

    let cancelled = false

    fetch(`https://api.frankfurter.dev/v1/latest?from=${from}&to=${to}`)
      .then((res) => {
        if (!res.ok) throw new Error('Rate lookup failed')
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setState({ status: 'ready', rate: data.rates[to], date: data.date })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', rate: null, date: null })
      })

    return () => {
      cancelled = true
    }
  }, [from, to])

  if (from === to) return { status: 'ready', rate: 1, date: null }
  return state
}

/* ─── Converter ──────────────────────────────────────────────────────────── */
function CurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const { status, rate, date } = useExchangeRate(from, to)

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const numericAmount = Number(amount)
  const converted =
    status === 'ready' && amount !== '' && !Number.isNaN(numericAmount) ? numericAmount * rate : null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 items-end sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm mb-2"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap currencies"
          className="flex-none p-2.5 rounded-full bg-slate-100 text-[#0B1F3A] hover:bg-slate-200 transition-colors mb-1 justify-self-center"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Converted
          </label>
          <div className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-[#0B1F3A] mb-2 truncate">
            {status === 'error' && 'Unavailable'}
            {status === 'idle' && '…'}
            {status === 'ready' && converted !== null ? Number(converted.toFixed(4)).toString() : status === 'ready' ? '—' : null}
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {status === 'ready' && (
        <div className="rounded-lg bg-[#0B1F3A]/5 px-4 py-3 border border-[#0B1F3A]/10 text-center">
          <p className="text-sm text-[#0B1F3A]">
            1 {from} = {Number(rate.toFixed(6)).toString()} {to}
          </p>
          {date && <p className="mt-1 text-xs text-slate-500">Rates as of {date} (ECB reference rates)</p>}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 px-4 py-3 border border-red-200 text-center">
          <p className="text-sm text-red-600">
            Couldn't fetch live exchange rates right now. Check your connection and try again.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function CurrencyConverterPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Currency Converter"
        description="Convert between world currencies using live, daily reference exchange rates. Free, instant, no signup."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Currency Converter' },
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
              <CurrencyConverter />
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
                Understanding Exchange Rates
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              How do live exchange rates work?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Currency exchange rates float continuously based on global supply and demand, but most reference sources — including central banks — publish an official rate once per business day. This converter pulls the European Central Bank's daily reference rates, which cover all major world currencies and update every business day.
              </p>
              <p>
                These are <strong>mid-market reference rates</strong> — the midpoint between buy and sell prices, useful for estimates and comparisons. Banks, card networks, and payment providers apply their own margin on top when you actually convert money, so the rate on your bank statement will typically differ slightly from the reference rate shown here.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Currency Converter Questions"
        items={[
          {
            q: 'Where do the exchange rates come from?',
            a: "The European Central Bank's daily reference rates, via the Frankfurter API, updated once per business day.",
          },
          {
            q: 'Are these rates suitable for actual money transfers?',
            a: 'These are reference/mid-market rates for informational purposes — banks and payment providers add their own margin on actual transfers.',
          },
          {
            q: 'How often are rates updated?',
            a: 'Once per business day; rates do not update on weekends or ECB holidays.',
          },
          {
            q: 'Which currencies are supported?',
            a: 'All major world currencies including INR, USD, EUR, GBP, JPY, AUD, CAD, SGD, AED, and more.',
          },
        ]}
      />

      <ToolCta
        headline="Doing business across currencies?"
        body="Aadhirai Innovations builds ERP and billing systems that handle multi-currency invoicing, GST, and financial reporting automatically."
        ctas={[
          { label: 'Explore Aadhirai Billing', href: '/products/billing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
