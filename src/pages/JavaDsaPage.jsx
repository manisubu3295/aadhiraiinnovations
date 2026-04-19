import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Breadcrumbs from '../components/ui/Breadcrumbs'

function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': 'Java DSA — Data Structures & Algorithms',
      'description': 'Complete course covering arrays, linked lists, stacks, queues, and trees with practical Java examples.',
      'provider': {
        '@type': 'Organization',
        'name': 'Aadhirai Innovations',
      },
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'course')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

export default function JavaDsaPage() {
  usePageSchema()

  const levels = ['Basics', 'Core DSA', 'Intermediate', 'Advanced']

  const topics = [
    { title: 'Arrays', available: true, href: '/learn/java-dsa/arrays', icon: '📦' },
    { title: 'Linked Lists', available: false, icon: '🔗' },
    { title: 'Stacks', available: false, icon: '📚' },
    { title: 'Queues', available: false, icon: '➡️' },
    { title: 'Trees', available: false, icon: '🌳' },
  ]

  const outcomes = [
    'Master fundamental data structures used in every software system',
    'Learn algorithms that solve real-world problems efficiently',
    'Understand time and space complexity analysis',
    'Build the foundation for coding interviews and technical roles',
    'Write optimized Java code that scales',
    'Connect theory to practical implementation',
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-slate-100 pt-8 pb-12 md:pb-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Learn', href: '/learn' },
              { label: 'Java DSA' },
            ]}
            isDark={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-semibold text-[#0B1F3A]/60 uppercase tracking-wide">Free Course</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1] mt-2 mb-4">
              Java DSA Course
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Learn data structures and algorithms with practical Java examples. Master the foundations every engineer should know.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Course Levels */}
      <section className="bg-slate-50 border-b border-slate-100 py-12">
        <Container>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <div
                key={level}
                className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-[#0B1F3A]"
              >
                {level}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Topics Grid */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-24">
        <Container>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Topics
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0B1F3A] leading-[1.2]">
              What You'll Study
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className={`rounded-xl border-2 p-8 text-center transition-all ${
                  topic.available
                    ? 'border-slate-200 hover:border-[#0B1F3A] hover:shadow-lg bg-white'
                    : 'border-slate-100 bg-slate-50 opacity-75'
                }`}
              >
                <div className="text-4xl mb-3">{topic.icon}</div>
                <h3 className="text-xl font-semibold text-[#0B1F3A] mb-4">{topic.title}</h3>
                {topic.available ? (
                  <Link
                    to={topic.href}
                    className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-[#0B1F3A] text-white font-semibold text-sm hover:bg-[#173762] transition-colors"
                  >
                    Start Lesson →
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-amber-100 text-amber-700 font-semibold text-sm">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* What You'll Learn */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Outcomes
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0B1F3A] leading-[1.2] mb-8">
              What You'll Learn
            </h2>

            <ul className="space-y-4">
              {outcomes.map((outcome) => (
                <motion.li
                  key={outcome}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-4 items-start"
                >
                  <span className="text-[#0B1F3A] font-bold text-xl leading-none mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-slate-700 text-lg leading-relaxed">{outcome}</span>
                </motion.li>
              ))}
            </ul>
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
              Begin Your Journey
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Start with Arrays, our first comprehensive lesson. Master the fundamentals that power every algorithm.
            </p>
            <Link
              to="/learn/java-dsa/arrays"
              className="inline-flex items-center justify-center rounded-lg bg-white text-[#0B1F3A] px-8 py-4 font-semibold hover:bg-slate-50 transition-colors"
            >
              Start with Arrays →
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
