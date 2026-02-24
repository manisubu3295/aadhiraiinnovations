import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

function BookCard({ 
  title, 
  description, 
  icon: Icon, 
  theme, 
  bulletsLeft, 
  bulletsRight, 
  tags,
  isOpenOnMobile,
  onToggleMobile
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasTeased, setHasTeased] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  const isOpen = isHovered || isOpenOnMobile
  
  // Teaser animation on scroll into view (desktop only, if motion enabled)
  useEffect(() => {
    if (!shouldReduceMotion && window.innerWidth >= 768 && !hasTeased) {
      const timer = setTimeout(() => {
        setHasTeased(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [shouldReduceMotion, hasTeased])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggleMobile?.()
    }
  }

  // Reduced motion fallback: simple expand instead of 3D flip
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="group"
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={onToggleMobile}
          onKeyDown={handleKeyDown}
          className={`relative overflow-hidden rounded-xl border ${theme.border} bg-white p-6 shadow-lg transition-all duration-300 cursor-pointer ${
            isOpen ? 'shadow-xl' : 'hover:shadow-xl'
          }`}
        >
          <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${theme.gradient}`} />
          
          <div className={`inline-flex rounded-lg ${theme.iconBg} p-3 transition-colors`}>
            <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={2} />
          </div>
          
          <h3 className="mt-4 text-lg font-bold text-[#0B1F3A]">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
          
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Key Points</h4>
                <ul className="space-y-2">
                  {bulletsLeft.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">How It Helps</h4>
                <ul className="space-y-2">
                  {bulletsRight.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`inline-block rounded-full ${theme.tagBg} px-3 py-1 text-xs font-medium ${theme.tagText}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {!isOpen && (
            <div className="mt-4 text-xs text-slate-400 font-medium">Tap to explore →</div>
          )}
        </div>
      </motion.div>
    )
  }

  // 3D Book animation (when motion is enabled)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group"
      style={{ perspective: '1400px' }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggleMobile}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => window.innerWidth >= 768 && setIsHovered(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsHovered(false)}
        className="relative cursor-pointer min-h-[320px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Inner Pages (Always visible underneath) */}
        <div className="absolute inset-0 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-px bg-slate-200 h-full">
            {/* Left Page */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 overflow-y-auto relative">
              {/* Subtle pattern */}
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ 
                  backgroundImage: theme.pattern,
                  backgroundSize: '20px 20px',
                  backgroundRepeat: 'repeat'
                }}
              />
              
              <div className="relative z-10">
                <div className={`inline-block rounded-full ${theme.tagBg} px-2.5 py-1 text-xs font-semibold ${theme.tagText} mb-4`}>
                  {tags?.[0] || 'Enterprise'}
                </div>
                
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Key Points</h4>
                <ul className="space-y-2.5">
                  {bulletsLeft.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
                      transition={{ delay: isOpen ? 0.2 + i * 0.08 : 0, duration: 0.4 }}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${theme.dotColor} mt-1.5 flex-shrink-0`} />
                      <span className="leading-relaxed">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Page */}
            <div className="bg-white p-6 overflow-y-auto relative">
              {/* Diagonal lines pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(45deg, #0B1F3A 0px, #0B1F3A 1px, transparent 1px, transparent 12px)',
                }}
              />
              
              <div className="relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">How It Helps</h4>
                <ul className="space-y-2.5">
                  {bulletsRight.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
                      transition={{ delay: isOpen ? 0.3 + i * 0.08 : 0, duration: 0.4 }}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <ChevronRight className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>

                {tags && tags.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ delay: isOpen ? 0.5 : 0 }}
                    className="mt-6 pt-4 border-t border-slate-200"
                  >
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(1).map((tag, i) => (
                        <span 
                          key={i} 
                          className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Book Cover (Opens like a door) */}
        <motion.div
          className="book-cover absolute inset-0 rounded-xl border-2 bg-white shadow-xl overflow-hidden"
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden',
            zIndex: isOpen ? 0 : 10,
          }}
          animate={{
            rotateY: isOpen ? -165 : (hasTeased && !isHovered && !isOpenOnMobile ? [0, -12, 0] : 0),
          }}
          transition={{
            rotateY: { 
              duration: isOpen ? 0.8 : 1.2, 
              ease: [0.43, 0.13, 0.23, 0.96],
            }
          }}
        >
          {/* Spine (left edge) */}
          <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${theme.gradient} opacity-90`} />
          
          {/* Accent strip */}
          <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />
          
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ 
              backgroundImage: theme.pattern,
              backgroundSize: '20px 20px',
              backgroundRepeat: 'repeat'
            }}
          />

          <div className="relative p-6 min-h-[320px] flex flex-col bg-white z-10">
            <div className={`inline-flex self-start rounded-lg ${theme.iconBg} p-3 shadow-sm`}>
              <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={2} />
            </div>
            
            <h3 className="mt-auto text-lg font-bold text-[#0B1F3A] leading-tight">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
            
            <div className="mt-4 text-xs text-slate-400 font-medium">
              {typeof window !== 'undefined' && window.innerWidth >= 768 ? 'Hover to open' : 'Tap to open'}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BookCard
