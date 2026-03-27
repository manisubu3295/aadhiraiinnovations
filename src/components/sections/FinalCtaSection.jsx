import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Container from '../ui/Container'

function FinalCtaSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#0B1F3A] py-20 md:py-24 lg:py-28 scroll-mt-20">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-texture pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-white/18" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              Get Started
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.15]">
            Ready to deploy AI-integrated
            <br className="hidden sm:block" />
            intelligence into your operations?
          </h2>

          <p className="mt-6 max-w-xl text-base text-white/50 leading-relaxed">
            Start with a focused technical discussion. We deliver AI-integrated
            platforms with structured implementation, measurable outcomes, and
            direct engineering accountability.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://wa.me/918508716957"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-all hover:bg-white/92 rounded-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp (India)
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://wa.me/6590356479"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/18 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-all hover:border-white/38 hover:text-white rounded-sm"
            >
              WhatsApp (Singapore)
            </a>
          </div>

          <div className="mt-10 pt-8 border-t border-white/8 grid gap-2 text-xs text-white/30 sm:grid-cols-3">
            <span>+91 8508716957 / +65 90356479</span>
            <span>info@aadhiraiinnovations.com</span>
            <span>Peravurani & Chennai, Tamil Nadu</span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default FinalCtaSection
