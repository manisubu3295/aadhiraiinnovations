import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
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
      'name': 'UUID Generator',
      'description': 'Free online UUID (v4) generator. Generate one or many random, cryptographically secure UUIDs instantly.',
      'url': 'https://www.aadhiraiinnovations.com/tools/uuid-generator',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is a UUID?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A Universally Unique Identifier — a 128-bit value, usually shown as 32 hex digits, that\'s statistically unique across systems without needing a central authority to issue them.' } },
        { '@type': 'Question', 'name': 'Is this UUID v4?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, generated using the browser\'s built-in crypto.randomUUID(), which produces cryptographically random version-4 UUIDs.' } },
        { '@type': 'Question', 'name': 'Can two generated UUIDs collide?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The chance is astronomically small — with 122 random bits, you\'d need to generate billions of UUIDs per second for centuries before a collision became statistically likely.' } },
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
function UuidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, () => crypto.randomUUID()))
  const [copyFeedback, setCopyFeedback] = useState(false)

  const regenerate = () => {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()))
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            How many? (1–50)
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          />
        </div>
        <button
          onClick={regenerate}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#173762] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Generate
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-h-80 overflow-y-auto space-y-1.5">
        {uuids.map((uuid, i) => (
          <div key={i} className="rounded-md bg-white border border-slate-200 px-3 py-2 font-mono text-sm text-slate-700">
            {uuid}
          </div>
        ))}
      </div>

      <button
        onClick={copyAll}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
        }`}
      >
        <Copy className="h-4 w-4" />
        {copyFeedback ? 'Copied!' : `Copy All ${uuids.length}`}
      </button>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function UuidGeneratorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="UUID Generator"
        description="Generate one or many random, cryptographically secure UUIDs (v4) instantly."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'UUID Generator' }]}
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
              <UuidGeneratorTool />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding UUIDs</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why use a UUID instead of an incrementing ID?
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Auto-incrementing IDs (1, 2, 3...) require a single source of truth to avoid collisions — hard to do across distributed systems or offline-first apps. UUIDs can be generated independently, anywhere, with virtually no chance of collision, which is why they're common as database primary keys, request IDs, and API tokens.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="UUID Generator Questions"
        items={[
          { q: 'What is a UUID?', a: 'A 128-bit Universally Unique Identifier, usually shown as 32 hex digits — statistically unique without a central issuing authority.' },
          { q: 'Is this UUID v4?', a: 'Yes, generated using the browser\'s crypto.randomUUID(), producing cryptographically random version-4 UUIDs.' },
          { q: 'Can two generated UUIDs collide?', a: 'The probability is astronomically small given 122 random bits per UUID.' },
        ]}
      />

      <ToolCta
        headline="Need distributed systems architecture?"
        body="Aadhirai Innovations designs backend architecture for systems that need to scale reliably — from data modeling to full infrastructure."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
