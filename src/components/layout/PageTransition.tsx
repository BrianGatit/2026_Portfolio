import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { pageTransition } from '@/utils/motion'

/**
 * Route-level entrance and exit. Deliberately understated — a long fade or a
 * slide across the whole page makes navigation feel slow, and this site has a
 * lot of pages to move between.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

/** Resets scroll on navigation, but leaves in-page anchors alone. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
