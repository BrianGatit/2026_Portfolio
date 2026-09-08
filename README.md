# Brian Mungai — portfolio

A multidisciplinary portfolio: software engineering, data science, AI and visual design in one editorial
system. React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion 13.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the built site
npm run typecheck  # tsc only
npm run smoke      # render every route and check for errors
```

---

## Editing content

**All content lives in `src/data`. You should not need to touch a component to publish something.**

| File | What it holds |
|---|---|
| `data/site.ts` | **Start here.** Name, role, email, location, socials, navigation, stats, services, story. |
| `data/projects/engineering.ts` | Engineering case studies |
| `data/projects/science.ts` | Data-science and AI case studies (including chart data) |
| `data/projects/design.ts` | Design case studies |
| `data/projects/index.ts` | Reading order and the layout span of each card in the work mosaic |
| `data/design.ts` | Graphic-design gallery pieces |
| `data/writing.ts` | Articles, including their body blocks |
| `data/skills.ts` | Skill groups and the tool marquee |

Everything is typed against `src/types/index.ts`, so a missing field is a build error rather than a blank
space on the page.

### Your name and details

`src/data/site.ts` is the single source of truth. Change `site.name`, `site.initials`, `site.email` and
`socials` and it updates the navigation, footer, contact page, structured data and every meta tag. Also
update the hard-coded fallbacks in `index.html` (`<title>`, the Open Graph tags and the JSON-LD block),
since those are what a crawler sees before JavaScript runs.

The email address, domain and social handles are still placeholders built from the name
(`hello@brianmungai.com`, `github.com/brianmungai`, …) — replace them with the real ones.

### The portrait

`public/portrait.jpg` is the photograph, used in the hero and on the about page via
`src/components/visual/Portrait.tsx`. It is rendered unmodified — no filters, no duotone, no generated
substitute — and the only adjustable parts are the frame and the crop, both in `site.portrait`:

```ts
ratio: '4 / 5',                 // frame shape; '39 / 64' matches the file exactly (no crop)
objectPosition: 'center 70%',   // which part survives the crop; higher % keeps more of the top
```

To swap the photograph, overwrite `public/portrait.jpg` and update `width`/`height` to the new file's
dimensions. The current file is 390×640, which is fine on a standard display but soft on a high-DPI screen
in the hero slot — if you have a larger original (1200px wide or more), use that instead.

### Adding a project

Add an object to the relevant file in `data/projects/`, then add its slug to the `mosaic` array in
`data/projects/index.ts` with the span you want it to claim:

```ts
const mosaic: [slug: string, span: CardSpan][] = [
  ['your-new-project', 'wide'],   // 8 of 12 columns
  ['another-project', 'tall'],    // 4 of 12 columns
]
```

Keep each row summing to 12 (`full` · `wide + tall` · `half + half`) and the mosaic stays tidy.

A project with a `study.analysis` block renders the data-science treatment: dataset, questions, method, live
charts, findings, conclusion. A project with `study.architecture` renders the architecture diagram. Both are
optional — omit them and those sections simply do not appear, and the section numbering adjusts.

### Adding images

Every image slot falls back to a generated, seeded visual so the layout is never broken or grey. To use a
real asset:

1. Drop the file in `public/` (e.g. `public/work/atlas-board.webp`, or `public/design/` for gallery pieces).
2. Set `cover: '/work/atlas-board.webp'` on the project, or `image: '…'` on a design piece.

Nothing else changes — the frame, aspect ratio, lazy loading and hover behaviour are already in place. Export
at roughly 2000px wide, and prefer WebP or AVIF.

For a design piece, set `ratio` to the file's own pixel dimensions (`ratio: '1080 / 1350'`) so it is shown
uncropped, and write `alt` describing what the piece *says* — these layouts carry their meaning in type, and
`"poster, 2026"` tells a screen reader nothing.

### Charts

Charts are hand-built SVG (no charting dependency) and are declared as data:

```ts
{
  kind: 'columns',
  title: 'Churn is concentrated in the first quarter of life',
  subtitle: '90-day churn rate by tenure cohort',
  unit: '%',
  source: 'n = 138,400 accounts',
  data: [{ label: '0–3 mo', value: 31.4, emphasis: true }, …],
}
```

`kind` may be `line`, `bars`, `columns` or `scatter`. Charts can also be embedded in an article body with
`{ type: 'chart', chart: { … } }`.

---

## The design system

`src/index.css` holds the whole visual language: palette, type scale, spacing rails and the handful of
component classes (`u-shell`, `u-eyebrow`, `u-clip`, `u-link`, `u-grain`).

- **Colour.** Two hand-picked modes rather than one inverted into the other. The accent has a per-mode step
  so it clears WCAG AA as text in both (4.69:1 on paper, 6.36:1 on ink). Chart series use four fixed
  categorical slots, validated for colour-vision deficiency separation and contrast against both surfaces —
  in fixed order, never cycled. Scatter plots are capped at three groups because every pair of colours is
  visible at once in that form.
- **Type.** Space Grotesk (display), Inter (body and all chart text), Instrument Serif (italic editorial
  accents), JetBrains Mono (labels and code). The fluid scale is bounded so the longest line in each role
  still fits its column at 1440px.
- **Motion.** One vocabulary in `src/utils/motion.ts`. `MotionConfig reducedMotion="user"` strips transforms
  for visitors who ask for reduced motion, and the stylesheet disables CSS animation for them too.

To re-brand: change the `--accent` steps in `:root` and `.dark`, and the four font families in the `@theme`
block. Nothing else references a colour directly.

---

## Architecture

```
src/
  components/
    charts/       hand-built SVG charts + the frame, legend and table view
    content/      long-form block renderer (articles, case-study prose)
    design/       masonry gallery + lightbox
    layout/       navbar, mobile menu, footer, page shell, routing
    project/      project card, grid, case-study template, metrics, architecture diagram
    skills/       skill groups
    ui/           primitives: MagneticButton, AnimatedText, SectionHeading, Reveal, Tag, ThemeToggle, Cursor
    visual/       generated cover art and media frames
  data/           all content
  hooks/          theme, SEO, media queries, scroll lock
  pages/          one file per route
  types/          the content model
  utils/          class merging, formatting, seeded randomness, motion tokens
```

Only the home page is in the initial bundle; every other route is code-split.

### Testing

`npm run smoke` renders all 24 routes through Vite's SSR loader — pages imported directly rather than
lazily, so nothing resolves to a Suspense fallback — and fails if a route throws, comes back suspiciously
short, or leaks `undefined`/`NaN` into the markup. Run it after editing data.

---

## Accessibility & SEO notes

- Semantic landmarks, one `h1` per page, ordered headings, a skip link, visible focus rings on the accent.
- Charts carry `role="img"` with a label, and every chart has a table view — the numbers are never
  colour-only or image-only.
- The custom cursor is an accent on top of the native pointer, not a replacement for it, and is disabled on
  touch devices and under reduced-motion.
- Per-route `<title>`, description, canonical and Open Graph tags are set by `useSeo`.

**Two things to finish before launch:**

1. `public/og-image.svg` is a vector placeholder. Most social platforms will not render SVG previews —
   export it to `og-image.png` at 1200×630 and update the `og:image` / `twitter:image` tags in `index.html`.
2. Replace `https://brianmungai.com` in `index.html`, `data/site.ts`, `public/robots.txt` and
   `public/sitemap.xml` with the real domain.

## Deploying

The build output in `dist/` is static. On any host, add a rewrite so client-side routes resolve:

- **Vercel** — `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- **Netlify** — `_redirects`: `/* /index.html 200`
- **Nginx** — `try_files $uri $uri/ /index.html;`

Without it, a deep link such as `/work/atlas-freight-os` will 404 on refresh.
#   2 0 2 6 _ P o r t f o l i o  
 #   2 0 2 6 _ P o r t f o l i o  
 