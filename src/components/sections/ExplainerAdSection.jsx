import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import Container from '../ui/Container'

/**
 * ExplainerAdSection — 30-second animated brand explainer, embedded via iframe.
 * Mirrors VideoSection.jsx's exact structural pattern (eyebrow + heading + framed
 * aspect-video card) so it reads as native to the page. The ad itself keeps its own
 * blue/gold palette — a deliberate departure from the site's navy/slate design system —
 * the same way any embedded video keeps its own look inside the site's own frame.
 */
function ExplainerAdSection() {
  return (
    <section
      id="explainer"
      className="bg-white border-t border-slate-100 py-14 md:py-20 lg:py-24 scroll-mt-24"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              30-Second Overview
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
            Simple software, made simple to explain.
          </h2>
          <p className="mt-4 flex items-center gap-2 text-base text-slate-500 max-w-xl leading-relaxed">
            <Volume2 className="h-4 w-4 flex-none text-slate-400" strokeWidth={1.75} />
            Billing and HR, for any business — in 30 seconds. Has sound; use the button inside to turn it on.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-slate-200 shadow-sm"
        >
          {/* No <noscript> fallback here on purpose — this section only exists in the DOM once
              React has mounted, which already requires JS. A visitor with JS disabled never sees
              this component at all, so a noscript branch inside it would be unreachable dead code.
              The CSS-only backup still lives at /ads/aadhirai-explainer-backup.html for any other
              context (a static landing page, an email, a social post) that isn't JS-gated like
              this one. */}
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="/ads/aadhirai-explainer.html"
              title="Aadhirai Innovations — 30 second overview"
              loading="lazy"
              allow="autoplay"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default ExplainerAdSection
