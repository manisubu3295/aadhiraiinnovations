import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import JsBarcode from 'jsbarcode'
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
      'name': 'Barcode Generator',
      'description': 'Free online barcode generator. Create CODE128, EAN-13, and UPC barcodes instantly and download as PNG.',
      'url': 'https://www.aadhiraiinnovations.com/tools/barcode-generator',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Barcode Generator', 'item': 'https://www.aadhiraiinnovations.com/tools/barcode-generator' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Which barcode format should I use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'CODE128 works for any text or numbers and is the most flexible choice for internal inventory labels. EAN-13 (13 digits) and UPC (12 digits) are the standard retail formats used on packaged products sold in stores.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Will this barcode scan correctly at retail checkout?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, as long as you use a valid EAN-13 or UPC number (including a correct check digit) and print it at a reasonable size. For real retail products, EAN/UPC numbers must be registered with GS1 to be globally unique.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I use this for inventory management without registering numbers?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes — for internal-only use (warehouse bins, internal SKUs, asset tags), CODE128 with your own numbering scheme works fine and needs no registration.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my data uploaded anywhere?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. The barcode is rendered entirely in your browser using JavaScript — nothing is sent to any server.',
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

const FORMATS = [
  { value: 'CODE128', label: 'CODE128 (any text)' },
  { value: 'EAN13', label: 'EAN-13 (13 digits)' },
  { value: 'UPC', label: 'UPC-A (12 digits)' },
]

/* ─── Generator ──────────────────────────────────────────────────────────── */
function BarcodeGenerator() {
  const [value, setValue] = useState('')
  const [format, setFormat] = useState('CODE128')
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!value.trim()) {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      return
    }

    try {
      JsBarcode(canvasRef.current, value, {
        format,
        width: 2,
        height: 100,
        displayValue: true,
        valid: (isValid) => setError(isValid ? null : `"${value}" is not a valid ${format} value.`),
      })
    } catch {
      // JsBarcode's `valid` callback only covers graceful validation failures (e.g. bad checksum) —
      // malformed input for strict formats like EAN13/UPC (e.g. non-numeric characters) throws
      // synchronously instead, so this catch is load-bearing, not defensive boilerplate.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(`"${value}" is not a valid ${format} value.`)
    }
  }, [value, format])

  const download = () => {
    if (!canvasRef.current || !value.trim() || error) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'barcode.png'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Format
        </label>
        <div className="flex flex-wrap gap-3">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                format === f.value
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Value
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={format === 'CODE128' ? 'Any text or numbers' : 'Numeric digits only'}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[180px] overflow-x-auto">
        {/* Canvas stays mounted whenever there's a value, independent of error state — JsBarcode
            needs a live DOM node to render/validate against, and unmounting it on error would
            create a deadlock where a later-valid value could never get a canvas to draw on. */}
        {value.trim() ? (
          <canvas ref={canvasRef} className={`max-w-full h-auto ${error ? 'hidden' : ''}`} />
        ) : null}
        {!value.trim() && <p className="text-sm text-slate-400">Enter a value to generate a barcode</p>}
        {error && <p className="text-sm text-slate-400">{error}</p>}
      </div>

      <button
        onClick={download}
        disabled={!value.trim() || !!error}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Download className="h-4 w-4" />
        Download PNG
      </button>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function BarcodeGeneratorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Barcode Generator"
        description="Generate CODE128, EAN-13, or UPC barcodes for inventory labels, packaging, or asset tags. Free, instant, downloadable."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Barcode Generator' },
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
              <BarcodeGenerator />
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
                Choosing a Format
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              CODE128 vs EAN-13 vs UPC — which do I need?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                <strong>CODE128</strong> encodes any combination of letters, numbers, and symbols, making it the most flexible choice for internal use — warehouse bin labels, batch numbers, internal SKUs, or asset tags where you control the numbering scheme.
              </p>
              <p>
                <strong>EAN-13</strong> and <strong>UPC-A</strong> are the standard formats printed on retail products worldwide — EAN-13 (13 digits) is used in most countries including India, UPC-A (12 digits) in North America. To sell a product in stores, the number itself typically needs to be registered with GS1 to guarantee it's globally unique; this tool renders the barcode image for any valid number you provide, registered or not.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Barcode Generator Questions"
        items={[
          {
            q: 'Which barcode format should I use?',
            a: 'CODE128 for any text or internal numbering. EAN-13 (13 digits) or UPC-A (12 digits) for standard retail product barcodes.',
          },
          {
            q: 'Will this barcode scan correctly at retail checkout?',
            a: 'Yes, given a valid EAN-13/UPC number with a correct check digit, printed at a reasonable size. Real retail numbers should be registered with GS1 to be globally unique.',
          },
          {
            q: 'Can I use this for inventory without registering numbers?',
            a: 'Yes — for internal-only use like warehouse bins or asset tags, CODE128 with your own numbering scheme needs no registration.',
          },
          {
            q: 'Is my data uploaded anywhere?',
            a: 'No, the barcode renders entirely in your browser — nothing is sent to any server.',
          },
        ]}
      />

      <ToolCta
        headline="Need barcode scanning built into your billing software?"
        body="Aadhirai Billing and Medora+ support barcode-based inventory lookup at the point of sale — scan and bill in one step."
        ctas={[
          { label: 'Explore Aadhirai Billing', href: '/products/billing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
