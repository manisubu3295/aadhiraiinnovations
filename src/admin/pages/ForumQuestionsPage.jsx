import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatDate } from '../format'

const PAGE_SIZE = 25

export default function ForumQuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [error, setError] = useState('')

  function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (q) params.set('q', q)
    api
      .get(`/admin/forum/questions?${params.toString()}`)
      .then((data) => {
        setQuestions(data.questions)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [page, q])

  async function toggleHidden(question) {
    const hide = !question.hiddenAt
    if (hide) {
      const reason = prompt('Reason for hiding this question (shown to admins only)?') || ''
      try {
        await api.put(`/admin/forum/questions/${question.id}`, { hidden: true, hiddenReason: reason })
        load()
      } catch (err) {
        setError(err.message)
      }
      return
    }
    try {
      await api.put(`/admin/forum/questions/${question.id}`, { hidden: false })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Forum Questions</h1>
        <input
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value) }}
          placeholder="Search title…"
          className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Answers</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {questions.map((qq) => (
                <tr key={qq.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <a href={`/forum/questions/${qq.slug}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {qq.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{qq.author.name}</td>
                  <td className="px-4 py-3 text-slate-600">{qq.category.name}</td>
                  <td className="px-4 py-3 text-slate-600">{qq._count.answers}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(qq.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${qq.hiddenAt ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {qq.hiddenAt ? 'Hidden' : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleHidden(qq)} className={qq.hiddenAt ? 'text-emerald-600 hover:underline' : 'text-red-600 hover:underline'}>
                      {qq.hiddenAt ? 'Unhide' : 'Hide'}
                    </button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">No questions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
