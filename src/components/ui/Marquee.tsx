import type { CSSProperties } from 'react'
import { cn } from '@/utils/cn'

interface MarqueeProps {
  items: readonly string[]
  /** Seconds for one full pass. */
  duration?: number
  className?: string
  separator?: string
}

/**
 * A slow horizontal ticker of tool names. Duplicated once and translated by
 * -50%, so the loop is seamless; paused on hover and frozen entirely under
 * `prefers-reduced-motion` (handled in the base stylesheet).
 */
export function Marquee({ items, duration = 46, className, separator = '·' }: MarqueeProps) {
  const run = [...items, ...items]

  return (
    <div
      className={cn('u-marquee relative overflow-hidden py-5', className)}
      aria-hidden
      style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
    >
      <div className="u-marquee-track">
        {run.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span className="px-5 font-display text-[clamp(1rem,1.6vw,1.35rem)] tracking-[-0.01em] text-ink-secondary whitespace-nowrap">
              {item}
            </span>
            <span className="text-ink-faint select-none">{separator}</span>
          </span>
        ))}
      </div>

      {/* fade the rails into the page rather than cutting them */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-page to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-page to-transparent md:w-28" />
    </div>
  )
}
