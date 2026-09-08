import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { LabelledSeries } from '@/types'
import { ChartFrame, ChartTooltip, TooltipRow } from './ChartFrame'
import { colorFor, formatValue, linearScale, niceScale, useChartSize } from './chartUtils'
import { tick } from '@/utils/format'

interface ScatterChartProps {
  title: string
  subtitle?: string
  /** Three groups maximum — three slots clear the all-pairs colour gate. */
  groups: LabelledSeries[]
  xAxisLabel: string
  yAxisLabel: string
  source?: string
  height?: number
}

const PAD = { top: 18, right: 20, bottom: 52, left: 56 }

/**
 * Scatter: every pair of colours is visible at once here, so this form is
 * capped at three groups. Markers are 9px with a 2px surface ring so they stay
 * legible where clusters overlap.
 */
export function ScatterChart({
  title,
  subtitle,
  groups,
  xAxisLabel,
  yAxisLabel,
  source,
  height = 320,
}: ScatterChartProps) {
  const { ref, width } = useChartSize()
  const [hover, setHover] = useState<{ group: number; index: number } | null>(null)

  const visible = groups.slice(0, 3)
  const plotWidth = Math.max(width - PAD.left - PAD.right, 80)
  const plotHeight = height - PAD.top - PAD.bottom

  const { scaleX, scaleY, xTicks, yTicks, xStep, yStep } = useMemo(() => {
    const xs = visible.flatMap((g) => g.points.map((p) => p.x))
    const ys = visible.flatMap((g) => g.points.map((p) => p.y))
    const x = niceScale(Math.min(...xs), Math.max(...xs), 5)
    const y = niceScale(Math.min(...ys), Math.max(...ys), 4)
    return {
      scaleX: linearScale([x.min, x.max], [PAD.left, PAD.left + plotWidth]),
      scaleY: linearScale([y.min, y.max], [PAD.top + plotHeight, PAD.top]),
      xTicks: x.ticks,
      yTicks: y.ticks,
      xStep: x.step,
      yStep: y.step,
    }
  }, [visible, plotWidth, plotHeight])

  const hovered = hover ? visible[hover.group]?.points[hover.index] : null

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      source={source}
      legend={visible.map((group, index) => ({ name: group.name, color: colorFor(index, visible.length) }))}
      table={{
        columns: ['Group', xAxisLabel, yAxisLabel],
        rows: visible.flatMap((group) =>
          group.points.map((point) => [group.name, formatValue(point.x), formatValue(point.y)]),
        ),
      }}
    >
      <div ref={ref} className="relative w-full">
        <svg width={width} height={height} role="img" aria-label={`${title}. Values are available in the table view.`}>
          <g stroke="var(--grid)" strokeWidth={1}>
            {yTicks.map((value) => (
              <line key={`y${value}`} x1={PAD.left} y1={scaleY(value)} x2={PAD.left + plotWidth} y2={scaleY(value)} />
            ))}
          </g>

          <g fontFamily="var(--font-sans)" fontSize={11} fill="var(--ink-muted)">
            {yTicks.map((value) => (
              <text
                key={`yl${value}`}
                x={PAD.left - 10}
                y={scaleY(value)}
                textAnchor="end"
                dominantBaseline="central"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tick(value, yStep)}
              </text>
            ))}
            {xTicks.map((value) => (
              <text
                key={`xl${value}`}
                x={scaleX(value)}
                y={PAD.top + plotHeight + 20}
                textAnchor="middle"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tick(value, xStep)}
              </text>
            ))}
          </g>

          <line
            x1={PAD.left}
            y1={PAD.top + plotHeight}
            x2={PAD.left + plotWidth}
            y2={PAD.top + plotHeight}
            stroke="var(--axis)"
            strokeWidth={1}
          />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotHeight} stroke="var(--axis)" strokeWidth={1} />

          {/* axis titles */}
          <text
            x={PAD.left + plotWidth / 2}
            y={height - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            letterSpacing="0.12em"
            fill="var(--ink-faint)"
          >
            {xAxisLabel.toUpperCase()}
          </text>
          <text
            transform={`rotate(-90 14 ${PAD.top + plotHeight / 2})`}
            x={14}
            y={PAD.top + plotHeight / 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            letterSpacing="0.12em"
            fill="var(--ink-faint)"
          >
            {yAxisLabel.toUpperCase()}
          </text>

          {visible.map((group, groupIndex) => (
            <motion.g
              key={group.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.014, delayChildren: groupIndex * 0.1 } } }}
            >
              {group.points.map((point, pointIndex) => {
                const isHovered = hover?.group === groupIndex && hover?.index === pointIndex
                return (
                  <motion.circle
                    key={pointIndex}
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r={isHovered ? 6.5 : 4.5}
                    fill={colorFor(groupIndex, visible.length)}
                    stroke="var(--surface)"
                    strokeWidth={2}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    transition={{ duration: 0.4 }}
                    onPointerEnter={() => setHover({ group: groupIndex, index: pointIndex })}
                    onPointerLeave={() => setHover(null)}
                    className="cursor-crosshair"
                  />
                )
              })}
            </motion.g>
          ))}
        </svg>

        <ChartTooltip
          visible={Boolean(hovered)}
          x={hovered ? scaleX(hovered.x) : 0}
          y={hovered ? scaleY(hovered.y) : 0}
        >
          <div className="flex min-w-[10rem] flex-col gap-1.5">
            <p className="border-b border-line pb-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-ink-faint uppercase">
              {hover ? visible[hover.group].name : ''}
            </p>
            <TooltipRow label={xAxisLabel} value={hovered ? formatValue(hovered.x) : ''} />
            <TooltipRow label={yAxisLabel} value={hovered ? formatValue(hovered.y) : ''} />
          </div>
        </ChartTooltip>
      </div>
    </ChartFrame>
  )
}
