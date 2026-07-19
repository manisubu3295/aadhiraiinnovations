import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import FounderPage from './pages/FounderPage'
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const AboutPage    = lazy(() => import('./pages/AboutPage'))
const ContactPage  = lazy(() => import('./pages/ContactPage'))
import LessonLayout from './course/components/LessonLayout';
import StepFlow from './course/components/StepFlow';
const AdminApp = lazy(() => import('./admin/AdminApp'))
const ClientApp = lazy(() => import('./client/ClientApp'))

/* Lazy-load all sub-pages — keeps initial bundle small */
// Business Tools
const BusinessToolsHubPage = lazy(() => import('./business-tools/BusinessToolsHubPage'));
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
const InlineDocumentBuilderPage = lazy(() => import('./business-tools/InlineDocumentBuilderPage'))
// Developer Tools
const JsonFormatterPage    = lazy(() => import('./pages/JsonFormatterPage'))
const XmlFormatterPage     = lazy(() => import('./pages/XmlFormatterPage'))
const TextFormatterPage    = lazy(() => import('./pages/TextFormatterPage'))
const JsonToXmlPage        = lazy(() => import('./pages/JsonToXmlPage'))
const XmlToJsonPage        = lazy(() => import('./pages/XmlToJsonPage'))
const LearnHubPage              = lazy(() => import('./pages/LearnHubPage'))
const JavaDsaPage               = lazy(() => import('./pages/JavaDsaPage'))
const JavaDsaArraysInteractivePage = lazy(() => import('./pages/JavaDsaArraysInteractivePage'))
const JavaDsaLinkedListPage     = lazy(() => import('./pages/JavaDsaLinkedListPage'))
const JavaDsaStackPage          = lazy(() => import('./pages/JavaDsaStackPage'))
const JavaDsaQueuePage          = lazy(() => import('./pages/JavaDsaQueuePage'))
const JavaDsaBinarySearchPage   = lazy(() => import('./pages/JavaDsaBinarySearchPage'))
const JavaDsaRecursionPage      = lazy(() => import('./pages/JavaDsaRecursionPage'))
const CourseArraysPage          = lazy(() => import('./course/CourseArraysPage'))
const CourseLinkedListPage      = lazy(() => import('./course/CourseLinkedListPage'))
const CourseStackPage           = lazy(() => import('./course/CourseStackPage'))
const CourseQueuePage           = lazy(() => import('./course/CourseQueuePage'))
const CourseBinarySearchPage    = lazy(() => import('./course/CourseBinarySearchPage'))
const CourseRecursionPage       = lazy(() => import('./course/CourseRecursionPage'))
// New DSA lessons
const JavaDsaBigOPage           = lazy(() => import('./pages/JavaDsaBigOPage'))
const JavaDsaStringsPage        = lazy(() => import('./pages/JavaDsaStringsPage'))
const JavaDsaHashMapsPage       = lazy(() => import('./pages/JavaDsaHashMapsPage'))
const JavaDsaBubbleSortPage     = lazy(() => import('./pages/JavaDsaBubbleSortPage'))
const JavaDsaMergeSortPage      = lazy(() => import('./pages/JavaDsaMergeSortPage'))
const JavaDsaBinaryTreesPage    = lazy(() => import('./pages/JavaDsaBinaryTreesPage'))
const CourseBigOPage            = lazy(() => import('./course/CourseBigOPage'))
const CourseStringsPage         = lazy(() => import('./course/CourseStringsPage'))
const CourseHashMapsPage        = lazy(() => import('./course/CourseHashMapsPage'))
const CourseBubbleSortPage      = lazy(() => import('./course/CourseBubbleSortPage'))
const CourseMergeSortPage       = lazy(() => import('./course/CourseMergeSortPage'))
const CourseBinaryTreesPage     = lazy(() => import('./course/CourseBinaryTreesPage'))

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

        {/* Learn Section — all lessons */}
        <Route path="/learn" element={<Suspense fallback={<PageLoader />}><LearnHubPage /></Suspense>} />
        <Route path="/learn/java-dsa" element={<Suspense fallback={<PageLoader />}><JavaDsaPage /></Suspense>} />
        <Route path="/learn/java-dsa/arrays" element={<Suspense fallback={<PageLoader />}><JavaDsaArraysInteractivePage /></Suspense>} />
        <Route path="/learn/java-dsa/linked-list" element={<Suspense fallback={<PageLoader />}><JavaDsaLinkedListPage /></Suspense>} />
        <Route path="/learn/java-dsa/stack" element={<Suspense fallback={<PageLoader />}><JavaDsaStackPage /></Suspense>} />
        <Route path="/learn/java-dsa/queue" element={<Suspense fallback={<PageLoader />}><JavaDsaQueuePage /></Suspense>} />
        <Route path="/learn/java-dsa/binary-search" element={<Suspense fallback={<PageLoader />}><JavaDsaBinarySearchPage /></Suspense>} />
        <Route path="/learn/java-dsa/recursion" element={<Suspense fallback={<PageLoader />}><JavaDsaRecursionPage /></Suspense>} />
        <Route path="/learn/java-dsa/big-o" element={<Suspense fallback={<PageLoader />}><JavaDsaBigOPage /></Suspense>} />
        <Route path="/learn/java-dsa/strings" element={<Suspense fallback={<PageLoader />}><JavaDsaStringsPage /></Suspense>} />
        <Route path="/learn/java-dsa/hash-maps" element={<Suspense fallback={<PageLoader />}><JavaDsaHashMapsPage /></Suspense>} />
        <Route path="/learn/java-dsa/bubble-sort" element={<Suspense fallback={<PageLoader />}><JavaDsaBubbleSortPage /></Suspense>} />
        <Route path="/learn/java-dsa/merge-sort" element={<Suspense fallback={<PageLoader />}><JavaDsaMergeSortPage /></Suspense>} />
        <Route path="/learn/java-dsa/binary-trees" element={<Suspense fallback={<PageLoader />}><JavaDsaBinaryTreesPage /></Suspense>} />

        {/* Course mode — all lessons */}
        <Route path="/course/java-dsa/arrays" element={<Suspense fallback={<PageLoader />}><CourseArraysPage /></Suspense>} />
        <Route path="/course/java-dsa/linked-list" element={<Suspense fallback={<PageLoader />}><CourseLinkedListPage /></Suspense>} />
        <Route path="/course/java-dsa/stack" element={<Suspense fallback={<PageLoader />}><CourseStackPage /></Suspense>} />
        <Route path="/course/java-dsa/queue" element={<Suspense fallback={<PageLoader />}><CourseQueuePage /></Suspense>} />
        <Route path="/course/java-dsa/binary-search" element={<Suspense fallback={<PageLoader />}><CourseBinarySearchPage /></Suspense>} />
        <Route path="/course/java-dsa/recursion" element={<Suspense fallback={<PageLoader />}><CourseRecursionPage /></Suspense>} />
        <Route path="/course/java-dsa/big-o" element={<Suspense fallback={<PageLoader />}><CourseBigOPage /></Suspense>} />
        <Route path="/course/java-dsa/strings" element={<Suspense fallback={<PageLoader />}><CourseStringsPage /></Suspense>} />
        <Route path="/course/java-dsa/hash-maps" element={<Suspense fallback={<PageLoader />}><CourseHashMapsPage /></Suspense>} />
        <Route path="/course/java-dsa/bubble-sort" element={<Suspense fallback={<PageLoader />}><CourseBubbleSortPage /></Suspense>} />
        <Route path="/course/java-dsa/merge-sort" element={<Suspense fallback={<PageLoader />}><CourseMergeSortPage /></Suspense>} />
        <Route path="/course/java-dsa/binary-trees" element={<Suspense fallback={<PageLoader />}><CourseBinaryTreesPage /></Suspense>} />

        {/* Course pages */}
        <Route
          path="/course/arrays"
          element={
            <LessonLayout>
              <StepFlow />
            </LessonLayout>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}

export default App
