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
      'description': 'Senior backend architecture services for growth-stage software companies.',
      'sameAs': [
        'https://www.linkedin.com/company/aadhirai-innovations',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Sales',
        'email': 'info@aadhiraiinnovations.com',
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

      {/* ── Brand statement ──────────────────────────────────────────────── */}
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
                Backend architecture for
                growth-stage software companies.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A] self-end border-b-2 border-[#0B1F3A]/18 pb-0.5 hover:border-[#0B1F3A] transition-colors whitespace-nowrap"
            >
              Start a conversation
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 py-10 md:py-12">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {/* Services */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">Services</p>
              <ul className="space-y-3">
                <li><Link to="/services#audit"       className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Production Readiness Audit</Link></li>
                <li><Link to="/services#retainer"    className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Architecture Advisory Retainer</Link></li>
                <li><Link to="/services#engineering" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Fixed-Scope Engineering</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">Company</p>
              <ul className="space-y-3">
                <li><Link to="/about"   className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Contact</Link></li>
                <li><Link to="/portal/login" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Client Portal</Link></li>
                <li><Link to="/admin/login"  className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Team Login</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">Free Tools</p>
              <ul className="space-y-3">
                <li><Link to="/tools"                          className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">All Tools</Link></li>
                <li><Link to="/tools/gst-calculator"           className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">GST Calculator</Link></li>
                <li><Link to="/tools/docx-to-pdf-converter"    className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">DOCX to PDF</Link></li>
                <li><Link to="/tools/pdf-to-docx-converter"    className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">PDF to DOCX</Link></li>
                <li><Link to="/tools/pdf-editor"               className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">PDF Editor</Link></li>
              </ul>
            </div>

            {/* Learn + Contact */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-5">Learn</p>
              <ul className="space-y-3 mb-8">
                <li><Link to="/learn"              className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">All Courses</Link></li>
                <li><Link to="/learn/java-dsa"     className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Java DSA</Link></li>
                <li><Link to="/learn/java-dsa/arrays" className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors">Arrays</Link></li>
              </ul>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-3">Email</p>
              <a
                href="mailto:info@aadhiraiinnovations.com"
                className="text-[13.5px] text-slate-500 hover:text-[#0B1F3A] transition-colors"
              >
                info@aadhiraiinnovations.com
              </a>
            </div>

          </div>
        </Container>
      </div>

      {/* ── Legal ────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 py-5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-slate-400">
              © {new Date().getFullYear()} Aadhirai Innovations. All rights reserved.
            </p>
            <p className="text-[11.5px] text-slate-400">
              Backend architecture for growth-stage software companies.
            </p>
          </div>
        </Container>
      </div>

    </footer>
  )
}

export default Footer
