import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/stacksSteps'

export default function CourseStackPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
