import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Mail } from 'lucide-react'
import Container from '../ui/Container'

function FinalCtaSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#0B1F3A] py-24 md:py-28 lg:py-36 scroll-mt-20">
      <div className="absolute inset-0 grid-texture pointer-events-none" />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />

      <Container className="relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:gap-24 lg:items-start">

          {/* Left: the ask */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Get started
            </span>

            <h2
              className="mt-6 font-semibold tracking-[-0.04em] text-white leading-[1.08]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Ready to see how it
              <br />
              works in your business?
            </h2>

            <p className="mt-7 text-[16px] text-white/40 leading-[1.85] max-w-[40ch]">
              Pharmacy, school, or operations team — tell us what you run.
              We'll show you how Aadhirai fits into your daily work.
            </p>

            <p className="mt-5 text-[13px] italic text-white/22">
              No commitment. Just a real conversation.
            </p>

            {/* Location line — small, honest, grounding */}
            <p className="mt-14 text-[11.5px] text-white/20 tracking-wide">
              Peravurani & Chennai, Tamil Nadu · Serving globally
            </p>
          </motion.div>

          {/* Right: contact — plain rows, no card box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-14"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/28 mb-7">
              Reach us directly
            </p>

            {/* Contact rows — no box wrappers */}
            <div className="space-y-1">
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between py-4 border-t border-white/[0.07] hover:border-white/[0.18] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-white/35 flex-none" strokeWidth={1.75} />
                  <div>
                    <div className="text-[14px] font-semibold text-white/75">WhatsApp India</div>
                    <div className="text-[11.5px] text-white/32 mt-0.5">+91 8508716957</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/55 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
              </a>

              <a
                href="https://wa.me/6590356479"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between py-4 border-t border-white/[0.07] hover:border-white/[0.18] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-white/35 flex-none" strokeWidth={1.75} />
                  <div>
                    <div className="text-[14px] font-semibold text-white/75">WhatsApp International</div>
                    <div className="text-[11.5px] text-white/32 mt-0.5">+65 90356479</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/55 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
              </a>

              <a
                href="mailto:info@aadhiraiinnovations.com"
                className="group flex items-center justify-between py-4 border-t border-white/[0.07] border-b border-b-white/[0.07] hover:border-white/[0.18] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-white/35 flex-none" strokeWidth={1.75} />
                  <div>
                    <div className="text-[14px] font-semibold text-white/75">Email</div>
                    <div className="text-[11.5px] text-white/32 mt-0.5">info@aadhiraiinnovations.com</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/55 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
              </a>
            </div>

            {/* Demo CTA — full width, clear primary action */}
            <a
              href="https://demo.aadhiraiinnovations.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex items-center justify-center gap-2.5 rounded-sm bg-white py-4 text-[13.5px] font-bold text-[#0B1F3A] tracking-wide shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all hover:bg-white/93 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            >
              View live demo
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

export default FinalCtaSection
