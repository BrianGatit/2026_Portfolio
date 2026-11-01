import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { designPieces, designCategories } from '@/data/design'
import { designProjects } from '@/data/projects'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { ScrollStatement } from '@/components/ui/ScrollStatement'
import { DesignGallery } from '@/components/design/DesignGallery'
import { RevealMedia } from '@/components/visual/RevealMedia'
import { MediaFrame, ProjectMedia } from '@/components/visual/Media'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/utils/cn'

const capabilities = [
  { label: 'Identity', items: ['Logo & monogram', 'Construction grids', 'Colour systems', 'Wordmark lockups'] },
  { label: 'Applications', items: ['Apparel & embroidery', 'Merchandise', 'Environmental graphics', 'Brand patterns'] },
  { label: 'Campaign', items: ['Brand storytelling', 'Social series', 'Posters', 'Art direction'] },
  { label: 'Product', items: ['Design systems', 'Token pipelines', 'Data-visualisation language', 'Figma libraries'] },
]

export default function Design() {
  const [category, setCategory] = useState<string>('All')

  const pieces = useMemo(
    () => (category === 'All' ? designPieces : designPieces.filter((piece) => piece.category === category)),
    [category],
  )

  useSeo({
    title: 'Design',
    description:
      'Brand identity, logos, apparel, merchandise and environmental graphics — including the Munga Design identity, built on two angles and the space between them.',
    path: '/design',
  })

  return (
    <>
      <PageHeader
        eyebrow="Visual Design"
        title={['Systems you can', 'see — and build', 'against']}
        lead="Identity, editorial and campaign work. I design the rule, then usually write the code that applies it — which is why these systems tend to still be intact a year later."
        meta={[
          { label: 'Practice', value: 'Identity · Applications · Campaign' },
          { label: 'Tools', value: 'Figma · Illustrator · InDesign' },
          { label: 'Output', value: 'Print · Screen · Tokens' },
          { label: 'Pieces shown', value: `${designPieces.length} selected` },
        ]}
      />

      {/* ---------- design-led case studies ---------- */}
      <section className="u-shell py-20 md:py-28" aria-label="Design case studies">
        <SectionHeading
          index="01"
          label="Case studies"
          title="One identity system, in full"
          lead="Where design work has an argument behind it, it gets a case study rather than a thumbnail."
        />

        <RevealGroup className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24" stagger={0.1}>
          {designProjects.map((project, index) => (
            <RevealItem
              as="article"
              key={project.slug}
              className={cn(
                'grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14',
                index % 2 === 1 && 'lg:[&>*:first-child]:order-2',
              )}
            >
              <Link to={`/work/${project.slug}`} className="group block lg:col-span-7">
                <MediaFrame className="aspect-[4/3] sm:aspect-[16/10]" cursorLabel="View case study">
                  <RevealMedia delay={0.15}>
                    <ProjectMedia project={project} />
                  </RevealMedia>
                </MediaFrame>
              </Link>

              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <span className="u-eyebrow text-accent">{project.category}</span>
                  <span className="u-eyebrow ml-auto text-ink-faint u-tabular">{project.year}</span>
                </div>

                <h3 className="mt-4 font-display text-title font-medium text-ink">
                  <Link to={`/work/${project.slug}`} className="transition-colors duration-500 hover:text-accent">
                    {project.title}
                  </Link>
                </h3>

                <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink-secondary">
                  {project.summary}
                </p>

                <dl className="mt-7 flex flex-col border-t border-line">
                  {[
                    { label: 'Role', value: project.role },
                    { label: 'Scope', value: project.study.stack.at(-1)?.items.join(', ') ?? '—' },
                    { label: 'Timeline', value: project.timeline ?? '—' },
                  ].map((row) => (
                    <div key={row.label} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-3">
                      <dt className="u-eyebrow pt-0.5 text-ink-faint">{row.label}</dt>
                      <dd className="text-[0.875rem] leading-relaxed text-ink-secondary">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 5).map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <ArrowLink to={`/work/${project.slug}`}>Read the case study</ArrowLink>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- gallery ---------- */}
      <section className="u-shell py-20 md:py-28" aria-label="Selected design work">
        <SectionHeading
          index="02"
          label="Selected pieces"
          title="Marks, objects and surfaces"
          lead="The Munga Design identity, piece by piece — logo, construction, apparel, merchandise, mural and pattern. Click any piece for the detail."
        />

        <Reveal y={12} className="mt-12 md:mt-16">
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-line py-4"
            role="group"
            aria-label="Filter design work by category"
          >
            {designCategories.map((item) => {
              const count =
                item === 'All' ? designPieces.length : designPieces.filter((piece) => piece.category === item).length
              if (count === 0) return null
              const isActive = category === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex items-center gap-2 border px-3.5 py-2 font-mono text-[0.68rem] tracking-[0.12em] uppercase',
                    'transition-colors duration-400 ease-[var(--ease-editorial)]',
                    isActive
                      ? 'border-accent bg-accent text-on-accent'
                      : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  {item}
                  <span className={cn('u-tabular text-[0.6rem]', isActive ? 'text-on-accent/70' : 'text-ink-faint')}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <DesignGallery pieces={pieces} className="mt-12 md:mt-16" />
      </section>

      {/* ---------- capabilities ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading index="03" label="Capabilities" title="What I can take on" />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {capabilities.map((group, index) => (
            <RevealItem key={group.label} className="flex flex-col gap-5 bg-page p-6 md:p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                  {group.label}
                </h3>
                <span className="u-eyebrow text-ink-faint u-tabular">{`0${index + 1}`}</span>
              </div>
              <ul className="flex flex-col gap-2 border-t border-line pt-4">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[0.875rem] text-ink-secondary">
                    <span aria-hidden className="h-px w-3 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="u-shell pb-24 md:pb-32">
        <Reveal y={16} className="flex flex-col items-start gap-8 border-t border-line pt-12 md:pt-16">
          <ScrollStatement className="max-w-[40ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.03em] text-ink">
            Need an identity that will still hold together inside a product?
          </ScrollStatement>
          <div className="flex flex-wrap gap-4">
            <MagneticButton to="/contact" size="lg" withArrow>
              Start a design project
            </MagneticButton>
            <MagneticButton to="/work" variant="outline" size="lg">
              All work
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  )
}
