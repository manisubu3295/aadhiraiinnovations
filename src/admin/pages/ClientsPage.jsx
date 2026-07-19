import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import Modal from '../components/Modal'

const emptyForm = { name: '', company: '', email: '', phone: '', address: '', gstNumber: '' }

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [portalClient, setPortalClient] = useState(null)
  const [portalUser, setPortalUser] = useState(null)
  const [portalForm, setPortalForm] = useState({ username: '', email: '', password: '' })
  const [portalSaving, setPortalSaving] = useState(false)
  const [portalError, setPortalError] = useState('')
  const portalRequestRef = useRef(0)

  function load() {
    api
      .get('/admin/clients')
      .then((data) => setClients(data.clients))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(client) {
    setEditingId(client.id)
    setForm({
      name: client.name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      gstNumber: client.gstNumber || '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await api.put(`/admin/clients/${editingId}`, form)
      } else {
        await api.post('/admin/clients', form)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client? This cannot be undone.')) return
    try {
      await api.del(`/admin/clients/${id}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function openPortal(client) {
    const requestId = ++portalRequestRef.current
    setPortalClient(client)
    setPortalUser(null)
    setPortalError('')
    setPortalForm({ username: '', email: client.email || '', password: '' })
    try {
      const data = await api.get(`/admin/clients/${client.id}/portal-user`)
      if (portalRequestRef.current !== requestId) return // a newer openPortal call superseded this one
      setPortalUser(data.user)
      if (data.user) setPortalForm((f) => ({ ...f, username: data.user.username, email: data.user.email }))
    } catch (err) {
      if (portalRequestRef.current !== requestId) return
      setPortalError(err.message)
    }
  }

  async function handlePortalSubmit(e) {
    e.preventDefault()
    setPortalSaving(true)
    setPortalError('')
    try {
      const data = portalUser
        ? await api.put(`/admin/clients/${portalClient.id}/portal-user`, portalForm)
        : await api.post(`/admin/clients/${portalClient.id}/portal-user`, portalForm)
      setPortalUser(data.user)
      setPortalForm({ ...portalForm, password: '' })
    } catch (err) {
      setPortalError(err.message)
    } finally {
      setPortalSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Clients</h1>
        <button
          onClick={openCreate}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Add client
        </button>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{client.name}</td>
                <td className="px-4 py-3 text-slate-600">{client.company || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{client.email || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{client.phone || '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => openPortal(client)} className="text-[#0B1F3A] hover:underline">
                    Portal access
                  </button>
                  <button onClick={() => openEdit(client)} className="text-[#0B1F3A] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No clients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit client' : 'Add client'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="GST number" value={form.gstNumber} onChange={(v) => setForm({ ...form, gstNumber: v })} />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save client'}
          </button>
        </form>
      </Modal>

      <Modal
        open={!!portalClient}
        title={`Portal access — ${portalClient?.name || ''}`}
        onClose={() => {
          setPortalClient(null)
          setPortalUser(null)
        }}
      >
        {portalError && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{portalError}</div>}
        {portalUser && (
          <p className="mb-3 text-sm text-slate-600">
            Portal login already exists for <strong>{portalUser.username}</strong>. Set a new password below to reset it.
          </p>
        )}
        <form onSubmit={handlePortalSubmit} className="space-y-4">
          <Field
            label="Username"
            value={portalForm.username}
            onChange={(v) => setPortalForm({ ...portalForm, username: v })}
            required
          />
          <Field
            label="Contact email"
            type="email"
            value={portalForm.email}
            onChange={(v) => setPortalForm({ ...portalForm, email: v })}
            required
          />
          <Field
            label={portalUser ? 'New password' : 'Password'}
            type="password"
            value={portalForm.password}
            onChange={(v) => setPortalForm({ ...portalForm, password: v })}
            required={!portalUser}
          />
          <button
            type="submit"
            disabled={portalSaving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {portalSaving ? 'Saving…' : portalUser ? 'Update login' : 'Create portal login'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
      />
    </div>
  )
}
