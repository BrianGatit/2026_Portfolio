import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'

interface AngleRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /**
   * Colour of the cover that slides away — match whatever sits behind the
   * media, so the edge reads as the image arriving rather than a panel leaving.
   */
  cover?: string
}

/**
 * Unveils media behind a slanted edge as it scrolls into view, while the
 * content settles from a slight zoom. Fills its (positioned) parent.
 *
 * The edge is a skewed cover sliding off to the right — the lean echoing the
 * strokes of the Munga mark. It is a transform rather than an animated
 * `clip-path`: a clip repaints the whole image every frame, which showed up as
 * dropped frames while scrolling a grid of large covers. The cover is removed
 * once it has passed, so nothing is left over the media.
 *
 * Reduced motion shows the media at once (a cover is not a transform, so
 * `MotionConfig reducedMotion` alone would not catch it).
 */
export function AngleReveal({ children, className, delay = 0, cover = 'var(--surface)' }: AngleRevealProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const [done, setDone] = useState(false)

  const progress = useMotionValue(0)
  // The cover is 220% of the frame wide and leans by tan(16°) of its height,
  // so at 0% it still covers the lower-right corner of the tallest piece
  // (~1.4:1), and at 82% of its own width even the foot of the slanted edge
  // has cleared that piece's right side.
  const x = useTransform(progress, [0, 1], ['0%', '82%'])
  const scale = useTransform(progress, [0, 1], [1.08, 1])

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(progress, 1, {
      duration: 1.1,
      ease: easeEditorial,
      delay,
      onComplete: () => setDone(true),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, progress, delay])

  if (reduceMotion) return <div className={cn('absolute inset-0', className)}>{children}</div>

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        {children}
      </motion.div>
      {!done && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-25%] left-[-30%] w-[220%] origin-top-left"
          style={{ x, skewX: -16, background: cover }}
        />
      )}
    </div>
  )
}
