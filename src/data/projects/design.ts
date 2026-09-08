import type { Project } from '@/types'

export const designProjects: Project[] = [
  {
    slug: 'north-bearing',
    title: 'North Bearing',
    tagline: 'An identity system for a maritime data company, built to survive a product.',
    summary:
      'Naming, wordmark, type and colour system, data-visualisation language and a documented component-level identity ' +
      'for a company whose product is a chart — so the brand had to work at 8px as well as on a billboard.',
    discipline: 'design',
    category: 'Brand identity & art direction',
    year: '2025',
    role: 'Art director & designer — naming through implementation',
    client: 'Maritime logistics intelligence startup',
    timeline: '10 weeks',
    tags: ['Brand identity', 'Typography', 'Design system', 'Data visualisation', 'Figma', 'Illustrator'],
    featured: true,
    span: 'tall',
    study: {
      overview:
        'Most identity work stops at a logo file. North Bearing’s product is a dense operational chart, so the identity had ' +
        'to reach all the way into the interface: which hue means "delayed", how a label sits against a plotted line, what ' +
        'happens to the wordmark at 24px in a browser tab. I designed the identity and the visual system it becomes inside the product.',
      problem:
        'The founders had a strong technical product and a placeholder brand assembled from a font trial and a stock ' +
        'gradient. It failed in the two places that mattered: it was unreadable at interface scale, and its colour palette ' +
        'collided with the semantic colours their own charts needed.',
      problemPoints: [
        'Six accent colours, three of which were already used by the product to mean specific operational states.',
        'A wordmark that lost its counters below 30px — unusable in navigation or a favicon.',
        'No type system, so every screen and deck negotiated hierarchy from scratch.',
        'Nothing documented, so the two engineers were interpreting a PNG.',
      ],
      approach:
        'Start from the constraint nobody had written down: the product needs four semantic colours and a categorical ramp, ' +
        'and the brand may not compete with them. That inverted the usual order — I designed the data palette first and let ' +
        'the brand palette take what remained, which turned out to be a much more distinctive place to stand.',
      approachPoints: [
        'Semantic and categorical chart palettes specified and contrast-tested first, in both light and dark surfaces.',
        'A single brand accent, deliberately outside the data hues, so an accent element can never be misread as a data state.',
        'Wordmark drawn from a grotesque skeleton with opened counters and a shortened bearing-mark on the N, tested down to 16px.',
        'Type system of three roles — display, interface, mono — with a fluid scale mapped to CSS custom properties.',
      ],
      process: [
        {
          title: '01 — Naming & positioning',
          body:
            'Eleven candidate names against a positioning line: navigational precision, not nautical romance. "North Bearing" ' +
            'won because it is a measurement, and measurement is what the product sells.',
        },
        {
          title: '02 — Data palette before brand palette',
          body:
            'Specified four semantic states and a six-slot categorical ramp, each validated for contrast against both ' +
            'surfaces and checked in colour-vision simulation. This defined the negative space the brand could occupy.',
        },
        {
          title: '03 — Drawing the mark',
          body:
            'Sixty-plus iterations of the wordmark, tested at 16, 24, 48 and 300px and printed at every stage. The final ' +
            'form carries one detail — a truncated diagonal on the N reading as a bearing line — and nothing else.',
        },
        {
          title: '04 — Type & layout system',
          body:
            'A four-step display scale, a three-step interface scale, tabular figures everywhere numbers align, and a ' +
            '12-column grid with a documented dense variant for operational screens.',
        },
        {
          title: '05 — Implementation, not handover',
          body:
            'I delivered tokens as JSON and CSS custom properties, plus a 34-page system document and a Figma library with ' +
            'variables wired to the same names the code uses. Design and engineering argue in the same vocabulary now.',
        },
      ],
      stack: [
        { group: 'Design', items: ['Figma', 'Illustrator', 'InDesign', 'Glyphs (mark refinement)'] },
        { group: 'System', items: ['Design tokens (JSON)', 'CSS custom properties', 'Figma variables', 'Contrast + CVD testing'] },
        { group: 'Deliverables', items: ['Wordmark & marque', 'Type system', 'Chart language', '34-page guidelines'] },
      ],
      results: [
        { label: 'Brand colours', value: '6 → 1', note: 'One accent, deliberately outside the data hues' },
        { label: 'Wordmark legibility', value: '16px', note: 'Down from a 30px floor' },
        { label: 'Contrast failures in product', value: '0', note: 'Both themes, after the palette rebuild' },
        { label: 'System documentation', value: '34 pp', note: 'Tokens shared with the codebase' },
        { label: 'Design-to-build drift', value: 'Eliminated', note: 'Figma variables generated from the token source' },
      ],
      resultsNarrative:
        'The identity reads as one thing across a pitch deck, a dense operational screen and a conference banner — but the ' +
        'result I am most pleased about is quieter: a year on, the engineers are still using the token names, because the ' +
        'system was delivered in a form their build could consume.',
      challenges: [
        {
          title: 'A palette that cannot compete with its own data',
          body:
            'Every distinctive colour I liked was already spoken for by an operational meaning. Designing the data palette ' +
            'first felt backwards and was the decision that made the whole system coherent — the brand accent now appears ' +
            'only on interactive and editorial elements, never on a mark that encodes a value.',
        },
        {
          title: 'Identity at interface density',
          body:
            'The brand had to hold at 8px row heights with numbers, states and labels competing. I solved it by giving the ' +
            'identity exactly two jobs at that scale — typography and one accent — and forbidding everything else. ' +
            'Restraint documented as a rule, rather than left to taste.',
        },
      ],
      outcome:
        'North Bearing shipped with the identity built into the product rather than applied over it. The guidelines have ' +
        'since been extended by their team for two new surfaces without my involvement, which is the test I care about.',
      gallery: [
        { caption: 'Wordmark construction and the 16px legibility test.', ratio: '4 / 3' },
        { caption: 'Chart language: semantic states, categorical ramp, both surfaces.', ratio: '16 / 10' },
        { caption: 'Type system across display, interface and mono roles.', ratio: '4 / 3' },
        { caption: 'Applied: pitch deck, operational screen, conference banner.', ratio: '16 / 10' },
      ],
    },
  },

  {
    slug: 'sanaa-festival',
    title: 'Sanaa Festival',
    tagline: 'A generative poster system for a three-day arts festival — 40 artists, one grid.',
    summary:
      'Identity and campaign for an independent arts festival: a modular poster system that produced 40 unique artist ' +
      'posters, a print programme, wayfinding and a social kit — all from one typographic grid.',
    discipline: 'design',
    category: 'Identity & campaign design',
    year: '2024',
    role: 'Designer & art director',
    client: 'Independent arts festival',
    timeline: '6 weeks',
    tags: ['Identity', 'Poster design', 'Editorial', 'Generative', 'Illustrator', 'InDesign', 'Python'],
    span: 'wide',
    study: {
      overview:
        'A festival with forty artists, a two-person volunteer team and no budget for forty individually designed posters. ' +
        'I built a system instead: one grid, four typographic behaviours and a scripted composition step that made each ' +
        'artist’s poster distinct while keeping the festival unmistakably one thing.',
      problem:
        'The previous year’s campaign was forty unrelated posters made by whoever was available. Nothing accumulated — the ' +
        'festival spent a month of volunteer effort and ended with no recognisable identity, and the print programme had to be redrawn from scratch.',
      problemPoints: [
        'Forty artists with wildly different disciplines, and only text and one photograph each as input.',
        'A two-person volunteer production team with no design software experience.',
        'Print, large-format and social output required from the same source, on a two-week production window.',
      ],
      approach:
        'Design a constraint, not a poster. A fixed grid with a typographic hierarchy that responds to the *length* of the ' +
        'artist’s name and discipline, a rule set for how the accent block moves, and a scripted layout pass so a volunteer ' +
        'could generate a compliant poster from a spreadsheet row.',
      approachPoints: [
        'One 8-column grid used at three output ratios — A2 print, 4:5 social, 16:9 screen.',
        'Four typographic behaviours triggered by name length, so long and short names both fill the plate confidently.',
        'A single accent block whose position derives from the artist’s slot number — deterministic, so the wall of forty reads as a sequence.',
        'A Python + SVG generation step producing print-ready output from the festival’s existing spreadsheet.',
      ],
      process: [
        {
          title: '01 — Typographic study',
          body:
            'Two weeks setting the same twelve names in eight configurations to find the behaviours that survived both a ' +
            'two-word and a six-word artist name. The system’s rules came out of that study rather than a moodboard.',
        },
        {
          title: '02 — The grid as the identity',
          body:
            'The festival mark is almost incidental; recognition comes from the grid, the accent block and one typeface pairing. ' +
            'That was deliberate — a system is cheaper to keep consistent than a logo is to police.',
        },
        {
          title: '03 — Scripting the composition',
          body:
            'A small Python tool renders SVG from the artist spreadsheet, applying the behaviour rules and exporting print ' +
            'and social variants. Volunteers ran it themselves; I reviewed a contact sheet of all forty in one pass.',
        },
        {
          title: '04 — Print production',
          body:
            'Two-colour risograph for the artist posters, offset for the programme. Overprint tested on paper stock before ' +
            'the palette was final — the accent shifts noticeably on uncoated stock and the digital colour was adjusted to match the print, not the reverse.',
        },
      ],
      stack: [
        { group: 'Design', items: ['Illustrator', 'InDesign', 'Figma', 'Risograph proofing'] },
        { group: 'Generation', items: ['Python', 'SVG templating', 'Contact-sheet review', 'Spreadsheet as source'] },
        { group: 'Output', items: ['A2 posters ×40', 'Print programme (48pp)', 'Wayfinding', 'Social kit'] },
      ],
      results: [
        { label: 'Posters produced', value: '40', note: 'All distinct, all compliant' },
        { label: 'Design time per poster', value: '~4 min', note: 'From roughly 3 hours' },
        { label: 'Produced by', value: '2 volunteers', note: 'Without design software experience' },
        { label: 'Reuse', value: '2nd year', note: 'System re-ran with a new palette and 46 artists' },
      ],
      resultsNarrative:
        'The festival got forty posters in a week and, for the first time, an identity that accumulated — the wall of ' +
        'posters read as a single sequence. It ran again the following year with a new palette and six more artists, ' +
        'without me touching it.',
      challenges: [
        {
          title: 'Generative systems produce ugly outliers',
          body:
            'About one in seven generated compositions was weak — usually a very long name colliding with the accent block. ' +
            'Rather than add rules indefinitely, I built a contact-sheet review step and left three manual overrides in the ' +
            'system. Knowing where to stop automating was the actual design decision.',
        },
        {
          title: 'Colour that survives risograph',
          body:
            'The first accent was beautiful on screen and muddy in ink. I re-picked the palette from printed swatches on the ' +
            'actual stock and let the digital versions inherit from print — the opposite of the usual direction, and the ' +
            'right one when the primary artefact is physical.',
        },
      ],
      outcome:
        'Two festival editions, eighty-six posters and a system a volunteer team runs. It is also the clearest example I ' +
        'have of the thing I actually do: design a rule, then write the code that applies it.',
      gallery: [
        { caption: 'Contact sheet — forty artist posters, one grid.', ratio: '16 / 10' },
        { caption: 'Typographic behaviours: the same plate at four name lengths.', ratio: '4 / 3' },
        { caption: 'Print programme, 48 pages, two-colour.', ratio: '4 / 3' },
        { caption: 'Wayfinding and social adaptations from the same source.', ratio: '16 / 10' },
      ],
    },
  },
]
