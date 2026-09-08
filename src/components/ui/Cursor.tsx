import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useMediaQuery } from '@/hooks/useUi'

/**
 * A trailing ring that follows the pointer and expands into a label over
 * project media (`data-cursor="View case study"`).
 *
 * The native cursor is deliberately left visible — hiding it is a common
 * portfolio trick that costs real usability — so this reads as an accent on
 * top of the pointer rather than a replacement for it. Fine pointers only,
 * and never under `prefers-reduced-motion`.
 */
export function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduceMotion = useReducedMotion()
  const enabled = finePointer && !reduceMotion

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 400, damping: 34, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 400, damping: 34, mass: 0.35 })

  const [label, setLabel] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    function onMove(event: PointerEvent) {
      x.set(event.clientX)
      y.set(event.clientY)
      // Setting the same value is a no-op in React, so this is cheap.
      setVisible(true)

      const target = event.target as Element | null
      const zone = target?.closest?.('[data-cursor]') as HTMLElement | null
      const interactive = target?.closest?.('a, button, input, textarea, select, [role="button"]')

      setLabel(zone?.dataset.cursor ?? null)
      setActive(Boolean(zone) || Boolean(interactive))
    }

    function onLeave() {
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[95] hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-accent text-[0.6rem] font-medium tracking-[0.16em] whitespace-nowrap text-on-accent uppercase"
        animate={{
          width: label ? 108 : active ? 44 : 26,
          height: label ? 108 : active ? 44 : 26,
          opacity: visible ? (label || active ? 1 : 0.55) : 0,
          backgroundColor: label ? 'var(--accent)' : 'transparent',
          x: label ? -54 : active ? -22 : -13,
          y: label ? -54 : active ? -22 : -13,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 0.5 }}
      >
        <motion.span
          animate={{ opacity: label ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className="px-3 text-center leading-tight"
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
