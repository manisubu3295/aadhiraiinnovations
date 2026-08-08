import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, MapPin, CheckCircle2, MessageCircle } from 'lucide-react'
import Container from '../components/ui/Container'
import { stateSlugToInfo } from '../data/hrmLocationSlugs.js'
import { buildStatePageData } from '../data/generateHrmLocationContent.js'
import { useNoIndex } from '../hooks/useNoIndex.js'

function HrmStateSEOPage() {
  const { stateSlug } = useParams()
  const stateInfo = stateSlug ? stateSlugToInfo.get(stateSlug.toLowerCase()) : undefined
  useNoIndex(!stateInfo)

  if (!stateInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Page Not Found</h1>
          <p className="mt-3 text-slate-600">HRM software page for this state is not yet available.</p>
        </div>
      </div>
    )
  }

  const { state, districts } = stateInfo
  const data = buildStatePageData({ state, districtCount: districts.length })

  return (
    <article className="bg-white">
      <Helmet>
        <title>{data.meta.title}</title>
        <meta name="description" content={data.meta.description} />
        <link rel="canonical" href={`https://www.aadhiraiinnovations.com/hrm-software/state/${stateSlug}`} />
        <meta property="og:title" content={data.meta.title} />
        <meta property="og:description" content={data.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.aadhiraiinnovations.com/hrm-software/state/${stateSlug}`} />
        <meta property="og:site_name" content="Aadhirai Innovations" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `HR & Inventory - HRM Software in ${state}`,
            description: data.meta.description,
            url: `https://www.aadhiraiinnovations.com/hrm-software/state/${stateSlug}`,
            areaServed: { '@type': 'State', name: state, addressCountry: 'IN' },
            image: 'https://www.aadhiraiinnovations.com/media/billing.png',
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white py-16 md:py-20 lg:py-24">
        <Container className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{state}</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl leading-[1.1]">
              {data.intro.headline}
            </h1>
            <p className="mb-8 text-xl text-slate-600">{data.intro.subheading}</p>
            <div className="mb-10 max-w-2xl space-y-4 text-[16px] text-slate-700 leading-[1.8]">
              {data.intro.body.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
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

      {/* ── Browse districts ─────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-16 md:py-20">
        <Container>
          <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">
            Districts We Serve in {state}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {districts.map((d) => (
              <Link
                key={d.slug}
                to={`/hrm-software/${d.slug}`}
                className="group flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-4 py-2.5 hover:bg-slate-100 transition-colors"
              >
                <span className="text-[13.5px] text-slate-700 group-hover:text-[#0B1F3A]">{d.district}</span>
                <ArrowRight className="h-3.5 w-3.5 flex-none text-slate-300 group-hover:text-[#0B1F3A]/60 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── What Product Does ────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-slate-50 py-16 md:py-20">
        <Container>
          <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">{data.whatProductDoes.heading}</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {data.whatProductDoes.sections.map((section) => (
              <div key={section.title} className="rounded-lg border border-slate-100 bg-white p-6">
                <h3 className="mb-3 text-[17px] font-semibold text-[#0B1F3A]">{section.title}</h3>
                <p className="text-[14px] text-slate-600 leading-[1.7]">{section.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why It Works ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-16 md:py-20">
        <Container>
          <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">{data.whyItWorks.heading}</h2>
          <div className="space-y-6">
            {data.whyItWorks.sections.map((section) => (
              <div key={section.title} className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 flex-none text-emerald-500 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="mb-2 text-[16px] font-semibold text-[#0B1F3A]">{section.title}</h3>
                  <p className="text-[14px] text-slate-600 leading-[1.7]">{section.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-slate-50 py-16 md:py-20">
        <Container>
          <h2 className="mb-12 text-3xl font-bold text-[#0B1F3A] tracking-[-0.03em]">Frequently Asked Questions</h2>
          <div itemScope itemType="https://schema.org/FAQPage" className="space-y-4">
            {data.faq.map((item, i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 itemProp="name" className="mb-3 text-[15px] font-semibold text-[#0B1F3A]">{item.q}</h3>
                <div itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-[14px] text-slate-600 leading-[1.7]">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="mb-3 text-3xl font-bold">{data.cta.heading}</h2>
            <p className="mb-8 text-lg text-white/70">{data.cta.subheading}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={data.cta.buttons[0].href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-[14px] font-bold text-[#0B1F3A] transition-all hover:bg-white/90">
                <MessageCircle className="h-4 w-4" />
                {data.cta.buttons[0].text}
              </a>
              <a href={data.cta.buttons[1].href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-[14px] font-bold text-white transition-colors hover:bg-white/10">
                {data.cta.buttons[1].text}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </article>
  )
}

export default HrmStateSEOPage
