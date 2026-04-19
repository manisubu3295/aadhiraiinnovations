import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/queues'

export default function JavaDsaQueuePage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Beginner"
      prev={{ label: 'Stacks', href: '/learn/java-dsa/stack' }}
      next={{ label: 'Binary Search', href: '/learn/java-dsa/binary-search' }}
    />
  )
}
