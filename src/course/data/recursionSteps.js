import { lessonData } from '../../data/lessons/recursion'

export const steps = lessonData.blocks.map((block) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'recursion',
  title: 'Recursion in Java',
  badge: 'Lesson 6 · Intermediate',
  sections: [
    { name: 'The Concept', steps: ['what-is-recursion', 'factorial-sample', 'call-stack'] },
    { name: 'Practice', steps: ['predict-rec-1', 'fibonacci', 'fill-rec-1'] },
    { name: 'Complexity', steps: ['complexity-rec-1', 'fix-rec-1'] },
    { name: 'Summary', steps: ['summary-recursion'] },
  ],
}
