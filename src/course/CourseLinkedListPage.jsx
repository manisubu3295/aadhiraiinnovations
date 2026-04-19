import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/linkedListSteps'

export default function CourseLinkedListPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
