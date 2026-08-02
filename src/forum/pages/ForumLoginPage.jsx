import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForumAuth } from '../ForumAuthContext'

export default function ForumLoginPage() {
  const { login, loginAsClient } = useForumAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('forum') // 'forum' | 'client'
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'client') {
        await loginAsClient(username, password)
      } else {
        await login(email, password)
      }
      navigate(searchParams.get('next') || '/forum', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-[#0B1F3A]">Log in to the forum</h1>
          <p className="mt-1 text-sm text-slate-500">Ask questions and post answers</p>
        </div>

        <div className="flex rounded-md border border-slate-200 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode('forum')}
            className={`flex-1 rounded px-3 py-1.5 font-medium transition-colors ${mode === 'forum' ? 'bg-[#0B1F3A] text-white' : 'text-slate-500'}`}
          >
            Forum account
          </button>
          <button
            type="button"
            onClick={() => setMode('client')}
            className={`flex-1 rounded px-3 py-1.5 font-medium transition-colors ${mode === 'client' ? 'bg-[#0B1F3A] text-white' : 'text-slate-500'}`}
          >
            Existing client
          </button>
        </div>

        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        {mode === 'client' ? (
          <>
            <p className="text-xs text-slate-400">Log in with the same username and password you use for the client portal.</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        {mode === 'forum' && (
          <p className="text-center text-sm text-slate-500">
            No account? <Link to="/forum/signup" className="font-medium text-[#0B1F3A] underline">Sign up</Link>
          </p>
        )}
      </form>
    </div>
  )
}
