import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion, useSpring, type Variants } from 'motion/react'
import { cn } from '@/utils/cn'
import { useMediaQuery } from '@/hooks/useUi'
import { easeEditorial, maskTravel } from '@/utils/motion'
import { SignatureHeading, SIGNATURE_DURATION } from './SignatureHeading'
import { FloatingForms } from '@/components/visual/FloatingForms'
import { LowPolyField } from '@/components/visual/LowPolyField'

/** How long each supporting role holds before the next replaces it. */
const ROLE_HOLD = 4.2

const spring = { stiffness: 70, damping: 18, mass: 0.8 }

/** 'SOFTWARE ENGINEER' → 'Software Engineer', so screen readers say words, not letters. */
const titleCase = (text: string) => text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
/** ['a', 'b', 'c'] → 'a, b and c' */
const listOf = (items: string[]) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

interface HeroHeadingProps {
  name: string
  /** The dominant headline; set one word per line. */
  headline: string
  /** Supporting roles beneath the headline; more than one rotates in place. */
  roles: readonly string[]
  delay?: number
  className?: string
}

/**
 * The home hero's heading: a name, the signature two-line composition, and
 * supporting roles that rise in beneath it and take turns in a fixed slot.
 * On desktop the floating forms behind it shift with the pointer at different
 * depths; the composition itself settles and stays perfectly still.
 *
 * Every motion is opt-out: touch and small screens get no pointer effects,
 * and reduced motion gets the whole heading already set, with no rotation.
 * Screen readers get one stable sentence — the rotating line is hidden from
 * them so it never announces itself every few seconds.
 */
export function HeroHeading({ name, headline, roles, delay = 0, className }: HeroHeadingProps) {
  const reduceMotion = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 768px)')
  const interactive = finePointer && !reduceMotion

  const lines = headline.split(' ')
  const headlineAt = delay + 0.25
  const landed = headlineAt + SIGNATURE_DURATION

  // Pointer, -1…1 across the hero; springs keep every response unhurried.
  const pointerX = useSpring(0, spring)
  const pointerY = useSpring(0, spring)

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    const py = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
    pointerX.set(px)
    pointerY.set(py)
  }

  function onPointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className={cn('relative', className)} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {/* atmosphere: the faceted field and three floating forms */}
      <LowPolyField className="absolute -inset-x-[8%] -inset-y-[20%] -z-10 h-[140%] w-[116%]" delay={delay} />
      <FloatingForms
        pointerX={pointerX}
        pointerY={pointerY}
        delay={landed - 0.6}
        className="absolute inset-0 -z-10 hidden sm:block"
      />

      <h1>
        <span className="sr-only">{`${titleCase(name)} — ${listOf([headline, ...roles].map(titleCase))}`}</span>

        <span aria-hidden className="block">
          {/* name */}
          <span className="u-clip">
            <motion.span
              className="block font-display text-[clamp(1rem,1.7vw,1.5rem)] leading-none font-bold tracking-[0.16em] text-ink uppercase"
              initial={reduceMotion ? false : { y: maskTravel }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: easeEditorial, delay }}
            >
              {name}
            </motion.span>
          </span>

          {/* the signature composition */}
          <span className="mt-6 block md:mt-9">
            <SignatureHeading
              lines={[lines[0], lines[1]] as const}
              delay={headlineAt}
              pointerX={pointerX}
              pointerY={pointerY}
              className="text-[13.5vw] md:text-[min(10.6vw,11rem)]"
            />
          </span>

          {/* supporting roles */}
          <RoleSwap
            roles={roles}
            start={landed - 0.35}
            className="mt-6 font-display text-[clamp(1.5rem,4.6vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.03em] text-ink-secondary uppercase md:mt-9"
          />
        </span>
      </h1>
    </div>
  )
}

const roleWord: Variants = {
  hidden: { y: maskTravel, opacity: 0 },
  visible: ({ at, index }: { at: number; index: number }) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: easeEditorial, delay: at + index * 0.12 },
  }),
  exit: ({ index }: { index: number }) => ({
    y: '-110%',
    opacity: 0,
    transition: { duration: 0.45, ease: easeEditorial, delay: index * 0.06 },
  }),
}

const roleLight: Variants = {
  hidden: { backgroundPosition: '100% 0%', opacity: 1 },
  visible: (at: number) => ({
    backgroundPosition: '0% 0%',
    transition: { duration: 1.3, ease: [0.45, 0, 0.2, 1], delay: at },
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/**
 * The supporting line. Each role's words rise out of masks on a stagger while
 * fading in, then a warm light crosses them; after a hold the words lift away
 * and the next role rises. Every role is stacked invisibly in one grid cell,
 * so the slot is always the size of the longest and nothing below moves.
 */
function RoleSwap({ roles, start, className }: { roles: readonly string[]; start: number; className?: string }) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return
    let timer = 0
    const schedule = (wait: number) => {
      timer = window.setTimeout(() => {
        first.current = false
        setIndex((current) => (current + 1) % roles.length)
        schedule(ROLE_HOLD * 1000)
      }, wait)
    }
    schedule((start + ROLE_HOLD) * 1000)

    // Hold still in a tab nobody is looking at.
    const onVisibility = () => {
      window.clearTimeout(timer)
      if (!document.hidden) schedule(ROLE_HOLD * 1000)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion, roles.length, start])

  const role = roles[index]
  const wordsAt = first.current ? start : 0
  const words = role.split(' ')

  return (
    <span className={cn('grid', className)}>
      {roles.map((item) => (
        <span key={item} className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {item}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={!reduceMotion}>
        {/* Variant labels flow down from here, so the words' exits run too —
            plain exit objects on descendants would be skipped. */}
        <motion.span
          key={role}
          className="relative col-start-1 row-start-1 whitespace-nowrap"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {words.map((word, wordIndex) => (
            <span key={word}>
              {wordIndex > 0 && ' '}
              <span className="u-mask">
                <motion.span className="inline-block" variants={roleWord} custom={{ at: wordsAt, index: wordIndex }}>
                  {word}
                </motion.span>
              </span>
            </span>
          ))}

          {/* the light crosses each role once it has landed */}
          {!reduceMotion && (
            <motion.span
              aria-hidden
              className="u-cinema-sweep u-cinema-sweep--warm"
              variants={roleLight}
              custom={wordsAt + 0.45 + words.length * 0.12}
            >
              {words.map((word, wordIndex) => (
                <span key={word}>
                  {wordIndex > 0 && ' '}
                  <span className="inline-block">{word}</span>
                </span>
              ))}
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
