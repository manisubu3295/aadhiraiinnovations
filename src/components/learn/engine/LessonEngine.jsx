import { useState } from 'react'
import { motion } from 'framer-motion'
import ConceptBlock from './ConceptBlock'
import VisualBlock from './VisualBlock'
import WorkedSampleBlock from './WorkedSampleBlock'
import ExerciseBlock from './ExerciseBlock'
import ReflectionCard from './ReflectionCard'

const blockComponents = {
  concept: ConceptBlock,
  visual: VisualBlock,
  'worked-sample': WorkedSampleBlock,
  exercise: ExerciseBlock,
  reflection: ReflectionCard,
}

export default function LessonEngine({ lessonData }) {
  const [exerciseResults, setExerciseResults] = useState({})

  const exerciseCount = lessonData.blocks.filter(b => b.type === 'exercise').length
  const completedCount = Object.values(exerciseResults).filter(r => r === true).length
  const progressPercent = exerciseCount > 0 ? Math.round((completedCount / exerciseCount) * 100) : 0

  const handleExerciseComplete = (exerciseId, isCorrect) => {
    setExerciseResults(prev => ({ ...prev, [exerciseId]: isCorrect }))
  }

  return (
    <div className="space-y-12">
      {/* Progress bar */}
      {exerciseCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-slate-100 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-sm font-bold text-[#0B1F3A]">
              {completedCount} / {exerciseCount} exercises
            </span>
          </div>
          <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-400 to-green-500"
            />
          </div>
        </motion.div>
      )}

      {/* Blocks */}
      {lessonData.blocks.map((block, idx) => {
        const BlockComponent = blockComponents[block.type]

        if (!BlockComponent) {
          return (
            <div key={block.id} className="text-red-500">
              Unknown block type: {block.type}
            </div>
          )
        }

        if (block.type === 'exercise') {
          return (
            <ExerciseBlock
              key={block.id}
              exercise={block}
              onComplete={handleExerciseComplete}
            />
          )
        }

        if (block.type === 'reflection') {
          return <BlockComponent key={block.id} {...block} />
        }

        return <BlockComponent key={block.id} {...block} />
      })}
    </div>
  )
}
