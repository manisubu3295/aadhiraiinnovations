import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function LessonNav({ prev, next }) {
  return (
    <div className="border-t border-slate-200 pt-8 mt-12 flex items-center justify-between gap-4">
      {/* Previous Lesson */}
      {prev ? (
        <Link
          to={prev.href}
          className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-[#0B1F3A] group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          <span>{prev.label}</span>
        </Link>
      ) : (
        <div />
      )}

      {/* Next Lesson */}
      {next ? (
        next.available ? (
          <Link
            to={next.href}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors text-sm font-medium group"
          >
            <span>{next.label}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">{next.label}</span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">Coming Soon</span>
          </div>
        )
      ) : (
        <div />
      )}
    </div>
  )
}
