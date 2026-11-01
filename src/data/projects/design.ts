import type { Project } from '@/types'

export const designProjects: Project[] = [
  {
    slug: 'munga-design',
    title: 'Munga Design',
    tagline: 'An identity built on two angles and the space between them.',
    summary:
      'Logo, construction system, colour and applications for Munga Design, a Nairobi studio established in 2025 — ' +
      'an M made of two folded strokes, with a second M hidden in its negative space.',
    discipline: 'design',
    category: 'Brand identity',
    year: '2025',
    role: 'Identity designer — mark, system and applications',
    client: 'Munga Design, Nairobi',
    tags: ['Brand identity', 'Logo design', 'Construction grid', 'Colour system', 'Merchandise', 'Environmental graphics'],
    featured: true,
    // Cropped above the photo's caption strip, which card ratios would cut mid-word.
    cover: '/design/munga/bottle-range-cover.jpg',
    study: {
      overview:
        'Munga Design needed a mark that could carry its own story. The answer is an M made of two strokes — orange ' +
        'and amber — folded over each other at fixed angles, so that the logo, the pattern, the mural and the ' +
        'merchandise are all drawn from the same two lines.',
      problem:
        'A studio identity has to do two jobs at once: read instantly as a letter at small sizes, and hold enough ' +
        'idea to sustain a whole system — apparel, objects, walls, social — without each application inventing its ' +
        'own look.',
      problemPoints: [
        'A monogram simple enough to embroider and to print in one colour.',
        'A construction that explains itself, so the system can be extended by rule rather than by taste.',
        'A palette warm enough to be recognised from colour alone.',
      ],
      approach:
        'Build the letter from angles that mean something, and let everything else inherit them. The strokes are set ' +
        'at 20° and 40°; together they make 60°. The identity is then the two colours, the two angles and the point ' +
        'where they meet — not a logo applied to things.',
      approachPoints: [
        '20° = refinement: the subtle shift in perspective that changes everything.',
        '40° = boldness: the leap that creates impact.',
        '60° = balance: where refinement meets risk.',
        'The negative space between the strokes forms a second M, rotated 90° — a detail that rewards attention.',
      ],
      process: [
        {
          title: '01 — The mark',
          body:
            'Two strokes, folded. The orange stroke crosses over the amber one at the fold; the corners are rounded ' +
            'where the letter meets the edge of the plate and sharp where the strokes meet each other.',
        },
        {
          title: '02 — Construction',
          body:
            'The mark is drawn on a grid of circles and diagonals at 20° and 40°. The same angles later drive the ' +
            'pattern and the mural, so every application can be checked against the grid.',
        },
        {
          title: '03 — The hidden M',
          body:
            'The space between the strokes is itself an M, turned 90°. The presentation reveals it once, in deep ' +
            'teal (#1A5F5F); everywhere else it is left for people to find.',
        },
        {
          title: '04 — The convergence point',
          body:
            'The meeting point of the strokes became the brand’s story: 01°20′S, 36°40′E — “not a place, a moment: ' +
            'the exact coordinates where two ideas become one.”',
        },
        {
          title: '05 — Applications',
          body:
            'An embroidered cap, a range of four bottles, a building-scale mural, a geometric pattern, a softer silk ' +
            'texture and a social series that tells the story of the hidden M.',
        },
      ],
      stack: [
        { group: 'Identity', items: ['Primary logo', 'Single-colour logo', 'Wordmark lockups', 'Construction grid'] },
        { group: 'Colour', items: ['Orange', 'Amber', 'Deep teal #1A5F5F', 'Ink on cream'] },
        { group: 'Applications', items: ['Embroidered cap', 'Bottle range', 'Mural', 'Brand pattern', 'Social series'] },
      ],
      results: [
        { label: 'Strokes', value: '2', note: 'Orange and amber, folded into one M' },
        { label: 'Angles', value: '20° · 40°', note: 'Refinement and boldness' },
        { label: 'Balance', value: '60°', note: 'Where refinement meets risk' },
        { label: 'Hidden letter', value: '1', note: 'A second M in the negative space' },
        { label: 'Established', value: '2025', note: 'Nairobi · 01°20′S, 36°40′E' },
      ],
      resultsNarrative:
        'The identity holds from a cap badge to a building wall because every application is drawn from the same two ' +
        'strokes and the same two angles — the mural and the pattern are the mark taken apart, not new graphics.',
      challenges: [
        {
          title: 'One colour, still the same mark',
          body:
            'The fold depends on two colours overlapping. The single-colour version — ink on amber, white on orange — ' +
            'keeps the fold legible through the shape of the strokes alone.',
        },
        {
          title: 'A secret that stays a secret',
          body:
            'The hidden M only works if the logo never points at it. It is shown once, in the reveal post, and left ' +
            'unmarked on everything else.',
        },
      ],
      outcome:
        'A complete identity — mark, construction, colour and a family of applications — where every piece can be ' +
        'traced back to two lines and the point where they meet.',
      // The first figure spans the full width, so it is the wide one.
      gallery: [
        {
          caption: 'The identity at building scale.',
          ratio: '2752 / 1536',
          image: '/design/munga/mural.jpg',
          alt: 'A mural of orange and amber diagonal bands on a white panelled wall, annotated with 20° and 40°.',
        },
        {
          caption: 'Construction: 20° for refinement, 40° for boldness, 60° for balance.',
          ratio: '1 / 1',
          image: '/design/munga/construction-grid.jpg',
          alt: 'The Munga M on its construction grid, annotated with the 20°, 40° and 60° angles.',
        },
        {
          caption: 'The hidden M — the negative space, revealed in deep teal.',
          ratio: '1 / 1',
          image: '/design/munga/hidden-m.jpg',
          alt: 'The primary logo beside a version with its negative space filled in deep teal to reveal a second M.',
        },
        {
          caption: 'The convergence point: 01°20′S, 36°40′E.',
          ratio: '1 / 1',
          image: '/design/munga/convergence-point.jpg',
          alt: 'The Munga M with crosshairs over the meeting point of its strokes, above the coordinates 01°20′S, 36°40′E.',
        },
        {
          caption: 'Embroidered cap.',
          ratio: '1 / 1',
          image: '/design/munga/embroidered-cap.jpg',
          alt: 'A cap fading from white to orange with the Munga M embroidered in orange and amber.',
        },
      ],
    },
  },
]
