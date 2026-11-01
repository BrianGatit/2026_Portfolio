import type { DesignPiece } from '@/types'

/**
 * Graphic-design work shown as a gallery rather than as case studies.
 * Every piece is a real file in `/public/design/…`; ratios match each file
 * exactly, so `object-cover` crops nothing and the work is shown as designed.
 *
 * `tools` is left empty where it has not been recorded — the detail view
 * simply omits the row until it is filled in.
 */

/** The Munga Design palette, in order of weight. */
const munga = ['#fd6f1d', '#fdb31b', '#1a5f5f', '#f4f2ec']

export const designPieces: DesignPiece[] = [
  {
    slug: 'munga-primary-logo',
    title: 'Munga Design — primary logo',
    category: 'Logo',
    year: '2025',
    role: 'Logo design',
    tools: [],
    note:
      'Two folded strokes make the M: orange on the left, amber on the right, the orange arm laid over the amber ' +
      'at the fold. Rounded corners where the letter meets the edge of the plate, a sharp point where the two ' +
      'strokes meet each other.',
    ratio: '1 / 1',
    motif: 'mark',
    image: '/design/munga/primary-logo.jpg',
    alt: 'The Munga Design primary logo: an M built from an orange stroke folded over an amber one, on a pale circle.',
    palette: munga,
  },
  {
    slug: 'munga-embroidered-cap',
    title: 'Embroidered cap',
    category: 'Apparel',
    year: '2025',
    role: 'Apparel graphics',
    tools: [],
    note:
      'The mark embroidered in raised orange and amber thread on a cap that fades from white to orange, with ' +
      '“Graphic Design” on the side panel and MUNGA on the strap clip — the identity carried by colour as much as by the logo.',
    ratio: '1 / 1',
    motif: 'garment',
    image: '/design/munga/embroidered-cap.jpg',
    alt:
      'A man in profile touching the peak of a cap that fades from white to orange, with the Munga M embroidered ' +
      'in orange and amber and the words “Graphic Design” on the side.',
    palette: munga,
  },
  {
    slug: 'munga-construction-grid',
    title: 'Construction — 20°, 40°, 60°',
    category: 'Brand identity',
    year: '2025',
    role: 'Identity system',
    tools: [],
    note:
      'The mark drawn on its construction grid. Two angles carry the meaning — 20° for refinement, the subtle ' +
      'shift in perspective; 40° for boldness, the leap that creates impact — and they meet at 60°: balance, ' +
      'where refinement meets risk.',
    ratio: '1 / 1',
    motif: 'grid',
    image: '/design/munga/construction-grid.jpg',
    alt:
      'The Munga M on a construction grid with guide circles and diagonals, annotated “20° = refinement”, ' +
      '“40° = boldness” and “60° = balance — where refinement meets risk”, above the MUNGA DESIGN wordmark.',
    palette: munga,
  },
  {
    slug: 'munga-bottle-range',
    title: 'Bottle range',
    category: 'Merchandise',
    year: '2025',
    role: 'Merchandise design',
    tools: [],
    note:
      'Four bottles, one wordmark: orange with the mark reversed out in white, black with orange type, cream ' +
      'with ink type, and amber with ink. The vertical lockup reads the same on every finish.',
    ratio: '2752 / 1536',
    motif: 'card',
    image: '/design/munga/bottle-range.jpg',
    alt:
      'Four water bottles on white plinths — orange, black, cream and amber — each printed vertically with ' +
      'MUNGA DESIGN; the orange one also carries the M mark. Caption: Est. 2025 | Munga Design.',
    palette: munga,
  },
  {
    slug: 'munga-hidden-m',
    title: 'The hidden M',
    category: 'Brand identity',
    year: '2025',
    role: 'Identity system',
    tools: [],
    note:
      'The negative space between the two strokes forms a second M, rotated 90°. It is always there; the ' +
      'presentation fills it in deep teal (#1A5F5F) once, so it can be seen.',
    ratio: '1 / 1',
    motif: 'mark',
    image: '/design/munga/hidden-m.jpg',
    alt:
      'A presentation sheet: the primary logo beside a version with the negative space filled in deep teal to ' +
      'reveal a second M, captioned “The negative space forms a perfect M — rotated 90°. Always there. Waiting to be discovered.”',
    palette: munga,
  },
  {
    slug: 'munga-cream-bottle',
    title: 'Cream bottle',
    category: 'Merchandise',
    year: '2025',
    role: 'Merchandise design',
    tools: [],
    note:
      'Matte cream with a bamboo lid: the mark in full colour at the base, the wordmark set vertically in ink above it.',
    ratio: '1060 / 1425',
    motif: 'card',
    image: '/design/munga/cream-bottle.jpg',
    alt: 'A matte cream water bottle with a bamboo lid, printed vertically with MUNGA DESIGN above the orange-and-amber M.',
    palette: munga,
  },
  {
    slug: 'munga-convergence-point',
    title: 'The Convergence Point',
    category: 'Poster',
    year: '2025',
    role: 'Brand storytelling',
    tools: [],
    note:
      '01°20′S, 36°40′E. Crosshairs mark the point where the two strokes meet — “not a place, a moment: the exact ' +
      'coordinates where two ideas become one. Where 20° meets 40°. Where Munga begins.”',
    ratio: '1 / 1',
    motif: 'poster',
    image: '/design/munga/convergence-point.jpg',
    alt:
      'The Munga M with crosshairs over the point where the strokes meet, the coordinates 01°20′S, 36°40′E ' +
      'set large in mono type, and the heading “The Convergence Point”.',
    palette: munga,
  },
  {
    slug: 'munga-mural',
    title: 'Mural — 20° and 40°',
    category: 'Environmental',
    year: '2025',
    role: 'Environmental graphics',
    tools: [],
    note:
      'The identity at building scale: orange and amber bands crossing a panelled white wall at the brand’s two ' +
      'angles, with the 20° and 40° marks left on the wall. A single figure walking past gives the scale.',
    ratio: '2752 / 1536',
    motif: 'grid',
    image: '/design/munga/mural.jpg',
    alt:
      'A large mural of interlocking orange and amber diagonal bands on a white panelled wall, annotated with ' +
      '20° and 40° angles, with a small figure walking past at the lower left.',
    palette: munga,
  },
  {
    slug: 'munga-have-you-seen-it',
    title: 'Have you seen it?',
    category: 'Social',
    year: '2025',
    role: 'Social content',
    tools: [],
    note:
      'The reveal post. “The secret has always been there. Hidden in the space between. A second M, rotated, ' +
      'waiting to be discovered. This is how we design — with layers, intention, and details that reward attention.”',
    ratio: '1856 / 2304',
    motif: 'poster',
    image: '/design/munga/have-you-seen-it.jpg',
    alt:
      'A social post headed “Have you seen it?” showing the primary logo and an arrow to the hidden M in deep ' +
      'teal, with the story of the second M below and the sign-off “Munga Design | Nairobi, 01°20′S, 36°40′E”.',
    palette: munga,
  },
  {
    slug: 'munga-amber-bottle',
    title: 'Amber bottle',
    category: 'Merchandise',
    year: '2025',
    role: 'Merchandise design',
    tools: [],
    note: 'The single-colour version of the primary logo — the mark and stacked wordmark in ink on amber.',
    ratio: '1033 / 1459',
    motif: 'card',
    image: '/design/munga/amber-bottle.jpg',
    alt: 'A tilted amber water bottle printed in dark ink with the M mark, MUNGA DESIGN and the label “Primary logo”.',
    palette: munga,
  },
  {
    slug: 'munga-pattern',
    title: 'Brand pattern',
    category: 'Pattern',
    year: '2025',
    role: 'Pattern design',
    tools: [],
    note:
      'The mark broken into its angles and reassembled as a repeat: orange, amber and ink triangles and ' +
      'parallelograms on white, for packaging, backgrounds and anywhere the full logo would be too much.',
    ratio: '2752 / 1536',
    motif: 'grid',
    image: '/design/munga/pattern.jpg',
    alt: 'A dense geometric pattern of orange, amber and dark navy triangles and diagonal shapes on white.',
    palette: ['#fd6f1d', '#fdb31b', '#1b2430', '#f4f2ec'],
  },
  {
    slug: 'munga-silk-texture',
    title: 'Brand texture',
    category: 'Brand identity',
    year: '2025',
    role: 'Art direction',
    tools: [],
    note:
      'The softer register of the identity: orange and amber flowing through cream silk — the same two colours ' +
      'and the same meeting point, with the edges taken away.',
    ratio: '2752 / 1536',
    motif: 'spread',
    image: '/design/munga/silk-gradient.jpg',
    alt: 'Soft-focus cream silk with orange and amber colour flowing through its folds and meeting at the centre.',
    palette: ['#fd6f1d', '#fdb31b', '#f3eee3'],
  },
]

export const designCategories = [
  'All',
  'Brand identity',
  'Logo',
  'Apparel',
  'Merchandise',
  'Social',
  'Poster',
  'Environmental',
  'Pattern',
] as const
