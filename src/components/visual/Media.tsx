import type { ReactNode } from 'react'
import type { Project } from '@/types'
import { cn } from '@/utils/cn'
import { ProjectVisual } from './ProjectVisual'

interface MediaFrameProps {
  children: ReactNode
  /**
   * CSS aspect-ratio, e.g. '16 / 10'. Omit it and pass responsive
   * `aspect-*` classes instead when the ratio should change by breakpoint.
   */
  ratio?: string
  className?: string
  /** Text for the custom cursor while hovering this frame. */
  cursorLabel?: string
}

/**
 * The one media container on the site: a hairline frame with a fixed aspect
 * ratio that clips whatever is inside it, so hover scale never affects layout.
 */
export function MediaFrame({ children, ratio, className, cursorLabel }: MediaFrameProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border border-line bg-surface',
        'rounded-[var(--radius-media)]',
        className,
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-cursor={cursorLabel}
    >
      {children}
    </div>
  )
}

interface ProjectMediaProps {
  project: Pick<Project, 'slug' | 'title' | 'discipline' | 'cover'>
  className?: string
  /** Only the first card in a viewport should load eagerly. */
  priority?: boolean
}

/**
 * A project's cover: the real image when one exists, the generated
 * discipline visual when it does not.
 */
export function ProjectMedia({ project, className, priority = false }: ProjectMediaProps) {
  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt={`${project.title} — project cover`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('absolute inset-0 size-full object-cover', className)}
      />
    )
  }

  return (
    <ProjectVisual
      seed={project.slug}
      discipline={project.discipline}
      title={project.title}
      className={className}
    />
  )
}

/**
 * A captioned case-study figure: the real image when one is supplied, and
 * otherwise a placeholder that is honest about being one rather than pretending.
 */
export function FigurePlaceholder({
  caption,
  seed,
  discipline,
  ratio = '16 / 10',
  index,
  image,
  alt,
}: {
  caption: string
  seed: string
  discipline: Project['discipline']
  ratio?: string
  index?: number
  image?: string
  alt?: string
}) {
  return (
    <figure className="flex flex-col gap-3">
      <MediaFrame ratio={ratio}>
        {image ? (
          <img
            src={image}
            alt={alt ?? caption}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <ProjectVisual seed={`${seed}-${index ?? 0}`} discipline={discipline} title={caption} />
        )}
      </MediaFrame>
      <figcaption className="flex gap-3 font-mono text-[0.68rem] leading-relaxed tracking-[0.04em] text-ink-muted">
        {index !== undefined && <span className="text-ink-faint">{`Fig. ${index + 1}`}</span>}
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}
