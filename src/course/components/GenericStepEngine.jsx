import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import StepCard from './StepCard'
// steps passed as prop
import PredictOutputExercise from '../../components/learn/exercises/PredictOutputExercise'
import FillInCodeExercise from '../../components/learn/exercises/FillInCodeExercise'
import ChooseComplexityExercise from '../../components/learn/exercises/ChooseComplexityExercise'
import FixTheBugExercise from '../../components/learn/exercises/FixTheBugExercise'
import FeedbackCard from '../../components/learn/engine/FeedbackCard'
import ArrayVisual from '../../components/learn/visuals/ArrayVisual'
import CodeBlock from '../../components/learn/CodeBlock'

const exerciseComponents = {
  'predict-output': PredictOutputExercise,
  'fill-in-code': FillInCodeExercise,
  'choose-complexity': ChooseComplexityExercise,
  'fix-the-bug': FixTheBugExercise,
}

export default function GenericStepEngine({ steps, onStepChange, onExerciseComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [exerciseAttempts, setExerciseAttempts] = useState({})
  const [showAnswer, setShowAnswer] = useState({})
  const [exerciseFeedback, setExerciseFeedback] = useState(null)
  const [waitForDelay, setWaitForDelay] = useState(false)

  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1
  const isExerciseStep = currentStep.type === 'exercise'

  useEffect(() => {
    onStepChange?.(currentStep.id, stepIndex, completedSteps)
  }, [stepIndex, completedSteps, currentStep])

  useEffect(() => {
    if (!isExerciseStep && stepIndex > 0) {
      setWaitForDelay(true)
      const timer = setTimeout(() => setWaitForDelay(false), 800)
      return () => clearTimeout(timer)
    }
  }, [stepIndex, isExerciseStep])

  const handleNextStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep.id]))
    setExerciseFeedback(null)
    if (!isLastStep) setStepIndex(prev => prev + 1)
  }

  const handlePreviousStep = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1)
      setExerciseFeedback(null)
    }
  }

  const handleExerciseSubmit = (answer) => {
    const isCorrect = answer === currentStep.expectedAnswer
    const attempts = (exerciseAttempts[currentStep.id] || 0) + 1

    setExerciseAttempts(prev => ({ ...prev, [currentStep.id]: attempts }))

    if (isCorrect) {
      setExerciseFeedback({ variant: 'correct', ...currentStep.correctFeedback })
      setCompletedSteps(prev => new Set([...prev, currentStep.id]))
      onExerciseComplete?.(currentStep.id, true)
    } else if (attempts >= 2) {
      setShowAnswer(prev => ({ ...prev, [currentStep.id]: true }))
      setCompletedSteps(prev => new Set([...prev, currentStep.id]))
      onExerciseComplete?.(currentStep.id, false)
    } else {
      const specificFeedback = currentStep.wrongAnswerFeedback?.[answer]
      setExerciseFeedback({ variant: 'wrong', ...specificFeedback })
    }
  }

  const canProceed = () => {
    if (isExerciseStep && !showAnswer[currentStep.id]) {
      return completedSteps.has(currentStep.id)
    }
    return !waitForDelay
  }

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'concept':
        return (
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4 text-base">
            {currentStep.body.split('\n\n').map((para, i) => (
              <p key={i} className="whitespace-pre-wrap">{para}</p>
            ))}
          </div>
        )
      case 'visual':
        return (
          <div className="flex flex-col items-center gap-6">
            {currentStep.component === 'ArrayVisual' && <ArrayVisual {...currentStep.props} />}
            {currentStep.caption && <p className="text-center text-sm text-slate-500 italic max-w-md">{currentStep.caption}</p>}
          </div>
        )
      case 'guided':
        return (
          <div className="space-y-6">
            {currentStep.code && <CodeBlock code={currentStep.code} />}
            <div className="text-base text-slate-700 leading-relaxed">{currentStep.explanation}</div>
          </div>
        )
      case 'exercise':
        const ExerciseComponent = exerciseComponents[currentStep.exerciseType]
        return (
          <div className="space-y-6">
            {!exerciseFeedback && !showAnswer[currentStep.id] && (ExerciseComponent ? <ExerciseComponent {...currentStep} onSubmit={handleExerciseSubmit} /> : <div className="text-red-500">Unknown exercise type</div>)}
            {exerciseFeedback && <FeedbackCard {...exerciseFeedback} onDismiss={() => { if (exerciseFeedback.variant === 'correct') handleNextStep() }} />}
            {showAnswer[currentStep.id] && !exerciseFeedback && <FeedbackCard variant="correct" title="Here is the answer" body={`The correct answer is: ${currentStep.expectedAnswer}`} />}
          </div>
        )
      case 'reflection':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#0B1F3A]">Key Insights</h3>
              <ul className="space-y-2">
                {currentStep.keyInsights?.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            {currentStep.rememberedPattern && (
              <div className="p-4 bg-[#0B1F3A] text-white rounded-lg">
                <p className="text-sm italic">"{currentStep.rememberedPattern}"</p>
              </div>
            )}
          </div>
        )
      default:
        return <div>Unknown step type</div>
    }
  }

  return (
    <div className="w-full space-y-8">
      <AnimatePresence mode="wait">
        <StepCard key={currentStep.id} step={currentStep} isFirstStep={stepIndex === 0} canProceed={canProceed()} onNextClick={handleNextStep}>
          {renderStepContent()}
        </StepCard>
      </AnimatePresence>
      <div className="flex justify-between items-center text-sm text-slate-500 mt-12">
        <button onClick={handlePreviousStep} disabled={stepIndex === 0} className="px-3 py-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          ← Previous
        </button>
        <span className="font-medium">{stepIndex + 1} of {steps.length}</span>
        <div />
      </div>
    </div>
  )
}
