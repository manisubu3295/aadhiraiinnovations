import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import Container from '../components/ui/Container'
import SeoMeta from '../components/seo/SeoMeta'
import SchemaMarkup from '../components/seo/SchemaMarkup'
import BlogMarkdown from '../components/blog/BlogMarkdown'
import blogPosts from '../data/blogPosts'
import blogCtaConfig, { DEFAULT_BLOG_CTA } from '../data/blogCtaConfig'

/* Thin fixed progress line tracking scroll through the whole page — an
   editorial/technical-report cue rather than decoration: it tells a reader
   how much of a long guide is left, which matters for 1500+ word posts. */
function ReadingProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[#0B1F3A]"
    />
  )
}

/* "On this page" rail — reads the h2 headings BlogMarkdown actually rendered
   (each stamped with an id by rehype-slug) rather than re-parsing the raw
   markdown, so the TOC can never drift out of sync with the real content. */
function TableOfContents({ articleRef, content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const els = Array.from(articleRef.current?.querySelectorAll('h2[id]') ?? [])
    setHeadings(els.map((el) => ({ id: el.id, text: el.textContent })))

    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // content identifies the post — headings only need rebuilding when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  if (headings.length < 2) return null

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        On this page
      </span>
      <ul className="space-y-0.5 border-l border-slate-200">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block border-l-2 py-1.5 pl-4 text-[13px] leading-snug transition-colors ${
                activeId === h.id
                  ? 'border-[#0B1F3A] font-medium text-[#0B1F3A]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = blogPosts[slug]
  const articleRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0B1F3A] mb-3">Blog post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </div>
    )
  }

  const canonical = `https://www.aadhiraiinnovations.com/blog/${post.slug}`
  const datePublished = new Date(post.date).toISOString()
  const cta = blogCtaConfig[post.ctaProduct] ?? DEFAULT_BLOG_CTA

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished,
    dateModified: datePublished,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@type': 'Organization', name: 'Aadhirai Innovations', url: 'https://www.aadhiraiinnovations.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Aadhirai Innovations',
      logo: { '@type': 'ImageObject', url: 'https://www.aadhiraiinnovations.com/media/logo.png' },
    },
    articleSection: post.category,
  }

  return (
    <>
      {/* ── Meta Tags ──────────────────────────────────────────────────── */}
      <SeoMeta
        title={`${post.title} | Aadhirai Innovations Blog`}
        description={post.excerpt}
        canonical={canonical}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        keywords={`${post.category}, ${post.title}`}
      />
      <SchemaMarkup schema={schema} />
      <ReadingProgressBar />

      {/* ── Blog Post Header ───────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
        <Container>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {post.category}
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.03em] text-[#0B1F3A] leading-[1.12] mb-5 max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {post.title}
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-[12.5px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Blog Post Content ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          {/* items-stretch (the grid default, left unset here) matters: it makes the
              aside's own box span the full row height so the sticky nav inside it has
              room to stick across the whole article — items-start would shrink the
              aside to its own short content height and the sticky nav would scroll
              away with it after ~350px. */}
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_216px]">
            <motion.article
              ref={articleRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.65 }}
              className="min-w-0 max-w-[680px]"
            >
              <BlogMarkdown content={post.content} />
            </motion.article>

            {/* Desktop-only rail — collapsing it on smaller screens keeps the
                article the single focus, matching how other supplementary
                elements sitewide hide below lg rather than stacking. */}
            <aside className="hidden lg:block">
              <TableOfContents articleRef={articleRef} content={post.content} />
            </aside>
          </div>
        </Container>
      </section>

      {/* ── Related Links ──────────────────────────────────────────────── */}
      {post.relatedLinks && post.relatedLinks.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-100 py-12 md:py-16">
          <Container>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Related resources
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className="group rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-[#0B1F3A] group-hover:text-[#0B1F3A]/70 text-sm mb-2 transition-colors">
                    {link.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0B1F3A]/60 group-hover:text-[#0B1F3A]">
                    Read more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2] mb-4">
              {cta.heading}
            </h2>
            <p className="text-base text-white/60 mb-6">
              {cta.body}
            </p>
            <div className="flex flex-wrap gap-3">
              {cta.primary.href.startsWith('/') ? (
                <Link
                  to={cta.primary.href}
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-white/90"
                >
                  {cta.primary.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={cta.primary.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-white/90"
                >
                  {cta.primary.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                Talk to us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
