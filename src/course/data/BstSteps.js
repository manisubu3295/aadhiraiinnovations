import { lessonData } from '../../data/lessons/bst'

export const steps = lessonData.blocks.map((block) => ({
  ...block,
  badge: block.type === 'concept' ? '🔷 CONCEPT' : block.type === 'visual' ? '🎨 VISUAL' : block.type === 'worked-sample' ? '📖 GUIDED' : block.type === 'exercise' ? '📝 YOUR TURN' : '🎓 REFLECTION',
  heading: block.heading || 'Step',
  hint: block.type === 'exercise' ? (block.hint || null) : null,
}))

export const lessonMeta = {
  slug: 'bst',
  title: lessonData.title,
  badge: lessonData.badge,
  sections: lessonData.blocks.reduce((acc, block, idx) => {
    const sectionName = block.type === 'reflection' ? 'Summary' : idx < 3 ? 'Fundamentals' : idx < 6 ? 'Core Concepts' : 'Practice'
    const last = acc[acc.length - 1]
    if (!last || last.name !== sectionName) acc.push({ name: sectionName, steps: [block.id] })
    else last.steps.push(block.id)
    return acc
  }, []),
}
