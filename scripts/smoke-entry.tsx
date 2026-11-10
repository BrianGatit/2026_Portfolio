import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { ThemeProvider } from '@/hooks/useTheme'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Work from '@/pages/Work'
import WorkDetail from '@/pages/WorkDetail'
import Engineering from '@/pages/Engineering'
import DataScience from '@/pages/DataScience'
import Design from '@/pages/Design'
import Writing from '@/pages/Writing'
import ArticleDetail from '@/pages/ArticleDetail'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { allProjects } from '@/data/projects'
import { articles } from '@/data/writing'

/**
 * Render smoke test.
 *
 * Pages are imported directly rather than through the lazy router, so every
 * page is really rendered rather than resolving to a Suspense fallback. This
 * catches the class of bug a typechecker cannot see: an index that is out of
 * range, a `.find()` that returns nothing, a chart with an empty series.
 */

interface Case {
  /** The URL that is visited. */
  path: string
  /** The route pattern to register, so `useParams` resolves as it does in the app. */
  pattern: string
  element: ReactElement
  /** Text that must appear in the output — proves the right page rendered. */
  expect: string
  /** Extra structural assertions for pages with moving parts. */
  mustInclude?: string[]
}

function render(testCase: Case) {
  return renderToString(
    <ThemeProvider>
      <MemoryRouter initialEntries={[testCase.path]}>
        <Navbar />
        <Routes>
          <Route path={testCase.pattern} element={testCase.element} />
        </Routes>
        <Footer />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

export function runSmoke() {
  const cases: Case[] = [
    {
      path: '/',
      pattern: '/',
      element: <Home />,
      expect: 'CREATIVE DEVELOPER',
      // The hero headline is split into letters and its roles rotate, so
      // assert the one accessible sentence is intact, every role reserves its
      // slot, and words cannot break mid-letter.
      mustInclude: [
        'Brian Mungai — Software Engineer, Creative Developer, Data Scientist and Graphic Designer',
        'DATA SCIENTIST',
        'GRAPHIC DESIGNER',
        'u-signature-rule',
        'whitespace-nowrap',
      ],
    },
    { path: '/about', pattern: '/about', element: <About />, expect: 'Trajectory' },
    { path: '/work', pattern: '/work', element: <Work />, expect: 'four disciplines' },
    { path: '/engineering', pattern: '/engineering', element: <Engineering />, expect: 'Architecture' },
    { path: '/data-science', pattern: '/data-science', element: <DataScience />, expect: 'Leading question' },
    {
      path: '/design',
      pattern: '/design',
      element: <Design />,
      expect: 'Selected pieces',
      // The real design files and their descriptive alt text, the separated
      // layers of a flat file, and a live recreation's own type.
      mustInclude: [
        '/design/munga/brand-board.jpg',
        '/design/clients/kachiliba-emblem.jpg',
        '/design/munga/bottle-range.jpg',
        'dm-cut-wipe',
        'Where refinement meets risk.',
        '/design/munga/mural.jpg',
        'The hidden M',
        '20° = refinement',
      ],
    },
    { path: '/writing', pattern: '/writing', element: <Writing />, expect: 'min read' },
    { path: '/contact', pattern: '/contact', element: <Contact />, expect: 'Start a conversation' },
    { path: '/nope', pattern: '/nope', element: <NotFound />, expect: 'Error 404' },
    ...allProjects.map((project) => ({
      path: `/work/${project.slug}`,
      pattern: '/work/:slug',
      element: <WorkDetail />,
      // Present on every case study, absent from the 404 page.
      expect: 'The problem',
    })),
    ...articles.map((article) => ({
      path: `/writing/${article.slug}`,
      pattern: '/writing/:slug',
      element: <ArticleDetail />,
      expect: 'Keep reading',
    })),
  ]

  return cases.map((testCase) => {
    try {
      const html = render(testCase)
      const notes: string[] = []
      if (!html.includes(testCase.expect)) notes.push(`missing expected content: "${testCase.expect}"`)
      for (const fragment of testCase.mustInclude ?? []) {
        if (!html.includes(fragment)) notes.push(`missing: "${fragment}"`)
      }
      if (html.length < 8000) notes.push(`suspiciously short (${html.length} bytes)`)
      if (html.includes('undefined')) notes.push('contains the literal string "undefined"')
      if (html.includes('NaN')) notes.push('contains the literal string "NaN"')
      return { path: testCase.path, ok: notes.length === 0, bytes: html.length, notes }
    } catch (error) {
      return {
        path: testCase.path,
        ok: false,
        bytes: 0,
        notes: [`threw: ${error instanceof Error ? error.message : String(error)}`],
      }
    }
  })
}
