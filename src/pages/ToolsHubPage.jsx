import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container'
import HoverCard from '../components/ui/HoverCard'
import ToolCta from '../components/tools/ToolCta'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import toolsDirectory from '../data/toolsDirectory'

const allTools = toolsDirectory.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.heading }))
)

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Free Online Tools — GST, PDF, Developer & Business Utilities',
      'description': `${allTools.length}+ free online tools: GST and financial calculators, PDF utilities, developer tools, and SEO utilities. Fast, browser-based, no signup.`,
      'url': 'https://www.aadhiraiinnovations.com/tools',
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.aadhiraiinnovations.com' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.aadhiraiinnovations.com/tools' },
        ],
      },
    }

    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Free Online Tools',
      'itemListElement': allTools.map((tool, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': tool.label,
        'url': `https://www.aadhiraiinnovations.com${tool.href}`,
      })),
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Are these tools free to use?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, every tool on this page is completely free. No signup, no credit card, no watermarks, and no hidden charges.' },
        },
        {
          '@type': 'Question',
          'name': 'Is my data safe and private?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. Every tool runs entirely in your browser — files and text are processed locally and never uploaded to our servers, unless a tool explicitly says otherwise (like the gated resource downloads).' },
        },
        {
          '@type': 'Question',
          'name': 'Do I need to install software?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. Every tool runs in your web browser on Windows, Mac, Linux, and mobile devices.' },
        },
      ],
    }

    const scripts = [
      ['webpage', webPageSchema],
      ['itemlist', itemListSchema],
      ['faqpage', faqSchema],
    ].map(([name, schema]) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-schema', name)
      el.text = JSON.stringify(schema)
      document.head.appendChild(el)
      return el
    })

    return () => scripts.forEach((el) => el.remove())
  }, [])
}

export default function ToolsHubPage() {
  usePageSchema()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...toolsDirectory.map((g) => g.heading)]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allTools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
      const matchesQuery = !q || tool.label.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const groupedFiltered = toolsDirectory
    .map((group) => ({ ...group, items: filtered.filter((t) => t.category === group.heading) }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/60">
                {allTools.length}+ Free Tools
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
              Free Online Tools
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              GST and financial calculators, PDF utilities, developer tools, and SEO utilities — all free, browser-based, no signup, no watermarks.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Search + Filter + Grid ────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools — e.g. GST, PDF, JSON, calculator"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
                    activeCategory === cat
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-[#0B1F3A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {groupedFiltered.length === 0 && (
            <p className="text-sm text-slate-400 py-12 text-center">No tools match "{query}".</p>
          )}

          <div className="space-y-14">
            {groupedFiltered.map((group) => (
              <div key={group.heading}>
                <h2 className="text-lg font-semibold text-[#0B1F3A] mb-5">{group.heading}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((tool, idx) => (
                    <motion.div
                      key={tool.href}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                    >
                      <HoverCard className="h-full">
                        <Link to={tool.href} className="flex h-full flex-col justify-between p-5">
                          <div>
                            <h3 className="text-sm font-semibold text-[#0B1F3A] mb-1.5">{tool.label}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                          </div>
                          <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#0B1F3A]">
                            Open tool
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </Link>
                      </HoverCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Brand Trust ────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-3">
              Built by Aadhirai Innovations
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We're a software company based in Tamil Nadu, India, building enterprise-grade tools for business automation, pharmacy management, and document processing. These free tools reflect our commitment to creating useful, trustworthy, and accessible solutions for professionals, students, and businesses worldwide.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <ToolFaqSection
        title="Common Questions About Our Tools"
        items={[
          {
            q: 'Are these tools free to use?',
            a: 'Yes, every tool on this page is completely free. No signup, no credit card, no hidden charges.',
          },
          {
            q: 'Is my data safe and private?',
            a: 'Yes. Files and text are processed entirely in your browser and never uploaded to our servers, unless a tool explicitly says otherwise.',
          },
          {
            q: 'Do I need to install software?',
            a: 'No software needed. All tools run in your web browser on Windows, Mac, Linux, and mobile devices.',
          },
          {
            q: 'Can I use these tools on mobile?',
            a: 'Yes, all tools are fully responsive and work on mobile phones and tablets.',
          },
        ]}
      />

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <ToolCta
        headline="Need enterprise document or business workflows?"
        body="Aadhirai Innovations builds custom software for large-scale document automation, business process workflows, and data transformation. From invoice processing to pharmacy management, we turn manual work into automated systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
