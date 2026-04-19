import { motion } from 'framer-motion'
import Container from '../ui/Container'
import Breadcrumbs from '../ui/Breadcrumbs'

export default function ToolPageHero({
  title,
  description,
  breadcrumbItems = [],
  badge = 'Free Tool',
}) {
  return (
    <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-28">
      <div className="absolute inset-0 grid-texture pointer-events-none" />
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <Container className="relative z-10">
        <div className="mb-8 text-white">
          <Breadcrumbs items={breadcrumbItems} isDark={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/60">
              {badge}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
            {title}
          </h1>

          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">{description}</p>
        </motion.div>
      </Container>
    </section>
  )
}
