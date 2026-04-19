import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import products from '../../data/products'

/* ─── Single product row ─────────────────────────────────────────────────── */
function ProductRow({ product, index }) {
  const navigate  = useNavigate()
  const isFlagship = product.slug === 'medora'

  const handleClick = () => {
    if (product.route.startsWith('/')) {
      navigate(product.route)
    } else {
      const id = product.route.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.28) }}
      onClick={handleClick}
      className={`group relative flex items-center gap-4 md:gap-0 border-b border-[#0B1F3A]/[0.07] py-4 md:py-5 cursor-pointer -mx-4 px-4 rounded-sm transition-colors duration-200 hover:bg-[#0B1F3A]/[0.025] ${
        isFlagship ? 'bg-[#0B1F3A]/[0.015]' : ''
      }`}
    >
      {/* Left accent bar — slides down on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2.5px] rounded-r-full bg-[#0B1F3A] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-[280ms] ease-out" />

      {/* Category — desktop fixed-width column */}
      <span className="hidden md:block w-28 flex-none text-[9.5px] font-bold uppercase tracking-[0.26em] text-[#0B1F3A]/28 group-hover:text-[#0B1F3A]/48 transition-colors duration-200 pl-1">
        {product.category}
      </span>

      {/* Product name */}
      <div className="flex flex-1 items-baseline gap-3 min-w-0">
        {/* Mobile category */}
        <span className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]/30 flex-none">
          {product.category}
        </span>

        <h3
          className="font-semibold text-[#0B1F3A] tracking-[-0.035em] leading-none group-hover:opacity-55 transition-opacity duration-200 truncate"
          style={{
            fontSize: isFlagship
              ? 'clamp(1.35rem, 2.4vw, 1.9rem)'
              : 'clamp(1.1rem, 1.9vw, 1.55rem)',
          }}
        >
          {product.name}
        </h3>

        {/* Flagship badge — only Medora */}
        {isFlagship && (
          <span className="hidden md:inline-flex flex-none items-center rounded-full bg-[#0B1F3A] px-2.5 py-[3px] text-[8.5px] font-bold uppercase tracking-[0.2em] text-white">
            Flagship
          </span>
        )}
      </div>

      {/* One-liner — large desktop only */}
      <p className="hidden lg:block lg:w-[38%] xl:w-[42%] flex-none text-[12.5px] text-slate-400 leading-snug pr-6 group-hover:text-slate-500 transition-colors duration-200 truncate">
        {product.tagline}
      </p>

      {/* Arrow */}
      <ArrowUpRight
        className="h-4 w-4 flex-none text-[#0B1F3A]/18 group-hover:text-[#0B1F3A]/60 group-hover:-translate-y-px group-hover:translate-x-px transition-all duration-200"
        strokeWidth={1.75}
      />
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────────── */
function ProductPortfolioSection() {
  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-20 md:py-24">
      <Container>

        {/* Editorial header — label left, count right, thick rule below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex items-end justify-between pb-4 border-b-2 border-[#0B1F3A]">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0B1F3A]">
              Products
            </span>
            <span className="text-[11px] font-semibold tracking-[0.1em] text-[#0B1F3A]/38">
              {products.length} systems
            </span>
          </div>
        </motion.div>

        {/* Product rows */}
        <div className="mb-6">
          {products.map((product, i) => (
            <ProductRow key={product.slug} product={product} index={i} />
          ))}
        </div>

        {/* Footer line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-[11.5px] text-slate-400"
        >
          Pharmacy · Enterprise · Workforce · Education · Retail · Intelligence
        </motion.p>

      </Container>
    </section>
  )
}

export default ProductPortfolioSection
