import InteractiveLessonPage from '../components/learn/InteractiveLessonPage'
import { lessonData } from '../data/lessons/hash-sets'

export default function JavaDsaHashSetsPage() {
  return (
    <InteractiveLessonPage
      lessonData={lessonData}
      difficulty="Data Structures"
      prev={null}
      next={null}
    />
  )
}
