import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * DragArrangeExercise — student clicks to build the correct order.
 * (Click-to-arrange; no drag-and-drop library dependency.)
 *
 * Data format:
 * {
 *   prompt: string,
 *   items: ['item1', 'item2', 'item3', ...],   // shuffled
 *   correctOrder: ['item2', 'item1', 'item3'], // expected sequence
 *   hint: string,
 * }
 */
export default function DragArrangeExercise({ prompt, items, correctOrder, hint, onSubmit }) {
  const [pool, setPool] = useState([...items])
  const [arranged, setArranged] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const isCorrect = submitted &&
    arranged.length === correctOrder.length &&
    arranged.every((item, i) => item === correctOrder[i])

  const handleAddItem = (item) => {
    if (submitted) return
    setPool(prev => prev.filter(i => i !== item))
    setArranged(prev => [...prev, item])
  }

  const handleRemoveItem = (item) => {
    if (submitted) return
    setArranged(prev => prev.filter(i => i !== item))
    setPool(prev => [...prev, item])
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const correct = arranged.length === correctOrder.length &&
      arranged.every((item, i) => item === correctOrder[i])
    onSubmit(correct)
  }

  const handleReset = () => {
    setPool([...items])
    setArranged([])
    setSubmitted(false)
  }

  return (
    <div className="space-y-5">
      {prompt && <p className="text-[15px] text-slate-600">{prompt}</p>}

      {/* Arranged sequence (target zone) */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Your Order
        </p>
        <div className="min-h-[56px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 flex flex-wrap gap-2 items-center">
          {arranged.length === 0 && (
            <span className="text-xs text-slate-400 italic">Click items below to add them here</span>
          )}
          {arranged.map((item, idx) => {
            const itemCorrect = submitted && item === correctOrder[idx]
            const itemWrong = submitted && item !== correctOrder[idx]
            return (
              <motion.button
                key={`arranged-${idx}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleRemoveItem(item)}
                disabled={submitted}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                  border transition-colors
                  ${submitted
                    ? itemCorrect
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : itemWrong
                        ? 'border-red-400 bg-red-50 text-red-800'
                        : 'border-slate-200 bg-white text-slate-700'
                    : 'border-[#0B1F3A]/30 bg-[#0B1F3A]/5 text-[#0B1F3A] hover:bg-[#0B1F3A]/10 cursor-pointer'
                  }
                `}
              >
                <span className="text-[10px] font-bold text-current/50">{idx + 1}</span>
                {item}
                {!submitted && <span className="text-[10px] text-slate-400">×</span>}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Available items (pool) */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Available Items
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((item) => (
            <motion.button
              key={`pool-${item}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={!submitted ? { scale: 0.95 } : {}}
              transition={{ duration: 0.15 }}
              onClick={() => handleAddItem(item)}
              disabled={submitted}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              {item}
            </motion.button>
          ))}
          {pool.length === 0 && !submitted && (
            <span className="text-xs text-slate-400 italic">All items placed</span>
          )}
        </div>
      </div>

      {/* Hint */}
      {hint && (
        <button
          onClick={() => setShowHint(v => !v)}
          className="text-xs font-semibold text-slate-500 hover:text-[#0B1F3A] transition-colors"
        >
          {showHint ? 'Hide hint ↑' : 'Show hint ↓'}
        </button>
      )}
      {showHint && hint && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-[13px] text-slate-600">{hint}</p>
        </div>
      )}

      {/* Correct order reveal on submit */}
      {submitted && !isCorrect && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Correct Order
          </p>
          <div className="flex flex-wrap gap-2">
            {correctOrder.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-300 bg-emerald-50 text-emerald-800">
                <span className="text-[10px] font-bold text-emerald-600">{i + 1}</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={arranged.length !== correctOrder.length}
          className="w-full py-2.5 rounded-lg bg-[#0B1F3A] text-sm font-semibold text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Order
        </button>
      ) : (
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
