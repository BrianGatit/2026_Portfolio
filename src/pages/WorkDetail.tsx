import { useParams } from 'react-router-dom'
import { getProject } from '@/data/projects'
import { useSeo } from '@/hooks/useSeo'
import { CaseStudy } from '@/components/project/CaseStudy'
import NotFound from './NotFound'

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProject(slug)

  useSeo({
    title: project ? `${project.title} — ${project.category}` : 'Project not found',
    description: project?.summary,
    path: `/work/${slug ?? ''}`,
    type: 'article',
  })

  if (!project) {
    return <NotFound context="project" />
  }

  return <CaseStudy project={project} />
}
