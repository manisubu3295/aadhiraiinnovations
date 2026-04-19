import { lessonData } from '../../data/lessons/queues'

export const steps = lessonData.blocks.map((block) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'queue',
  title: 'Queues in Java',
  badge: 'Lesson 4 · Core DSA',
  sections: [
    { name: 'The Concept', steps: ['what-is-queue', 'queue-operations'] },
    { name: 'In Practice', steps: ['bfs-sample', 'predict-queue-1', 'fill-queue-1'] },
    { name: 'Complexity', steps: ['complexity-queue-1', 'fix-queue-1'] },
    { name: 'Summary', steps: ['summary-queue'] },
  ],
}
