import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/quick-sort'

export default function JavaDsaQuickSortPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Core Logic"
      prev={null}
      next={null}
    />
  )
}
