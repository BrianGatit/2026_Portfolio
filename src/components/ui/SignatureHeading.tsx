import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionStyle, type MotionValue } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'

/*
 * The choreography, in seconds from `delay` (~2.1s in all):
 *
 *   0.00 ─ axis rule ─ 0.55
 *   0.10 ─ SOFTWARE: bands slide in sideways, letter by letter ─ 1.45
 *          0.55 ─ ENGINEER: bands drop in, line levels out ─ 1.85
 *                                           1.45 ─ light ─ 2.10
 *
 * Each letter: three outline bands travel into alignment (0.7s), the solid
 * letter fills in under them (from +0.5s), the outlines fade (to +1.05s).
 */
const T = {
  rule: { at: 0, duration: 0.55 },
  one: { at: 0.1, stagger: 0.06 },
  two: { at: 0.55, stagger: 0.055 },
  light: { at: 1.45, duration: 0.65 },
} as const

/** When the composition has finished, relative to its `delay`. */
export const SIGNATURE_DURATION = T.light.at + T.light.duration

/** Three horizontal cuts through a letter. The outer bands overreach so no stroke is ever trimmed. */
const BANDS = ['inset(-40% -15% 61% -15%)', 'inset(39% -15% 33% -15%)', 'inset(67% -15% -40% -15%)'] as const

/** Where each band starts, in em. Line one travels sideways; line two drops in. */
const TRAVEL = {
  one: [-0.42, 0.3, -0.18],
  two: [-0.3, 0.2, 0.34],
} as const

interface GlyphProps {
  char: string
  line: 'one' | 'two'
  index: number
  start: number
  intro: boolean
  /** The letter catches the light along its leading edge. */
  lead: boolean
  /** Its middle band is drawn in orange while it assembles. */
  accent: boolean
  /** Shifts a few pixels with the pointer. */
  shift?: { x: MotionValue<number>; y: MotionValue<number> }
}

function Glyph({ char, line, index, start, intro, lead, accent, shift }: GlyphProps) {
  // Selected letters break rank: line one's run the other way, and a few of
  // line two's arrive sideways instead of from above.
  const reversed = index % 3 === 1
  const sideways = line === 'two' && index % 3 === 2
  const axis = line === 'one' || sideways ? 'x' : 'y'

  return (
    <motion.span
      className={cn('u-glyph', lead && 'u-glyph--lead')}
      style={shift ? { x: shift.x, y: shift.y } : undefined}
    >
      <motion.span
        className="u-glyph-solid"
        initial={intro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: start + 0.5 }}
      >
        {char}
      </motion.span>

      {intro &&
        BANDS.map((clip, band) => {
          const distance = TRAVEL[sideways ? 'one' : line][band] * (reversed ? -1 : 1)
          return (
            <motion.span
              key={band}
              aria-hidden
              className={cn('u-glyph-band', accent && band === 1 && 'u-glyph-band--accent')}
              style={{ clipPath: clip }}
              data-char={char}
              initial={{ [axis]: `${distance}em`, opacity: 0, filter: 'blur(6px)' }}
              animate={{ [axis]: '0em', opacity: [0, 1, 1, 0], filter: 'blur(0px)' }}
              transition={{
                [axis]: { duration: 0.7, ease: easeEditorial, delay: start + band * 0.05 },
                // Motion blur only while the band is fast, gone before it lands.
                filter: { duration: 0.6, ease: 'easeOut', delay: start + band * 0.05 },
                opacity: { duration: 1.05, times: [0, 0.15, 0.7, 1], ease: 'linear', delay: start },
              }}
            />
          )
        })}
    </motion.span>
  )
}

interface SignatureHeadingProps {
  /** Exactly two lines, set as one composition on a shared left edge. */
  lines: readonly [string, string]
  className?: string
  /** Seconds before the axis rule starts to draw. */
  delay?: number
  /**
   * Pointer position, −1…1 on each axis (0 at rest). Drives the lighting:
   * shadows fall away from it, a warm edge appears on the near side, and a
   * few letters shift by a couple of pixels. Leave at rest on touch.
   */
  pointerX?: MotionValue<number>
  pointerY?: MotionValue<number>
}

const plain = (text: string) =>
  [...text].map((char, index) => (
    <span key={index} className="u-glyph u-glyph-copy" data-char={char} />
  ))

/** Letters that answer the pointer — spread across both lines, never adjacent. */
const SHIFTING = { one: new Set([1, 5]), two: new Set([3]) } as const

/**
 * The hero's typographic signature. Two lines on one left edge, line one set
 * tighter and so a little wider; an orange axis rule between them that runs
 * past the words and ends in a small square; two hairline corner marks that
 * frame the block asymmetrically.
 *
 * The letters assemble from outline drawings cut into horizontal bands —
 * sideways for line one, from above for line two as it levels out of a slight
 * perspective — then fill solid as the outlines vanish, and a thin light
 * crosses the finished composition. The solid letters are real, selectable
 * text; the bands and the light are decorative copies, removed once done.
 *
 * Pointer response is pure motion values and CSS variables, so moving the
 * mouse never re-renders or restarts anything. Under reduced motion the
 * composition renders already resolved, with static shadows.
 */
export function SignatureHeading({ lines, className, delay = 0, pointerX, pointerY }: SignatureHeadingProps) {
  const reduceMotion = useReducedMotion()
  const intro = !reduceMotion
  const [assembled, setAssembled] = useState(!intro)

  // Drop the decorative bands once they have done their job — one state
  // change, at the end of the entrance, never on pointer movement.
  useEffect(() => {
    if (!intro) return
    const timer = window.setTimeout(() => setAssembled(true), (delay + SIGNATURE_DURATION + 0.2) * 1000)
    return () => window.clearTimeout(timer)
  }, [intro, delay])

  const rest = useMotionValue(0)
  const lx = pointerX ?? rest
  const ly = pointerY ?? rest
  const shift = { x: useTransform(lx, (v) => v * 3), y: useTransform(ly, (v) => v * 2) }

  const showBands = intro && !assembled
  let order = -1
  const glyphs = (line: 'one' | 'two', text: string) =>
    [...text].map((char, index) => {
      order += 1
      const at = line === 'one' ? T.one.at + index * T.one.stagger : T.two.at + index * T.two.stagger
      return (
        <Glyph
          key={`${line}-${index}`}
          char={char}
          line={line}
          index={index}
          start={delay + at}
          intro={showBands}
          lead={index === 0}
          accent={index === 0 || order % 5 === 3}
          shift={SHIFTING[line].has(index) ? shift : undefined}
        />
      )
    })

  return (
    <motion.span
      className={cn('u-signature relative inline-block', className)}
      style={{ '--lx': lx, '--ly': ly } as MotionStyle}
    >
      {/* corner mark, top left */}
      <motion.span
        aria-hidden
        className="u-signature-mark u-signature-mark--start"
        initial={intro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + T.rule.duration }}
      />

      {/* line one: tighter, so a little wider — assembles sideways */}
      <span className="u-signature-one block w-fit whitespace-nowrap">{glyphs('one', lines[0])}</span>

      {/* the axis: an orange rule that runs past the words to a small square */}
      <motion.span
        aria-hidden
        className="u-signature-rule block origin-left"
        initial={intro ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ duration: T.rule.duration, ease: easeEditorial, delay: delay + T.rule.at }}
      />

      {/* line two: a touch smaller and more open — drops in and levels out */}
      <span className="block [perspective:900px]">
        <motion.span
          className="u-signature-two relative block w-fit origin-bottom whitespace-nowrap"
          initial={intro ? { rotateX: 32, y: '0.12em' } : false}
          animate={{ rotateX: 0, y: '0em' }}
          transition={{ duration: 1.1, ease: easeEditorial, delay: delay + T.two.at }}
        >
          {glyphs('two', lines[1])}
          {/* corner mark, bottom right of the second word */}
          <motion.span
            aria-hidden
            className="u-signature-mark u-signature-mark--end"
            initial={intro ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: delay + T.light.at }}
          />
        </motion.span>
      </span>

      {/* the light: once across the finished composition */}
      {intro && !assembled && (
        <motion.span
          aria-hidden
          className="u-cinema-sweep u-cinema-sweep--thin select-none"
          initial={{ backgroundPosition: '100% 0%', opacity: 1 }}
          animate={{ backgroundPosition: '0% 0%', opacity: [1, 1, 0] }}
          transition={{
            backgroundPosition: { duration: T.light.duration, ease: [0.45, 0, 0.2, 1], delay: delay + T.light.at },
            opacity: { duration: T.light.duration, times: [0, 0.85, 1], delay: delay + T.light.at },
          }}
        >
          {/* split like the real letters, so the light lands on them exactly */}
          <span className="u-signature-one block w-fit whitespace-nowrap">{plain(lines[0])}</span>
          <span className="u-signature-rule block opacity-0" />
          <span className="u-signature-two block w-fit whitespace-nowrap">{plain(lines[1])}</span>
        </motion.span>
      )}
    </motion.span>
  )
}
