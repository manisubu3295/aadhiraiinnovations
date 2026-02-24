import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'

const navItems = [
  { label: 'Build', href: '/#build' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Products', href: '/#products' },
  { label: 'Video', href: '/#video' },
  { label: 'Contact', href: '/#contact' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const activeHash = hash || '#build'

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname, hash])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="max-w-[72%] truncate text-xs font-semibold tracking-[0.1em] text-[#0B1F3A] sm:max-w-none sm:text-base sm:tracking-[0.13em]">
            AADHIRAI INNOVATIONS
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="rounded-md border border-slate-200 p-2.5 text-[#0B1F3A] transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                <a
                  href={item.href}
                  className="px-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
                >
                  {item.label}
                </a>
                {pathname === '/' && activeHash === item.href.replace('/', '') ? (
                  <motion.span
                    layoutId="active-link"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-[#0B1F3A]"
                  />
                ) : null}
              </div>
            ))}
            <NavLink
              to="/founder"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-[#0B1F3A]' : 'text-slate-600 hover:text-[#0B1F3A]'}`
              }
            >
              Founder
            </NavLink>
            <a
              href="/#contact"
              className="rounded-md bg-[#0B1F3A] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
            >
              Discuss Business
            </a>
          </nav>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile primary"
              className="overflow-hidden border-t border-slate-100 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-2 pb-5 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0B1F3A]"
                  >
                    {item.label}
                  </a>
                ))}

                <NavLink
                  to="/founder"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-50 text-[#0B1F3A]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#0B1F3A]'}`
                  }
                >
                  Founder
                </NavLink>

                <a
                  href="/#contact"
                  className="mt-1 rounded-md bg-[#0B1F3A] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
                >
                  Discuss Business
                </a>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </Container>
    </header>
  )
}

export default Header
