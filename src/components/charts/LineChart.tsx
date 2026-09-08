import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { LabelledSeries } from '@/types'
import { ChartFrame, ChartTooltip, TooltipRow } from './ChartFrame'
import { colorFor, formatValue, linearScale, niceScale, smoothPath, useChartSize } from './chartUtils'
import { tick } from '@/utils/format'

interface LineChartProps {
  title: string
  subtitle?: string
  series: LabelledSeries[]
  xLabels?: string[]
  yUnit?: string
  source?: string
  height?: number
}

const PAD = { top: 16, right: 74, bottom: 34, left: 46 }

/**
 * Time/sequence lines: 2px strokes, an 8px end marker with a surface ring, and
 * a direct label at the end of each line. A crosshair reads every series at
 * the hovered position.
 */
export function LineChart({ title, subtitle, series, xLabels, yUnit = '', source, height = 260 }: LineChartProps) {
  const { ref, width } = useChartSize()
  const [hover, setHover] = useState<number | null>(null)

  const plotWidth = Math.max(width - PAD.left - PAD.right, 80)
  const plotHeight = height - PAD.top - PAD.bottom

  const { scaleX, scaleY, ticks, step, xCount } = useMemo(() => {
    const values = series.flatMap((s) => s.points.map((p) => p.y))
    const xs = series.flatMap((s) => s.points.map((p) => p.x))
    const y = niceScale(Math.min(...values), Math.max(...values))
    return {
      scaleX: linearScale([Math.min(...xs), Math.max(...xs)], [PAD.left, PAD.left + plotWidth]),
      scaleY: linearScale([y.min, y.max], [PAD.top + plotHeight, PAD.top]),
      ticks: y.ticks,
      step: y.step,
      xCount: Math.max(...xs) + 1,
    }
  }, [series, plotWidth, plotHeight])

  const projected = series.map((s) => s.points.map((point) => ({ x: scaleX(point.x), y: scaleY(point.y) })))

  // Direct end-labels only work while the lines separate at the right edge.
  // Where they converge, nudging labels apart detaches them from their line, so
  // they are dropped entirely and the legend plus tooltip carry identity.
  const endPoints = projected.map((points) => points[points.length - 1]).filter(Boolean)
  const endLabelsFit = endPoints.every((a, i) =>
    endPoints.every((b, j) => i === j || Math.abs(a.y - b.y) >= 15),
  )

  // One column per x index — the crosshair snaps to these.
  const columns = Array.from({ length: xCount }, (_, index) => scaleX(index))
  const hoveredX = hover === null ? 0 : columns[hover]

  const labelStep = xLabels && xLabels.length > 8 ? Math.ceil(xLabels.length / 7) : 1

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      source={source}
      legend={series.map((s, index) => ({ name: s.name, color: colorFor(index, series.length) }))}
      table={{
        columns: [xLabels ? 'Point' : 'x', ...series.map((s) => s.name)],
        rows: Array.from({ length: xCount }, (_, index) => [
          xLabels?.[index] ?? String(index),
          ...series.map((s) => {
            const found = s.points.find((point) => point.x === index)
            return found ? formatValue(found.y, s.unit ?? yUnit) : '—'
          }),
        ]),
      }}
    >
      <div ref={ref} className="relative w-full">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${title}. ${subtitle ?? ''} Values are available in the table view.`}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            const pointerX = event.clientX - bounds.left
            let closest = 0
            let distance = Infinity
            columns.forEach((columnX, index) => {
              const delta = Math.abs(columnX - pointerX)
              if (delta < distance) {
                distance = delta
                closest = index
              }
            })
            setHover(closest)
          }}
        >
          {/* gridlines — hairline, solid, recessive */}
          <g stroke="var(--grid)" strokeWidth={1}>
            {ticks.map((value) => (
              <line key={value} x1={PAD.left} y1={scaleY(value)} x2={PAD.left + plotWidth} y2={scaleY(value)} />
            ))}
          </g>

          {/* y axis ticks */}
          <g fontFamily="var(--font-sans)" fontSize={11} fill="var(--ink-muted)" textAnchor="end">
            {ticks.map((value) => (
              <text
                key={value}
                x={PAD.left - 10}
                y={scaleY(value)}
                dominantBaseline="central"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tick(value, step)}
              </text>
            ))}
          </g>

          {/* x labels */}
          {xLabels && (
            <g fontFamily="var(--font-sans)" fontSize={11} fill="var(--ink-muted)" textAnchor="middle">
              {xLabels.map((label, index) =>
                index % labelStep === 0 || index === xLabels.length - 1 ? (
                  <text key={label + index} x={scaleX(index)} y={height - 12}>
                    {label}
                  </text>
                ) : null,
              )}
            </g>
          )}

          <line
            x1={PAD.left}
            y1={PAD.top + plotHeight}
            x2={PAD.left + plotWidth}
            y2={PAD.top + plotHeight}
            stroke="var(--axis)"
            strokeWidth={1}
          />

          {/* crosshair */}
          {hover !== null && (
            <line
              x1={hoveredX}
              y1={PAD.top}
              x2={hoveredX}
              y2={PAD.top + plotHeight}
              stroke="var(--ink-faint)"
              strokeWidth={1}
            />
          )}

          {/* lines */}
          {projected.map((points, index) => (
            <motion.path
              key={series[index].name}
              d={smoothPath(points)}
              fill="none"
              stroke={colorFor(index, series.length)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
            />
          ))}

          {/* hovered markers, with a surface ring so they read over the line */}
          {hover !== null &&
            projected.map((points, seriesIndex) => {
              const point = points[hover]
              if (!point) return null
              return (
                <circle
                  key={`marker-${seriesIndex}`}
                  cx={point.x}
                  cy={point.y}
                  r={4.5}
                  fill={colorFor(seriesIndex, series.length)}
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              )
            })}

          {/* end markers + direct labels */}
          {projected.map((points, seriesIndex) => {
            const last = points[points.length - 1]
            if (!last) return null
            const value = series[seriesIndex].points[series[seriesIndex].points.length - 1].y
            return (
              <motion.g
                key={`end-${seriesIndex}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 1 + seriesIndex * 0.1 }}
              >
                <circle
                  cx={last.x}
                  cy={last.y}
                  r={4.5}
                  fill={colorFor(seriesIndex, series.length)}
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
                {endLabelsFit && (
                  <text
                    x={last.x + 10}
                    y={last.y}
                    dominantBaseline="central"
                    fontFamily="var(--font-sans)"
                    fontSize={11.5}
                    fontWeight={500}
                    fill="var(--ink-secondary)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatValue(value, series[seriesIndex].unit ?? yUnit)}
                  </text>
                )}
              </motion.g>
            )
          })}
        </svg>

        <ChartTooltip visible={hover !== null} x={hoveredX} y={PAD.top}>
          <div className="flex min-w-[9rem] flex-col gap-1.5">
            {xLabels?.[hover ?? 0] && (
              <p className="border-b border-line pb-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-ink-faint uppercase">
                {xLabels[hover ?? 0]}
              </p>
            )}
            {series.map((s, index) => {
              const point = s.points.find((item) => item.x === hover)
              if (!point) return null
              return (
                <TooltipRow
                  key={s.name}
                  label={s.name}
                  value={formatValue(point.y, s.unit ?? yUnit)}
                  color={colorFor(index, series.length)}
                />
              )
            })}
          </div>
        </ChartTooltip>
      </div>
    </ChartFrame>
  )
}
