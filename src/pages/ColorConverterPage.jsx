import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Color Converter',
      'description': 'Free online color converter. Convert between Hex, RGB, and HSL color formats instantly, with a live preview.',
      'url': 'https://www.aadhiraiinnovations.com/tools/color-converter',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What color formats are supported?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Hex, RGB, and HSL — enter a hex color and see the equivalent RGB and HSL values instantly.' } },
        { '@type': 'Question', 'name': 'Is my data sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, conversion happens entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function normalizeHex(hex) {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  return /^[0-9a-fA-F]{6}$/.test(h) ? h.toLowerCase() : null
}

function hexToRgb(hex) {
  const h = normalizeHex(hex)
  if (!h) return null
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function ColorConverterTool() {
  const [hex, setHex] = useState('0B1F3A')
  const [copyFeedback, setCopyFeedback] = useState('')

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb) : null
  const isValid = !!rgb

  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ''
  const hexString = isValid ? `#${normalizeHex(hex)}` : ''

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(''), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={isValid ? `#${normalizeHex(hex)}` : '#0B1F3A'}
          onChange={(e) => setHex(e.target.value.replace('#', ''))}
          className="h-14 w-14 rounded-lg border border-slate-200 cursor-pointer flex-none"
        />
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Hex</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="0B1F3A"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono"
          />
        </div>
      </div>

      {!isValid && <p className="text-sm text-red-600">Enter a valid 3 or 6-digit hex color.</p>}

      {isValid && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {[
            { label: 'HEX', value: hexString },
            { label: 'RGB', value: rgbString },
            { label: 'HSL', value: hslString },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">{label}</span>
                <span className="text-sm font-mono text-[#0B1F3A]">{value}</span>
              </div>
              <button onClick={() => copy(label, value)} className="p-2 rounded-md text-slate-400 hover:text-[#0B1F3A] hover:bg-white transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
          {copyFeedback && <p className="text-xs text-green-600">{copyFeedback} copied!</p>}
        </motion.div>
      )}
    </div>
  )
}

export default function ColorConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Color Converter"
        description="Convert between Hex, RGB, and HSL color formats instantly, with a live preview."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Color Converter' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <ColorConverterTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Color Converter Questions"
        items={[
          { q: 'What color formats are supported?', a: 'Hex, RGB, and HSL — pick a color and see all three formats instantly.' },
          { q: 'Is my data sent anywhere?', a: 'No, conversion happens entirely in your browser.' },
        ]}
      />
      <ToolCta
        headline="Need a design system or custom UI built?"
        body="Aadhirai Innovations builds custom software with polished, consistent user interfaces from the ground up."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
