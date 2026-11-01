import { Fragment, useLayoutEffect, useRef, useState, type ElementType } from 'react'
import { motion, type Variants } from 'motion/react'
import { easeEditorial, inViewEarly, maskTravel, typeMotion } from '@/utils/motion'

interface AnimatedTextProps {
  /** A string, or an array of authored lines (each still wraps naturally). */
  text: string | readonly string[]
  as?: ElementType
  className?: string
  id?: string
  /** Extra delay before the first line, in seconds. */
  delay?: number
  /** Animate on mount, as a page title, instead of when scrolled into view. */
  immediate?: boolean
}

// Server rendering has no layout; the effect simply does not run there.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? () => {} : useLayoutEffect

/**
 * Editorial heading reveal, line by line — by the lines the heading actually
 * sets in, not the ones it was written in.
 *
 * Every word sits in its own mask (`.u-mask`), so the heading wraps, balances
 * and hyphenates exactly as plain text would. After layout the words are
 * grouped by the line they landed on, and each line rises together; the
 * grouping is re-measured whenever the heading's width changes, so it holds at
 * every breakpoint and for any copy.
 *
 * Screen readers and crawlers get the sentence once, unsplit. Under reduced
 * motion `MotionConfig` drops the transform and the heading is simply there.
 */
export function AnimatedText({ text, as: Tag = 'div', className, id, delay = 0, immediate = false }: AnimatedTextProps) {
  const authored = (typeof text === 'string' ? text.split('\n') : [...text]).filter((line) => line.length > 0)
  const words = authored.map((line) => line.split(' ').filter(Boolean))

  const tier = immediate ? typeMotion.page : typeMotion.section
  const ref = useRef<HTMLSpanElement>(null)

  // Until measured (and on the server) each authored line counts as one line.
  const [lineOf, setLineOf] = useState<number[]>(() => words.flatMap((line, index) => line.map(() => index)))

  useIsomorphicLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    function measure() {
      const masks = root!.querySelectorAll<HTMLElement>('.u-mask')
      const next: number[] = []
      let line = -1
      let top = Number.NEGATIVE_INFINITY
      masks.forEach((mask) => {
        // A new line starts wherever a word sits clearly lower than the last.
        if (mask.offsetTop > top + 2) {
          line += 1
          top = mask.offsetTop
        }
        next.push(line)
      })
      setLineOf((current) =>
        current.length === next.length && current.every((value, index) => value === next[index]) ? current : next,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [text])

  const rise: Variants = {
    hidden: { y: maskTravel },
    visible: (line: number) => ({
      y: '0%',
      transition: { duration: tier.duration, ease: easeEditorial, delay: tier.delay + delay + line * tier.stagger },
    }),
  }

  const trigger = immediate
    ? { initial: 'hidden' as const, animate: 'visible' as const }
    : { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: inViewEarly }

  let wordIndex = -1

  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{authored.join(' ')}</span>
      <motion.span ref={ref} aria-hidden className="block" {...trigger}>
        {words.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.map((word, index) => {
              wordIndex += 1
              return (
                <Fragment key={index}>
                  {index > 0 && ' '}
                  <span className="u-mask">
                    <motion.span variants={rise} custom={lineOf[wordIndex] ?? lineIndex} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                </Fragment>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
