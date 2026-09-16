import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
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
const TransportLogisticsPage = lazy(() => import('./pages/TransportLogisticsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const BlogPostPage         = lazy(() => import('./pages/BlogPostPage'))
const BlogIndexPage        = lazy(() => import('./pages/BlogIndexPage'))
const CaseStudiesPage      = lazy(() => import('./pages/CaseStudiesPage'))
const PricingPage          = lazy(() => import('./pages/PricingPage'))
const CareersPage          = lazy(() => import('./pages/CareersPage'))
const ResourcesPage        = lazy(() => import('./pages/ResourcesPage'))
const WebinarPage          = lazy(() => import('./pages/WebinarPage'))
const ProductPage          = lazy(() => import('./pages/ProductPage'))
const LocalSEOPage         = lazy(() => import('./pages/LocalSEOPage'))
const PharmacyLocationsHubPage = lazy(() => import('./pages/PharmacyLocationsHubPage'))
const StateSEOPage         = lazy(() => import('./pages/StateSEOPage'))
const HrmLocalSEOPage      = lazy(() => import('./pages/HrmLocalSEOPage'))
const HrmLocationsHubPage  = lazy(() => import('./pages/HrmLocationsHubPage'))
const HrmStateSEOPage      = lazy(() => import('./pages/HrmStateSEOPage'))
const TransportLocalSEOPage     = lazy(() => import('./pages/TransportLocalSEOPage'))
const TransportLocationsHubPage = lazy(() => import('./pages/TransportLocationsHubPage'))
const TransportStateSEOPage     = lazy(() => import('./pages/TransportStateSEOPage'))
const GstCalculatorPage    = lazy(() => import('./pages/GstCalculatorPage'))
const TaxSimulatorPage     = lazy(() => import('./pages/TaxSimulatorPage'))
const FdCalculatorPage     = lazy(() => import('./pages/FdCalculatorPage'))
const RdCalculatorPage     = lazy(() => import('./pages/RdCalculatorPage'))
const PpfCalculatorPage    = lazy(() => import('./pages/PpfCalculatorPage'))
const GratuityCalculatorPage = lazy(() => import('./pages/GratuityCalculatorPage'))
const RetirementCalculatorPage = lazy(() => import('./pages/RetirementCalculatorPage'))
const InflationCalculatorPage  = lazy(() => import('./pages/InflationCalculatorPage'))
const RuleOf72CalculatorPage   = lazy(() => import('./pages/RuleOf72CalculatorPage'))
const BreakEvenCalculatorPage  = lazy(() => import('./pages/BreakEvenCalculatorPage'))
const StampDutyCalculatorPage  = lazy(() => import('./pages/StampDutyCalculatorPage'))
const FreelanceRateCalculatorPage = lazy(() => import('./pages/FreelanceRateCalculatorPage'))
const LatePaymentInterestCalculatorPage = lazy(() => import('./pages/LatePaymentInterestCalculatorPage'))
const BmiCalculatorPage = lazy(() => import('./pages/BmiCalculatorPage'))
const TipCalculatorPage = lazy(() => import('./pages/TipCalculatorPage'))
const CountdownTimerPage = lazy(() => import('./pages/CountdownTimerPage'))
const PomodoroTimerPage = lazy(() => import('./pages/PomodoroTimerPage'))
const TimezoneConverterPage = lazy(() => import('./pages/TimezoneConverterPage'))
const NumberBaseConverterPage = lazy(() => import('./pages/NumberBaseConverterPage'))
const RomanNumeralConverterPage = lazy(() => import('./pages/RomanNumeralConverterPage'))
const MorseCodeTranslatorPage = lazy(() => import('./pages/MorseCodeTranslatorPage'))
const ImageResizerPage = lazy(() => import('./pages/ImageResizerPage'))
const ImageFormatConverterPage = lazy(() => import('./pages/ImageFormatConverterPage'))
const RandomPickerPage = lazy(() => import('./pages/RandomPickerPage'))
const BarBendingSchedulePage = lazy(() => import('./pages/BarBendingSchedulePage'))
const SchemaMarkupGeneratorPage = lazy(() => import('./pages/SchemaMarkupGeneratorPage'))
const XmlSitemapGeneratorPage = lazy(() => import('./pages/XmlSitemapGeneratorPage'))
const UtmLinkBuilderPage = lazy(() => import('./pages/UtmLinkBuilderPage'))
const KeywordDensityCheckerPage = lazy(() => import('./pages/KeywordDensityCheckerPage'))
const TitleTagCheckerPage = lazy(() => import('./pages/TitleTagCheckerPage'))
const MetaDescriptionCheckerPage = lazy(() => import('./pages/MetaDescriptionCheckerPage'))
const ReadabilityCheckerPage = lazy(() => import('./pages/ReadabilityCheckerPage'))
const SocialCaptionCheckerPage = lazy(() => import('./pages/SocialCaptionCheckerPage'))
const YamlJsonConverterPage = lazy(() => import('./pages/YamlJsonConverterPage'))
const MarkdownHtmlConverterPage = lazy(() => import('./pages/MarkdownHtmlConverterPage'))
const HtmlFormatterPage = lazy(() => import('./pages/HtmlFormatterPage'))
const CssFormatterPage = lazy(() => import('./pages/CssFormatterPage'))
const JsFormatterPage = lazy(() => import('./pages/JsFormatterPage'))
const SqlFormatterPage = lazy(() => import('./pages/SqlFormatterPage'))
const HashGeneratorPage = lazy(() => import('./pages/HashGeneratorPage'))
const CsvJsonConverterPage = lazy(() => import('./pages/CsvJsonConverterPage'))
const HttpStatusCodesPage = lazy(() => import('./pages/HttpStatusCodesPage'))
const FaviconGeneratorPage = lazy(() => import('./pages/FaviconGeneratorPage'))
const PdfTextExtractorPage = lazy(() => import('./pages/PdfTextExtractorPage'))
const PptToPdfConverterPage = lazy(() => import('./pages/PptToPdfConverterPage'))
const ExcelToPdfConverterPage = lazy(() => import('./pages/ExcelToPdfConverterPage'))
const ExcelCsvConverterPage = lazy(() => import('./pages/ExcelCsvConverterPage'))
const PdfRotatePage = lazy(() => import('./pages/PdfRotatePage'))
const PdfSignaturePage = lazy(() => import('./pages/PdfSignaturePage'))
// Construction & Real Estate
const ConcreteVolumeCalculatorPage = lazy(() => import('./pages/ConcreteVolumeCalculatorPage'))
const ConcreteMixCalculatorPage = lazy(() => import('./pages/ConcreteMixCalculatorPage'))
const CementBagsCalculatorPage = lazy(() => import('./pages/CementBagsCalculatorPage'))
const BrickCalculatorPage = lazy(() => import('./pages/BrickCalculatorPage'))
const BlockCalculatorPage = lazy(() => import('./pages/BlockCalculatorPage'))
const PlasterCalculatorPage = lazy(() => import('./pages/PlasterCalculatorPage'))
const TileCalculatorPage = lazy(() => import('./pages/TileCalculatorPage'))
const PaintCalculatorPage = lazy(() => import('./pages/PaintCalculatorPage'))
const FlooringCostCalculatorPage = lazy(() => import('./pages/FlooringCostCalculatorPage'))
const PaverBlockCalculatorPage = lazy(() => import('./pages/PaverBlockCalculatorPage'))
const ExcavationCalculatorPage = lazy(() => import('./pages/ExcavationCalculatorPage'))
const WaterproofingCalculatorPage = lazy(() => import('./pages/WaterproofingCalculatorPage'))
const MortarCalculatorPage = lazy(() => import('./pages/MortarCalculatorPage'))
const TmtSteelWeightCalculatorPage = lazy(() => import('./pages/TmtSteelWeightCalculatorPage'))
const HomeLoanEligibilityCalculatorPage = lazy(() => import('./pages/HomeLoanEligibilityCalculatorPage'))
const RentalYieldCalculatorPage = lazy(() => import('./pages/RentalYieldCalculatorPage'))
const PropertyAppreciationCalculatorPage = lazy(() => import('./pages/PropertyAppreciationCalculatorPage'))
const CarpetBuiltupAreaConverterPage = lazy(() => import('./pages/CarpetBuiltupAreaConverterPage'))
const PricePerSqftCalculatorPage = lazy(() => import('./pages/PricePerSqftCalculatorPage'))
const PropertyTaxCalculatorPage = lazy(() => import('./pages/PropertyTaxCalculatorPage'))
const BrokerageCalculatorPage = lazy(() => import('./pages/BrokerageCalculatorPage'))
const RentEscalationCalculatorPage = lazy(() => import('./pages/RentEscalationCalculatorPage'))
const RentVsBuyCalculatorPage = lazy(() => import('./pages/RentVsBuyCalculatorPage'))
const DownPaymentCalculatorPage = lazy(() => import('./pages/DownPaymentCalculatorPage'))
const LtvCalculatorPage = lazy(() => import('./pages/LtvCalculatorPage'))
const FsiCalculatorPage = lazy(() => import('./pages/FsiCalculatorPage'))
const LandAreaUnitConverterPage = lazy(() => import('./pages/LandAreaUnitConverterPage'))
const ConstructionCostEstimatorPage = lazy(() => import('./pages/ConstructionCostEstimatorPage'))
const StaircaseCalculatorPage = lazy(() => import('./pages/StaircaseCalculatorPage'))
const RoofPitchCalculatorPage = lazy(() => import('./pages/RoofPitchCalculatorPage'))
const SlopeGradientCalculatorPage = lazy(() => import('./pages/SlopeGradientCalculatorPage'))
const BeamDepthEstimatorPage = lazy(() => import('./pages/BeamDepthEstimatorPage'))
const ColumnSizeEstimatorPage = lazy(() => import('./pages/ColumnSizeEstimatorPage'))
const WindowWallRatioCalculatorPage = lazy(() => import('./pages/WindowWallRatioCalculatorPage'))
const RoomAreaCalculatorPage = lazy(() => import('./pages/RoomAreaCalculatorPage'))
const ConstructionVolumeConverterPage = lazy(() => import('./pages/ConstructionVolumeConverterPage'))
const CurtainFabricCalculatorPage = lazy(() => import('./pages/CurtainFabricCalculatorPage'))
const FalseCeilingCalculatorPage = lazy(() => import('./pages/FalseCeilingCalculatorPage'))
const WallpaperCalculatorPage = lazy(() => import('./pages/WallpaperCalculatorPage'))
const ModularFurnitureCostEstimatorPage = lazy(() => import('./pages/ModularFurnitureCostEstimatorPage'))
const WallPuttyCalculatorPage = lazy(() => import('./pages/WallPuttyCalculatorPage'))
const SkirtingCalculatorPage = lazy(() => import('./pages/SkirtingCalculatorPage'))
const ShutteringCalculatorPage = lazy(() => import('./pages/ShutteringCalculatorPage'))
const WaterTankCalculatorPage = lazy(() => import('./pages/WaterTankCalculatorPage'))
const SolarPanelEstimatorPage = lazy(() => import('./pages/SolarPanelEstimatorPage'))
const BorewellCostEstimatorPage = lazy(() => import('./pages/BorewellCostEstimatorPage'))
const PropertyDocumentChecklistPage = lazy(() => import('./pages/PropertyDocumentChecklistPage'))
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
        <Route
          path="/products/transport-logistics"
          element={<Suspense fallback={<PageLoader />}><TransportLogisticsPage /></Suspense>}
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
        <Route
          path="/webinar"
          element={<Suspense fallback={<PageLoader />}><WebinarPage /></Suspense>}
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

        {/* National HRM-software local SEO — hub -> state -> district. Same architecture as the
            pharmacy tree above but fully independent (own data/content files) since pharmacy's
            curated cities and this tree's don't necessarily match. */}
        <Route
          path="/hrm-software"
          element={<Suspense fallback={<PageLoader />}><HrmLocationsHubPage /></Suspense>}
        />
        <Route
          path="/hrm-software/state/:stateSlug"
          element={<Suspense fallback={<PageLoader />}><HrmStateSEOPage /></Suspense>}
        />
        {/* e.g. /hrm-software/chennai, /hrm-software/coimbatore */}
        <Route
          path="/hrm-software/:city"
          element={<Suspense fallback={<PageLoader />}><HrmLocalSEOPage /></Suspense>}
        />

        {/* National transport-software local SEO — hub -> state -> district, same mechanics as the
            hrm-software tree above but a fully independent slug source (src/data/transportLocationSlugs.js),
            since its curated cities/aliases don't necessarily match hrm-software's. */}
        <Route
          path="/transport-software"
          element={<Suspense fallback={<PageLoader />}><TransportLocationsHubPage /></Suspense>}
        />
        <Route
          path="/transport-software/state/:stateSlug"
          element={<Suspense fallback={<PageLoader />}><TransportStateSEOPage /></Suspense>}
        />
        {/* e.g. /transport-software/chennai, /transport-software/mumbai */}
        <Route
          path="/transport-software/:city"
          element={<Suspense fallback={<PageLoader />}><TransportLocalSEOPage /></Suspense>}
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
          path="/tools/tax-simulator"
          element={<Suspense fallback={<PageLoader />}><TaxSimulatorPage /></Suspense>}
        />
        <Route path="/tools/fd-calculator" element={<Suspense fallback={<PageLoader />}><FdCalculatorPage /></Suspense>} />
        <Route path="/tools/rd-calculator" element={<Suspense fallback={<PageLoader />}><RdCalculatorPage /></Suspense>} />
        <Route path="/tools/ppf-calculator" element={<Suspense fallback={<PageLoader />}><PpfCalculatorPage /></Suspense>} />
        <Route path="/tools/gratuity-calculator" element={<Suspense fallback={<PageLoader />}><GratuityCalculatorPage /></Suspense>} />
        <Route path="/tools/retirement-calculator" element={<Suspense fallback={<PageLoader />}><RetirementCalculatorPage /></Suspense>} />
        <Route path="/tools/inflation-calculator" element={<Suspense fallback={<PageLoader />}><InflationCalculatorPage /></Suspense>} />
        <Route path="/tools/rule-of-72-calculator" element={<Suspense fallback={<PageLoader />}><RuleOf72CalculatorPage /></Suspense>} />
        <Route path="/tools/break-even-calculator" element={<Suspense fallback={<PageLoader />}><BreakEvenCalculatorPage /></Suspense>} />
        <Route path="/tools/stamp-duty-calculator" element={<Suspense fallback={<PageLoader />}><StampDutyCalculatorPage /></Suspense>} />
        <Route path="/tools/freelance-rate-calculator" element={<Suspense fallback={<PageLoader />}><FreelanceRateCalculatorPage /></Suspense>} />
        <Route path="/tools/late-payment-interest-calculator" element={<Suspense fallback={<PageLoader />}><LatePaymentInterestCalculatorPage /></Suspense>} />
        <Route path="/tools/bmi-calculator" element={<Suspense fallback={<PageLoader />}><BmiCalculatorPage /></Suspense>} />
        <Route path="/tools/tip-calculator" element={<Suspense fallback={<PageLoader />}><TipCalculatorPage /></Suspense>} />
        <Route path="/tools/countdown-timer" element={<Suspense fallback={<PageLoader />}><CountdownTimerPage /></Suspense>} />
        <Route path="/tools/pomodoro-timer" element={<Suspense fallback={<PageLoader />}><PomodoroTimerPage /></Suspense>} />
        <Route path="/tools/timezone-converter" element={<Suspense fallback={<PageLoader />}><TimezoneConverterPage /></Suspense>} />
        <Route path="/tools/number-base-converter" element={<Suspense fallback={<PageLoader />}><NumberBaseConverterPage /></Suspense>} />
        <Route path="/tools/roman-numeral-converter" element={<Suspense fallback={<PageLoader />}><RomanNumeralConverterPage /></Suspense>} />
        <Route path="/tools/morse-code-translator" element={<Suspense fallback={<PageLoader />}><MorseCodeTranslatorPage /></Suspense>} />
        <Route path="/tools/image-resizer" element={<Suspense fallback={<PageLoader />}><ImageResizerPage /></Suspense>} />
        <Route path="/tools/image-format-converter" element={<Suspense fallback={<PageLoader />}><ImageFormatConverterPage /></Suspense>} />
        <Route path="/tools/random-picker" element={<Suspense fallback={<PageLoader />}><RandomPickerPage /></Suspense>} />
        <Route path="/tools/bar-bending-schedule" element={<Suspense fallback={<PageLoader />}><BarBendingSchedulePage /></Suspense>} />
        <Route path="/tools/schema-markup-generator" element={<Suspense fallback={<PageLoader />}><SchemaMarkupGeneratorPage /></Suspense>} />
        <Route path="/tools/xml-sitemap-generator" element={<Suspense fallback={<PageLoader />}><XmlSitemapGeneratorPage /></Suspense>} />
        <Route path="/tools/utm-link-builder" element={<Suspense fallback={<PageLoader />}><UtmLinkBuilderPage /></Suspense>} />
        <Route path="/tools/keyword-density-checker" element={<Suspense fallback={<PageLoader />}><KeywordDensityCheckerPage /></Suspense>} />
        <Route path="/tools/title-tag-checker" element={<Suspense fallback={<PageLoader />}><TitleTagCheckerPage /></Suspense>} />
        <Route path="/tools/meta-description-checker" element={<Suspense fallback={<PageLoader />}><MetaDescriptionCheckerPage /></Suspense>} />
        <Route path="/tools/readability-checker" element={<Suspense fallback={<PageLoader />}><ReadabilityCheckerPage /></Suspense>} />
        <Route path="/tools/social-caption-checker" element={<Suspense fallback={<PageLoader />}><SocialCaptionCheckerPage /></Suspense>} />
        <Route path="/tools/yaml-json-converter" element={<Suspense fallback={<PageLoader />}><YamlJsonConverterPage /></Suspense>} />
        <Route path="/tools/markdown-html-converter" element={<Suspense fallback={<PageLoader />}><MarkdownHtmlConverterPage /></Suspense>} />
        <Route path="/tools/html-formatter" element={<Suspense fallback={<PageLoader />}><HtmlFormatterPage /></Suspense>} />
        <Route path="/tools/css-formatter" element={<Suspense fallback={<PageLoader />}><CssFormatterPage /></Suspense>} />
        <Route path="/tools/js-formatter" element={<Suspense fallback={<PageLoader />}><JsFormatterPage /></Suspense>} />
        <Route path="/tools/sql-formatter" element={<Suspense fallback={<PageLoader />}><SqlFormatterPage /></Suspense>} />
        <Route path="/tools/hash-generator" element={<Suspense fallback={<PageLoader />}><HashGeneratorPage /></Suspense>} />
        <Route path="/tools/csv-json-converter" element={<Suspense fallback={<PageLoader />}><CsvJsonConverterPage /></Suspense>} />
        <Route path="/tools/http-status-codes" element={<Suspense fallback={<PageLoader />}><HttpStatusCodesPage /></Suspense>} />
        <Route path="/tools/favicon-generator" element={<Suspense fallback={<PageLoader />}><FaviconGeneratorPage /></Suspense>} />
        <Route path="/tools/pdf-text-extractor" element={<Suspense fallback={<PageLoader />}><PdfTextExtractorPage /></Suspense>} />
        <Route path="/tools/ppt-to-pdf-converter" element={<Suspense fallback={<PageLoader />}><PptToPdfConverterPage /></Suspense>} />
        <Route path="/tools/excel-to-pdf-converter" element={<Suspense fallback={<PageLoader />}><ExcelToPdfConverterPage /></Suspense>} />
        <Route path="/tools/excel-csv-converter" element={<Suspense fallback={<PageLoader />}><ExcelCsvConverterPage /></Suspense>} />
        <Route path="/tools/pdf-rotate" element={<Suspense fallback={<PageLoader />}><PdfRotatePage /></Suspense>} />
        <Route path="/tools/pdf-signature" element={<Suspense fallback={<PageLoader />}><PdfSignaturePage /></Suspense>} />
        <Route path="/tools/concrete-volume-calculator" element={<Suspense fallback={<PageLoader />}><ConcreteVolumeCalculatorPage /></Suspense>} />
        <Route path="/tools/concrete-mix-calculator" element={<Suspense fallback={<PageLoader />}><ConcreteMixCalculatorPage /></Suspense>} />
        <Route path="/tools/cement-bags-calculator" element={<Suspense fallback={<PageLoader />}><CementBagsCalculatorPage /></Suspense>} />
        <Route path="/tools/brick-calculator" element={<Suspense fallback={<PageLoader />}><BrickCalculatorPage /></Suspense>} />
        <Route path="/tools/block-calculator" element={<Suspense fallback={<PageLoader />}><BlockCalculatorPage /></Suspense>} />
        <Route path="/tools/plaster-calculator" element={<Suspense fallback={<PageLoader />}><PlasterCalculatorPage /></Suspense>} />
        <Route path="/tools/tile-calculator" element={<Suspense fallback={<PageLoader />}><TileCalculatorPage /></Suspense>} />
        <Route path="/tools/paint-calculator" element={<Suspense fallback={<PageLoader />}><PaintCalculatorPage /></Suspense>} />
        <Route path="/tools/flooring-cost-calculator" element={<Suspense fallback={<PageLoader />}><FlooringCostCalculatorPage /></Suspense>} />
        <Route path="/tools/paver-block-calculator" element={<Suspense fallback={<PageLoader />}><PaverBlockCalculatorPage /></Suspense>} />
        <Route path="/tools/excavation-calculator" element={<Suspense fallback={<PageLoader />}><ExcavationCalculatorPage /></Suspense>} />
        <Route path="/tools/waterproofing-calculator" element={<Suspense fallback={<PageLoader />}><WaterproofingCalculatorPage /></Suspense>} />
        <Route path="/tools/mortar-calculator" element={<Suspense fallback={<PageLoader />}><MortarCalculatorPage /></Suspense>} />
        <Route path="/tools/tmt-steel-weight-calculator" element={<Suspense fallback={<PageLoader />}><TmtSteelWeightCalculatorPage /></Suspense>} />
        <Route path="/tools/home-loan-eligibility-calculator" element={<Suspense fallback={<PageLoader />}><HomeLoanEligibilityCalculatorPage /></Suspense>} />
        <Route path="/tools/rental-yield-calculator" element={<Suspense fallback={<PageLoader />}><RentalYieldCalculatorPage /></Suspense>} />
        <Route path="/tools/property-appreciation-calculator" element={<Suspense fallback={<PageLoader />}><PropertyAppreciationCalculatorPage /></Suspense>} />
        <Route path="/tools/carpet-builtup-area-converter" element={<Suspense fallback={<PageLoader />}><CarpetBuiltupAreaConverterPage /></Suspense>} />
        <Route path="/tools/price-per-sqft-calculator" element={<Suspense fallback={<PageLoader />}><PricePerSqftCalculatorPage /></Suspense>} />
        <Route path="/tools/property-tax-calculator" element={<Suspense fallback={<PageLoader />}><PropertyTaxCalculatorPage /></Suspense>} />
        <Route path="/tools/brokerage-calculator" element={<Suspense fallback={<PageLoader />}><BrokerageCalculatorPage /></Suspense>} />
        <Route path="/tools/rent-escalation-calculator" element={<Suspense fallback={<PageLoader />}><RentEscalationCalculatorPage /></Suspense>} />
        <Route path="/tools/rent-vs-buy-calculator" element={<Suspense fallback={<PageLoader />}><RentVsBuyCalculatorPage /></Suspense>} />
        <Route path="/tools/down-payment-calculator" element={<Suspense fallback={<PageLoader />}><DownPaymentCalculatorPage /></Suspense>} />
        <Route path="/tools/ltv-calculator" element={<Suspense fallback={<PageLoader />}><LtvCalculatorPage /></Suspense>} />
        <Route path="/tools/fsi-calculator" element={<Suspense fallback={<PageLoader />}><FsiCalculatorPage /></Suspense>} />
        <Route path="/tools/land-area-unit-converter" element={<Suspense fallback={<PageLoader />}><LandAreaUnitConverterPage /></Suspense>} />
        <Route path="/tools/construction-cost-estimator" element={<Suspense fallback={<PageLoader />}><ConstructionCostEstimatorPage /></Suspense>} />
        <Route path="/tools/staircase-calculator" element={<Suspense fallback={<PageLoader />}><StaircaseCalculatorPage /></Suspense>} />
        <Route path="/tools/roof-pitch-calculator" element={<Suspense fallback={<PageLoader />}><RoofPitchCalculatorPage /></Suspense>} />
        <Route path="/tools/slope-gradient-calculator" element={<Suspense fallback={<PageLoader />}><SlopeGradientCalculatorPage /></Suspense>} />
        <Route path="/tools/beam-depth-estimator" element={<Suspense fallback={<PageLoader />}><BeamDepthEstimatorPage /></Suspense>} />
        <Route path="/tools/column-size-estimator" element={<Suspense fallback={<PageLoader />}><ColumnSizeEstimatorPage /></Suspense>} />
        <Route path="/tools/window-wall-ratio-calculator" element={<Suspense fallback={<PageLoader />}><WindowWallRatioCalculatorPage /></Suspense>} />
        <Route path="/tools/room-area-calculator" element={<Suspense fallback={<PageLoader />}><RoomAreaCalculatorPage /></Suspense>} />
        <Route path="/tools/construction-volume-converter" element={<Suspense fallback={<PageLoader />}><ConstructionVolumeConverterPage /></Suspense>} />
        <Route path="/tools/curtain-fabric-calculator" element={<Suspense fallback={<PageLoader />}><CurtainFabricCalculatorPage /></Suspense>} />
        <Route path="/tools/false-ceiling-calculator" element={<Suspense fallback={<PageLoader />}><FalseCeilingCalculatorPage /></Suspense>} />
        <Route path="/tools/wallpaper-calculator" element={<Suspense fallback={<PageLoader />}><WallpaperCalculatorPage /></Suspense>} />
        <Route path="/tools/modular-furniture-cost-estimator" element={<Suspense fallback={<PageLoader />}><ModularFurnitureCostEstimatorPage /></Suspense>} />
        <Route path="/tools/wall-putty-calculator" element={<Suspense fallback={<PageLoader />}><WallPuttyCalculatorPage /></Suspense>} />
        <Route path="/tools/skirting-calculator" element={<Suspense fallback={<PageLoader />}><SkirtingCalculatorPage /></Suspense>} />
        <Route path="/tools/shuttering-calculator" element={<Suspense fallback={<PageLoader />}><ShutteringCalculatorPage /></Suspense>} />
        <Route path="/tools/water-tank-calculator" element={<Suspense fallback={<PageLoader />}><WaterTankCalculatorPage /></Suspense>} />
        <Route path="/tools/solar-panel-estimator" element={<Suspense fallback={<PageLoader />}><SolarPanelEstimatorPage /></Suspense>} />
        <Route path="/tools/borewell-cost-estimator" element={<Suspense fallback={<PageLoader />}><BorewellCostEstimatorPage /></Suspense>} />
        <Route path="/tools/property-document-checklist" element={<Suspense fallback={<PageLoader />}><PropertyDocumentChecklistPage /></Suspense>} />
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

        {/* Catch-all — real 404 page, not a silent redirect to home (was a soft-404 before) */}
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />

      </Route>
    </Routes>
  )
}

export default App
