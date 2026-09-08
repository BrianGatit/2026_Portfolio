import type { Block, Discipline } from '@/types'
import { cn } from '@/utils/cn'
import { Chart } from '@/components/charts/Chart'
import { FigurePlaceholder } from '@/components/visual/Media'
import { Reveal } from '@/components/ui/Reveal'

const measure = 'max-w-[68ch]'

/**
 * Long-form renderer for articles and case-study prose.
 *
 * Text stays inside a 68-character measure; charts and figures are allowed to
 * break out to the full column, which is what gives the reading column its
 * rhythm.
 */
export function BlockRenderer({
  blocks,
  fallbackDiscipline = 'engineering',
  seed = 'block',
  className,
}: {
  blocks: Block[]
  fallbackDiscipline?: Discipline
  seed?: string
  className?: string
}) {
  let figureIndex = -1

  return (
    <div className={cn('flex flex-col gap-7 md:gap-8', className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'lead':
            return (
              <Reveal key={index} y={16}>
                <p
                  className={cn(
                    measure,
                    'font-display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.42] font-normal tracking-[-0.02em] text-ink',
                  )}
                >
                  {block.text}
                </p>
              </Reveal>
            )

          case 'p':
            return (
              <Reveal key={index} y={14}>
                <p className={cn(measure, 'text-[1.0625rem] leading-[1.75] text-ink-secondary')}>{block.text}</p>
              </Reveal>
            )

          case 'h2':
            return (
              <Reveal key={index} y={14} className="mt-6 md:mt-10">
                <h2 className={cn(measure, 'text-heading font-display font-medium text-ink')}>{block.text}</h2>
              </Reveal>
            )

          case 'h3':
            return (
              <Reveal key={index} y={12} className="mt-4 md:mt-6">
                <h3 className={cn(measure, 'text-subhead font-display font-medium text-ink')}>{block.text}</h3>
              </Reveal>
            )

          case 'quote':
            return (
              <Reveal key={index} y={16} className="my-4 md:my-8">
                <blockquote className="max-w-[46ch] border-l-2 border-accent pl-6 md:pl-8">
                  <p className="font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.25] text-ink italic">
                    {block.text}
                  </p>
                  {block.cite && <cite className="u-eyebrow mt-4 block not-italic">{block.cite}</cite>}
                </blockquote>
              </Reveal>
            )

          case 'list':
            return (
              <Reveal key={index} y={14}>
                {block.ordered ? (
                  <ol className={cn(measure, 'flex flex-col gap-3')}>
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-4">
                        <span className="u-eyebrow mt-[0.45rem] shrink-0 text-accent u-tabular">
                          {String(itemIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[1.0625rem] leading-[1.7] text-ink-secondary">{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className={cn(measure, 'flex flex-col gap-3')}>
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-4">
                        <span aria-hidden className="mt-[0.85rem] h-px w-5 shrink-0 bg-accent" />
                        <span className="text-[1.0625rem] leading-[1.7] text-ink-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            )

          case 'code':
            return (
              <Reveal key={index} y={14} className="w-full">
                <figure className="flex flex-col gap-3">
                  <div className="overflow-x-auto border border-line bg-surface">
                    <div className="flex items-center justify-between border-b border-line px-4 py-2">
                      <span className="u-eyebrow">{block.lang}</span>
                      <span aria-hidden className="flex gap-1.5">
                        <span className="size-1.5 rounded-full bg-ink-faint" />
                        <span className="size-1.5 rounded-full bg-ink-faint" />
                        <span className="size-1.5 rounded-full bg-accent" />
                      </span>
                    </div>
                    <pre className="overflow-x-auto p-4 md:p-5">
                      <code className="font-mono text-[0.8125rem] leading-[1.7] text-ink-secondary">
                        {block.code}
                      </code>
                    </pre>
                  </div>
                  {block.caption && (
                    <figcaption className="font-mono text-[0.68rem] leading-relaxed text-ink-muted">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )

          case 'note':
            return (
              <Reveal key={index} y={14}>
                <aside className={cn(measure, 'border border-line bg-accent-wash p-5 md:p-6')}>
                  <p className="u-eyebrow mb-2.5 text-accent">Note</p>
                  <p className="text-[0.9375rem] leading-[1.7] text-ink-secondary">{block.text}</p>
                </aside>
              </Reveal>
            )

          case 'chart':
            return (
              <Reveal key={index} y={18} className="my-4 w-full md:my-8">
                <Chart spec={block.chart} />
              </Reveal>
            )

          case 'figure':
            figureIndex += 1
            return (
              <Reveal key={index} y={18} className="my-4 w-full md:my-8">
                <FigurePlaceholder
                  caption={block.caption}
                  seed={block.seed ?? `${seed}-${index}`}
                  discipline={block.motif ?? fallbackDiscipline}
                  ratio={block.ratio}
                  index={figureIndex}
                />
              </Reveal>
            )
        }
      })}
    </div>
  )
}
