import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'GSTIN Format Validator',
      'description': 'Free online GSTIN format and checksum validator for India. Checks the 15-character structure and check-digit of a GST Identification Number.',
      'url': 'https://www.aadhiraiinnovations.com/tools/gstin-validator',
      'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Does this check if a GSTIN is actually registered?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this only checks the 15-character format and the mathematical check-digit. To confirm a GSTIN is active and registered, search it on the official GST portal.' } },
        { '@type': 'Question', 'name': 'What does a GSTIN structure mean?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The first 2 digits are the state code, the next 10 characters are the PAN of the business, the 13th is an entity number, the 14th is always Z by default, and the 15th is a check digit.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const CODEPOINTS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const FORMAT_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

function computeCheckDigit(gstin14) {
  let factor = 1
  let sum = 0
  for (let i = 0; i < 14; i++) {
    const codePoint = CODEPOINTS.indexOf(gstin14[i])
    let digit = factor * codePoint
    digit = Math.floor(digit / 36) + (digit % 36)
    sum += digit
    factor = factor === 2 ? 1 : 2
  }
  const checkCodePoint = (36 - (sum % 36)) % 36
  return CODEPOINTS[checkCodePoint]
}

function validateGstin(input) {
  const gstin = input.trim().toUpperCase()
  if (gstin.length !== 15) return { valid: false, reason: 'GSTIN must be exactly 15 characters.' }
  if (!FORMAT_REGEX.test(gstin)) return { valid: false, reason: 'Does not match the GSTIN structure (2-digit state code, 10-char PAN, entity code, Z, check digit).' }
  const expectedCheck = computeCheckDigit(gstin.slice(0, 14))
  if (expectedCheck !== gstin[14]) return { valid: false, reason: `Check digit mismatch — expected "${expectedCheck}", found "${gstin[14]}".` }
  return {
    valid: true,
    stateCode: gstin.slice(0, 2),
    pan: gstin.slice(2, 12),
    entityCode: gstin[12],
  }
}

/* ─── Tool ───────────────────────────────────────────────────────────────── */
function GstinValidatorTool() {
  const [input, setInput] = useState('')

  const result = input.trim() ? validateGstin(input) : null

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">GSTIN</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 33AAAPZ1234C1Z5"
          maxLength={15}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono uppercase"
        />
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {result.valid ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Valid format and check digit</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-lg bg-white border border-green-200 px-3 py-2 text-center">
                  <div className="text-xs font-mono font-semibold text-[#0B1F3A]">{result.stateCode}</div>
                  <div className="text-[10px] text-slate-500 mt-1">State Code</div>
                </div>
                <div className="rounded-lg bg-white border border-green-200 px-3 py-2 text-center">
                  <div className="text-xs font-mono font-semibold text-[#0B1F3A]">{result.pan}</div>
                  <div className="text-[10px] text-slate-500 mt-1">PAN</div>
                </div>
                <div className="rounded-lg bg-white border border-green-200 px-3 py-2 text-center">
                  <div className="text-xs font-mono font-semibold text-[#0B1F3A]">{result.entityCode}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Entity Code</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 flex-none mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Invalid GSTIN</p>
                <p className="text-xs text-red-700 mt-1">{result.reason}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          This checks structure and check-digit math only — it doesn't confirm the GSTIN is actually registered or active. Search it on the official GST portal to verify registration.
        </p>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function GstinValidatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="GSTIN Format Validator"
        description="Check the 15-character structure and check-digit of a GST Identification Number."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'GSTIN Validator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <GstinValidatorTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="GSTIN Validator Questions"
        items={[
          { q: 'Does this check if a GSTIN is registered?', a: 'No — only the format and check-digit. Search the GST portal to confirm registration status.' },
          { q: 'What does the GSTIN structure mean?', a: '2-digit state code, 10-character PAN, entity code, a default "Z", and a check digit.' },
          { q: 'Is my GSTIN sent anywhere?', a: 'No, validation happens entirely in your browser.' },
        ]}
      />
      <ToolCta
        headline="Need GSTIN validation built into your billing system?"
        body="Medora+ and Aadhirai Billing validate customer GSTINs automatically on every B2B invoice."
        ctas={[{ label: 'Explore Medora+', href: '/products/medora-plus', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
