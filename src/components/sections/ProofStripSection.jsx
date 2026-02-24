import { motion, useReducedMotion, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { CloudCog, ShieldCheck, MonitorSmartphone, Workflow, CheckCircle2, Zap, Database, Lock } from 'lucide-react'
import Container from '../ui/Container'

const proofCards = [
  {
    icon: ShieldCheck,
    title: 'Offline-first systems',
    description: 'Runs fully without internet. Cloud sync optional.',
    stat: '100%',
    statLabel: 'Uptime',
    accentColor: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50/80 to-cyan-50/80',
    features: ['No connectivity required', 'Local data control', 'Cloud sync on demand']
  },
  {
    icon: CloudCog,
    title: 'SaaS-ready architecture',
    description: 'Multi-tenant design built for scalability.',
    stat: '10K+',
    statLabel: 'Users',
    accentColor: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50/80 to-pink-50/80',
    features: ['Multi-tenant isolation', 'Auto-scaling ready', 'Efficient resource use']
  },
  {
    icon: MonitorSmartphone,
    title: 'Hybrid desktop + web',
    description: 'Operational desktop with optional web visibility.',
    stat: '2x',
    statLabel: 'Platforms',
    accentColor: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50/80 to-teal-50/80',
    features: ['Desktop performance', 'Web accessibility', 'Unified experience']
  },
  {
    icon: Workflow,
    title: 'Structured delivery',
    description: 'Phased implementation with measurable milestones.',
    stat: '5',
    statLabel: 'Phases',
    accentColor: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50/80 to-red-50/80',
    features: ['Clear milestones', 'Risk mitigation', 'Continuous feedback']
  },
]

const floatingIcons = [
  { Icon: CheckCircle2, top: '10%', left: '5%', delay: 0, duration: 8 },
  { Icon: Zap, top: '20%', right: '8%', delay: 0.5, duration: 7 },
  { Icon: Database, bottom: '15%', left: '10%', delay: 1, duration: 9 },
  { Icon: Lock, bottom: '25%', right: '12%', delay: 1.5, duration: 8.5 },
]

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    const targetNum = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target
    const increment = targetNum / (duration * 60)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetNum) {
        setCount(targetNum)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  const formattedCount = target.includes('K') 
    ? `${Math.floor(count / 1000)}K${suffix}`
    : target.includes('x')
    ? `${Math.floor(count)}x${suffix}`
    : target.includes('%')
    ? `${Math.floor(count)}%${suffix}`
    : `${Math.floor(count)}${suffix}`

  return <span ref={ref}>{formattedCount}</span>
}

function ProofStripSection() {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <section id="capabilities" className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 md:py-16 lg:py-20 scroll-mt-24">
      {/* Animated grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(11, 31, 58, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11, 31, 58, 0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating decorative icons */}
      {!shouldReduceMotion && floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block text-slate-300/40"
          style={{ 
            top: item.top, 
            left: item.left, 
            right: item.right, 
            bottom: item.bottom 
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon className="w-12 h-12" strokeWidth={1.5} />
        </motion.div>
      ))}

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="relative"
        >
          {/* Header with animated underline */}
          <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-4xl lg:text-5xl">
                Engineered for Reliability.{' '}
                <span className="relative inline-block">
                  Designed for Scale.
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </span>
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 text-base font-medium text-slate-600 md:text-lg"
            >
              Built with structured architecture and disciplined implementation.
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {proofCards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group"
                style={{ perspective: '1000px' }}
              >
                <motion.article
                  className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300"
                  whileHover={shouldReduceMotion ? {} : { 
                    y: -8,
                    scale: 1.02,
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
                    borderColor: 'rgba(11, 31, 58, 0.3)',
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated gradient top border */}
                  <motion.div
                    className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${item.accentColor}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                  />

                  {/* Background gradient that expands on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 transition-opacity duration-500`}
                    animate={{ opacity: hoveredCard === index ? 0.5 : 0 }}
                  />

                  {/* Animated particles/dots */}
                  {!shouldReduceMotion && (
                    <>
                      <motion.div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                      />
                      <motion.div
                        className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                        animate={{
                          x: [0, 8, 0],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: index * 0.4 }}
                      />
                    </>
                  )}

                  <div className="relative p-6 md:p-7 h-full flex flex-col">
                    {/* Icon with rotating ring */}
                    <div className="relative mb-5">
                      <motion.div
                        className="relative inline-flex rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-4 shadow-md"
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="h-8 w-8 text-[#0B1F3A]" strokeWidth={2} />
                        
                        {/* Rotating ring on hover */}
                        {hoveredCard === index && !shouldReduceMotion && (
                          <motion.div
                            className={`absolute inset-0 rounded-2xl`}
                            style={{
                              background: `conic-gradient(from 0deg, transparent, ${item.accentColor.includes('blue') ? '#3b82f6' : item.accentColor.includes('purple') ? '#a855f7' : item.accentColor.includes('emerald') ? '#10b981' : '#f97316'}, transparent)`,
                              padding: '2px',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Animated stat counter */}
                    <motion.div
                      className={`text-4xl font-bold bg-gradient-to-r ${item.accentColor} bg-clip-text text-transparent mb-1`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                    >
                      <AnimatedCounter target={item.stat} />
                    </motion.div>
                    
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      {item.statLabel}
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Feature tags that appear on hover */}
                    <motion.div
                      className="mt-auto space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredCard === index ? 1 : 0,
                        height: hoveredCard === index ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.features.map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredCard === index ? 1 : 0,
                            x: hoveredCard === index ? 0 : -10,
                          }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${item.accentColor}`} />
                          {feature}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Shine effect on hover */}
                  {hoveredCard === index && !shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  )}
                </motion.article>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default ProofStripSection
