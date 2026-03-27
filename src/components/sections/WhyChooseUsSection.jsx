import { motion } from 'framer-motion'
import { Brain, Layers, Shield, WifiOff, Headphones, X } from 'lucide-react'
import Container from '../ui/Container'

const failureModes = [
  'Demo-only reliability',
  'No AI intelligence layer',
  'Stalled deployments',
  'Zero access control',
  'No post-launch support',
]

const capabilities = [
  { icon: Brain,      label: 'AI-Native from Day 1' },
  { icon: Layers,     label: '5-Phase Delivery' },
  { icon: Shield,     label: 'Enterprise Security' },
  { icon: WifiOff,    label: 'Offline-First Core' },
  { icon: Headphones, label: 'Post-Deployment Support' },
]

export default function WhyChooseUsSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Left: The Reality */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                The Reality
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Most business software fails
              <br />
              not at demo, but at operation.
            </h2>

            <div className="mt-8 space-y-2.5">
              {failureModes.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex-none w-5 h-5 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                    <X className="h-3 w-3 text-red-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-slate-500">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Our Approach */}
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
                Our Approach
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              AI-integrated engineering
              <br />
              applied to real outcomes.
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon
                return (
                  <motion.div
                    key={cap.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 + 0.15 }}
                    className={`flex items-center gap-3 rounded-lg border border-[#0B1F3A]/8 bg-[#0B1F3A]/3 px-4 py-3.5 ${
                      i === capabilities.length - 1 && capabilities.length % 2 !== 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <div className="flex-none w-7 h-7 rounded-md border border-[#0B1F3A]/10 bg-[#0B1F3A]/6 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-[#0B1F3A]/55" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-[#0B1F3A]/75">{cap.label}</span>
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
