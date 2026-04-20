import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/binaryTreesSteps'

export default function CourseBinaryTreesPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
