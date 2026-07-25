import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatDateTime } from '../format'
import { useAuth } from '../AuthContext'

const emptyForm = {
  smtpHost: '',
  smtpPort: '',
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
  emailFrom: '',
  ticketNotifyEmail: '',
  enquiryNotifyEmail: '',
  enquiryReplyTo: '',
  businessName: '',
  businessContactPerson: '',
  businessAddress: '',
  businessPhone: '',
  businessGst: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfsc: '',
  upiId: '',
  logoUrl: '',
  whatsappEnabled: false,
  whatsappPhoneNumberId: '',
  whatsappAccessToken: '',
  whatsappBusinessAccountId: '',
  whatsappApiVersion: 'v21.0',
  whatsappStaffNotifyNumber: '',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30'

const TABS = ['SMTP', 'Business Profile', 'WhatsApp', 'My WhatsApp', 'Email Templates', 'WhatsApp Templates', 'Email Log', 'WhatsApp Log']

export default function SettingsPage() {
  const [tab, setTab] = useState('SMTP')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Configure email delivery, the business profile shown on invoices/quotations, email wording, and see what's been sent.
      </p>

      <div className="mt-4 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              tab === t ? 'border-[#0B1F3A] text-[#0B1F3A]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {(tab === 'SMTP' || tab === 'Business Profile' || tab === 'WhatsApp') && <SettingsForm activeTab={tab} />}
        {tab === 'My WhatsApp' && <MyWhatsAppTab />}
        {tab === 'Email Templates' && <EmailTemplatesTab />}
        {tab === 'WhatsApp Templates' && <WhatsAppTemplatesTab />}
        {tab === 'Email Log' && <EmailLogTab />}
        {tab === 'WhatsApp Log' && <WhatsAppLogTab />}
      </div>
    </div>
  )
}

function SettingsForm({ activeTab }) {
  const [form, setForm] = useState(emptyForm)
  const [smtpPassSet, setSmtpPassSet] = useState(false)
  const [whatsappTokenSet, setWhatsappTokenSet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [testTo, setTestTo] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/admin/settings')
      .then((data) => {
        const { smtpPassSet: passSet, whatsappAccessTokenSet: tokenSet, ...rest } = data.settings
        setForm({ ...emptyForm, ...rest, smtpPass: '', whatsappAccessToken: '' })
        setSmtpPassSet(passSet)
        setWhatsappTokenSet(tokenSet)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const data = await api.put('/admin/settings', form)
      const { smtpPassSet: passSet, whatsappAccessTokenSet: tokenSet, ...rest } = data.settings
      setForm({ ...emptyForm, ...rest, smtpPass: '', whatsappAccessToken: '' })
      setSmtpPassSet(passSet)
      setWhatsappTokenSet(tokenSet)
      setSuccess('Settings saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTestEmail(e) {
    e.preventDefault()
    setTesting(true)
    setTestResult(null)
    try {
      const data = await api.post('/admin/settings/test-email', { to: testTo })
      setTestResult({ ok: true, message: data.message })
    } catch (err) {
      setTestResult({ ok: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  if (loading) return <div className="text-slate-400">Loading…</div>

  return (
    <>
      {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === 'SMTP' && (
          <>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">SMTP account</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="SMTP host">
                  <input
                    value={form.smtpHost}
                    onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="SMTP port">
                  <input
                    type="number"
                    value={form.smtpPort}
                    onChange={(e) => setForm({ ...form, smtpPort: e.target.value })}
                    placeholder="587"
                    className={inputClass}
                  />
                </Field>
                <Field label="SMTP username">
                  <input
                    value={form.smtpUser}
                    onChange={(e) => setForm({ ...form, smtpUser: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="SMTP password"
                  hint={smtpPassSet ? 'A password is already saved — leave blank to keep it.' : 'No password saved yet.'}
                >
                  <input
                    type="password"
                    value={form.smtpPass}
                    onChange={(e) => setForm({ ...form, smtpPass: e.target.value })}
                    placeholder={smtpPassSet ? '••••••••' : ''}
                    className={inputClass}
                  />
                </Field>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.smtpSecure}
                  onChange={(e) => setForm({ ...form, smtpSecure: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Use TLS (usually on for port 465)
              </label>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">Sending &amp; notifications</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="From address" hint="Shown as the sender on outgoing emails.">
                  <input
                    type="email"
                    value={form.emailFrom}
                    onChange={(e) => setForm({ ...form, emailFrom: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Ticket notifications go to" hint="Staff inbox for new tickets and client replies.">
                  <input
                    type="email"
                    value={form.ticketNotifyEmail}
                    onChange={(e) => setForm({ ...form, ticketNotifyEmail: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Enquiry notifications go to" hint="Recipient for the website contact form.">
                  <input
                    type="email"
                    value={form.enquiryNotifyEmail}
                    onChange={(e) => setForm({ ...form, enquiryNotifyEmail: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Enquiry reply-to" hint="Optional — where replies to enquiry notifications go.">
                  <input
                    type="email"
                    value={form.enquiryReplyTo}
                    onChange={(e) => setForm({ ...form, enquiryReplyTo: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Business Profile' && (
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Business profile</h2>
            <p className="mt-1 text-xs text-slate-400">
              Used as the "seller" details on emailed invoice/quotation PDFs.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Business name">
                <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Contact person">
                <input value={form.businessContactPerson} onChange={(e) => setForm({ ...form, businessContactPerson: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Address">
                <input value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Phone">
                <input value={form.businessPhone} onChange={(e) => setForm({ ...form, businessPhone: e.target.value })} className={inputClass} />
              </Field>
              <Field label="GST number (optional)">
                <input value={form.businessGst} onChange={(e) => setForm({ ...form, businessGst: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Logo URL (optional)">
                <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <h3 className="mt-5 text-sm font-semibold text-slate-800">Bank details (shown on invoices)</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Bank name">
                <input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Account number">
                <input value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} className={inputClass} />
              </Field>
              <Field label="IFSC">
                <input value={form.bankIfsc} onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })} className={inputClass} />
              </Field>
              <Field label="UPI ID">
                <input value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </div>
        )}

        {activeTab === 'WhatsApp' && (
          <div>
            <h2 className="text-sm font-semibold text-slate-800">WhatsApp Cloud API (Meta)</h2>
            <p className="mt-1 text-xs text-slate-400">
              Requires a Meta app with the WhatsApp product added, and approved Message Templates — configure those
              on the "WhatsApp Templates" tab once you have credentials here.
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.whatsappEnabled}
                onChange={(e) => setForm({ ...form, whatsappEnabled: e.target.checked })}
                className="rounded border-slate-300"
              />
              Enable WhatsApp notifications
            </label>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone Number ID">
                <input
                  value={form.whatsappPhoneNumberId}
                  onChange={(e) => setForm({ ...form, whatsappPhoneNumberId: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Access token"
                hint={whatsappTokenSet ? 'A token is already saved — leave blank to keep it.' : 'No token saved yet.'}
              >
                <input
                  type="password"
                  value={form.whatsappAccessToken}
                  onChange={(e) => setForm({ ...form, whatsappAccessToken: e.target.value })}
                  placeholder={whatsappTokenSet ? '••••••••' : ''}
                  className={inputClass}
                />
              </Field>
              <Field label="Business Account ID (optional)">
                <input
                  value={form.whatsappBusinessAccountId}
                  onChange={(e) => setForm({ ...form, whatsappBusinessAccountId: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="API version">
                <input
                  value={form.whatsappApiVersion}
                  onChange={(e) => setForm({ ...form, whatsappApiVersion: e.target.value })}
                  placeholder="v21.0"
                  className={inputClass}
                />
              </Field>
              <Field label="Staff notifications go to (WhatsApp)" hint="E.164 format, e.g. 919876543210.">
                <input
                  value={form.whatsappStaffNotifyNumber}
                  onChange={(e) => setForm({ ...form, whatsappStaffNotifyNumber: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>

      {activeTab === 'SMTP' && (
        <form onSubmit={handleTestEmail} className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Confirm it works</h2>
          <p className="mt-1 text-sm text-slate-500">
            Send a test email using the saved settings above to make sure everything is configured correctly.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
              className={`${inputClass} sm:max-w-xs`}
            />
            <button
              type="submit"
              disabled={testing}
              className="shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              {testing ? 'Sending…' : 'Send test email'}
            </button>
          </div>
          {testResult && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </form>
      )}
    </>
  )
}

function MyWhatsAppTab() {
  const { user } = useAuth()
  const [form, setForm] = useState({ phoneNumberId: '', accessToken: '', webhookVerifyToken: '' })
  const [accessTokenMasked, setAccessTokenMasked] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [notifyNumber, setNotifyNumber] = useState('')
  const [savingNotifyNumber, setSavingNotifyNumber] = useState(false)
  const [notifyNumberResult, setNotifyNumberResult] = useState(null)

  const [testTo, setTestTo] = useState('')
  const [testMessage, setTestMessage] = useState('Test message from Aadhirai Admin — your WhatsApp integration is working.')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/whatsapp/settings')
      .then((data) => {
        const s = data.settings
        setForm({
          phoneNumberId: s?.phoneNumberId || '',
          accessToken: '',
          webhookVerifyToken: s?.webhookVerifyToken || '',
        })
        setAccessTokenMasked(s?.accessTokenMasked || null)
        setNotifyNumber(s?.whatsappNumber || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleSaveNotifyNumber(e) {
    e.preventDefault()
    setSavingNotifyNumber(true)
    setNotifyNumberResult(null)
    try {
      const data = await api.put('/whatsapp/settings', { whatsappNumber: notifyNumber })
      setNotifyNumber(data.settings?.whatsappNumber || '')
      setNotifyNumberResult({ ok: true, message: 'Saved.' })
    } catch (err) {
      setNotifyNumberResult({ ok: false, message: err.message })
    } finally {
      setSavingNotifyNumber(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const data = await api.put('/whatsapp/settings', form)
      const s = data.settings
      setForm({ phoneNumberId: s?.phoneNumberId || '', accessToken: '', webhookVerifyToken: s?.webhookVerifyToken || '' })
      setAccessTokenMasked(s?.accessTokenMasked || null)
      setSuccess('WhatsApp settings saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTest(e) {
    e.preventDefault()
    setTesting(true)
    setTestResult(null)
    try {
      const data = await api.post('/whatsapp/settings/test', { to: testTo, message: testMessage })
      setTestResult({ ok: true, message: data.message })
    } catch (err) {
      setTestResult({ ok: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  if (loading) return <div className="text-slate-400">Loading…</div>

  // Absolute, not API_BASE-relative — this is meant to be pasted into Meta's dashboard, not
  // fetched by this app, and the admin panel is always served same-origin with this API in
  // production (see server.js), so window.location.origin is the right base here.
  const webhookUrl = user ? `${window.location.origin}/api/whatsapp/webhook/${user.id}` : ''

  return (
    <>
      <form onSubmit={handleSaveNotifyNumber} className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Get ticket notifications on WhatsApp</h2>
          <p className="mt-1 text-xs text-slate-400">
            Personal number for new-ticket and client-reply alerts — separate from the Business API setup below,
            no Meta account needed. Sent from the shared business number configured on the "WhatsApp" tab.
          </p>
        </div>
        <Field label="Your WhatsApp number" hint="E.164 format, e.g. 919876543210.">
          <input
            value={notifyNumber}
            onChange={(e) => setNotifyNumber(e.target.value)}
            placeholder="919876543210"
            className={`${inputClass} sm:max-w-xs`}
          />
        </Field>
        <button
          type="submit"
          disabled={savingNotifyNumber}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
        >
          {savingNotifyNumber ? 'Saving…' : 'Save'}
        </button>
        {notifyNumberResult && (
          <div className={`text-sm ${notifyNumberResult.ok ? 'text-green-700' : 'text-red-600'}`}>
            {notifyNumberResult.message}
          </div>
        )}
      </form>

      {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Your WhatsApp Business number</h2>
          <p className="mt-1 text-xs text-slate-400">
            Personal to your login — send/receive WhatsApp using your own Meta Business number instead of the
            shared one on the "WhatsApp" tab. Requires a Meta app with the WhatsApp product added and a permanent
            system-user access token.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone Number ID" hint="From the Meta Developer Dashboard.">
            <input
              value={form.phoneNumberId}
              onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field
            label="Access token"
            hint={accessTokenMasked ? `Saved: ${accessTokenMasked} — leave blank to keep it.` : 'No token saved yet.'}
          >
            <input
              type="password"
              value={form.accessToken}
              onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
              placeholder={accessTokenMasked || ''}
              className={inputClass}
            />
          </Field>
          <Field label="Webhook verify token" hint="Any string you choose — enter the same value in Meta's webhook setup.">
            <input
              value={form.webhookVerifyToken}
              onChange={(e) => setForm({ ...form, webhookVerifyToken: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        {webhookUrl && (
          <Field label="Webhook callback URL" hint="Paste this into Meta's App Dashboard → WhatsApp → Configuration → Webhook.">
            <input readOnly value={webhookUrl} onFocus={(e) => e.target.select()} className={`${inputClass} bg-slate-50 text-slate-500`} />
          </Field>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save WhatsApp settings'}
        </button>
      </form>

      {accessTokenMasked && (
        <form onSubmit={handleTest} className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Send a test message</h2>
          <p className="mt-1 text-sm text-slate-500">
            Plain text, not a Message Template — only delivers if the recipient has messaged your WhatsApp Business
            number in the last 24 hours, or is a verified test recipient in the Meta dashboard.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="To" hint="E.164 format, e.g. 919876543210.">
              <input
                required
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="919876543210"
                className={inputClass}
              />
            </Field>
            <Field label="Message">
              <input
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="submit"
            disabled={testing}
            className="mt-3 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
          >
            {testing ? 'Sending…' : 'Send test message'}
          </button>
          {testResult && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </form>
      )}
    </>
  )
}

const CATEGORY_LABELS = {
  TICKET: 'Ticket',
  INVOICE: 'Invoice',
  QUOTATION: 'Quotation',
  TIMESHEET: 'Timesheet',
  EXPENSE: 'Expense',
  ENQUIRY: 'Website enquiry',
}

function EmailTemplatesTab() {
  const [templates, setTemplates] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [openKey, setOpenKey] = useState('')

  function load() {
    api.get('/admin/email-templates').then((data) => setTemplates(data.templates)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <div className="text-slate-400">Loading…</div>
  if (error) return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>

  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-sm font-semibold text-slate-800">{CATEGORY_LABELS[category] || category}</h2>
          <div className="mt-2 space-y-2">
            {items.map((t) => (
              <TemplateRow key={t.key} template={t} open={openKey === t.key} onToggle={() => setOpenKey(openKey === t.key ? '' : t.key)} onSaved={load} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TemplateRow({ template, open, onToggle, onSaved }) {
  const [subject, setSubject] = useState(template.subject)
  const [bodyHtml, setBodyHtml] = useState(template.bodyHtml)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testTo, setTestTo] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.put(`/admin/email-templates/${template.key}`, { subject, bodyHtml })
      setSuccess('Saved.')
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTest(e) {
    e.preventDefault()
    setTesting(true)
    setTestResult(null)
    try {
      const data = await api.post(`/admin/email-templates/${template.key}/test`, { to: testTo })
      setTestResult({ ok: true, message: data.message })
    } catch (err) {
      setTestResult({ ok: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800"
      >
        {template.label}
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <form onSubmit={handleSave} className="space-y-3 border-t border-slate-100 p-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}
          <p className="text-xs text-slate-400">
            Variables available: {template.variables?.length ? template.variables.map((v) => `{{${v}}}`).join(', ') : 'none'}
          </p>
          <Field label="Subject">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Body (HTML)">
            <textarea rows={5} value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} className={`${inputClass} font-mono text-xs`} />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save template'}
          </button>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="you@example.com"
                className={`${inputClass} sm:max-w-xs`}
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !testTo}
                className="shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                {testing ? 'Sending…' : 'Send test'}
              </button>
            </div>
            {testResult && (
              <div className={`mt-2 rounded-md px-3 py-2 text-sm ${testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

function WhatsAppTemplatesTab() {
  const [templates, setTemplates] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  function load() {
    api.get('/admin/whatsapp-templates').then((data) => setTemplates(data.templates)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <div className="text-slate-400">Loading…</div>
  if (error) return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>

  return (
    <div>
      <p className="text-xs text-slate-400">
        Outbound WhatsApp messages must use a Message Template approved in Meta Business Manager (WhatsApp Manager
        &gt; Message Templates, category "Utility"). Create each one there with the listed variables in order, then
        paste the approved template name below.
      </p>
      <div className="mt-3 space-y-2">
        {templates.map((t) => (
          <WhatsAppTemplateRow key={t.key} template={t} onSaved={load} />
        ))}
      </div>
    </div>
  )
}

function WhatsAppTemplateRow({ template, onSaved }) {
  const [open, setOpen] = useState(false)
  const [templateName, setTemplateName] = useState(template.templateName || '')
  const [language, setLanguage] = useState(template.language)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testTo, setTestTo] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.put(`/admin/whatsapp-templates/${template.key}`, { templateName, language })
      setSuccess('Saved.')
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTest(e) {
    e.preventDefault()
    setTesting(true)
    setTestResult(null)
    try {
      const data = await api.post(`/admin/whatsapp-templates/${template.key}/test`, { to: testTo })
      setTestResult({ ok: true, message: data.message })
    } catch (err) {
      setTestResult({ ok: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800"
      >
        <span>
          {template.label}
          {!template.templateName && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Not configured</span>}
        </span>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <form onSubmit={handleSave} className="space-y-3 border-t border-slate-100 p-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}
          <p className="text-xs text-slate-400">
            Variables in order: {template.params?.length ? template.params.map((v, i) => `{{${i + 1}}} ${v}`).join(', ') : 'none'}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Meta template name">
              <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Language code">
              <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="en_US" className={inputClass} />
            </Field>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save template'}
          </button>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="919876543210"
                className={`${inputClass} sm:max-w-xs`}
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !testTo || !template.templateName}
                title={!template.templateName ? 'Save a template name first' : undefined}
                className="shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                {testing ? 'Sending…' : 'Send test'}
              </button>
            </div>
            {testResult && (
              <div className={`mt-2 rounded-md px-3 py-2 text-sm ${testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

const STATUS_OPTIONS = ['SENT', 'FAILED']
const RELATED_TYPE_OPTIONS = ['TICKET', 'INVOICE', 'QUOTATION', 'TIMESHEET', 'EXPENSE', 'ENQUIRY', 'TEST']
const WHATSAPP_RELATED_TYPE_OPTIONS = ['TICKET', 'TEST']

function EmailLogTab() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [relatedType, setRelatedType] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const pageSize = 25

  function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (status) params.set('status', status)
    if (relatedType) params.set('relatedType', relatedType)
    if (search) params.set('search', search)
    api
      .get(`/admin/email-logs?${params}`)
      .then((data) => {
        setLogs(data.logs)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [page, status, relatedType, search])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={relatedType} onChange={(e) => { setRelatedType(e.target.value); setPage(1) }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          {RELATED_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search recipient or subject…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Sent at</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDateTime(log.sentAt)}</td>
                  <td className="px-4 py-3 text-slate-600">{log.to.join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{log.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{log.relatedType || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${log.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                    {log.status === 'FAILED' && log.errorMessage && (
                      <div className="mt-1 text-xs text-red-500" title={log.errorMessage}>
                        {log.errorMessage.slice(0, 80)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No emails logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function WhatsAppLogTab() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [relatedType, setRelatedType] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const pageSize = 25

  function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (status) params.set('status', status)
    if (relatedType) params.set('relatedType', relatedType)
    if (search) params.set('search', search)
    api
      .get(`/admin/whatsapp-logs?${params}`)
      .then((data) => {
        setLogs(data.logs)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [page, status, relatedType, search])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={relatedType} onChange={(e) => { setRelatedType(e.target.value); setPage(1) }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          {WHATSAPP_RELATED_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search recipient or template…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Sent at</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDateTime(log.sentAt)}</td>
                  <td className="px-4 py-3 text-slate-600">{log.to || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{log.templateKey || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{log.relatedType || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${log.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                    {log.status === 'FAILED' && log.errorMessage && (
                      <div className="mt-1 text-xs text-red-500" title={log.errorMessage}>
                        {log.errorMessage.slice(0, 80)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No WhatsApp messages logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
