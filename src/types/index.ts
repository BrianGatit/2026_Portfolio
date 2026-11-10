/**
 * Content model for the portfolio.
 *
 * Everything the site renders comes from typed data in `src/data`. To publish a
 * real project you add an object here-shaped record and, optionally, point
 * `cover`/`gallery` at real images in `/public`. When no image is supplied the
 * UI falls back to a generated, discipline-specific visual so the layout never
 * shows a broken or grey box.
 */

export type Discipline = 'engineering' | 'data' | 'ai' | 'design'

/** Controls how much room a card claims in the asymmetric work grid. */
export type CardSpan = 'full' | 'wide' | 'half' | 'tall'

export interface Metric {
  label: string
  value: string
  note?: string
}

export interface NamedBody {
  title: string
  body: string
}

export interface StackGroup {
  group: string
  items: string[]
}

/* ------------------------------------------------------------------ *\
   Charts — hand-drawn SVG, no charting dependency.
   Series colours come from the validated categorical slots in fixed
   order; a single-series chart uses the brand accent and needs no legend.
\* ------------------------------------------------------------------ */

export interface Point {
  x: number
  y: number
}

export interface LabelledSeries {
  name: string
  points: Point[]
  /** Optional value suffix used by direct labels and tooltips, e.g. '%'. */
  unit?: string
}

export interface CategoryDatum {
  label: string
  value: number
  emphasis?: boolean
}

export type ChartSpec =
  | {
      kind: 'line'
      title: string
      subtitle?: string
      series: LabelledSeries[]
      xLabels?: string[]
      yUnit?: string
      source?: string
    }
  | {
      kind: 'bars'
      title: string
      subtitle?: string
      data: CategoryDatum[]
      unit?: string
      source?: string
    }
  | {
      kind: 'columns'
      title: string
      subtitle?: string
      data: CategoryDatum[]
      unit?: string
      source?: string
    }
  | {
      kind: 'scatter'
      title: string
      subtitle?: string
      /** Capped at three groups: three slots validate on the all-pairs gate. */
      groups: LabelledSeries[]
      xAxisLabel: string
      yAxisLabel: string
      source?: string
    }

/* ------------------------------------------------------------------ *\
   Long-form blocks — shared by case studies and articles.
\* ------------------------------------------------------------------ */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'lead'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; lang: string; code: string; caption?: string }
  | { type: 'note'; text: string }
  | { type: 'chart'; chart: ChartSpec }
  | { type: 'figure'; caption: string; seed?: string; motif?: Discipline; ratio?: string }

/* ------------------------------------------------------------------ *\
   Architecture diagram — a simple layered graph, drawn in SVG.
\* ------------------------------------------------------------------ */

export interface ArchitectureLayer {
  label: string
  nodes: { name: string; note?: string; accent?: boolean }[]
}

export interface Architecture {
  caption: string
  layers: ArchitectureLayer[]
}

/* ------------------------------------------------------------------ *\
   Data-science specific case-study material.
\* ------------------------------------------------------------------ */

export interface Analysis {
  dataset: {
    name: string
    rows: string
    features: string
    span: string
    source: string
  }
  questions: string[]
  methodology: NamedBody[]
  charts: ChartSpec[]
  insights: NamedBody[]
  conclusion: string
}

/* ------------------------------------------------------------------ *\
   Projects
\* ------------------------------------------------------------------ */

export interface CaseStudyContent {
  overview: string
  problem: string
  problemPoints?: string[]
  approach: string
  approachPoints?: string[]
  process: NamedBody[]
  stack: StackGroup[]
  architecture?: Architecture
  results: Metric[]
  resultsNarrative: string
  challenges: NamedBody[]
  outcome: string
  analysis?: Analysis
  /** Real figures when `image` is set; a captioned placeholder otherwise. */
  gallery?: { caption: string; ratio?: string; image?: string; alt?: string }[]
  next?: string[]
}

export interface Project {
  slug: string
  title: string
  /** One line, used on cards. */
  tagline: string
  /** Two or three lines, used on index pages and meta descriptions. */
  summary: string
  discipline: Discipline
  /** Human-readable category, e.g. 'Full-stack platform'. */
  category: string
  year: string
  role: string
  client?: string
  timeline?: string
  tags: string[]
  featured?: boolean
  span?: CardSpan
  cover?: string
  links?: { live?: string; repo?: string }
  study: CaseStudyContent
}

/* ------------------------------------------------------------------ *\
   Design work
\* ------------------------------------------------------------------ */

export type DesignCategory =
  | 'Brand identity'
  | 'Logo'
  | 'Apparel'
  | 'Merchandise'
  | 'Social'
  | 'Environmental'
  | 'Pattern'
  | 'Poster'
  | 'Editorial'
  | 'Stationery'
  | 'Packaging'

export interface DesignPiece {
  slug: string
  title: string
  category: DesignCategory
  year: string
  role: string
  tools: string[]
  note: string
  /** CSS aspect-ratio for the masonry cell, e.g. '4 / 5'. */
  ratio: string
  /** Which generated composition to draw when no image is supplied. */
  motif: 'wordmark' | 'poster' | 'spread' | 'grid' | 'mark' | 'card' | 'garment'
  image?: string
  /**
   * Alt text for `image`. Type-led designs carry their meaning in words, so
   * describe what the piece says, not just that it is a poster.
   */
  alt?: string
  palette?: string[]
  /** How the piece is presented in motion. Defaults to a product presentation. */
  motion?: DesignMotion
}

/** A point on a design, in percent of its width (x) and height (y). */
export interface DesignPoint {
  x: number
  y: number
}

/**
 * A motion treatment for a flat design file. None of these pretend the image
 * has layers: each one moves a camera over the artwork, reveals it along its
 * own structure (a grid, reading bands, a circle), or draws an annotation
 * layer on top of it.
 */
export type DesignMotion =
  /** A circular iris opens from `origin`; a drawn ring settles on the emblem's circle; light crosses it. */
  | { kind: 'iris'; origin: DesignPoint; ring: DesignPoint & { r: number } }
  /** A presentation board split along its own grid: panels assemble, then each takes the focus in turn. */
  | { kind: 'board'; cols: number; rows: number }
  /** A dark photograph lit by a moving pool of light. */
  | { kind: 'spotlight'; path: DesignPoint[] }
  /** A cinematic letterbox opening, a slow push-in and a passing highlight. */
  | { kind: 'product' }
  /** A slow camera move across a wide surface. */
  | { kind: 'pan'; mode: 'track' | 'drift' | 'breathe' | 'push' }
  /** Revealed in reading order, band by band along its own layout, on a loop. */
  | { kind: 'sequence'; axis: 'x' | 'y'; cuts: number[] }
  /**
   * The file cut into its real elements — panels, lines of type, tiles,
   * icons, a seal's ring and medallion — each animating on its own. The
   * regions tile all of the content, so at rest the frame is the original.
   */
  | { kind: 'layers'; size: [number, number]; base: string; layers: DesignLayer[] }
  /**
   * A type-and-geometry design rebuilt as live vector and HTML from the brand
   * mark and the design's exact text, so every letter, line and shape moves.
   */
  | { kind: 'live'; design: LiveDesign }

export type LiveDesign = 'primary-logo' | 'convergence' | 'construction' | 'seen-it'

/** One element of a flat file, as a region of it, in the file's own pixels. */
export interface DesignLayer {
  shape:
    | { rect: [x: number, y: number, w: number, h: number] }
    | { circle: [cx: number, cy: number, r: number] }
    | { ring: [cx: number, cy: number, inner: number, outer: number] }
  /** How it arrives: moved inside its own mask, cut in, or turned into place. */
  enter: 'rise' | 'drop' | 'from-left' | 'from-right' | 'wipe-right' | 'wipe-down' | 'unfold' | 'pop' | 'spin' | 'fade'
  /** Seconds after the piece starts. */
  at: number
  /** What it does afterwards — every loop starts and ends at rest. */
  loop?: 'float' | 'sway' | 'breathe' | 'spin' | 'glow' | 'pulse' | 'parallax'
}

/* ------------------------------------------------------------------ *\
   Writing
\* ------------------------------------------------------------------ */

export interface Article {
  slug: string
  title: string
  dek: string
  category: 'Engineering' | 'Data Science' | 'AI' | 'Design' | 'Craft'
  date: string
  readingTime: number
  tags: string[]
  featured?: boolean
  body: Block[]
}

/* ------------------------------------------------------------------ *\
   Skills
\* ------------------------------------------------------------------ */

export interface SkillCategory {
  id: string
  title: string
  blurb: string
  items: { name: string; level?: 'core' | 'strong' | 'working' }[]
}
