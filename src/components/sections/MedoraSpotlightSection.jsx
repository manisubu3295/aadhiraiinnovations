import { motion } from 'framer-motion'
import { Pill, ExternalLink } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

function MedoraSpotlightSection() {
  return (
    <MotionSection id="products" className="py-12 md:py-16 lg:py-20 scroll-mt-24">
      <Container>
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Product Spotlight"
              title="Medora+"
              description="A scalable pharmacy management system designed for operational clarity."
            />

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Pill className="h-3.5 w-3.5" />
              Demo available
            </span>

            <ul className="mt-6 md:mt-7 space-y-2 text-sm text-slate-600">
              <li>GST Billing</li>
              <li>Stock & Batch Tracking</li>
              <li>Expiry Alerts</li>
              <li>Sales & Purchase</li>
              <li>Offline Mode</li>
              <li>Optional Cloud Sync</li>
              <li>Multi-tenant SaaS capability</li>
            </ul>

            <div className="mt-6 md:mt-7 flex flex-wrap gap-3">
              <a
                href="http://151.185.43.65/login"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
              >
                Launch Medora+ Demo
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-md border border-slate-200 px-5 py-3 text-sm font-medium text-[#0B1F3A] transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Request Pilot
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_38px_rgba(11,31,58,0.08)]">
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/Cac-96pbNq0?si=Cl7BEZAgmz9WTrjZ"
                  title="Medora+ walkthrough"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </MotionSection>
  )
}

export default MedoraSpotlightSection
