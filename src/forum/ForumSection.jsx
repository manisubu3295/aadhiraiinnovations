import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ForumAuthProvider, useForumAuth } from './ForumAuthContext'

const ForumHomePage = lazy(() => import('./pages/ForumHomePage'))
const ForumQuestionPage = lazy(() => import('./pages/ForumQuestionPage'))
const NewQuestionPage = lazy(() => import('./pages/NewQuestionPage'))
const ForumLoginPage = lazy(() => import('./pages/ForumLoginPage'))
const ForumSignupPage = lazy(() => import('./pages/ForumSignupPage'))

function ForumLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#0B1F3A]" />
    </div>
  )
}

// Only the "ask a question" composer requires a forum login — browsing/reading stays public
// so the forum remains crawlable and useful to anonymous visitors.
function RequireForumAuth({ children }) {
  const { forumUser, loading } = useForumAuth()
  if (loading) return <ForumLoader />
  if (!forumUser) return <Navigate to="/forum/login?next=/forum/ask" replace />
  return children
}

function ForumRoutes() {
  const { forumUser, loading } = useForumAuth()

  return (
    <Suspense fallback={<ForumLoader />}>
      <Routes>
        <Route index element={<ForumHomePage />} />
        <Route path="questions/:slug" element={<ForumQuestionPage />} />
        <Route
          path="ask"
          element={
            <RequireForumAuth>
              <NewQuestionPage />
            </RequireForumAuth>
          }
        />
        <Route
          path="login"
          element={loading ? <ForumLoader /> : forumUser ? <Navigate to="/forum" replace /> : <ForumLoginPage />}
        />
        <Route
          path="signup"
          element={loading ? <ForumLoader /> : forumUser ? <Navigate to="/forum" replace /> : <ForumSignupPage />}
        />
        <Route path="*" element={<Navigate to="/forum" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function ForumSection() {
  return (
    <ForumAuthProvider>
      <ForumRoutes />
    </ForumAuthProvider>
  )
}
