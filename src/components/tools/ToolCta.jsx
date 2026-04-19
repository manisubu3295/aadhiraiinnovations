import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'

export default function ToolCta({
  headline = 'Need automated business document workflows?',
  body = 'Aadhirai Innovations builds enterprise-grade software for document automation, business process workflows, and data processing.',
  ctas = [
    { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
    { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
  ],
}) {
  return (
    <section className="bg-[#0B1F3A] py-16 md:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2] mb-4">
            {headline}
          </h2>

          <p className="text-base text-white/60 mb-7 leading-relaxed">{body}</p>

          <div className="flex flex-wrap gap-3">
            {ctas.map((cta, idx) => (
              <a
                key={idx}
                href={cta.href}
                target={cta.href.startsWith('http') ? '_blank' : undefined}
                rel={cta.href.startsWith('http') ? 'noreferrer' : undefined}
                className={`inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors ${
                  cta.primary
                    ? 'bg-white text-[#0B1F3A] hover:bg-white/92'
                    : 'border border-white/20 text-white hover:border-white/40'
                }`}
              >
                {cta.label}
                {cta.primary && <ArrowRight className="h-4 w-4" />}
              </a>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
