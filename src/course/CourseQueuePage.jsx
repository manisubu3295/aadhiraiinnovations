import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/queuesSteps'

export default function CourseQueuePage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
