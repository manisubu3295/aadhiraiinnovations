import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../admin/api'

export default function NewQuestionPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState([])
  const [similar, setSimilar] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/forum/categories').then((data) => {
      setCategories(data.categories)
      if (data.categories.length) setCategoryId((prev) => prev || data.categories[0].id)
    }).catch(() => {})
  }, [])

  // Debounced "did you mean" lookup while composing the title, backed by Postgres trigram
  // similarity (server/routes/forum.js GET /questions/similar) — helps avoid duplicate questions.
  useEffect(() => {
    if (title.trim().length < 3) {
      setSimilar([])
      return
    }
    const handle = setTimeout(() => {
      api
        .get(`/forum/questions/similar?title=${encodeURIComponent(title.trim())}`)
        .then((data) => setSimilar(data.questions))
        .catch(() => {})
    }, 300)
    return () => clearTimeout(handle)
  }, [title])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const form = new FormData()
      form.set('title', title)
      form.set('body', body)
      form.set('categoryId', categoryId)
      files.forEach((f) => form.append('attachments', f))
      const data = await api.postForm('/forum/questions', form)
      navigate(`/forum/questions/${data.question.slug}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Ask a question</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your question in one line"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>

        {similar.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-800">Similar questions already asked:</p>
            <ul className="mt-2 space-y-1">
              {similar.map((s) => (
                <li key={s.id}>
                  <Link to={`/forum/questions/${s.slug}`} target="_blank" rel="noreferrer" className="text-sm text-amber-900 underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>
          <textarea
            required
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your question in detail — the more context, the better the answers."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Screenshots, video, or documents (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-400">Up to 3 files, 25MB each.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {submitting ? 'Posting…' : 'Post question'}
        </button>
      </form>
    </div>
  )
}
