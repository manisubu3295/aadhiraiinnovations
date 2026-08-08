/**
 * Generates the sitewide Open Graph / Twitter share-preview image at
 * public/media/og-cover.png (1200x630), replacing the old billing.png screenshot which
 * only showed Medora+ and no longer represents the full product lineup.
 *
 * One-off script, run manually whenever the banner needs regenerating — same pattern as
 * generate-sitemap.js. Uses Puppeteer (already a project dependency, used server-side in
 * server/pdfRenderer.js) to render a self-contained HTML string and screenshot it.
 *
 * Run: node scripts/generate-og-banner.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'media', 'og-cover.png')

// Four flagship products — accent colors match src/data/products.js exactly.
const PRODUCTS = [
  { label: 'Pharmacy', sub: 'Medora+', color: '#2563eb', icon: 'pharmacy' },
  { label: 'Billing', sub: 'Aadhirai Billing', color: '#b91c1c', icon: 'billing' },
  { label: 'HR & Inventory', sub: 'HRM + Stock', color: '#1d4ed8', icon: 'hr' },
  { label: 'Transport & Logistics', sub: 'Fleet + GPS', color: '#0891b2', icon: 'transport' },
]

// Simple hand-drawn 40x40 glyphs — deliberately basic shapes rather than exact icon-library
// paths, so they render correctly with zero external dependencies.
const ICONS = {
  pharmacy: `
    <rect x="16" y="4" width="8" height="32" rx="2" fill="white"/>
    <rect x="4" y="16" width="32" height="8" rx="2" fill="white"/>
  `,
  billing: `
    <rect x="4"  y="8" width="4" height="24" fill="white"/>
    <rect x="11" y="8" width="7" height="24" fill="white"/>
    <rect x="21" y="8" width="3" height="24" fill="white"/>
    <rect x="27" y="8" width="5" height="24" fill="white"/>
    <rect x="35" y="8" width="2" height="24" fill="white"/>
  `,
  hr: `
    <rect x="7" y="6" width="26" height="30" rx="2" fill="none" stroke="white" stroke-width="3"/>
    <rect x="13" y="13" width="5" height="5" fill="white"/>
    <rect x="22" y="13" width="5" height="5" fill="white"/>
    <rect x="13" y="22" width="5" height="5" fill="white"/>
    <rect x="22" y="22" width="5" height="5" fill="white"/>
  `,
  transport: `
    <rect x="3" y="14" width="22" height="14" rx="2" fill="white"/>
    <path d="M25 18h8l6 6v4h-14z" fill="white"/>
    <circle cx="12" cy="30" r="4" fill="#0891b2" stroke="white" stroke-width="2.5"/>
    <circle cx="30" cy="30" r="4" fill="#0891b2" stroke="white" stroke-width="2.5"/>
  `,
}

function buildHtml() {
  const cards = PRODUCTS.map(
    (p) => `
    <div class="card">
      <div class="chip" style="background:${p.color}">
        <svg width="40" height="40" viewBox="0 0 40 40">${ICONS[p.icon]}</svg>
      </div>
      <div class="card-text">
        <div class="card-label">${p.label}</div>
        <div class="card-sub">${p.sub}</div>
      </div>
    </div>`
  ).join('\n')

  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #060e1c;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    position: relative;
  }
  .glow {
    position: absolute;
    top: -180px;
    right: -120px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, #6366f1, transparent 70%);
    opacity: 0.16;
  }
  .glow2 {
    position: absolute;
    bottom: -200px;
    left: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, #2563eb, transparent 70%);
    opacity: 0.12;
  }
  .content {
    position: relative;
    z-index: 1;
    padding: 64px 72px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }
  .brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    color: white;
  }
  .brand-name {
    font-size: 22px;
    font-weight: 700;
    color: white;
    letter-spacing: 0.02em;
  }
  h1 {
    font-size: 50px;
    font-weight: 700;
    color: white;
    line-height: 1.15;
    letter-spacing: -0.01em;
    margin-bottom: 14px;
    max-width: 920px;
  }
  .tagline {
    font-size: 20px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 46px;
    max-width: 820px;
  }
  .cards {
    display: flex;
    gap: 20px;
  }
  .card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 16px 20px;
  }
  .chip {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .card-label {
    font-size: 16px;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }
  .card-sub {
    font-size: 12.5px;
    color: rgba(255,255,255,0.45);
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="glow2"></div>
  <div class="content">
    <div class="brand">
      <div class="brand-mark">A</div>
      <div class="brand-name">AADHIRAI INNOVATIONS</div>
    </div>
    <h1>Enterprise Software for Every Indian Business</h1>
    <p class="tagline">Pharmacy billing, business billing &amp; inventory, HR &amp; Inventory management, and Transport &amp; Logistics — GST-compliant, offline-first, built in Tamil Nadu.</p>
    <div class="cards">
      ${cards}
    </div>
  </div>
</body>
</html>`
}

async function main() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
    await page.setContent(buildHtml(), { waitUntil: 'networkidle0' })
    const buffer = await page.screenshot({ type: 'png' })
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, buffer)
    console.log(`✓ og-cover.png written to ${OUTPUT_PATH}`)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
