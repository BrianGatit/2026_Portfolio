import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ScrollStatementProps {
  children: ReactNode
  className?: string
}

/**
 * A closing statement that brightens and settles as it is scrolled into the
 * reading zone — tied to scroll position, so it moves with the reader instead
 * of playing once. It reaches full opacity by the time its top is 62% of the
 * way down the viewport; every page that uses it has a footer below, so it can
 * always be scrolled that far.
 *
 * Opacity and transform only. Motion values bound to style are not covered by
 * `MotionConfig reducedMotion`, so the ranges collapse here explicitly.
 */
export function ScrollStatement({ children, className }: ScrollStatementProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.98', 'start 0.62'] })
  const opacity = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [0.25, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, 0])

  return (
    <motion.p ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.p>
  )
}
