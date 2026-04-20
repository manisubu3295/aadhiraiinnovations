import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/hashMapsSteps'

export default function CourseHashMapsPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
