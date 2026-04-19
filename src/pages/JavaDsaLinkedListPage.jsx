import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/linked-list'

export default function JavaDsaLinkedListPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Beginner"
      prev={{ label: 'Arrays', href: '/learn/java-dsa/arrays' }}
      next={{ label: 'Stacks', href: '/learn/java-dsa/stack' }}
    />
  )
}
