import { API_BASE } from '../lib/apiBase'

const BASE = `${API_BASE}/api`

async function request(path, options = {}) {
  const { body, headers, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

async function requestForm(path, formData) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', credentials: 'include', body: formData })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  postForm: (path, formData) => requestForm(path, formData),
}
