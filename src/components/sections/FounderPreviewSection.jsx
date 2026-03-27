import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const credentials = [
  'Enterprise & banking-grade engineering background',
  'Singapore technology environment exposure',
  'AI-integrated systems design and implementation',
  '5-phase structured delivery methodology',
  'Founder-led delivery — directly accountable to every client',
]

function FounderPreviewSection() {
  return (
    <section id="founder" className="scroll-mt-24 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Left: photo — full bleed */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden min-h-[420px] lg:min-h-[600px] bg-[#0a1525]"
        >
          <img
            src="/media/founder.PNG"
            alt="Manikandan Subramaniyan — Founder, Aadhirai Innovations"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          {/* Gradient fade to right (blends into navy text panel) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B1F3A]/50 hidden lg:block" />
        </motion.div>

        {/* Right: text — dark navy */}
        <div className="flex flex-col justify-center bg-[#0B1F3A] px-8 py-14 md:px-12 md:py-20 lg:px-14 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-white/18" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                Founder
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-white leading-[1.3] sm:text-3xl">
              Manikandan Subramaniyan
            </h2>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/35">
              Founder, Aadhirai Innovations
            </p>

            <blockquote className="mt-8 text-white/62 text-[15px] leading-relaxed border-l-2 border-white/15 pl-5">
              &ldquo;I founded Aadhirai Innovations with a simple belief — technology
              should solve real business problems, not create more complexity.
              Reliable software is built through structured thinking, disciplined
              engineering, and a deep understanding of how businesses actually
              operate.&rdquo;
            </blockquote>

            {/* Credentials */}
            <ul className="mt-8 space-y-2.5">
              {credentials.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-start gap-3 text-sm text-white/55"
                >
                  <div className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/25" />
                  {c}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/founder"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors group"
              >
                Read the full founder story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FounderPreviewSection
