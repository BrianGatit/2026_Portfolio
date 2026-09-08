import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { AnimatedText } from './AnimatedText'
import { Reveal, RuleLine } from './Reveal'

interface SectionHeadingProps {
  /** Editorial number, e.g. '02'. */
  index?: string
  label: string
  title: string | readonly string[]
  lead?: string
  /** Rendered at the far right of the heading row — usually a link or button. */
  action?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  size?: 'display' | 'title' | 'heading'
  className?: string
  id?: string
}

const sizeClasses = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
} as const

/**
 * The site's one section header. A hairline, a numbered mono label, a large
 * display title and an optional lead — the same rhythm everywhere, which is
 * what lets each section's *content* look different without the page breaking apart.
 */
export function SectionHeading({
  index,
  label,
  title,
  lead,
  action,
  as = 'h2',
  size = 'title',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <header className={cn('relative', className)} id={id}>
      <RuleLine />
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 pt-5 md:grid-cols-12 md:pt-6">
        <Reveal className="md:col-span-3 lg:col-span-2" y={12}>
          <p className="u-eyebrow flex items-baseline gap-3">
            {index && <span className="text-ink-faint u-tabular">{index}</span>}
            <span>{label}</span>
          </p>
        </Reveal>

        <div className="md:col-span-9 lg:col-span-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <AnimatedText
              as={as}
              text={title}
              className={cn(sizeClasses[size], 'max-w-[22ch] font-display text-ink')}
            />
            {action && (
              <Reveal className="shrink-0 lg:pb-2" delay={0.1}>
                {action}
              </Reveal>
            )}
          </div>
          {lead && (
            <Reveal delay={0.12} className="mt-7 max-w-[52ch] md:mt-9">
              <p className="text-lead text-ink-secondary">{lead}</p>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
