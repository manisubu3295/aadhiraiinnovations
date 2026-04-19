import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/binary-search'

export default function JavaDsaBinarySearchPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Intermediate"
      prev={{ label: 'Queues', href: '/learn/java-dsa/queue' }}
      next={{ label: 'Recursion', href: '/learn/java-dsa/recursion' }}
    />
  )
}
