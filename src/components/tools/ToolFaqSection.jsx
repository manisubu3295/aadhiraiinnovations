import { motion } from 'framer-motion'
import Container from '../ui/Container'

export default function ToolFaqSection({ title = 'Frequently Asked Questions', items = [] }) {
  return (
    <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Common Questions
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
            {title}
          </h2>
        </motion.div>

        <div className="grid gap-4 max-w-3xl">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="font-semibold text-[#0B1F3A] mb-3 text-sm md:text-base">
                {item.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
