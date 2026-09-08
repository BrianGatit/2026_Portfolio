import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { site } from '@/data/site'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'
import { ProjectVisual } from './ProjectVisual'

interface PortraitProps {
  /** CSS aspect-ratio for the frame. Defaults to the photograph's own crop. */
  ratio?: string
  /** Show the printed caption bar across the bottom of the frame. */
  caption?: boolean
  /** True for the hero — sets eager loading and high fetch priority for LCP. */
  priority?: boolean
  /** Which part of the photograph to keep when the frame is a different shape. */
  objectPosition?: string
  className?: string
}

/**
 * The portrait photograph.
 *
 * The image itself is rendered untouched — no filters, no blend modes, no
 * duotone, no generated stand-in. The only styling applied is the frame around
 * it and how it is cropped to fit that frame, both of which are configurable
 * in `site.portrait`.
 *
 * If the file is missing the frame falls back to the generated composition
 * used elsewhere on the site, so a fresh clone never shows a broken image.
 */
export function Portrait({
  ratio = site.portrait.ratio,
  caption = true,
  priority = false,
  objectPosition = site.portrait.objectPosition,
  className,
}: PortraitProps) {
  const [failed, setFailed] = useState(false)
  const reduceMotion = useReducedMotion()

  const reveal = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { clipPath: 'inset(100% 0% 0% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
      }

  return (
    <figure className={cn('group relative', className)}>
      <motion.div
        {...reveal}
        transition={{ duration: 1.1, ease: easeEditorial, delay: 0.25 }}
        className="relative w-full overflow-hidden border border-line bg-surface"
        style={{ aspectRatio: ratio }}
      >
        {failed ? (
          <ProjectVisual seed="portrait-brian-munga" discipline="design" title={site.shortName} />
        ) : (
          <motion.img
            src={site.portrait.src}
            alt={site.portrait.alt}
            width={site.portrait.width}
            height={site.portrait.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onError={() => setFailed(true)}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: easeEditorial, delay: 0.25 }}
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition }}
          />
        )}

        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-line bg-page/85 px-4 py-3 backdrop-blur-[3px]">
            <span className="u-eyebrow text-ink">{site.name}</span>
            <span className="u-eyebrow text-ink-faint">{site.location}</span>
          </figcaption>
        )}
      </motion.div>

      {/* a hairline that grows under the frame — the only decoration */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: easeEditorial, delay: 0.9 }}
        className="mt-3 block h-px w-full origin-left bg-accent"
      />
    </figure>
  )
}
