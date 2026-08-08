// Single source of truth for every free tool on the site — consumed by the Header "Tools"
// mega-menu (src/components/layout/Header.jsx) and the /tools directory page
// (src/pages/ToolsHubPage.jsx), so the two can never drift out of sync with each other.
// Each new tool page should get exactly one entry here, in the category it belongs to.
const toolsDirectory = [
  {
    heading: 'Free Tools',
    items: [
      { label: 'GST Calculator', desc: 'Add/remove GST, CGST/SGST/IGST', href: '/tools/gst-calculator' },
      { label: 'DOCX to PDF', desc: 'Convert Word to PDF', href: '/tools/docx-to-pdf-converter' },
      { label: 'PDF to DOCX', desc: 'Extract text, create Word docs', href: '/tools/pdf-to-docx-converter' },
      { label: 'PDF Editor', desc: 'Rotate, delete, reorder pages', href: '/tools/pdf-editor' },
      { label: 'Merge PDF', desc: 'Combine multiple PDFs into one', href: '/tools/merge-pdf' },
      { label: 'Split PDF', desc: 'Split a PDF by page range', href: '/tools/split-pdf' },
      { label: 'Image to PDF', desc: 'Combine JPG/PNG images into a PDF', href: '/tools/image-to-pdf' },
      { label: 'PDF to Image', desc: 'Convert PDF pages to PNG images', href: '/tools/pdf-to-image' },
      { label: 'PDF Compressor', desc: 'Reduce PDF file size', href: '/tools/pdf-compressor' },
      { label: 'Watermark PDF', desc: 'Add a text watermark to every page', href: '/tools/watermark-pdf' },
      { label: 'Add Page Numbers', desc: 'Number every page of a PDF', href: '/tools/pdf-page-numbers' },
    ],
  },
  {
    heading: 'Developer Tools',
    items: [
      { label: 'JSON Formatter', desc: 'Format and beautify JSON', href: '/tools/json-formatter' },
      { label: 'XML Formatter', desc: 'Format and beautify XML', href: '/tools/xml-formatter' },
      { label: 'Text Formatter', desc: 'Clean, beautify, and format text', href: '/tools/text-formatter' },
      { label: 'JSON to XML', desc: 'Convert JSON data to XML', href: '/tools/json-to-xml' },
      { label: 'XML to JSON', desc: 'Convert XML data to JSON', href: '/tools/xml-to-json' },
      { label: 'Base64 Encoder/Decoder', desc: 'Encode or decode Base64', href: '/tools/base64-encoder-decoder' },
      { label: 'URL Encoder/Decoder', desc: 'Percent-encode or decode URLs', href: '/tools/url-encoder-decoder' },
      { label: 'Timestamp Converter', desc: 'Unix timestamp to date and back', href: '/tools/timestamp-converter' },
      { label: 'UUID Generator', desc: 'Generate random UUIDs (v4)', href: '/tools/uuid-generator' },
      { label: 'Case Converter', desc: 'UPPERCASE, Title Case, camelCase, and more', href: '/tools/case-converter' },
      { label: 'Word & Character Counter', desc: 'Live word/character count and reading time', href: '/tools/word-counter' },
      { label: 'JWT Decoder', desc: 'Decode a JSON Web Token header and payload', href: '/tools/jwt-decoder' },
      { label: 'Regex Tester', desc: 'Test a regex against sample text', href: '/tools/regex-tester' },
      { label: 'Text Diff Checker', desc: 'Compare two blocks of text', href: '/tools/text-diff-checker' },
      { label: 'Color Converter', desc: 'Hex, RGB, and HSL conversion', href: '/tools/color-converter' },
      { label: 'Slug Generator', desc: 'Text to clean URL slug', href: '/tools/slug-generator' },
      { label: 'Cron Expression Explainer', desc: 'Plain-English cron schedule explanation', href: '/tools/cron-explainer' },
      { label: 'Lorem Ipsum Generator', desc: 'Placeholder text for layouts', href: '/tools/lorem-ipsum-generator' },
    ],
  },
  {
    heading: 'Business Tools',
    items: [
      { label: 'Invoice/Quotation Builder', desc: 'Edit, print, and save invoices or quotations', href: '/document-builder' },
      { label: 'Amount to Words', desc: 'Convert ₹ amounts to words for invoices', href: '/tools/amount-to-words' },
      { label: 'EMI Calculator', desc: 'Loan EMI, total interest, and total payment', href: '/tools/emi-calculator' },
      { label: 'Percentage Calculator', desc: 'X% of a number, or percentage change', href: '/tools/percentage-calculator' },
      { label: 'Discount & Margin Calculator', desc: 'Discounted price, margin, and markup', href: '/tools/discount-calculator' },
      { label: 'TDS Calculator', desc: 'TDS deduction by section (194C, 194J...)', href: '/tools/tds-calculator' },
      { label: 'India Tax Simulator', desc: 'Old vs new regime, capital gains, HRA & advance tax', href: '/tools/tax-simulator' },
      { label: 'HSN & SAC Lookup', desc: 'Common pharmacy/retail codes and GST rates', href: '/tools/hsn-sac-lookup' },
      { label: 'Compound Interest Calculator', desc: 'Maturity value with compounding', href: '/tools/compound-interest-calculator' },
      { label: 'Simple Interest Calculator', desc: 'Interest and total amount', href: '/tools/simple-interest-calculator' },
      { label: 'SIP Calculator', desc: 'Mutual fund SIP maturity value', href: '/tools/sip-calculator' },
      { label: 'Salary / CTC Calculator', desc: 'Illustrative CTC to take-home breakup', href: '/tools/salary-ctc-calculator' },
      { label: 'GSTIN Validator', desc: 'Check GSTIN format and check-digit', href: '/tools/gstin-validator' },
      { label: 'Loan Comparison Calculator', desc: 'Compare up to 3 loan offers', href: '/tools/loan-comparison-calculator' },
    ],
  },
  {
    heading: 'SEO & Marketing',
    items: [
      { label: 'Meta Tag Generator', desc: 'Title, description, OG, and Twitter tags', href: '/tools/meta-tag-generator' },
      { label: 'Robots.txt Generator', desc: 'Build a robots.txt with sitemap reference', href: '/tools/robots-txt-generator' },
      { label: 'Open Graph Preview', desc: 'Preview how a page looks when shared', href: '/tools/open-graph-preview' },
    ],
  },
  {
    heading: 'Utilities',
    items: [
      { label: 'QR Code Generator', desc: 'Turn text or a URL into a QR code', href: '/tools/qr-code-generator' },
      { label: 'Barcode Generator', desc: 'CODE128, EAN-13, and UPC barcodes', href: '/tools/barcode-generator' },
      { label: 'Image Compressor', desc: 'Reduce image file size in your browser', href: '/tools/image-compressor' },
      { label: 'Password Generator', desc: 'Strong, random, cryptographically secure', href: '/tools/password-generator' },
      { label: 'Unit Converter', desc: 'Length, weight, temperature, volume, area', href: '/tools/unit-converter' },
      { label: 'Currency Converter', desc: 'Live exchange rates for major currencies', href: '/tools/currency-converter' },
      { label: 'Age Calculator', desc: 'Exact age in years, months, and days', href: '/tools/age-calculator' },
      { label: 'Date Difference Calculator', desc: 'Days, weeks, months between two dates', href: '/tools/date-difference-calculator' },
    ],
  },
]

export default toolsDirectory
