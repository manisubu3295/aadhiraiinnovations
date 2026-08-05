import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import Container from '../components/ui/Container'
import blogPosts from '../data/blogPosts'

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = blogPosts[slug]

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

  return (
    <>
      {/* ── Meta Tags ──────────────────────────────────────────────────── */}
      {/* Would use Helmet in production for dynamic meta */}

      {/* ── Blog Post Header ───────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
        <Container>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]/60">
                {post.category}
              </span>
              <div className="h-1 w-1 rounded-full bg-[#0B1F3A]/20" />
              <div className="flex items-center gap-4 text-[12px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1] mb-4 max-w-3xl">
              {post.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Blog Post Content ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="prose prose-sm md:prose-base max-w-3xl mx-auto text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/^# /gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-[#0B1F3A]">').replace(/<h1/g, '<h1').replace(/^## /gm, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-[#0B1F3A]">').replace(/<h2/g, '<h2').replace(/^### /gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-[#0B1F3A]">').replace(/<h3/g, '<h3').replace(/\n\n/g, '</p><p class="mb-4">').replace(/^- /gm, '<li>').replace(/<li>/g, '<li class="ml-4 list-disc">') }}
          />
        </Container>
      </section>

      {/* ── Related Links ──────────────────────────────────────────────── */}
      {post.relatedLinks && post.relatedLinks.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-100 py-12 md:py-16">
          <Container>
            <h3 className="text-lg font-semibold text-[#0B1F3A] mb-6">Related resources</h3>
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
              Ready to modernize your pharmacy operations?
            </h2>
            <p className="text-base text-white/60 mb-6">
              Medora+ brings everything covered in this guide together — GST compliance, offline operation, expiry tracking, and complete inventory management.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-white/90"
              >
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </a>
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
