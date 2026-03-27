import { motion } from 'framer-motion'
import Container from '../ui/Container'

const metrics = [
  {
    value: '10+',
    label: 'Years Engineering',
    detail: 'Enterprise & banking-grade system experience',
  },
  {
    value: 'AI+',
    label: 'Intelligence Layer',
    detail: 'Embedded AI in every platform we build',
  },
  {
    value: '5-Phase',
    label: 'Delivery Framework',
    detail: 'Structured, milestone-driven implementation',
  },
  {
    value: 'SaaS+',
    label: 'Multi-Tenant Ready',
    detail: 'Scale from 10 to 10,000 clients seamlessly',
  },
]

function ProofStripSection() {
  return (
    <section
      id="capabilities"
      className="bg-[#0B1F3A] border-b border-white/5 py-12 md:py-16 scroll-mt-24"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-2 gap-8 md:gap-0 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-white/8"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="flex flex-col items-start py-4 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0"
            >
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {m.value}
              </div>
              <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                {m.label}
              </div>
              <div className="mt-2 text-xs text-white/28 leading-relaxed">{m.detail}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default ProofStripSection
