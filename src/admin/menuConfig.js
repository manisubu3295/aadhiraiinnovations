// Canonical menu lists — the single source of truth for both the sidebar (AdminLayout) and the
// Menu Access settings tab (SettingsPage), so they can never drift out of sync. `key` is what
// gets stored in Setting.adminMenuKeys/staffMenuKeys.
const SUPPORT_GROUP = {
  key: 'support',
  label: 'Support',
  children: [
    { key: 'tickets', to: '/admin/tickets', label: 'Tickets' },
    { key: 'licenses', to: '/admin/licenses', label: 'Licenses' },
  ],
}

export const ADMIN_MENU_ITEMS = [
  { key: 'dashboard', to: '/admin/dashboard', label: 'Dashboard' },
  { key: 'clients', to: '/admin/clients', label: 'Clients' },
  { key: 'projects', to: '/admin/projects', label: 'Projects' },
  { key: 'leads', to: '/admin/leads', label: 'Leads' },
  SUPPORT_GROUP,
  { key: 'whatsapp', to: '/admin/whatsapp', label: 'WhatsApp' },
  { key: 'whatsapp-flows', to: '/admin/whatsapp/flows', label: 'Chatbot Flows' },
  { key: 'quotations', to: '/admin/quotations', label: 'Quotations' },
  { key: 'invoices', to: '/admin/invoices', label: 'Invoices' },
  { key: 'timesheets', to: '/admin/timesheets', label: 'Timesheets' },
  { key: 'expenses', to: '/admin/expenses', label: 'Expense Claims' },
  { key: 'business-expenses', to: '/admin/business-expenses', label: 'Business Expenses' },
  { key: 'users', to: '/admin/users', label: 'Users' },
  { key: 'settings', to: '/admin/settings', label: 'Settings' },
]

export const STAFF_MENU_ITEMS = [
  SUPPORT_GROUP,
  { key: 'whatsapp', to: '/admin/whatsapp', label: 'WhatsApp' },
  { key: 'whatsapp-flows', to: '/admin/whatsapp/flows', label: 'Chatbot Flows' },
  { key: 'my-timesheet', to: '/admin/my-timesheet', label: 'My Timesheet' },
  { key: 'my-expenses', to: '/admin/my-expenses', label: 'My Expenses' },
  { key: 'my-projects', to: '/admin/my-projects', label: 'Projects' },
]

// Expands `children` into individual toggleable rows — used by the Menu Access settings tab,
// where a group (e.g. "Support") isn't itself a checkbox, only its children are.
export function flattenMenuItems(items) {
  return items.flatMap((item) => (item.children ? item.children : [item]))
}

// Empty list means "not configured yet" — show everything, so this mechanism can never lock
// someone out of a menu just because a SUPER_ADMIN never touched the settings tab. Groups
// (items with `children`) are filtered recursively and dropped entirely if left with no
// visible children.
export function filterMenuItems(items, enabledKeys) {
  if (!enabledKeys || enabledKeys.length === 0) return items
  const enabled = new Set(enabledKeys)
  return items.reduce((acc, item) => {
    if (item.children) {
      const children = item.children.filter((child) => enabled.has(child.key))
      if (children.length > 0) acc.push({ ...item, children })
      return acc
    }
    if (enabled.has(item.key)) acc.push(item)
    return acc
  }, [])
}
