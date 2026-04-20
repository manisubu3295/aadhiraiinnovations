import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { course } from '../data/courses/javaDsaCourse'

/* ── Schema ────────────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Java DSA — Data Structures & Algorithms',
      description: course.subtitle,
      provider: { '@type': 'Organization', name: 'Aadhirai Innovations' },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        url: 'https://www.aadhiraiinnovations.com/learn/java-dsa',
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

/* ── Static lesson metadata (Level 1 + 2, live lessons) ───────────── */
const LIVE_LESSONS = [
  {
    n: 1,
    title: 'Arrays in Java',
    desc: 'Contiguous memory, O(1) access, indexing patterns, loop-based algorithms.',
    href: '/learn/java-dsa/arrays',
    courseHref: '/course/java-dsa/arrays',
    time: '18 min',
    exercises: 6,
    level: 'Foundations',
  },
  {
    n: 2,
    title: 'Linked Lists in Java',
    desc: 'Node pointers, O(1) front insert/delete, traversal, reversal algorithm.',
    href: '/learn/java-dsa/linked-list',
    courseHref: '/course/java-dsa/linked-list',
    time: '18 min',
    exercises: 4,
    level: 'Core Logic',
  },
  {
    n: 3,
    title: 'Stacks in Java',
    desc: 'LIFO principle, push/pop/peek, balanced brackets, undo/redo systems.',
    href: '/learn/java-dsa/stack',
    courseHref: '/course/java-dsa/stack',
    time: '15 min',
    exercises: 4,
    level: 'Data Structures',
  },
  {
    n: 4,
    title: 'Queues in Java',
    desc: 'FIFO principle, enqueue/dequeue, BFS traversal, job scheduling.',
    href: '/learn/java-dsa/queue',
    courseHref: '/course/java-dsa/queue',
    time: '14 min',
    exercises: 4,
    level: 'Data Structures',
  },
  {
    n: 5,
    title: 'Binary Search in Java',
    desc: 'O(log n) search, overflow-safe midpoint, loop termination patterns.',
    href: '/learn/java-dsa/binary-search',
    courseHref: '/course/java-dsa/binary-search',
    time: '16 min',
    exercises: 4,
    level: 'Core Logic',
  },
  {
    n: 6,
    title: 'Recursion in Java',
    desc: 'Base case, call stack model, memoization, Fibonacci optimization.',
    href: '/learn/java-dsa/recursion',
    courseHref: '/course/java-dsa/recursion',
    time: '17 min',
    exercises: 4,
    level: 'Advanced',
  },
]

const COMING_SOON = [
  { title: 'Big O Notation', level: 'Foundations' },
  { title: 'HashMaps in Java', level: 'Data Structures' },
  { title: 'Binary Trees', level: 'Advanced' },
  { title: 'Merge Sort', level: 'Core Logic' },
  { title: 'Dynamic Programming', level: 'Mastery' },
]

const EXERCISE_TYPES = [
  { label: 'Predict Output', desc: 'Trace code and choose what prints' },
  { label: 'Fill in Code', desc: 'Complete the missing expression' },
  { label: 'Complexity', desc: 'Choose O(1) / O(n) / O(log n)' },
  { label: 'Fix the Bug', desc: 'Spot and correct the defect' },
  { label: 'Trace', desc: 'Walk through execution line by line' },
  { label: 'Arrange', desc: 'Put steps in the correct order' },
]

/* ── Page ──────────────────────────────────────────────────────────── */
export default function JavaDsaPage() {
  usePageSchema()

  const totalTime = LIVE_LESSONS.reduce((sum, l) => sum + parseInt(l.time), 0)
  const totalExercises = LIVE_LESSONS.reduce((sum, l) => sum + l.exercises, 0)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 pt-10 pb-12 md:pb-16">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Learn', href: '/learn' }, { label: 'Java DSA' }]}
            isDark={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mt-8 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[#0B1F3A] tracking-wide">
                {LIVE_LESSONS.length} lessons live
              </span>
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl font-bold tracking-[-0.025em] text-[#0B1F3A] leading-[1.08] mb-4">
              Java DSA Course
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-2xl">
              A guided learning system for data structures and algorithms in Java.
              Not a tutorial — every lesson has interactive exercises and mentor-like feedback.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                {totalTime} min total
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                {totalExercises} exercises
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 flex items-center justify-center text-slate-400 text-xs font-bold">6</span>
                exercise types
              </span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Lesson List ──────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="max-w-3xl">
            {/* Section label */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Live Now
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1F3A]">
                  {LIVE_LESSONS.length} Lessons
                </h2>
              </div>
              <Link
                to="/learn"
                className="text-xs font-semibold text-slate-500 hover:text-[#0B1F3A] transition-colors"
              >
                Full roadmap →
              </Link>
            </div>

            {/* Lesson rows */}
            <div className="space-y-2">
              {LIVE_LESSONS.map((lesson, idx) => (
                <motion.div
                  key={lesson.n}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group rounded-xl border border-slate-200 bg-white hover:border-[#0B1F3A]/25 hover:bg-slate-50/50 transition-all overflow-hidden"
                >
                  <div className="flex items-start gap-5 px-5 py-4">
                    {/* Lesson number */}
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-[#0B1F3A]/8 flex items-center justify-center text-sm font-bold text-[#0B1F3A] tabular-nums transition-colors">
                      {String(lesson.n).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-[#0B1F3A]">{lesson.title}</h3>
                        <span className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 flex-shrink-0">
                          {lesson.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{lesson.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-slate-400">{lesson.time}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-[11px] text-slate-400">{lesson.exercises} exercises</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Link
                        to={lesson.courseHref}
                        className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white hover:border-slate-300 transition-colors"
                      >
                        Step mode
                      </Link>
                      <Link
                        to={lesson.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B1F3A] text-xs font-semibold text-white hover:bg-[#173762] transition-colors"
                      >
                        Start
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-14 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
              Learning System
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1F3A] mb-2">
              Not a tutorial. A guided system.
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Each lesson is a sequence of short interactive steps. You never read a wall of text — you understand visually, interact immediately, and receive specific feedback.
            </p>

            {/* Step flow diagram */}
            <div className="flex flex-wrap gap-0 items-center">
              {[
                { label: 'Concept', sub: 'One idea at a time' },
                { label: 'Visual', sub: 'Animated diagram' },
                { label: 'Worked Example', sub: 'Step-through code' },
                { label: 'Exercise', sub: '6 types available' },
                { label: 'Feedback', sub: 'Explains the why' },
                { label: 'Reflection', sub: 'What to remember' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center text-center w-24">
                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-[#0B1F3A] mb-1.5">
                      {i + 1}
                    </div>
                    <span className="text-[11px] font-semibold text-[#0B1F3A] leading-tight">{step.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{step.sub}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-6 flex-shrink-0 flex items-start justify-center pt-0 mb-7">
                      <div className="h-[1px] w-full bg-slate-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Exercise types ───────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-14 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
              Exercise Types
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1F3A] mb-8">
              6 ways to learn, not 1
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXERCISE_TYPES.map(({ label, desc }) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                  <p className="text-xs font-bold text-[#0B1F3A] mb-1">{label}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Coming Soon ──────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-14 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Coming Soon
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1F3A]">
                  Next in the Roadmap
                </h2>
              </div>
              <Link
                to="/learn"
                className="text-xs font-semibold text-slate-500 hover:text-[#0B1F3A] transition-colors"
              >
                All 45 lessons →
              </Link>
            </div>

            <div className="space-y-2">
              {COMING_SOON.map((item, idx) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-dashed border-slate-200 bg-white"
                >
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-400 tabular-nums flex-shrink-0">
                    {String(LIVE_LESSONS.length + idx + 1).padStart(2, '0')}
                  </div>
                  <span className="text-sm font-medium text-slate-500">{item.title}</span>
                  <span className="ml-auto text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-14 md:py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Start with Lesson 1
            </h2>
            <p className="text-white/55 text-base mb-8 leading-relaxed">
              Arrays — 18 minutes, 6 exercises, zero prerequisites.
              The foundation everything else builds on.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/learn/java-dsa/arrays"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-[#0B1F3A] text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Start Lesson 1
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/course/java-dsa/arrays"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Premium course mode
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
