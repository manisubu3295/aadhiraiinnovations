import { motion } from 'framer-motion'
import Container from '../ui/Container'

const metrics = [
  { value: '10+',         label: 'Years of experience'  },
  { value: '13',          label: 'Active products'       },
  { value: 'AI-powered',  label: 'Billing & analytics'  },
  { value: 'Global',      label: 'Reach'                 },
]

function ProofStripSection() {
  return (
    <section id="capabilities" className="bg-[#0B1F3A] py-12 md:py-14 scroll-mt-24">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="flex flex-col py-8 md:py-2 md:border-r border-white/[0.07] last:border-0 md:px-10 first:md:pl-0 last:md:pr-0"
            >
              <span
                className="font-bold text-white tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 2.8rem)' }}
              >
                {m.value}
              </span>
              <span className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default ProofStripSection
