import { motion } from 'framer-motion'
import './BackButton.css'

export default function BackButton({ className = '', onClick, ariaLabel = 'Quay lại', disabled = false, reducedMotion = false }) {
  return (
    <motion.button
      className={`portfolio-back ${className}`.trim()}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      whileHover={reducedMotion || disabled ? undefined : { x: -4, scale: 1.055 }}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
    >
      <svg className="portfolio-back-arrow" viewBox="0 0 38 24" fill="none" aria-hidden="true">
        <path d="M36 12H3M3 12l9-9M3 12l9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="portfolio-back-text">BACK</span>
    </motion.button>
  )
}
