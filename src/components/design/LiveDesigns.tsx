import { Fragment, useId, type CSSProperties, type ReactNode } from 'react'
import type { LiveDesign as Design } from '@/types'

/**
 * Live recreations of the type-and-geometry designs.
 *
 * These pieces are built from things the site already has exactly — the M
 * mark's two vector strokes, the brand colours sampled from each file, and
 * the designs' own words, verbatim — so they can be rebuilt as real SVG and
 * HTML in which every letter, line and shape is its own element. Positions
 * are in each file's own pixels (the SVG viewBox is the file's size; text is
 * placed by percent and sized in container units), so the layout matches the
 * original at any size. The original file stays one click away in the
 * presentation.
 *
 * Motion is CSS only, driven by custom properties on each element:
 *   .lv-in    arrives from (--tx, --ty, --s, --r, --o0) at --at
 *   .lv-draw  a stroke draws on (needs pathLength=1)
 *   .lv-wipe  a clip opens from --clip0
 *   .lv-loop  afterwards, breathes out to (--lx, --ly, --ls, --lr) and back
 * Every loop starts and ends at rest, so nothing ever jumps.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** The M mark's two strokes, in the logo file's own coordinates. */
const AMBER = 'M521 349 L624 236 Q631 228 642 228 H802 Q812 228 812 238 V661 A120 120 0 0 1 692 781 H523 C590 750 635 690 635 610 V492 Z'
const ORANGE =
  'M240 228 H395 Q407 228 415 237 L628 463 Q650 486 628 510 L531 611 Q520 623 509 611 L403 500 V772 Q403 780 395 780 H353 A125 125 0 0 1 228 655 V240 Q228 228 240 228 Z'

const sec = (value: number) => `${+value.toFixed(3)}s`

export function LiveDesign({ design, alt }: { design: Design; alt: string }) {
  const Composition = compositions[design]
  return (
    <div className="lv" role="img" aria-label={alt}>
      <Composition />
      <span className="dm-light" aria-hidden />
    </div>
  )
}

/* ---------- building blocks ---------------------------------------- */

interface Frame {
  W: number
  H: number
}

interface TextProps {
  frame: Frame
  /** Anchor in file pixels: x per `align`, y at the middle of the line. */
  x: number
  y: number
  /** Font size in file pixels. */
  size: number
  align?: 'left' | 'center' | 'right'
  font?: 'display' | 'body' | 'mono'
  weight?: number
  color: string
  tracking?: string
  children: ReactNode
}

/** A line of type set on the file's pixel grid, scaling with the frame. */
function Text({ frame, x, y, size, align = 'left', font = 'display', weight = 700, color, tracking, children }: TextProps) {
  const style: Vars = {
    left: `${(x / frame.W) * 100}%`,
    top: `${(y / frame.H) * 100}%`,
    fontSize: `${(size / frame.W) * 100}cqw`,
    fontWeight: weight,
    color,
    letterSpacing: tracking,
    '--ax': align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%',
  }
  return (
    <span aria-hidden className={`lv-text lv-${font}`} style={style}>
      {children}
    </span>
  )
}

/** Letter by letter, each arriving from `from` in turn. */
function Letters({ text, at, step = 0.035, from = { '--ty': '0.45em' } }: { text: string; at: number; step?: number; from?: Vars }) {
  return (
    <>
      {[...text].map((char, index) =>
        char === ' ' ? (
          ' '
        ) : (
          <span key={index} className="lv-in" style={{ ...from, '--at': sec(at + index * step) } as Vars}>
            {char}
          </span>
        ),
      )}
    </>
  )
}

/** Word by word, each rising out of its own mask. */
function Words({ text, at, step = 0.08 }: { text: string; at: number; step?: number }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 && ' '}
          <span className="lv-mask">
            <span className="lv-in" style={{ '--at': sec(at + index * step), '--ty': '115%', '--o0': 1 } as Vars}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  )
}

/** A whole line rising out of one mask. */
function Line({ at, children }: { at: number; children: ReactNode }) {
  return (
    <span className="lv-mask">
      <span className="lv-in" style={{ '--at': sec(at), '--ty': '115%', '--o0': 1 } as Vars}>
        {children}
      </span>
    </span>
  )
}

const svgProps = (frame: Frame) => ({
  className: 'lv-svg',
  viewBox: `0 0 ${frame.W} ${frame.H}`,
  'aria-hidden': true as const,
})

/** A safe id for SVG references (clip paths, gradients). */
const useSvgId = () => `lv${useId().replace(/[^a-zA-Z0-9]/g, '')}`

/* ---------- primary logo — 1024 × 1024 ------------------------------ */

/**
 * The mark assembles the way it is built: the pale plate opens, the amber
 * stroke rises into place, the orange stroke swings in from the left and
 * folds over it. Then the two strokes drift at different speeds — a hint of
 * depth between them — and light crosses the mark now and then.
 */
function PrimaryLogo() {
  const id = useSvgId()
  return (
    <svg {...svgProps({ W: 1024, H: 1024 })} style={{ background: '#fefefe' }}>
      <defs>
        <clipPath id={`${id}-mark`}>
          <path d={AMBER} />
          <path d={ORANGE} />
        </clipPath>
        <linearGradient id={`${id}-light`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="lv-loop" style={{ '--ld': '11s', '--lat': '2s', '--ls': 1.012 } as Vars}>
        <circle className="lv-in" cx="512" cy="512" r="506" fill="#f7f8fa" style={{ '--dur': '1.1s', '--s': 0.86 } as Vars} />
      </g>
      <g className="lv-loop" style={{ '--ld': '6.2s', '--lat': '2.2s', '--ly': '-9px' } as Vars}>
        <path className="lv-in" d={AMBER} fill="#fdb31b" style={{ '--at': '0.3s', '--dur': '1.1s', '--ty': '110px' } as Vars} />
      </g>
      <g className="lv-loop" style={{ '--ld': '7.4s', '--lat': '2.4s', '--ly': '-15px' } as Vars}>
        <path
          className="lv-in"
          d={ORANGE}
          fill="#fd6f1d"
          style={{ '--at': '0.55s', '--dur': '1.15s', '--tx': '-90px', '--r': '-7deg', '--origin': '100% 50%' } as Vars}
        />
      </g>
      <g clipPath={`url(#${id}-mark)`} className="lv-blend">
        <g transform="skewX(-14)">
          <rect className="lv-sweep" x="-420" y="180" width="260" height="700" fill={`url(#${id}-light)`} />
        </g>
      </g>
    </svg>
  )
}

/* ---------- The Convergence Point — 1400 × 1400 --------------------- */

/**
 * The poster is about two ideas meeting at a point, so that is the motion:
 * the strokes travel in from either side and meet, the crosshair grows out
 * of the point where they meet, the coordinates read out character by
 * character, and the words rise in. Afterwards the strokes part and rejoin
 * very slightly while the crosshair breathes with them.
 */
function Convergence() {
  const frame = { W: 1400, H: 1400 }
  const ink = '#282828'
  return (
    <>
      <svg {...svgProps(frame)} style={{ background: '#f5f3e7' }}>
        <g transform="translate(294.4 216.5) scale(0.78)">
          <g className="lv-loop" style={{ '--ld': '5s', '--lat': '2.4s', '--lx': '8px' } as Vars}>
            <path className="lv-in" d={AMBER} fill="#f8b204" style={{ '--at': '0.25s', '--dur': '1.25s', '--tx': '150px' } as Vars} />
          </g>
          <g className="lv-loop" style={{ '--ld': '5s', '--lat': '2.4s', '--lx': '-8px' } as Vars}>
            <path className="lv-in" d={ORANGE} fill="#fc6c2d" style={{ '--at': '0.25s', '--dur': '1.25s', '--tx': '-150px' } as Vars} />
          </g>
        </g>
        <g className="lv-loop" style={{ '--ld': '5s', '--lat': '2.4s', '--ls': 0.88 } as Vars}>
          <line className="lv-in" x1="700" y1="465" x2="700" y2="735" stroke={ink} strokeWidth="2" style={{ '--at': '1.15s', '--s': 0 } as Vars} />
          <line className="lv-in" x1="565" y1="600" x2="835" y2="600" stroke={ink} strokeWidth="2" style={{ '--at': '1.25s', '--s': 0 } as Vars} />
        </g>
      </svg>

      <Text frame={frame} x={700} y={925} size={89} align="center" font="mono" weight={400} color={ink}>
        <Letters text="01°20'S, 36°40'E" at={1.45} step={0.045} from={{ '--ty': '0.3em' }} />
      </Text>
      <Text frame={frame} x={700} y={1146} size={44} align="center" color={ink}>
        <Words text="THE CONVERGENCE POINT" at={2.25} step={0.12} />
      </Text>
      <Text frame={frame} x={700} y={1207} size={28.5} align="center" font="body" weight={400} color={ink}>
        <Line at={2.7}>Not a place. A moment. The exact coordinates where two ideas</Line>
      </Text>
      <Text frame={frame} x={700} y={1245} size={28.5} align="center" font="body" weight={400} color={ink}>
        <Line at={2.85}>
          become one. Where 20° meets 40°. Where <b className="font-bold">MUNGA</b> begins.
        </Line>
      </Text>
    </>
  )
}

/* ---------- Construction — 1400 × 1400 ------------------------------ */

const GRID_X = [297, 433, 577, 700, 818, 962, 1132]
const GRID_Y = [250, 365, 483, 593, 710, 843, 958]
const GUIDES: [number, number, number, Vars?][] = [
  [702, 600, 283, { '--ld': '10s', '--ls': 1.008 }],
  [870, 410, 80, { '--ld': '6.4s', '--ly': '-8px' }],
  [783, 532, 47, { '--ld': '4.8s', '--ly': '-6px', '--lx': '4px' }],
  [700, 717, 122],
]
const DIAGONALS = [
  [490, 262, 1083, 858],
  [902, 262, 318, 858],
  [337, 338, 948, 958],
  [1083, 338, 440, 958],
]

/**
 * A construction sheet is drawn in the order it was made: the frame, the
 * grid, the guide circles, the 20° and 40° diagonals, then the mark filled in
 * over them, then the annotations written out. Afterwards the small guide
 * circles float and the diagonals shimmer at their own speeds.
 */
function Construction() {
  const frame = { W: 1400, H: 1400 }
  const ink = '#232a30'
  const orange = '#fc6d31'
  const drawn = (at: number, dur = 1): Vars => ({ '--at': sec(at), '--dur': sec(dur) })
  return (
    <>
      <svg {...svgProps(frame)} style={{ background: '#f3f9f9' }}>
        {/* the mark, under its own construction */}
        <g transform="translate(245.6 165) scale(0.87)">
          <path className="lv-wipe" d={AMBER} fill="#f9b305" stroke={ink} strokeWidth="3.5" style={{ ...drawn(1.9), '--clip0': 'inset(100% 0 0 0)' } as Vars} />
          <path className="lv-wipe" d={ORANGE} fill={orange} stroke={ink} strokeWidth="3.5" style={{ ...drawn(2.05), '--clip0': 'inset(0 100% 0 0)' } as Vars} />
        </g>

        <rect className="lv-draw" x="38" y="38" width="1324" height="1324" fill="none" stroke="#10100e" strokeWidth="2.5" pathLength={1} style={drawn(0, 1.4)} />
        {GRID_X.map((x, index) => (
          <line key={`x${x}`} className="lv-draw" x1={x} y1="250" x2={x} y2="958" stroke="#9aa0a0" strokeWidth="1.5" pathLength={1} style={drawn(0.25 + index * 0.06, 0.9)} />
        ))}
        {GRID_Y.map((y, index) => (
          <line key={`y${y}`} className="lv-draw" x1="297" y1={y} x2="1132" y2={y} stroke="#9aa0a0" strokeWidth="1.5" pathLength={1} style={drawn(0.35 + index * 0.06, 0.9)} />
        ))}
        {GUIDES.map(([cx, cy, r, loop], index) => (
          <g key={r} className={loop ? 'lv-loop' : undefined} style={{ ...loop, '--lat': '3.4s' } as Vars}>
            <circle className="lv-draw" cx={cx} cy={cy} r={r} fill="none" stroke="#8d9292" strokeWidth="1.5" pathLength={1} style={drawn(0.8 + index * 0.12, 1.2)} />
          </g>
        ))}
        {DIAGONALS.map(([x1, y1, x2, y2], index) => (
          <g key={index} className="lv-glow" style={{ '--ld': sec(3.6 + index * 0.7), '--lat': '3.6s', '--lo': 0.55 } as Vars}>
            <line className="lv-draw" x1={x1} y1={y1} x2={x2} y2={y2} stroke={orange} strokeWidth="2.5" pathLength={1} style={drawn(1.25 + index * 0.12)} />
          </g>
        ))}
        {/* the angles */}
        <g fill="none" stroke={orange} strokeWidth="2.5">
          <path className="lv-draw" d="M625 443 A80 80 0 0 1 775 443" pathLength={1} style={drawn(2.5, 0.7)} />
          <path className="lv-draw" d="M630 705 A70 70 0 0 1 650.5 655.5" pathLength={1} style={drawn(2.6, 0.5)} />
          <path className="lv-draw" d="M749.5 655.5 A70 70 0 0 1 770 705" pathLength={1} style={drawn(2.65, 0.5)} />
          <path className="lv-draw" d="M510 905 Q700 1050 888 905" pathLength={1} style={drawn(2.7, 1.2)} />
        </g>
        <g fill={orange}>
          <polygon className="lv-in" points="504,900 523.8,903.7 512.8,918.1" style={{ '--at': '3.6s', '--s': 0 } as Vars} />
          <polygon className="lv-in" points="892,902 883.2,920.1 872.2,905.9" style={{ '--at': '3.7s', '--s': 0 } as Vars} />
        </g>
      </svg>

      <Text frame={frame} x={613} y={675} size={24} align="center" font="body" weight={500} color={ink}>
        <Letters text="20°" at={2.75} step={0.05} />
      </Text>
      <Text frame={frame} x={786} y={675} size={24} align="center" font="body" weight={500} color={ink}>
        <Letters text="40°" at={2.8} step={0.05} />
      </Text>

      {/* 20° — refinement */}
      <Text frame={frame} x={80} y={402} size={76} weight={800} color={ink}>
        <Letters text="20° =" at={2.9} step={0.05} />
      </Text>
      <Text frame={frame} x={82} y={461} size={38} weight={800} color={ink} tracking="0.01em">
        <Letters text="REFINEMENT" at={3.1} step={0.03} />
      </Text>
      {['The subtle shift', 'in perspective', 'that changes', 'everything.'].map((line, index) => (
        <Text key={line} frame={frame} x={80} y={515 + index * 35} size={30} font="body" weight={400} color={ink}>
          <Line at={3.3 + index * 0.1}>{line}</Line>
        </Text>
      ))}

      {/* 40° — boldness */}
      <Text frame={frame} x={1318} y={402} size={76} align="right" weight={800} color={ink}>
        <Letters text="40° =" at={3} step={0.05} />
      </Text>
      <Text frame={frame} x={1318} y={461} size={38} align="right" weight={800} color={ink} tracking="0.01em">
        <Letters text="BOLDNESS" at={3.2} step={0.03} />
      </Text>
      {['The leap that', 'creates impact.'].map((line, index) => (
        <Text key={line} frame={frame} x={1318} y={520 + index * 35} size={30} align="right" font="body" weight={400} color={ink}>
          <Line at={3.4 + index * 0.1}>{line}</Line>
        </Text>
      ))}

      {/* 60° — balance */}
      <Text frame={frame} x={700} y={1043} size={50} align="center" weight={800} color={ink}>
        <Words text="60° = BALANCE" at={3.6} step={0.1} />
      </Text>
      <Text frame={frame} x={700} y={1102} size={31} align="center" font="body" weight={400} color={ink}>
        <Line at={3.85}>Where refinement meets risk.</Line>
      </Text>

      {/* the wordmark */}
      <Text frame={frame} x={700} y={1243} size={82} align="center" weight={800} color="#1c2a2d" tracking="0.02em">
        <Letters text="MUNGA" at={4} step={0.07} from={{ '--ty': '0.6em' }} />
      </Text>
      <Text frame={frame} x={700} y={1310} size={36} align="center" weight={700} color="#1c2a2d" tracking="0.2em">
        <span className="lv-track" style={{ '--at': '4.3s', '--ls0': '0.7em' } as Vars}>
          DESIGN
        </span>
      </Text>
      <Text frame={frame} x={66} y={1330} size={27} weight={500} color={ink}>
        <Line at={4.5}>EST. 2025</Line>
      </Text>
    </>
  )
}

/* ---------- Have you seen it? — 1400 × 1738 ------------------------- */

const STORY = [
  'The secret has always been there.',
  'Hidden in the space between. A second',
  'M, rotated, waiting to be discovered.',
  'This is how we design—with layers,',
  'intention, and details that reward attention.',
]

/**
 * A reveal post, played as the reveal it describes: the frame draws, the
 * question drops in letter by letter, the primary logo assembles, the dotted
 * arrow runs across, and only then does the hidden M fill in, deep teal, with
 * its labels pointing at it. The story follows word by word. Afterwards the
 * dots keep flowing toward the reveal and the hidden M glows softly.
 */
function SeenIt() {
  const frame = { W: 1400, H: 1738 }
  const ink = '#19191b'
  const teal = '#1a5f5f'
  const chrome = '#dfe2df'
  const icon = '#9aa09c'
  const drawn = (at: number, dur = 1): Vars => ({ '--at': sec(at), '--dur': sec(dur) })
  const pop = (at: number): Vars => ({ '--at': sec(at), '--s': 0.4 })
  return (
    <>
      <svg {...svgProps(frame)} style={{ background: '#f7f9f6' }}>
        {/* the post's frame */}
        <g stroke={chrome} strokeWidth="2.5">
          <line className="lv-draw" x1="0" y1="133" x2="1400" y2="133" pathLength={1} style={drawn(0, 1)} />
          <line className="lv-draw" x1="145" y1="0" x2="145" y2="133" pathLength={1} style={drawn(0.15, 0.5)} />
          <line className="lv-draw" x1="1255" y1="0" x2="1255" y2="133" pathLength={1} style={drawn(0.15, 0.5)} />
          <line className="lv-draw" x1="68" y1="133" x2="68" y2="1607" pathLength={1} style={drawn(0.2, 1.4)} />
          <line className="lv-draw" x1="100" y1="133" x2="100" y2="1607" pathLength={1} style={drawn(0.28, 1.4)} />
          <line className="lv-draw" x1="1333" y1="133" x2="1333" y2="1607" pathLength={1} style={drawn(0.2, 1.4)} />
          <line className="lv-draw" x1="0" y1="1607" x2="140" y2="1607" pathLength={1} style={drawn(0.5, 0.5)} />
          <line className="lv-draw" x1="1258" y1="1607" x2="1400" y2="1607" pathLength={1} style={drawn(0.5, 0.5)} />
        </g>
        <g fill="none" stroke={icon} strokeWidth="4" strokeLinejoin="round">
          <g className="lv-in" style={pop(0.4)}>
            <rect x="45" y="35" width="60" height="60" rx="17" />
            <circle cx="75" cy="65" r="15" />
            <circle cx="95" cy="45" r="3" fill={icon} stroke="none" />
          </g>
          <path className="lv-in" style={pop(0.47)} d="M1297 42 L1356 42 L1326 92 L1318 64 Z M1318 64 L1356 42" />
          <path className="lv-in" style={pop(0.54)} d="M70 1695 C40 1672 38 1652 52 1645 C62 1640 70 1648 70 1655 C70 1648 78 1640 88 1645 C102 1652 100 1672 70 1695 Z" />
          <path className="lv-in" style={pop(0.61)} d="M164 1693 L155 1700 L158 1688 A26 26 0 1 1 164 1693 Z" />
          <path className="lv-in" style={pop(0.68)} d="M256 1650 L312 1650 L285 1697 L278 1670 Z M278 1670 L312 1650" />
          <path className="lv-in" style={pop(0.75)} d="M1307 1647 H1353 V1699 L1330 1680 L1307 1699 Z" />
        </g>

        {/* primary logo */}
        <g transform="translate(87.4 460.9) scale(0.575)">
          <path className="lv-in" d={AMBER} fill="#f8b414" style={{ '--at': '1.25s', '--ty': '120px' } as Vars} />
          <path className="lv-in" d={ORANGE} fill="#fb722a" style={{ '--at': '1.4s', '--tx': '-120px', '--r': '-6deg', '--origin': '100% 50%' } as Vars} />
        </g>

        {/* the dotted arrow, flowing toward the reveal */}
        <g className="lv-wipe" style={{ ...drawn(2.15, 0.8), '--clip0': 'inset(0 100% 0 0)' } as Vars}>
          <line className="lv-flow" x1="593" y1="750" x2="806" y2="750" stroke="#2a2a2a" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 11" style={{ '--lat': '3s' } as Vars} />
        </g>
        <polygon className="lv-in" points="806,740 824,750 806,760" fill="#2a2a2a" style={{ '--at': '2.8s', '--s': 0 } as Vars} />

        {/* the reveal */}
        <g transform="translate(714.9 460.9) scale(0.575)">
          <g className="lv-in" style={{ '--at': '2.4s', '--s': 0.9 } as Vars}>
            <path d={AMBER} fill="#f8b414" />
            <path d={ORANGE} fill="#fb722a" />
          </g>
        </g>
        <g className="lv-glow" style={{ '--ld': '3.4s', '--lat': '4.2s', '--lo': 0.78 } as Vars}>
          <polygon
            className="lv-wipe"
            points="895,672 950,672 1013,737 1078,672 1131,672 1131,838 1080,838 1080,765 1013,820 945,765 945,838 895,838"
            fill={teal}
            stroke={teal}
            strokeWidth="10"
            strokeLinejoin="round"
            style={{ ...drawn(2.95, 1), '--clip0': 'inset(100% 0 0 0)' } as Vars}
          />
        </g>
        <line className="lv-draw" x1="1013" y1="942" x2="1013" y2="846" stroke={teal} strokeWidth="3.5" pathLength={1} style={drawn(3.35, 0.5)} />
        <polygon className="lv-in" points="1002,858 1013,838 1024,858" fill={teal} style={{ '--at': '3.7s', '--s': 0 } as Vars} />
        <g className="lv-loop" style={{ '--ld': '2.8s', '--lat': '4.6s', '--lx': '-4px', '--ly': '5px' } as Vars}>
          <path className="lv-draw" d="M1212 548 C1262 600 1258 660 1205 692" fill="none" stroke="#172226" strokeWidth="3.5" pathLength={1} style={drawn(3.75, 0.8)} />
          <polygon className="lv-in" points="1199,696 1221.3,694.3 1210.9,677.1" fill="#172226" style={{ '--at': '4.4s', '--s': 0 } as Vars} />
        </g>
      </svg>

      <Text frame={frame} x={700} y={330} size={100} align="center" weight={800} color="#ef6a33" tracking="-0.01em">
        <Letters text="HAVE YOU SEEN IT?" at={0.5} step={0.04} from={{ '--ty': '-0.6em' }} />
      </Text>
      <Text frame={frame} x={386} y={978} size={42} align="center" weight={800} color={ink}>
        <Words text="PRIMARY LOGO" at={1.95} />
      </Text>
      <Text frame={frame} x={975} y={516} size={44} weight={800} color="#172226">
        <Letters text="THE HIDDEN M" at={3.55} step={0.03} />
      </Text>
      <Text frame={frame} x={1013} y={978} size={40} align="center" weight={500} color={teal}>
        <Line at={3.45}>DEEP HIEL</Line>
      </Text>
      <Text frame={frame} x={1013} y={1025} size={40} align="center" weight={500} color={teal}>
        <Line at={3.55}>#1A5F5F</Line>
      </Text>
      {STORY.map((line, index) => (
        <Text key={line} frame={frame} x={700} y={1117 + index * 72} size={50} align="center" weight={500} color={ink}>
          <Words text={line} at={4 + index * 0.28} step={0.045} />
        </Text>
      ))}
      <Text frame={frame} x={700} y={1628} size={33} align="center" weight={500} color={ink}>
        <Line at={5.5}>MUNGA DESIGN | Nairobi</Line>
      </Text>
      <Text frame={frame} x={700} y={1672} size={33} align="center" weight={500} color={ink}>
        <Line at={5.6}>01°20'S, 36°40'E</Line>
      </Text>
    </>
  )
}

const compositions: Record<Design, () => ReactNode> = {
  'primary-logo': PrimaryLogo,
  convergence: Convergence,
  construction: Construction,
  'seen-it': SeenIt,
}
