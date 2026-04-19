import { motion } from 'framer-motion'
import { lessonMeta, arraysSteps } from '../data/arraysSteps'

const stepTypeIcons = {
  concept: '🔷',
  visual: '🎨',
  guided: '📖',
  exercise: '📝',
  reflection: '🎓',
}

const stepTypeLabels = {
  concept: 'CONCEPT',
  visual: 'VISUAL',
  guided: 'GUIDED',
  exercise: 'YOUR TURN',
  reflection: 'REFLECTION',
}

export default function SidebarNav({
  currentStepId,
  completedStepIds,
  onStepClick,
}) {
  const currentStepIndex = arraysSteps.findIndex(s => s.id === currentStepId)
  const completedCount = completedStepIds.size

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'locked'
  }

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return '●' // filled circle
      case 'current':
        return '▶' // play/arrow
      default:
        return '○' // empty circle
    }
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-1">
          {lessonMeta.title}
        </h2>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {lessonMeta.badge}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Progress</span>
            <span className="text-slate-500">
              {completedCount} / {arraysSteps.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / arraysSteps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-[#0B1F3A]"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {lessonMeta.sections.map((section) => (
          <div key={section.name} className="border-b border-slate-100 last:border-0">
            {/* Section heading */}
            <div className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {section.name}
            </div>

            {/* Steps in section */}
            <div className="space-y-1 pb-2">
              {section.steps.map((stepId) => {
                const step = arraysSteps.find(s => s.id === stepId)
                const stepIndex = arraysSteps.findIndex(s => s.id === stepId)
                const status = getStepStatus(stepIndex)
                const isLocked = status === 'locked'

                return (
                  <motion.button
                    key={stepId}
                    onClick={() => !isLocked && onStepClick(stepId)}
                    disabled={isLocked}
                    whileHover={!isLocked ? { x: 4 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    className={`
                      w-full px-3 py-2 text-left rounded-lg text-sm transition-all
                      ${status === 'completed' ? 'text-slate-600' : ''}
                      ${status === 'current' ? 'bg-[#0B1F3A]/5 border border-[#0B1F3A]/20 text-[#0B1F3A]' : ''}
                      ${status === 'locked' ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50'}
                    `}
                    title={isLocked ? 'Complete previous step to unlock' : step.heading}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5 flex-shrink-0">
                        {getStepIcon(status)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-400 leading-none mb-0.5">
                          {stepTypeLabels[step.type] || step.type}
                        </div>
                        <div className="font-medium leading-tight truncate">
                          {step.heading}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-slate-100 text-xs text-slate-500 flex-shrink-0 bg-slate-50">
        <p>💡 Complete steps in order to unlock the next one</p>
      </div>
    </div>
  )
}
