import { motion, useScroll, useSpring } from 'motion/react'

/** Fixed print-grain overlay. Sits above content, below nothing interactive. */
export function Grain() {
  return <div className="u-grain" aria-hidden />
}

/**
 * Reading progress. Two pixels of accent at the very top of the viewport —
 * the only element on the site that reports on itself.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 240, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent"
    />
  )
}
