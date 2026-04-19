import { lessonData } from '../../data/lessons/stacks'

export const steps = lessonData.blocks.map((block) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'stack',
  title: 'Stacks in Java',
  badge: 'Lesson 3 · Core DSA',
  sections: [
    { name: 'The Concept', steps: ['what-is-stack', 'stack-visual', 'stack-operations'] },
    { name: 'In Practice', steps: ['brackets-sample', 'predict-stack-1', 'fill-stack-1'] },
    { name: 'Complexity', steps: ['complexity-stack-1', 'fix-stack-1'] },
    { name: 'Summary', steps: ['summary-stack'] },
  ],
}
