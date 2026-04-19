import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'

/* ─── Navigation structure ───────────────────────────────────────────── */
const NAV = [
  {
    key: 'solutions',
    label: 'Solutions',
    groups: [
      {
        items: [
          { label: 'Pharmacy Software', desc: 'Billing · Stock · GST · Expiry alerts', href: '/solutions/pharmacy-software' },
          { label: 'Business Operations', desc: 'ERP · Workflow · Inventory · Reporting', href: '/solutions/erp-automation' },
        ],
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    groups: [
      {
        items: [
          { label: 'Medora+', desc: 'AI pharmacy management system', href: '/products/medora-plus' },
          { label: 'Invoice Generator', desc: 'Create GST invoices, print, save', href: '/invoice-generator' },
          { label: 'Quotation Builder', desc: 'Generate quotations, print, save', href: '/quotation-builder' },
        ],
      },
    ],
  },
  {
    key: 'learn',
    label: 'Learn',
    groups: [
      {
        items: [
          { label: 'All Courses', desc: 'Browse all learning paths', href: '/learn' },
          { label: 'Java DSA', desc: 'Data structures & algorithms in Java', href: '/learn/java-dsa' },
          { label: 'Arrays', desc: 'Interactive guided lesson', href: '/learn/java-dsa/arrays' },
          { label: 'Linked Lists', desc: 'Nodes, pointers, reversal', href: '/learn/java-dsa/linked-list' },
          { label: 'Stacks', desc: 'LIFO — balanced brackets, undo ops', href: '/learn/java-dsa/stack' },
          { label: 'Queues', desc: 'FIFO — BFS, job scheduling', href: '/learn/java-dsa/queue' },
          { label: 'Binary Search', desc: 'O(log n) search on sorted data', href: '/learn/java-dsa/binary-search' },
          { label: 'Recursion', desc: 'Call stack, base case, memoization', href: '/learn/java-dsa/recursion' },
        ],
      },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    groups: [
      {
        heading: 'Free Tools',
        items: [
          { label: 'GST Calculator', desc: 'Add/remove GST, CGST/SGST/IGST', href: '/tools/gst-calculator' },
          { label: 'DOCX to PDF', desc: 'Convert Word to PDF', href: '/tools/docx-to-pdf-converter' },
          { label: 'PDF to DOCX', desc: 'Extract text, create Word docs', href: '/tools/pdf-to-docx-converter' },
          { label: 'PDF Editor', desc: 'Rotate, delete, reorder pages', href: '/tools/pdf-editor' },
        ],
      },
      {
        heading: 'Business Tools',
        items: [
          { label: 'Invoice Generator', desc: 'GST-ready invoices', href: '/invoice-generator' },
          { label: 'Quotation Builder', desc: 'Professional quotations', href: '/quotation-builder' },
        ],
      },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    groups: [
      {
        items: [
          { label: 'About', desc: 'Our story and founder', href: '/founder' },
          { label: 'Client Feedback', desc: 'See what our clients say', href: '/#testimonials', isAnchor: true },
          { label: 'Contact', desc: 'Start a conversation', href: '/#contact', isAnchor: true },
        ],
      },
    ],
  },
]

/* ─── Generic dropdown component ─────────────────────────────────────── */
function NavDropdown({ label, groups }) {
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
        className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] whitespace-nowrap transition-colors duration-150"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
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
            className="absolute left-0 top-full mt-3 min-w-[240px] rounded-xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(11,31,58,0.1)] overflow-hidden z-50"
          >
            {groups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {group.heading && (
                  <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {group.heading}
                  </div>
                )}
                {group.items.map((item) => {
                  const ItemComponent = item.isAnchor ? 'a' : Link
                  const itemProps = item.isAnchor ? { href: item.href } : { to: item.href }
                  return (
                    <ItemComponent
                      key={item.href}
                      {...itemProps}
                      onClick={() => setOpen(false)}
                      className="flex flex-col gap-0.5 px-4 py-3.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-[#0B1F3A]">{item.label}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </ItemComponent>
                  )
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Header ─────────────────────────────────────────────────────────── */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenMobile(null)
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
        <div className="flex h-[64px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col gap-[4px] flex-none">
              <div className="h-[2px] w-5 bg-[#0B1F3A] rounded-full transition-all duration-300 group-hover:w-6" />
              <div className="h-[2px] w-3 bg-[#0B1F3A]/35 rounded-full transition-all duration-300 group-hover:w-5" />
            </div>
            <span className="text-[12.5px] font-bold tracking-[0.15em] text-[#0B1F3A] uppercase leading-none whitespace-nowrap">
              Aadhirai<span className="text-[#0B1F3A]/35 font-normal mx-1.5">·</span>Innovations
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {NAV.map((item) => (
              <NavDropdown key={item.key} label={item.label} groups={item.groups} />
            ))}
          </nav>

          {/* Right side: CTA + Mobile toggle */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="/#contact"
              className="hidden lg:inline-flex rounded-md bg-[#0B1F3A] px-5 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-[#173762] whitespace-nowrap"
            >
              Get in Touch
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
              className="rounded-md p-2 text-[#0B1F3A]/60 hover:text-[#0B1F3A] hover:bg-slate-50 transition-colors lg:hidden"
              onClick={() => setIsMenuOpen(v => !v)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              aria-label="Mobile navigation"
              className="overflow-hidden border-t border-slate-100 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-0.5 py-3 px-1">
                {NAV.map((navItem) => (
                  <div key={navItem.key}>
                    {/* Accordion toggle button */}
                    <button
                      type="button"
                      onClick={() => setOpenMobile(openMobile === navItem.key ? null : navItem.key)}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 w-full text-[13px] font-medium text-[#0B1F3A]/70 hover:bg-slate-50 transition-colors"
                    >
                      {navItem.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openMobile === navItem.key ? 'rotate-180' : ''
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>

                    {/* Accordion items */}
                    <AnimatePresence>
                      {openMobile === navItem.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-0.5 pl-3 py-1">
                            {navItem.groups.map((group, groupIdx) => (
                              <div key={groupIdx}>
                                {group.items.map((item) => {
                                  const ItemComponent = item.isAnchor ? 'a' : Link
                                  const itemProps = item.isAnchor ? { href: item.href } : { to: item.href }
                                  return (
                                    <ItemComponent
                                      key={item.href}
                                      {...itemProps}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="flex flex-col gap-0.5 px-3 py-2 hover:bg-slate-50 rounded-md transition-colors"
                                    >
                                      <span className="text-[12px] font-semibold text-[#0B1F3A]">{item.label}</span>
                                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                                    </ItemComponent>
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Mobile CTA */}
                <a
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-md bg-[#0B1F3A] px-3 py-3 text-[13px] font-semibold text-white text-center transition-colors hover:bg-[#173762] w-full"
                >
                  Get in Touch
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
