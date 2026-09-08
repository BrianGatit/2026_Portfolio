import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { makeRandom } from '@/utils/seed'
import { easeEditorial } from '@/utils/motion'

const W = 720
const H = 440

const readouts = [
  { code: 'model.fit(X_train, y_train)', note: 'r² 0.87' },
  { code: 'GET /api/loads?status=in_transit', note: '204 rows · 41ms' },
  { code: 'type-scale: clamp(2.7rem, 7.6vw, 6.75rem)', note: 'display' },
  { code: 'retrieval: hybrid(bm25, dense) → rerank', note: 'recall@8 0.89' },
]

/**
 * The hero's animated system: one drawing that contains a plot, a service
 * graph and a letterform — data, code and form in the same frame.
 *
 * Everything is drawn from CSS custom properties, so it re-themes with the
 * page. The looping parts stop entirely under `prefers-reduced-motion`; the
 * composition still arrives, it just arrives already finished.
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion()
  const [readout, setReadout] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => setReadout((current) => (current + 1) % readouts.length), 3600)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const { scatter, plot, nodes } = useMemo(() => {
    const rnd = makeRandom('hero-visual-01')

    const cloud = Array.from({ length: 30 }, () => {
      const x = 96 + rnd() * 430
      const lift = ((x - 96) / 430) * 150
      return { x, y: 300 - lift + (rnd() - 0.5) * 110, r: 2.4 + rnd() * 2 }
    })

    const line = Array.from({ length: 8 }, (_, index) => ({
      x: 96 + (index / 7) * 430,
      y: 292 - (index / 7) * 150 + (rnd() - 0.5) * 26,
    }))

    const graph = [
      { x: 96, y: 356, w: 78, h: 22 },
      { x: 222, y: 356, w: 78, h: 22 },
      { x: 348, y: 356, w: 78, h: 22 },
    ]

    return { scatter: cloud, plot: line, nodes: graph }
  }, [])

  const plotPath = plot
    .map((point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`
      const previous = plot[index - 1]
      const cx = (previous.x + point.x) / 2
      return `C${cx} ${previous.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
    })
    .join(' ')

  const end = plot[plot.length - 1]
  const appear = { duration: 1, ease: easeEditorial }

  return (
    <div className="relative w-full" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {/* exposed grid */}
        <motion.g
          stroke="var(--line)"
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...appear, delay: 0.2 }}
        >
          {Array.from({ length: 8 }, (_, index) => 60 + ((W - 120) / 8) * index).map((x) => (
            <line key={x} x1={x} y1={26} x2={x} y2={H - 26} />
          ))}
          <line x1={40} y1={H - 60} x2={W - 40} y2={H - 60} />
        </motion.g>

        {/* recessive gridlines for the plot */}
        <motion.g
          stroke="var(--grid)"
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...appear, delay: 0.35 }}
        >
          {[150, 226, 302].map((y) => (
            <line key={y} x1={96} y1={y} x2={W - 96} y2={y} />
          ))}
        </motion.g>

        {/* the design half: a letterform, drawn as outline */}
        <motion.text
          x={W - 92}
          y={150}
          textAnchor="end"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize={210}
          fontWeight={500}
          letterSpacing="-0.06em"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.2}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ duration: 1.3, ease: easeEditorial, delay: 0.5 }}
        >
          Aa
        </motion.text>
        <motion.rect
          x={W - 148}
          y={62}
          width={56}
          height={56}
          fill="var(--accent)"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: easeEditorial, delay: 0.75 }}
          style={{ originY: 1, transformBox: 'fill-box' }}
        />

        {/* the data half: scatter + fitted line */}
        <motion.g
          fill="var(--ink)"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.022, delayChildren: 0.5 } } }}
        >
          {scatter.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={point.r}
              variants={{ hidden: { opacity: 0, scale: 0.4 }, visible: { opacity: 0.4, scale: 1 } }}
              transition={{ duration: 0.5, ease: easeEditorial }}
              style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
            />
          ))}
        </motion.g>

        <motion.path
          d={plotPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: easeEditorial, delay: 0.9 }}
        />

        <motion.circle
          cx={end.x}
          cy={end.y}
          r={5}
          fill="var(--accent)"
          stroke="var(--page)"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: [1, 1.35, 1] }
          }
          transition={
            reduceMotion
              ? { duration: 0.4, delay: 2.4 }
              : { delay: 2.5, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ originX: `${end.x}px`, originY: `${end.y}px` }}
        />

        {/* the code half: a small service graph on the baseline */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appear, delay: 1.15 }}
        >
          {nodes.map((node, index) => (
            <g key={index}>
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                fill="none"
                stroke={index === 1 ? 'var(--accent)' : 'var(--line-strong)'}
                strokeWidth={1.2}
                rx={2}
              />
              <rect
                x={node.x + 10}
                y={node.y + node.h / 2 - 1.5}
                width={26}
                height={3}
                fill={index === 1 ? 'var(--accent)' : 'var(--ink-faint)'}
              />
              {index < nodes.length - 1 && (
                <path
                  d={`M${node.x + node.w} ${node.y + node.h / 2} H${nodes[index + 1].x}`}
                  stroke="var(--line-strong)"
                  strokeWidth={1}
                />
              )}
            </g>
          ))}
        </motion.g>

        {/* axis ticks and labels */}
        <motion.g
          fontFamily="'JetBrains Mono', monospace"
          fontSize={11}
          letterSpacing="0.18em"
          fill="var(--ink-muted)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...appear, delay: 1.4 }}
        >
          <text x={60} y={H - 34}>
            01 DATA
          </text>
          <text x={W / 2 - 30} y={H - 34}>
            02 SYSTEM
          </text>
          <text x={W - 40} y={H - 34} textAnchor="end">
            03 FORM
          </text>
        </motion.g>
      </svg>

      {/* live readout — the only text that changes */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3">
        <div className="relative h-4 flex-1 overflow-hidden">
          <motion.p
            key={readout}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeEditorial }}
            className="absolute inset-0 truncate font-mono text-[0.68rem] tracking-[0.02em] text-ink-muted"
          >
            <span className="mr-2 text-accent">›</span>
            {readouts[readout].code}
          </motion.p>
        </div>
        <motion.span
          key={`note-${readout}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="shrink-0 font-mono text-[0.68rem] tracking-[0.1em] text-ink-faint uppercase u-tabular"
        >
          {readouts[readout].note}
        </motion.span>
      </div>
    </div>
  )
}
