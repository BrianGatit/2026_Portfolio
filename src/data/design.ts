import type { DesignPiece } from '@/types'

/**
 * Graphic-design work shown as a gallery rather than as case studies.
 * Drop a real file in `/public/design/…` and set `image` to swap the generated
 * composition for a photograph or export.
 */
export const designPieces: DesignPiece[] = [
  /* ---------------------------------------------------------------- *\
     Real work. Ratios match each file exactly, so `object-cover`
     crops nothing and the layouts are shown as they were designed.
  \* ---------------------------------------------------------------- */
  {
    slug: 'building-is-art',
    title: 'Building Is Art',
    category: 'Poster',
    year: '2026',
    role: 'Design & copy',
    tools: ['Canva', 'remove.bg', 'Editorial layout'],
    note:
      'A personal manifesto set as a dark editorial poster. Condensed display type is pushed to the full ' +
      'measure so the headline becomes the top rule of the page; the body copy sits in two blocks of ' +
      'different rhythm — ranged-left above, justified below — and a cutout portrait bleeds off the left ' +
      'edge. The date is the only element permitted to interrupt the reading order.',
    ratio: '1080 / 1350',
    motif: 'poster',
    image: '/design/building-is-art.jpg',
    alt:
      'Dark poster with the headline “Building is art” in large condensed type, an essay about treating ' +
      'technology as a medium and about intention, the date 2026/AUG, and a cutout portrait of Brian Mungai ' +
      'at the lower left.',
    palette: ['#e9e6dc', '#c9c4b4', '#141410'],
  },
  {
    slug: 'belonging-still-becoming',
    title: 'Belonging; still becoming',
    category: 'Editorial',
    year: '2026',
    role: 'Editorial design & writing',
    tools: ['Canva', 'remove.bg', 'Editorial layout'],
    note:
      'A magazine page on belonging, built from one grotesque at three weights and a single deep green on ' +
      'off-white. The headline breaks across three lines to hold the upper half on its own; a pull quote ' +
      'carries the argument, and the cutout portrait is kept small enough to sit inside the text column ' +
      'rather than compete with it.',
    ratio: '1131 / 1600',
    motif: 'spread',
    image: '/design/belonging-still-becoming.jpg',
    alt:
      'Cream editorial page with the headline “Belonging; still becoming” in dark green type, a standfirst ' +
      'reading “Creating beyond the studio”, a pull quote about belonging as the theme running through a ' +
      'year of work, and a small cutout portrait of Brian Mungai.',
    palette: ['#13301d', '#1b4a2b', '#f7f5ef'],
  },
  {
    slug: 'basketball-sport-magazine',
    title: 'Basket Ball — sport magazine cover',
    category: 'Editorial',
    year: '2025',
    role: 'Cover design & layout',
    tools: ['Canva', 'Photo compositing'],
    note:
      'A sports-magazine cover on a strict two-colour system: a white slab masthead over a live-action ' +
      'frame, with amber reserved exclusively for the sell lines and the issue block. Everything ' +
      'administrative — issue number, barcode, contact rule — is squared off and pushed to the margins so ' +
      'the player keeps the centre.',
    ratio: '904 / 1280',
    motif: 'poster',
    image: '/design/basketball-sport-magazine.jpg',
    alt:
      'Magazine cover reading “Basket Ball — Sport Magazine”, Issue 18, October 2025, over a photograph of ' +
      'a basketball player mid-dribble, with an amber “Exclusive” banner and the cover line “Tips for ' +
      'endurance”.',
    palette: ['#111113', '#f0a63c', '#f4f2ec'],
  },

  /* ---------------------------------------------------------------- *\
     Placeholder pieces — generated compositions standing in until
     real files replace them. Delete any you do not need.
  \* ---------------------------------------------------------------- */
  {
    slug: 'north-bearing-wordmark',
    title: 'North Bearing',
    category: 'Brand identity',
    year: '2025',
    role: 'Art direction, wordmark, system',
    tools: ['Illustrator', 'Figma', 'Glyphs'],
    note: 'Grotesque skeleton with opened counters; the N carries a truncated bearing line. Tested to 16px.',
    ratio: '4 / 5',
    motif: 'wordmark',
    palette: ['#111113', '#c9350f', '#f4f2ec'],
  },
  {
    slug: 'sanaa-poster-series',
    title: 'Sanaa Festival — poster series',
    category: 'Poster',
    year: '2024',
    role: 'Designer, generative system',
    tools: ['Illustrator', 'Python', 'Risograph'],
    note: 'Forty A2 posters from one 8-column grid; the accent block’s position derives from the artist’s slot number.',
    ratio: '3 / 4',
    motif: 'poster',
    palette: ['#1b1b1e', '#eb6834', '#f0ede5'],
  },
  {
    slug: 'quarterly-report-2024',
    title: 'Annual review — editorial system',
    category: 'Editorial',
    year: '2024',
    role: 'Designer & typesetter',
    tools: ['InDesign', 'Quarto', 'Matplotlib'],
    note: '96 pages of analysis typeset on a 12-column grid, with a charting language that matches the body type.',
    ratio: '16 / 11',
    motif: 'spread',
    palette: ['#111113', '#2a78d6', '#fbfaf7'],
  },
  {
    slug: 'mobility-atlas-plates',
    title: 'Mobility Atlas — plates',
    category: 'Editorial',
    year: '2024',
    role: 'Cartography & layout',
    tools: ['Matplotlib', 'InDesign', 'GeoPandas'],
    note: 'Eighteen plates, one question each. Every map states its own positional error.',
    ratio: '4 / 5',
    motif: 'grid',
    palette: ['#0a0a0b', '#1baf7a', '#eae7df'],
  },
  {
    slug: 'kite-coffee-mark', 
    title: 'Kite Coffee — marque',
    category: 'Logo',
    year: '2023',
    role: 'Identity designer',
    tools: ['Illustrator', 'Figma'],
    note: 'A single fold, drawn on a 5×5 module so it holds as an embroidery, a stamp and a favicon.',
    ratio: '1 / 1',
    motif: 'mark',
    palette: ['#1b1b1e', '#eda100', '#f4f2ec'],
  },
  {
    slug: 'studio-stationery',
    title: 'Studio stationery',
    category: 'Stationery',
    year: '2024',
    role: 'Designer',
    tools: ['InDesign', 'Letterpress'],
    note: 'Business cards, letterhead and invoice system on one 4mm baseline grid. Letterpress on 600gsm cotton.',
    ratio: '3 / 2',
    motif: 'card',
    palette: ['#111113', '#c9350f', '#f0ede5'],
  },
  {
    slug: 'field-notes-apparel',
    title: 'Field Notes — apparel',
    category: 'Apparel',
    year: '2023',
    role: 'Graphic designer',
    tools: ['Illustrator', 'Screen print'],
    note: 'Two-colour screen print for a research collective; type set to survive one wash cycle at 40°C and a decade of wear.',
    ratio: '4 / 5',
    motif: 'garment',
    palette: ['#0a0a0b', '#eb6834', '#c8c4ba'],
  },
  {
    slug: 'signal-social-kit',
    title: 'Signal — social kit',
    category: 'Social',
    year: '2024',
    role: 'Designer',
    tools: ['Figma', 'After Effects'],
    note: 'Twelve templates that stay legible at thumbnail scale, with one accent reserved for the number that matters.',
    ratio: '1 / 1',
    motif: 'grid',
    palette: ['#131315', '#3987e5', '#f4f2ec'],
  },
  {
    slug: 'harvest-packaging',
    title: 'Harvest — packaging',
    category: 'Packaging',
    year: '2023',
    role: 'Designer',
    tools: ['Illustrator', 'Dieline drafting'],
    note: 'Kraft stock, one plate, typographic hierarchy doing the work that photography usually does.',
    ratio: '3 / 4',
    motif: 'poster',
    palette: ['#1b1b1e', '#1baf7a', '#eae7df'],
  },
  {
    slug: 'type-specimen-01',
    title: 'Specimen No. 1',
    category: 'Editorial',
    year: '2025',
    role: 'Typographer',
    tools: ['InDesign', 'Figma'],
    note: 'A personal study: one grotesque, one serif, and how far a hierarchy can go with two weights.',
    ratio: '16 / 11',
    motif: 'spread',
    palette: ['#111113', '#c9350f', '#fbfaf7'],
  },
  {
    slug: 'ledger-lens-identity',
    title: 'Ledger Lens — product identity',
    category: 'Brand identity',
    year: '2025',
    role: 'Designer',
    tools: ['Figma', 'Illustrator'],
    note: 'A lens drawn as two overlapping ledger rules. Built as tokens first, artwork second.',
    ratio: '1 / 1',
    motif: 'mark',
    palette: ['#0a0a0b', '#ff5a2e', '#131315'],
  },
  {
    slug: 'conference-wayfinding',
    title: 'Conference wayfinding',
    category: 'Poster',
    year: '2024',
    role: 'Designer',
    tools: ['Illustrator', 'Large-format print'],
    note: 'Numbers first, words second. Readable at nine metres in a corridor with bad lighting.',
    ratio: '3 / 4',
    motif: 'poster',
    palette: ['#111113', '#2a78d6', '#f0ede5'],
  },
]

export const designCategories = [
  'All',
  'Brand identity',
  'Poster',
  'Editorial',
  'Logo',
  'Stationery',
  'Apparel',
  'Social',
  'Packaging',
] as const
