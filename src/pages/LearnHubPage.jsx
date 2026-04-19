import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import { course } from '../data/courses/javaDsaCourse'

function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.subtitle,
      provider: { '@type': 'Organization', name: 'Aadhirai Innovations' },
      url: 'https://www.aadhiraiinnovations.com/learn',
      numberOfCredits: course.totalLessons,
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'course-hub')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

const statusBadge = {
  live: { label: 'Live', className: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  soon: { label: 'Soon', className: 'text-amber-700 bg-amber-50 border-amber-200' },
  planned: { label: 'Planned', className: 'text-slate-500 bg-slate-50 border-slate-200' },
}

export default function LearnHubPage() {
  usePageSchema()

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] pt-16 pb-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-3 py-1 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-white/80 tracking-wide">
                {course.liveLessons} lessons live · {course.totalLessons} total planned
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.025em] text-white leading-[1.1] mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/learn/java-dsa/arrays"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0B1F3A] text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Start with Arrays
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/course/java-dsa/arrays"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Premium Course Mode
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <section className="bg-[#091528] border-b border-white/5">
        <Container>
          <div className="grid grid-cols-3 divide-x divide-white/10 py-0">
            {[
              { value: `${course.totalLessons}`, label: 'Lessons planned' },
              { value: '5', label: 'Learning levels' },
              { value: `${course.estimatedHours}h`, label: 'Estimated total' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center py-5">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Course Roadmap ─────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          {/* Section header */}
          <div className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
              Full Roadmap
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0B1F3A]">
              Course → Module → Lesson
            </h2>
            <p className="text-slate-500 mt-2 text-base">
              Each lesson is a complete interactive experience — concepts, visuals, exercises, mentor feedback.
            </p>
          </div>

          {/* Levels */}
          <div className="space-y-12">
            {course.levels.map((level, levelIdx) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: levelIdx * 0.05 }}
              >
                {/* Level header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: level.color }}
                  >
                    {level.level}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F3A]">
                      Level {level.level} — {level.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">{level.subtitle}</p>
                  </div>
                </div>

                {/* Modules in this level */}
                <div className="ml-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {level.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      {/* Module header */}
                      <div className="border-b border-slate-100 px-4 py-3">
                        <h4 className="text-sm font-semibold text-[#0B1F3A]">{mod.title}</h4>
                      </div>

                      {/* Lessons */}
                      <div className="divide-y divide-slate-50">
                        {mod.lessons.map((lesson) => {
                          const badge = statusBadge[lesson.status]
                          const isLive = lesson.status === 'live'

                          return (
                            <div key={lesson.id} className="px-4 py-3 flex items-center gap-3">
                              {/* Status icon */}
                              {isLive ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" strokeWidth={2} />
                              ) : (
                                <Lock className="h-4 w-4 text-slate-300 flex-shrink-0" strokeWidth={1.75} />
                              )}

                              {/* Lesson info */}
                              <div className="flex-1 min-w-0">
                                {isLive ? (
                                  <Link
                                    to={`/learn/java-dsa/${lesson.slug}`}
                                    className="block text-sm font-medium text-[#0B1F3A] hover:text-[#173762] truncate"
                                  >
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="block text-sm font-medium text-slate-400 truncate">
                                    {lesson.title}
                                  </span>
                                )}
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400">{lesson.estimatedTime}</span>
                                  <span className="text-slate-200">·</span>
                                  <span className="text-[10px] text-slate-400">{lesson.exerciseCount} exercises</span>
                                </div>
                              </div>

                              {/* Status badge */}
                              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${badge.className}`}>
                                {badge.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Learning System section ─────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-14 md:py-20">
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0B1F3A] mb-3">
              Not a Tutorial. A Guided System.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Every lesson is broken into focused interactive steps. You never read a wall of text. You understand, interact, make mistakes, get specific feedback, and move forward.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Concept', desc: 'Short focused explanation. One idea at a time.', icon: '💡' },
              { step: '02', title: 'Visual', desc: 'Animated diagrams make abstract structures concrete.', icon: '🎨' },
              { step: '03', title: 'Exercise', desc: 'Predict output, trace code, fix bugs, arrange steps.', icon: '📝' },
              { step: '04', title: 'Feedback', desc: 'Mentor-like responses that explain the why, not just the what.', icon: '✓' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{step}</span>
                </div>
                <h3 className="text-sm font-bold text-[#0B1F3A] mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-14 md:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-3">
              Begin with Lesson 1
            </h2>
            <p className="text-white/60 mb-8">
              Arrays in Java — 18 minutes, 5 exercises, zero prerequisites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/learn/java-dsa/arrays"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0B1F3A] text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Start Lesson 1 <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/course/java-dsa/arrays"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Premium step-by-step mode
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
