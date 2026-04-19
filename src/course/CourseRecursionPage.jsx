import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/recursionSteps'

export default function CourseRecursionPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
