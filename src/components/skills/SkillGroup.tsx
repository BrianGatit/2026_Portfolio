import type { SkillCategory } from '@/types'
import { cn } from '@/utils/cn'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

const levelStyles = {
  core: 'text-ink',
  strong: 'text-ink-secondary',
  working: 'text-ink-muted',
} as const

/** One capability group. Depth is shown by weight, not by a bar chart of opinions. */
export function SkillGroup({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <RevealItem className="flex flex-col gap-5 bg-page p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.125rem] leading-tight font-medium tracking-[-0.015em] text-ink md:text-[1.25rem]">
          {category.title}
        </h3>
        <span className="u-eyebrow text-ink-faint u-tabular">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <p className="max-w-[46ch] text-[0.875rem] leading-relaxed text-ink-muted">{category.blurb}</p>

      <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
        {category.items.map((item) => (
          <li
            key={item.name}
            className={cn(
              'flex items-center gap-1.5 text-[0.875rem] leading-none',
              levelStyles[item.level ?? 'strong'],
            )}
          >
            {item.level === 'core' && <span aria-hidden className="size-1 rounded-full bg-accent" />}
            {item.name}
          </li>
        ))}
      </ul>
    </RevealItem>
  )
}

/** Grid wrapper plus the one-line key that explains the weighting. */
export function SkillMatrix({ categories, className }: { categories: SkillCategory[]; className?: string }) {
  return (
    <div className={className}>
      <RevealGroup className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 xl:grid-cols-4" stagger={0.06}>
        {categories.map((category, index) => (
          <SkillGroup key={category.id} category={category} index={index} />
        ))}
      </RevealGroup>

      <ul className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-1 rounded-full bg-accent" />
          <span className="u-eyebrow">Daily / core</span>
        </li>
        <li className="u-eyebrow text-ink-secondary">Strong</li>
        <li className="u-eyebrow text-ink-faint">Working knowledge</li>
      </ul>
    </div>
  )
}
