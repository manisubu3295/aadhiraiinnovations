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
      'name': 'Base64 Encoder / Decoder',
      'description': 'Free online Base64 encoder and decoder. Convert text to Base64 or decode Base64 back to text, entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/base64-encoder-decoder',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is Base64 encoding?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Base64 represents binary or text data using 64 printable ASCII characters — commonly used to embed data in JSON, URLs, or email where raw binary isn\'t safe to transmit.' } },
        { '@type': 'Question', 'name': 'Does this support Unicode text?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, this tool correctly handles Unicode (emoji, non-Latin scripts) by encoding through UTF-8 bytes first.' } },
        { '@type': 'Question', 'name': 'Is my data sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, encoding/decoding happens entirely in your browser using JavaScript.' } },
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

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function decodeBase64(str) {
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/* ─── Tool ───────────────────────────────────────────────────────────────── */
function Base64Tool() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Derived directly each render — no setState-in-render, output/error are just a pure
  // function of (mode, input).
  let output = ''
  let error = null
  if (input) {
    try {
      output = mode === 'encode' ? encodeBase64(input) : decodeBase64(input)
    } catch {
      error = 'Invalid Base64 input — cannot decode.'
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
          {mode === 'encode' ? 'Text' : 'Base64'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {mode === 'encode' ? 'Base64' : 'Text'}
        </label>
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
export default function Base64EncoderDecoderPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Base64 Encoder / Decoder"
        description="Convert text to Base64, or decode Base64 back to text — entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Base64 Encoder / Decoder' }]}
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
              <Base64Tool />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding Base64</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is Base64 encoding for?
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Base64 represents any data as plain ASCII text using 64 characters (A–Z, a–z, 0–9, +, /). It's not encryption — it's a way to safely embed binary or special-character data inside formats that only expect plain text, like JSON payloads, URLs, or email attachments.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Base64 Questions"
        items={[
          { q: 'What is Base64 encoding?', a: 'A way to represent binary or text data using 64 printable ASCII characters — used to safely embed data in JSON, URLs, or email.' },
          { q: 'Does this support Unicode text?', a: 'Yes, it encodes through UTF-8 bytes first, so emoji and non-Latin scripts round-trip correctly.' },
          { q: 'Is Base64 the same as encryption?', a: 'No — Base64 is not secure and is trivially reversible. It\'s an encoding format, not encryption.' },
          { q: 'Is my data sent anywhere?', a: 'No, everything happens in your browser using JavaScript.' },
        ]}
      />

      <ToolCta
        headline="Need custom data processing built into your systems?"
        body="Aadhirai Innovations builds backend systems and APIs that handle encoding, data transformation, and integrations at scale."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
