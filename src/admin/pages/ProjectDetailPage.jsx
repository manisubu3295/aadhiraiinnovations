import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { formatMoney, formatDate } from '../format'
import { StatusBadge } from './ProjectsPage'
import RecordPaymentModal from '../components/RecordPaymentModal'
import Modal from '../components/Modal'

const emptyMilestoneForm = { title: '', description: '', amount: '', dueDate: '' }

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false)
  const [milestoneForm, setMilestoneForm] = useState(emptyMilestoneForm)
  const [savingMilestone, setSavingMilestone] = useState(false)

  function load() {
    api
      .get(`/admin/projects/${id}`)
      .then((data) => setProject(data.project))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [id])

  async function handleAddMilestone(e) {
    e.preventDefault()
    setSavingMilestone(true)
    setError('')
    try {
      await api.post(`/admin/projects/${id}/milestones`, {
        title: milestoneForm.title,
        description: milestoneForm.description,
        amount: Number(milestoneForm.amount) || 0,
        dueDate: milestoneForm.dueDate || undefined,
        sequence: project?.milestones?.length ?? 0,
      })
      setMilestoneModalOpen(false)
      setMilestoneForm(emptyMilestoneForm)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingMilestone(false)
    }
  }

  async function handleMilestoneStatus(milestoneId, status) {
    try {
      await api.put(`/admin/milestones/${milestoneId}`, { status })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!project) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <Link to="/admin/projects" className="text-sm text-slate-500 hover:underline">
            ← Projects
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">{project.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{project.client?.name}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total value" value={formatMoney(project.totalValue, project.currency)} />
        <SummaryCard label="Paid" value={formatMoney(project.paid, project.currency)} />
        <SummaryCard
          label="Due"
          value={formatMoney(project.due, project.currency)}
          accent={project.due > 0 ? 'amber' : 'emerald'}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0B1F3A]">Milestones</h2>
        <button
          onClick={() => setMilestoneModalOpen(true)}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Add milestone
        </button>
      </div>

      {project.milestones.length > 0 && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-500"
            style={{
              width: `${Math.round((project.milestones.filter((m) => m.status === 'COMPLETED').length / project.milestones.length) * 100)}%`,
            }}
          />
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Milestone</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {project.milestones.map((m) => (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{m.title}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(m.dueDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(m.amount, project.currency)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {m.status !== 'IN_PROGRESS' && m.status !== 'COMPLETED' && (
                    <button onClick={() => handleMilestoneStatus(m.id, 'IN_PROGRESS')} className="text-[#0B1F3A] hover:underline">
                      Start
                    </button>
                  )}
                  {m.status !== 'COMPLETED' && (
                    <button onClick={() => handleMilestoneStatus(m.id, 'COMPLETED')} className="text-emerald-600 hover:underline">
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {project.milestones.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No milestones yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0B1F3A]">Payments</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Record payment
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {project.payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(p.paidOn)}</td>
                <td className="px-4 py-3 text-slate-600">{p.method?.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-slate-600">{p.reference || '—'}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">{formatMoney(p.amount, project.currency)}</td>
              </tr>
            ))}
            {project.payments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No payments recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DocList title="Quotations" items={project.quotations} basePath="/admin/quotations" numberKey="quotationNumber" />
        <DocList title="Invoices" items={project.invoices} basePath="/admin/invoices" numberKey="invoiceNumber" />
      </div>

      <RecordPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={id}
        onSaved={() => {
          setModalOpen(false)
          load()
        }}
      />

      <Modal open={milestoneModalOpen} title="Add milestone" onClose={() => setMilestoneModalOpen(false)}>
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              required
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={milestoneForm.amount}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, amount: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Due date</label>
            <input
              type="date"
              value={milestoneForm.dueDate}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              value={milestoneForm.description}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <button
            type="submit"
            disabled={savingMilestone}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {savingMilestone ? 'Saving…' : 'Add milestone'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

function SummaryCard({ label, value, accent }) {
  const color = accent === 'amber' ? 'text-amber-600' : accent === 'emerald' ? 'text-emerald-600' : 'text-[#0B1F3A]'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  )
}

function DocList({ title, items, basePath, numberKey }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0B1F3A]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <Link to={`${basePath}/${item.id}`} className="text-slate-700 hover:underline">
              {item[numberKey]}
            </Link>
            <StatusBadge status={item.status} />
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-slate-400">None yet.</li>}
      </ul>
    </div>
  )
}
