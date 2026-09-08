import { Link } from 'react-router-dom'
import { engineeringProjects } from '@/data/projects'
import { skillCategories } from '@/data/skills'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { MediaFrame, ProjectMedia } from '@/components/visual/Media'
import { Tag } from '@/components/ui/Tag'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SkillMatrix } from '@/components/skills/SkillGroup'
import type { Project } from '@/types'

const practice = [
  {
    label: 'Data',
    title: 'Schema first, constraints in the database',
    body: 'Partial unique indexes, check constraints, generated columns. Invariants live where they cannot be bypassed by a management command or a second service.',
  },
  {
    label: 'Contracts',
    title: 'Typed end to end',
    body: 'OpenAPI schemas generate the TypeScript client, so a breaking API change fails the build instead of failing in production.',
  },
  {
    label: 'State',
    title: 'Log transitions, project state',
    body: 'An append-only event log per aggregate turns the audit trail, the activity feed and the analytics source into one thing.',
  },
  {
    label: 'Testing',
    title: 'Interaction, not markup',
    body: 'Keyboard and pointer semantics, axe on every component story, snapshots in both themes. A contrast regression fails CI like a type error.',
  },
  {
    label: 'Delivery',
    title: 'Boring deployments',
    body: 'Docker, GitHub Actions, migrations that can be rolled back on a Friday, and enough tracing to answer “what happened at 14:06” without guessing.',
  },
  {
    label: 'Security',
    title: 'Auth as a boundary, not a flag',
    body: 'Role-scoped read models, rotating refresh tokens, row-level tenancy, immutable audit logs. Permissions are modelled, not sprinkled.',
  },
]

/** A technical dossier per project — deliberately not the same card as /work. */
function EngineeringEntry({ project, index }: { project: Project; index: number }) {
  const headline = project.study.results.slice(0, 3)
  const layers = project.study.architecture?.layers ?? []

  return (
    <RevealItem
      as="article"
      className="grid grid-cols-1 gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-12 lg:py-16"
    >
      {/* media + links */}
      <div className="lg:col-span-5">
        <Link to={`/work/${project.slug}`} className="group block">
          <MediaFrame className="aspect-[4/3]" cursorLabel="View case study">
            <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
              <ProjectMedia project={project} />
            </div>
          </MediaFrame>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2">
          <ArrowLink to={`/work/${project.slug}`} size="sm">
            Case study
          </ArrowLink>
          {project.links?.repo && (
            <ArrowLink href={project.links.repo} size="sm">
              Source
            </ArrowLink>
          )}
          {project.links?.live && (
            <ArrowLink href={project.links.live} size="sm">
              Live
            </ArrowLink>
          )}
        </div>
      </div>

      {/* the technical read */}
      <div className="lg:col-span-7">
        <div className="flex items-baseline gap-3">
          <span className="u-eyebrow text-ink-faint u-tabular">{String(index + 1).padStart(2, '0')}</span>
          <span className="u-eyebrow text-accent">{project.category}</span>
          <span className="u-eyebrow ml-auto text-ink-faint u-tabular">{project.year}</span>
        </div>

        <h3 className="mt-4 font-display text-title font-medium text-ink">
          <Link to={`/work/${project.slug}`} className="transition-colors duration-500 hover:text-accent">
            {project.title}
          </Link>
        </h3>

        <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-ink-secondary">{project.summary}</p>

        {/* headline engineering numbers */}
        <dl className="mt-8 grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {headline.map((metric) => (
            <div key={metric.label} className="flex flex-col bg-page p-4">
              <dd className="order-1 font-display text-[1.5rem] leading-none font-medium tracking-[-0.03em] text-ink">
                {metric.value}
              </dd>
              <dt className="order-2 mt-2.5 font-mono text-[0.62rem] leading-relaxed tracking-[0.1em] text-ink-muted uppercase">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* architecture at a glance */}
        {layers.length > 0 && (
          <div className="mt-8">
            <p className="u-eyebrow mb-3">Architecture</p>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
              {layers.map((layer, layerIndex) => (
                <li key={layer.label} className="flex items-center gap-2">
                  <span className="border border-line px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.08em] text-ink-secondary uppercase">
                    {layer.label}
                    <span className="ml-2 text-ink-faint u-tabular">{layer.nodes.length}</span>
                  </span>
                  {layerIndex < layers.length - 1 && (
                    <span aria-hidden className="text-ink-faint">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* stack, grouped */}
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
          {project.study.stack.slice(0, 4).map((group) => (
            <div key={group.group} className="grid grid-cols-1 gap-2 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
              <p className="u-eyebrow pt-1.5 text-ink-faint">{group.group}</p>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RevealItem>
  )
}

export default function Engineering() {
  const engineeringSkills = skillCategories.filter((category) =>
    ['foundations', 'interface', 'backend', 'data-stores', 'platform'].includes(category.id),
  )

  useSeo({
    title: 'Software Engineering',
    description:
      'Full-stack product engineering: React and TypeScript interfaces, Django and FastAPI services, PostgreSQL schema design, authentication, architecture and deployment.',
    path: '/engineering',
  })

  return (
    <>
      <PageHeader
        eyebrow="Software Engineering"
        title={['Systems that keep', 'working after I', 'hand them over']}
        lead="Products with a designed front end and a defensible back end. The interesting part is rarely the framework — it is the domain model, the constraints and the seams."
        meta={[
          { label: 'Front end', value: 'React · TypeScript · Vite · Tailwind' },
          { label: 'Back end', value: 'Django · FastAPI · Node · Celery' },
          { label: 'Data', value: 'PostgreSQL · Redis · S3 · PostGIS' },
          { label: 'Platform', value: 'Docker · GitHub Actions · AWS' },
        ]}
      />

      {/* ---------- projects ---------- */}
      <section className="u-shell py-20 md:py-28" aria-label="Engineering projects">
        <SectionHeading
          index="01"
          label="Projects"
          title="Three systems, in technical detail"
          lead="Each entry shows the shape of the system rather than a gallery of screens: the layers, the numbers that mattered, and the stack that got there."
        />

        <RevealGroup className="mt-10 md:mt-14" stagger={0.1}>
          {engineeringProjects.map((project, index) => (
            <EngineeringEntry key={project.slug} project={project} index={index} />
          ))}
        </RevealGroup>
      </section>

      {/* ---------- practice ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="02"
          label="Practice"
          title={['The decisions I make', 'before writing code']}
          lead="These are the defaults I bring to a project. They are opinions, they are all arguable, and every one of them came from getting it wrong first."
        />

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 md:grid-cols-2 xl:grid-cols-3"
          stagger={0.06}
        >
          {practice.map((item) => (
            <RevealItem key={item.title} className="flex flex-col gap-4 bg-page p-6 md:p-8">
              <span className="u-eyebrow text-accent">{item.label}</span>
              <h3 className="max-w-[24ch] font-display text-[1.125rem] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[1.1875rem]">
                {item.title}
              </h3>
              <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-secondary">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- stack ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading index="03" label="Toolset" title="What I reach for" />
        <SkillMatrix categories={engineeringSkills} className="mt-14 md:mt-20" />
      </section>

      <section className="u-shell pb-24 md:pb-32">
        <Reveal y={16} className="flex flex-col items-start gap-8 border-t border-line pt-12 md:pt-16">
          <p className="max-w-[40ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.03em] text-ink">
            Need a product built, or an existing one made maintainable?
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton to="/contact" size="lg" withArrow>
              Let’s talk architecture
            </MagneticButton>
            <MagneticButton to="/data-science" variant="outline" size="lg">
              Data science work
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  )
}
