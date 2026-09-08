import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { fadeUp, inViewEarly, staggerParent, transition } from '@/utils/motion'
import { cn } from '@/utils/cn'

/**
 * Motion components are looked up from a fixed map and widened to a single
 * signature — a union of motion components is painful to render in JSX and the
 * props we pass are identical for every tag.
 */
const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  dl: motion.dl,
  dd: motion.dd,
} as const

type MotionTag = keyof typeof motionTags

const tag = (name: MotionTag) => motionTags[name] as typeof motion.div

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Distance travelled, in pixels. */
  y?: number
  as?: Extract<MotionTag, 'div' | 'section' | 'li' | 'article' | 'span'>
  variants?: Variants
}

/** Scroll-triggered fade-up. The default reveal for anything that is not text. */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div', variants }: RevealProps) {
  const Component = tag(as)
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inViewEarly}
      variants={
        variants ?? {
          hidden: { opacity: 0, y },
          visible: { opacity: 1, y: 0, transition: { ...transition.base, delay } },
        }
      }
    >
      {children}
    </Component>
  )
}

interface RevealGroupProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: Extract<MotionTag, 'div' | 'ul' | 'ol' | 'section' | 'dl'>
}

/** Parent for staggered children — pair with `RevealItem`. */
export function RevealGroup({ children, className, stagger = 0.08, delay = 0, as = 'div' }: RevealGroupProps) {
  const Component = tag(as)
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inViewEarly}
      variants={staggerParent(stagger, delay)}
    >
      {children}
    </Component>
  )
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  as?: Extract<MotionTag, 'div' | 'li' | 'article' | 'span' | 'dd'>
}

export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const Component = tag(as)
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  )
}

/** A hairline rule that draws itself in from the left. */
export function RuleLine({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn('h-px w-full origin-left bg-line', className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
