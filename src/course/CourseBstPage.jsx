import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/BstSteps'

export default function CourseBstPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
