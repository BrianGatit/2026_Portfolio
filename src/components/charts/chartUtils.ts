import { useEffect, useRef, useState } from 'react'

/**
 * Charts are rendered at real pixel size rather than scaled with a viewBox, so
 * axis type stays the same size everywhere on the page.
 */
export function useChartSize(fallback = 640) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next && next > 0) setWidth(next)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

/** Fixed categorical slots, in order. Never cycled, never generated. */
export const seriesColors = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'] as const

/** A single series is the brand accent and needs no legend. */
export const soloColor = 'var(--accent)'

export function colorFor(index: number, total: number) {
  return total <= 1 ? soloColor : seriesColors[Math.min(index, seriesColors.length - 1)]
}

/** Rounds a domain out to clean tick values. */
export function niceScale(min: number, max: number, targetTicks = 4) {
  if (min === max) {
    const pad = Math.abs(min) || 1
    min -= pad
    max += pad
  }
  const span = max - min
  const rawStep = span / targetTicks
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalised = rawStep / magnitude
  const stepFactor = normalised >= 7.5 ? 10 : normalised >= 3.5 ? 5 : normalised >= 1.5 ? 2 : 1
  const step = stepFactor * magnitude
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    // Guard against floating-point drift on fractional steps.
    ticks.push(Math.round(value / step) * step)
  }
  return { min: niceMin, max: niceMax, step, ticks }
}

export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0 || 1
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0)
}

/** Catmull-Rom-ish smoothing, clamped so the line never overshoots a value. */
export function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ''
  if (points.length < 3) return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')

  let path = `M${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1]
    const point = points[i]
    const cx = (previous.x + point.x) / 2
    path += ` C${cx} ${previous.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
  }
  return path
}

export function formatValue(value: number, unit = '') {
  const decimals = Math.abs(value) < 10 && !Number.isInteger(value) ? 2 : Number.isInteger(value) ? 0 : 1
  return `${value.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${unit}`
}
