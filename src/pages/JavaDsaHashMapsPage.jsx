import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/hash-maps'

export default function JavaDsaHashMapsPage() {
  const navMap = {
    'big-o': { prev: { label: 'Recursion', href: '/learn/java-dsa/recursion' }, next: { label: 'Strings', href: '/learn/java-dsa/strings' } },
    'strings': { prev: { label: 'Big O', href: '/learn/java-dsa/big-o' }, next: { label: 'HashMaps', href: '/learn/java-dsa/hash-maps' } },
    'hash-maps': { prev: { label: 'Strings', href: '/learn/java-dsa/strings' }, next: { label: 'Bubble Sort', href: '/learn/java-dsa/bubble-sort' } },
    'bubble-sort': { prev: { label: 'HashMaps', href: '/learn/java-dsa/hash-maps' }, next: { label: 'Merge Sort', href: '/learn/java-dsa/merge-sort' } },
    'merge-sort': { prev: { label: 'Bubble Sort', href: '/learn/java-dsa/bubble-sort' }, next: { label: 'Binary Trees', href: '/learn/java-dsa/binary-trees' } },
    'binary-trees': { prev: { label: 'Merge Sort', href: '/learn/java-dsa/merge-sort' }, next: null },
  }
  const { prev, next } = navMap['hash-maps']
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty={['big-o','strings','hash-maps'].includes('hash-maps') ? 'Foundations' : ['bubble-sort','merge-sort'].includes('hash-maps') ? 'Intermediate' : 'Advanced'}
      prev={prev}
      next={next}
    />
  )
}
