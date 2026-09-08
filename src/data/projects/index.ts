import type { CardSpan, Discipline, Project } from '@/types'
import { engineeringProjects } from './engineering'
import { scienceProjects } from './science'
import { designProjects } from './design'

/** Every project, in no particular order. */
export const allProjects: Project[] = [...engineeringProjects, ...scienceProjects, ...designProjects]

const bySlug = new Map(allProjects.map((p) => [p.slug, p]))

/**
 * The work index is art-directed rather than sorted: this list fixes both the
 * reading order and the span each card claims, so every row of the 12-column
 * mosaic resolves (12 · 8+4 · 6+6 · 8+4 · 6+6).
 */
const mosaic: [slug: string, span: CardSpan][] = [
  ['atlas-freight-os', 'full'],
  ['corpus-rag', 'wide'],
  ['meridian-design-system', 'tall'],
  ['kilimo-yield', 'half'],
  ['north-bearing', 'half'],
  ['ledger-lens', 'wide'],
  ['signal-retention', 'tall'],
  ['mobility-atlas', 'half'],
  ['sanaa-festival', 'half'],
]

/** Projects in curated order, with layout spans applied. */
export const workProjects: Project[] = mosaic.flatMap(([slug, span]) => {
  const project = bySlug.get(slug)
  return project ? [{ ...project, span }] : []
})

export const featuredProjects: Project[] = workProjects.filter((p) => p.featured).slice(0, 4)

export function getProject(slug: string | undefined): Project | undefined {
  return slug ? bySlug.get(slug) : undefined
}

export function projectsByDiscipline(...disciplines: Discipline[]): Project[] {
  return workProjects.filter((p) => disciplines.includes(p.discipline))
}

/** Up to `count` other projects, preferring the same discipline. */
export function relatedProjects(slug: string, count = 2): Project[] {
  const current = bySlug.get(slug)
  if (!current) return workProjects.slice(0, count)
  const others = workProjects.filter((p) => p.slug !== slug)
  const sameField = others.filter((p) => p.discipline === current.discipline)
  const rest = others.filter((p) => p.discipline !== current.discipline)
  return [...sameField, ...rest].slice(0, count)
}

export const disciplineLabels: Record<Discipline, string> = {
  engineering: 'Software Engineering',
  data: 'Data Science',
  ai: 'Artificial Intelligence',
  design: 'Design',
}

export const disciplineShortLabels: Record<Discipline, string> = {
  engineering: 'Engineering',
  data: 'Data',
  ai: 'AI',
  design: 'Design',
}

export { engineeringProjects, scienceProjects, designProjects }
