import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, BarChart2, BookOpen, ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Breadcrumbs from '../ui/Breadcrumbs'
import LessonEngine from './engine/LessonEngine'
import LessonNav from './LessonNav'

/**
 * Reusable interactive lesson page for all DSA topics.
 * Each topic passes its lessonData, prev, next, and difficulty.
 */
export default function InteractiveLessonPage({
  lessonData,
  prev,
  next,
  difficulty = 'Beginner',
}) {
  const exerciseCount = lessonData.blocks.filter(b => b.type === 'exercise').length

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: lessonData.title,
      description: `Interactive Java DSA lesson: ${lessonData.title}. Visual explanations, worked examples, and ${exerciseCount} exercises.`,
      educationalLevel: difficulty,
      inLanguage: 'en',
      url: `https://www.aadhiraiinnovations.com/learn/java-dsa/${lessonData.slug}`,
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'learning-resource')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [lessonData.slug])

  const meta = [
    { icon: Clock, label: lessonData.estimatedTime },
    { icon: BarChart2, label: difficulty },
    { icon: BookOpen, label: `${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}` },
  ]

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 pt-10 pb-12 md:pb-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Learn', href: '/learn' },
              { label: 'Java DSA', href: '/learn/java-dsa' },
              { label: lessonData.title },
            ]}
            isDark={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-8 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B1F3A]" />
              <span className="text-xs font-semibold text-[#0B1F3A] tracking-wide">
                {lessonData.badge}
              </span>
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.025em] text-[#0B1F3A] leading-[1.08] mb-4">
              {lessonData.title}
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              {lessonData.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {meta.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Lesson Content ─────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LessonEngine lessonData={lessonData} />
          </motion.div>
        </Container>
      </section>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 py-10 md:py-12">
        <Container>
          <LessonNav prev={prev} next={next} />
        </Container>
      </section>
    </>
  )
}
