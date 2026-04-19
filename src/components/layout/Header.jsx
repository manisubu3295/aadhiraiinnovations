import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'

const solutionItems = [
  {
    label: 'Pharmacy Software',
    desc: 'Billing · Stock · GST · Expiry alerts',
    href: '/solutions/pharmacy-software',
  },
  {
    label: 'Business Operations',
    desc: 'ERP · Workflow · Inventory · Reporting',
    href: '/solutions/erp-automation',
  },
]

const navItems = [
  { label: 'Products',     href: '/#portfolio'    },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'About',        href: '/#leadership'   },
  { label: 'Contact',      href: '/#contact'      },
]

/* ─── Solutions dropdown ─────────────────────────────────────────── */
function SolutionsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-[13px] font-medium text-[#0B1F3A]/52 hover:text-[#0B1F3A] transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Solutions
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-3 w-[240px] rounded-xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(11,31,58,0.1)] overflow-hidden"
          >
            {solutionItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 px-4 py-3.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
              >
                <span className="text-[13px] font-semibold text-[#0B1F3A]">{item.label}</span>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Header ─────────────────────────────────────────────────────── */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
    setMobileOpen(false)
  }, [pathname, hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_rgba(11,31,58,0.08),0_4px_24px_rgba(11,31,58,0.05)]' : 'border-b border-slate-100'
      }`}
    >
      <Container>
        <div className="flex h-[64px] items-center justify-between">

          {/* Brand mark + name */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            {/* Geometric mark — two stacked lines */}
            <div className="flex flex-col gap-[4px] flex-none">
              <div className="h-[2px] w-5 bg-[#0B1F3A] rounded-full transition-all duration-300 group-hover:w-6" />
              <div className="h-[2px] w-3 bg-[#0B1F3A]/35 rounded-full transition-all duration-300 group-hover:w-5" />
            </div>
            <span className="text-[12.5px] font-bold tracking-[0.15em] text-[#0B1F3A] uppercase leading-none">
              Aadhirai<span className="text-[#0B1F3A]/35 font-normal mx-1.5">·</span>Innovations
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            className="rounded-md p-2 text-[#0B1F3A]/60 hover:text-[#0B1F3A] hover:bg-slate-50 transition-colors lg:hidden"
            onClick={() => setIsMenuOpen(v => !v)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            <SolutionsDropdown />

            <Link
              to="/products/medora-plus"
              className="text-[13px] font-medium text-[#0B1F3A]/52 hover:text-[#0B1F3A] transition-colors"
            >
              Medora+
            </Link>

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-[#0B1F3A]/52 hover:text-[#0B1F3A] transition-colors"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/#contact"
              className="rounded-sm bg-[#0B1F3A] px-5 py-2.5 text-[12.5px] font-semibold text-white tracking-[0.04em] transition-all hover:bg-[#173762]"
            >
              Talk to us
            </a>
          </nav>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              aria-label="Mobile primary"
              className="overflow-hidden border-t border-slate-100 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-0.5 pb-5 pt-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(v => !v)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] font-medium text-[#0B1F3A]/70 hover:bg-slate-50 transition-colors"
                >
                  Solutions
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
                </button>

                <AnimatePresence>
                  {mobileSolutionsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      {solutionItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex flex-col gap-0.5 rounded-md px-5 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-[13px] font-semibold text-[#0B1F3A]">{item.label}</span>
                          <span className="text-[11px] text-slate-400">{item.desc}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  to="/products/medora-plus"
                  className="rounded-md px-3 py-2.5 text-[13px] font-medium text-[#0B1F3A]/70 hover:bg-slate-50 hover:text-[#0B1F3A] transition-colors"
                >
                  Medora+
                </Link>

                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-md px-3 py-2.5 text-[13px] font-medium text-[#0B1F3A]/70 hover:bg-slate-50 hover:text-[#0B1F3A] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/#contact"
                  className="mt-2 rounded-sm bg-[#0B1F3A] px-3 py-3 text-[13px] font-semibold text-white tracking-wide text-center transition-colors hover:bg-[#173762]"
                >
                  Talk to us
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}

export default Header
