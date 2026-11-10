import type { PointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'
import { AngleReveal } from '@/components/ui/AngleReveal'
import { useMediaQuery } from '@/hooks/useUi'

/** Furthest the image leans towards the pointer, in px. */
const DRIFT = 9
const spring = { stiffness: 120, damping: 20, mass: 0.6 }

interface RevealMediaProps {
  children: ReactNode
  delay?: number
}

/**
 * Project media, the same everywhere it appears: unveiled behind the slanted
 * edge on first view, zoomed while its card is hovered (the nearest `group`),
 * and leaning a few pixels towards the pointer on desktop.
 *
 * The lean stays inside the margin the hover zoom creates (≈2% a side), so it
 * never exposes the frame's edge. Touch, small screens and reduced motion get
 * the reveal and zoom rules only — `AngleReveal` handles reduced motion itself.
 */
export function RevealMedia({ children, delay = 0.1 }: RevealMediaProps) {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 768px)')
  const reduceMotion = useReducedMotion()
  const drift = finePointer && !reduceMotion

  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2 * DRIFT)
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2 * DRIFT)
  }

  function onPointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <AngleReveal delay={delay}>
      <motion.div
        className="absolute inset-0"
        style={drift ? { x, y } : undefined}
        onPointerMove={drift ? onPointerMove : undefined}
        onPointerLeave={drift ? onPointerLeave : undefined}
      >
        <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]">
          {children}
        </div>
      </motion.div>
    </AngleReveal>
  )
}
