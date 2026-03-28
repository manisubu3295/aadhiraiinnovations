import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import FounderPage from './pages/FounderPage'

/* Lazy-load solution/product pages — keeps initial bundle small */
const PharmacySoftwarePage = lazy(() => import('./pages/PharmacySoftwarePage'))
const ErpAutomationPage     = lazy(() => import('./pages/ErpAutomationPage'))
const MedoraPlusPage        = lazy(() => import('./pages/MedoraPlusPage'))

/* Minimal fallback while lazy chunks load */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#0B1F3A]" />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {/* Core pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/founder" element={<FounderPage />} />

        {/* Solution pages */}
        <Route
          path="/solutions/pharmacy-software"
          element={
            <Suspense fallback={<PageLoader />}>
              <PharmacySoftwarePage />
            </Suspense>
          }
        />
        <Route
          path="/solutions/erp-automation"
          element={
            <Suspense fallback={<PageLoader />}>
              <ErpAutomationPage />
            </Suspense>
          }
        />

        {/* Product pages */}
        <Route
          path="/products/medora-plus"
          element={
            <Suspense fallback={<PageLoader />}>
              <MedoraPlusPage />
            </Suspense>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
