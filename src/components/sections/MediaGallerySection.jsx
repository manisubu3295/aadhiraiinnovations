import { motion } from 'framer-motion'
import { Code2, Target, Shield, Zap, Users, Award } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const principles = [
  {
    icon: Code2,
    title: 'Clean Architecture',
    description: 'Maintainable code with clear separation of concerns and predictable patterns',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Target,
    title: 'Business-First',
    description: 'Features designed around operational workflows, not technical preferences',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Built for reliability with error handling, logging, and graceful degradation',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Performance First',
    description: 'Optimized data flows and efficient queries for responsive user experience',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Interfaces designed for daily operators, not just administrators',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Award,
    title: 'Long-term Thinking',
    description: 'Scalable architecture that grows with your business, not against it',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
]

function MediaGallerySection() {
  return (
    <MotionSection id="principles" className="relative overflow-hidden py-12 md:py-16 lg:py-20 scroll-mt-24 bg-gradient-to-br from-white via-slate-50/30 to-white">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #0B1F3A 1px, transparent 1px), linear-gradient(to bottom, #0B1F3A 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="pointer-events-none absolute right-1/4 top-1/3 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <SectionHeading
            eyebrow="Our Principles"
            title="How we build software"
            description="Core engineering values that guide every implementation decision."
          />

          <div className="mt-10 md:mt-14 grid grid-cols-1 gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 md:p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300">
                  {/* Top gradient accent */}
                  <motion.div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${principle.color}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
                  />

                  {/* Background wash on hover */}
                  <div className={`absolute inset-0 ${principle.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

                  {/* Floating particles */}
                  <motion.div
                    className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${principle.color}`}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex rounded-2xl ${principle.bgColor} p-4 mb-4 shadow-sm`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <principle.icon className={`h-7 w-7 ${principle.iconColor}`} strokeWidth={2} />
                    </motion.div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2.5 leading-tight">
                      {principle.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </MotionSection>
  )
}

export default MediaGallerySection
