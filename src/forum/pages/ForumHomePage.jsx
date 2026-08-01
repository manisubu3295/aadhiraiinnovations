import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../admin/api'
import { formatDate } from '../../admin/format'
import { useForumAuth } from '../ForumAuthContext'

const PAGE_SIZE = 20

export default function ForumHomePage() {
  const { forumUser } = useForumAuth()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const [questions, setQuestions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/forum/categories').then((data) => setCategories(data.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    api
      .get(`/forum/questions?${params.toString()}`)
      .then((data) => {
        setQuestions(data.questions)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }, [category, q, page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#0B1F3A]">Community Forum</h1>
          <p className="mt-2 text-slate-500">Ask a question, browse existing answers, or help someone else out.</p>
        </div>
        <Link
          to="/forum/ask"
          className="rounded-md bg-[#0B1F3A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Ask a question
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value) }}
          placeholder="Search questions…"
          className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <select
          value={category}
          onChange={(e) => { setPage(1); setCategory(e.target.value) }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {questions.map((question) => (
          <Link
            key={question.id}
            to={`/forum/questions/${question.slug}`}
            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {question.acceptedAnswerId && <span className="mr-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Answered</span>}
                {question.title}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {question.category.name} · Asked by {question.author.name} · {formatDate(question.createdAt)}
              </p>
            </div>
            <div className="shrink-0 text-right text-xs text-slate-400">
              <div>{question._count.answers} answers</div>
              <div>{question.viewCount} views</div>
            </div>
          </Link>
        ))}
        {questions.length === 0 && (
          <div className="px-5 py-10 text-center text-slate-400">No questions yet — be the first to ask one.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {!forumUser && (
        <p className="mt-8 text-center text-sm text-slate-400">
          <Link to="/forum/login" className="underline">Log in</Link> or <Link to="/forum/signup" className="underline">sign up</Link> to ask a question or post an answer.
        </p>
      )}
    </div>
  )
}
