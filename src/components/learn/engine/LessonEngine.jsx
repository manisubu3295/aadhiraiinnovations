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
  const completedCount = Object.values(exerciseResults).filter(Boolean).length

  const handleExerciseComplete = (exerciseId, isCorrect) => {
    setExerciseResults(prev => ({ ...prev, [exerciseId]: isCorrect }))
  }

  return (
    <div className="space-y-10">
      {/* ── Progress strip ─────────────────────────────────────── */}
      {exerciseCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="flex-1 h-[3px] bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((completedCount / exerciseCount) * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-[#0B1F3A] rounded-full"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap tabular-nums">
            {completedCount} / {exerciseCount}
          </span>
        </motion.div>
      )}

      {/* ── Blocks ─────────────────────────────────────────────── */}
      {lessonData.blocks.map((block, idx) => {
        if (!blockComponents[block.type]) {
          return (
            <div key={block.id} className="text-xs text-red-400">
              Unknown block: {block.type}
            </div>
          )
        }

        if (block.type === 'exercise') {
          return (
            <ExerciseBlock
              key={block.id}
              exercise={block}
              index={lessonData.blocks.slice(0, idx).filter(b => b.type === 'exercise').length + 1}
              onComplete={handleExerciseComplete}
            />
          )
        }

        const BlockComponent = blockComponents[block.type]
        return <BlockComponent key={block.id} {...block} />
      })}
    </div>
  )
}
