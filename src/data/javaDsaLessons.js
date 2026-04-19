export const javaDsaLessons = [
  { slug: 'arrays',      title: 'Arrays',      available: true  },
  { slug: 'linked-list', title: 'Linked List', available: false },
  { slug: 'stack',       title: 'Stack',       available: false },
  { slug: 'queue',       title: 'Queue',       available: false },
  { slug: 'trees',       title: 'Trees',       available: false },
]

export const getLessonBySlug = (slug) => javaDsaLessons.find(l => l.slug === slug)
export const getLessonIndex = (slug) => javaDsaLessons.findIndex(l => l.slug === slug)
export const getPrevLesson = (slug) => {
  const idx = getLessonIndex(slug)
  return idx > 0 ? javaDsaLessons[idx - 1] : null
}
export const getNextLesson = (slug) => {
  const idx = getLessonIndex(slug)
  return idx < javaDsaLessons.length - 1 ? javaDsaLessons[idx + 1] : null
}
