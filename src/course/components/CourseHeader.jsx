import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function CourseHeader({
  lessonTitle,
  currentStep,
  totalSteps,
  onBackClick,
}) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="h-14 px-4 lg:px-8 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
      {/* Left: Back button */}
      <Link
        to="/learn/java-dsa"
        className="flex items-center gap-1 text-sm font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] transition-colors whitespace-nowrap"
      >
        <ChevronLeft className="h-4 w-4" />
        Java DSA
      </Link>

      {/* Center: Lesson title */}
      <div className="flex-1 text-center">
        <h1 className="text-sm font-semibold text-[#0B1F3A] truncate">
          {lessonTitle}
        </h1>
      </div>

      {/* Right: Progress */}
      <div className="flex items-center gap-3 whitespace-nowrap">
        <div className="hidden sm:flex items-center gap-2">
          {/* Progress dots */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalSteps, 11) }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i < currentStep ? 'bg-[#0B1F3A]' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  )
}
