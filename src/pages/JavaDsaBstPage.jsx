import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/bst'

export default function JavaDsaBstPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Advanced"
      prev={null}
      next={null}
    />
  )
}
