import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import LessonEngine from '../components/learn/engine/LessonEngine'
import LessonNav from '../components/learn/LessonNav'
import { lessonData } from '../data/lessons/arrays'

function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      'name': lessonData.title,
      'description': 'Interactive Java Arrays lesson with visual explanations, worked examples, and exercises.',
      'educationalLevel': 'Beginner to Intermediate',
      'inLanguage': 'en',
      'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/arrays',
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'learning-resource')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

export default function JavaDsaArraysInteractivePage() {
  usePageSchema()

  const prev = { label: 'Java DSA', href: '/learn/java-dsa' }
  const next = { label: 'Linked Lists', href: '/learn/java-dsa/linked-list' }

  return (
    <>
      {/* Hero / Header */}
      <section className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 py-12 md:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Learn', href: '/learn' },
              { label: 'Java DSA', href: '/learn/java-dsa' },
              { label: 'Arrays' },
            ]}
            isDark={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                {lessonData.badge}
              </span>
              <span className="text-sm text-slate-500 font-medium">⏱ {lessonData.estimatedTime}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1] mb-3">
              {lessonData.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {lessonData.subtitle}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main content */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LessonEngine lessonData={lessonData} />
          </motion.div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="bg-slate-50 border-b border-slate-100 py-8 md:py-12">
        <Container>
          <LessonNav prev={prev} next={next} />
        </Container>
      </section>
    </>
  )
}
