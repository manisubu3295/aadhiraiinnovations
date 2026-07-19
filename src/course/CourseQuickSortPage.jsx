import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/QuickSortSteps'

export default function CourseQuickSortPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
