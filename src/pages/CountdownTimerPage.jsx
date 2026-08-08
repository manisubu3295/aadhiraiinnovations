import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Countdown Timer', 'description': 'Free online countdown timer. Count down to any date and time, live, in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/countdown-timer', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does the countdown keep running if I leave the page?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, the countdown runs only while this page is open in your browser tab. Reopen it to see the current remaining time.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function splitDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function CountdownTimer() {
  const [target, setTarget] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const targetMs = target ? new Date(target).getTime() : null
  const remaining = targetMs ? targetMs - now : null
  const parts = remaining !== null ? splitDuration(remaining) : null
  const isPast = remaining !== null && remaining <= 0

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Date & Time</label>
        <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>

      {parts ? (
        isPast ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center"><p className="text-lg font-semibold text-[#0B1F3A]">This moment has passed!</p></motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3">
            {[['Days', parts.days], ['Hours', parts.hours], ['Minutes', parts.minutes], ['Seconds', parts.seconds]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 py-6 text-center">
                <div className="text-3xl font-bold text-[#0B1F3A] tabular-nums">{value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        )
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Pick a target date and time to start the countdown</p></div>)}

      {target && <button onClick={() => setTarget('')} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors mx-auto"><RotateCcw className="h-4 w-4" />Reset</button>}
    </div>
  )
}

export default function CountdownTimerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Countdown Timer" description="Count down to any date and time, live, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Countdown Timer' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><CountdownTimer /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Countdown Timer Questions" items={[
        { q: 'Does the countdown keep running if I leave the page?', a: 'No, it only runs while this tab is open — reopen it to see the current remaining time.' },
      ]} />
      <ToolCta headline="Need custom business software?" body="Aadhirai Innovations builds enterprise software for pharmacy, billing, HR, and transport businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
