import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import Container from '../components/ui/Container'
import products from '../data/products'

/* ─── Animation ─────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

/* ─── Not found state ───────────────────────────────────────────────────── */
function ProductNotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Product not found</p>
      <h1 className="text-3xl font-semibold text-[#0B1F3A]">This product doesn't exist.</h1>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A] underline underline-offset-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>
    </div>
  )
}

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({ children, bg = 'bg-white', className = '', id }) {
  return (
    <section id={id} className={`${bg} py-16 md:py-20 lg:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

/* ─── Eyebrow ───────────────────────────────────────────────────────────── */
function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`text-[10.5px] font-bold uppercase tracking-[0.26em] block mb-5 ${
        light ? 'text-white/35' : 'text-[#0B1F3A]/38'
      }`}
    >
      {children}
    </span>
  )
}

/* ─── ProductPage ───────────────────────────────────────────────────────── */
function ProductPage() {
  const { slug } = useParams()
  const product  = products.find(p => p.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!product) return <ProductNotFound />

  const Icon = product.icon

  return (
    <article>

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-24 md:py-28 lg:py-36">
        <div className="absolute inset-0 grid-texture pointer-events-none" />

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-[600px] w-[600px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: `radial-gradient(circle, ${product.color}, transparent 70%)` }}
        />

        <Container className="relative z-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              to="/#portfolio"
              className="inline-flex items-center gap-2 text-[12px] font-medium text-white/35 hover:text-white/65 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              All products
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            {/* Category + icon */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${product.color}18` }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color: product.color }} strokeWidth={1.75} />
              </div>
              <span
                className="text-[10.5px] font-bold uppercase tracking-[0.26em]"
                style={{ color: `${product.color}cc` }}
              >
                {product.category}
              </span>
            </motion.div>

            {/* Product name */}
            <motion.h1
              variants={fadeUp}
              className="font-bold text-white leading-[1.02] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
            >
              {product.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-[17px] md:text-[19px] text-white/48 leading-[1.7] max-w-[44ch] font-light"
            >
              {product.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-7 py-[13px] text-[13px] font-bold tracking-wide text-[#060e1c] transition-all hover:bg-white/93"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/14 px-7 py-[13px] text-[13px] font-medium text-white/55 transition-all hover:border-white/30 hover:text-white/82"
              >
                View demo
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. What it does ─────────────────────────────────────────────── */}
      <Section bg="bg-white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <Eyebrow>What it does</Eyebrow>
            <h2
              className="font-semibold tracking-[-0.03em] text-[#0B1F3A] leading-[1.15]"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              Built for the work, not the demo.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-[16px] text-slate-600 leading-[1.85]">{product.description}</p>
          </motion.div>
        </div>
      </Section>

      {/* ── 3. Features ─────────────────────────────────────────────────── */}
      <Section bg="bg-[#f6f3ec]">
        <Eyebrow>Capabilities</Eyebrow>
        <h2
          className="font-semibold tracking-[-0.03em] text-[#0B1F3A] leading-[1.15] mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
        >
          What {product.name} handles.
        </h2>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-0 divide-[#0B1F3A]/[0.07]">
          {product.features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="py-7 sm:px-6 first:sm:pl-0 last:sm:pr-0 sm:border-r sm:border-[#0B1F3A]/[0.07] last:sm:border-0"
            >
              <div
                className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: product.color }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-[15px] font-semibold text-[#0B1F3A] mb-2 leading-snug">
                {feature.title}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {feature.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 4. Use cases ────────────────────────────────────────────────── */}
      {product.useCases?.length > 0 && (
        <Section bg="bg-white">
          <Eyebrow>Who it's for</Eyebrow>
          <h2
            className="font-semibold tracking-[-0.03em] text-[#0B1F3A] leading-[1.15] mb-12"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
          >
            Built for these businesses.
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.useCases.map((uc, i) => (
              <motion.div
                key={uc.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-slate-100 bg-[#faf9f7] p-6"
              >
                <div
                  className="mb-1 h-[2px] w-8 rounded-full"
                  style={{ background: product.color }}
                />
                <h3 className="mt-4 text-[15px] font-semibold text-[#0B1F3A]">{uc.label}</h3>
                <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">{uc.detail}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 5. Outcomes ─────────────────────────────────────────────────── */}
      {product.outcomes?.length > 0 && (
        <section className="bg-[#0B1F3A] py-16 md:py-20 lg:py-24">
          <Container>
            <Eyebrow light>Real outcomes</Eyebrow>
            <h2
              className="font-semibold tracking-[-0.03em] text-white leading-[1.15] mb-14"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              What changes after {product.name}.
            </h2>

            <div className="grid gap-0 divide-y divide-white/[0.07] md:divide-y-0 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-white/[0.07]">
              {product.outcomes.map((outcome, i) => (
                <motion.div
                  key={outcome.metric}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-7 md:px-8 first:md:pl-0 last:md:pr-0"
                >
                  <h3
                    className="text-[17px] font-semibold mb-2 leading-tight"
                    style={{ color: product.color === '#0B1F3A' ? '#93c5fd' : product.color }}
                  >
                    {outcome.metric}
                  </h3>
                  <p className="text-[13px] text-white/42 leading-relaxed">
                    {outcome.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 6. CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[#060e1c] py-20 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75 }}
            >
              <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-white/30 block mb-5">
                Next step
              </span>
              <h2
                className="font-semibold tracking-[-0.03em] text-white leading-[1.15]"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
              >
                See {product.name} working
                <br />in your business.
              </h2>
              <p className="mt-5 text-[15px] text-white/40 leading-[1.8] max-w-[42ch]">
                Tell us what you run. We'll show you exactly how {product.name} fits
                your daily operations — no commitment, no generic demo.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="flex flex-col gap-3 lg:pl-8"
            >
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-4 transition-all hover:bg-white/[0.08] hover:border-white/[0.2]"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-white/40" strokeWidth={1.75} />
                  <div>
                    <div className="text-[13px] font-semibold text-white/78">WhatsApp India</div>
                    <div className="text-[11px] text-white/32">+91 8508716957</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/22 group-hover:text-white/55 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
              </a>

              <a
                href="https://wa.me/6590356479"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-4 transition-all hover:bg-white/[0.08] hover:border-white/[0.2]"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-white/40" strokeWidth={1.75} />
                  <div>
                    <div className="text-[13px] font-semibold text-white/78">WhatsApp International</div>
                    <div className="text-[11px] text-white/32">+65 90356479</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/22 group-hover:text-white/55 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
              </a>

              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center justify-center gap-2 rounded-sm bg-white py-4 text-[13px] font-bold text-[#060e1c] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all hover:bg-white/93"
              >
                View live demo
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </motion.div>
          </div>
        </Container>
      </section>

    </article>
  )
}

export default ProductPage
