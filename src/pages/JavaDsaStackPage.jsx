import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/stacks'

export default function JavaDsaStackPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Beginner"
      prev={{ label: 'Linked Lists', href: '/learn/java-dsa/linked-list' }}
      next={{ label: 'Queues', href: '/learn/java-dsa/queue' }}
    />
  )
}
