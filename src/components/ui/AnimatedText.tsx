import { type ElementType } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/utils/cn'
import { inViewEarly, maskLine, staggerParent } from '@/utils/motion'

interface AnimatedTextProps {
  /** A string (split on '\n') or an array of lines. */
  text: string | readonly string[]
  as?: ElementType
  className?: string
  lineClassName?: string
  id?: string
  /** Reveal whole lines, or word by word. */
  by?: 'line' | 'word'
  delay?: number
  stagger?: number
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean
}

/**
 * Editorial text reveal: each line slides up out of a clipping mask, so the
 * type appears to be set rather than faded in.
 */
export function AnimatedText({
  text,
  as: Tag = 'div',
  className,
  lineClassName,
  by = 'line',
  delay = 0,
  stagger = 0.09,
  immediate = false,
  id,
}: AnimatedTextProps) {
  const lines = (typeof text === 'string' ? text.split('\n') : [...text]).filter((line) => line.length > 0)

  const parentMotion = immediate
    ? { initial: 'hidden' as const, animate: 'visible' as const }
    : { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: inViewEarly }

  return (
    <Tag className={className} id={id}>
      <motion.span
        className="block"
        variants={staggerParent(by === 'word' ? stagger * 0.55 : stagger, delay)}
        {...parentMotion}
      >
        {lines.map((line, lineIndex) =>
          by === 'word' ? (
            <span key={lineIndex} className={cn('block', lineClassName)}>
              {line.split(' ').map((word, wordIndex) => (
                <span key={`${lineIndex}-${wordIndex}`} className="u-clip inline-block align-bottom">
                  <motion.span variants={maskLine} className="inline-block pr-[0.26em]">
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          ) : (
            <span key={lineIndex} className={cn('u-clip', lineClassName)}>
              <motion.span variants={maskLine} className="block will-change-transform">
                {line}
              </motion.span>
            </span>
          ),
        )}
      </motion.span>
    </Tag>
  )
}
