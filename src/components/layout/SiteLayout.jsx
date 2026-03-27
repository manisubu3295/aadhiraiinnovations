import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

function SiteLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  useEffect(() => {
    if (pathname === '/founder') {
      document.title = 'Founder | AADHIRAI INNOVATIONS'
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          'content',
          'Founder note from AADHIRAI INNOVATIONS on building reliable enterprise-grade SaaS and business systems.',
        )
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Founder | AADHIRAI INNOVATIONS')
      document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute(
          'content',
          'Founder note from AADHIRAI INNOVATIONS on building reliable enterprise-grade SaaS and business systems.',
        )
      return
    }

    document.title = 'AADHIRAI INNOVATIONS | AI-Powered Intelligence Systems'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Aadhirai Innovations builds AI-powered intelligence systems, SaaS platforms, and enterprise software for pharmacies and serious businesses across India.',
      )
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', 'AADHIRAI INNOVATIONS | AI-Integrated Enterprise Systems')
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute(
        'content',
        'AI-powered intelligence systems and enterprise platforms built for serious operations.',
      )
  }, [pathname])

  return (
    <div className="min-h-screen bg-white text-[#0B1F3A]">
      <Header />
      <main>
        <Outlet />
      </main>
      <a
        href="https://wa.me/918508716957"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.3} />
      </a>
      <Footer />
    </div>
  )
}

export default SiteLayout
