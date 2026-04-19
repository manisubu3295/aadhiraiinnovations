import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/binarySearchSteps'

export default function CourseBinarySearchPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
