import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

/**
 * Renders blog post markdown (src/data/blogPosts.js `content` fields) with the
 * site's own typography instead of Tailwind's `prose` classes — the
 * @tailwindcss/typography plugin isn't installed, so `prose` renders unstyled.
 *
 * Replaces the old hand-rolled regex "markdown to HTML" pipeline in
 * BlogPostPage.jsx, which ran `.replace(/\n/g, '<br/>')` before its heading/
 * list regexes — destroying every newline those regexes needed to match on,
 * so `##`, `**`, `- `, and `[text](url)` mostly rendered as literal characters
 * instead of formatted content.
 *
 * rehype-slug stamps a GitHub-style `id` on every heading — BlogPostPage reads
 * those `id`s straight back off the rendered `<h2>` elements to build its
 * "On this page" rail, so the two never fall out of sync with each other.
 */

// Every post's content starts with `# <post title>`, which duplicates the
// <h1> already rendered in the page header above — strip just that line.
function stripLeadingTitle(markdown) {
  return markdown.trim().replace(/^#\s+.+(?:\r?\n)+/, '')
}

const components = {
  // No `#` (h1) survives stripLeadingTitle in practice — kept as a plain
  // fallback in case a post ever adds one mid-content.
  h1: ({ id, children }) => (
    <h2 id={id} className="mt-12 mb-4 scroll-mt-28 text-[26px] font-semibold tracking-[-0.01em] text-[#0B1F3A] first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ id, children }) => (
    <h2
      id={id}
      className="mt-14 mb-5 scroll-mt-28 border-t border-slate-100 pt-9 text-[26px] font-semibold tracking-[-0.01em] text-[#0B1F3A] first:mt-0 first:border-0 first:pt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3 id={id} className="mt-9 mb-3 scroll-mt-28 text-lg font-semibold text-[#0B1F3A]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-5 text-[15.5px] leading-[1.85] text-slate-600">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[#0B1F3A]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors hover:decoration-blue-500"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-6 space-y-2 pl-5 text-slate-600">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-5 text-slate-600">{children}</ol>,
  li: ({ node, children }) => {
    const isTaskItem = node?.children?.[0]?.tagName === 'input'
    return (
      <li className={isTaskItem ? 'flex items-start gap-2.5 list-none leading-[1.8]' : 'list-disc pl-1 leading-[1.8] marker:text-slate-300'}>
        {children}
      </li>
    )
  },
  input: (props) => (
    <input
      {...props}
      disabled
      className="mt-1.5 h-3.5 w-3.5 flex-none rounded border-slate-300 accent-[#0B1F3A]"
    />
  ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-[13.5px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-slate-200 px-4 py-2.5 font-semibold text-[#0B1F3A]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600 last:border-b-0">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-[#0B1F3A]/20 pl-5 text-[17px] italic leading-[1.7] text-[#0B1F3A]/70">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-[#0B1F3A]">{children}</code>
  ),
  hr: () => <hr className="my-10 border-slate-200" />,
}

export default function BlogMarkdown({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {stripLeadingTitle(content)}
    </ReactMarkdown>
  )
}
