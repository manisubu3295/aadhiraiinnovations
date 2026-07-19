import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/tree-traversal'

export default function JavaDsaTreeTraversalPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Advanced"
      prev={null}
      next={null}
    />
  )
}
