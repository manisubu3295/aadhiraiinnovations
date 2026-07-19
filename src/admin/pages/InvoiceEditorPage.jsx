import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatMoney } from '../format'
import { calculateTotals, calculateTds } from '../../../shared/pricing.js'
import DocumentBuilderLayout from '../../business-tools/components/DocumentBuilderLayout'
import LeftPanelSection from '../../business-tools/components/LeftPanelSection'
import ItemTable from '../../business-tools/components/ItemTable'
import PricingSummary from '../../business-tools/components/PricingSummary'
import PrintButton from '../../business-tools/components/PrintButton'
import PrintView from '../../business-tools/components/PrintView'
import DocumentPreview from '../../business-tools/components/DocumentPreview'
import RecordPaymentModal from '../components/RecordPaymentModal'

const defaultSeller = { businessName: 'Aadhirai Innovations', contactPerson: '', address: '', phone: '', email: '', gst: '', bankName: '', accountNumber: '', ifsc: '', upiId: '' }
const defaultItem = { description: '', quantity: 1, unitPrice: 0, tax: 0 }
const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30'

export default function InvoiceEditorPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [seller, setSeller] = useState(() => {
    try {
      return { ...defaultSeller, ...JSON.parse(localStorage.getItem('adminSellerProfile') || '{}') }
    } catch {
      return defaultSeller
    }
  })
  const [clientId, setClientId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [milestoneId, setMilestoneId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [items, setItems] = useState([{ ...defaultItem }])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [paid, setPaid] = useState(0)
  const [tdsApplicable, setTdsApplicable] = useState(false)
  const [tdsRate, setTdsRate] = useState(10)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    api.get('/admin/clients').then((data) => setClients(data.clients)).catch(() => {})
    api.get('/admin/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('adminSellerProfile', JSON.stringify(seller))
  }, [seller])

  function load() {
    if (isNew) return
    api
      .get(`/admin/invoices/${id}`)
      .then(({ invoice }) => {
        setClientId(invoice.clientId)
        setProjectId(invoice.projectId || '')
        setMilestoneId(invoice.milestoneId || '')
        setDueDate(invoice.dueDate ? invoice.dueDate.slice(0, 10) : '')
        setCurrency(invoice.currency)
        setItems(invoice.items?.length ? invoice.items : [{ ...defaultItem }])
        setDiscount(Number(invoice.discount) || 0)
        setNotes(invoice.notes || '')
        setTerms(invoice.terms || '')
        setStatus(invoice.status)
        setInvoiceNumber(invoice.invoiceNumber)
        setPaid(invoice.paid)
        setTdsApplicable(Boolean(invoice.tdsApplicable))
        setTdsRate(Number(invoice.tdsRate) || 10)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id, isNew])

  const totals = calculateTotals(items, discount)
  const tds = tdsApplicable ? calculateTds(totals.grandTotal, tdsRate) : null
  const payable = tds ? tds.netPayable : totals.grandTotal
  const client = clients.find((c) => c.id === clientId)
  const selectedProject = projects.find((p) => p.id === projectId)
  const projectMilestones = selectedProject?.milestones || []
  const selectedMilestone = projectMilestones.find((m) => m.id === milestoneId)
  const customer = client
    ? { name: client.name, company: client.company, address: client.address, phone: client.phone, email: client.email, gst: client.gstNumber }
    : { name: '', company: '', address: '', phone: '', email: '', gst: '' }
  const due = payable - (isNew ? 0 : paid)

  function fillItemsFromMilestone(milestone) {
    if (!milestone) return
    setItems([{ description: milestone.title, quantity: 1, unitPrice: Number(milestone.amount) || 0, tax: 0 }])
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!clientId) {
      setError('Select a client before saving.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      clientId,
      projectId: projectId || undefined,
      milestoneId: milestoneId || undefined,
      dueDate: dueDate || undefined,
      currency,
      items,
      discount,
      notes,
      terms,
      status,
      tdsApplicable,
      tdsRate,
    }
    try {
      if (isNew) {
        const { invoice } = await api.post('/admin/invoices', payload)
        navigate(`/admin/invoices/${invoice.id}`, { replace: true })
      } else {
        await api.put(`/admin/invoices/${id}`, payload)
        load()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div>
      <Link to="/admin/invoices" className="text-sm text-slate-500 hover:underline">
        ← Invoices
      </Link>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">{isNew ? 'New invoice' : invoiceNumber}</h1>
        {!isNew && projectId && (
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
          >
            Record payment
          </button>
        )}
      </div>

      {!isNew && (
        <div className="mt-3 flex gap-6 text-sm text-slate-600">
          <span>
            Paid: <strong className="text-emerald-600">{formatMoney(paid, currency)}</strong>
          </span>
          <span>
            Due: <strong className={due > 0 ? 'text-amber-600' : 'text-emerald-600'}>{formatMoney(due, currency)}</strong>
          </span>
        </div>
      )}

      {!isNew && !projectId && (
        <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">
          Link this invoice to a project (left panel) to record payments and track due/paid.
        </div>
      )}

      {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4">
        <DocumentBuilderLayout
          left={
            <form className="space-y-6" onSubmit={handleSave}>
              <LeftPanelSection title="Client" icon={<span>👤</span>}>
                <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}>
                  <option value="" disabled>
                    Select a client
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value)
                    setMilestoneId('')
                  }}
                  className={`${inputClass} mt-2`}
                >
                  <option value="">No linked project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.client?.name})
                    </option>
                  ))}
                </select>
                {selectedProject?.billingType === 'MILESTONE' && projectMilestones.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)} className={inputClass}>
                      <option value="">Not tied to a specific milestone</option>
                      {projectMilestones.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} — {formatMoney(m.amount, currency)}
                        </option>
                      ))}
                    </select>
                    {selectedMilestone && (
                      <button
                        type="button"
                        onClick={() => fillItemsFromMilestone(selectedMilestone)}
                        className="text-sm text-[#0B1F3A] hover:underline"
                      >
                        Fill items from this milestone
                      </button>
                    )}
                  </div>
                )}
              </LeftPanelSection>

              <LeftPanelSection title="Business Details" icon={<span>🏢</span>}>
                <div className="space-y-2">
                  <input className={inputClass} placeholder="Business Name" value={seller.businessName} onChange={(e) => setSeller((s) => ({ ...s, businessName: e.target.value }))} />
                  <input className={inputClass} placeholder="Contact Person" value={seller.contactPerson} onChange={(e) => setSeller((s) => ({ ...s, contactPerson: e.target.value }))} />
                  <input className={inputClass} placeholder="Address" value={seller.address} onChange={(e) => setSeller((s) => ({ ...s, address: e.target.value }))} />
                  <input className={inputClass} placeholder="Phone" value={seller.phone} onChange={(e) => setSeller((s) => ({ ...s, phone: e.target.value }))} />
                  <input className={inputClass} placeholder="Email" value={seller.email} onChange={(e) => setSeller((s) => ({ ...s, email: e.target.value }))} />
                  <input className={inputClass} placeholder="GST Number (optional)" value={seller.gst} onChange={(e) => setSeller((s) => ({ ...s, gst: e.target.value }))} />
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Payment Details" icon={<span>🏦</span>}>
                <div className="space-y-2">
                  <input className={inputClass} placeholder="Bank Name" value={seller.bankName} onChange={(e) => setSeller((s) => ({ ...s, bankName: e.target.value }))} />
                  <input className={inputClass} placeholder="Account Number" value={seller.accountNumber} onChange={(e) => setSeller((s) => ({ ...s, accountNumber: e.target.value }))} />
                  <input className={inputClass} placeholder="IFSC" value={seller.ifsc} onChange={(e) => setSeller((s) => ({ ...s, ifsc: e.target.value }))} />
                  <input className={inputClass} placeholder="UPI ID" value={seller.upiId} onChange={(e) => setSeller((s) => ({ ...s, upiId: e.target.value }))} />
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Document Details" icon={<span>📄</span>}>
                <div className="space-y-2">
                  <input className={inputClass} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  <input className={inputClass} placeholder="Currency (e.g. INR, USD)" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                    {['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'].map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Items" icon={<span>🧾</span>}>
                <ItemTable
                  items={items}
                  onChange={setItems}
                  onAdd={() => setItems([...items, { ...defaultItem }])}
                  onRemove={(idx) => setItems(items.filter((_, i) => i !== idx))}
                  billingType={selectedProject?.billingType}
                />
              </LeftPanelSection>

              <LeftPanelSection title="Pricing Summary" icon={<span>💰</span>}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Discount:</span>
                    <input type="number" min={0} className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </div>
                  <PricingSummary subtotal={totals.subtotal} taxTotal={totals.taxTotal} discount={totals.discount} grandTotal={totals.grandTotal} currency={currency || 'INR'} />
                  <label className="flex items-center gap-2 pt-2 text-sm">
                    <input type="checkbox" checked={tdsApplicable} onChange={(e) => setTdsApplicable(e.target.checked)} />
                    TDS applicable
                  </label>
                  {tdsApplicable && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>TDS rate %:</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                        value={tdsRate}
                        onChange={(e) => setTdsRate(e.target.value)}
                      />
                    </div>
                  )}
                  {tds && (
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-[17px] font-bold">
                      <span>Net Payable</span>
                      <span className="text-[#0B1F3A]">{formatMoney(tds.netPayable, currency)}</span>
                    </div>
                  )}
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Additional Info" icon={<span>📝</span>}>
                <textarea className={inputClass} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <textarea className={`${inputClass} mt-2`} placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} />
              </LeftPanelSection>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save invoice'}
              </button>
            </form>
          }
          right={
            <>
              <div className="mb-4 flex justify-end">
                <PrintButton targetId="invoice-preview" />
              </div>
              <PrintView>
                <div id="invoice-preview">
                  <DocumentPreview
                    type="invoice"
                    seller={seller}
                    customer={customer}
                    details={{ invoiceNumber: invoiceNumber || '(unsaved)', dueDate, currency }}
                    items={items}
                    totals={totals}
                    notes={notes}
                    terms={terms}
                    billingType={selectedProject?.billingType}
                    milestoneLabel={selectedMilestone?.title}
                    tds={tds ? { applicable: true, ...tds } : null}
                    bankDetails={{ bankName: seller.bankName, accountNumber: seller.accountNumber, ifsc: seller.ifsc, upiId: seller.upiId }}
                  />
                </div>
              </PrintView>
            </>
          }
        />
      </div>

      {!isNew && (
        <RecordPaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          projectId={projectId}
          invoiceId={id}
          onSaved={() => {
            setPaymentModalOpen(false)
            load()
          }}
        />
      )}
    </div>
  )
}
