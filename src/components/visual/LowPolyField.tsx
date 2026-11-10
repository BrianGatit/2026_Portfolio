import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { makeRandom } from '@/utils/seed'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'

const COLS = 10
const ROWS = 5
const W = 1000
const H = 500

/**
 * A faint faceted field — the low-poly atmosphere behind the hero heading.
 *
 * A jittered grid split into triangles, each filled with ink or accent at a
 * barely-there opacity, so the facets read as light catching folded paper
 * rather than as a graphic. Colours are theme variables, so it re-tints with
 * light and dark mode; the warm facets gather on the right, where the hero's
 * ambient light sits. Seeded, so the pattern never reshuffles between visits.
 */
export function LowPolyField({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()

  const facets = useMemo(() => {
    const rnd = makeRandom('munga-hero-facets')
    const points = Array.from({ length: ROWS + 1 }, (_, row) =>
      Array.from({ length: COLS + 1 }, (_, col) => {
        const edge = row === 0 || row === ROWS || col === 0 || col === COLS
        return [
          (col / COLS) * W + (edge ? 0 : (rnd() - 0.5) * (W / COLS) * 0.7),
          (row / ROWS) * H + (edge ? 0 : (rnd() - 0.5) * (H / ROWS) * 0.7),
        ] as const
      }),
    )

    const out: { d: string; warm: boolean; opacity: number }[] = []
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const [a, b, c, d] = [points[row][col], points[row][col + 1], points[row + 1][col + 1], points[row + 1][col]]
        // Alternate the diagonal so the facets do not all lean one way.
        const pair = (row + col) % 2 === 0 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
        for (const tri of pair) {
          const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3
          const warm = rnd() < (cx / W) * 0.55
          out.push({
            d: `M${tri.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`,
            warm,
            opacity: warm ? 0.025 + rnd() * 0.05 : 0.012 + rnd() * 0.035,
          })
        }
      }
    }
    return out
  }, [])

  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn('u-facets pointer-events-none', className)}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: easeEditorial, delay }}
    >
      {facets.map((facet, index) => (
        <path
          key={index}
          d={facet.d}
          fill={facet.warm ? 'var(--accent)' : 'var(--ink)'}
          fillOpacity={facet.opacity}
        />
      ))}
    </motion.svg>
  )
}
