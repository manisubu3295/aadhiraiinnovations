import { lessonData } from '../../data/lessons/linked-list'

// Convert block-based lesson to step-based for the course view
export const steps = lessonData.blocks.map((block, idx) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'linked-list',
  title: 'Linked Lists in Java',
  badge: 'Lesson 2 · Core DSA',
  sections: [
    { name: 'Fundamentals', steps: ['what-is-ll', 'll-diagram', 'node-structure', 'traversal-sample'] },
    { name: 'Operations', steps: ['predict-ll-1', 'insert-front', 'fill-ll-1'] },
    { name: 'Complexity', steps: ['complexity-ll-1', 'reversal-sample', 'fix-ll-1'] },
    { name: 'Summary', steps: ['summary-ll'] },
  ],
}
