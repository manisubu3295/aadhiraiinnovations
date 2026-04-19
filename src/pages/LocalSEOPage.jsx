import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, MapPin, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import Container from '../components/ui/Container'
import { cityPageData } from '../components/sections/LocalSEOPageTemplate'

function LocalSEOPage() {
  const { city } = useParams()
  const citySlug = city?.toLowerCase()

  // Get data for this city
  const data = cityPageData[citySlug]

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Page Not Found</h1>
          <p className="mt-3 text-slate-600">Pharmacy software page for {city} is not yet available.</p>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-white">

      {/* ── Dynamic Meta Tags with Helmet ────────────────────────────────────────── */}
      <Helmet>
        <title>{data.meta.title}</title>
        <meta name="description" content={data.meta.description} />
        <link rel="canonical" href={`https://aadhiraiinnovations.com/pharmacy-billing-software/${citySlug}`} />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={data.meta.title} />
        <meta property="og:description" content={data.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://aadhiraiinnovations.com/pharmacy-billing-software/${citySlug}`} />
        <meta property="og:site_name" content="Aadhirai Innovations" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.meta.title} />
        <meta name="twitter:description" content={data.meta.description} />

        {/* LocalBusiness schema markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `Medora+ - Pharmacy Billing Software in ${data.city}`,
            "description": data.meta.description,
            "url": `https://aadhiraiinnovations.com/pharmacy-billing-software/${citySlug}`,
            "areaServed": {
              "@type": "City",
              "name": data.city,
              "addressRegion": data.state,
              "addressCountry": "IN"
            },
            "image": "https://aadhiraiinnovations.com/og-image.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "250"
            },
            "priceRange": "₹5,000 - ₹50,000",
            "telephone": "+91-XXXXXXXXXX"
          })}
        </script>
      </Helmet>

      {/* ── Hero / Intro Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white py-16 md:py-20 lg:py-24">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb / Location */}
            <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{data.city}, {data.state}</span>
            </div>

            {/* H1 — Main headline */}
            <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl leading-[1.1]">
              {data.intro.headline}
            </h1>

            {/* Subheading */}
            <p className="mb-8 text-xl text-slate-600">
              {data.intro.subheading}
            </p>

            {/* Intro body — localized context */}
            <div className="mb-10 max-w-2xl space-y-4 text-[16px] text-slate-700 leading-[1.8]">
              {data.intro.body.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={data.cta.buttons[0].href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-lg bg-[#0B1F3A] px-8 py-4 text-[14px] font-bold text-white transition-all hover:bg-[#173762]"
              >
                <MessageCircle className="h-4 w-4" />
                {data.cta.buttons[0].text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={data.cta.buttons[1].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 px-8 py-4 text-[14px] font-bold text-[#0B1F3A] transition-colors hover:border-[#0B1F3A]"
              >
                {data.cta.buttons[1].text}
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── What Product Does ────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">
              {data.whatProductDoes.heading}
            </h2>

            <div className="grid gap-8 sm:grid-cols-2">
              {data.whatProductDoes.sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-6"
                >
                  <h3 className="mb-3 text-[17px] font-semibold text-[#0B1F3A]">
                    {section.title}
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-[1.7]">
                    {section.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Why It Works ──────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-slate-50 py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">
              {data.whyItWorks.heading}
            </h2>

            <div className="space-y-6">
              {data.whyItWorks.sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex-none">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-none mt-1" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-[16px] font-semibold text-[#0B1F3A]">
                      {section.title}
                    </h3>
                    <p className="text-[14px] text-slate-600 leading-[1.7]">
                      {section.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Use Cases ────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">
              {data.useCases.heading}
            </h2>

            <div className="space-y-4">
              {data.useCases.cases.map((useCase, i) => (
                <motion.div
                  key={useCase.type}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-6"
                >
                  <h3 className="mb-2 text-[15px] font-semibold text-[#0B1F3A]">
                    {useCase.type}
                  </h3>
                  <p className="text-[14px] text-slate-600">
                    {useCase.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-slate-50 py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">
              Frequently Asked Questions
            </h2>

            {/* Schema markup container */}
            <div
              itemScope
              itemType="https://schema.org/FAQPage"
              className="space-y-4"
            >
              {data.faq.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="rounded-lg border border-slate-200 bg-white p-6"
                >
                  <h3
                    itemProp="name"
                    className="mb-3 text-[15px] font-semibold text-[#0B1F3A]"
                  >
                    {item.q}
                  </h3>
                  <div itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" className="text-[14px] text-slate-600 leading-[1.7]">
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center text-white"
          >
            <h2 className="mb-3 text-3xl font-bold">
              {data.cta.heading}
            </h2>
            <p className="mb-8 text-lg text-white/70">
              {data.cta.subheading}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={data.cta.buttons[0].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-[14px] font-bold text-[#0B1F3A] transition-all hover:bg-white/90"
              >
                <MessageCircle className="h-4 w-4" />
                {data.cta.buttons[0].text}
              </a>
              <a
                href={data.cta.buttons[1].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-[14px] font-bold text-white transition-colors hover:bg-white/10"
              >
                {data.cta.buttons[1].text}
              </a>
            </div>

            <p className="mt-8 text-[13px] text-white/50">
              Free consultation. No commitment. Quick implementation.
            </p>
          </motion.div>
        </Container>
      </section>

    </article>
  )
}

export default LocalSEOPage
