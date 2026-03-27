import { motion } from 'framer-motion'
import { Code2, Target, Shield, Zap, Users, Brain } from 'lucide-react'
import Container from '../ui/Container'

const principles = [
  {
    icon: Brain,
    title: 'AI-Native Architecture',
    description: 'Intelligence designed in from day one — every data model built for AI readiness.',
  },
  {
    icon: Code2,
    title: 'Clean Architecture',
    description: 'Clear separation of concerns that reduces long-term technical debt.',
  },
  {
    icon: Target,
    title: 'Business-First Design',
    description: 'Features built around real operational workflows, not template assumptions.',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Structured logging and graceful degradation under real operational load.',
  },
  {
    icon: Zap,
    title: 'Performance Optimised',
    description: 'Indexed queries and responsive interfaces — fast under real-world conditions.',
  },
  {
    icon: Users,
    title: 'Operator-Centric UI',
    description: 'Designed for daily operational staff, not just administrators or demo reviewers.',
  },
]

function MediaGallerySection() {
  return (
    <section
      id="principles"
      className="py-16 md:py-20 lg:py-24 bg-white border-t border-slate-100 scroll-mt-24"
    >
      <Container>
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
              Engineering Principles
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-lg leading-[1.2]">
            How we build AI-integrated
            <br />
            systems that last.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="group flex flex-col"
            >
              {/* Icon + rule */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-none w-9 h-9 flex items-center justify-center border border-slate-200 bg-slate-50 rounded-lg group-hover:border-[#0B1F3A]/20 transition-colors duration-300">
                  <principle.icon
                    className="h-4 w-4 text-[#0B1F3A]/55"
                    strokeWidth={1.75}
                  />
                </div>
                <div className="h-px flex-1 bg-slate-100 group-hover:bg-[#0B1F3A]/8 transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">
                {principle.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default MediaGallerySection
