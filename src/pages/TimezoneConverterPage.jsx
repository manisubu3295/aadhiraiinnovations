import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'World Time Zone Converter', 'description': 'Free time zone converter. Convert a date and time between world time zones, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/timezone-converter', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How does this time zone converter work?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It uses your browser\'s built-in Intl.DateTimeFormat API with IANA time zone names, so conversions correctly account for each zone\'s current daylight saving status — no external API needed.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const ZONES = [
  { tz: 'Asia/Kolkata', label: 'India (IST)' },
  { tz: 'America/New_York', label: 'New York (ET)' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { tz: 'Europe/London', label: 'London (GMT/BST)' },
  { tz: 'Europe/Berlin', label: 'Berlin (CET)' },
  { tz: 'Asia/Dubai', label: 'Dubai (GST)' },
  { tz: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { tz: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { tz: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { tz: 'UTC', label: 'UTC' },
]

function TimezoneConverter() {
  const [dateTime, setDateTime] = useState('')
  const [fromTz, setFromTz] = useState('Asia/Kolkata')
  const [toTz, setToTz] = useState('America/New_York')

  const converted = dateTime ? (() => {
    try {
      // Interpret the naive datetime-local value as a wall-clock time in `fromTz`, by
      // finding the UTC instant whose fromTz-rendered wall time matches the input.
      const [datePart, timePart] = dateTime.split('T')
      const naiveUtc = new Date(`${datePart}T${timePart}:00Z`).getTime()
      const fromOffsetMs = getOffsetMs(fromTz, naiveUtc)
      const actualUtc = naiveUtc - fromOffsetMs
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: toTz, dateStyle: 'full', timeStyle: 'long' })
      return formatter.format(new Date(actualUtc))
    } catch {
      return null
    }
  })() : null

  function getOffsetMs(timeZone, atUtcMs) {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const parts = Object.fromEntries(dtf.formatToParts(new Date(atUtcMs)).map((p) => [p.type, p.value]))
    const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second)
    return asUtc - atUtcMs
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Date & Time</label>
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">From</label>
          <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">{ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}</select>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">To</label>
          <select value={toTz} onChange={(e) => setToTz(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">{ZONES.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}</select>
        </div>
      </div>

      {converted ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="bg-white rounded-lg px-4 py-3"><span className="text-xs text-slate-500 block mb-1">Converted Time</span><span className="text-lg font-bold text-[#0B1F3A]">{converted}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Pick a date/time and both time zones to convert</p></div>)}
    </div>
  )
}

export default function TimezoneConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="World Time Zone Converter" description="Convert a date and time between world time zones — accounts for daylight saving automatically." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Time Zone Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><TimezoneConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Time Zone Converter Questions" items={[
        { q: 'How does this time zone converter work?', a: 'It uses your browser\'s built-in Intl.DateTimeFormat with IANA time zones, correctly accounting for daylight saving.' },
      ]} />
      <ToolCta headline="Need custom business software?" body="Aadhirai Innovations builds enterprise software for pharmacy, billing, HR, and transport businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
