import { useState, useEffect } from 'react'
import CourseLayout from './CourseLayout'
import CourseHeader from './CourseHeader'
import SidebarNav from './SidebarNav'
import ContextPanel from './ContextPanel'
import GenericStepEngine from './GenericStepEngine'

/**
 * Reusable course page shell for any DSA topic.
 * Takes steps array and lessonMeta — no topic-specific code.
 */
export default function CourseLessonPage({ steps, lessonMeta }) {
  const [currentStepId, setCurrentStepId] = useState(steps[0].id)
  const [completedStepIds, setCompletedStepIds] = useState(new Set())
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const currentStep = steps.find(s => s.id === currentStepId)

  useEffect(() => {
    document.title = `${lessonMeta.title} — Interactive Course`
  }, [lessonMeta.title])

  const handleStepChange = (stepId, index, completed) => {
    setCurrentStepId(stepId)
    setCurrentStepIndex(index)
    setCompletedStepIds(new Set(completed))
  }

  const handleStepClick = (stepId) => {
    const index = steps.findIndex(s => s.id === stepId)
    if (index >= 0) {
      setCurrentStepId(stepId)
      setCurrentStepIndex(index)
    }
  }

  const accumulatedInsights = steps
    .slice(0, currentStepIndex)
    .reduce((acc, s) => [...acc, ...(s.keyInsights || [])], [])

  return (
    <CourseLayout
      header={
        <CourseHeader
          lessonTitle={lessonMeta.title}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
        />
      }
      sidebar={
        <GenericSidebar
          steps={steps}
          lessonMeta={lessonMeta}
          currentStepId={currentStepId}
          completedStepIds={completedStepIds}
          onStepClick={handleStepClick}
        />
      }
      context={
        <ContextPanel
          hint={currentStep?.hint}
          keyInsights={accumulatedInsights.length > 0 ? accumulatedInsights : null}
          commonMistake={currentStep?.commonMistake}
          isExercise={currentStep?.type === 'exercise'}
        />
      }
    >
      <GenericStepEngine
        steps={steps}
        onStepChange={handleStepChange}
        onExerciseComplete={(id, correct) => {
          if (correct) setCompletedStepIds(prev => new Set([...prev, id]))
        }}
      />
    </CourseLayout>
  )
}

// Inline generic sidebar (no hardcoded lesson data)
import { motion } from 'framer-motion'

function GenericSidebar({ steps, lessonMeta, currentStepId, completedStepIds, onStepClick }) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStepId)
  const completedCount = completedStepIds.size

  const getStatus = (idx) => {
    if (idx < currentStepIndex) return 'completed'
    if (idx === currentStepIndex) return 'current'
    return 'locked'
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-base font-bold text-[#0B1F3A] mb-0.5">{lessonMeta.title}</h2>
        <p className="text-xs text-slate-500 font-medium mb-3">{lessonMeta.badge}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Progress</span>
            <span className="text-slate-500">{completedCount} / {steps.length}</span>
          </div>
          <div className="w-full h-[3px] bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-[#0B1F3A]"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {lessonMeta.sections?.map(section => (
          <div key={section.name} className="border-b border-slate-100 last:border-0">
            <div className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {section.name}
            </div>
            <div className="space-y-1 pb-2">
              {section.steps.map(stepId => {
                const step = steps.find(s => s.id === stepId)
                if (!step) return null
                const idx = steps.findIndex(s => s.id === stepId)
                const status = getStatus(idx)
                const isLocked = status === 'locked'
                const icon = status === 'completed' ? '●' : status === 'current' ? '▶' : '○'
                return (
                  <motion.button
                    key={stepId}
                    onClick={() => !isLocked && onStepClick(stepId)}
                    disabled={isLocked}
                    whileHover={!isLocked ? { x: 3 } : {}}
                    className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-all
                      ${status === 'current' ? 'bg-[#0B1F3A]/5 border border-[#0B1F3A]/20 text-[#0B1F3A]' : ''}
                      ${status === 'completed' ? 'text-slate-600 hover:bg-slate-50' : ''}
                      ${status === 'locked' ? 'text-slate-400 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5">{icon}</span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 leading-none mb-0.5 uppercase tracking-wide">
                          {step.badge?.split(' ').slice(1).join(' ')}
                        </div>
                        <div className="font-medium leading-tight truncate text-xs">{step.heading}</div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-100 text-xs text-slate-400 flex-shrink-0 bg-slate-50">
        Complete each step to unlock the next
      </div>
    </div>
  )
}
