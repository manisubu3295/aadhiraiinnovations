import { motion } from 'framer-motion'
import { Landmark, ShieldCheck, Layers, CheckCircle2 } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const pillars = [
  {
    icon: Landmark,
    title: 'Enterprise-grade architecture',
    description: 'Structured system design patterns shaped by enterprise and banking standards.',
    accent: 'from-indigo-500 to-blue-500',
    tint: 'bg-indigo-50',
    iconColor: 'text-indigo-700',
  },
  {
    icon: Layers,
    title: 'Controlled implementation',
    description: 'Phased delivery with checkpoints, observability, and predictable rollout quality.',
    accent: 'from-cyan-500 to-teal-500',
    tint: 'bg-cyan-50',
    iconColor: 'text-cyan-700',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    description: 'Security-first decisions integrated into workflows, access models, and data handling.',
    accent: 'from-emerald-500 to-green-500',
    tint: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
]

const outcomes = [
  'Reduced rework through disciplined technical decisions',
  'Higher reliability for operations-critical enterprise systems',
  'Enterprise thinking adapted for Tamil Nadu business realities',
]

function EnterpriseExposureSection() {
  return (
    <MotionSection id="exposure" className="relative overflow-hidden py-12 md:py-16 lg:py-20 scroll-mt-24 bg-gradient-to-br from-white via-slate-50/40 to-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(11,31,58,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,31,58,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <Container>
        <SectionHeading
          eyebrow="Enterprise Exposure"
          title="Applied engineering discipline"
          description="Engineering exposure to enterprise and banking technology environments in Singapore."
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="mt-5 md:mt-6 max-w-4xl text-base text-slate-600 sm:text-lg"
        >
          Aadhirai Innovations applies disciplined architecture, controlled implementation, and secure design principles
          from enterprise settings to AI-integrated platforms across Tamil Nadu and India.
        </motion.p>

        <div className="mt-8 md:mt-10 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${pillar.accent}`} />
              <div className={`inline-flex rounded-xl p-3 ${pillar.tint}`}>
                <pillar.icon className={`h-6 w-6 ${pillar.iconColor}`} strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0B1F3A]">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-6 md:mt-8 rounded-2xl border border-slate-200 bg-white/90 p-5 md:p-6"
        >
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">What this means for clients</h4>
          <ul className="mt-3 space-y-2.5">
            {outcomes.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </MotionSection>
  )
}

export default EnterpriseExposureSection
