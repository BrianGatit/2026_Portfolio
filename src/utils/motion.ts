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

/**
 * How far masked type starts below its resting place. The masks reach 0.22em
 * below a line box whose height can be as little as 0.86em, and caps rise
 * above it, so anything under ~135% would leave the tops of letters showing.
 */
export const maskTravel = '140%'

/** Line-by-line editorial reveal: the child slides out of a clipping mask. */
export const maskLine: Variants = {
  hidden: { y: maskTravel },
  visible: { y: '0%', transition: { duration: 0.85, ease: easeEditorial } },
}

/**
 * Typographic hierarchy. Page titles arrive on load, slowest and with the most
 * air between lines; section titles arrive on scroll, quicker and tighter, so
 * they read as subordinate. Supporting copy is never split — it fades up whole.
 */
export const typeMotion = {
  page: { duration: 0.95, stagger: 0.11, delay: 0.1 },
  section: { duration: 0.75, stagger: 0.075, delay: 0 },
} as const

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
