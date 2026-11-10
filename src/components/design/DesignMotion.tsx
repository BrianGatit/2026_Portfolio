import { useId, type CSSProperties } from 'react'
import type { DesignLayer, DesignMotion as Treatment, DesignPiece, DesignPoint } from '@/types'
import { cn } from '@/utils/cn'
import { LiveDesign } from './LiveDesigns'
import './designMotion.css'

/**
 * Design files in motion.
 *
 * Each piece is a flat image, so nothing here pretends to animate layers it
 * does not have. Every treatment either moves a camera over the artwork,
 * reveals it along structure that is really in the file (a board's grid, a
 * post's reading bands, an emblem's circle), or draws an annotation layer on
 * top of it. Copies of the image are the same file, clipped differently.
 *
 * Everything runs on CSS keyframes, so one switch governs it all:
 *   - `playing={false}` pauses every animation in place (off-screen cards, the
 *     pause button), and `true` resumes from the same frame;
 *   - remounting (a new `key`) replays from the start;
 *   - reduced motion strips the animations, and the resting styles are the
 *     finished composition, so the work is simply shown.
 * Paths that depend on the artwork (a light's route) are
 * generated as keyframes for that piece alone.
 */

export const motionLabels: Record<Treatment['kind'], string> = {
  iris: 'Iris reveal',
  board: 'Panel sequence',
  spotlight: 'Raking light',
  product: 'Cinematic reveal',
  pan: 'Camera move',
  sequence: 'Reading order',
  layers: 'Separated layers',
  live: 'Live recreation',
}

/** '2752 / 1536' → 1.79 */
export function ratioOf(ratio: string) {
  const [w, h] = ratio.split('/').map((part) => Number(part.trim()))
  return h ? w / h : w || 1
}

interface DesignMotionProps {
  piece: DesignPiece
  /** False pauses every animation on its current frame. */
  playing: boolean
  /** The large presentation: images load eagerly. */
  stage?: boolean
  className?: string
}

export function DesignMotion({ piece, playing, stage = false, className }: DesignMotionProps) {
  const treatment: Treatment = piece.motion ?? { kind: 'product' }
  const name = `dm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const art: Art = {
    src: piece.image ?? '',
    alt: piece.alt ?? `${piece.title} — ${piece.category}`,
    loading: stage ? 'eager' : 'lazy',
    ratio: ratioOf(piece.ratio),
    name,
  }

  return (
    <div
      className={cn('dm', `dm--${treatment.kind}`, stage && 'dm--stage', className)}
      data-state={playing ? 'playing' : 'paused'}
    >
      {render(treatment, art)}
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface Art {
  src: string
  alt: string
  loading: 'eager' | 'lazy'
  ratio: number
  /** Unique per instance; prefixes this piece's generated keyframes. */
  name: string
}

function render(treatment: Treatment, art: Art) {
  switch (treatment.kind) {
    case 'iris':
      return <Iris {...treatment} art={art} />
    case 'board':
      return <Board {...treatment} art={art} />
    case 'spotlight':
      return <Spotlight {...treatment} art={art} />
    case 'pan':
      return <Pan {...treatment} art={art} />
    case 'sequence':
      return <Sequence {...treatment} art={art} />
    case 'layers':
      return <Layers {...treatment} art={art} />
    case 'live':
      return <LiveDesign design={treatment.design} alt={art.alt} />
    default:
      return <Product art={art} />
  }
}

/** The artwork. Only the first copy in a treatment carries the alt text. */
function Img({ art, copy = false }: { art: Art; copy?: boolean }) {
  return (
    <img
      src={art.src}
      alt={copy ? '' : art.alt}
      aria-hidden={copy || undefined}
      loading={art.loading}
      decoding="async"
      draggable={false}
      className="dm-img"
    />
  )
}

type Vars = CSSProperties & Record<`--${string}`, string | number>

const pct = (value: number) => `${+value.toFixed(3)}%`

/* ---------- generated keyframes ------------------------------------ */

/**
 * A loop through `states`, holding on each: arrive, hold, travel to the next,
 * and finally travel back to the first. Returns keyframe stops, each state's
 * on-screen window (for captions), and the loop's length in seconds.
 */
function holdLoop<T>(states: T[], hold: number, travel: number) {
  const total = states.length * (hold + travel)
  const stops: [number, T][] = []
  const windows: [number, number][] = []
  states.forEach((state, index) => {
    const arrive = index * (hold + travel)
    stops.push([arrive, state], [arrive + hold, state])
    windows.push([arrive, arrive + hold])
  })
  stops.push([total, states[0]])
  const toPct = (t: number) => (t / total) * 100
  return {
    total,
    stops: stops.map(([t, state]) => [toPct(t), state] as const),
    windows: windows.map(([a, b]) => [toPct(a), toPct(b)] as const),
  }
}

/** Keyframes for one property; every segment eases in and out. */
function keyframes(name: string, stops: readonly (readonly [number, string])[], property = 'transform') {
  const body = stops
    .map(([at, value]) => `${pct(at)}{${property}:${value};animation-timing-function:cubic-bezier(.65,0,.35,1)}`)
    .join('')
  return `@keyframes ${name}{${body}}`
}

const timed = (name: string, seconds: number): CSSProperties => ({
  animationName: name,
  animationDuration: `${+seconds.toFixed(3)}s`,
})

/* ---------- iris: emblems and marks -------------------------------- */

/**
 * The circle opens from the heart of the mark — the M's fold, the centre of a
 * seal — while a ring draws itself onto the emblem's own circle, then keeps a
 * slow tick-ring turning and lets light cross the surface now and then.
 */
function Iris({ origin, ring, art }: Extract<Treatment, { kind: 'iris' }> & { art: Art }) {
  const height = 100 / art.ratio
  const cy = (ring.y / 100) * height
  return (
    <>
      <div className="dm-layer dm-iris" style={{ '--ox': pct(origin.x), '--oy': pct(origin.y) } as Vars}>
        <Img art={art} />
        <span className="dm-sheen" aria-hidden />
      </div>
      <svg className="dm-svg" viewBox={`0 0 100 ${height}`} aria-hidden>
        <circle className="dm-ring" cx={ring.x} cy={cy} r={ring.r} pathLength={1} />
        <circle className="dm-ticks" cx={ring.x} cy={cy} r={ring.r + 1.4} pathLength={1} />
      </svg>
    </>
  )
}

/* ---------- board: a grid of applications --------------------------- */

/**
 * A brand board is a grid of separate applications, so it is split along that
 * grid: the panels fly in from their own corners and lock together, then each
 * takes a turn at pushing in, framed in orange, like a presenter going round.
 */
function Board({ cols, rows, art }: Extract<Treatment, { kind: 'board' }> & { art: Art }) {
  const count = cols * rows
  const cells = Array.from({ length: count }, (_, index) => {
    const c = index % cols
    const r = Math.floor(index / cols)
    return {
      index,
      box: { left: pct((c / cols) * 100), top: pct((r / rows) * 100), width: pct(100 / cols), height: pct(100 / rows) },
      vars: {
        '--i': index,
        '--n': count,
        '--clip': `inset(${pct((r / rows) * 100)} ${pct(((cols - 1 - c) / cols) * 100)} ${pct(((rows - 1 - r) / rows) * 100)} ${pct((c / cols) * 100)})`,
        '--dx': pct((c - (cols - 1) / 2) * 7),
        '--dy': pct((r - (rows - 1) / 2) * 7),
        '--origin': `${pct(((c + 0.5) / cols) * 100)} ${pct(((r + 0.5) / rows) * 100)}`,
      } as Vars,
    }
  })

  return (
    <>
      {cells.map((cell) => (
        <div key={cell.index} className="dm-layer dm-tile" style={cell.vars}>
          <div className="dm-layer dm-tile-focus">
            <Img art={art} copy={cell.index > 0} />
          </div>
        </div>
      ))}
      {cells.map((cell) => (
        <span key={cell.index} aria-hidden className="dm-tile-frame" style={{ ...cell.box, ...cell.vars }} />
      ))}
    </>
  )
}

/* ---------- spotlight: dark photography ----------------------------- */

/**
 * Black-on-black embroidery only shows when light rakes across it. The photo
 * fades up out of the dark under a pool of warm light that then wanders over
 * the stitching — the mark, the wordmark — and comes back.
 */
function Spotlight({ path, art }: Extract<Treatment, { kind: 'spotlight' }> & { art: Art }) {
  // The light is 3× the frame, so a move of n% of the frame is n/3 % of it.
  const at = ({ x, y }: DesignPoint) => `translate(${pct((x - 50) / 3)},${pct((y - 50) / 3)})`
  const loop = holdLoop(path.map(at), 1.4, 3.2)
  return (
    <>
      <style>{keyframes(`${art.name}-light`, loop.stops)}</style>
      <div className="dm-layer dm-spot-photo">
        <Img art={art} />
      </div>
      <div className="dm-spot-path" style={{ ...timed(`${art.name}-light`, loop.total), transform: at(path[0]) }}>
        <div className="dm-spot-light" />
      </div>
      <span className="dm-layer dm-spot-cover" aria-hidden />
    </>
  )
}

/* ---------- product: campaign and merchandise ----------------------- */

/**
 * The advertising treatment: a hairline draws across the middle, the frame
 * opens from it like a letterbox, the shot settles from a slight overscale,
 * then holds on a slow push-in while a highlight passes now and then.
 */
function Product({ art }: { art: Art }) {
  return (
    <>
      <div className="dm-layer dm-product">
        <div className="dm-layer dm-product-shot">
          <Img art={art} />
        </div>
        <span className="dm-sheen" aria-hidden />
      </div>
      <span className="dm-slit" aria-hidden />
    </>
  )
}

/* ---------- pan: wide surfaces -------------------------------------- */

/**
 * A slow camera move, chosen per surface: a tracking shot along a mural, a
 * drift along the pattern's own 20° angle, a breath for silk, a push-in on a
 * portrait. Overscale and travel are paired so no edge is ever revealed.
 */
const pans: Record<Extract<Treatment, { kind: 'pan' }>['mode'], Vars> = {
  track: { '--s0': 1.12, '--s1': 1.12, '--x0': '-4%', '--x1': '4%', '--y0': '0%', '--y1': '0%', '--d': '18s' },
  drift: { '--s0': 1.16, '--s1': 1.16, '--x0': '-5%', '--x1': '5%', '--y0': '-1.8%', '--y1': '1.8%', '--d': '22s' },
  breathe: { '--s0': 1, '--s1': 1.08, '--x0': '0%', '--x1': '-2%', '--y0': '0%', '--y1': '0%', '--d': '12s' },
  push: { '--s0': 1, '--s1': 1.07, '--x0': '0%', '--x1': '1.5%', '--y0': '0%', '--y1': '-1.5%', '--d': '14s' },
}

function Pan({ mode, art }: Extract<Treatment, { kind: 'pan' }> & { art: Art }) {
  return (
    <div className="dm-layer dm-pan" style={pans[mode]}>
      <div className="dm-layer dm-pan-shot">
        <Img art={art} />
      </div>
    </div>
  )
}

/* ---------- sequence: reading order --------------------------------- */

/**
 * Social posts and presentation sheets are read in order, so they reveal in
 * order: cut along their own layout — headline, image, copy, sign-off — each
 * band arrives in turn, holds, and the post rebuilds on a loop. A faint copy
 * of the whole piece stays underneath so the frame is never empty.
 */
function Sequence({ axis, cuts, art }: Extract<Treatment, { kind: 'sequence' }> & { art: Art }) {
  const bands = cuts.slice(1).map((end, index) => [cuts[index], end] as const)
  return (
    <>
      <div className="dm-layer dm-ghost">
        <Img art={art} />
      </div>
      {bands.map(([from, to], index) => (
        <div
          key={from}
          className="dm-layer dm-band"
          style={
            {
              '--i': index,
              clipPath: axis === 'y' ? `inset(${pct(from)} 0 ${pct(100 - to)} 0)` : `inset(0 ${pct(100 - to)} 0 ${pct(from)})`,
              '--bx': axis === 'x' ? '-3%' : '0%',
              '--by': axis === 'y' ? '3.5%' : '0%',
            } as Vars
          }
        >
          <Img art={art} copy />
        </div>
      ))}
    </>
  )
}

/* ---------- layers: a flat file cut into its real elements ---------- */

/**
 * Each element of the file — a panel, a line of type, a photograph, an icon,
 * a seal's ring — is a copy of the image cut to that element's region. The
 * cut stays fixed while the element moves inside it, so it rises out of its
 * own mask, slides in from its own edge or turns into place. Afterwards a few
 * keep a gesture of their own (a gear turns, a bulb glows, photographs drift
 * at different speeds); every loop starts and ends at rest.
 *
 * The regions cover every mark in the file and the base is the file's own
 * ground, so once everything has arrived the frame is exactly the original.
 */
function Layers({ size: [W, H], base, layers, art }: Extract<Treatment, { kind: 'layers' }> & { art: Art }) {
  const pulses = layers.filter((layer) => layer.loop === 'pulse').length
  let pulse = 0
  return (
    <div className="dm-layer" role="img" aria-label={art.alt} style={{ background: base }}>
      {layers.map((layer, index) => (
        <Cut
          key={index}
          layer={layer}
          W={W}
          H={H}
          art={art}
          index={index}
          pulse={layer.loop === 'pulse' ? [pulse++, pulses] : undefined}
        />
      ))}
      <span className="dm-light" aria-hidden />
    </div>
  )
}

const WIPES = new Set<DesignLayer['enter']>(['wipe-right', 'wipe-down', 'unfold'])

function Cut({
  layer: { shape, enter, at, loop },
  W,
  H,
  art,
  index,
  pulse,
}: {
  layer: DesignLayer
  W: number
  H: number
  art: Art
  index: number
  pulse?: [number, number]
}) {
  // Region in percent of the frame: box (x, y, w, h) and centre (cx, cy).
  const cut: Vars = {}
  let x: number, y: number, w: number, h: number
  if ('rect' in shape) {
    ;[x, y, w, h] = [(shape.rect[0] / W) * 100, (shape.rect[1] / H) * 100, (shape.rect[2] / W) * 100, (shape.rect[3] / H) * 100]
    cut.clipPath = `inset(${pct(y)} ${pct(100 - x - w)} ${pct(100 - y - h)} ${pct(x)})`
  } else {
    const [ccx, ccy, inner, outer] = 'circle' in shape ? [...shape.circle.slice(0, 2), 0, shape.circle[2]] : shape.ring
    w = ((outer * 2) / W) * 100
    h = ((outer * 2) / H) * 100
    x = (ccx / W) * 100 - w / 2
    y = (ccy / H) * 100 - h / 2
    const centre = `${pct((ccx / W) * 100)} ${pct((ccy / H) * 100)}`
    // Radii in container units, so circles stay circles in any frame.
    const r = (value: number) => `${+((value / W) * 100).toFixed(3)}cqw`
    if (inner > 0) {
      const ring = `radial-gradient(circle at ${centre}, transparent ${r(inner)}, #000 ${r(inner)}, #000 ${r(outer)}, transparent ${r(outer)})`
      cut.maskImage = ring
      cut.WebkitMaskImage = ring
    } else {
      cut.clipPath = `circle(${r(outer)} at ${centre})`
    }
  }
  const cx = x + w / 2
  const cy = y + h / 2
  cut['--origin'] = `${pct(cx)} ${pct(cy)}`

  const arrive: Vars = { '--at': `${at}s` }
  if (enter === 'rise') arrive['--ty'] = pct(h)
  if (enter === 'drop') arrive['--ty'] = pct(-h)
  if (enter === 'from-left') arrive['--tx'] = pct(-w)
  if (enter === 'from-right') arrive['--tx'] = pct(w)
  if (enter === 'pop') arrive['--s'] = 0.55
  if (enter === 'spin') Object.assign(arrive, { '--r': '-40deg', '--s': 0.92 })
  if (enter === 'wipe-right') arrive['--clip0'] = `inset(0 ${pct(100 - x)} 0 ${pct(x)})`
  if (enter === 'wipe-down') arrive['--clip0'] = `inset(${pct(y)} 0 ${pct(100 - y)} 0)`
  if (enter === 'unfold') arrive['--clip0'] = `inset(0 ${pct(100 - cx)} 0 ${pct(cx)})`

  if (loop) {
    cut['--lat'] = `${+(at + 1.1).toFixed(2)}s`
    cut['--ld'] = loop === 'parallax' ? `${13 + (index % 5) * 1.7}s` : `${5.5 + (index % 4) * 1.4}s`
    if (pulse) Object.assign(cut, { '--pi': pulse[0], '--pn': pulse[1] })
    // Overscale 1.12 about the centre leaves 6% of the region spare on each
    // side; drift by at most 80% of that, so no edge is ever shown.
    if (loop === 'parallax') cut['--px'] = pct(((0.06 * w) / 1.12) * 0.8)
  }

  const image = <Img art={art} copy />
  return (
    <div className={cn('dm-cut', loop && loop !== 'parallax' && `dm-cut--${loop}`)} style={cut}>
      <div className={WIPES.has(enter) ? 'dm-cut-wipe' : 'dm-cut-move'} style={arrive}>
        {loop === 'parallax' ? <div className="dm-cut-parallax">{image}</div> : image}
      </div>
    </div>
  )
}
