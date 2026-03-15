import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import { motion } from 'framer-motion'

function FinalCtaSection() {
  return (
    <MotionSection id="contact" className="py-16 md:py-20 lg:py-24 scroll-mt-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 sm:px-10 sm:py-12">
          <motion.div
            className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#0B1F3A]/40 to-transparent"
            initial={{ x: '-100%' }}
            whileInView={{ x: '100%' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
            Ready to modernize your operations with structured software delivery?
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Start with a practical business discussion. We focus on implementation clarity, not inflated promises.
          </p>

          <div className="mt-6 md:mt-7 flex flex-wrap gap-3">
            <a
              href="https://wa.me/918508716957"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
            >
              WhatsApp (India)
            </a>
            <a
              href="https://wa.me/6590356479"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#0B1F3A] transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              WhatsApp (Singapore)
            </a>
            <a
              href="http://151.185.43.65/login"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#0B1F3A] transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              View Demo
            </a>
          </div>

          <div className="mt-6 md:mt-7 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
            <p>WhatsApp: +91 8508716957 / +65 90356479</p>
            <p>Email: info@aadhiraiinnovations.com</p>
            <p>Peravurani & Chennai, Tamil Nadu, India</p>
          </div>
        </div>
      </Container>
    </MotionSection>
  )
}

export default FinalCtaSection
