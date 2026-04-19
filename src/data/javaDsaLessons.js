export const javaDsaLessons = [
  { slug: 'arrays',        title: 'Arrays',         available: true  },
  { slug: 'linked-list',   title: 'Linked Lists',   available: true  },
  { slug: 'stack',         title: 'Stacks',         available: true  },
  { slug: 'queue',         title: 'Queues',         available: true  },
  { slug: 'binary-search', title: 'Binary Search',  available: true  },
  { slug: 'recursion',     title: 'Recursion',      available: true  },
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
