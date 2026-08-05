import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_URL = 'https://wa.me/918508716957'

/**
 * WhatsAppWidget — fixed floating launcher, present on every public page via SiteLayout.
 * A static wa.me deep link, same number already used in ~50 places across the site
 * (FinalCtaSection, ContactSection, etc.) — this just gives it a persistent entry point.
 */
function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-5 z-50 sm:bottom-7 sm:right-7"
    >
      {/* Soft pulsing halo behind the button */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-40 animate-ping"
        style={{ background: '#25D366', animationDuration: '2.4s' }}
      />

      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-sm bg-[#0B1F3A] px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_20px_rgba(11,31,58,0.25)]"
            >
              Chat on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          style={{ background: '#25D366' }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="#fff"
            aria-hidden="true"
          >
            <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2Zm0 18.13c-1.7 0-3.29-.47-4.65-1.28l-.33-.2-3.01.79.8-2.94-.22-.31A8.1 8.1 0 0 1 3.9 12c0-4.48 3.64-8.12 8.12-8.12S20.14 7.52 20.14 12s-3.64 8.13-8.12 8.13Zm4.44-6.1c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
}

export default WhatsAppWidget
