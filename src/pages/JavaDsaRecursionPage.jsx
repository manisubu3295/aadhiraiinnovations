import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/recursion'

export default function JavaDsaRecursionPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Intermediate"
      prev={{ label: 'Binary Search', href: '/learn/java-dsa/binary-search' }}
      next={null}
    />
  )
}
