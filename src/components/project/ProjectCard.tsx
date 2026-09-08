import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { CardSpan, Project } from '@/types'
import { cn } from '@/utils/cn'
import { disciplineLabels } from '@/data/projects'
import { MediaFrame, ProjectMedia } from '@/components/visual/Media'
import { TagList } from '@/components/ui/Tag'
import { ArrowUpRight } from '@/components/ui/Icons'
import { easeEditorial, fadeUp, inViewEarly } from '@/utils/motion'

interface ProjectCardProps {
  project: Project
  /** Editorial number shown above the title. */
  index?: number
  span?: CardSpan
  priority?: boolean
  className?: string
}

/** Ratio per span — the mosaic's rhythm comes from these, not from the content. */
const ratioClasses: Record<CardSpan, string> = {
  full: 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]',
  wide: 'aspect-[4/3] sm:aspect-[16/10]',
  half: 'aspect-[4/3]',
  tall: 'aspect-[4/3] sm:aspect-[4/5]',
}

const titleClasses: Record<CardSpan, string> = {
  full: 'text-title',
  wide: 'text-heading',
  half: 'text-heading',
  tall: 'text-heading',
}

/**
 * The work grid's unit. One link, one large frame, and metadata that steps
 * forward as the media scales — the whole card is the affordance, so there is
 * no separate "read more" to hunt for.
 */
export function ProjectCard({ project, index, span, priority = false, className }: ProjectCardProps) {
  const cardSpan = span ?? project.span ?? 'half'

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewEarly}
      className={cn('group relative', className)}
    >
      <Link
        to={`/work/${project.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${project.title} — ${project.tagline}`}
      >
        <MediaFrame
          className={cn(ratioClasses[cardSpan], 'transition-colors duration-700 group-hover:border-line-strong')}
          cursorLabel="View case study"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.045 }}
            transition={{ duration: 1.1, ease: easeEditorial }}
          >
            <ProjectMedia project={project} priority={priority} />
          </motion.div>

          {/* corner metadata, printed onto the frame */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="u-eyebrow bg-page/80 px-2 py-1 backdrop-blur-[2px]">
                {disciplineLabels[project.discipline]}
              </span>
              <span className="u-eyebrow bg-page/80 px-2 py-1 backdrop-blur-[2px] u-tabular">{project.year}</span>
            </div>

            <div className="flex items-end justify-end">
              <span
                className={cn(
                  'grid size-10 place-items-center border border-line bg-page/85 text-ink backdrop-blur-[2px]',
                  'transition-all duration-500 ease-[var(--ease-editorial)]',
                  'group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent',
                )}
              >
                <ArrowUpRight className="text-[1.05rem] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </MediaFrame>

        <div className="mt-5 flex flex-col gap-4 md:mt-6">
          <div
            className={cn(
              'flex flex-col gap-3',
              cardSpan === 'full' && 'lg:flex-row lg:items-start lg:justify-between lg:gap-16',
            )}
          >
            <div className={cn(cardSpan === 'full' && 'lg:max-w-[46%]')}>
              <div className="flex items-baseline gap-3">
                {index !== undefined && (
                  <span className="u-eyebrow text-ink-faint u-tabular">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="u-eyebrow">{project.category}</span>
              </div>

              <h3
                className={cn(
                  'mt-2.5 font-display font-medium text-ink transition-colors duration-500 group-hover:text-accent',
                  titleClasses[cardSpan],
                )}
              >
                {project.title}
              </h3>
            </div>

            <p
              className={cn(
                'text-ink-secondary',
                cardSpan === 'full'
                  ? 'text-subhead max-w-[46ch] lg:pt-8'
                  : 'max-w-[52ch] text-[0.9375rem] leading-relaxed',
              )}
            >
              {project.tagline}
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-line pt-4">
            <TagList
              items={project.tags}
              limit={cardSpan === 'full' ? 6 : 4}
              aria-label={`Technologies used in ${project.title}`}
            />
            <span className="u-eyebrow hidden shrink-0 text-ink-faint sm:block">{project.role.split('—')[0].trim()}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
