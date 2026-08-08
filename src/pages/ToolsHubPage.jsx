import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Star, Lightbulb, Send, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import HoverCard from '../components/ui/HoverCard'
import ToolCta from '../components/tools/ToolCta'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import toolsDirectory from '../data/toolsDirectory'
import { API_BASE } from '../lib/apiBase'
import { useFavoriteTools } from '../hooks/useFavoriteTools'

const allTools = toolsDirectory.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.heading }))
)

// A handful of the tools people reach for most — one tap, no scrolling or typing needed.
const POPULAR_HREFS = [
  '/tools/gst-calculator',
  '/tools/tax-simulator',
  '/tools/emi-calculator',
  '/tools/merge-pdf',
  '/document-builder',
  '/tools/qr-code-generator',
]
const popularTools = POPULAR_HREFS.map((href) => allTools.find((t) => t.href === href)).filter(Boolean)

const categorySlug = (heading) => heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')

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

/* ─── Suggest a Tool ─────────────────────────────────────────────────────── */
function SuggestToolSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [idea, setIdea] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!idea.trim()) return
    setStatus('submitting')
    setErrorMsg('')
    try {
      const response = await fetch(`${API_BASE}/api/tool-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, idea }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) throw new Error(result?.message || 'Unable to send suggestion.')
      setStatus('success')
      setName(''); setEmail(''); setIdea('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Failed to send suggestion. Please try again.')
    }
  }

  return (
    <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3A]/5">
            <Lightbulb className="h-5 w-5 text-[#0B1F3A]" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-2">Can't find the tool you need?</h2>
          <p className="text-sm text-slate-500 mb-8">Tell us what you're looking for — we read every suggestion and regularly add new free tools.</p>

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" /> Thanks — your suggestion has been sent!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
                rows={3}
                placeholder="What tool would help your business? (required)"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional, for a reply)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
                />
              </div>
              {status === 'error' && <p className="text-xs text-red-600">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'submitting' || !idea.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173762] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {status === 'submitting' ? 'Sending…' : 'Send Suggestion'}
              </button>
            </form>
          )}
        </motion.div>
      </Container>
    </section>
  )
}

export default function ToolsHubPage() {
  usePageSchema()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { favorites, toggleFavorite, isFavorite } = useFavoriteTools()

  const categories = ['All', 'Favorites', ...toolsDirectory.map((g) => g.heading)]

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allTools.filter((t) => t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allTools.filter((tool) => {
      const matchesCategory =
        activeCategory === 'All' ? true :
        activeCategory === 'Favorites' ? favorites.has(tool.href) :
        tool.category === activeCategory
      const matchesQuery = !q || tool.label.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory, favorites])

  const groupedFiltered = toolsDirectory
    .map((group) => ({ ...group, items: filtered.filter((t) => t.category === group.heading) }))
    .filter((group) => group.items.length > 0)

  function goToSuggestion(tool) {
    setShowSuggestions(false)
    setQuery('')
    navigate(tool.href)
  }

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
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

            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
              GST and financial calculators, PDF utilities, developer tools, and SEO utilities — all free, browser-based, no signup, no watermarks.
            </p>

            {/* Popular tools — one tap, no scrolling or searching needed */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mr-1">Popular:</span>
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Sticky Search + Filter ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <Container>
          <div className="py-4">
            <div className="relative max-w-md mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search tools — e.g. GST, PDF, JSON, calculator"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
              />

              {/* Live suggestions — jump straight to a tool without touching the grid below */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(11,31,58,0.12)] overflow-hidden z-40"
                  >
                    {suggestions.map((tool) => (
                      <button
                        key={tool.href}
                        type="button"
                        onClick={() => goToSuggestion(tool)}
                        className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <span className="text-sm font-medium text-[#0B1F3A]">{tool.label}</span>
                        <span className="text-[11px] text-slate-400">{tool.category} · {tool.desc}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setActiveCategory(cat); setShowSuggestions(false) }}
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
          </div>
        </Container>
      </div>

      {/* ── Category Sections — every tool visible immediately, no expand step ── */}
      <section className="bg-white border-b border-slate-100 py-8 md:py-10" onClick={() => showSuggestions && setShowSuggestions(false)}>
        <Container>
          {groupedFiltered.length === 0 && (
            <p className="text-sm text-slate-400 py-12 text-center">
              {activeCategory === 'Favorites'
                ? 'No favorites yet — tap the star on any tool to save it here.'
                : `No tools match "${query}".`}
            </p>
          )}

          <div className="divide-y divide-slate-100">
            {groupedFiltered.map((group) => (
              <div key={group.heading} id={`cat-${categorySlug(group.heading)}`} className="py-5" style={{ scrollMarginTop: '150px' }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <h2 className="text-lg font-semibold text-[#0B1F3A]">{group.heading}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{group.items.length}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((tool) => (
                    <HoverCard key={tool.href} className="h-full relative">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.href) }}
                        aria-label={isFavorite(tool.href) ? `Remove ${tool.label} from favorites` : `Add ${tool.label} to favorites`}
                        className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-slate-100"
                      >
                        <Star
                          className={`h-4 w-4 ${isFavorite(tool.href) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          strokeWidth={1.75}
                        />
                      </button>
                      <Link to={tool.href} className="flex h-full flex-col justify-between p-5 pr-10">
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

      {/* ── Suggest a Tool ─────────────────────────────────────────────────── */}
      <SuggestToolSection />

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
