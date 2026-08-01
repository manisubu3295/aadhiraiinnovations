import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../admin/api'

// Deliberately separate from src/admin/AuthContext.jsx — a forum session (public self-service
// account) and an admin/client session are unrelated identities that can legitimately both be
// present in the same browser (e.g. an admin testing the forum as a poster), backed by their
// own forum_session cookie (server/middleware/forumAuth.js).
const ForumAuthContext = createContext(null)

export function ForumAuthProvider({ children }) {
  const [forumUser, setForumUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await api.get('/forum/me')
      setForumUser(data.forumUser)
    } catch {
      setForumUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (email, password) => {
    const data = await api.post('/forum/login', { email, password })
    setForumUser(data.forumUser)
  }

  const register = async (name, email, password) => {
    const data = await api.post('/forum/register', { name, email, password })
    setForumUser(data.forumUser)
  }

  const logout = async () => {
    await api.post('/forum/logout')
    setForumUser(null)
  }

  return (
    <ForumAuthContext.Provider value={{ forumUser, loading, login, register, logout, refresh }}>
      {children}
    </ForumAuthContext.Provider>
  )
}

export function useForumAuth() {
  const ctx = useContext(ForumAuthContext)
  if (!ctx) throw new Error('useForumAuth must be used within ForumAuthProvider')
  return ctx
}
