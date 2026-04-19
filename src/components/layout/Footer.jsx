import { useEffect } from 'react'
import Container from '../ui/Container'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Footer() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Aadhirai Innovations',
      'url': 'https://aadhiraiinnovations.com',
      'logo': 'https://aadhiraiinnovations.com/logo.png',
      'description': 'Business software built for pharmacies, schools, and serious daily operations.',
      'sameAs': [
        'https://www.linkedin.com/company/aadhirai-innovations',
        'https://twitter.com/aadhirai',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Customer Support',
        'telephone': '+91-8508716957',
        'email': 'info@aadhiraiinnovations.com',
        'areaServed': 'IN',
        'availableLanguage': ['en', 'ta'],
      },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Peravurani & Chennai',
        'addressRegion': 'Tamil Nadu',
        'addressCountry': 'IN',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'organization')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  return (
    <footer className="bg-white">

      {/* ── Brand statement — editorial, not a widget ──────────────────── */}
      <div className="border-t border-slate-100 pt-16 md:pt-20 pb-12 md:pb-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-slate-400 mb-7">
                Aadhirai Innovations
              </p>
              <p
                className="font-semibold text-[#0B1F3A] leading-[1.22] tracking-[-0.025em] max-w-[22ch]"
                style={{ fontSize: 'clamp(1.55rem, 2.6vw, 2.2rem)' }}
              >
                Business software built for pharmacies, schools,
                and serious daily operations.
              </p>
            </div>

            <a
              href="/#contact"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A] self-end border-b-2 border-[#0B1F3A]/18 pb-0.5 hover:border-[#0B1F3A] transition-colors whitespace-nowrap"
            >
              Start a conversation
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>
        </Container>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 py-10 md:py-12">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {/* Solutions */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">
                Solutions
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'Pharmacy Software', href: '/solutions/pharmacy-software', router: true },
                  { label: 'Business Operations', href: '/solutions/erp-automation', router: true },
                  { label: 'Medora+', href: '/products/medora-plus', router: true },
                ].map(({ label, href, router }) => (
                  <li key={label}>
                    {router
                      ? <Link to={href} className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">{label}</Link>
                      : <a href={href} className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">{label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">
                Company
              </p>
              <ul className="space-y-3">
                <li><Link to="/founder" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">About us</Link></li>
                <li><a href="/#portfolio" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Products</a></li>
                <li><a href="/#testimonials" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Client feedback</a></li>
                <li><a href="/#contact" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">
                Free Tools
              </p>
              <ul className="space-y-3">
                <li><Link to="/tools" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">All Tools</Link></li>
                <li><Link to="/tools/gst-calculator" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">GST Calculator</Link></li>
                <li><Link to="/tools/docx-to-pdf-converter" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">DOCX to PDF</Link></li>
                <li><Link to="/tools/pdf-to-docx-converter" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">PDF to DOCX</Link></li>
                <li><Link to="/tools/pdf-editor" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">PDF Editor</Link></li>
              </ul>
            </div>

            {/* Reach us */}
            <div className="lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">
                Reach us
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://wa.me/918508716957"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors"
                >
                  +91 8508716957 · India
                </a>
                <a
                  href="https://wa.me/6590356479"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors"
                >
                  +65 90356479 · International
                </a>
                <a
                  href="mailto:info@aadhiraiinnovations.com"
                  className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors sm:col-span-2"
                >
                  info@aadhiraiinnovations.com
                </a>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* ── Legal ─────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 py-5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-slate-400">
              © {new Date().getFullYear()} Aadhirai Innovations. All rights reserved.
            </p>
            <p className="text-[11.5px] text-slate-400">
              Peravurani & Chennai, Tamil Nadu · Serving globally
            </p>
          </div>
        </Container>
      </div>

    </footer>
  )
}

export default Footer
