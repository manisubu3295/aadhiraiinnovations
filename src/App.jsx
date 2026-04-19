import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import FounderPage from './pages/FounderPage'

/* Lazy-load all sub-pages — keeps initial bundle small */
const PharmacySoftwarePage = lazy(() => import('./pages/PharmacySoftwarePage'))
const ErpAutomationPage    = lazy(() => import('./pages/ErpAutomationPage'))
const MedoraPlusPage       = lazy(() => import('./pages/MedoraPlusPage'))
const HrInventoryPage      = lazy(() => import('./pages/HrInventoryPage'))
const WorkforceManagerPage = lazy(() => import('./pages/WorkforceManagerPage'))
const PosSystemPage        = lazy(() => import('./pages/PosSystemPage'))
const BlogPostPage         = lazy(() => import('./pages/BlogPostPage'))
const ProductPage          = lazy(() => import('./pages/ProductPage'))
const LocalSEOPage         = lazy(() => import('./pages/LocalSEOPage'))
const GstCalculatorPage    = lazy(() => import('./pages/GstCalculatorPage'))
const ToolsHubPage         = lazy(() => import('./pages/ToolsHubPage'))
const DocxToPdfPage        = lazy(() => import('./pages/DocxToPdfPage'))
const PdfToDocxPage        = lazy(() => import('./pages/PdfToDocxPage'))
const PdfEditorPage        = lazy(() => import('./pages/PdfEditorPage'))
// Developer Tools
const JsonFormatterPage    = lazy(() => import('./pages/JsonFormatterPage'))
const XmlFormatterPage     = lazy(() => import('./pages/XmlFormatterPage'))
const TextFormatterPage    = lazy(() => import('./pages/TextFormatterPage'))
const JsonToXmlPage        = lazy(() => import('./pages/JsonToXmlPage'))
const XmlToJsonPage        = lazy(() => import('./pages/XmlToJsonPage'))
const LearnHubPage              = lazy(() => import('./pages/LearnHubPage'))
const JavaDsaPage               = lazy(() => import('./pages/JavaDsaPage'))
const JavaDsaArraysPage         = lazy(() => import('./pages/JavaDsaArraysPage'))
const JavaDsaLinkedListPage     = lazy(() => import('./pages/JavaDsaLinkedListPage'))
const JavaDsaStackPage          = lazy(() => import('./pages/JavaDsaStackPage'))
const JavaDsaQueuePage          = lazy(() => import('./pages/JavaDsaQueuePage'))
const JavaDsaBinarySearchPage   = lazy(() => import('./pages/JavaDsaBinarySearchPage'))
const JavaDsaRecursionPage      = lazy(() => import('./pages/JavaDsaRecursionPage'))

/* Spinner while lazy chunks load */
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
          element={<Suspense fallback={<PageLoader />}><PharmacySoftwarePage /></Suspense>}
        />
        <Route
          path="/solutions/erp-automation"
          element={<Suspense fallback={<PageLoader />}><ErpAutomationPage /></Suspense>}
        />

        {/* Dedicated product pages */}
        <Route
          path="/products/medora-plus"
          element={<Suspense fallback={<PageLoader />}><MedoraPlusPage /></Suspense>}
        />
        <Route
          path="/products/hr-inventory"
          element={<Suspense fallback={<PageLoader />}><HrInventoryPage /></Suspense>}
        />
        <Route
          path="/products/workforce-manager"
          element={<Suspense fallback={<PageLoader />}><WorkforceManagerPage /></Suspense>}
        />
        <Route
          path="/products/pos-system"
          element={<Suspense fallback={<PageLoader />}><PosSystemPage /></Suspense>}
        />

        {/* Generic product pages — driven by products.js data */}
        {/* NOTE: this must come AFTER dedicated routes so that specific routes win */}
        <Route
          path="/products/:slug"
          element={<Suspense fallback={<PageLoader />}><ProductPage /></Suspense>}
        />

        {/* Blog posts */}
        <Route
          path="/blog/:slug"
          element={<Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense>}
        />

        {/* Local SEO city pages — pharmacy software in {city} */}
        {/* e.g. /pharmacy-billing-software/peravurani, /pharmacy-billing-software/thanjavur */}
        <Route
          path="/pharmacy-billing-software/:city"
          element={<Suspense fallback={<PageLoader />}><LocalSEOPage /></Suspense>}
        />

        {/* Free Tools */}
        <Route
          path="/tools"
          element={<Suspense fallback={<PageLoader />}><ToolsHubPage /></Suspense>}
        />
        <Route
          path="/tools/gst-calculator"
          element={<Suspense fallback={<PageLoader />}><GstCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/docx-to-pdf-converter"
          element={<Suspense fallback={<PageLoader />}><DocxToPdfPage /></Suspense>}
        />
        <Route
          path="/tools/pdf-to-docx-converter"
          element={<Suspense fallback={<PageLoader />}><PdfToDocxPage /></Suspense>}
        />
        <Route
          path="/tools/pdf-editor"
          element={<Suspense fallback={<PageLoader />}><PdfEditorPage /></Suspense>}
        />

        {/* Developer Tools */}
        <Route
          path="/tools/json-formatter"
          element={<Suspense fallback={<PageLoader />}><JsonFormatterPage /></Suspense>}
        />
        <Route
          path="/tools/xml-formatter"
          element={<Suspense fallback={<PageLoader />}><XmlFormatterPage /></Suspense>}
        />
        <Route
          path="/tools/text-formatter"
          element={<Suspense fallback={<PageLoader />}><TextFormatterPage /></Suspense>}
        />
        <Route
          path="/tools/json-to-xml"
          element={<Suspense fallback={<PageLoader />}><JsonToXmlPage /></Suspense>}
        />
        <Route
          path="/tools/xml-to-json"
          element={<Suspense fallback={<PageLoader />}><XmlToJsonPage /></Suspense>}
        />

        {/* Learn Section */}
        <Route path="/learn" element={<Suspense fallback={<PageLoader />}><LearnHubPage /></Suspense>} />
        <Route path="/learn/java-dsa" element={<Suspense fallback={<PageLoader />}><JavaDsaPage /></Suspense>} />
        <Route path="/learn/java-dsa/arrays" element={<Suspense fallback={<PageLoader />}><JavaDsaArraysPage /></Suspense>} />
        <Route path="/learn/java-dsa/linked-list" element={<Suspense fallback={<PageLoader />}><JavaDsaLinkedListPage /></Suspense>} />
        <Route path="/learn/java-dsa/stack" element={<Suspense fallback={<PageLoader />}><JavaDsaStackPage /></Suspense>} />
        <Route path="/learn/java-dsa/queue" element={<Suspense fallback={<PageLoader />}><JavaDsaQueuePage /></Suspense>} />
        <Route path="/learn/java-dsa/binary-search" element={<Suspense fallback={<PageLoader />}><JavaDsaBinarySearchPage /></Suspense>} />
        <Route path="/learn/java-dsa/recursion" element={<Suspense fallback={<PageLoader />}><JavaDsaRecursionPage /></Suspense>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}

export default App
