import { cn } from '@/utils/cn'

interface TagProps {
  children: string
  emphasis?: boolean
  className?: string
}

/** A hairline mono chip. Used for technology and category labels. */
export function Tag({ children, emphasis = false, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2.5 py-1 font-mono text-[0.65rem] leading-none tracking-[0.1em] uppercase whitespace-nowrap',
        'rounded-[var(--radius-card)] transition-colors duration-300',
        emphasis ? 'border-accent/45 bg-accent-wash text-accent' : 'border-line text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

interface TagListProps {
  items: readonly string[]
  /** Show only the first `limit` items, then a '+n' chip. */
  limit?: number
  emphasise?: readonly string[]
  className?: string
  'aria-label'?: string
}

export function TagList({ items, limit, emphasise = [], className, 'aria-label': ariaLabel }: TagListProps) {
  const visible = limit ? items.slice(0, limit) : items
  const overflow = limit ? items.length - visible.length : 0

  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)} aria-label={ariaLabel}>
      {visible.map((item) => (
        <li key={item}>
          <Tag emphasis={emphasise.includes(item)}>{item}</Tag>
        </li>
      ))}
      {overflow > 0 && (
        <li>
          <Tag className="border-dashed">{`+${overflow}`}</Tag>
        </li>
      )}
    </ul>
  )
}
