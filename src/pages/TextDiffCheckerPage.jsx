import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Text Diff Checker',
      'description': 'Free online text diff checker. Compare two blocks of text line by line and see additions and deletions highlighted.',
      'url': 'https://www.aadhiraiinnovations.com/tools/text-diff-checker',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is the diff calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Line by line, using a longest-common-subsequence comparison — the same general approach used by tools like git diff.' } },
        { '@type': 'Question', 'name': 'Is my text sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, comparison happens entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function diffLines(a, b) {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const m = linesA.length, n = linesB.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  const result = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (linesA[i - 1] === linesB[j - 1]) { result.unshift({ type: 'same', text: linesA[i - 1] }); i--; j-- }
    else if (dp[i - 1][j] >= dp[i][j - 1]) { result.unshift({ type: 'removed', text: linesA[i - 1] }); i-- }
    else { result.unshift({ type: 'added', text: linesB[j - 1] }); j-- }
  }
  while (i > 0) { result.unshift({ type: 'removed', text: linesA[i - 1] }); i-- }
  while (j > 0) { result.unshift({ type: 'added', text: linesB[j - 1] }); j-- }
  return result
}

function TextDiffTool() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')

  const diff = useMemo(() => (textA || textB ? diffLines(textA, textB) : []), [textA, textB])
  const added = diff.filter((d) => d.type === 'added').length
  const removed = diff.filter((d) => d.type === 'removed').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Original</label>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} rows={8} placeholder="Paste original text..."
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Changed</label>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} rows={8} placeholder="Paste changed text..."
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
        </div>
      </div>

      {diff.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Diff</span>
            <span className="text-xs text-green-700">+{added} added</span>
            <span className="text-xs text-red-600">−{removed} removed</span>
          </div>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
            {diff.map((line, i) => (
              <div key={i} className={`px-4 py-1 whitespace-pre-wrap break-words ${
                line.type === 'added' ? 'bg-green-100 text-green-800' : line.type === 'removed' ? 'bg-red-100 text-red-800' : 'text-slate-600'
              }`}>
                <span className="select-none mr-2 opacity-50">{line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}</span>
                {line.text || ' '}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TextDiffCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Text Diff Checker"
        description="Compare two blocks of text line by line and see additions and deletions highlighted."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Text Diff Checker' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <TextDiffTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Text Diff Questions"
        items={[
          { q: 'How is the diff calculated?', a: 'Line by line, using a longest-common-subsequence comparison — similar to how git diff works.' },
          { q: 'Is my text sent anywhere?', a: 'No, comparison happens entirely in your browser.' },
          { q: 'Can I diff two files directly?', a: 'Paste the contents into each box — file upload isn\'t supported, but copy-paste works for any text file.' },
        ]}
      />
      <ToolCta
        headline="Need version control and document workflows?"
        body="Aadhirai Innovations builds backend systems with version tracking, audit trails, and document workflow automation."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
