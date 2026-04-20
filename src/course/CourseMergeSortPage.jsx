import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/mergeSortSteps'

export default function CourseMergeSortPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
