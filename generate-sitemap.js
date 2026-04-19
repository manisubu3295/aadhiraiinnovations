/**
 * Sitemap Generation Script
 * Generates sitemap.xml for all pages including dynamic city pages
 * Run: node generate-sitemap.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DOMAIN = 'https://aadhiraiinnovations.com'
const today = new Date().toISOString().split('T')[0]

// All static pages
const staticPages = [
  { path: '/', lastmod: today, priority: '1.0', changefreq: 'weekly' },
  { path: '/founder', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/solutions/pharmacy-software', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/solutions/erp-automation', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/products/medora-plus', lastmod: today, priority: '0.9', changefreq: 'monthly' },
]

// Product pages (from products.js data)
const productSlugs = [
  'medora-plus',
  'sanko-erp',
  'passtrack',
  'mouna-ai',
  'workforce',
  'school-management',
  'pos-system',
  'inventory-management',
  'billing-software',
  'crm-software',
  'hrms'
]

const productPages = productSlugs.map(slug => ({
  path: `/products/${slug}`,
  lastmod: today,
  priority: '0.8',
  changefreq: 'monthly'
}))

// Dynamic city pages — mapped from LocalSEOPageTemplate data
const cityList = [
  'peravurani',
  'pattukottai',
  'thanjavur',
  'aranthangi',
  'alangudi',
  // TODO: Add remaining cities as implemented
]

const cityPages = cityList.map(citySlug => ({
  path: `/pharmacy-billing-software/${citySlug}`,
  lastmod: today,
  priority: '0.8',
  changefreq: 'monthly'
}))

// Combine all pages
const allPages = [...staticPages, ...productPages, ...cityPages]

// Generate XML
const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
const xmlNamespace = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

const urlEntries = allPages
  .map(page => `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')

const sitemap = `${xmlHeader}
${xmlNamespace}
${urlEntries}
</urlset>`

// Write to public directory
const outputPath = path.join(__dirname, 'public', 'sitemap.xml')
const publicDir = path.dirname(outputPath)

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

fs.writeFileSync(outputPath, sitemap, 'utf8')

console.log(`✅ Sitemap generated successfully!`)
console.log(`📍 Location: public/sitemap.xml`)
console.log(`📊 Total URLs: ${allPages.length}`)
console.log(`   - Static pages: ${staticPages.length}`)
console.log(`   - Product pages: ${productPages.length}`)
console.log(`   - City pages: ${cityPages.length}`)
