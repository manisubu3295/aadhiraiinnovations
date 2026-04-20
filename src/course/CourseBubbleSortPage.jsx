import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/bubbleSortSteps'

export default function CourseBubbleSortPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
