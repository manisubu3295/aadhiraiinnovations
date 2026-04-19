import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Zap, Target } from 'lucide-react'
import Container from '../components/ui/Container'

function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Learn Java DSA & Programming',
      'description': 'Free structured learning paths for Java data structures and algorithms',
      'url': 'https://www.aadhiraiinnovations.com/learn',
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'webpage')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

export default function LearnHubPage() {
  usePageSchema()

  const tracks = [
    {
      title: 'Java DSA',
      description: 'Data structures and algorithms with practical Java examples',
      topics: ['Arrays', 'Linked Lists', 'Stacks', 'Trees'],
      badge: 'Live',
      badgeColor: 'bg-green-100 text-green-700',
      href: '/learn/java-dsa',
      available: true,
    },
    {
      title: 'AI for Business',
      description: 'Building intelligent systems for enterprise workflows',
      topics: ['ML Basics', 'Neural Networks', 'NLP', 'Deployment'],
      badge: 'Coming Soon',
      badgeColor: 'bg-amber-100 text-amber-700',
      href: '#',
      available: false,
    },
    {
      title: 'System Design',
      description: 'Scalable architecture and distributed systems',
      topics: ['Databases', 'Caching', 'APIs', 'DevOps'],
      badge: 'Coming Soon',
      badgeColor: 'bg-amber-100 text-amber-700',
      href: '#',
      available: false,
    },
  ]

  const benefits = [
    {
      icon: BookOpen,
      title: 'Real-World Code',
      description: 'Examples drawn from actual production systems, not toy problems',
    },
    {
      icon: Zap,
      title: 'Practical Focus',
      description: 'Learn how to apply concepts immediately in your projects',
    },
    {
      icon: Target,
      title: 'No Fluff',
      description: 'Clear explanations without unnecessary complexity or jargon',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#060e1c] py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Learn. Build. Scale.
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8">
              Master real-world software engineering concepts with practical examples. No fluff, just solid fundamentals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/learn/java-dsa"
                className="inline-flex items-center justify-center rounded-lg bg-white text-[#0B1F3A] px-7 py-3.5 font-semibold hover:bg-slate-50 transition-colors"
              >
                Start Learning Java DSA
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 text-white px-7 py-3.5 font-semibold hover:bg-white/5 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Learning Tracks */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-24">
        <Container>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Learning Paths
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0B1F3A] leading-[1.2]">
              Choose Your Learning Path
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#0B1F3A]">{track.title}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${track.badgeColor}`}>
                    {track.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4">{track.description}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {track.topics.map((topic) => (
                    <span key={topic} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {topic}
                    </span>
                  ))}
                </div>

                {track.available ? (
                  <Link
                    to={track.href}
                    className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] font-semibold hover:bg-[#0B1F3A]/10 transition-colors"
                  >
                    Start Learning →
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-slate-100 text-slate-500 font-semibold cursor-not-allowed">
                    Coming Soon
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Learn Here */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-24">
        <Container>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Our Approach
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0B1F3A] leading-[1.2]">
              Why Learn Here?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#0B1F3A]/10">
                    <Icon className="h-6 w-6 text-[#0B1F3A]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-[#0B1F3A] text-lg">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Ready to Master DSA?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Start with our comprehensive Java DSA course. Build strong fundamentals that power real-world systems.
            </p>
            <a
              href="/learn/java-dsa"
              className="inline-flex items-center justify-center rounded-lg bg-white text-[#0B1F3A] px-8 py-4 font-semibold hover:bg-slate-50 transition-colors"
            >
              Start Learning Java DSA →
            </a>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
