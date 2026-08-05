import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'JWT Decoder',
      'description': 'Free online JWT (JSON Web Token) decoder. Decode the header and payload of a JWT, entirely in your browser. Does not verify the signature.',
      'url': 'https://www.aadhiraiinnovations.com/tools/jwt-decoder',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Does this verify the JWT signature?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this only decodes and displays the header and payload. Verifying the signature requires the secret or public key, which this tool never asks for or sees.' } },
        { '@type': 'Question', 'name': 'Is my token sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, decoding happens entirely in your browser using JavaScript.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function decodeJwt(token) {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return { error: 'A JWT must have 3 parts separated by dots (header.payload.signature).' }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return { header, payload, signature: parts[2] }
  } catch {
    return { error: 'Could not decode this token — check that it\'s a valid JWT.' }
  }
}

function JwtDecoderTool() {
  const [token, setToken] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const result = token.trim() ? decodeJwt(token) : null

  const copyPayload = async () => {
    if (!result || result.error) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2))
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => setToken('')

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono break-all"
        />
      </div>

      {result?.error && <p className="text-sm text-red-600">{result.error}</p>}

      {result && !result.error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Header</label>
            <pre className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-x-auto">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Payload</label>
            <pre className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-x-auto">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>

          <div className="flex gap-3">
            <button onClick={copyPayload} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
              <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Payload'}
            </button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
              <RotateCcw className="h-4 w-4" />Reset
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          This decodes the header and payload only — it does not verify the signature. Never paste a production access token from a system you don't control into any online tool.
        </p>
      </div>
    </div>
  )
}

export default function JwtDecoderPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="JWT Decoder"
        description="Decode the header and payload of a JSON Web Token. Runs entirely in your browser — does not verify the signature."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'JWT Decoder' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <JwtDecoderTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="JWT Decoder Questions"
        items={[
          { q: 'Does this verify the signature?', a: 'No — only the header and payload are decoded. Verifying requires the secret/public key, which this tool never sees.' },
          { q: 'Is my token sent anywhere?', a: 'No, decoding happens entirely in your browser.' },
          { q: 'Is it safe to paste a real token here?', a: 'Avoid pasting production access tokens into any online tool — use test/sample tokens when possible.' },
        ]}
      />
      <ToolCta
        headline="Need authentication and API systems built?"
        body="Aadhirai Innovations builds backend systems with secure authentication, authorization, and API architecture."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
