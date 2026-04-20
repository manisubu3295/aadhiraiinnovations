import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/bigOSteps'

export default function CourseBigOPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
