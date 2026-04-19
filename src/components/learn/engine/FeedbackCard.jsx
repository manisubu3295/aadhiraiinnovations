import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function FeedbackCard({
  variant = 'correct',
  title,
  hint,
  body,
  reinforcement,
  suggestion,
  misconception,
  onDismiss,
}) {
  const isCorrect = variant === 'correct'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Status strip — 3px top border */}
      <div className={`h-[3px] w-full ${isCorrect ? 'bg-emerald-500' : 'bg-slate-400'}`} />

      <div className="px-5 py-5 space-y-4">
        {/* Title row */}
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
          ) : (
            <XCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          )}
          <h4 className="text-sm font-semibold text-[#0B1F3A] leading-snug">{title}</h4>
        </div>

        {/* Hint */}
        {hint && (
          <p className="text-xs font-medium text-slate-500 italic pl-8">
            {hint}
          </p>
        )}

        {/* Body */}
        {body && (
          <p className="text-[14px] leading-[1.7] text-slate-600 pl-8">{body}</p>
        )}

        {/* Reinforcement */}
        {reinforcement && (
          <div className="ml-8 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-[13px] text-slate-700">
              <span className="font-semibold text-[#0B1F3A]">Key insight: </span>
              {reinforcement}
            </p>
          </div>
        )}

        {/* Misconception */}
        {misconception && (
          <div className="ml-8 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-[13px] text-slate-700">
              <span className="font-semibold text-[#0B1F3A]">What tripped you: </span>
              {misconception}
            </p>
          </div>
        )}

        {/* Suggestion */}
        {suggestion && (
          <div className="ml-8 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-[13px] text-slate-700">
              <span className="font-semibold text-[#0B1F3A]">Go further: </span>
              {suggestion}
            </p>
          </div>
        )}

        {/* Dismiss */}
        {onDismiss && (
          <div className="pl-8">
            <button
              onClick={onDismiss}
              className="text-xs font-semibold text-slate-500 hover:text-[#0B1F3A] transition-colors underline underline-offset-2"
            >
              {isCorrect ? 'Continue' : 'Try again'} →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
