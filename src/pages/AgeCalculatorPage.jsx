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
      'name': 'Age Calculator',
      'description': 'Free online age calculator. Calculate exact age in years, months, and days from a date of birth, plus days until next birthday.',
      'url': 'https://www.aadhiraiinnovations.com/tools/age-calculator',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is exact age calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'By counting complete years, then complete months, then remaining days between the date of birth and today (or a chosen reference date).' } },
        { '@type': 'Question', 'name': 'Can I calculate age as of a different date, not today?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, set the "as of" date to any date — useful for eligibility checks, like age on the first day of an academic year.' } },
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

function calculateAge(birthDateStr, asOfStr) {
  const birth = new Date(birthDateStr)
  const asOf = asOfStr ? new Date(asOfStr) : new Date()
  if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime()) || birth > asOf) return null

  let years = asOf.getFullYear() - birth.getFullYear()
  let months = asOf.getMonth() - birth.getMonth()
  let days = asOf.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((asOf - birth) / (1000 * 60 * 60 * 24))

  const nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < asOf) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  const daysToNextBirthday = Math.ceil((nextBirthday - asOf) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays, daysToNextBirthday }
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */
function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [asOf, setAsOf] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const result = birthDate ? calculateAge(birthDate, asOf) : null

  const copyResults = async () => {
    if (!result) return
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days\nTotal Days Lived: ${result.totalDays}\nDays to Next Birthday: ${result.daysToNextBirthday}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => { setBirthDate(''); setAsOf('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">As of (optional, defaults to today)</label>
          <input
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Age</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{result.years}y {result.months}m {result.days}d</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-slate-600">Total Days Lived</span>
              <span className="font-medium text-slate-700">{result.totalDays.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Days to Next Birthday</span>
              <span className="font-medium text-slate-700">{result.daysToNextBirthday}</span>
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
          <p className="text-sm">Enter a date of birth to calculate age</p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function AgeCalculatorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Age Calculator"
        description="Calculate exact age in years, months, and days from a date of birth, plus days until the next birthday."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Age Calculator' }]}
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
              <AgeCalculator />
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Age Calculator Questions"
        items={[
          { q: 'How is exact age calculated?', a: 'By counting complete years, then months, then remaining days between the date of birth and today (or a chosen date).' },
          { q: 'Can I calculate age as of a different date?', a: 'Yes, set the "as of" field to any date — useful for eligibility checks like age on a specific cutoff date.' },
          { q: 'Is my data sent anywhere?', a: 'No, the calculation happens entirely in your browser.' },
        ]}
      />

      <ToolCta
        headline="Need eligibility rules built into your software?"
        body="Aadhirai Innovations builds custom business software with date-based rules, eligibility checks, and workflow automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
