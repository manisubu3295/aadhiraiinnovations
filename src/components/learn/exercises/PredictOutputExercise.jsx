import { useState } from 'react'
import { motion } from 'framer-motion'
import CodeBlock from '../CodeBlock'

export default function PredictOutputExercise({ prompt, code, options, expectedAnswer, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selected === expectedAnswer

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
    onSubmit(selected)
  }

  const optionState = (opt) => {
    if (!submitted) return selected === opt ? 'selected' : 'idle'
    if (opt === expectedAnswer) return 'correct'
    if (opt === selected && !isCorrect) return 'wrong'
    return 'dim'
  }

  const optionClass = {
    idle: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    selected: 'border-[#0B1F3A] bg-[#0B1F3A]/5 text-[#0B1F3A]',
    correct: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    wrong: 'border-red-400 bg-red-50 text-red-800',
    dim: 'border-slate-100 bg-slate-50 text-slate-400',
  }

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-slate-600">{prompt}</p>

      <CodeBlock code={code} />

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt, idx) => (
          <motion.button
            key={opt}
            whileTap={!submitted ? { scale: 0.98 } : {}}
            onClick={() => !submitted && setSelected(opt)}
            disabled={submitted}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium
              transition-colors duration-150 text-left
              ${optionClass[optionState(opt)]}
              ${submitted ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest flex-shrink-0 w-4">
              {String.fromCharCode(65 + idx)}
            </span>
            <code className="font-mono">{opt}</code>
          </motion.button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-2.5 rounded-lg bg-[#0B1F3A] text-sm font-semibold text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      )}
    </div>
  )
}
