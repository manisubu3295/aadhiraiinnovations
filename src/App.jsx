import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import FounderPage from './pages/FounderPage'
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const AboutPage    = lazy(() => import('./pages/AboutPage'))
const ContactPage  = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage    = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage   = lazy(() => import('./pages/TermsOfServicePage'))
const RefundPolicyPage     = lazy(() => import('./pages/RefundPolicyPage'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const ClientApp = lazy(() => import('./client/ClientApp'))

/* Lazy-load all sub-pages — keeps initial bundle small */
// Business Tools
const BusinessToolsHubPage = lazy(() => import('./business-tools/BusinessToolsHubPage'));
const PharmacySoftwarePage = lazy(() => import('./pages/PharmacySoftwarePage'))
const ErpAutomationPage    = lazy(() => import('./pages/ErpAutomationPage'))
const MedoraPlusPage       = lazy(() => import('./pages/MedoraPlusPage'))
const MedoraOfflinePage    = lazy(() => import('./pages/MedoraOfflinePage'))
const HrInventoryPage      = lazy(() => import('./pages/HrInventoryPage'))
const WorkforceManagerPage = lazy(() => import('./pages/WorkforceManagerPage'))
const PosSystemPage        = lazy(() => import('./pages/PosSystemPage'))
const BlogPostPage         = lazy(() => import('./pages/BlogPostPage'))
const ProductPage          = lazy(() => import('./pages/ProductPage'))
const LocalSEOPage         = lazy(() => import('./pages/LocalSEOPage'))
const PharmacyLocationsHubPage = lazy(() => import('./pages/PharmacyLocationsHubPage'))
const StateSEOPage         = lazy(() => import('./pages/StateSEOPage'))
const GstCalculatorPage    = lazy(() => import('./pages/GstCalculatorPage'))
const ToolsHubPage         = lazy(() => import('./pages/ToolsHubPage'))
const DocxToPdfPage        = lazy(() => import('./pages/DocxToPdfPage'))
const PdfToDocxPage        = lazy(() => import('./pages/PdfToDocxPage'))
const PdfEditorPage        = lazy(() => import('./pages/PdfEditorPage'))
const InlineDocumentBuilderPage = lazy(() => import('./business-tools/InlineDocumentBuilderPage'))
// Developer Tools
const JsonFormatterPage    = lazy(() => import('./pages/JsonFormatterPage'))
const XmlFormatterPage     = lazy(() => import('./pages/XmlFormatterPage'))
const TextFormatterPage    = lazy(() => import('./pages/TextFormatterPage'))
const JsonToXmlPage        = lazy(() => import('./pages/JsonToXmlPage'))
const XmlToJsonPage        = lazy(() => import('./pages/XmlToJsonPage'))
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
      {/* Admin — gated, own layout, deliberately outside SiteLayout's public Header/Footer/SEO */}
      <Route path="/admin/*" element={<Suspense fallback={<PageLoader />}><AdminApp /></Suspense>} />

      {/* Client portal — gated, own layout, outside SiteLayout */}
      <Route path="/portal/*" element={<Suspense fallback={<PageLoader />}><ClientApp /></Suspense>} />

      <Route element={<SiteLayout />}>

        {/* Core pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/founder" element={<FounderPage />} />
        <Route path="/services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="/privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="/terms-of-service" element={<Suspense fallback={<PageLoader />}><TermsOfServicePage /></Suspense>} />
        <Route path="/refund-policy" element={<Suspense fallback={<PageLoader />}><RefundPolicyPage /></Suspense>} />

        {/* Business Tools */}
        <Route
          path="/business-tools"
          element={<Suspense fallback={<PageLoader />}><BusinessToolsHubPage /></Suspense>}
        />
        <Route
          path="/document-builder"
          element={<Suspense fallback={<PageLoader />}><InlineDocumentBuilderPage /></Suspense>}
        />

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
          path="/products/medora-offline"
          element={<Suspense fallback={<PageLoader />}><MedoraOfflinePage /></Suspense>}
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

        {/* National pharmacy-software local SEO — hub -> state -> district. More specific
            routes (hub, state) must come before the single-segment :city catch-all. */}
        <Route
          path="/pharmacy-billing-software"
          element={<Suspense fallback={<PageLoader />}><PharmacyLocationsHubPage /></Suspense>}
        />
        <Route
          path="/pharmacy-billing-software/state/:stateSlug"
          element={<Suspense fallback={<PageLoader />}><StateSEOPage /></Suspense>}
        />
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}

export default App
