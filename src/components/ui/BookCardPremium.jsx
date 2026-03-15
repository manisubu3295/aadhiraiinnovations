import { motion, useReducedMotion } from 'framer-motion'

function BookCardPremium({ 
  title, 
  description, 
  icon: Icon, 
  theme,
  includes,
  outcomes,
  delay = 0,
  compact = false,
  image
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={compact ? "relative min-h-[220px] md:min-h-[240px]" : "relative min-h-[500px] md:min-h-[520px]"}
      style={{ perspective: '1400px' }}
    >
      <div className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* Back page (right side - always visible) */}
        <div className={`absolute inset-0 rounded-xl ${theme.bgGradient} border ${theme.borderColor} shadow-lg overflow-hidden`}>
          <div className={compact ? "h-full p-2 flex flex-col" : "h-full p-6 md:p-7 flex flex-col"}>
            {/* Decorative pattern */}
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{ 
                backgroundImage: theme.pattern,
                backgroundSize: '20px 20px',
              }}
            />
            
            <div className="relative flex-1 flex flex-col">
              {image ? (
                <img src={image} alt={title + ' illustration'} className="w-10 h-10 rounded-lg object-cover mb-2" />
              ) : (
                <div className={`inline-flex items-center justify-center rounded-lg ${theme.iconBg} w-10 h-10 mb-2`}>
                  <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={2} />
                </div>
              )}
              
              <h3 className={`text-base md:text-lg font-bold ${theme.textColor} leading-tight mb-1`}>
                {title}
              </h3>
              <p className={`text-xs ${theme.descColor} leading-snug mb-2`}>
                {description}
              </p>

              <div className="mt-auto space-y-1">
                <div>
                  <h4 className={`text-[10px] font-bold uppercase tracking-wider ${theme.labelColor} mb-0.5`}>
                    Includes
                  </h4>
                  <ul className="space-y-0.5">
                    {includes.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: delay + 0.8 + i * 0.1, duration: 0.4 }}
                        className={`flex items-start gap-1 text-[11px] ${theme.descColor}`}
                      >
                        <span className={theme.bulletColor}>•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className={`text-[10px] font-bold uppercase tracking-wider ${theme.labelColor} mb-0.5`}>
                    Outcome
                  </h4>
                  <ul className="space-y-0.5">
                    {outcomes.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: delay + 1.0 + i * 0.1, duration: 0.4 }}
                        className={`flex items-start gap-1 text-[11px] ${theme.descColor}`}
                      >
                        <span className={theme.bulletColor}>•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Front cover page (opens automatically) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ rotateY: 0 }}
            whileInView={{ rotateY: -160 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.43, 0.13, 0.23, 0.96],
              delay: delay + 0.3
            }}
            className={`absolute inset-0 rounded-xl ${theme.coverGradient} border-2 ${theme.coverBorder} shadow-xl overflow-hidden`}
            style={{ 
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Book spine on left edge */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.spineColor}`} />
            
            {/* Cover pattern */}
            <div 
              className="absolute inset-0 opacity-[0.12]"
              style={{ 
                backgroundImage: theme.pattern,
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative h-full p-6 md:p-7 flex flex-col items-center justify-center text-center">
              <div className={`inline-flex items-center justify-center rounded-xl ${theme.coverIconBg} w-16 h-16 mb-4 shadow-lg`}>
                <Icon className={`h-8 w-8 ${theme.coverIconColor}`} strokeWidth={2.5} />
              </div>
              
              <h3 className={`text-2xl md:text-3xl font-bold ${theme.coverTextColor} leading-tight px-4`}>
                {title}
              </h3>

              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Reduced motion fallback */}
        {shouldReduceMotion && (
          <div className={`absolute inset-0 rounded-xl ${theme.bgGradient} border ${theme.borderColor} shadow-lg overflow-hidden`}>
            <div className="h-full p-6 md:p-7 flex flex-col">
              <div className={`inline-flex items-center justify-center rounded-lg ${theme.iconBg} w-12 h-12 mb-4`}>
                <Icon className={`h-6 w-6 ${theme.iconColor}`} strokeWidth={2} />
              </div>
              
              <h3 className={`text-xl md:text-2xl font-bold ${theme.textColor} leading-tight mb-3`}>
                {title}
              </h3>
              
              <p className={`text-sm ${theme.descColor} leading-relaxed`}>
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BookCardPremium
