/**
 * Single source of truth for identity, navigation and contact details.
 * Edit this file first — every header, footer and meta tag reads from it.
 */

export const site = {
  name: 'Brian Mungai',
  shortName: 'Mungai',
  initials: 'BM',
  role: 'Software Engineer, Data Scientist & Creative Designer',
  disciplines: ['Software Engineering', 'Data Science', 'Artificial Intelligence', 'Visual Design'],
  location: 'Nairobi, Kenya',
  timezone: 'EAT · GMT+3',
  availability: 'Available for select work — 2026',
  email: 'hello@brianmungai.com',
  url: 'https://brianmungai.com',
  tagline: 'I design the identity, engineer the product, model the data and build the intelligent systems around it.',
  bio:
    'I build digital products, intelligent systems, data-driven experiences and visual identities. ' +
    'Most of my work sits in the overlap: an interface that has to survive a model’s uncertainty, ' +
    'a dashboard that has to earn a decision, a brand that has to hold together across a product surface.',
  since: 2019,

  /**
   * The portrait photograph, used in the hero and on the about page.
   *
   * `src` is served straight from `public/`, and the image is rendered
   * unmodified — no filters, crops of the face, or generated substitutes.
   * `ratio` is the shape of the frame and `objectPosition` decides which part
   * of the photograph survives when the frame is a different shape than the
   * file — see the note on the values below.
   */
  portrait: {
    src: '/portrait.jpg',
    alt: 'Brian Mungai, photographed against a dark background.',
    /**
     * The file is 390×640 (ratio 0.61). A 4/5 frame crops 24% of the height,
     * and `center 70%` takes almost all of that from the empty black space
     * above the head — which lands the eyes at 42% of the frame with clean
     * headroom, and keeps the shoulders. For no crop at all, set the ratio to
     * '39 / 64' and the position to 'center'.
     */
    ratio: '4 / 5',
    objectPosition: 'center 70%',
    width: 390,
    height: 640,
  },
} as const

export const socials = [
  { label: 'GitHub', handle: '@brianmungai', href: 'https://github.com/brianmungai' },
  { label: 'LinkedIn', handle: 'in/brianmungai', href: 'https://www.linkedin.com/in/brianmungai' },
  { label: 'X / Twitter', handle: '@brianmungai', href: 'https://x.com/brianmungai' },
  { label: 'Dribbble', handle: '@brianmungai', href: 'https://dribbble.com/brianmungai' },
  { label: 'Read.cv', handle: 'brianmungai', href: 'https://read.cv/brianmungai' },
] as const

/** Primary navigation — kept deliberately short. */
export const primaryNav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Writing', to: '/writing' },
  { label: 'Contact', to: '/contact' },
] as const

/** Secondary rail, exposed in the mobile menu and the footer. */
export const disciplineNav = [
  { label: 'Engineering', to: '/engineering', note: 'Products, APIs, architecture' },
  { label: 'Data Science', to: '/data-science', note: 'Models, analysis, decisions' },
  { label: 'Design', to: '/design', note: 'Identity, editorial, artefacts' },
] as const

export const stats = [
  { value: '6', suffix: 'yrs', label: 'Building for the web' },
  { value: '40', suffix: '+', label: 'Products & case studies shipped' },
  { value: '12', suffix: '', label: 'Models moved into production' },
  { value: '25', suffix: '+', label: 'Identity & editorial systems' },
] as const

/** Short narrative used on the home page and the about page intro. */
export const story = [
  'I started with a sketchbook and a stolen copy of Photoshop, learned to draw a grid, then learned that the grid was really a system — and that systems are what I actually care about.',
  'Engineering came next: React and TypeScript on the front, Django and FastAPI behind it, Postgres underneath. Then data, because the interesting questions in every product I shipped turned out to be measurement questions.',
  'Today I work across all three. I can run the discovery, name the thing, design its identity, build the product, instrument it, model what it produces — and then argue about what the numbers actually mean.',
] as const

export const services = [
  {
    id: 'product',
    title: 'Product engineering',
    body: 'Full-stack products with a designed front end and a defensible back end — typed React, Python or Node services, Postgres, auth, CI, deployment.',
    deliverables: ['Web apps & dashboards', 'API & schema design', 'Auth & permissions', 'CI/CD & observability'],
  },
  {
    id: 'intelligence',
    title: 'Data & intelligence',
    body: 'From messy CSVs to a decision. Analysis, feature work, predictive and clustering models, evaluation you can trust, and interfaces that expose uncertainty honestly.',
    deliverables: ['Exploratory analysis', 'Predictive & clustering models', 'LLM/RAG systems', 'Power BI & custom dashboards'],
  },
  {
    id: 'identity',
    title: 'Identity & art direction',
    body: 'Visual systems that survive contact with a real product: wordmarks, type systems, colour, layout grids, campaign artefacts and the documentation to keep them consistent.',
    deliverables: ['Logo & wordmark', 'Type & colour system', 'Editorial & poster work', 'Brand guidelines'],
  },
] as const

export const clientsAndContexts = [
  'Fintech',
  'Logistics',
  'Health',
  'Agriculture',
  'Civic tech',
  'Education',
  'Independent studios',
] as const
