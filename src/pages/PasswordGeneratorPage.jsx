import { useEffect, useMemo, useState } from 'react'
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
      'name': 'Password Generator',
      'description': 'Free online tool to generate strong, random passwords using cryptographically secure randomness. No signup, nothing stored.',
      'url': 'https://www.aadhiraiinnovations.com/tools/password-generator',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Password Generator', 'item': 'https://www.aadhiraiinnovations.com/tools/password-generator' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Is this password generator secure?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Yes. It uses the browser's cryptographically secure random number generator (crypto.getRandomValues), the same source used for security-sensitive operations, rather than Math.random(), which is not suitable for generating secrets.",
          },
        },
        {
          '@type': 'Question',
          'name': 'Are generated passwords stored or sent anywhere?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. Passwords are generated entirely in your browser and never transmitted, logged, or stored — not even locally after you leave the page.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How long should my password be?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'At least 12 characters is a reasonable minimum today; 16 or more is better for anything sensitive. Longer passwords are exponentially harder to brute-force than adding more character types.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Should I include symbols and numbers?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Yes, when the site allows it — mixing uppercase, lowercase, numbers, and symbols increases the character pool the password is drawn from, making it harder to guess for a given length.",
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

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length, options) {
  const pool = Object.keys(options)
    .filter((key) => options[key])
    .map((key) => CHAR_SETS[key])
    .join('')

  if (!pool) return ''

  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  return Array.from(randomValues, (n) => pool[n % pool.length]).join('')
}

function getStrength(length, options) {
  const enabledCount = Object.values(options).filter(Boolean).length
  const score = length * enabledCount
  if (score === 0) return { label: 'None', color: 'bg-slate-300', width: '0%' }
  if (score < 40) return { label: 'Weak', color: 'bg-red-500', width: '33%' }
  if (score < 70) return { label: 'Good', color: 'bg-amber-500', width: '66%' }
  return { label: 'Strong', color: 'bg-green-500', width: '100%' }
}

/* ─── Generator ──────────────────────────────────────────────────────────── */
function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true })
  const [password, setPassword] = useState(() => generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true }))
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Password generation is inherently random, not a pure function of state — so every place that
  // changes length/options explicitly regenerates too, rather than deriving it via useMemo/useEffect.
  const regenerate = () => setPassword(generatePassword(length, options))

  const changeLength = (newLength) => {
    setLength(newLength)
    setPassword(generatePassword(newLength, options))
  }

  const strength = useMemo(() => getStrength(length, options), [length, options])
  const noOptionsSelected = Object.values(options).every((v) => !v)

  const toggleOption = (key) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      const wouldBeEmpty = Object.values(next).every((v) => !v)
      if (wouldBeEmpty) return prev
      setPassword(generatePassword(length, next))
      return next
    })
  }

  const copyPassword = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-base sm:text-lg text-[#0B1F3A] break-all">
            {noOptionsSelected ? 'Select at least one character type' : password}
          </p>
          <button
            onClick={regenerate}
            disabled={noOptionsSelected}
            aria-label="Regenerate"
            className="flex-none p-2 rounded-lg text-[#0B1F3A] hover:bg-[#0B1F3A]/5 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Strength: {strength.label}</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="6"
          max="64"
          value={length}
          onChange={(e) => changeLength(Number(e.target.value))}
          className="w-full accent-[#0B1F3A]"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['uppercase', 'Uppercase (A-Z)'],
          ['lowercase', 'Lowercase (a-z)'],
          ['numbers', 'Numbers (0-9)'],
          ['symbols', 'Symbols (!@#$…)'],
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggleOption(key)}
              className="rounded border-slate-300 accent-[#0B1F3A]"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        onClick={copyPassword}
        disabled={noOptionsSelected}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          copyFeedback
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
        }`}
      >
        <Copy className="h-4 w-4" />
        {copyFeedback ? 'Copied!' : 'Copy Password'}
      </button>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function PasswordGeneratorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Password Generator"
        description="Generate strong, random passwords using cryptographically secure randomness. Adjustable length and character types, nothing stored."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Password Generator' },
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
              <PasswordGenerator />
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
                What Makes a Password Strong
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What makes a password actually secure?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Password strength comes down to how many possible combinations an attacker would have to try. Length matters more than complexity — a 16-character password drawn from just lowercase letters is harder to crack than an 8-character password using every character type. Combining length with a mix of uppercase, lowercase, numbers, and symbols gives you both.
              </p>
              <p>
                This generator uses <code>crypto.getRandomValues()</code>, the Web Crypto API's cryptographically secure random source — not <code>Math.random()</code>, which is predictable enough that it should never be used to generate anything security-sensitive. Nothing you generate here is transmitted or stored anywhere.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Password Generator Questions"
        items={[
          {
            q: 'Is this password generator secure?',
            a: "Yes. It uses the browser's cryptographically secure crypto.getRandomValues(), not Math.random(), which isn't suitable for generating secrets.",
          },
          {
            q: 'Are generated passwords stored or sent anywhere?',
            a: 'No, passwords are generated entirely in your browser and never transmitted, logged, or stored.',
          },
          {
            q: 'How long should my password be?',
            a: 'At least 12 characters as a minimum today; 16+ is better for anything sensitive.',
          },
          {
            q: 'Should I include symbols and numbers?',
            a: 'Yes, when the site allows it — mixing character types increases the pool a password is drawn from for a given length.',
          },
        ]}
      />

      <ToolCta
        headline="Need secure authentication built into your business software?"
        body="Aadhirai Innovations builds enterprise-grade software with security best practices baked in from the start — from access control to audit trails."
        ctas={[
          { label: 'Explore Services', href: '/services', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
