import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Random Team / Name Picker', 'description': 'Free random name picker and team shuffler. Paste a list of names, pick winners at random, or shuffle everyone into balanced teams.', 'url': 'https://www.aadhiraiinnovations.com/tools/random-picker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How random is the picker?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It uses JavaScript\'s Math.random() with a Fisher-Yates shuffle — good enough for team draws, raffles, and picking who goes first, though not cryptographically secure.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function RandomPicker() {
  const [names, setNames] = useState('')
  const [mode, setMode] = useState('pick') // 'pick' | 'teams'
  const [pickCount, setPickCount] = useState(1)
  const [teamCount, setTeamCount] = useState(2)
  const [result, setResult] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const list = names.split('\n').map((n) => n.trim()).filter(Boolean)

  function run() {
    if (list.length === 0) return
    if (mode === 'pick') {
      setResult({ type: 'pick', winners: shuffle(list).slice(0, Math.min(pickCount, list.length)) })
    } else {
      const shuffled = shuffle(list)
      const teams = Array.from({ length: teamCount }, () => [])
      shuffled.forEach((name, i) => teams[i % teamCount].push(name))
      setResult({ type: 'teams', teams })
    }
  }

  function copyResult() {
    if (!result) return
    const text = result.type === 'pick' ? result.winners.join('\n') : result.teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n')
    navigator.clipboard.writeText(text).then(() => { setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) }).catch(() => {})
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Names (one per line)</label>
        <textarea value={names} onChange={(e) => { setNames(e.target.value); setResult(null) }} rows={6} placeholder={'Alice\nBob\nCharlie\nDiya'} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
        <p className="mt-1.5 text-[11px] text-slate-400">{list.length} name{list.length !== 1 ? 's' : ''} entered</p>
      </div>

      <div className="flex gap-3">
        {[{ k: 'pick', l: 'Pick Winner(s)' }, { k: 'teams', l: 'Shuffle into Teams' }].map((m) => (
          <button key={m.k} onClick={() => { setMode(m.k); setResult(null) }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'}`}>{m.l}</button>
        ))}
      </div>

      {mode === 'pick' ? (
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number to Pick</label><input type="number" min="1" value={pickCount} onChange={(e) => setPickCount(Number(e.target.value))} className="w-32 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      ) : (
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Teams</label><input type="number" min="2" value={teamCount} onChange={(e) => setTeamCount(Number(e.target.value))} className="w-32 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      )}

      <button onClick={run} disabled={list.length === 0} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Shuffle className="h-4 w-4" />{mode === 'pick' ? 'Pick' : 'Shuffle'}</button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          {result.type === 'pick' ? (
            <ol className="space-y-1.5">{result.winners.map((w, i) => <li key={i} className="text-sm font-medium text-[#0B1F3A]">{i + 1}. {w}</li>)}</ol>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {result.teams.map((team, i) => (
                <div key={i} className="rounded-lg bg-white border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Team {i + 1}</p>
                  {team.map((name, j) => <p key={j} className="text-sm text-[#0B1F3A]">{name}</p>)}
                </div>
              ))}
            </div>
          )}
          <button onClick={copyResult} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}><Copy className="h-3.5 w-3.5" />{copyFeedback ? 'Copied!' : 'Copy'}</button>
        </motion.div>
      )}
    </div>
  )
}

export default function RandomPickerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Random Team / Name Picker" description="Paste a list of names, pick winners at random, or shuffle everyone into balanced teams." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Random Team / Name Picker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RandomPicker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Random Picker Questions" items={[
        { q: 'How random is the picker?', a: 'Uses a Fisher-Yates shuffle with Math.random() — good for team draws and raffles, not cryptographic use.' },
      ]} />
      <ToolCta headline="Need custom business software?" body="Aadhirai Innovations builds enterprise software for pharmacy, billing, HR, and transport businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
