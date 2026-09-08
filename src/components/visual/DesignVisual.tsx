import { useMemo } from 'react'
import type { DesignPiece } from '@/types'
import { cn } from '@/utils/cn'
import { makeRandom } from '@/utils/seed'

/**
 * Generated artefact previews for the design gallery.
 *
 * Unlike the project covers, these draw in the *piece's own* palette rather
 * than the site theme — a design artefact should carry its own colour, and it
 * makes the design section read as objects on a page rather than more UI.
 */

function luminance(hex: string) {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value
  const int = parseInt(full, 16)
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel((int >> 16) & 255) + 0.7152 * channel((int >> 8) & 255) + 0.0722 * channel(int & 255)
}

const FALLBACK = ['#111113', '#c9350f', '#f4f2ec']

function parseRatio(ratio: string) {
  const [w, h] = ratio.split('/').map((part) => Number.parseFloat(part.trim()))
  const width = Number.isFinite(w) && w > 0 ? w : 4
  const height = Number.isFinite(h) && h > 0 ? h : 5
  const scale = 150
  return { W: width * scale, H: height * scale }
}

export function DesignVisual({ piece, className }: { piece: DesignPiece; className?: string }) {
  const [rawInk, accent, paper] = piece.palette && piece.palette.length >= 3 ? piece.palette : FALLBACK
  const { W, H } = parseRatio(piece.ratio)

  // Keep the drawing legible whichever way round the palette is.
  const ink = luminance(paper) < 0.25 && luminance(rawInk) < 0.35 ? '#f4f2ec' : rawInk
  const hairline = luminance(paper) < 0.25 ? '#ffffff' : '#000000'

  const content = useMemo(
    () => renderMotif(piece, { W, H, ink, accent, paper, hairline }),
    [piece, W, H, ink, accent, paper, hairline],
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn('absolute inset-0 size-full', className)}
      role="presentation"
      aria-hidden
    >
      <rect width={W} height={H} fill={paper} />
      {content}
    </svg>
  )
}

interface Ctx {
  W: number
  H: number
  ink: string
  accent: string
  paper: string
  hairline: string
}

function renderMotif(piece: DesignPiece, ctx: Ctx) {
  switch (piece.motif) {
    case 'wordmark':
      return <Wordmark piece={piece} ctx={ctx} />
    case 'poster':
      return <Poster piece={piece} ctx={ctx} />
    case 'spread':
      return <Spread ctx={ctx} seed={piece.slug} />
    case 'grid':
      return <ModularGrid ctx={ctx} seed={piece.slug} />
    case 'mark':
      return <Mark ctx={ctx} seed={piece.slug} />
    case 'card':
      return <Stationery piece={piece} ctx={ctx} />
    case 'garment':
      return <Garment piece={piece} ctx={ctx} />
  }
}

const mono = "'JetBrains Mono', monospace"
const display = "'Space Grotesk', sans-serif"

function Caption({ ctx, text }: { ctx: Ctx; text: string }) {
  return (
    <text
      x={ctx.W * 0.08}
      y={ctx.H - ctx.H * 0.06}
      fontFamily={mono}
      fontSize={ctx.W * 0.026}
      letterSpacing={ctx.W * 0.005}
      fill={ctx.ink}
      opacity={0.55}
    >
      {text.toUpperCase()}
    </text>
  )
}

/* --- wordmark ------------------------------------------------------ */

function Wordmark({ piece, ctx }: { piece: DesignPiece; ctx: Ctx }) {
  const word = piece.title.split('—')[0].trim().split(' ')[0].toUpperCase()
  const size = Math.min((ctx.W * 1.55) / Math.max(word.length, 4), ctx.H * 0.3)

  return (
    <>
      <line x1={0} y1={ctx.H * 0.5} x2={ctx.W} y2={ctx.H * 0.5} stroke={ctx.hairline} strokeOpacity={0.12} />
      <text
        x={ctx.W / 2}
        y={ctx.H * 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={display}
        fontWeight={500}
        fontSize={size}
        letterSpacing={-size * 0.045}
        fill={ctx.ink}
      >
        {word}
      </text>
      <path
        d={`M${ctx.W * 0.5 - size * 0.1} ${ctx.H * 0.5 + size * 0.42} l${size * 0.2} ${-size * 0.2}`}
        stroke={ctx.accent}
        strokeWidth={size * 0.05}
        strokeLinecap="round"
      />
      <circle cx={ctx.W * 0.86} cy={ctx.H * 0.18} r={ctx.W * 0.035} fill={ctx.accent} />
      <Caption ctx={ctx} text={`${piece.category} · ${piece.year}`} />
    </>
  )
}

/* --- poster -------------------------------------------------------- */

function Poster({ piece, ctx }: { piece: DesignPiece; ctx: Ctx }) {
  const rnd = makeRandom(piece.slug)
  const lines = piece.title.toUpperCase().split(' ').slice(0, 4)
  const size = ctx.W * 0.155
  const top = ctx.H * 0.3

  return (
    <>
      <rect
        x={ctx.W * (0.42 + rnd() * 0.16)}
        y={ctx.H * 0.06}
        width={ctx.W * 0.46}
        height={ctx.H * (0.16 + rnd() * 0.1)}
        fill={ctx.accent}
      />
      <g stroke={ctx.hairline} strokeOpacity={0.1}>
        {Array.from({ length: 7 }, (_, index) => (ctx.W / 8) * (index + 1)).map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={ctx.H} />
        ))}
      </g>
      {lines.map((line, index) => (
        <text
          key={index}
          x={ctx.W * 0.08}
          y={top + index * size * 0.92}
          fontFamily={display}
          fontWeight={500}
          fontSize={size}
          letterSpacing={-size * 0.05}
          fill={index === 1 ? ctx.accent : ctx.ink}
        >
          {line}
        </text>
      ))}
      <g fontFamily={mono} fontSize={ctx.W * 0.026} fill={ctx.ink} opacity={0.6}>
        <text x={ctx.W * 0.08} y={ctx.H * 0.14}>
          {piece.year}
        </text>
        <text x={ctx.W * 0.08} y={ctx.H * 0.185}>
          {piece.category.toUpperCase()}
        </text>
      </g>
      <Caption ctx={ctx} text={piece.tools.join(' / ')} />
    </>
  )
}

/* --- editorial spread ---------------------------------------------- */

function Spread({ ctx, seed }: { ctx: Ctx; seed: string }) {
  const rnd = makeRandom(seed)
  const gutter = ctx.W / 2
  const columnLines = (x: number, width: number, count: number, y: number) =>
    Array.from({ length: count }, (_, index) => (
      <line
        key={`${x}-${index}`}
        x1={x}
        y1={y + index * ctx.H * 0.035}
        x2={x + width * (index === count - 1 ? 0.62 : 1)}
        y2={y + index * ctx.H * 0.035}
        stroke={ctx.ink}
        strokeOpacity={0.28}
        strokeWidth={ctx.H * 0.008}
      />
    ))

  return (
    <>
      <line x1={gutter} y1={0} x2={gutter} y2={ctx.H} stroke={ctx.hairline} strokeOpacity={0.14} />
      <text
        x={ctx.W * 0.06}
        y={ctx.H * 0.22}
        fontFamily={display}
        fontWeight={500}
        fontSize={ctx.W * 0.075}
        letterSpacing={-ctx.W * 0.003}
        fill={ctx.ink}
      >
        Findings
      </text>
      <rect x={ctx.W * 0.06} y={ctx.H * 0.26} width={ctx.W * 0.1} height={ctx.H * 0.012} fill={ctx.accent} />
      {columnLines(ctx.W * 0.06, ctx.W * 0.18, 9, ctx.H * 0.36)}
      {columnLines(ctx.W * 0.28, ctx.W * 0.18, 9, ctx.H * 0.36)}
      {/* right-hand plate: a small column chart */}
      {Array.from({ length: 6 }, (_, index) => {
        const height = ctx.H * (0.1 + rnd() * 0.32)
        return (
          <rect
            key={index}
            x={ctx.W * 0.55 + index * ctx.W * 0.065}
            y={ctx.H * 0.62 - height}
            width={ctx.W * 0.042}
            height={height}
            fill={index === 3 ? ctx.accent : ctx.ink}
            opacity={index === 3 ? 1 : 0.7}
          />
        )
      })}
      <line
        x1={ctx.W * 0.54}
        y1={ctx.H * 0.62}
        x2={ctx.W * 0.94}
        y2={ctx.H * 0.62}
        stroke={ctx.ink}
        strokeOpacity={0.4}
      />
      {columnLines(ctx.W * 0.55, ctx.W * 0.38, 4, ctx.H * 0.72)}
      <Caption ctx={ctx} text="editorial · 12-column grid" />
    </>
  )
}

/* --- modular grid -------------------------------------------------- */

function ModularGrid({ ctx, seed }: { ctx: Ctx; seed: string }) {
  const rnd = makeRandom(seed)
  const cols = 5
  const rows = Math.max(4, Math.round((cols * ctx.H) / ctx.W))
  const pad = ctx.W * 0.07
  const cell = (ctx.W - pad * 2) / cols
  const cells: { x: number; y: number; kind: number }[] = []

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push({ x: pad + c * cell, y: pad + r * cell, kind: Math.floor(rnd() * 5) })
    }
  }

  return (
    <>
      {cells.map((item, index) => {
        const inset = cell * 0.1
        const size = cell - inset
        if (item.kind === 0) {
          return <rect key={index} x={item.x} y={item.y} width={size} height={size} fill={ctx.accent} />
        }
        if (item.kind === 1) {
          return <circle key={index} cx={item.x + size / 2} cy={item.y + size / 2} r={size / 2} fill={ctx.ink} opacity={0.85} />
        }
        if (item.kind === 2) {
          return (
            <path
              key={index}
              d={`M${item.x} ${item.y + size} L${item.x + size} ${item.y + size} L${item.x + size} ${item.y} Z`}
              fill={ctx.ink}
              opacity={0.5}
            />
          )
        }
        return (
          <rect
            key={index}
            x={item.x}
            y={item.y}
            width={size}
            height={size}
            fill="none"
            stroke={ctx.ink}
            strokeOpacity={0.35}
          />
        )
      })}
      <Caption ctx={ctx} text="system · modules" />
    </>
  )
}

/* --- logo mark with construction guides ---------------------------- */

function Mark({ ctx, seed }: { ctx: Ctx; seed: string }) {
  const rnd = makeRandom(seed)
  const cx = ctx.W / 2
  const cy = ctx.H * 0.47
  const unit = Math.min(ctx.W, ctx.H) * 0.16
  const variant = Math.floor(rnd() * 3)

  return (
    <>
      {/* construction grid */}
      <g stroke={ctx.accent} strokeOpacity={0.35}>
        {[-2, -1, 0, 1, 2].map((step) => (
          <line key={`v${step}`} x1={cx + step * unit} y1={cy - unit * 2.6} x2={cx + step * unit} y2={cy + unit * 2.6} />
        ))}
        {[-2, -1, 0, 1, 2].map((step) => (
          <line key={`h${step}`} x1={cx - unit * 2.6} y1={cy + step * unit} x2={cx + unit * 2.6} y2={cy + step * unit} />
        ))}
        <circle cx={cx} cy={cy} r={unit * 2} fill="none" />
      </g>

      {variant === 0 && (
        <path
          d={`M${cx - unit * 1.5} ${cy + unit * 1.5} L${cx - unit * 1.5} ${cy - unit * 1.5} A${unit * 1.5} ${unit * 1.5} 0 1 1 ${cx + unit * 1.5} ${cy + unit * 1.5} Z`}
          fill={ctx.ink}
        />
      )}
      {variant === 1 && (
        <>
          <circle cx={cx - unit * 0.55} cy={cy} r={unit * 1.25} fill={ctx.ink} />
          <circle cx={cx + unit * 0.55} cy={cy} r={unit * 1.25} fill={ctx.ink} opacity={0.55} />
        </>
      )}
      {variant === 2 && (
        <path
          d={`M${cx - unit * 1.6} ${cy + unit * 1.2} L${cx} ${cy - unit * 1.6} L${cx + unit * 1.6} ${cy + unit * 1.2} Z M${cx - unit * 0.8} ${cy + unit * 1.2} L${cx} ${cy - unit * 0.2} L${cx + unit * 0.8} ${cy + unit * 1.2} Z`}
          fill={ctx.ink}
          fillRule="evenodd"
        />
      )}
      <Caption ctx={ctx} text="marque · 5×5 module" />
    </>
  )
}

/* --- stationery ---------------------------------------------------- */

function Stationery({ piece, ctx }: { piece: DesignPiece; ctx: Ctx }) {
  const cardW = ctx.W * 0.62
  const cardH = cardW * 0.58
  const x = (ctx.W - cardW) / 2
  const y = (ctx.H - cardH) / 2
  const word = piece.title.split(' ')[0].toUpperCase()

  return (
    <>
      {/* card behind, rotated */}
      <g transform={`rotate(-7 ${ctx.W / 2} ${ctx.H / 2})`} opacity={0.5}>
        <rect x={x - ctx.W * 0.04} y={y - ctx.H * 0.03} width={cardW} height={cardH} fill={ctx.ink} />
      </g>
      <rect x={x} y={y} width={cardW} height={cardH} fill={ctx.paper} stroke={ctx.ink} strokeOpacity={0.35} />
      <rect x={x} y={y} width={cardW * 0.14} height={cardH} fill={ctx.accent} />
      <text
        x={x + cardW * 0.24}
        y={y + cardH * 0.42}
        fontFamily={display}
        fontWeight={500}
        fontSize={cardW * 0.11}
        letterSpacing={-cardW * 0.003}
        fill={ctx.ink}
      >
        {word}
      </text>
      <g stroke={ctx.ink} strokeOpacity={0.3} strokeWidth={cardH * 0.014}>
        <line x1={x + cardW * 0.24} y1={y + cardH * 0.6} x2={x + cardW * 0.7} y2={y + cardH * 0.6} />
        <line x1={x + cardW * 0.24} y1={y + cardH * 0.72} x2={x + cardW * 0.56} y2={y + cardH * 0.72} />
      </g>
      <Caption ctx={ctx} text={`${piece.category} · ${piece.year}`} />
    </>
  )
}

/* --- apparel ------------------------------------------------------- */

function Garment({ piece, ctx }: { piece: DesignPiece; ctx: Ctx }) {
  const cx = ctx.W / 2
  const top = ctx.H * 0.16
  const bodyW = ctx.W * 0.52
  const bodyH = ctx.H * 0.56

  return (
    <>
      <path
        d={`M${cx - bodyW / 2} ${top + ctx.H * 0.06}
            L${cx - bodyW / 2 - ctx.W * 0.13} ${top + ctx.H * 0.17}
            L${cx - bodyW / 2 - ctx.W * 0.07} ${top + ctx.H * 0.26}
            L${cx - bodyW / 2 + ctx.W * 0.02} ${top + ctx.H * 0.2}
            L${cx - bodyW / 2 + ctx.W * 0.02} ${top + bodyH}
            L${cx + bodyW / 2 - ctx.W * 0.02} ${top + bodyH}
            L${cx + bodyW / 2 - ctx.W * 0.02} ${top + ctx.H * 0.2}
            L${cx + bodyW / 2 + ctx.W * 0.07} ${top + ctx.H * 0.26}
            L${cx + bodyW / 2 + ctx.W * 0.13} ${top + ctx.H * 0.17}
            L${cx + bodyW / 2} ${top + ctx.H * 0.06}
            A${bodyW * 0.16} ${bodyW * 0.16} 0 0 1 ${cx - bodyW / 2} ${top + ctx.H * 0.06} Z`}
        fill="none"
        stroke={ctx.ink}
        strokeWidth={ctx.W * 0.006}
        strokeOpacity={0.75}
      />
      <rect x={cx - ctx.W * 0.16} y={top + ctx.H * 0.19} width={ctx.W * 0.32} height={ctx.H * 0.12} fill={ctx.accent} />
      <text
        x={cx}
        y={top + ctx.H * 0.255}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={mono}
        fontSize={ctx.W * 0.042}
        letterSpacing={ctx.W * 0.008}
        fill={ctx.paper}
      >
        FIELD
      </text>
      <g stroke={ctx.ink} strokeOpacity={0.3} strokeWidth={ctx.W * 0.004}>
        <line x1={cx - ctx.W * 0.1} y1={top + ctx.H * 0.37} x2={cx + ctx.W * 0.1} y2={top + ctx.H * 0.37} />
        <line x1={cx - ctx.W * 0.06} y1={top + ctx.H * 0.42} x2={cx + ctx.W * 0.06} y2={top + ctx.H * 0.42} />
      </g>
      <Caption ctx={ctx} text={`${piece.tools[1] ?? 'Screen print'} · ${piece.year}`} />
    </>
  )
}
