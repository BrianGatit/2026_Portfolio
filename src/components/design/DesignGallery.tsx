import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import type { DesignPiece } from '@/types'
import { cn } from '@/utils/cn'
import { DesignVisual } from '@/components/visual/DesignVisual'
import { ArrowLeft, ArrowRight, Close } from '@/components/ui/Icons'
import { useEscapeKey, useLockScroll } from '@/hooks/useUi'
import { easeEditorial } from '@/utils/motion'
import { DesignMotion, motionLabels, ratioOf } from './DesignMotion'

/**
 * Entrance delay for a gallery cell: a short left-to-right cascade across the
 * three columns, capped so a long list never makes anyone wait.
 */
function cascade(index: number, total: number) {
  return total > 1 ? Math.min(index, 5) * 0.06 : 0
}

/** Previous/next in the larger view crossfade rather than snap. */
const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeEditorial } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
}

const labelOf = (piece: DesignPiece) => motionLabels[piece.motion?.kind ?? 'product']

/**
 * Masonry gallery for graphic work, every piece in motion.
 *
 * CSS multi-column keeps the layout genuinely editorial — pieces keep their own
 * aspect ratios instead of being cropped into a uniform grid — and it needs no
 * measurement pass, so nothing reflows after paint.
 *
 * Each card plays its own treatment only while it is on screen (and not behind
 * the open lightbox), so a long gallery costs no more than what is visible.
 * Selecting one opens a larger presentation that replays it from the start,
 * with pause, replay and previous/next.
 */
export function DesignGallery({ pieces, className }: { pieces: DesignPiece[]; className?: string }) {
  const reduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  // Bumped to replay: the presentation is keyed on it, so it starts over.
  const [take, setTake] = useState(0)
  // Live recreations can be compared with the original file they rebuild.
  const [original, setOriginal] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  const open = useCallback((index: number) => {
    setOpenIndex(index)
    setPaused(false)
    setOriginal(false)
    setTake((current) => current + 1)
  }, [])
  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (by: number) => {
      if (openIndex === null) return
      open((openIndex + by + pieces.length) % pieces.length)
    },
    [open, openIndex, pieces.length],
  )

  useEscapeKey(openIndex !== null, close)
  useLockScroll(openIndex !== null)

  // Arrow keys page through the presentation.
  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, step])

  // Move focus into the dialog so keyboard users are not left behind it.
  const isOpen = openIndex !== null
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  const active = openIndex === null ? null : pieces[openIndex]

  return (
    <>
      {/* Keyed on the visible set, so a filter change replays the cascade
          instead of leaving survivors still and newcomers popping in. */}
      <div
        key={pieces.map((piece) => piece.slug).join()}
        className={cn('columns-1 gap-8 sm:columns-2 lg:columns-3 lg:gap-10', className)}
      >
        {pieces.map((piece, index) => (
          <GalleryCell
            key={piece.slug}
            piece={piece}
            delay={cascade(index, pieces.length)}
            suspended={isOpen}
            onOpen={() => open(index)}
          />
        ))}
      </div>

      {/* ---------- presentation ---------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-page/96 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — presentation`}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.5, ease: easeEditorial }}
              className="flex max-h-full w-full max-w-7xl flex-col gap-6 overflow-y-auto lg:flex-row lg:items-center lg:gap-12"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Width-driven on small screens; from `lg` up, sized by whichever
                  binds first — the column or the viewport height — so a tall
                  poster and a wide mural both fit without a scroll. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.slug}
                  {...swap}
                  className="relative w-full shrink-0 overflow-hidden border border-line lg:w-[min(64vw,calc(80vh*var(--ratio)))]"
                  style={{ aspectRatio: active.ratio, '--ratio': ratioOf(active.ratio) } as CSSProperties}
                >
                  {active.image && original ? (
                    <img src={active.image} alt={active.alt ?? active.title} className="absolute inset-0 size-full object-cover" />
                  ) : active.image ? (
                    <DesignMotion key={take} piece={active} playing={!paused} stage />
                  ) : (
                    <DesignVisual piece={active} />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex min-w-0 flex-1 flex-col gap-6 pb-6 lg:pb-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={active.slug} {...swap} className="flex flex-col gap-6">
                    <div>
                      <p className="u-eyebrow text-accent">{active.category}</p>
                      <h2 className="mt-4 font-display text-heading font-medium text-ink">{active.title}</h2>
                      <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.7] text-ink-secondary">{active.note}</p>
                    </div>

                    <dl className="flex flex-col border-t border-line">
                      {[
                        { label: 'Role', value: active.role },
                        { label: 'Tools', value: active.tools.join(', ') },
                        { label: 'Year', value: active.year },
                        { label: 'Motion', value: active.image ? labelOf(active) : '' },
                      ]
                        .filter((row) => row.value)
                        .map((row) => (
                          <div key={row.label} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-3">
                            <dt className="u-eyebrow pt-0.5 text-ink-muted">{row.label}</dt>
                            <dd className="text-[0.875rem] text-ink-secondary">{row.value}</dd>
                          </div>
                        ))}
                    </dl>
                  </motion.div>
                </AnimatePresence>

                {/* playback */}
                {reduceMotion ? (
                  <p className="u-eyebrow text-ink-faint">Reduced motion is on — shown still</p>
                ) : (
                  <div className="flex items-center gap-2" role="group" aria-label="Playback">
                    <button
                      type="button"
                      onClick={() => setPaused((current) => !current)}
                      aria-pressed={paused}
                      className="u-eyebrow flex items-center gap-2.5 border border-line px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <PlaybackIcon paused={paused} />
                      {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaused(false)
                        setTake((current) => current + 1)
                      }}
                      className="u-eyebrow flex items-center gap-2.5 border border-line px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <ReplayIcon />
                      Replay
                    </button>
                    {active.motion?.kind === 'live' && (
                      <button
                        type="button"
                        onClick={() => {
                          setOriginal((current) => !current)
                          setPaused(false)
                          setTake((current) => current + 1)
                        }}
                        aria-pressed={original}
                        className="u-eyebrow ml-auto border border-line px-4 py-2.5 text-ink-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        {original ? 'Live version' : 'Original file'}
                      </button>
                    )}
                  </div>
                )}

                {/* navigation */}
                <div className="flex items-center gap-2 border-t border-line pt-6">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous piece"
                    className="grid size-11 place-items-center border border-line text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next piece"
                    className="grid size-11 place-items-center border border-line text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <ArrowRight />
                  </button>
                  <span className="u-eyebrow ml-3 min-w-0 truncate text-ink-muted">
                    Next — {pieces[((openIndex ?? 0) + 1) % pieces.length].title}
                  </span>
                  <span className="u-eyebrow ml-auto shrink-0 text-ink-faint u-tabular">
                    {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close presentation"
              className="fixed top-5 right-5 grid size-11 place-items-center border border-line bg-page text-ink transition-colors hover:border-accent hover:text-accent md:top-8 md:right-8"
            >
              <Close className="text-[1.1rem]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * One piece in the wall. Its treatment waits, paused on its first frame, until
 * the card is properly on screen — so the entrance is actually seen — and
 * pauses again whenever it scrolls away or the presentation covers it.
 */
function GalleryCell({
  piece,
  delay,
  suspended,
  onOpen,
}: {
  piece: DesignPiece
  delay: number
  suspended: boolean
  onOpen: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef, { amount: 0.35 })

  return (
    <motion.figure
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: easeEditorial, delay }}
      className="group mb-8 break-inside-avoid lg:mb-10"
    >
      {/* Only the media is the button — a figcaption is not valid inside
          one, and it has to stay a direct child of the figure. */}
      <button
        type="button"
        onClick={onOpen}
        className="block w-full cursor-pointer text-left"
        aria-label={`${piece.title} — ${piece.category}, ${piece.year}. Open presentation.`}
      >
        <div
          ref={frameRef}
          className="relative w-full overflow-hidden border border-line transition-colors duration-500 group-hover:border-line-strong"
          style={{ aspectRatio: piece.ratio }}
          data-cursor="Play piece"
        >
          {piece.image ? (
            <DesignMotion piece={piece} playing={inView && !suspended} />
          ) : (
            <DesignVisual piece={piece} />
          )}
        </div>
      </button>

      <figcaption className="mt-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-ink transition-colors duration-500 group-hover:text-accent">
              {piece.title}
            </h3>
            <p className="u-eyebrow mt-2">
              {piece.category}
              {piece.image && <span className="text-ink-faint"> · {labelOf(piece)}</span>}
            </p>
          </div>
          <span className="u-eyebrow shrink-0 text-ink-faint u-tabular">{piece.year}</span>
        </div>

        {/* Tools stay visible rather than hiding behind hover — there is
            no hover on a touch device, and the toolchain is part of the
            credit, not a reward for pointing at the image. */}
        {piece.tools.length > 0 && (
          <p className="mt-3 border-t border-line pt-3 font-mono text-[0.63rem] leading-relaxed tracking-[0.08em] text-ink-muted uppercase">
            {piece.tools.join(' · ')}
          </p>
        )}
      </figcaption>
    </motion.figure>
  )
}

const PlaybackIcon = ({ paused }: { paused: boolean }) => (
  <svg aria-hidden viewBox="0 0 12 12" className="size-3 fill-current">
    {paused ? <path d="M2.5 1.5v9l8-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
  </svg>
)

const ReplayIcon = () => (
  <svg aria-hidden viewBox="0 0 12 12" className="size-3 fill-none stroke-current" strokeWidth="1.4">
    <path d="M2.2 4.2A4.2 4.2 0 1 1 1.8 7" />
    <path d="M1.8 1.6v2.8h2.8" />
  </svg>
)
