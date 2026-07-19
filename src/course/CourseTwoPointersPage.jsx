import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/TwoPointersSteps'

export default function CourseTwoPointersPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
