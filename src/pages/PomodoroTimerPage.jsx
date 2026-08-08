import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Pomodoro Timer', 'description': 'Free online Pomodoro timer. Work in focused 25-minute sessions with 5-minute breaks, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/pomodoro-timer', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the Pomodoro Technique?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A time-management method: work in focused 25-minute sessions ("pomodoros"), followed by a 5-minute break. After 4 pomodoros, take a longer break.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const WORK_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

function PomodoroTimer() {
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          if (mode === 'work') { setCycles((c) => c + 1); setMode('break'); return BREAK_SECONDS }
          setMode('work'); return WORK_SECONDS
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const reset = () => { setRunning(false); setMode('work'); setSecondsLeft(WORK_SECONDS); setCycles(0) }
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="space-y-8 text-center">
      <div className="inline-flex rounded-full bg-slate-100 p-1">
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${mode === 'work' ? 'bg-[#0B1F3A] text-white' : 'text-slate-500'}`}>Focus</span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${mode === 'break' ? 'bg-[#0B1F3A] text-white' : 'text-slate-500'}`}>Break</span>
      </div>

      <motion.div key={mode} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl font-bold text-[#0B1F3A] tabular-nums py-8">{mm}:{ss}</motion.div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors">
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
      </div>

      <p className="text-sm text-slate-500">Completed pomodoros: <strong className="text-[#0B1F3A]">{cycles}</strong></p>
    </div>
  )
}

export default function PomodoroTimerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Pomodoro Timer" description="Work in focused 25-minute sessions with 5-minute breaks — the classic Pomodoro Technique, free in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Pomodoro Timer' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PomodoroTimer /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Pomodoro Timer Questions" items={[
        { q: 'What is the Pomodoro Technique?', a: 'Work in focused 25-minute sessions, followed by a 5-minute break — repeat, with a longer break every 4 sessions.' },
      ]} />
      <ToolCta headline="Need custom business software?" body="Aadhirai Innovations builds enterprise software for pharmacy, billing, HR, and transport businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
