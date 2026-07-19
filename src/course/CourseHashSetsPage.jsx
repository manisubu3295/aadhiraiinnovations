import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/HashSetsSteps'

export default function CourseHashSetsPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
