/** Formatting helpers — kept tiny and dependency-free. */

const longDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortDate = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
})

export function formatDate(iso: string) {
  return longDate.format(new Date(iso))
}

export function formatMonth(iso: string) {
  return shortDate.format(new Date(iso))
}

export function formatYear(iso: string) {
  return new Date(iso).getFullYear().toString()
}

/** '01', '02', … — used for editorial section and item numbering. */
export function ordinal(index: number) {
  return (index + 1).toString().padStart(2, '0')
}

/** Compact axis/label numbers: 1284 → '1,284', 12900 → '12.9K'. */
export function compact(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (abs >= 10_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return value.toLocaleString('en-GB')
}

/** Axis ticks: keep one decimal only when the data needs it. */
export function tick(value: number, step: number) {
  const decimals = step < 1 ? (step < 0.2 ? 2 : 1) : 0
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
