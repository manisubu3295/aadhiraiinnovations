import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/two-pointers'

export default function JavaDsaTwoPointersPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Foundations"
      prev={null}
      next={null}
    />
  )
}
