import type { Metric } from '@/types'
import { cn } from '@/utils/cn'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * Results, set as an editorial figure grid.
 *
 * Large standalone numbers use proportional figures — tabular spacing looks
 * loose at display sizes and is only worth it in a column that has to align.
 * Each tile is a real definition group, ordered label-then-value in the DOM
 * and re-ordered visually, so the pairing survives a screen reader.
 */
export function MetricGrid({
  metrics,
  columns = 3,
  className,
}: {
  metrics: readonly Metric[]
  columns?: 2 | 3 | 4
  className?: string
}) {
  const columnClass =
    columns === 2 ? 'sm:grid-cols-2' : columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <RevealGroup as="dl" className={cn('grid grid-cols-1 gap-px bg-line', columnClass, className)} stagger={0.06}>
      {metrics.map((metric) => (
        <RevealItem key={metric.label} className="flex flex-col bg-page p-6 md:p-7">
          <dt className="u-eyebrow order-2 mt-3 text-ink-secondary">{metric.label}</dt>
          <dd className="order-1 font-display text-[clamp(2.1rem,3.4vw,3rem)] leading-none font-medium tracking-[-0.035em] text-ink">
            {metric.value}
          </dd>
          {metric.note && (
            <dd className="order-3 mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">{metric.note}</dd>
          )}
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
