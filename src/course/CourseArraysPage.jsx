import { useState, useEffect } from 'react'
import CourseLayout from './components/CourseLayout'
import CourseHeader from './components/CourseHeader'
import SidebarNav from './components/SidebarNav'
import ContextPanel from './components/ContextPanel'
import StepEngine from './components/StepEngine'
import { arraysSteps, lessonMeta } from './data/arraysSteps'

export default function CourseArraysPage() {
  const [currentStepId, setCurrentStepId] = useState(arraysSteps[0].id)
  const [completedStepIds, setCompletedStepIds] = useState(new Set())
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const currentStep = arraysSteps.find(s => s.id === currentStepId)

  useEffect(() => {
    document.title = `${lessonMeta.title} - Interactive Course`
  }, [])

  const handleStepChange = (stepId, index, completed) => {
    setCurrentStepId(stepId)
    setCurrentStepIndex(index)
    setCompletedStepIds(completed)
  }

  const handleStepClick = (stepId) => {
    const index = arraysSteps.findIndex(s => s.id === stepId)
    if (index >= 0) {
      setCurrentStepId(stepId)
      setCurrentStepIndex(index)
    }
  }

  return (
    <CourseLayout
      header={<CourseHeader lessonTitle={lessonMeta.title} currentStep={currentStepIndex + 1} totalSteps={arraysSteps.length} />}
      sidebar={<SidebarNav currentStepId={currentStepId} completedStepIds={completedStepIds} onStepClick={handleStepClick} />}
      context={<ContextPanel hint={currentStep?.hint} keyInsights={completedStepIds.size > 0 ? arraysSteps.slice(0, currentStepIndex).reduce((acc, s) => [...acc, ...(s.keyInsights || [])], []) : null} commonMistake={currentStep?.commonMistake} isExercise={currentStep?.type === 'exercise'} />}
    >
      <StepEngine onStepChange={handleStepChange} onExerciseComplete={(id, correct) => { if (correct) setCompletedStepIds(prev => new Set([...prev, id])) }} />
    </CourseLayout>
  )
}
