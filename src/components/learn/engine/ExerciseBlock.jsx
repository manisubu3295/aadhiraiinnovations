import { useState } from 'react'
import { motion } from 'framer-motion'
import PredictOutputExercise from '../exercises/PredictOutputExercise'
import FillInCodeExercise from '../exercises/FillInCodeExercise'
import ChooseComplexityExercise from '../exercises/ChooseComplexityExercise'
import FixTheBugExercise from '../exercises/FixTheBugExercise'
import FeedbackCard from './FeedbackCard'

const exerciseComponents = {
  'predict-output': PredictOutputExercise,
  'fill-in-code': FillInCodeExercise,
  'choose-complexity': ChooseComplexityExercise,
  'fix-the-bug': FixTheBugExercise,
}

export default function ExerciseBlock({ exercise, onComplete }) {
  const [submitted, setSubmitted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const ExerciseComponent = exerciseComponents[exercise.exerciseType]

  if (!ExerciseComponent) {
    return <div className="text-red-500">Unknown exercise type: {exercise.exerciseType}</div>
  }

  const isCorrect = selectedAnswer === exercise.expectedAnswer

  const getFeedback = () => {
    if (isCorrect) {
      return {
        variant: 'correct',
        title: exercise.correctFeedback?.title || '✓ Correct!',
        body: exercise.correctFeedback?.body || 'Great work!',
        reinforcement: exercise.correctFeedback?.reinforcement,
        suggestion: exercise.correctFeedback?.suggestion,
      }
    } else {
      const specificFeedback = exercise.wrongAnswerFeedback?.[selectedAnswer]
      return {
        variant: 'wrong',
        title: specificFeedback?.title || '❌ Not quite',
        hint: specificFeedback?.hint,
        body: specificFeedback?.body || 'Think again about the problem.',
        misconception: specificFeedback?.misconception,
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border-2 p-8 transition-all ${
        submitted
          ? isCorrect
            ? 'border-green-300 bg-green-50'
            : 'border-amber-300 bg-amber-50'
          : 'border-amber-300 bg-white'
      }`}
    >
      {/* Exercise heading */}
      <h3 className="text-2xl font-bold text-[#0B1F3A] mb-6">{exercise.heading}</h3>

      {/* Exercise component */}
      {!submitted ? (
        <ExerciseComponent
          {...exercise}
          onSubmit={(answer) => {
            setSelectedAnswer(answer)
            setSubmitted(true)
            onComplete?.(exercise.id, answer === exercise.expectedAnswer)
          }}
        />
      ) : (
        <>
          {/* Show exercise again in readonly (for predict output) */}
          {exercise.exerciseType === 'predict-output' && (
            <div className="mb-8 opacity-75">
              <ExerciseComponent {...exercise} onSubmit={() => {}} />
            </div>
          )}

          {/* Feedback card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <FeedbackCard
              {...getFeedback()}
              onDismiss={() => {
                setSubmitted(false)
                setSelectedAnswer(null)
              }}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
