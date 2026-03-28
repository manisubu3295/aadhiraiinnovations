import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'

const solutionItems = [
  {
    label: 'Pharmacy Software',
    desc: 'Medora+ · GST billing · AI stock forecasting',
    href: '/solutions/pharmacy-software',
  },
  {
    label: 'ERP & Automation',
    desc: 'Custom ERP · workflow automation · analytics',
    href: '/solutions/erp-automation',
  },
]

const navItems = [
  { label: 'Process',   href: '/#approach' },
  { label: 'Overview',  href: '/#video'    },
  { label: 'Contact',   href: '/#contact'  },
]

/* ─── Solutions dropdown ─────────────────────────────────────── */
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
        className="flex items-center gap-1 px-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Solutions
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {solutionItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-[#0B1F3A]">{item.label}</span>
                <span className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Header ─────────────────────────────────────────────────── */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
    setMobileOpen(false)
  }, [pathname, hash])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link
            to="/"
            className="max-w-[72%] truncate text-xs font-semibold tracking-[0.1em] text-[#0B1F3A] sm:max-w-none sm:text-base sm:tracking-[0.13em]"
          >
            AADHIRAI INNOVATIONS
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="rounded-md border border-slate-200 p-2.5 text-[#0B1F3A] transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMenuOpen(v => !v)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            <SolutionsDropdown />

            <Link
              to="/products/medora-plus"
              className="px-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
            >
              Medora+
            </Link>

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/#contact"
              className="rounded-sm bg-[#0B1F3A] px-5 py-2.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
            >
              Discuss Business
            </a>
          </nav>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile primary"
              className="overflow-hidden border-t border-slate-100 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-1 pb-5 pt-4">

                {/* Solutions accordion on mobile */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(v => !v)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Solutions
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileSolutionsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {solutionItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex flex-col gap-0.5 rounded-md px-5 py-2 transition-colors hover:bg-slate-50"
                        >
                          <span className="text-sm font-semibold text-[#0B1F3A]">{item.label}</span>
                          <span className="text-[11px] text-slate-400">{item.desc}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  to="/products/medora-plus"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0B1F3A]"
                >
                  Medora+
                </Link>

                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0B1F3A]"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/#contact"
                  className="mt-2 rounded-sm bg-[#0B1F3A] px-3 py-2.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
                >
                  Discuss Business
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
