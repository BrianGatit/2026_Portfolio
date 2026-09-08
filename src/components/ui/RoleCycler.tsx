import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'

interface RoleCyclerProps {
  roles: readonly string[]
  /** Milliseconds each role holds before handing over. */
  hold?: number
  className?: string
  /** Type classes for the rotating word itself. */
  textClassName?: string
}

/**
 * The rotating role in the hero.
 *
 * Three things make this read as an identity rather than a text carousel:
 *
 * 1. **The slot never resizes.** All three roles are rendered invisibly in one
 *    grid cell, so the box is always as tall and wide as the longest of them
 *    and nothing on the page moves when the word changes.
 * 2. **The rule and caret are measured**, not approximated — they animate to
 *    the exact width of the active role, so the underline belongs to the word
 *    instead of to the container.
 * 3. **Enter and exit overlap** through a clipping mask with a blur, so one
 *    role hands over to the next rather than one disappearing and another
 *    arriving.
 *
 * Accessibility: the animated layer is `aria-hidden` and the full phrase is
 * supplied by the parent heading as visually hidden text, so assistive
 * technology and crawlers get one stable, complete sentence. Under
 * `prefers-reduced-motion` the cycling stops entirely and all three roles are
 * listed statically — content that rewrites itself on a timer is the thing
 * that preference is asking us not to do.
 */
export function RoleCycler({
  roles,
  hold = 3400,
  className,
  // A step below the name above it, and bounded so the longest role
  // ('Software Engineer') still fits a 320px screen — it is `whitespace-nowrap`,
  // so it cannot wrap its way out of trouble.
  textClassName = 'font-display text-[clamp(1.75rem,7.4vw,7.25rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink',
}: RoleCyclerProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  const spacerRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [widths, setWidths] = useState<number[]>([])

  // Measure each role once laid out, and again whenever type reflows.
  useEffect(() => {
    const measure = () =>
      setWidths(spacerRefs.current.map((element) => element?.getBoundingClientRect().width ?? 0))

    measure()

    const observer = new ResizeObserver(measure)
    spacerRefs.current.forEach((element) => element && observer.observe(element))

    // Webfonts land after first paint and change every width.
    if ('fonts' in document) void document.fonts.ready.then(measure)

    return () => observer.disconnect()
  }, [roles])

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return

    let timer = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), hold)

    // Don't cycle in a tab nobody is looking at.
    const onVisibility = () => {
      window.clearInterval(timer)
      if (!document.hidden) {
        timer = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), hold)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion, roles.length, hold])

  /* ---- reduced motion: no timers, nothing rewrites itself ---- */
  if (reduceMotion) {
    return (
      <span className={cn('block', className)} aria-hidden>
        {roles.map((role) => (
          <span key={role} className={cn('block', textClassName)}>
            {role}
          </span>
        ))}
      </span>
    )
  }

  const activeWidth = widths[index] ?? 0
  const spring = { type: 'spring', stiffness: 90, damping: 18, mass: 0.9 } as const

  return (
    <span className={cn('block', className)} aria-hidden>
      {/* ---- indicator: three ticks and a counter ---- */}
      <span className="mb-5 flex items-center gap-2 md:mb-7">
        {/* Width is animated by Motion; colour is a class so it re-themes
            instantly with the light/dark toggle instead of holding a resolved
            variable until the next transition. */}
        {roles.map((role, roleIndex) => (
          <motion.span
            key={role}
            className={cn(
              'block h-px shrink-0 transition-colors duration-500',
              roleIndex === index ? 'bg-accent' : 'bg-line-strong',
            )}
            animate={{ width: roleIndex === index ? 30 : 12 }}
            transition={{ duration: 0.5, ease: easeEditorial }}
          />
        ))}
        <span className="u-eyebrow ml-2 u-tabular">
          {String(index + 1).padStart(2, '0')} / {String(roles.length).padStart(2, '0')}
        </span>
      </span>

      {/* ---- the rotating word ---- */}
      <span className={cn('relative block', textClassName)}>
        {/* The mask. Padding keeps descenders ('g' in Engineer/Designer)
            inside the clip region rather than shaved off. */}
        <span className="relative block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          {/* Invisible stack — one grid cell, so the slot is the size of the
              largest role and never changes as the word does. */}
          <span className="grid">
            {roles.map((role, roleIndex) => (
              <span
                key={role}
                ref={(element) => {
                  spacerRefs.current[roleIndex] = element
                }}
                // `w-fit` + `justify-self-start` matter: a stretched grid item
                // would measure the full column, not the width of the word.
                className="invisible col-start-1 row-start-1 w-fit justify-self-start whitespace-nowrap"
              >
                {role}
              </span>
            ))}
          </span>

          <AnimatePresence initial={false}>
            <motion.span
              key={roles[index]}
              className="absolute inset-x-0 top-0 block whitespace-nowrap will-change-[transform,filter,opacity]"
              initial={{ y: '125%', filter: 'blur(14px)', opacity: 0 }}
              animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
              exit={{ y: '-125%', filter: 'blur(14px)', opacity: 0 }}
              transition={{
                y: spring,
                filter: { duration: 0.75, ease: easeEditorial },
                opacity: { duration: 0.55, ease: easeEditorial },
              }}
            >
              {roles[index]}
            </motion.span>
          </AnimatePresence>

          {/* The caret rides the end of the active word. The blink lives on a
              child so the CSS animation cannot fight Motion's own opacity —
              a CSS animation beats an inline style while it is running. */}
          <motion.span
            className="absolute top-[0.14em] left-0 block h-[0.62em] w-[0.05em]"
            initial={false}
            animate={{ x: activeWidth + 12, opacity: activeWidth > 0 ? 1 : 0 }}
            transition={{ x: spring, opacity: { duration: 0.3 } }}
          >
            <span
              className="block size-full bg-accent"
              style={{ animation: 'u-blink 1.15s steps(1, end) infinite' }}
            />
          </motion.span>
        </span>

        {/* The rule redraws itself to the width of each role. */}
        <motion.span
          className="mt-4 block h-[2px] origin-left bg-accent md:mt-5 md:h-[3px]"
          initial={false}
          animate={{ width: activeWidth }}
          transition={spring}
        />
      </span>
    </span>
  )
}
