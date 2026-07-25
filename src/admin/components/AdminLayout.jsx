import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { ADMIN_MENU_ITEMS, STAFF_MENU_ITEMS, filterMenuItems } from '../menuConfig'

function linkClasses({ isActive }) {
  return `block rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dueFollowUps, setDueFollowUps] = useState(0)
  const [permissions, setPermissions] = useState({ adminMenuKeys: [], staffMenuKeys: [] })
  const isAdminTier = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    api.get('/menu-permissions').then((data) => setPermissions(data.permissions)).catch(() => {})
  }, [])

  // SUPER_ADMIN is never restricted by the configured menu lists — only ADMIN/STAFF are.
  const navItems =
    user?.role === 'SUPER_ADMIN'
      ? ADMIN_MENU_ITEMS
      : isAdminTier
        ? filterMenuItems(ADMIN_MENU_ITEMS, permissions.adminMenuKeys)
        : filterMenuItems(STAFF_MENU_ITEMS, permissions.staffMenuKeys)

  useEffect(() => {
    if (!isAdminTier) return
    function poll() {
      api.get('/admin/leads/reminders/count').then((data) => setDueFollowUps(data.count)).catch(() => {})
    }
    poll()
    const interval = setInterval(poll, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isAdminTier])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <header className="flex items-center justify-between bg-[#0B1F3A] px-4 py-3 text-white md:hidden">
        <span className="text-lg font-semibold">Aadhirai Admin</span>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 bg-[#0B1F3A] text-white flex flex-col transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 text-lg font-semibold border-b border-white/10">
          Aadhirai Admin
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses} onClick={() => setSidebarOpen(false)}>
              <span className="flex items-center justify-between">
                {item.label}
                {item.to === '/admin/leads' && dueFollowUps > 0 && (
                  <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-[#0B1F3A]">
                    {dueFollowUps}
                  </span>
                )}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-sm">
          <div className="text-white/60 truncate">{user?.email}</div>
          <button onClick={logout} className="mt-2 text-white/80 hover:text-white underline">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
