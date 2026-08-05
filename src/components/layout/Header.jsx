import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Download } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'

/* ─── Navigation structure ───────────────────────────────────────────── */
const NAV = [
  {
    key: 'products',
    label: 'Products',
    groups: [
      {
        items: [
          { label: 'Medora+', desc: 'AI-powered pharmacy management, cloud-synced', href: '/products/medora-plus' },
          { label: 'Medora Offline', desc: 'Fully offline pharmacy software — one-time license, no internet needed', href: '/products/medora-offline' },
          { label: 'Aadhirai Billing', desc: 'Multi-tenant billing & inventory — free signup, isolated database per business', href: '/products/billing' },
        ],
      },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    groups: [
      {
        items: [
          { label: 'Production Readiness Audit', desc: '3-week assessment · ₹4–6 lakh · written report', href: '/services#audit' },
          { label: 'Architecture Advisory Retainer', desc: 'Monthly senior guidance as you scale', href: '/services#retainer' },
          { label: 'Fixed-Scope Engineering', desc: 'Senior implementation on a defined project', href: '/services#engineering' },
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
          { label: 'Merge PDF', desc: 'Combine multiple PDFs into one', href: '/tools/merge-pdf' },
          { label: 'Split PDF', desc: 'Split a PDF by page range', href: '/tools/split-pdf' },
          { label: 'Image to PDF', desc: 'Combine JPG/PNG images into a PDF', href: '/tools/image-to-pdf' },
          { label: 'PDF to Image', desc: 'Convert PDF pages to PNG images', href: '/tools/pdf-to-image' },
          { label: 'PDF Compressor', desc: 'Reduce PDF file size', href: '/tools/pdf-compressor' },
          { label: 'Watermark PDF', desc: 'Add a text watermark to every page', href: '/tools/watermark-pdf' },
          { label: 'Add Page Numbers', desc: 'Number every page of a PDF', href: '/tools/pdf-page-numbers' },
        ],
      },
      {
        heading: 'Developer Tools',
        items: [
          { label: 'JSON Formatter', desc: 'Format and beautify JSON', href: '/tools/json-formatter' },
          { label: 'XML Formatter', desc: 'Format and beautify XML', href: '/tools/xml-formatter' },
          { label: 'Text Formatter', desc: 'Clean, beautify, and format text', href: '/tools/text-formatter' },
          { label: 'JSON to XML', desc: 'Convert JSON data to XML', href: '/tools/json-to-xml' },
          { label: 'XML to JSON', desc: 'Convert XML data to JSON', href: '/tools/xml-to-json' },
          { label: 'Base64 Encoder/Decoder', desc: 'Encode or decode Base64', href: '/tools/base64-encoder-decoder' },
          { label: 'URL Encoder/Decoder', desc: 'Percent-encode or decode URLs', href: '/tools/url-encoder-decoder' },
          { label: 'Timestamp Converter', desc: 'Unix timestamp to date and back', href: '/tools/timestamp-converter' },
          { label: 'UUID Generator', desc: 'Generate random UUIDs (v4)', href: '/tools/uuid-generator' },
          { label: 'Case Converter', desc: 'UPPERCASE, Title Case, camelCase, and more', href: '/tools/case-converter' },
          { label: 'Word & Character Counter', desc: 'Live word/character count and reading time', href: '/tools/word-counter' },
          { label: 'JWT Decoder', desc: 'Decode a JSON Web Token header and payload', href: '/tools/jwt-decoder' },
          { label: 'Regex Tester', desc: 'Test a regex against sample text', href: '/tools/regex-tester' },
          { label: 'Text Diff Checker', desc: 'Compare two blocks of text', href: '/tools/text-diff-checker' },
          { label: 'Color Converter', desc: 'Hex, RGB, and HSL conversion', href: '/tools/color-converter' },
          { label: 'Slug Generator', desc: 'Text to clean URL slug', href: '/tools/slug-generator' },
          { label: 'Cron Expression Explainer', desc: 'Plain-English cron schedule explanation', href: '/tools/cron-explainer' },
          { label: 'Lorem Ipsum Generator', desc: 'Placeholder text for layouts', href: '/tools/lorem-ipsum-generator' },
        ],
      },
      {
        heading: 'Business Tools',
        items: [
          { label: 'Invoice/Quotation Builder', desc: 'Edit, print, and save invoices or quotations', href: '/document-builder' },
          { label: 'Amount to Words', desc: 'Convert ₹ amounts to words for invoices', href: '/tools/amount-to-words' },
          { label: 'EMI Calculator', desc: 'Loan EMI, total interest, and total payment', href: '/tools/emi-calculator' },
          { label: 'Percentage Calculator', desc: 'X% of a number, or percentage change', href: '/tools/percentage-calculator' },
          { label: 'Discount & Margin Calculator', desc: 'Discounted price, margin, and markup', href: '/tools/discount-calculator' },
          { label: 'TDS Calculator', desc: 'TDS deduction by section (194C, 194J...)', href: '/tools/tds-calculator' },
          { label: 'HSN & SAC Lookup', desc: 'Common pharmacy/retail codes and GST rates', href: '/tools/hsn-sac-lookup' },
          { label: 'Compound Interest Calculator', desc: 'Maturity value with compounding', href: '/tools/compound-interest-calculator' },
          { label: 'Simple Interest Calculator', desc: 'Interest and total amount', href: '/tools/simple-interest-calculator' },
          { label: 'SIP Calculator', desc: 'Mutual fund SIP maturity value', href: '/tools/sip-calculator' },
          { label: 'Salary / CTC Calculator', desc: 'Illustrative CTC to take-home breakup', href: '/tools/salary-ctc-calculator' },
          { label: 'GSTIN Validator', desc: 'Check GSTIN format and check-digit', href: '/tools/gstin-validator' },
          { label: 'Loan Comparison Calculator', desc: 'Compare up to 3 loan offers', href: '/tools/loan-comparison-calculator' },
        ],
      },
      {
        heading: 'SEO & Marketing',
        items: [
          { label: 'Meta Tag Generator', desc: 'Title, description, OG, and Twitter tags', href: '/tools/meta-tag-generator' },
          { label: 'Robots.txt Generator', desc: 'Build a robots.txt with sitemap reference', href: '/tools/robots-txt-generator' },
          { label: 'Open Graph Preview', desc: 'Preview how a page looks when shared', href: '/tools/open-graph-preview' },
        ],
      },
      {
        heading: 'Utilities',
        items: [
          { label: 'QR Code Generator', desc: 'Turn text or a URL into a QR code', href: '/tools/qr-code-generator' },
          { label: 'Barcode Generator', desc: 'CODE128, EAN-13, and UPC barcodes', href: '/tools/barcode-generator' },
          { label: 'Image Compressor', desc: 'Reduce image file size in your browser', href: '/tools/image-compressor' },
          { label: 'Password Generator', desc: 'Strong, random, cryptographically secure', href: '/tools/password-generator' },
          { label: 'Unit Converter', desc: 'Length, weight, temperature, volume, area', href: '/tools/unit-converter' },
          { label: 'Currency Converter', desc: 'Live exchange rates for major currencies', href: '/tools/currency-converter' },
          { label: 'Age Calculator', desc: 'Exact age in years, months, and days', href: '/tools/age-calculator' },
          { label: 'Date Difference Calculator', desc: 'Days, weeks, months between two dates', href: '/tools/date-difference-calculator' },
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
          { label: 'About', desc: 'Our story and approach', href: '/about' },
          { label: 'Case Studies', desc: 'Real client results, in their own words', href: '/case-studies' },
          { label: 'Blog', desc: 'Guides on pharmacy operations, GST, and business software', href: '/blog' },
          { label: 'Resources', desc: 'Free tools and a downloadable compliance checklist', href: '/resources' },
          { label: 'Careers', desc: 'How we hire, and our current opening', href: '/careers' },
          { label: 'Contact', desc: 'Start a conversation', href: '/contact' },
          { label: 'Forum', desc: 'Ask questions, browse answers from our community and team', href: '/forum' },
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
            className="absolute left-0 top-full mt-3 min-w-[240px] max-h-[70vh] overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(11,31,58,0.1)] z-50"
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
            <Link
              to="/pricing"
              className="text-[13.5px] font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] whitespace-nowrap transition-colors duration-150"
            >
              Pricing
            </Link>
          </nav>

          {/* Right side: CTA + Mobile toggle */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/products/medora-offline?download=1"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-[#0B1F3A]/20 px-4 py-2 text-[13px] font-semibold text-[#0B1F3A] transition-colors duration-150 hover:bg-[#0B1F3A]/5 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Download Medora
            </Link>
            <a
              href="/contact"
              className="hidden lg:inline-flex rounded-md bg-[#0B1F3A] px-5 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-[#173762] whitespace-nowrap"
            >
              Get Started
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

                {/* Pricing — plain link, not a dropdown */}
                <Link
                  to="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center rounded-md px-3 py-2.5 text-[13px] font-medium text-[#0B1F3A]/70 hover:bg-slate-50 transition-colors"
                >
                  Pricing
                </Link>

                {/* Mobile CTA */}
                <Link
                  to="/products/medora-offline?download=1"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#0B1F3A]/20 px-3 py-3 text-[13px] font-semibold text-[#0B1F3A] transition-colors hover:bg-[#0B1F3A]/5 w-full"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={2} />
                  Download Medora
                </Link>
                <a
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-md bg-[#0B1F3A] px-3 py-3 text-[13px] font-semibold text-white text-center transition-colors hover:bg-[#173762] w-full"
                >
                  Get Started
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
