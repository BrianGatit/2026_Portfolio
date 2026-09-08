import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/utils/cn'
import { Plus } from '@/components/ui/Icons'

export interface LegendEntry {
  name: string
  color: string
}

interface ChartFrameProps {
  title: string
  subtitle?: string
  source?: string
  /** Present for two or more series; omitted for one (the title names it). */
  legend?: LegendEntry[]
  /** Rows behind the "table view" disclosure — the non-visual path to the data. */
  table?: { columns: string[]; rows: (string | number)[][] }
  children: ReactNode
  className?: string
}

/**
 * Every chart on the site sits in this frame: title, optional subtitle, a
 * legend when there are two or more series, the plot, a source line, and a
 * table view. The table is not decoration — it is how the numbers stay
 * available to screen readers and to anyone who cannot separate two hues.
 */
export function ChartFrame({
  title,
  subtitle,
  source,
  legend,
  table,
  children,
  className,
}: ChartFrameProps) {
  const [showTable, setShowTable] = useState(false)
  const tableId = useId()

  return (
    <figure
      className={cn(
        'flex flex-col gap-5 border border-line bg-surface p-5 md:p-7',
        'rounded-[var(--radius-media)]',
        className,
      )}
    >
      <figcaption className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <div className="max-w-[46ch]">
            <h4 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-ink md:text-[1.1875rem]">
              {title}
            </h4>
            {subtitle && <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">{subtitle}</p>}
          </div>

          {legend && legend.length > 1 && (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legend.map((entry) => (
                <li key={entry.name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-0.5 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] text-ink-secondary uppercase">
                    {entry.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </figcaption>

      <div className="relative">{children}</div>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-line pt-3">
        {source ? (
          <p className="max-w-[60ch] font-mono text-[0.63rem] leading-relaxed tracking-[0.04em] text-ink-faint">
            {source}
          </p>
        ) : (
          <span />
        )}

        {table && (
          <button
            type="button"
            onClick={() => setShowTable((current) => !current)}
            aria-expanded={showTable}
            aria-controls={tableId}
            className={cn(
              'group flex shrink-0 items-center gap-1.5 font-mono text-[0.63rem] tracking-[0.12em] uppercase',
              'text-ink-muted transition-colors duration-300 hover:text-accent',
            )}
          >
            <Plus
              className={cn(
                'text-[0.9rem] transition-transform duration-400 ease-[var(--ease-editorial)]',
                showTable && 'rotate-45',
              )}
            />
            {showTable ? 'Hide table' : 'Table view'}
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {showTable && table && (
          <motion.div
            id={tableId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[24rem] border-collapse text-left">
                <thead>
                  <tr>
                    {table.columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="border-b border-line-strong py-2 pr-6 font-mono text-[0.63rem] tracking-[0.12em] text-ink-muted uppercase"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-line last:border-0">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={cn(
                            'py-2 pr-6 text-[0.8125rem] text-ink-secondary',
                            cellIndex > 0 && 'u-tabular',
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  )
}

/** Shared hover tooltip. Positioned in element space, above the pointer. */
export function ChartTooltip({
  x,
  y,
  children,
  visible,
}: {
  x: number
  y: number
  children: ReactNode
  visible: boolean
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] border border-line-strong bg-page px-3 py-2 shadow-lg"
          style={{ left: x, top: y }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TooltipRow({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      {color && (
        <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      )}
      <span className="font-mono text-[0.63rem] tracking-[0.08em] text-ink-muted uppercase">{label}</span>
      <span className="ml-auto text-[0.8125rem] font-medium text-ink u-tabular">{value}</span>
    </div>
  )
}
