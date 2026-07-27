import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../ui/Container'

function LegalPageLayout({ title, effectiveDate, children }) {
  return (
    <article className="bg-white">
      <section className="border-b border-slate-100 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-semibold tracking-[-0.03em] text-[#0B1F3A]" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)' }}>
            {title}
          </h1>
          <p className="mt-4 text-[13px] text-slate-400">Effective {effectiveDate}</p>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <div className="space-y-10 text-[14.5px] leading-[1.85] text-slate-600 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-[#0B1F3A] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:text-[#0B1F3A] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[#0B1F3A]">
            {children}
          </div>
        </Container>
      </section>
    </article>
  )
}

export default LegalPageLayout
