import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * Scroll-linked parallax for a single element.
 *
 * `MotionConfig reducedMotion` only governs animations, not motion values bound
 * to style, so the preference has to be honoured here explicitly — the range
 * collapses to zero and the element simply sits still.
 *
 * Pair the returned `y` with an element that is scaled slightly larger than its
 * frame, or the travel will expose an edge.
 */
export function useParallax(distance = 40) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-distance, distance])

  return { ref, y }
}

/**
 * Parallax measured from the top of the document instead of from an element.
 *
 * For anything already on screen at load — the hero — this is the right one:
 * it starts at exactly zero offset rather than part-way through a range.
 */
export function usePageParallax(distance = 60, over = 700) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, over], reduceMotion ? [0, 0] : [0, distance])
}
