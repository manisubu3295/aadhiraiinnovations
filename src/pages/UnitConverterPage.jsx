import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { UNIT_CATEGORIES, convertUnit } from '../utils/unitConversions'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Unit Converter',
      'description': 'Free online unit converter for length, weight, temperature, volume, and area. Instant, accurate conversions.',
      'url': 'https://www.aadhiraiinnovations.com/tools/unit-converter',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Unit Converter', 'item': 'https://www.aadhiraiinnovations.com/tools/unit-converter' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What unit categories are supported?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Length, Weight, Temperature, Volume, and Area — each with the most commonly used metric and imperial units.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How accurate are the conversions?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Conversions use standard international conversion factors (e.g. 1 inch = 2.54 cm exactly) and full floating-point precision, accurate enough for engineering, cooking, and everyday use.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why is temperature conversion different from the others?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Temperature scales have different zero points (0°C is not the same physical temperature as 0°F), so conversion needs a formula rather than a simple multiplication factor. This tool handles that automatically.",
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

/* ─── Converter ──────────────────────────────────────────────────────────── */
function UnitConverter() {
  const [category, setCategory] = useState('length')
  const unitKeys = Object.keys(UNIT_CATEGORIES[category].units)
  const [fromUnit, setFromUnit] = useState(unitKeys[0])
  const [toUnit, setToUnit] = useState(unitKeys[1])
  const [value, setValue] = useState('1')

  const changeCategory = (nextCategory) => {
    const keys = Object.keys(UNIT_CATEGORIES[nextCategory].units)
    setCategory(nextCategory)
    setFromUnit(keys[0])
    setToUnit(keys[1])
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const result = useMemo(() => {
    const numeric = Number(value)
    if (value === '' || Number.isNaN(numeric)) return null
    return convertUnit(category, numeric, fromUnit, toUnit)
  }, [category, value, fromUnit, toUnit])

  const units = UNIT_CATEGORIES[category].units

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => changeCategory(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                category === key
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 items-end sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            From
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm mb-2"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          >
            {Object.entries(units).map(([key, u]) => (
              <option key={key} value={key}>{u.label}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swapUnits}
          aria-label="Swap units"
          className="flex-none p-2.5 rounded-full bg-slate-100 text-[#0B1F3A] hover:bg-slate-200 transition-colors mb-1 justify-self-center"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            To
          </label>
          <div className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-[#0B1F3A] mb-2 truncate">
            {result === null ? '—' : Number(result.toFixed(6)).toString()}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
          >
            {Object.entries(units).map(([key, u]) => (
              <option key={key} value={key}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {result !== null && (
        <div className="rounded-lg bg-[#0B1F3A]/5 px-4 py-3 border border-[#0B1F3A]/10 text-center">
          <p className="text-sm text-[#0B1F3A]">
            <span className="font-semibold">{value} {units[fromUnit].label}</span> = <span className="font-semibold">{Number(result.toFixed(6)).toString()} {units[toUnit].label}</span>
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function UnitConverterPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Unit Converter"
        description="Convert length, weight, temperature, volume, and area between metric and imperial units, instantly."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Unit Converter' },
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
              <UnitConverter />
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
                Metric vs Imperial
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why do metric and imperial units still coexist?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Most of the world uses the metric system (meters, kilograms, liters, Celsius), while a few countries — most notably the United States — still primarily use imperial units (feet, pounds, gallons, Fahrenheit). Anyone working across international trade, engineering specs, recipes, or shipping regularly needs to convert between them.
              </p>
              <p>
                This tool covers the five most commonly needed categories — Length, Weight, Temperature, Volume, and Area — using precise, standard conversion factors, so you can trust the result for both everyday and professional use.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Unit Converter Questions"
        items={[
          {
            q: 'What unit categories are supported?',
            a: 'Length, Weight, Temperature, Volume, and Area, each with commonly used metric and imperial units.',
          },
          {
            q: 'How accurate are the conversions?',
            a: 'Conversions use standard international factors and full floating-point precision — accurate enough for engineering, cooking, and everyday use.',
          },
          {
            q: 'Why is temperature different from the others?',
            a: "Temperature scales have different zero points, so conversion needs a formula rather than a simple multiplier. This tool handles that automatically.",
          },
        ]}
      />

      <ToolCta
        headline="Need unit conversions built into your business software?"
        body="Aadhirai Innovations builds custom ERP and inventory systems that handle unit conversions automatically across your supply chain."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
