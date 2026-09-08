import type { Architecture } from '@/types'
import { cn } from '@/utils/cn'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * A layered architecture diagram drawn in HTML rather than as an image, so it
 * stays readable at any width, re-themes with the page and is available to a
 * screen reader as an ordered list of layers and their components.
 */
export function ArchitectureDiagram({ architecture, className }: { architecture: Architecture; className?: string }) {
  return (
    <figure className={cn('flex flex-col gap-5', className)}>
      <RevealGroup
        className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4"
        stagger={0.07}
      >
        {architecture.layers.map((layer, layerIndex) => (
          <RevealItem key={layer.label} className="flex flex-col gap-4 bg-surface p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <h4 className="u-eyebrow text-ink">{layer.label}</h4>
              <span className="u-eyebrow text-ink-faint u-tabular">
                {String(layerIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <ul className="flex flex-col gap-2.5">
              {layer.nodes.map((node) => (
                <li
                  key={node.name}
                  className={cn(
                    'group/node flex flex-col gap-1 border px-3.5 py-3 transition-colors duration-400',
                    'rounded-[var(--radius-card)]',
                    node.accent
                      ? 'border-accent/50 bg-accent-wash'
                      : 'border-line bg-page hover:border-line-strong',
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-[0.9375rem] leading-tight font-medium tracking-[-0.01em]',
                      node.accent ? 'text-accent' : 'text-ink',
                    )}
                  >
                    {node.name}
                  </span>
                  {node.note && (
                    <span className="font-mono text-[0.65rem] leading-relaxed tracking-[0.06em] text-ink-muted">
                      {node.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>

      <figcaption className="max-w-[62ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.03em] text-ink-muted">
        {architecture.caption}
      </figcaption>
    </figure>
  )
}
