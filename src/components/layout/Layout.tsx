import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition, ScrollToTop } from './PageTransition'
import { Grain, ScrollProgress } from '@/components/ui/Chrome'
import { Cursor } from '@/components/ui/Cursor'
import Home from '@/pages/Home'

/**
 * Everything except the home page is code-split: the case-study and article
 * pages carry the bulk of the content, and a visitor who lands on the home
 * page should not download them.
 */
const About = lazy(() => import('@/pages/About'))
const Work = lazy(() => import('@/pages/Work'))
const WorkDetail = lazy(() => import('@/pages/WorkDetail'))
const Engineering = lazy(() => import('@/pages/Engineering'))
const DataScience = lazy(() => import('@/pages/DataScience'))
const Design = lazy(() => import('@/pages/Design'))
const Writing = lazy(() => import('@/pages/Writing'))
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Holds the viewport height while a lazy page resolves, so nothing jumps. */
function RouteFallback() {
  return <div className="min-h-[80vh]" aria-hidden />
}

export function Layout() {
  const location = useLocation()

  return (
    <>
      <a href="#main" className="u-skip">
        Skip to content
      </a>

      <ScrollProgress />
      <Grain />
      <Cursor />
      <ScrollToTop />
      <Navbar />

      <main id="main">
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
