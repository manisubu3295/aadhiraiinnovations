import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../admin/api'
import { formatDateTime } from '../../admin/format'
import { API_BASE } from '../../lib/apiBase'
import { useForumAuth } from '../ForumAuthContext'

function attachmentUrl(id) {
  return `${API_BASE}/api/forum/attachments/${id}`
}

function Attachment({ attachment }) {
  if (attachment.mimeType.startsWith('image/')) {
    return <img src={attachmentUrl(attachment.id)} alt={attachment.fileName} loading="lazy" className="max-h-80 rounded-md border border-slate-200" />
  }
  if (attachment.mimeType.startsWith('video/')) {
    return <video controls src={attachmentUrl(attachment.id)} className="max-h-80 rounded-md border border-slate-200" />
  }
  return (
    <a href={attachmentUrl(attachment.id)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-[#0B1F3A] underline">
      📄 {attachment.fileName}
    </a>
  )
}

function AnswerAuthorName(answer) {
  return answer.authorForumUser?.name || answer.authorStaffUser?.name || 'Aadhirai Support'
}

export default function ForumQuestionPage() {
  const { slug } = useParams()
  const { forumUser } = useForumAuth()
  const [question, setQuestion] = useState(null)
  const [staffUser, setStaffUser] = useState(null)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [answerBody, setAnswerBody] = useState('')
  const [answerFiles, setAnswerFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    api
      .get(`/forum/questions/${slug}`)
      .then((data) => setQuestion(data.question))
      .catch(() => setNotFound(true))
  }, [slug])

  useEffect(load, [load])

  // Admins/staff can answer with their existing admin_session login (no separate forum
  // account needed) — probe it directly rather than requiring the whole admin AuthContext
  // provider tree on every public page.
  useEffect(() => {
    api.get('/auth/me').then((data) => setStaffUser(data.user)).catch(() => setStaffUser(null))
  }, [])

  const canPost = Boolean(forumUser || staffUser)
  const canAccept = Boolean(staffUser) || (forumUser && question?.author.id === forumUser.id)

  async function handleAnswerSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const form = new FormData()
      form.set('body', answerBody)
      answerFiles.forEach((f) => form.append('attachments', f))
      await api.postForm(`/forum/questions/${question.id}/answers`, form)
      setAnswerBody('')
      setAnswerFiles([])
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function acceptAnswer(answerId) {
    try {
      await api.post(`/forum/questions/${question.id}/accept-answer/${answerId}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-500">This question doesn't exist or was removed.</p>
        <Link to="/forum" className="mt-4 inline-block text-[#0B1F3A] underline">Back to the forum</Link>
      </div>
    )
  }
  if (!question) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#0B1F3A]" />
      </div>
    )
  }

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.id === question.acceptedAnswerId) return -1
    if (b.id === question.acceptedAnswerId) return 1
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/forum" className="text-sm text-slate-400 hover:text-slate-600">← Back to forum</Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{question.category.name}</span>
        <h1 className="mt-3 text-2xl font-semibold text-[#0B1F3A]">{question.title}</h1>
        <p className="mt-1 text-xs text-slate-400">
          Asked by {question.author.name} · {formatDateTime(question.createdAt)} · {question.viewCount} views
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{question.body}</p>
        {question.attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {question.attachments.map((a) => <Attachment key={a.id} attachment={a} />)}
          </div>
        )}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <h2 className="mt-8 text-lg font-semibold text-[#0B1F3A]">{sortedAnswers.length} Answers</h2>
      <div className="mt-4 space-y-4">
        {sortedAnswers.map((answer) => {
          const isAccepted = answer.id === question.acceptedAnswerId
          const isStaffAnswer = Boolean(answer.authorStaffUser)
          return (
            <div key={answer.id} className={`rounded-xl border bg-white p-6 shadow-sm ${isAccepted ? 'border-emerald-300' : 'border-slate-200'}`}>
              <div className="flex flex-wrap items-center gap-2">
                {isAccepted && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">✓ Accepted answer</span>}
                {isStaffAnswer && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">Aadhirai Support</span>}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{answer.body}</p>
              {answer.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {answer.attachments.map((a) => <Attachment key={a.id} attachment={a} />)}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{AnswerAuthorName(answer)} · {formatDateTime(answer.createdAt)}</span>
                {canAccept && !isAccepted && (
                  <button onClick={() => acceptAnswer(answer.id)} className="text-emerald-600 hover:underline">Mark as accepted</button>
                )}
              </div>
            </div>
          )
        })}
        {sortedAnswers.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center text-sm text-slate-400">
            No answers yet — be the first to help.
          </p>
        )}
      </div>

      <div className="mt-8">
        {canPost ? (
          <form onSubmit={handleAnswerSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Post an answer</h3>
            <textarea
              required
              rows={5}
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="Share what worked for you…"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setAnswerFiles(Array.from(e.target.files || []))}
              className="w-full text-sm text-slate-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#0B1F3A] px-5 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
            >
              {submitting ? 'Posting…' : 'Post answer'}
            </button>
          </form>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
            <Link to={`/forum/login?next=/forum/questions/${slug}`} className="font-medium text-[#0B1F3A] underline">Log in</Link> or{' '}
            <Link to={`/forum/signup?next=/forum/questions/${slug}`} className="font-medium text-[#0B1F3A] underline">sign up</Link> to answer this question.
          </p>
        )}
      </div>
    </div>
  )
}
