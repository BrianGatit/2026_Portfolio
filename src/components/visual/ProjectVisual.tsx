import { useMemo, type ReactElement } from 'react'
import type { Discipline } from '@/types'
import { cn } from '@/utils/cn'
import { makeRandom } from '@/utils/seed'

const W = 800
const H = 500

interface ProjectVisualProps {
  /** Seeds the composition — pass the project slug so it never reshuffles. */
  seed: string
  discipline: Discipline
  /** Used for the ghost letterform in the design motif. */
  title?: string
  className?: string
}

/**
 * Generated cover art, one composition per discipline.
 *
 * Real screenshots are always better; until they exist, a deterministic,
 * discipline-specific drawing keeps the grid looking art-directed instead of
 * filled with grey placeholder boxes. Set `cover` on a project to replace it.
 */
export function ProjectVisual({ seed, discipline, title, className }: ProjectVisualProps) {
  const art = useMemo(() => buildArt(seed, discipline, title), [seed, discipline, title])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0 size-full', className)}
      role="presentation"
      aria-hidden
    >
      {art}
    </svg>
  )
}

function buildArt(seed: string, discipline: Discipline, title?: string) {
  switch (discipline) {
    case 'engineering':
      return <ArchitectureMotif seed={seed} />
    case 'data':
      return <PlotMotif seed={seed} />
    case 'ai':
      return <EmbeddingMotif seed={seed} />
    case 'design':
      return <SpecimenMotif seed={seed} title={title} />
  }
}

/* ------------------------------------------------------------------ *\
   Shared background: a faint dot matrix, the connective tissue
   between all four motifs.
\* ------------------------------------------------------------------ */

function DotMatrix({ step = 40, opacity = 0.5 }: { step?: number; opacity?: number }) {
  const dots: ReactElement[] = []
  for (let x = step; x < W; x += step) {
    for (let y = step; y < H; y += step) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill="var(--ink-faint)" />)
    }
  }
  return <g opacity={opacity}>{dots}</g>
}

function Registration() {
  const marks = [
    [26, 26],
    [W - 26, 26],
    [26, H - 26],
    [W - 26, H - 26],
  ]
  return (
    <g stroke="var(--ink-faint)" strokeWidth={1} opacity={0.7}>
      {marks.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M${x - 7} ${y} H${x + 7}`} />
          <path d={`M${x} ${y - 7} V${y + 7}`} />
        </g>
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ *\
   Engineering — a layered service graph.
\* ------------------------------------------------------------------ */

function ArchitectureMotif({ seed }: { seed: string }) {
  const { columns, links, accent } = useMemo(() => {
    const rnd = makeRandom(`${seed}-arch`)
    const columnX = [70, 260, 450, 640]
    const cols = columnX.map((x, index) => {
      const count = 2 + Math.floor(rnd() * 2) + (index === 1 ? 1 : 0)
      const blockH = 34
      const gap = 26
      const total = count * blockH + (count - 1) * gap
      const top = (H - total) / 2 + (rnd() - 0.5) * 40
      return Array.from({ length: count }, (_, i) => ({
        x,
        y: top + i * (blockH + gap),
        w: 100,
        h: blockH,
      }))
    })

    const edges: { from: { x: number; y: number }; to: { x: number; y: number } }[] = []
    for (let c = 0; c < cols.length - 1; c += 1) {
      cols[c].forEach((node) => {
        const targets = cols[c + 1]
        const picks = new Set<number>()
        picks.add(Math.floor(rnd() * targets.length))
        if (rnd() > 0.55) picks.add(Math.floor(rnd() * targets.length))
        picks.forEach((index) => {
          const target = targets[index]
          edges.push({
            from: { x: node.x + node.w, y: node.y + node.h / 2 },
            to: { x: target.x, y: target.y + target.h / 2 },
          })
        })
      })
    }

    const flat = cols.flat()
    return { columns: cols, links: edges, accent: flat[Math.floor(rnd() * flat.length)] }
  }, [seed])

  return (
    <>
      <DotMatrix step={44} opacity={0.35} />
      <g stroke="var(--line-strong)" strokeWidth={1} fill="none">
        {links.map((link, index) => {
          const mid = link.from.x + (link.to.x - link.from.x) / 2
          return (
            <path
              key={index}
              d={`M${link.from.x} ${link.from.y} H${mid} V${link.to.y} H${link.to.x}`}
              opacity={0.85}
            />
          )
        })}
      </g>
      {columns.flat().map((node, index) => {
        const isAccent = node === accent
        return (
          <g key={index}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              fill={isAccent ? 'var(--accent)' : 'var(--surface)'}
              stroke={isAccent ? 'var(--accent)' : 'var(--ink)'}
              strokeWidth={1.2}
              rx={2}
            />
            <rect
              x={node.x + 12}
              y={node.y + node.h / 2 - 1.5}
              width={34}
              height={3}
              fill={isAccent ? 'var(--on-accent)' : 'var(--ink-faint)'}
              opacity={isAccent ? 0.9 : 0.8}
            />
          </g>
        )
      })}
      <Registration />
    </>
  )
}

/* ------------------------------------------------------------------ *\
   Data — a scatter field with a fitted trend.
\* ------------------------------------------------------------------ */

function PlotMotif({ seed }: { seed: string }) {
  const { points, trend, highlights } = useMemo(() => {
    const rnd = makeRandom(`${seed}-plot`)
    const cloud = Array.from({ length: 46 }, () => {
      const x = 90 + rnd() * (W - 170)
      const drift = ((x - 90) / (W - 170)) * 210
      const y = H - 90 - drift + (rnd() - 0.5) * 150
      return { x, y: Math.min(H - 60, Math.max(70, y)), r: 3 + rnd() * 2.4 }
    })

    const line = Array.from({ length: 9 }, (_, index) => {
      const x = 90 + (index / 8) * (W - 170)
      const drift = (index / 8) * 200
      return { x, y: H - 110 - drift + (rnd() - 0.5) * 34 }
    })

    return {
      points: cloud,
      trend: line,
      highlights: [cloud[Math.floor(rnd() * cloud.length)], cloud[Math.floor(rnd() * cloud.length)]],
    }
  }, [seed])

  const path = trend
    .map((point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`
      const previous = trend[index - 1]
      const cx = (previous.x + point.x) / 2
      return `C${cx} ${previous.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
    })
    .join(' ')

  return (
    <>
      <DotMatrix step={50} opacity={0.25} />
      {/* recessive gridlines */}
      <g stroke="var(--grid)" strokeWidth={1}>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <path key={fraction} d={`M70 ${60 + fraction * (H - 130)} H${W - 60}`} />
        ))}
      </g>
      {/* axes */}
      <g stroke="var(--axis)" strokeWidth={1}>
        <path d={`M70 50 V${H - 60}`} />
        <path d={`M70 ${H - 60} H${W - 60}`} />
      </g>
      <g fill="var(--ink)" opacity={0.42}>
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={point.r} />
        ))}
      </g>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" />
      {highlights.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={5.5}
          fill="var(--accent)"
          stroke="var(--surface)"
          strokeWidth={2}
        />
      ))}
      <Registration />
    </>
  )
}

/* ------------------------------------------------------------------ *\
   AI — an embedding cloud collapsing towards a query point.
\* ------------------------------------------------------------------ */

function EmbeddingMotif({ seed }: { seed: string }) {
  const { cloud, rings, spokes, focus } = useMemo(() => {
    const rnd = makeRandom(`${seed}-ai`)
    const focal = { x: W * 0.62 + (rnd() - 0.5) * 60, y: H * 0.5 + (rnd() - 0.5) * 50 }

    const nodes = Array.from({ length: 74 }, () => {
      const angle = rnd() * Math.PI * 2
      const radius = 40 + Math.pow(rnd(), 0.7) * 240
      return {
        x: focal.x + Math.cos(angle) * radius * 1.25,
        y: focal.y + Math.sin(angle) * radius * 0.78,
        r: 1.6 + rnd() * 2.6,
        o: 0.2 + rnd() * 0.5,
      }
    })

    const nearest = [...nodes]
      .sort((a, b) => Math.hypot(a.x - focal.x, a.y - focal.y) - Math.hypot(b.x - focal.x, b.y - focal.y))
      .slice(1, 9)

    return {
      cloud: nodes,
      rings: [70, 122, 178, 238].map((radius, index) => ({ radius, accent: index === 1 })),
      spokes: nearest,
      focus: focal,
    }
  }, [seed])

  return (
    <>
      <DotMatrix step={52} opacity={0.22} />
      <g fill="var(--ink)">
        {cloud.map((node, index) => (
          <circle key={index} cx={node.x} cy={node.y} r={node.r} opacity={node.o} />
        ))}
      </g>
      <g stroke="var(--line-strong)" strokeWidth={1} fill="none">
        {spokes.map((node, index) => (
          <path key={index} d={`M${focus.x} ${focus.y} L${node.x} ${node.y}`} opacity={0.6} />
        ))}
      </g>
      <g fill="none">
        {rings.map((ring) => (
          <ellipse
            key={ring.radius}
            cx={focus.x}
            cy={focus.y}
            rx={ring.radius * 1.22}
            ry={ring.radius * 0.76}
            stroke={ring.accent ? 'var(--accent)' : 'var(--line-strong)'}
            strokeWidth={ring.accent ? 1.6 : 1}
            opacity={ring.accent ? 0.9 : 0.55}
          />
        ))}
      </g>
      <circle cx={focus.x} cy={focus.y} r={7} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2.5} />
      <Registration />
    </>
  )
}

/* ------------------------------------------------------------------ *\
   Design — a type specimen on an exposed grid.
\* ------------------------------------------------------------------ */

function SpecimenMotif({ seed, title }: { seed: string; title?: string }) {
  const { block, rules } = useMemo(() => {
    const rnd = makeRandom(`${seed}-design`)
    return {
      block: {
        x: 60 + rnd() * 120,
        y: 60 + rnd() * 90,
        w: 150 + rnd() * 130,
        h: 150 + rnd() * 140,
      },
      rules: Array.from({ length: 6 }, (_, index) => 96 + index * 62 + (rnd() - 0.5) * 10),
    }
  }, [seed])

  const glyph = (title ?? 'A').trim().charAt(0).toUpperCase() || 'A'

  return (
    <>
      {/* 8-column exposed grid */}
      <g stroke="var(--line)" strokeWidth={1}>
        {Array.from({ length: 7 }, (_, index) => 60 + ((W - 120) / 8) * (index + 1)).map((x) => (
          <path key={x} d={`M${x} 40 V${H - 40}`} />
        ))}
      </g>
      <rect x={block.x} y={block.y} width={block.w} height={block.h} fill="var(--accent)" opacity={0.92} />
      <g stroke="var(--ink)" strokeWidth={1} opacity={0.28}>
        {rules.map((y) => (
          <path key={y} d={`M60 ${y} H${W - 60}`} />
        ))}
      </g>
      <text
        x={W * 0.52}
        y={H * 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize={330}
        fontWeight={500}
        letterSpacing="-0.05em"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.4}
        opacity={0.9}
      >
        {glyph}
      </text>
      <text
        x={W - 62}
        y={H - 56}
        textAnchor="end"
        fontFamily="'JetBrains Mono', monospace"
        fontSize={13}
        letterSpacing="0.22em"
        fill="var(--ink-muted)"
      >
        SPECIMEN
      </text>
      <Registration />
    </>
  )
}
