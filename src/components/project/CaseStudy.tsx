import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Analysis, NamedBody, Project, StackGroup } from '@/types'
import { cn } from '@/utils/cn'
import { disciplineLabels, relatedProjects } from '@/data/projects'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Tag, TagList } from '@/components/ui/Tag'
import { MediaFrame, ProjectMedia, FigurePlaceholder } from '@/components/visual/Media'
import { MetricGrid } from './MetricGrid'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { ProjectCard } from './ProjectCard'
import { Chart } from '@/components/charts/Chart'
import { ArrowLeft } from '@/components/ui/Icons'
import { easeEditorial } from '@/utils/motion'
import { useParallax } from '@/hooks/useParallax'

/* ------------------------------------------------------------------ *\
   Section shell — a sticky mono label on the left, content on the
   right. Used for every section so a long case study stays navigable.
\* ------------------------------------------------------------------ */

function StudySection({
  index,
  label,
  children,
  id,
  wide = false,
}: {
  index: string
  label: string
  children: ReactNode
  id?: string
  wide?: boolean
}) {
  return (
    <section id={id} className="border-t border-line pt-8 md:pt-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="u-eyebrow flex items-baseline gap-3">
              <span className="text-ink-faint u-tabular">{index}</span>
              <span className="text-ink">{label}</span>
            </p>
          </div>
        </div>
        <div className={cn(wide ? 'lg:col-span-9' : 'lg:col-span-8 xl:col-span-7')}>{children}</div>
      </div>
    </section>
  )
}

function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('max-w-[66ch] text-[1.0625rem] leading-[1.75] text-ink-secondary', className)}>{children}</p>
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <RevealGroup as="ul" className="mt-7 flex flex-col gap-3" stagger={0.06}>
      {items.map((item) => (
        <RevealItem as="li" key={item} className="flex max-w-[64ch] gap-4">
          <span aria-hidden className="mt-[0.85rem] h-px w-5 shrink-0 bg-accent" />
          <span className="text-[1rem] leading-[1.7] text-ink-secondary">{item}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

function NumberedBlocks({ items }: { items: NamedBody[] }) {
  return (
    <RevealGroup as="ol" className="flex flex-col" stagger={0.07}>
      {items.map((item, index) => (
        <RevealItem
          as="li"
          key={item.title}
          className="grid grid-cols-1 gap-2 border-b border-line py-6 last:border-0 sm:grid-cols-[auto_1fr] sm:gap-8"
        >
          <span className="u-eyebrow pt-1.5 text-ink-faint u-tabular sm:w-10">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h4 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.012em] text-ink md:text-[1.1875rem]">
              {item.title}
            </h4>
            <p className="mt-2.5 max-w-[62ch] text-[0.9688rem] leading-[1.7] text-ink-secondary">{item.body}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

function StackGroups({ groups }: { groups: StackGroup[] }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2" stagger={0.06}>
      {groups.map((group) => (
        <RevealItem key={group.group} className="bg-page p-5 md:p-6">
          <h4 className="u-eyebrow text-ink">{group.group}</h4>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

/* ------------------------------------------------------------------ *\
   Data-science material — the section that makes an analysis project
   read differently from an engineering one.
\* ------------------------------------------------------------------ */

function AnalysisBlock({ analysis }: { analysis: Analysis }) {
  const dataset = [
    { label: 'Dataset', value: analysis.dataset.name },
    { label: 'Size', value: analysis.dataset.rows },
    { label: 'Features', value: analysis.dataset.features },
    { label: 'Period', value: analysis.dataset.span },
    { label: 'Sources', value: analysis.dataset.source },
  ]

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {/* the dataset, stated plainly */}
      <div>
        <h4 className="u-eyebrow mb-5 text-ink">The data</h4>
        <RevealGroup as="dl" className="flex flex-col border-t border-line" stagger={0.05}>
          {dataset.map((row) => (
            <RevealItem
              key={row.label}
              className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="u-eyebrow pt-1 text-ink-muted">{row.label}</dt>
              <dd className="text-[0.9688rem] leading-relaxed text-ink-secondary">{row.value}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* the questions */}
      <div>
        <h4 className="u-eyebrow mb-5 text-ink">Analytical questions</h4>
        <RevealGroup as="ol" className="flex flex-col gap-4" stagger={0.06}>
          {analysis.questions.map((question, index) => (
            <RevealItem as="li" key={question} className="flex gap-5">
              <span className="u-eyebrow mt-[0.4rem] shrink-0 text-accent u-tabular">
                Q{index + 1}
              </span>
              <span className="max-w-[58ch] font-display text-[1.0625rem] leading-snug tracking-[-0.012em] text-ink md:text-[1.1875rem]">
                {question}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* method */}
      <div>
        <h4 className="u-eyebrow mb-2 text-ink">Method</h4>
        <NumberedBlocks items={analysis.methodology} />
      </div>

      {/* the charts */}
      <div className="flex flex-col gap-8">
        <h4 className="u-eyebrow text-ink">What the data shows</h4>
        {analysis.charts.map((spec) => (
          <Reveal key={spec.title} y={18}>
            <Chart spec={spec} />
          </Reveal>
        ))}
      </div>

      {/* insights */}
      <div>
        <h4 className="u-eyebrow mb-5 text-ink">Findings</h4>
        <RevealGroup className="grid grid-cols-1 gap-px bg-line md:grid-cols-3" stagger={0.07}>
          {analysis.insights.map((insight, index) => (
            <RevealItem key={insight.title} className="flex flex-col gap-3 bg-page p-5 md:p-6">
              <span className="u-eyebrow text-accent u-tabular">{String(index + 1).padStart(2, '0')}</span>
              <h5 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.012em] text-ink">
                {insight.title}
              </h5>
              <p className="text-[0.9063rem] leading-[1.65] text-ink-secondary">{insight.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* conclusion, set as a statement */}
      <Reveal y={16}>
        <div className="border-l-2 border-accent pl-6 md:pl-8">
          <p className="u-eyebrow mb-4">Conclusion</p>
          <p className="max-w-[52ch] font-serif text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.28] text-ink italic">
            {analysis.conclusion}
          </p>
        </div>
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ *\
   The case study
\* ------------------------------------------------------------------ */

export function CaseStudy({ project }: { project: Project }) {
  const { study } = project
  const parallax = useParallax(28)
  const meta = [
    { label: 'Role', value: project.role },
    { label: 'Discipline', value: disciplineLabels[project.discipline] },
    project.client ? { label: 'Client', value: project.client } : null,
    project.timeline ? { label: 'Timeline', value: project.timeline } : null,
    { label: 'Year', value: project.year },
  ].filter(Boolean) as { label: string; value: string }[]

  const related = relatedProjects(project.slug, 2)

  // Sections are numbered as they render so the sequence stays right when a
  // project has no architecture or no analysis block.
  let counter = 0
  const next = () => String((counter += 1)).padStart(2, '0')

  return (
    <article className="pb-24 md:pb-32">
      {/* ---------- hero ---------- */}
      <header className="u-shell pt-28 md:pt-36">
        <Reveal y={10}>
          <Link
            to="/work"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-ink-muted uppercase transition-colors hover:text-accent"
          >
            <ArrowLeft className="text-[1.1em] transition-transform duration-500 group-hover:-translate-x-1" />
            All work
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal y={12}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="u-eyebrow text-accent">{disciplineLabels[project.discipline]}</span>
                <span aria-hidden className="h-px w-8 bg-line-strong" />
                <span className="u-eyebrow">{project.category}</span>
              </div>
            </Reveal>

            <AnimatedText
              as="h1"
              text={project.title}
              immediate
              className="mt-6 font-display text-display font-medium text-ink"
            />

            <Reveal y={14} delay={0.15}>
              <p className="mt-7 max-w-[54ch] text-subhead text-ink-secondary">{project.tagline}</p>
            </Reveal>

            {(project.links?.live || project.links?.repo) && (
              <Reveal y={12} delay={0.22} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                {project.links.live && (
                  <ArrowLink href={project.links.live} direction="external">
                    Live product
                  </ArrowLink>
                )}
                {project.links.repo && (
                  <ArrowLink href={project.links.repo} direction="external">
                    Source
                  </ArrowLink>
                )}
              </Reveal>
            )}
          </div>

          {/* meta rail */}
          <RevealGroup as="dl" className="flex flex-col lg:col-span-4" stagger={0.05} delay={0.15}>
            {meta.map((row) => (
              <RevealItem
                key={row.label}
                className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-3 first:border-t"
              >
                <dt className="u-eyebrow pt-1 text-ink-muted">{row.label}</dt>
                <dd className="text-[0.875rem] leading-relaxed text-ink-secondary">{row.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </header>

      {/* ---------- hero media ---------- */}
      <div className="u-shell mt-12 md:mt-16" ref={parallax.ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: easeEditorial, delay: 0.1 }}
        >
          <MediaFrame className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
            {/* Scaled past the frame so the parallax travel never exposes an edge. */}
            <motion.div className="absolute inset-0 scale-[1.14]" style={{ y: parallax.y }}>
              <ProjectMedia project={project} priority />
            </motion.div>
          </MediaFrame>
        </motion.div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <TagList items={project.tags} aria-label="Technology stack" />
          <span className="u-eyebrow text-ink-faint">Fig. 00 — Overview</span>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="u-shell mt-20 flex flex-col gap-16 md:mt-28 md:gap-24">
        <StudySection index={next()} label="Overview">
          <p className="max-w-[62ch] font-display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.42] tracking-[-0.02em] text-ink">
            {study.overview}
          </p>
        </StudySection>

        <StudySection index={next()} label="The problem">
          <Prose>{study.problem}</Prose>
          {study.problemPoints && <BulletList items={study.problemPoints} />}
        </StudySection>

        <StudySection index={next()} label="Approach">
          <Prose>{study.approach}</Prose>
          {study.approachPoints && <BulletList items={study.approachPoints} />}
        </StudySection>

        {study.architecture && (
          <StudySection index={next()} label="Architecture" wide>
            <ArchitectureDiagram architecture={study.architecture} />
          </StudySection>
        )}

        <StudySection index={next()} label="Process">
          <NumberedBlocks items={study.process} />
        </StudySection>

        {study.analysis && (
          <StudySection index={next()} label="Analysis" wide>
            <AnalysisBlock analysis={study.analysis} />
          </StudySection>
        )}

        <StudySection index={next()} label="Technology" wide>
          <StackGroups groups={study.stack} />
        </StudySection>

        <StudySection index={next()} label="Results" wide>
          <MetricGrid metrics={study.results} columns={3} />
          <Reveal y={14} className="mt-10">
            <Prose>{study.resultsNarrative}</Prose>
          </Reveal>
        </StudySection>

        <StudySection index={next()} label="Challenges">
          <NumberedBlocks items={study.challenges} />
        </StudySection>

        <StudySection index={next()} label="Outcome">
          <p className="max-w-[58ch] font-display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.42] tracking-[-0.02em] text-ink">
            {study.outcome}
          </p>
          {study.next && (
            <div className="mt-10">
              <p className="u-eyebrow mb-4">What comes next</p>
              <BulletList items={study.next} />
            </div>
          )}
        </StudySection>

        {study.gallery && study.gallery.length > 0 && (
          <StudySection index={next()} label="Selected views" wide>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {study.gallery.map((item, index) => (
                <Reveal
                  key={item.caption}
                  y={18}
                  className={cn(index === 0 && study.gallery!.length > 1 && 'md:col-span-2')}
                >
                  <FigurePlaceholder
                    caption={item.caption}
                    seed={`${project.slug}-gallery`}
                    discipline={project.discipline}
                    ratio={item.ratio}
                    index={index}
                    image={item.image}
                    alt={item.alt}
                  />
                </Reveal>
              ))}
            </div>
          </StudySection>
        )}
      </div>

      {/* ---------- next projects ---------- */}
      <section className="u-shell mt-28 md:mt-40">
        <div className="flex items-end justify-between gap-8 border-t border-line pt-6">
          <h2 className="text-heading font-display font-medium text-ink">Next projects</h2>
          <ArrowLink to="/work">All work</ArrowLink>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10">
          {related.map((item, index) => (
            <ProjectCard key={item.slug} project={item} span="half" index={index} />
          ))}
        </div>
      </section>
    </article>
  )
}
