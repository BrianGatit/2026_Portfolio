import type { ReactNode } from 'react'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

interface PageHeaderProps {
  eyebrow: string
  title: string | readonly string[]
  lead?: string
  /** Small facts printed on the hairline under the title. */
  meta?: { label: string; value: string }[]
  children?: ReactNode
  size?: 'mega' | 'display'
  className?: string
}

/**
 * Shared page opening: eyebrow, large display title, a lead in the right-hand
 * column and an optional metadata rule. Every section page starts the same way,
 * which is what makes the different section *bodies* feel intentional.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  children,
  size = 'display',
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('u-shell pt-32 md:pt-40', className)}>
      <Reveal y={10}>
        <p className="u-eyebrow text-accent">{eyebrow}</p>
      </Reveal>

      {/* The title takes the full measure; the lead sits under it in the right
          half. Constraining a display line to seven columns is what makes
          large type wrap in the wrong places. */}
      <AnimatedText
        as="h1"
        text={title}
        immediate
        className={cn('mt-8 font-display text-ink', size === 'mega' ? 'text-mega' : 'text-display')}
      />

      {lead && (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 md:mt-14">
          <Reveal y={18} delay={0.25} className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-[46ch] text-lead text-ink-secondary">{lead}</p>
          </Reveal>
        </div>
      )}

      {meta && meta.length > 0 && (
        <Reveal y={12} delay={0.35} className="mt-12 md:mt-16">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 md:grid-cols-4">
            {meta.map((row) => (
              <div key={row.label} className="flex flex-col gap-2">
                <dt className="u-eyebrow text-ink-faint">{row.label}</dt>
                <dd className="text-[0.9375rem] leading-snug text-ink-secondary">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {children}
    </header>
  )
}
