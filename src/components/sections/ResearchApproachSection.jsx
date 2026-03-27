import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, MapPin, Layers, Rocket, TrendingUp } from 'lucide-react'
import Container from '../ui/Container'

const steps = [
  {
    icon: Search,
    title: 'Understand',
    description: 'Deep operational study before any design decisions.',
    details: ['Stakeholder interviews', 'Process mapping', 'Pain point analysis'],
  },
  {
    icon: MapPin,
    title: 'Map',
    description: 'Architecture follows discovery, not assumptions.',
    details: ['Workflow documentation', 'Bottleneck identification', 'Efficiency baseline'],
  },
  {
    icon: Layers,
    title: 'Architect',
    description: 'System design for scale, maintainability, and team readiness.',
    details: ['System design', 'Scalability planning', 'Tech stack selection'],
  },
  {
    icon: Rocket,
    title: 'Build in Phases',
    description: 'Controlled, phased delivery with quality checkpoints.',
    details: ['Milestone-driven delivery', 'Risk mitigation', 'Quality assurance'],
  },
  {
    icon: TrendingUp,
    title: 'Support & Improve',
    description: 'Structured post-launch support with continuous improvement.',
    details: ['Performance monitoring', 'User feedback loop', 'Ongoing optimisation'],
  },
]

function ResearchApproachSection() {
  const [activeStep, setActiveStep] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3800)
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  const active = steps[activeStep]

  return (
    <section
      id="approach"
      className="relative border-y border-slate-100 bg-slate-50 py-14 md:py-20 lg:py-24 scroll-mt-24 overflow-hidden"
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(11, 31, 58, 0.07) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Research-Driven Delivery
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
            A proven methodology for
            <br />
            complex system implementations.
          </h2>
        </motion.div>

        {/* Desktop: Horizontal interactive timeline */}
        <div className="hidden lg:block">
          {/* Step buttons */}
          <div className="relative flex items-center justify-between mb-10">
            {/* Track */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -translate-y-1/2" />
            {/* Active progress */}
            <motion.div
              className="absolute top-1/2 left-0 h-px bg-[#0B1F3A]/35 -translate-y-1/2 origin-left"
              animate={{ scaleX: (activeStep + 1) / steps.length }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            />

            {steps.map((step, index) => {
              const isActive = index === activeStep
              const isPast = index < activeStep
              const StepIcon = step.icon
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  className="relative z-10 group flex flex-col items-center gap-2 focus:outline-none"
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0B1F3A] border-[#0B1F3A] shadow-lg'
                        : isPast
                        ? 'bg-[#0B1F3A]/15 border-[#0B1F3A]/30'
                        : 'bg-white border-slate-200 group-hover:border-[#0B1F3A]/30'
                    }`}
                  >
                    <StepIcon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#0B1F3A]/45'
                      }`}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold transition-colors duration-300 ${
                      isActive ? 'text-[#0B1F3A]' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active step detail card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm"
          >
            <div className="flex items-start gap-8">
              <div className="flex-none w-14 h-14 rounded-xl bg-[#0B1F3A]/6 border border-[#0B1F3A]/10 flex items-center justify-center">
                {(() => {
                  const Icon = active.icon
                  return <Icon className="h-6 w-6 text-[#0B1F3A]/55" strokeWidth={1.75} />
                })()}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Phase {activeStep + 1} of {steps.length}
                </div>
                <h3 className="text-xl font-semibold text-[#0B1F3A] mb-3">
                  {active.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-5">
                  {active.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.details.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1.5 mt-8">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                    activeStep === i
                      ? 'w-8 bg-[#0B1F3A]'
                      : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => {
            const isActive = activeStep === index
            const StepIcon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.09, duration: 0.5 }}
                onViewportEnter={() => setActiveStep(index)}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-slate-200 -mb-4" />
                )}
                <div
                  className={`rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[#0B1F3A]/20 bg-white shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-none w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-[#0B1F3A] shadow-sm'
                            : 'bg-slate-100'
                        }`}
                      >
                        <StepIcon
                          className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`}
                          strokeWidth={1.75}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                          Phase {index + 1}
                        </div>
                        <h3 className="text-base font-semibold text-[#0B1F3A] mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex-wrap gap-2 mt-3"
                          >
                            {step.details.map((d) => (
                              <span
                                key={d}
                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                              >
                                {d}
                              </span>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default ResearchApproachSection
