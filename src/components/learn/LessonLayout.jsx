import Container from '../ui/Container'
import Breadcrumbs from '../ui/Breadcrumbs'
import LessonNav from './LessonNav'

export default function LessonLayout({ children, breadcrumbItems, prev, next }) {
  return (
    <div className="bg-white">
      {/* Breadcrumb bar */}
      <div className="border-b border-slate-100 bg-slate-50">
        <Container>
          <div className="py-4">
            <Breadcrumbs items={breadcrumbItems} isDark={false} />
          </div>
        </Container>
      </div>

      {/* Main content */}
      <Container>
        <div className="max-w-4xl mx-auto py-12 md:py-16">
          {children}

          {/* Lesson navigation */}
          <LessonNav prev={prev} next={next} />
        </div>
      </Container>
    </div>
  )
}
