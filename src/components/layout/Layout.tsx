import { Suspense, lazy, useEffect, type ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition, ScrollMemory } from './PageTransition'
import { Ambient, Grain, ScrollProgress } from '@/components/ui/Chrome'
import { Cursor } from '@/components/ui/Cursor'
import Home from '@/pages/Home'

/**
 * Everything except the home page is code-split: the case-study and article
 * pages carry the bulk of the content, and a visitor who lands on the home
 * page should not download them.
 */
type PageModule = { default: ComponentType }

/**
 * `React.lazy` suspends on first render even when the chunk has already been
 * fetched, and React then holds the fallback for a beat. Once a preload has
 * settled, render the component directly so the transition never sees it.
 */
function lazyPage(load: () => Promise<PageModule>) {
  let Loaded: ComponentType | null = null
  const preload = () =>
    load().then((module) => {
      Loaded = module.default
      return module
    })
  const Lazy = lazy(preload)

  function Page() {
    return Loaded ? <Loaded /> : <Lazy />
  }
  return Object.assign(Page, { preload })
}

const About = lazyPage(() => import('@/pages/About'))
const Work = lazyPage(() => import('@/pages/Work'))
const WorkDetail = lazyPage(() => import('@/pages/WorkDetail'))
const Engineering = lazyPage(() => import('@/pages/Engineering'))
const DataScience = lazyPage(() => import('@/pages/DataScience'))
const Design = lazyPage(() => import('@/pages/Design'))
const Writing = lazyPage(() => import('@/pages/Writing'))
const ArticleDetail = lazyPage(() => import('@/pages/ArticleDetail'))
const Contact = lazyPage(() => import('@/pages/Contact'))
const NotFound = lazyPage(() => import('@/pages/NotFound'))

function pageFor(pathname: string) {
  const [first, second] = pathname.split('/').filter(Boolean)
  switch (first) {
    case undefined:
      return null
    case 'about':
      return About
    case 'work':
      return second ? WorkDetail : Work
    case 'engineering':
      return Engineering
    case 'data-science':
      return DataScience
    case 'design':
      return Design
    case 'writing':
      return second ? ArticleDetail : Writing
    case 'contact':
      return Contact
    default:
      return NotFound
  }
}

/**
 * Fetches a page's chunk on hover, focus or touch of a link to it. By the time
 * the click lands it is usually ready, so the route transition plays straight
 * through instead of pausing on a blank fallback.
 */
function usePreloadOnIntent() {
  useEffect(() => {
    const seen = new Set<string>()
    function onIntent(event: Event) {
      const link = (event.target as Element | null)?.closest?.('a[href^="/"]')
      if (!link) return
      const { pathname } = new URL((link as HTMLAnchorElement).href)
      if (seen.has(pathname)) return
      seen.add(pathname)
      pageFor(pathname)?.preload().catch(() => seen.delete(pathname))
    }
    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent)
    document.addEventListener('touchstart', onIntent, { passive: true })
    return () => {
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
      document.removeEventListener('touchstart', onIntent)
    }
  }, [])
}

/** Holds the viewport height while a lazy page resolves, so nothing jumps. */
function RouteFallback() {
  return <div className="min-h-[80vh]" aria-hidden />
}

export function Layout() {
  const location = useLocation()
  usePreloadOnIntent()

  return (
    <>
      <a href="#main" className="u-skip">
        Skip to content
      </a>

      <Ambient />
      <ScrollProgress />
      <Grain />
      <Cursor />
      <ScrollMemory />
      <Navbar />

      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/work"
                element={
                  <PageTransition>
                    <Work />
                  </PageTransition>
                }
              />
              <Route
                path="/work/:slug"
                element={
                  <PageTransition>
                    <WorkDetail />
                  </PageTransition>
                }
              />
              <Route
                path="/engineering"
                element={
                  <PageTransition>
                    <Engineering />
                  </PageTransition>
                }
              />
              <Route
                path="/data-science"
                element={
                  <PageTransition>
                    <DataScience />
                  </PageTransition>
                }
              />
              <Route
                path="/design"
                element={
                  <PageTransition>
                    <Design />
                  </PageTransition>
                }
              />
              <Route
                path="/writing"
                element={
                  <PageTransition>
                    <Writing />
                  </PageTransition>
                }
              />
              <Route
                path="/writing/:slug"
                element={
                  <PageTransition>
                    <ArticleDetail />
                  </PageTransition>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageTransition>
                    <Contact />
                  </PageTransition>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
