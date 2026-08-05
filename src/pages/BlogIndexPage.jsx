import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Container from '../components/ui/Container'
import HoverCard from '../components/ui/HoverCard'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import blogPosts from '../data/blogPosts'

const posts = Object.values(blogPosts)
const categories = ['All', ...new Set(posts.map((p) => p.category))]

/* ─── Schema injection ────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Aadhirai Innovations Blog',
      'itemListElement': posts.map((post, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'url': `https://www.aadhiraiinnovations.com/blog/${post.slug}`,
        'name': post.title,
      })),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'blog-itemlist')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

export default function BlogIndexPage() {
  usePageSchema()
  const [activeCategory, setActiveCategory] = useState('All')

  const visiblePosts = useMemo(
    () => (activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory)),
    [activeCategory]
  )

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
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
                Insights
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
              Pharmacy &amp; business software, explained.
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Practical guides on GST compliance, pharmacy operations, inventory, workforce management, and digitizing retail — written from real implementation experience, not theory.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Filters + Grid ────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <Container>
          <div className="mb-10 flex flex-wrap gap-2">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.06 }}
              >
                <HoverCard className="flex h-full flex-col p-6 md:p-7">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]/50 mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-semibold text-[#0B1F3A] leading-snug mb-2.5">
                    <Link to={`/blog/${post.slug}`} className="hover:text-[#0B1F3A]/70 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{post.excerpt}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 text-[11.5px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-[12.5px] font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
                    >
                      Read
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCtaSection />
    </>
  )
}
