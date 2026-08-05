import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, Clock } from 'lucide-react'
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
      'name': 'Timestamp Converter',
      'description': 'Free online Unix timestamp converter. Convert a Unix timestamp to a human-readable date, or a date to a Unix timestamp.',
      'url': 'https://www.aadhiraiinnovations.com/tools/timestamp-converter',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is a Unix timestamp?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The number of seconds (or milliseconds) elapsed since January 1, 1970 UTC — used widely in databases, APIs, and logs to represent a moment in time.' } },
        { '@type': 'Question', 'name': 'How do I know if a timestamp is seconds or milliseconds?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Seconds timestamps for recent dates are 10 digits; millisecond timestamps are 13 digits. This tool auto-detects based on digit count.' } },
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

/* ─── Tool ───────────────────────────────────────────────────────────────── */
function TimestampConverter() {
  const [mode, setMode] = useState('toDate')
  const [timestamp, setTimestamp] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  let dateResult = null
  if (mode === 'toDate' && timestamp.trim()) {
    const raw = Number(timestamp.trim())
    if (!Number.isNaN(raw)) {
      const ms = timestamp.trim().length > 10 ? raw : raw * 1000
      const date = new Date(ms)
      if (!Number.isNaN(date.getTime())) {
        dateResult = {
          local: date.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' }),
          utc: date.toUTCString(),
          iso: date.toISOString(),
        }
      }
    }
  }

  let unixResult = null
  if (mode === 'toUnix' && dateInput) {
    const date = new Date(dateInput)
    if (!Number.isNaN(date.getTime())) {
      unixResult = { seconds: Math.floor(date.getTime() / 1000), ms: date.getTime() }
    }
  }

  const setNow = () => {
    if (mode === 'toDate') {
      setTimestamp(String(Math.floor(Date.now() / 1000)))
    } else {
      const now = new Date()
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      setDateInput(localIso)
    }
  }

  const copyResult = async () => {
    let text = ''
    if (mode === 'toDate' && dateResult) text = `Local: ${dateResult.local}\nUTC: ${dateResult.utc}\nISO: ${dateResult.iso}`
    if (mode === 'toUnix' && unixResult) text = `Seconds: ${unixResult.seconds}\nMilliseconds: ${unixResult.ms}`
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => { setTimestamp(''); setDateInput('') }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[{ key: 'toDate', label: 'Timestamp → Date' }, { key: 'toUnix', label: 'Date → Timestamp' }].map((m) => (
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

      {mode === 'toDate' ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Unix Timestamp</label>
            <button onClick={setNow} className="flex items-center gap-1 text-xs font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70">
              <Clock className="h-3 w-3" /> Now
            </button>
          </div>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="e.g. 1735689600 (seconds) or 1735689600000 (ms)"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Date &amp; Time</label>
            <button onClick={setNow} className="flex items-center gap-1 text-xs font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70">
              <Clock className="h-3 w-3" /> Now
            </button>
          </div>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
      )}

      {(mode === 'toDate' ? dateResult : unixResult) ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            {mode === 'toDate' ? (
              <>
                <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-[#0B1F3A]">Local</span>
                  <span className="text-sm font-semibold text-[#0B1F3A]">{dateResult.local}</span>
                </div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-600">UTC</span><span className="font-medium text-slate-700 font-mono">{dateResult.utc}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-600">ISO 8601</span><span className="font-medium text-slate-700 font-mono">{dateResult.iso}</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-[#0B1F3A]">Unix Seconds</span>
                  <span className="text-lg font-bold text-[#0B1F3A] font-mono">{unixResult.seconds}</span>
                </div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Unix Milliseconds</span><span className="font-medium text-slate-700 font-mono">{unixResult.ms}</span></div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyResult}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
              }`}
            >
              <Copy className="h-4 w-4" />
              {copyFeedback ? 'Copied!' : 'Copy Result'}
            </button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">{mode === 'toDate' ? 'Enter a Unix timestamp to convert' : 'Pick a date and time to convert'}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function TimestampConverterPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Timestamp Converter"
        description="Convert a Unix timestamp to a human-readable date, or a date to a Unix timestamp."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Timestamp Converter' }]}
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
              <TimestampConverter />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding Unix Time</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why systems use Unix timestamps
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                A Unix timestamp counts seconds since January 1, 1970 UTC — a single number that's unambiguous across time zones, easy to compare and sort, and used everywhere from database columns to API responses and server logs.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Timestamp Converter Questions"
        items={[
          { q: 'What is a Unix timestamp?', a: 'Seconds (or milliseconds) since January 1, 1970 UTC — used widely in databases, APIs, and logs.' },
          { q: 'How do I know if it\'s seconds or milliseconds?', a: 'Seconds timestamps for recent dates are 10 digits; milliseconds are 13 digits. This tool auto-detects.' },
          { q: 'Is my data sent anywhere?', a: 'No, conversion happens entirely in your browser.' },
        ]}
      />

      <ToolCta
        headline="Need custom backend systems built?"
        body="Aadhirai Innovations builds backend architecture and APIs — from data pipelines to full business systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
