import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ code, language = 'java', title }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden bg-[#0d1117] border border-slate-700">
      {title && (
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">{title}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">{language}</span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" strokeWidth={2.5} />
          ) : (
            <Copy className="h-4 w-4 text-slate-400" strokeWidth={2} />
          )}
        </button>

        <pre className="overflow-x-auto p-4 pr-12">
          <code className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}
