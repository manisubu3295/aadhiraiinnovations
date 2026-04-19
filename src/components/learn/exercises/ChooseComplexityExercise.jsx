import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ChooseComplexityExercise({ scenario, question, options, expectedAnswer, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selected === expectedAnswer

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
    onSubmit(selected)
  }

  const pillState = (opt) => {
    if (!submitted) return selected === opt ? 'active' : 'idle'
    if (opt === expectedAnswer) return 'correct'
    if (opt === selected && !isCorrect) return 'wrong'
    return 'dim'
  }

  const pillClass = {
    idle: 'border-slate-200 bg-white text-slate-700 hover:border-[#0B1F3A]/30 hover:bg-slate-50',
    active: 'border-[#0B1F3A] bg-[#0B1F3A] text-white',
    correct: 'border-emerald-500 bg-emerald-500 text-white',
    wrong: 'border-red-400 bg-red-400 text-white',
    dim: 'border-slate-100 bg-slate-50 text-slate-400',
  }

  return (
    <div className="space-y-5">
      {scenario && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Scenario
          </p>
          <p className="text-[14px] text-slate-700">{scenario}</p>
        </div>
      )}

      <p className="text-[15px] font-semibold text-[#0B1F3A]">{question}</p>

      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <motion.button
            key={opt}
            whileTap={!submitted ? { scale: 0.96 } : {}}
            onClick={() => !submitted && setSelected(opt)}
            disabled={submitted}
            className={`
              px-5 py-2.5 rounded-full text-sm font-bold border transition-colors duration-150
              font-mono ${pillClass[pillState(opt)]}
              ${submitted ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {opt}
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
