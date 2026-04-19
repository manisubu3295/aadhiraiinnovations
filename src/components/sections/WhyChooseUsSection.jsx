import { motion } from 'framer-motion'
import { WifiOff, ReceiptIndianRupee, BookOpen, Headphones, Settings2, X, CheckCircle2 } from 'lucide-react'
import Container from '../ui/Container'

const problems = [
  'Too complex — staff needs training for every small task',
  'Stops working the moment internet goes down',
  'Not built for India\'s GST billing and compliance',
  'Support disappears after the software is installed',
  'Generic — not designed for your type of business',
]

const strengths = [
  { icon: BookOpen,           label: 'Simple enough for any staff to use from day one' },
  { icon: WifiOff,            label: 'Works fully offline — internet is optional' },
  { icon: ReceiptIndianRupee, label: 'GST-compliant and India-ready out of the box' },
  { icon: Headphones,         label: 'Support available after every launch' },
  { icon: Settings2,          label: 'Built specifically for your industry' },
]

export default function WhyChooseUsSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Left: The common problem */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                The Common Problem
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Most business software looks good
              <br />
              in a demo. Then fails at the counter.
            </h2>

            <div className="mt-8 space-y-2.5">
              {problems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex-none mt-0.5 w-5 h-5 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                    <X className="h-3 w-3 text-red-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13.5px] text-slate-500 leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: What we do differently */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-14"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#0B1F3A]/22" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0B1F3A]/42">
                How We Are Different
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Built for real daily work,
              <br />
              not for product demos.
            </h2>

            <div className="mt-8 space-y-2.5">
              {strengths.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.38, delay: i * 0.07 + 0.1 }}
                    className="flex items-center gap-3 rounded-lg border border-[#0B1F3A]/7 bg-[#0B1F3A]/[0.025] px-4 py-3.5"
                  >
                    <div className="flex-none w-7 h-7 rounded-md border border-[#0B1F3A]/10 bg-[#0B1F3A]/5 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-[#0B1F3A]/50" strokeWidth={1.75} />
                    </div>
                    <span className="text-[13.5px] font-medium text-[#0B1F3A]/72">{s.label}</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 flex-none text-emerald-500/60" strokeWidth={1.75} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
