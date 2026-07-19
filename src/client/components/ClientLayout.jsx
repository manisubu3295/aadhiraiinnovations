import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../admin/AuthContext'

const navItems = [
  { to: '/portal/tickets', label: 'My Tickets' },
  { to: '/portal/tickets/new', label: 'Raise a Ticket' },
]

function linkClasses({ isActive }) {
  return `block rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`
}

export default function ClientLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-60 shrink-0 bg-[#0B1F3A] text-white flex flex-col">
        <div className="px-5 py-5 text-lg font-semibold border-b border-white/10">
          Aadhirai Client Portal
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/portal/tickets'} className={linkClasses}>
              {item.label}
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
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
