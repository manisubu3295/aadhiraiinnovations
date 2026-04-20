import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/stringsSteps'

export default function CourseStringsPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
