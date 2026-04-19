import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CourseLayout({
  children,
  sidebar,
  context,
  header,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Top Header (mobile + desktop) */}
      {header && (
        <div className="lg:hidden border-b border-slate-100">
          {header}
        </div>
      )}

      {/* LEFT SIDEBAR — Desktop visible, Mobile as overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 z-50
          overflow-y-auto lg:relative lg:z-auto lg:translate-x-0 lg:w-60
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebar}
      </motion.aside>

      {/* CENTER CANVAS — Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Desktop header (hidden on mobile) */}
        <div className="hidden lg:block border-b border-slate-100">
          {header}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>

      {/* RIGHT CONTEXT PANEL — Desktop visible, Mobile hidden */}
      <AnimatePresence>
        {contextOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="hidden lg:flex flex-col w-64 border-l border-slate-100 bg-slate-50 overflow-y-auto"
          >
            {context}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar + context toggle button */}
      <div className="lg:hidden fixed bottom-6 right-6 flex gap-2 z-40">
        {/* Context toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setContextOpen(!contextOpen)}
          className="h-14 w-14 rounded-full bg-[#0B1F3A] text-white shadow-lg flex items-center justify-center hover:bg-[#173762] transition-colors"
          title="Toggle hints"
        >
          💡
        </motion.button>

        {/* Sidebar toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-14 w-14 rounded-full bg-[#0B1F3A] text-white shadow-lg flex items-center justify-center hover:bg-[#173762] transition-colors"
          title="Toggle navigation"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Mobile Context Panel — slides up from bottom */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-100 shadow-lg z-40 max-h-72 overflow-y-auto rounded-t-2xl"
          >
            {context}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
