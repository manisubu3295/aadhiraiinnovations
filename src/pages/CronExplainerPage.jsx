import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Cron Expression Explainer',
      'description': 'Free online cron expression explainer. Paste a 5-field cron expression and get a plain-English explanation of when it runs.',
      'url': 'https://www.aadhiraiinnovations.com/tools/cron-explainer',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What cron format is supported?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Standard 5-field cron: minute, hour, day of month, month, day of week. Extended 6-field formats with seconds aren\'t supported.' } },
        { '@type': 'Question', 'name': 'Does this validate my cron expression fully?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This gives a best-effort plain-English explanation of common patterns (*, step values, ranges, lists) — always verify against your actual scheduler before deploying.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const FIELD_NAMES = ['minute', 'hour', 'day of the month', 'month', 'day of the week']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function explainField(value, name, idx) {
  if (value === '*') return `every ${name}`
  if (/^\*\/\d+$/.test(value)) return `every ${value.split('/')[1]} ${name}(s)`
  if (/^\d+-\d+$/.test(value)) {
    const [a, b] = value.split('-')
    return `${name}s ${labelValue(a, idx)} through ${labelValue(b, idx)}`
  }
  if (/^[\d,]+$/.test(value)) {
    const parts = value.split(',').map((v) => labelValue(v, idx))
    return `${name} ${parts.join(', ')}`
  }
  return `${name} "${value}"`
}

function labelValue(v, idx) {
  const n = Number(v)
  if (idx === 3 && n >= 1 && n <= 12) return MONTH_NAMES[n - 1]
  if (idx === 4 && n >= 0 && n <= 6) return DOW_NAMES[n]
  return v
}

function explainCron(expr) {
  const fields = expr.trim().split(/\s+/)
  if (fields.length !== 5) return { error: 'Expected exactly 5 fields: minute hour day-of-month month day-of-week.' }
  const [minute, hour, dom, month, dow] = fields
  const parts = [minute, hour, dom, month, dow].map((f, i) => explainField(f, FIELD_NAMES[i], i))
  let summary = `Runs at ${parts[0]} past ${parts[1]}`
  if (dom !== '*') summary += `, on ${parts[2]}`
  if (month !== '*') summary += `, in ${parts[3]}`
  if (dow !== '*') summary += `, on ${parts[4]}`
  return { summary, parts, fields }
}

function CronExplainerTool() {
  const [expr, setExpr] = useState('')

  const result = expr.trim() ? explainCron(expr) : null

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Cron Expression</label>
        <input type="text" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="e.g. 30 2 * * 1-5"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
      </div>

      {result?.error && <p className="text-sm text-red-600">{result.error}</p>}

      {result && !result.error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-[#0B1F3A] capitalize">{result.summary}.</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {FIELD_NAMES.map((name, i) => (
              <div key={name} className="rounded-lg border border-slate-200 bg-white px-2 py-3 text-center">
                <div className="font-mono text-sm text-[#0B1F3A] font-semibold">{result.fields[i]}</div>
                <div className="mt-1 text-[10px] text-slate-400 capitalize">{name}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Best-effort explanation of common patterns (*, step values, ranges, lists). Always verify against your actual scheduler before deploying.
        </p>
      </div>
    </div>
  )
}

export default function CronExplainerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Cron Expression Explainer"
        description="Paste a 5-field cron expression and get a plain-English explanation of when it runs."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Cron Expression Explainer' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <CronExplainerTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Cron Explainer Questions"
        items={[
          { q: 'What cron format is supported?', a: 'Standard 5-field cron: minute, hour, day of month, month, day of week.' },
          { q: 'Does this fully validate my expression?', a: 'It gives a best-effort explanation of common patterns — verify against your actual scheduler before deploying.' },
          { q: 'Is my data sent anywhere?', a: 'No, everything happens in your browser.' },
        ]}
      />
      <ToolCta
        headline="Need scheduled jobs and automation built?"
        body="Aadhirai Innovations builds backend systems with reliable scheduled jobs, background processing, and automation."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
