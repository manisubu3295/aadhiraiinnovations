import { lessonData } from '../../data/lessons/binary-search'

export const steps = lessonData.blocks.map((block) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'binary-search',
  title: 'Binary Search in Java',
  badge: 'Lesson 5 · Core DSA',
  sections: [
    { name: 'The Algorithm', steps: ['what-is-bs', 'bs-visual', 'bs-iterative'] },
    { name: 'Practice', steps: ['predict-bs-1', 'overflow-fix', 'fill-bs-1'] },
    { name: 'Complexity', steps: ['complexity-bs-1', 'fix-bs-1'] },
    { name: 'Summary', steps: ['summary-bs'] },
  ],
}
