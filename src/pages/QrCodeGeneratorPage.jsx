import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
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
      'name': 'QR Code Generator',
      'description': 'Free online QR code generator. Turn any text, URL, or contact info into a downloadable QR code instantly.',
      'url': 'https://www.aadhiraiinnovations.com/tools/qr-code-generator',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.aadhiraiinnovations.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.aadhiraiinnovations.com/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'QR Code Generator', 'item': 'https://www.aadhiraiinnovations.com/tools/qr-code-generator' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What can I put in a QR code?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Any text — a website URL, a phone number, an email address, Wi-Fi credentials, or plain text. Scanning devices interpret the encoded text automatically based on its format.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is the QR code generated for free, with no watermark?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. The QR code is generated entirely in your browser, free of charge, with no watermark, signup, or usage limit.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Does the QR code expire?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. This generates a static QR code — the data is encoded directly into the image, so it never expires and does not depend on our servers to keep working.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What size should I use for printing?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'For print materials like packaging, posters, or invoices, use the 512px or 1024px size to keep the code crisp. For screens, 256px is usually enough.',
          },
        },
      ],
    }

    const scripts = [
      ['webapplication', webAppSchema],
      ['breadcrumblist', breadcrumbSchema],
      ['faqpage', faqSchema],
    ].map(([key, data]) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-schema', key)
      el.text = JSON.stringify(data)
      document.head.appendChild(el)
      return el
    })

    return () => scripts.forEach((el) => el.remove())
  }, [])
}

/* ─── Generator ──────────────────────────────────────────────────────────── */
function QrCodeGenerator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(512)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!text.trim()) {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      return
    }

    QRCode.toCanvas(canvasRef.current, text, { width: size, margin: 2 })
      .then(() => setError(null))
      .catch(() => setError('Could not generate a QR code for this input.'))
  }, [text, size])

  const download = () => {
    if (!canvasRef.current || !text.trim()) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.png'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com or any text"
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Size
        </label>
        <div className="flex gap-3">
          {[256, 512, 1024].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                size === s
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
              }`}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[220px]">
        {text.trim() ? (
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-sm" />
        ) : (
          <p className="text-sm text-slate-400">Enter text to generate a QR code</p>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <button
        onClick={download}
        disabled={!text.trim() || !!error}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Download className="h-4 w-4" />
        Download PNG
      </button>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function QrCodeGeneratorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="QR Code Generator"
        description="Turn any text, URL, or contact detail into a downloadable QR code. Free, instant, no signup, no watermark."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'QR Code Generator' },
        ]}
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
              <QrCodeGenerator />
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                How It Works
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is a QR code, and how do I make one?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                A QR (Quick Response) code is a two-dimensional barcode that stores text data — a website link, a phone number, Wi-Fi credentials, or plain text — in a scannable pattern. Any modern phone camera can read one instantly without a dedicated app.
              </p>
              <p>
                Businesses use QR codes on invoices (linking to a payment page or digital receipt), product packaging (linking to usage instructions or warranty registration), storefronts (linking to a menu or catalog), and marketing materials. This generator encodes your input directly into the image — there's no tracking, no redirect service, and no expiry, since the data lives entirely inside the code itself.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="QR Code Generator Questions"
        items={[
          {
            q: 'What can I put in a QR code?',
            a: 'Any text — a website URL, phone number, email address, Wi-Fi credentials, or plain text. Scanning devices interpret it automatically based on the format.',
          },
          {
            q: 'Is it free, with no watermark?',
            a: 'Yes. Generated entirely in your browser, free, with no watermark, signup, or usage limit.',
          },
          {
            q: 'Does the QR code expire?',
            a: 'No. This is a static QR code — the data is encoded directly into the image, so it works forever and doesn\'t depend on our servers.',
          },
          {
            q: 'What size should I use for printing?',
            a: 'Use 512px or 1024px for print materials like packaging or invoices, to keep the code crisp at close range. 256px is enough for on-screen use.',
          },
        ]}
      />

      <ToolCta
        headline="Need QR codes built into your invoices automatically?"
        body="Aadhirai Billing generates GST-compliant invoices with payment QR codes built in — no manual generation needed for every transaction."
        ctas={[
          { label: 'Explore Aadhirai Billing', href: '/products/billing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
