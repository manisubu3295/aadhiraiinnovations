import { motion } from 'framer-motion'
import { Pill, ExternalLink } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'



function MedoraSpotlightSection() {
  return (
    <MotionSection id="products" className="py-8 md:py-12 scroll-mt-24">
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
                href="https://demo.aadhiraiinnovations.com"
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
              <a
                href="/media/Medora-brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-emerald-400 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100 hover:border-emerald-500 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-6-6m6 6l6-6" />
                </svg>
                View Brochure
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_38px_rgba(11,31,58,0.08)] mb-6">
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
