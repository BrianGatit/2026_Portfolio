import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { DesignPiece } from '@/types'
import { cn } from '@/utils/cn'
import { DesignVisual } from '@/components/visual/DesignVisual'
import { Close } from '@/components/ui/Icons'
import { useEscapeKey, useLockScroll } from '@/hooks/useUi'
import { easeEditorial } from '@/utils/motion'

/**
 * Masonry gallery for graphic work.
 *
 * CSS multi-column keeps the layout genuinely editorial — pieces keep their own
 * aspect ratios instead of being cropped into a uniform grid — and it needs no
 * measurement pass, so nothing reflows after paint.
 */
export function DesignGallery({ pieces, className }: { pieces: DesignPiece[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = useCallback(() => setOpenIndex(null), [])
  const closeRef = useRef<HTMLButtonElement>(null)

  useEscapeKey(openIndex !== null, close)
  useLockScroll(openIndex !== null)

  // Move focus into the dialog so keyboard users are not left behind it.
  useEffect(() => {
    if (openIndex !== null) closeRef.current?.focus()
  }, [openIndex])

  const active = openIndex === null ? null : pieces[openIndex]

  return (
    <>
      <div className={cn('columns-1 gap-8 sm:columns-2 lg:columns-3 lg:gap-10', className)}>
        {pieces.map((piece, index) => (
          <motion.figure
            key={piece.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: easeEditorial }}
            className="group mb-8 break-inside-avoid lg:mb-10"
          >
            {/* Only the media is the button — a figcaption is not valid inside
                one, and it has to stay a direct child of the figure. */}
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="block w-full cursor-pointer text-left"
              aria-label={`${piece.title} — ${piece.category}, ${piece.year}. Open larger view.`}
            >
              <div
                className="relative w-full overflow-hidden border border-line transition-colors duration-500 group-hover:border-line-strong"
                style={{ aspectRatio: piece.ratio }}
                data-cursor="View piece"
              >
                <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
                  {piece.image ? (
                    <img
                      src={piece.image}
                      alt={piece.alt ?? `${piece.title} — ${piece.category}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <DesignVisual piece={piece} />
                  )}
                </div>

              </div>
            </button>

            <figcaption className="mt-4">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-ink transition-colors duration-500 group-hover:text-accent">
                    {piece.title}
                  </h3>
                  <p className="u-eyebrow mt-2">{piece.category}</p>
                </div>
                <span className="u-eyebrow shrink-0 text-ink-faint u-tabular">{piece.year}</span>
              </div>

              {/* Tools stay visible rather than hiding behind hover — there is
                  no hover on a touch device, and the toolchain is part of the
                  credit, not a reward for pointing at the image. */}
              <p className="mt-3 border-t border-line pt-3 font-mono text-[0.63rem] leading-relaxed tracking-[0.08em] text-ink-muted uppercase">
                {piece.tools.join(' · ')}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* ---------- lightbox ---------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-page/96 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — larger view`}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.42, ease: easeEditorial }}
              className="flex max-h-full w-full max-w-6xl flex-col gap-6 overflow-y-auto lg:flex-row lg:items-center lg:gap-12"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Width-driven on small screens, height-driven from `lg` up, so a
                  tall poster fits the viewport instead of forcing a scroll. */}
              <div
                className="relative w-full shrink-0 overflow-hidden border border-line lg:h-[80vh] lg:w-auto"
                style={{ aspectRatio: active.ratio }}
              >
                {active.image ? (
                  <img
                    src={active.image}
                    alt={active.alt ?? `${active.title} — ${active.category}`}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <DesignVisual piece={active} />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-6 pb-6 lg:pb-0">
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
                  ].map((row) => (
                    <div key={row.label} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-3">
                      <dt className="u-eyebrow pt-0.5 text-ink-muted">{row.label}</dt>
                      <dd className="text-[0.875rem] text-ink-secondary">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex((current) => ((current ?? 0) - 1 + pieces.length) % pieces.length)
                    }
                    className="u-eyebrow border border-line px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenIndex((current) => ((current ?? 0) + 1) % pieces.length)}
                    className="u-eyebrow border border-line px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    Next
                  </button>
                  <span className="u-eyebrow ml-auto text-ink-faint u-tabular">
                    {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close larger view"
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
