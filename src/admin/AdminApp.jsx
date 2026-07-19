import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ClientsPage = lazy(() => import('./pages/ClientsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const QuotationsPage = lazy(() => import('./pages/QuotationsPage'))
const QuotationEditorPage = lazy(() => import('./pages/QuotationEditorPage'))
const InvoicesPage = lazy(() => import('./pages/InvoicesPage'))
const InvoiceEditorPage = lazy(() => import('./pages/InvoiceEditorPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const TimesheetsAdminPage = lazy(() => import('./pages/TimesheetsAdminPage'))
const ExpensesAdminPage = lazy(() => import('./pages/ExpensesAdminPage'))
const TicketsPage = lazy(() => import('./pages/TicketsPage'))
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage'))
const MyTimesheetPage = lazy(() => import('./pages/employee/MyTimesheetPage'))
const MyExpensesPage = lazy(() => import('./pages/employee/MyExpensesPage'))
const StaffProjectsPage = lazy(() => import('./pages/employee/StaffProjectsPage'))

function AdminLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1F3A]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <AdminLoader />
  if (!user || user.role === 'CLIENT') return <Navigate to="/admin/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') return <Navigate to="/admin/my-timesheet" replace />
  return children
}

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/admin/my-timesheet'} replace />
}

function AdminRoutes() {
  const { user, loading } = useAuth()

  return (
    <Routes>
      <Route
        path="login"
        element={
          loading ? (
            <AdminLoader />
          ) : user && user.role !== 'CLIENT' ? (
            <Navigate to="/admin" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<HomeRedirect />} />

        {/* Admin-only: clients, projects, billing, staff/expense review */}
        <Route path="dashboard" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><DashboardPage /></Suspense></RequireAdmin>} />
        <Route path="clients" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><ClientsPage /></Suspense></RequireAdmin>} />
        <Route path="projects" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><ProjectsPage /></Suspense></RequireAdmin>} />
        <Route path="projects/:id" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><ProjectDetailPage /></Suspense></RequireAdmin>} />
        <Route path="quotations" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><QuotationsPage /></Suspense></RequireAdmin>} />
        <Route path="quotations/new" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><QuotationEditorPage /></Suspense></RequireAdmin>} />
        <Route path="quotations/:id" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><QuotationEditorPage /></Suspense></RequireAdmin>} />
        <Route path="invoices" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><InvoicesPage /></Suspense></RequireAdmin>} />
        <Route path="invoices/new" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><InvoiceEditorPage /></Suspense></RequireAdmin>} />
        <Route path="invoices/:id" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><InvoiceEditorPage /></Suspense></RequireAdmin>} />
        <Route path="timesheets" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><TimesheetsAdminPage /></Suspense></RequireAdmin>} />
        <Route path="expenses" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><ExpensesAdminPage /></Suspense></RequireAdmin>} />
        <Route path="users" element={<RequireAdmin><Suspense fallback={<AdminLoader />}><UsersPage /></Suspense></RequireAdmin>} />

        {/* Available to both roles: employee self-service + tickets */}
        <Route path="tickets" element={<Suspense fallback={<AdminLoader />}><TicketsPage /></Suspense>} />
        <Route path="tickets/:id" element={<Suspense fallback={<AdminLoader />}><TicketDetailPage /></Suspense>} />
        <Route path="my-timesheet" element={<Suspense fallback={<AdminLoader />}><MyTimesheetPage /></Suspense>} />
        <Route path="my-expenses" element={<Suspense fallback={<AdminLoader />}><MyExpensesPage /></Suspense>} />
        <Route path="my-projects" element={<Suspense fallback={<AdminLoader />}><StaffProjectsPage /></Suspense>} />

        <Route path="*" element={<HomeRedirect />} />
      </Route>
    </Routes>
  )
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  )
}
