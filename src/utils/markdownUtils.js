// A small, dependency-free Markdown<->HTML converter covering the common subset: headings,
// bold/italic, links, images, inline code, code blocks, unordered/ordered lists, and
// paragraphs. Not a full CommonMark implementation — used by MarkdownHtmlConverterPage.jsx.

export function markdownToHtml(md) {
  const lines = md.split('\n')
  const html = []
  let inList = null // 'ul' | 'ol' | null
  let inCode = false

  function inline(text) {
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  }

  function closeList() { if (inList) { html.push(`</${inList}>`); inList = null } }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.trim().startsWith('```')) { inCode = !inCode; html.push(inCode ? '<pre><code>' : '</code></pre>'); continue }
    if (inCode) { html.push(line); continue }

    const heading = line.match(/^(#{1,6})\s+(.*)/)
    if (heading) { closeList(); html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue }

    const ul = line.match(/^[-*]\s+(.*)/)
    if (ul) { if (inList !== 'ul') { closeList(); html.push('<ul>'); inList = 'ul' } html.push(`<li>${inline(ul[1])}</li>`); continue }

    const ol = line.match(/^\d+\.\s+(.*)/)
    if (ol) { if (inList !== 'ol') { closeList(); html.push('<ol>'); inList = 'ol' } html.push(`<li>${inline(ol[1])}</li>`); continue }

    closeList()
    if (line.trim() === '') continue
    html.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  return html.join('\n')
}

export function htmlToMarkdown(html) {
  return html
    .replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, text) => `${'#'.repeat(Number(level))} ${text}\n`)
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<a href="([^"]+)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<img src="([^"]+)" alt="([^"]*)"\s*\/?>/g, '![$2]($1)')
    .replace(/<li>(.*?)<\/li>/g, '- $1')
    .replace(/<\/?(ul|ol|pre|code)>/g, '')
    .replace(/<p>(.*?)<\/p>/g, '$1\n')
    .trim()
}
