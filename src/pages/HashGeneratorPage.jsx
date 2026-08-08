import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { md5 } from '../utils/md5'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Hash Generator', 'description': 'Free online hash generator. Generate MD5, SHA-1, and SHA-256 hashes from text, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/hash-generator', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Is my text sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, hashing happens entirely in your browser using the Web Crypto API (for SHA-1/SHA-256) and a local MD5 implementation.' } },
      { '@type': 'Question', 'name': 'Is MD5 safe to use?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, MD5 and SHA-1 are considered cryptographically broken for security purposes (collisions are practical to generate). Use SHA-256 or stronger for anything security-sensitive; MD5/SHA-1 here are for checksums and legacy compatibility only.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

async function sha(text, algo) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function HashGenerator() {
  const [text, setText] = useState('')
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' })
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!text) { setHashes({ md5: '', sha1: '', sha256: '' }); return }
      const [sha1, sha256] = await Promise.all([sha(text, 'SHA-1'), sha(text, 'SHA-256')])
      if (!cancelled) setHashes({ md5: md5(text), sha1, sha256 })
    }
    run()
    return () => { cancelled = true }
  }, [text])

  function copy(value, key) { navigator.clipboard.writeText(value).then(() => { setCopyFeedback(key); setTimeout(() => setCopyFeedback(''), 2000) }).catch(() => {}) }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Type or paste text to hash" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
      </div>
      {text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {[['MD5', 'md5'], ['SHA-1', 'sha1'], ['SHA-256', 'sha256']].map(([label, key]) => (
            <div key={key} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span><button onClick={() => copy(hashes[key], key)} className="text-slate-400 hover:text-[#0B1F3A]"><Copy className="h-3.5 w-3.5" /></button></div>
              <p className="text-sm font-mono text-[#0B1F3A] break-all">{hashes[key]}</p>
              {copyFeedback === key && <p className="text-xs text-green-600 mt-1">Copied!</p>}
            </div>
          ))}
        </motion.div>
      )}
      <p className="text-xs text-slate-400">MD5 and SHA-1 are cryptographically broken — use SHA-256+ for security-sensitive purposes. These are provided for checksums and legacy compatibility.</p>
    </div>
  )
}

export default function HashGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Hash Generator" description="Generate MD5, SHA-1, and SHA-256 hashes from text, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Hash Generator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><HashGenerator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Hash Generator Questions" items={[
        { q: 'Is my text sent anywhere?', a: 'No, hashing happens entirely in your browser.' },
        { q: 'Is MD5 safe to use?', a: 'No, MD5 and SHA-1 are cryptographically broken — use SHA-256+ for security-sensitive purposes.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
