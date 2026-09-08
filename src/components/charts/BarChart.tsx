import { useState } from 'react'
import { motion } from 'motion/react'
import type { CategoryDatum } from '@/types'
import { ChartFrame, ChartTooltip, TooltipRow } from './ChartFrame'
import { formatValue, niceScale, useChartSize } from './chartUtils'

/** Rounded at the data end, square at the baseline. */
function barPath(x: number, y: number, w: number, h: number, r: number, orientation: 'h' | 'v') {
  if (orientation === 'h') {
    const radius = Math.min(r, Math.max(w - 0.5, 0))
    if (radius <= 0.5) return `M${x} ${y} h${w} v${h} h${-w} Z`
    return `M${x} ${y} H${x + w - radius} A${radius} ${radius} 0 0 1 ${x + w} ${y + radius} V${y + h - radius} A${radius} ${radius} 0 0 1 ${x + w - radius} ${y + h} H${x} Z`
  }
  const radius = Math.min(r, Math.max(h - 0.5, 0))
  if (radius <= 0.5) return `M${x} ${y} h${w} v${h} h${-w} Z`
  return `M${x} ${y + h} V${y + radius} A${radius} ${radius} 0 0 1 ${x + radius} ${y} H${x + w - radius} A${radius} ${radius} 0 0 1 ${x + w} ${y + radius} V${y + h} Z`
}

const REVEAL = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }

interface BarsProps {
  title: string
  subtitle?: string
  data: CategoryDatum[]
  unit?: string
  source?: string
}

function fillFor(datum: CategoryDatum, anyEmphasis: boolean) {
  if (!anyEmphasis) return 'var(--accent)'
  return datum.emphasis ? 'var(--accent)' : 'var(--ink-muted)'
}

/**
 * Horizontal bars — the right form when the category labels are words rather
 * than dates. Values sit at the tip; nothing is written inside the bar.
 */
export function BarChart({ title, subtitle, data, unit = '', source }: BarsProps) {
  const { ref, width } = useChartSize()
  const [hover, setHover] = useState<number | null>(null)

  const labelWidth = Math.min(Math.max(width * 0.34, 96), 260)
  // Reserve exactly as much room as the widest formatted value needs.
  const valueWidth = Math.max(...data.map((d) => formatValue(d.value, unit).length)) * 6.6 + 16
  const rowHeight = 34
  const barThickness = 16
  const height = data.length * rowHeight + 8
  const trackWidth = Math.max(width - labelWidth - valueWidth, 60)

  const { max } = niceScale(0, Math.max(...data.map((d) => d.value)))
  const anyEmphasis = data.some((d) => d.emphasis)

  // Truncate to what the label gutter can actually hold at 12.5px — a clipped
  // label is worse than an elided one, and the full text stays in the table.
  const maxChars = Math.max(Math.floor((labelWidth - 12) / 6.4), 8)

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      source={source}
      table={{
        columns: ['Category', `Value${unit ? ` (${unit.trim()})` : ''}`],
        rows: data.map((d) => [d.label, formatValue(d.value, unit)]),
      }}
    >
      <div ref={ref} className="relative w-full">
        <svg width={width} height={height} role="img" aria-label={`${title}. Values are available in the table view.`}>
          {data.map((datum, index) => {
            const y = index * rowHeight + 4
            const barY = y + (rowHeight - barThickness) / 2 - 4
            const barWidth = Math.max((datum.value / max) * trackWidth, 2)
            const fill = fillFor(datum, anyEmphasis)

            return (
              <g
                key={datum.label}
                onPointerEnter={() => setHover(index)}
                onPointerLeave={() => setHover(null)}
              >
                {/* generous hit target */}
                <rect x={0} y={y - 4} width={Math.max(width, 1)} height={rowHeight} fill="transparent" />

                <text
                  x={0}
                  y={barY + barThickness / 2}
                  dominantBaseline="central"
                  fontFamily="var(--font-sans)"
                  fontSize={12.5}
                  fill={datum.emphasis ? 'var(--ink)' : 'var(--ink-secondary)'}
                  fontWeight={datum.emphasis ? 500 : 400}
                >
                  {datum.label.length > maxChars ? `${datum.label.slice(0, maxChars - 1)}…` : datum.label}
                </text>

                {/* track */}
                <line
                  x1={labelWidth}
                  y1={barY + barThickness / 2}
                  x2={labelWidth + trackWidth}
                  y2={barY + barThickness / 2}
                  stroke="var(--grid)"
                  strokeWidth={1}
                />

                <motion.path
                  d={barPath(labelWidth, barY, barWidth, barThickness, 4, 'h')}
                  fill={fill}
                  initial={{ scaleX: 0, opacity: 0.4 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...REVEAL, delay: index * 0.04 }}
                  style={{ originX: `${labelWidth}px`, transformBox: 'view-box' }}
                />

                <text
                  x={labelWidth + barWidth + 10}
                  y={barY + barThickness / 2}
                  dominantBaseline="central"
                  fontFamily="var(--font-sans)"
                  fontSize={12}
                  fontWeight={500}
                  fill={datum.emphasis ? 'var(--ink)' : 'var(--ink-secondary)'}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatValue(datum.value, unit)}
                </text>
              </g>
            )
          })}
        </svg>

        <ChartTooltip
          visible={hover !== null}
          x={labelWidth + Math.max(((data[hover ?? 0]?.value ?? 0) / max) * trackWidth, 2)}
          y={(hover ?? 0) * rowHeight + 12}
        >
          <TooltipRow
            label={data[hover ?? 0]?.label ?? ''}
            value={formatValue(data[hover ?? 0]?.value ?? 0, unit)}
            color={fillFor(data[hover ?? 0] ?? data[0], anyEmphasis)}
          />
        </ChartTooltip>
      </div>
    </ChartFrame>
  )
}

/**
 * Columns — for ordered categories where the sequence itself carries meaning
 * (cohorts, time buckets). Value on the cap.
 */
export function ColumnChart({ title, subtitle, data, unit = '', source }: BarsProps) {
  const { ref, width } = useChartSize()
  const [hover, setHover] = useState<number | null>(null)

  const height = 250
  const pad = { top: 30, right: 8, bottom: 42, left: 40 }
  const plotHeight = height - pad.top - pad.bottom
  const plotWidth = Math.max(width - pad.left - pad.right, 60)
  const band = plotWidth / data.length
  const barWidth = Math.min(band * 0.52, 24)

  const { max, ticks, step } = niceScale(0, Math.max(...data.map((d) => d.value)))
  const anyEmphasis = data.some((d) => d.emphasis)
  const y = (value: number) => pad.top + plotHeight - (value / max) * plotHeight

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      source={source}
      table={{
        columns: ['Category', `Value${unit ? ` (${unit.trim()})` : ''}`],
        rows: data.map((d) => [d.label, formatValue(d.value, unit)]),
      }}
    >
      <div ref={ref} className="relative w-full">
        <svg width={width} height={height} role="img" aria-label={`${title}. Values are available in the table view.`}>
          <g stroke="var(--grid)" strokeWidth={1}>
            {ticks.map((value) => (
              <line key={value} x1={pad.left} y1={y(value)} x2={pad.left + plotWidth} y2={y(value)} />
            ))}
          </g>

          <g fontFamily="var(--font-sans)" fontSize={11} fill="var(--ink-muted)" textAnchor="end">
            {ticks.map((value) => (
              <text
                key={value}
                x={pad.left - 10}
                y={y(value)}
                dominantBaseline="central"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {step >= 1 ? value.toLocaleString('en-GB') : value.toFixed(1)}
              </text>
            ))}
          </g>

          <line
            x1={pad.left}
            y1={pad.top + plotHeight}
            x2={pad.left + plotWidth}
            y2={pad.top + plotHeight}
            stroke="var(--axis)"
            strokeWidth={1}
          />

          {data.map((datum, index) => {
            const barX = pad.left + index * band + (band - barWidth) / 2
            const barHeight = Math.max((datum.value / max) * plotHeight, 2)
            const barY = pad.top + plotHeight - barHeight
            const fill = fillFor(datum, anyEmphasis)

            return (
              <g
                key={datum.label}
                onPointerEnter={() => setHover(index)}
                onPointerLeave={() => setHover(null)}
              >
                <rect
                  x={pad.left + index * band}
                  y={pad.top}
                  width={band}
                  height={plotHeight + 20}
                  fill="transparent"
                />
                <motion.path
                  d={barPath(barX, barY, barWidth, barHeight, 4, 'v')}
                  fill={fill}
                  initial={{ scaleY: 0, opacity: 0.5 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...REVEAL, delay: index * 0.06 }}
                  style={{ originY: `${pad.top + plotHeight}px`, transformBox: 'view-box' }}
                />
                <text
                  x={barX + barWidth / 2}
                  y={barY - 10}
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                  fontSize={12}
                  fontWeight={500}
                  fill={datum.emphasis ? 'var(--ink)' : 'var(--ink-secondary)'}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatValue(datum.value, unit)}
                </text>
                <text
                  x={barX + barWidth / 2}
                  y={pad.top + plotHeight + 20}
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                  fontSize={11.5}
                  fill="var(--ink-muted)"
                >
                  {datum.label}
                </text>
              </g>
            )
          })}
        </svg>

        <ChartTooltip
          visible={hover !== null}
          x={pad.left + (hover ?? 0) * band + band / 2}
          y={y(data[hover ?? 0]?.value ?? 0)}
        >
          <TooltipRow
            label={data[hover ?? 0]?.label ?? ''}
            value={formatValue(data[hover ?? 0]?.value ?? 0, unit)}
            color={fillFor(data[hover ?? 0] ?? data[0], anyEmphasis)}
          />
        </ChartTooltip>
      </div>
    </ChartFrame>
  )
}
