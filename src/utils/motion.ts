import type { Transition, Variants } from 'motion/react'

/**
 * One shared motion vocabulary. Every animation on the site is built from
 * these primitives so the whole page moves with the same physics.
 *
 * `MotionConfig reducedMotion="user"` at the app root strips transforms for
 * visitors who ask for reduced motion; nothing here needs to check it again.
 */

export const easeEditorial: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const easeSwift: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const transition = {
  quick: { duration: 0.35, ease: easeSwift } satisfies Transition,
  base: { duration: 0.6, ease: easeEditorial } satisfies Transition,
  media: { duration: 1.1, ease: easeEditorial } satisfies Transition,
}

/** Fade up — the default section/element reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.base },
}

/** Line-by-line editorial reveal: the child slides out of a clipping mask. */
export const maskLine: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.85, ease: easeEditorial } },
}

export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Shared viewport config so reveals trigger at a consistent point. */
export const inViewEarly = { once: true, amount: 0.1 } as const

/** Page-level transition used by the route wrapper. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeEditorial } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.28, ease: easeSwift } },
}
