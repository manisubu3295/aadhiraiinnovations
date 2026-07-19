import CourseLessonPage from './components/CourseLessonPage'
import { steps, lessonMeta } from './data/TreeTraversalSteps'

export default function CourseTreeTraversalPage() {
  return <CourseLessonPage steps={steps} lessonMeta={lessonMeta} />
}
