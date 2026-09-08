import { AnimatePresence, motion } from 'motion/react'
import type { CardSpan, Project } from '@/types'
import { cn } from '@/utils/cn'
import { ProjectCard } from './ProjectCard'

const spanClasses: Record<CardSpan, string> = {
  full: 'md:col-span-2 lg:col-span-12',
  wide: 'md:col-span-2 lg:col-span-8',
  half: 'md:col-span-1 lg:col-span-6',
  tall: 'md:col-span-1 lg:col-span-4',
}

interface ProjectGridProps {
  projects: Project[]
  /** Ignore each project's span and render a uniform grid. */
  uniform?: CardSpan
  numbered?: boolean
  className?: string
}

/**
 * The asymmetric mosaic. Spans come from the data so the reading order and the
 * layout rhythm are decided in one place (`data/projects/index.ts`).
 */
export function ProjectGrid({ projects, uniform, numbered = true, className }: ProjectGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 items-start gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-24 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-32',
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((project, index) => {
          const span = uniform ?? project.span ?? 'half'
          return (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={spanClasses[span]}
            >
              <ProjectCard
                project={project}
                span={span}
                index={numbered ? index : undefined}
                priority={index === 0}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
