import type { DesignPiece } from '@/types'
import { imagerySlideLayers, kachilibaLayers, launchSlideLayers } from './designLayers'

/**
 * Graphic-design work shown as a gallery rather than as case studies.
 * Every piece is a real file in `/public/design/…`; ratios match each file
 * exactly, so `object-cover` crops nothing and the work is shown as designed.
 *
 * Each piece has its own `motion` treatment, chosen from the structure of the
 * artwork itself — a board's grid, a post's reading bands, an emblem's circle.
 * Points are percentages of the file, measured from the image.
 *
 * `tools` is left empty where it has not been recorded — the detail view
 * simply omits the row until it is filled in.
 */

/** The Munga Design palette, in order of weight. */
const munga = ['#fd6f1d', '#fdb31b', '#1a5f5f', '#f4f2ec']

export const designPieces: DesignPiece[] = [
  {
    slug: 'munga-brand-board',
    title: 'Munga Design — brand board',
    category: 'Brand identity',
    year: '2025',
    role: 'Identity system',
    tools: [],
    note:
      'The identity on one sheet: the primary mark and stacked wordmark, a debossed business card, tumblers in ' +
      'black and amber, app icons, the Helvetica Neue specimen with the two brand colours, a tote, a T-shirt, a ' +
      'watch face and a mug — nine applications, one system.',
    ratio: '1 / 1',
    motif: 'grid',
    image: '/design/munga/brand-board.jpg',
    alt:
      'A three-by-three brand board: the Munga Design logo on amber, a debossed black business card, black and ' +
      'amber tumblers, app icons, a Helvetica Neue type specimen with swatches #FF6B35 and #FFB800, a tote bag, a ' +
      'T-shirt on a mannequin, a smartwatch face and a black mug, all carrying the orange-and-amber M.',
    palette: ['#ff6b35', '#ffb800', '#1b1b1f', '#f4f2ec'],
    motion: { kind: 'board', cols: 3, rows: 3 },
  },
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
    // Rebuilt from the mark's own vector strokes, so they can assemble.
    motion: { kind: 'live', design: 'primary-logo' },
  },
  {
    slug: 'munga-black-cap',
    title: 'Embroidered cap — black',
    category: 'Apparel',
    year: '2025',
    role: 'Apparel graphics',
    tools: [],
    note:
      'The mark in raised orange and amber thread over MUNGA DESIGN in tonal black embroidery. On black the ' +
      'colour does all the work; the wordmark is there for whoever looks closely.',
    ratio: '1024 / 990',
    motif: 'garment',
    image: '/design/munga/black-cap.jpg',
    alt:
      'A close-up of a black cap with the Munga M embroidered in raised orange and amber thread above the words ' +
      'MUNGA DESIGN stitched in black on black.',
    palette: ['#fd6f1d', '#fdb31b', '#0b0b0c'],
    motion: {
      kind: 'spotlight',
      path: [
        { x: 54, y: 33 },
        { x: 46, y: 52 },
        { x: 62, y: 46 },
        { x: 55, y: 30 },
      ],
    },
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
    // Rebuilt line by line and word for word, so it can be drawn in order.
    motion: { kind: 'live', design: 'construction' },
  },
  {
    slug: 'uko-na-gapi-bucket-hat',
    title: '“Uko na gapi?” bucket hat',
    category: 'Apparel',
    year: '2025',
    role: 'Apparel graphics',
    tools: [],
    note:
      'Graffiti hand-lettering — “uko na gapi?” — sprayed in an orange-to-amber fade across a black bucket hat, ' +
      'with the drips and flecks left in and a single swash under “na”.',
    ratio: '1194 / 1600',
    motif: 'garment',
    image: '/design/munga/bucket-hat.jpg',
    alt: 'A black bucket hat printed with the words “uko na gapi?” in orange-to-amber graffiti lettering.',
    palette: ['#fd6f1d', '#fdb31b', '#1b1b1f'],
    motion: { kind: 'product' },
  },
  {
    slug: 'munga-identity-launch',
    title: 'Identity deck — ready to launch',
    category: 'Brand identity',
    year: '2025',
    role: 'Identity system',
    tools: [],
    note:
      'The closing slide of the identity deck: the lockup, Montserrat Black over Poppins, the three-colour split ' +
      '— vibrant orange, bright yellow, deep charcoal — the arrow-and-M pattern tiles and the business card.',
    ratio: '820 / 457',
    motif: 'spread',
    image: '/design/munga/identity-slide-launch.jpg',
    alt:
      'A presentation slide titled “Munga Design — Ready to Launch”, framed by the logo lockup, a colour pie chart ' +
      'of orange, yellow and charcoal, a Montserrat Black and Poppins type specimen, pattern tiles and a business card.',
    palette: munga,
    motion: launchSlideLayers,
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
    motion: { kind: 'live', design: 'convergence' },
  },
  {
    slug: 'munga-keyring',
    title: 'Keyring',
    category: 'Merchandise',
    year: '2025',
    role: 'Merchandise design',
    tools: [],
    note: 'The mark alone, printed flat in orange and amber on a brushed champagne disc — the smallest object in the range.',
    ratio: '1024 / 1536',
    motif: 'card',
    image: '/design/munga/keychain.jpg',
    alt: 'A round champagne-metal keyring printed with the orange-and-amber Munga M.',
    palette: munga,
    motion: { kind: 'iris', origin: { x: 46, y: 66 }, ring: { x: 46, y: 66, r: 33 } },
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
    motion: { kind: 'live', design: 'seen-it' },
  },
  {
    slug: 'munga-identity-imagery',
    title: 'Identity deck — imagery and icons',
    category: 'Brand identity',
    year: '2025',
    role: 'Art direction',
    tools: [],
    note:
      'How the brand looks when it is not the logo: architecture, desks and stationery shot in orange, amber, ' +
      'sky blue and charcoal, beside an outline icon set drawn at one weight.',
    ratio: '852 / 474',
    motif: 'spread',
    image: '/design/munga/identity-slide-photography.jpg',
    alt:
      'A presentation slide: a grid of photographs of angular orange and yellow architecture, desks and stationery ' +
      'headed “Photography style”, beside six outline icons — pencil, light bulb, monitor, gear, rocket and speech ' +
      'bubble — headed “Iconography”.',
    palette: ['#fd6f1d', '#fdb31b', '#2f9bd6', '#1b1b1f'],
    motion: imagerySlideLayers,
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
    // The logo, the arrow, then the reveal — read left to right.
    motion: { kind: 'sequence', axis: 'x', cuts: [0, 41, 59, 100] },
  },
  {
    slug: 'kachiliba-tti-emblem',
    title: 'Kachiliba Technical Training Institute — emblem',
    category: 'Logo',
    year: '2025',
    role: 'Emblem design',
    tools: [],
    note:
      'A collegiate seal: the institute’s name set around a navy ring, a copper medallion holding a microscope, a ' +
      'computer and crossed tools for the disciplines taught, and a ribbon carrying the motto “Building skills”.',
    ratio: '1 / 1',
    motif: 'mark',
    image: '/design/clients/kachiliba-emblem.jpg',
    alt:
      'A circular navy emblem reading “Kachiliba Technical Training Institute” in gold around a copper medallion ' +
      'with a microscope, a computer and crossed tools, above a navy ribbon reading “Building skills”.',
    palette: ['#1c2f5e', '#c06a3f', '#f2b632', '#ffffff'],
    motion: kachilibaLayers,
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
    motion: { kind: 'pan', mode: 'push' },
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
    motion: { kind: 'product' },
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
    motion: { kind: 'pan', mode: 'track' },
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
    motion: { kind: 'product' },
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
    motion: { kind: 'pan', mode: 'drift' },
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
    motion: { kind: 'product' },
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
    motion: { kind: 'pan', mode: 'breathe' },
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
