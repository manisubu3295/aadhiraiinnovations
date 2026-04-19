import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PredictOutputExercise from '../exercises/PredictOutputExercise'
import FillInCodeExercise from '../exercises/FillInCodeExercise'
import ChooseComplexityExercise from '../exercises/ChooseComplexityExercise'
import FixTheBugExercise from '../exercises/FixTheBugExercise'
import TraceExercise from '../exercises/TraceExercise'
import DragArrangeExercise from '../exercises/DragArrangeExercise'
import FeedbackCard from './FeedbackCard'

const exerciseComponents = {
  'predict-output': PredictOutputExercise,
  'fill-in-code': FillInCodeExercise,
  'choose-complexity': ChooseComplexityExercise,
  'fix-the-bug': FixTheBugExercise,
  'trace': TraceExercise,
  'drag-arrange': DragArrangeExercise,
}

const exerciseLabels = {
  'predict-output': 'Predict Output',
  'fill-in-code': 'Fill in Code',
  'choose-complexity': 'Complexity',
  'fix-the-bug': 'Fix the Bug',
  'trace': 'Trace It',
  'drag-arrange': 'Arrange',
}

export default function ExerciseBlock({ exercise, index = 1, onComplete }) {
  const [submitted, setSubmitted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const ExerciseComponent = exerciseComponents[exercise.exerciseType]
  if (!ExerciseComponent) {
    return (
      <div className="text-xs text-red-400 font-mono">
        Unknown exercise type: {exercise.exerciseType}
      </div>
    )
  }

  // trace and drag-arrange pass isCorrect boolean; others pass an answer string
  const directResultTypes = ['trace', 'drag-arrange']
  const usesDirectResult = directResultTypes.includes(exercise.exerciseType)

  const isCorrect = usesDirectResult
    ? selectedAnswer === true
    : selectedAnswer === exercise.expectedAnswer

  const getFeedback = () =>
    isCorrect
      ? {
          variant: 'correct',
          title: exercise.correctFeedback?.title || 'Correct',
          body: exercise.correctFeedback?.body || '',
          reinforcement: exercise.correctFeedback?.reinforcement,
          suggestion: exercise.correctFeedback?.suggestion,
        }
      : {
          variant: 'wrong',
          title: usesDirectResult
            ? (exercise.wrongFeedback?.title || 'Not quite right')
            : (exercise.wrongAnswerFeedback?.[selectedAnswer]?.title || 'Not quite'),
          hint: usesDirectResult
            ? exercise.wrongFeedback?.hint
            : exercise.wrongAnswerFeedback?.[selectedAnswer]?.hint,
          body: usesDirectResult
            ? (exercise.wrongFeedback?.body || '')
            : (exercise.wrongAnswerFeedback?.[selectedAnswer]?.body || ''),
          misconception: usesDirectResult
            ? exercise.wrongFeedback?.misconception
            : exercise.wrongAnswerFeedback?.[selectedAnswer]?.misconception,
        }

  const handleSubmit = (answerOrResult) => {
    setSelectedAnswer(answerOrResult)
    setSubmitted(true)
    const correct = usesDirectResult
      ? answerOrResult === true
      : answerOrResult === exercise.expectedAnswer
    onComplete?.(exercise.id, correct)
  }

  const handleRetry = () => {
    setSubmitted(false)
    setSelectedAnswer(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Exercise header */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        {/* Numbered badge */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1F3A] text-[10px] font-bold text-white flex-shrink-0">
          {index}
        </span>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block leading-none mb-0.5">
            {exerciseLabels[exercise.exerciseType] || 'Exercise'}
          </span>
          <span className="text-sm font-semibold text-[#0B1F3A]">{exercise.heading}</span>
        </div>
      </div>

      {/* Exercise body */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="exercise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExerciseComponent {...exercise} onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <FeedbackCard
                {...getFeedback()}
                onDismiss={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
