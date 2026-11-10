import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useMediaQuery } from '@/hooks/useUi'

/**
 * A trailing ring that follows the pointer and changes with what sits under it:
 * a wider ring over links and buttons, a soft accent wash over images, and a
 * small label over project media (`data-cursor="View case study"`).
 *
 * The native cursor is deliberately left visible — hiding it is a common
 * portfolio trick that costs real usability — so this reads as an accent on
 * top of the pointer rather than a replacement for it. Fine pointers on
 * md+ screens only, and never under `prefers-reduced-motion`.
 */

type Mode = 'idle' | 'link' | 'media' | 'label' | 'text'

const INTERACTIVE = 'a, button, select, summary, label, [role="button"], [role="link"], [role="tab"]'
const TEXT_ENTRY = 'input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"]), textarea, [contenteditable="true"]'
const MEDIA = 'img, picture, video, canvas, svg[role="img"]'

/** Diameter in px per mode; the label circle has to fit two short lines. */
const SIZE: Record<Mode, number> = { idle: 22, link: 40, media: 52, label: 92, text: 22 }

function resolve(target: Element | null): { mode: Mode; label: string | null } {
  if (!target?.closest) return { mode: 'idle', label: null }
  if (target.closest(TEXT_ENTRY)) return { mode: 'text', label: null }

  const zone = target.closest<HTMLElement>('[data-cursor]')
  if (zone?.dataset.cursor) return { mode: 'label', label: zone.dataset.cursor }
  if (target.closest(INTERACTIVE)) return { mode: 'link', label: null }
  if (target.closest(MEDIA)) return { mode: 'media', label: null }
  return { mode: 'idle', label: null }
}

export function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 768px)')
  const reduceMotion = useReducedMotion()
  const enabled = finePointer && !reduceMotion

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 500, damping: 38, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 500, damping: 38, mass: 0.3 })

  const [mode, setMode] = useState<Mode>('idle')
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let lastX = -1
    let lastY = -1
    let frame = 0

    // Setting the same value is a no-op in React, so these are cheap.
    function apply(target: Element | null) {
      const next = resolve(target)
      setMode(next.mode)
      if (next.label) setLabel(next.label)
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      lastX = event.clientX
      lastY = event.clientY
      x.set(lastX)
      y.set(lastY)
      setVisible(true)
      apply(event.target as Element | null)
    }

    // Content scrolls under a still pointer, so re-check what is beneath it.
    function onScroll() {
      if (frame || lastX < 0) return
      frame = requestAnimationFrame(() => {
        frame = 0
        apply(document.elementFromPoint(lastX, lastY))
      })
    }

    function onOut(event: MouseEvent) {
      if (!event.relatedTarget) setVisible(false)
    }

    function hide() {
      setVisible(false)
      setPressed(false)
    }

    // Keyboard users get the focus ring; the follower would only be noise.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') hide()
    }

    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mouseout', onOut)
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', onKeyDown)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = SIZE[mode]
  const showLabel = mode === 'label'
  const opacity = !visible || mode === 'text' ? 0 : mode === 'idle' ? 0.5 : 1

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[95]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-accent text-[0.58rem] font-medium tracking-[0.16em] text-on-accent uppercase"
        initial={false}
        animate={{
          width: size,
          height: size,
          x: -size / 2,
          y: -size / 2,
          opacity,
          scale: pressed ? 0.86 : 1,
          backgroundColor: showLabel ? 'var(--accent)' : mode === 'media' ? 'var(--accent-wash)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.45 }}
      >
        <motion.span
          initial={false}
          animate={{ opacity: showLabel ? 1 : 0, scale: showLabel ? 1 : 0.8 }}
          transition={{ duration: 0.18 }}
          className="px-3 text-center leading-tight"
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
