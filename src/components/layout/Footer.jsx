import Container from '../ui/Container'
import { Link } from 'react-router-dom'
import { Linkedin , Instagram } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <Container className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[#0B1F3A]">AADHIRAI INNOVATIONS</p>
          <p className="mt-3 text-sm text-slate-600">Peravurani & Chennai, Tamil Nadu, India</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0B1F3A]">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="/#build" className="transition-colors hover:text-[#0B1F3A]">
                What We Build
              </a>
            </li>
            <li>
              <a href="/#products" className="transition-colors hover:text-[#0B1F3A]">
                Medora+
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0B1F3A]">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="break-words">WhatsApp: +91 8508716957 / +65 90356479</li>
            <li className="break-all">Email: info@aadhiraiinnovations.com</li>
            <li className="flex space-x-2">
              <a href="https://www.linkedin.com/in/aadhirai-innovations-1818853a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
              </a>
              <a href='https://www.instagram.com/aadhirai_innovations?igsh=MWNlN2k5NHk5bzN5YQ==' target="_blank" rel="noopener noreferrer">
                <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
              </a>
            </li>
          </ul>
        </div>

        <p className="text-xs text-slate-500 md:col-span-3">© {new Date().getFullYear()} AADHIRAI INNOVATIONS. All rights reserved.</p>
      </Container>
    </footer>
  )
}

export default Footer
