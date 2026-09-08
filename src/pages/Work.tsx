import { useMemo, useState } from 'react'
import type { Discipline } from '@/types'
import { disciplineLabels, workProjects } from '@/data/projects'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProjectGrid } from '@/components/project/ProjectGrid'
import { Reveal } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { cn } from '@/utils/cn'

type Filter = 'all' | Discipline

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'engineering', label: disciplineLabels.engineering },
  { id: 'data', label: disciplineLabels.data },
  { id: 'ai', label: disciplineLabels.ai },
  { id: 'design', label: disciplineLabels.design },
]

export default function Work() {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([['all', workProjects.length]])
    workProjects.forEach((project) => {
      map.set(project.discipline, (map.get(project.discipline) ?? 0) + 1)
    })
    return map
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? workProjects : workProjects.filter((project) => project.discipline === filter)),
    [filter],
  )

  useSeo({
    title: 'Work',
    description:
      'Selected case studies across software engineering, artificial intelligence, data science and design — platforms, models, analyses and identity systems.',
    path: '/work',
  })

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={['Nine projects,', 'four disciplines,', 'one way of thinking']}
        lead="Each of these is a case study rather than a screenshot: the decision that started it, the system that was built, and what measurably changed."
      />

      {/* filter rail */}
      <div className="u-shell mt-14 md:mt-20">
        <Reveal y={12}>
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-line py-4"
            role="group"
            aria-label="Filter projects by discipline"
          >
            {filters.map((item) => {
              const count = counts.get(item.id) ?? 0
              const isActive = filter === item.id
              if (count === 0) return null
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'group flex items-center gap-2 border px-3.5 py-2 font-mono text-[0.68rem] tracking-[0.12em] uppercase',
                    'transition-colors duration-400 ease-[var(--ease-editorial)]',
                    isActive
                      ? 'border-accent bg-accent text-on-accent'
                      : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  {item.label}
                  <span className={cn('u-tabular text-[0.6rem]', isActive ? 'text-on-accent/70' : 'text-ink-faint')}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>

      <section className="u-shell py-16 md:py-24" aria-label="Projects">
        {/* The art-directed mosaic only tiles correctly with the full set, so a
            filtered view falls back to an even grid. */}
        <ProjectGrid projects={visible} uniform={filter === 'all' ? undefined : 'half'} />
      </section>

      <section className="u-shell pb-24 md:pb-32">
        <Reveal y={16} className="flex flex-col items-start gap-8 border-t border-line pt-12 md:pt-16">
          <p className="max-w-[38ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.03em] text-ink">
            Something here look like the problem you are trying to solve?
          </p>
          <MagneticButton to="/contact" size="lg" withArrow>
            Let’s work together
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
