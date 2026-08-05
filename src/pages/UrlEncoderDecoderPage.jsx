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
      'name': 'URL Encoder / Decoder',
      'description': 'Free online URL encoder and decoder. Percent-encode text for safe use in URLs, or decode an encoded URL back to plain text.',
      'url': 'https://www.aadhiraiinnovations.com/tools/url-encoder-decoder',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is URL encoding?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'URL (percent) encoding replaces characters that aren\'t safe in a URL — spaces, &, =, ? and others — with a % followed by their hex code, so the URL is transmitted correctly.' } },
        { '@type': 'Question', 'name': 'When do I need to encode a URL?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'When building query strings with user input, special characters, or non-English text that needs to be safely passed as part of a URL.' } },
        { '@type': 'Question', 'name': 'Is my data sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, encoding and decoding happen entirely in your browser using JavaScript.' } },
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
function UrlEncoderTool() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  let output = ''
  let error = null
  if (input) {
    try {
      output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    } catch {
      error = 'Invalid encoded input — cannot decode.'
    }
  }

  const copyOutput = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => setInput('')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[{ key: 'encode', label: 'Encode' }, { key: 'decode', label: 'Decode' }].map((m) => (
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

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {mode === 'encode' ? 'Text or URL' : 'Encoded URL'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={mode === 'encode' ? 'e.g. https://example.com/search?q=pharmacy near me' : 'e.g. pharmacy%20near%20me'}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Result</label>
        <textarea
          value={output}
          readOnly
          rows={5}
          placeholder="Result appears here..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono text-slate-700"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyOutput}
          disabled={!output}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${
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
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function UrlEncoderDecoderPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="URL Encoder / Decoder"
        description="Percent-encode text for safe use in URLs, or decode an encoded URL back to plain text."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'URL Encoder / Decoder' }]}
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
              <UrlEncoderTool />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding URL Encoding</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why URLs need percent-encoding
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                URLs can only safely contain a limited set of characters. Spaces, ampersands, question marks, and non-English text must be percent-encoded (like <code>%20</code> for a space) so browsers and servers interpret the URL correctly instead of breaking it into the wrong parts.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="URL Encoding Questions"
        items={[
          { q: 'What is URL encoding?', a: 'Percent-encoding replaces unsafe URL characters (spaces, &, =, ?, etc.) with a % followed by their hex code.' },
          { q: 'When do I need to encode a URL?', a: 'When building query strings with user input, special characters, or non-English text.' },
          { q: 'Is my data sent anywhere?', a: 'No, everything happens in your browser using JavaScript.' },
          { q: 'Does this encode the whole URL or just parts of it?', a: 'This encodes/decodes the exact text you enter — use it on individual query parameter values, not necessarily the whole URL, to avoid double-encoding the protocol and domain.' },
        ]}
      />

      <ToolCta
        headline="Need custom integrations and APIs built?"
        body="Aadhirai Innovations builds backend systems and API integrations that handle data encoding, transformation, and routing at scale."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
