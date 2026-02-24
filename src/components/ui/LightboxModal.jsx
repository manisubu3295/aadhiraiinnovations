import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

function LightboxModal({ isOpen, image, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1F3A]/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute right-4 top-4 rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>

            <img src={image?.src} alt={image?.alt} className="h-[60vh] w-full rounded-xl object-cover" />
            <div className="mt-3 flex items-center justify-between px-2 pb-1">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{image?.caption}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={onPrev}
                  className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={onNext}
                  className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default LightboxModal
