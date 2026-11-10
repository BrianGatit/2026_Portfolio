import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { motion } from 'motion/react'
import { pageTransition } from '@/utils/motion'

/**
 * Scroll positions per history entry, so back/forward (and a refresh) land
 * where the visitor left off. Kept in sessionStorage because `location.key`
 * survives a reload but this module does not.
 */
const STORAGE_KEY = 'scroll-positions'
const positions = new Map<string, number>(readPositions())

/** The history entry whose page is on screen — not the one being navigated to. */
let displayedKey: string | null = null
let firstKey: string | null = null

function readPositions(): [string, number][] {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

/**
 * Route-level entrance and exit. Deliberately understated — a long fade or a
 * slide across the whole page makes navigation feel slow, and this site has a
 * lot of pages to move between.
 *
 * Scroll is placed here, on mount, rather than on location change: with
 * `AnimatePresence mode="wait"` the old page is still fading out when the URL
 * changes, and scrolling then makes it jump. Mounting also happens after a
 * lazy page has resolved, so a restored position has its full height to land in.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Runs once per page: the route key remounts this component.
  useLayoutEffect(() => {
    displayedKey = location.key
    firstKey ??= location.key

    const anchor = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
    const saved = navigationType === 'POP' ? positions.get(location.key) : undefined

    if (anchor) anchor.scrollIntoView()
    else window.scrollTo({ top: saved ?? 0, left: 0, behavior: 'instant' as ScrollBehavior })

    // The link that was activated went out with the old page; rather than
    // leave keyboard and screen-reader focus on <body>, start it at the content.
    const active = document.activeElement
    if (location.key !== firstKey && (!active || active === document.body || !active.isConnected)) {
      document.getElementById('main')?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

/** Records the scroll position of the page on screen, for back/forward. */
export function ScrollMemory() {
  const { key } = useLocation()

  // Snapshot the outgoing page the moment the URL changes, then stop
  // recording: as it unmounts the document shrinks and the browser clamps
  // scroll, which must not overwrite the position the visitor actually left.
  useLayoutEffect(() => {
    if (displayedKey && displayedKey !== key) {
      positions.set(displayedKey, window.scrollY)
      displayedKey = null
    }
  }, [key])

  useEffect(() => {
    const previous = history.scrollRestoration
    // The browser would restore mid-exit-animation, against the old page.
    history.scrollRestoration = 'manual'

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (displayedKey) positions.set(displayedKey, window.scrollY)
      })
    }
    const persist = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...positions].slice(-50)))
      } catch {
        // Storage can be unavailable (private mode, quota); memory still works.
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', persist)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', persist)
      if (frame) cancelAnimationFrame(frame)
      history.scrollRestoration = previous
    }
  }, [])

  return null
}
