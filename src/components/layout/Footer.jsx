import Container from '../ui/Container'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12 md:py-14">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#0B1F3A] uppercase">
              Aadhirai Innovations
            </p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-powered intelligence systems for pharmacies, enterprise operations, and serious businesses across India and globally.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Peravurani & Chennai, Tamil Nadu, India
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <a href="/#build" className="hover:text-[#0B1F3A] transition-colors">
                  Solutions
                </a>
              </li>
              <li>
                <a href="/#products" className="hover:text-[#0B1F3A] transition-colors">
                  Medora+
                </a>
              </li>
              <li>
                <a href="/#approach" className="hover:text-[#0B1F3A] transition-colors">
                  Process
                </a>
              </li>
              <li>
                <Link to="/founder" className="hover:text-[#0B1F3A] transition-colors">
                  Founder
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <a
                  href="https://wa.me/918508716957"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0B1F3A] transition-colors"
                >
                  +91 8508716957 (India)
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6590356479"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0B1F3A] transition-colors"
                >
                  +65 90356479 (Singapore)
                </a>
              </li>
              <li className="break-all">
                <a
                  href="mailto:info@aadhiraiinnovations.com"
                  className="hover:text-[#0B1F3A] transition-colors"
                >
                  info@aadhiraiinnovations.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Aadhirai Innovations. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Enterprise Systems & Automation · Tamil Nadu, India
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
