import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../admin/AuthContext'
import ClientLayout from './components/ClientLayout'
import ClientLoginPage from './pages/ClientLoginPage'

const TicketsListPage = lazy(() => import('./pages/TicketsListPage'))
const NewTicketPage = lazy(() => import('./pages/NewTicketPage'))
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage'))

function PortalLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1F3A]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  )
}

function RequireClient({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PortalLoader />
  if (!user || user.role !== 'CLIENT') return <Navigate to="/portal/login" replace />
  return children
}

function ClientRoutes() {
  const { user, loading } = useAuth()

  return (
    <Routes>
      <Route
        path="login"
        element={
          loading ? (
            <PortalLoader />
          ) : user?.role === 'CLIENT' ? (
            <Navigate to="/portal/tickets" replace />
          ) : (
            <ClientLoginPage />
          )
        }
      />
      <Route
        element={
          <RequireClient>
            <ClientLayout />
          </RequireClient>
        }
      >
        <Route index element={<Navigate to="/portal/tickets" replace />} />
        <Route path="tickets" element={<Suspense fallback={<PortalLoader />}><TicketsListPage /></Suspense>} />
        <Route path="tickets/new" element={<Suspense fallback={<PortalLoader />}><NewTicketPage /></Suspense>} />
        <Route path="tickets/:id" element={<Suspense fallback={<PortalLoader />}><TicketDetailPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/portal/tickets" replace />} />
      </Route>
    </Routes>
  )
}

export default function ClientApp() {
  return (
    <AuthProvider>
      <ClientRoutes />
    </AuthProvider>
  )
}
