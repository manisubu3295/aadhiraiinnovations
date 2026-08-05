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
const ForumSection = lazy(() => import('./forum/ForumSection'))

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
const BillingPage          = lazy(() => import('./pages/BillingPage'))
const BlogPostPage         = lazy(() => import('./pages/BlogPostPage'))
const BlogIndexPage        = lazy(() => import('./pages/BlogIndexPage'))
const CaseStudiesPage      = lazy(() => import('./pages/CaseStudiesPage'))
const PricingPage          = lazy(() => import('./pages/PricingPage'))
const CareersPage          = lazy(() => import('./pages/CareersPage'))
const ResourcesPage        = lazy(() => import('./pages/ResourcesPage'))
const ProductPage          = lazy(() => import('./pages/ProductPage'))
const LocalSEOPage         = lazy(() => import('./pages/LocalSEOPage'))
const PharmacyLocationsHubPage = lazy(() => import('./pages/PharmacyLocationsHubPage'))
const StateSEOPage         = lazy(() => import('./pages/StateSEOPage'))
const GstCalculatorPage    = lazy(() => import('./pages/GstCalculatorPage'))
const AmountToWordsPage    = lazy(() => import('./pages/AmountToWordsPage'))
const EmiCalculatorPage    = lazy(() => import('./pages/EmiCalculatorPage'))
const QrCodeGeneratorPage  = lazy(() => import('./pages/QrCodeGeneratorPage'))
const BarcodeGeneratorPage = lazy(() => import('./pages/BarcodeGeneratorPage'))
const ImageCompressorPage  = lazy(() => import('./pages/ImageCompressorPage'))
const PasswordGeneratorPage = lazy(() => import('./pages/PasswordGeneratorPage'))
const UnitConverterPage    = lazy(() => import('./pages/UnitConverterPage'))
const CurrencyConverterPage = lazy(() => import('./pages/CurrencyConverterPage'))
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
const Base64EncoderDecoderPage = lazy(() => import('./pages/Base64EncoderDecoderPage'))
const UrlEncoderDecoderPage    = lazy(() => import('./pages/UrlEncoderDecoderPage'))
const TimestampConverterPage   = lazy(() => import('./pages/TimestampConverterPage'))
const UuidGeneratorPage        = lazy(() => import('./pages/UuidGeneratorPage'))
const CaseConverterPage        = lazy(() => import('./pages/CaseConverterPage'))
const WordCounterPage          = lazy(() => import('./pages/WordCounterPage'))
// Business Tools (calculators)
const PercentageCalculatorPage = lazy(() => import('./pages/PercentageCalculatorPage'))
const DiscountCalculatorPage   = lazy(() => import('./pages/DiscountCalculatorPage'))
const TdsCalculatorPage        = lazy(() => import('./pages/TdsCalculatorPage'))
const HsnSacLookupPage         = lazy(() => import('./pages/HsnSacLookupPage'))
// PDF Tools
const MergePdfPage    = lazy(() => import('./pages/MergePdfPage'))
const SplitPdfPage    = lazy(() => import('./pages/SplitPdfPage'))
const ImageToPdfPage  = lazy(() => import('./pages/ImageToPdfPage'))
const PdfToImagePage  = lazy(() => import('./pages/PdfToImagePage'))
// Utilities
const AgeCalculatorPage            = lazy(() => import('./pages/AgeCalculatorPage'))
const DateDifferenceCalculatorPage = lazy(() => import('./pages/DateDifferenceCalculatorPage'))
// Batch 3 — Finance & Business
const CompoundInterestCalculatorPage = lazy(() => import('./pages/CompoundInterestCalculatorPage'))
const SimpleInterestCalculatorPage   = lazy(() => import('./pages/SimpleInterestCalculatorPage'))
const SipCalculatorPage              = lazy(() => import('./pages/SipCalculatorPage'))
const SalaryCtcCalculatorPage        = lazy(() => import('./pages/SalaryCtcCalculatorPage'))
const GstinValidatorPage             = lazy(() => import('./pages/GstinValidatorPage'))
const LoanComparisonCalculatorPage   = lazy(() => import('./pages/LoanComparisonCalculatorPage'))
// Batch 3 — PDF cluster
const PdfCompressorPage    = lazy(() => import('./pages/PdfCompressorPage'))
const WatermarkPdfPage     = lazy(() => import('./pages/WatermarkPdfPage'))
const PdfPageNumbersPage   = lazy(() => import('./pages/PdfPageNumbersPage'))
// Batch 3 — Developer tools
const JwtDecoderPage           = lazy(() => import('./pages/JwtDecoderPage'))
const RegexTesterPage          = lazy(() => import('./pages/RegexTesterPage'))
const TextDiffCheckerPage      = lazy(() => import('./pages/TextDiffCheckerPage'))
const ColorConverterPage       = lazy(() => import('./pages/ColorConverterPage'))
const SlugGeneratorPage        = lazy(() => import('./pages/SlugGeneratorPage'))
const CronExplainerPage        = lazy(() => import('./pages/CronExplainerPage'))
const LoremIpsumGeneratorPage  = lazy(() => import('./pages/LoremIpsumGeneratorPage'))
// Batch 3 — SEO/marketing utilities
const MetaTagGeneratorPage   = lazy(() => import('./pages/MetaTagGeneratorPage'))
const RobotsTxtGeneratorPage = lazy(() => import('./pages/RobotsTxtGeneratorPage'))
const OpenGraphPreviewPage   = lazy(() => import('./pages/OpenGraphPreviewPage'))
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

        {/* Community forum — public browsing, forum-login gated posting (see src/forum/ForumSection.jsx) */}
        <Route path="/forum/*" element={<Suspense fallback={<PageLoader />}><ForumSection /></Suspense>} />

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
        <Route
          path="/products/billing"
          element={<Suspense fallback={<PageLoader />}><BillingPage /></Suspense>}
        />

        {/* Generic product pages — driven by products.js data */}
        {/* NOTE: this must come AFTER dedicated routes so that specific routes win */}
        <Route
          path="/products/:slug"
          element={<Suspense fallback={<PageLoader />}><ProductPage /></Suspense>}
        />

        {/* Blog */}
        <Route
          path="/blog"
          element={<Suspense fallback={<PageLoader />}><BlogIndexPage /></Suspense>}
        />
        <Route
          path="/blog/:slug"
          element={<Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense>}
        />

        {/* Case studies, pricing, careers, resources */}
        <Route
          path="/case-studies"
          element={<Suspense fallback={<PageLoader />}><CaseStudiesPage /></Suspense>}
        />
        <Route
          path="/pricing"
          element={<Suspense fallback={<PageLoader />}><PricingPage /></Suspense>}
        />
        <Route
          path="/careers"
          element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>}
        />
        <Route
          path="/resources"
          element={<Suspense fallback={<PageLoader />}><ResourcesPage /></Suspense>}
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
          path="/tools/amount-to-words"
          element={<Suspense fallback={<PageLoader />}><AmountToWordsPage /></Suspense>}
        />
        <Route
          path="/tools/emi-calculator"
          element={<Suspense fallback={<PageLoader />}><EmiCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/percentage-calculator"
          element={<Suspense fallback={<PageLoader />}><PercentageCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/discount-calculator"
          element={<Suspense fallback={<PageLoader />}><DiscountCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/tds-calculator"
          element={<Suspense fallback={<PageLoader />}><TdsCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/hsn-sac-lookup"
          element={<Suspense fallback={<PageLoader />}><HsnSacLookupPage /></Suspense>}
        />
        <Route
          path="/tools/compound-interest-calculator"
          element={<Suspense fallback={<PageLoader />}><CompoundInterestCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/simple-interest-calculator"
          element={<Suspense fallback={<PageLoader />}><SimpleInterestCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/sip-calculator"
          element={<Suspense fallback={<PageLoader />}><SipCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/salary-ctc-calculator"
          element={<Suspense fallback={<PageLoader />}><SalaryCtcCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/gstin-validator"
          element={<Suspense fallback={<PageLoader />}><GstinValidatorPage /></Suspense>}
        />
        <Route
          path="/tools/loan-comparison-calculator"
          element={<Suspense fallback={<PageLoader />}><LoanComparisonCalculatorPage /></Suspense>}
        />

        {/* Utilities */}
        <Route
          path="/tools/qr-code-generator"
          element={<Suspense fallback={<PageLoader />}><QrCodeGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/barcode-generator"
          element={<Suspense fallback={<PageLoader />}><BarcodeGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/image-compressor"
          element={<Suspense fallback={<PageLoader />}><ImageCompressorPage /></Suspense>}
        />
        <Route
          path="/tools/password-generator"
          element={<Suspense fallback={<PageLoader />}><PasswordGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/unit-converter"
          element={<Suspense fallback={<PageLoader />}><UnitConverterPage /></Suspense>}
        />
        <Route
          path="/tools/currency-converter"
          element={<Suspense fallback={<PageLoader />}><CurrencyConverterPage /></Suspense>}
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
        <Route
          path="/tools/merge-pdf"
          element={<Suspense fallback={<PageLoader />}><MergePdfPage /></Suspense>}
        />
        <Route
          path="/tools/split-pdf"
          element={<Suspense fallback={<PageLoader />}><SplitPdfPage /></Suspense>}
        />
        <Route
          path="/tools/image-to-pdf"
          element={<Suspense fallback={<PageLoader />}><ImageToPdfPage /></Suspense>}
        />
        <Route
          path="/tools/pdf-to-image"
          element={<Suspense fallback={<PageLoader />}><PdfToImagePage /></Suspense>}
        />
        <Route
          path="/tools/age-calculator"
          element={<Suspense fallback={<PageLoader />}><AgeCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/date-difference-calculator"
          element={<Suspense fallback={<PageLoader />}><DateDifferenceCalculatorPage /></Suspense>}
        />
        <Route
          path="/tools/pdf-compressor"
          element={<Suspense fallback={<PageLoader />}><PdfCompressorPage /></Suspense>}
        />
        <Route
          path="/tools/watermark-pdf"
          element={<Suspense fallback={<PageLoader />}><WatermarkPdfPage /></Suspense>}
        />
        <Route
          path="/tools/pdf-page-numbers"
          element={<Suspense fallback={<PageLoader />}><PdfPageNumbersPage /></Suspense>}
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
        <Route
          path="/tools/base64-encoder-decoder"
          element={<Suspense fallback={<PageLoader />}><Base64EncoderDecoderPage /></Suspense>}
        />
        <Route
          path="/tools/url-encoder-decoder"
          element={<Suspense fallback={<PageLoader />}><UrlEncoderDecoderPage /></Suspense>}
        />
        <Route
          path="/tools/timestamp-converter"
          element={<Suspense fallback={<PageLoader />}><TimestampConverterPage /></Suspense>}
        />
        <Route
          path="/tools/uuid-generator"
          element={<Suspense fallback={<PageLoader />}><UuidGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/case-converter"
          element={<Suspense fallback={<PageLoader />}><CaseConverterPage /></Suspense>}
        />
        <Route
          path="/tools/word-counter"
          element={<Suspense fallback={<PageLoader />}><WordCounterPage /></Suspense>}
        />
        <Route
          path="/tools/jwt-decoder"
          element={<Suspense fallback={<PageLoader />}><JwtDecoderPage /></Suspense>}
        />
        <Route
          path="/tools/regex-tester"
          element={<Suspense fallback={<PageLoader />}><RegexTesterPage /></Suspense>}
        />
        <Route
          path="/tools/text-diff-checker"
          element={<Suspense fallback={<PageLoader />}><TextDiffCheckerPage /></Suspense>}
        />
        <Route
          path="/tools/color-converter"
          element={<Suspense fallback={<PageLoader />}><ColorConverterPage /></Suspense>}
        />
        <Route
          path="/tools/slug-generator"
          element={<Suspense fallback={<PageLoader />}><SlugGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/cron-explainer"
          element={<Suspense fallback={<PageLoader />}><CronExplainerPage /></Suspense>}
        />
        <Route
          path="/tools/lorem-ipsum-generator"
          element={<Suspense fallback={<PageLoader />}><LoremIpsumGeneratorPage /></Suspense>}
        />

        {/* SEO / Marketing Utilities */}
        <Route
          path="/tools/meta-tag-generator"
          element={<Suspense fallback={<PageLoader />}><MetaTagGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/robots-txt-generator"
          element={<Suspense fallback={<PageLoader />}><RobotsTxtGeneratorPage /></Suspense>}
        />
        <Route
          path="/tools/open-graph-preview"
          element={<Suspense fallback={<PageLoader />}><OpenGraphPreviewPage /></Suspense>}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}

export default App
