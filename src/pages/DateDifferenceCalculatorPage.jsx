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
      'name': 'Date Difference Calculator',
      'description': 'Free online date difference calculator. Find the number of years, months, days, and weeks between two dates.',
      'url': 'https://www.aadhiraiinnovations.com/tools/date-difference-calculator',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is the difference between two dates calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'By counting complete years, then months, then remaining days between the start and end date, alongside a total day and week count.' } },
        { '@type': 'Question', 'name': 'Can the end date be before the start date?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The calculator expects the end date to be on or after the start date — swap them if you get an unexpected result.' } },
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

function calculateDateDiff(startStr, endStr) {
  const start = new Date(startStr)
  const end = new Date(endStr)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return null

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24))
  const totalWeeks = (totalDays / 7).toFixed(1)

  return { years, months, days, totalDays, totalWeeks }
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const result = startDate && endDate ? calculateDateDiff(startDate, endDate) : null

  const copyResults = async () => {
    if (!result) return
    const text = `Difference: ${result.years} years, ${result.months} months, ${result.days} days\nTotal Days: ${result.totalDays}\nTotal Weeks: ${result.totalWeeks}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => { setStartDate(''); setEndDate('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
      </div>

      {startDate && endDate && !result && (
        <p className="text-sm text-red-600">End date must be on or after the start date.</p>
      )}

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Difference</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{result.years}y {result.months}m {result.days}d</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Total Days</span>
              <span className="font-medium text-slate-700">{result.totalDays.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Total Weeks</span>
              <span className="font-medium text-slate-700">{result.totalWeeks}</span>
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
          <p className="text-sm">Enter both dates to calculate the difference</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function DateDifferenceCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Date Difference Calculator"
        description="Find the number of years, months, days, and weeks between two dates."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Date Difference Calculator' }]}
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
              <DateDifferenceCalculator />
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Date Difference Questions"
        items={[
          { q: 'How is the difference calculated?', a: 'By counting complete years, then months, then remaining days between the two dates, plus total days and weeks.' },
          { q: 'Can the end date be before the start date?', a: 'The end date must be on or after the start date — swap them if you get an error.' },
          { q: 'Is my data sent anywhere?', a: 'No, the calculation happens entirely in your browser.' },
        ]}
      />

      <ToolCta
        headline="Need date-based rules built into your software?"
        body="Aadhirai Innovations builds custom business software with scheduling, deadline tracking, and date-based workflow automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
