import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/merge-sort'

export default function JavaDsaMergeSortPage() {
  const navMap = {
    'big-o': { prev: { label: 'Recursion', href: '/learn/java-dsa/recursion' }, next: { label: 'Strings', href: '/learn/java-dsa/strings' } },
    'strings': { prev: { label: 'Big O', href: '/learn/java-dsa/big-o' }, next: { label: 'HashMaps', href: '/learn/java-dsa/hash-maps' } },
    'hash-maps': { prev: { label: 'Strings', href: '/learn/java-dsa/strings' }, next: { label: 'Bubble Sort', href: '/learn/java-dsa/bubble-sort' } },
    'bubble-sort': { prev: { label: 'HashMaps', href: '/learn/java-dsa/hash-maps' }, next: { label: 'Merge Sort', href: '/learn/java-dsa/merge-sort' } },
    'merge-sort': { prev: { label: 'Bubble Sort', href: '/learn/java-dsa/bubble-sort' }, next: { label: 'Binary Trees', href: '/learn/java-dsa/binary-trees' } },
    'binary-trees': { prev: { label: 'Merge Sort', href: '/learn/java-dsa/merge-sort' }, next: null },
  }
  const { prev, next } = navMap['merge-sort']
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty={['big-o','strings','hash-maps'].includes('merge-sort') ? 'Foundations' : ['bubble-sort','merge-sort'].includes('merge-sort') ? 'Intermediate' : 'Advanced'}
      prev={prev}
      next={next}
    />
  )
}
