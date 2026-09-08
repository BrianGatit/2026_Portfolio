import { site, stats, story, services, clientsAndContexts } from '@/data/site'
import { skillCategories } from '@/data/skills'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { SkillMatrix } from '@/components/skills/SkillGroup'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Portrait } from '@/components/visual/Portrait'
import { ArrowLink } from '@/components/ui/ArrowLink'

const principles = [
  {
    title: 'Frame the decidable question',
    body: '“Predict yield” is not a question anyone can answer. “What is the probability we fall below the recoverable threshold” is. Most of the value in a project is created before any code exists.',
  },
  {
    title: 'Constraints in the place they cannot be bypassed',
    body: 'If a truck cannot be on two loads at once, that is a database index, not an `if` statement. Application-layer validation is a suggestion.',
  },
  {
    title: 'Design the refusal state',
    body: 'Any system with uncertainty needs three states, not two: answered, partial, and declined. The third one is where trust is built.',
  },
  {
    title: 'A baseline, always',
    body: 'A metric without a named baseline is a number, not a result. I report what the model beats, and how badly it fails in the way it is most likely to fail.',
  },
  {
    title: 'Ship the system, not the artefact',
    body: 'A logo is a file; an identity is a set of tokens a build can consume. A component is code; a design system is a contract with a migration path.',
  },
  {
    title: 'Know where to stop automating',
    body: 'One in seven generated posters was weak, so I built a review step instead of adding rules forever. Judgement is a feature of the process.',
  },
]

const timeline = [
  {
    period: '2019 — 2021',
    title: 'Design first',
    body: 'Freelance graphic and identity work. Learned grids, type and the discipline of a system — and that clients do not buy taste, they buy consistency.',
  },
  {
    period: '2021 — 2023',
    title: 'Engineering',
    body: 'Moved into full-stack product work: React and TypeScript on the front, Django and FastAPI behind it. Shipped the first products I had also designed.',
  },
  {
    period: '2023 — 2024',
    title: 'Data',
    body: 'Every product raised measurement questions I could not answer, so I went and learned to. Statistics, Pandas, Scikit-learn, and the habit of an honest holdout.',
  },
  {
    period: '2024 — now',
    title: 'All three, deliberately',
    body: 'Working at the intersection: intelligent products where the interface has to be as carefully designed as the model, and the brand has to survive both.',
  },
]

export default function About() {
  useSeo({
    title: 'About',
    description:
      'Brian Munga is a multidisciplinary technologist working across software engineering, data science, AI and visual design — from Nairobi, Kenya.',
    path: '/about',
  })

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={['I design the identity,', 'engineer the product,', 'and model the data']}
        lead={site.bio}
        meta={[
          { label: 'Based in', value: site.location },
          { label: 'Working since', value: `${site.since}` },
          { label: 'Disciplines', value: 'Engineering · Data · AI · Design' },
          { label: 'Availability', value: site.availability },
        ]}
      />

      {/* ---------- portrait + story ---------- */}
      <section className="u-shell py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5" y={20}>
            <div className="sticky top-28">
              <Portrait />
              <p className="mt-4 font-mono text-[0.68rem] leading-relaxed text-ink-muted">
                {site.name} — {site.role.toLowerCase()}, working from {site.location}.
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <RevealGroup stagger={0.1}>
              {story.map((paragraph, index) => (
                <RevealItem key={index}>
                  <p
                    className={
                      index === 0
                        ? 'max-w-[52ch] font-display text-[clamp(1.3rem,2.1vw,1.75rem)] leading-[1.38] tracking-[-0.022em] text-ink'
                        : 'mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-ink-secondary'
                    }
                  >
                    {paragraph}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            <RevealGroup
              as="dl"
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4"
              stagger={0.07}
            >
              {stats.map((stat) => (
                <RevealItem key={stat.label} className="flex flex-col">
                  <dd className="order-1 font-display text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none font-medium tracking-[-0.04em] text-ink">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </dd>
                  <dt className="order-2 mt-3 max-w-[18ch] font-mono text-[0.65rem] leading-relaxed tracking-[0.12em] text-ink-muted uppercase">
                    {stat.label}
                  </dt>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* contexts */}
            <Reveal y={14} className="mt-14">
              <p className="u-eyebrow mb-4">Contexts I have worked in</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {clientsAndContexts.map((context) => (
                  <li
                    key={context}
                    className="font-display text-[1.0625rem] font-medium tracking-[-0.015em] text-ink-secondary"
                  >
                    {context}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- how I got here ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="01"
          label="Trajectory"
          title={['Design, then code,', 'then measurement']}
          lead="I did not arrive at this combination on purpose. Each discipline was the answer to a problem the previous one could not solve."
        />

        <RevealGroup as="ol" className="mt-14 flex flex-col md:mt-20" stagger={0.08}>
          {timeline.map((entry) => (
            <RevealItem
              as="li"
              key={entry.period}
              className="grid grid-cols-1 gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <span className="u-eyebrow text-accent md:col-span-3 u-tabular">{entry.period}</span>
              <h3 className="font-display text-heading font-medium text-ink md:col-span-4">{entry.title}</h3>
              <p className="max-w-[52ch] text-[1rem] leading-[1.7] text-ink-secondary md:col-span-5">
                {entry.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- stack ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="02"
          label="Technology"
          title={['The stack, grouped', 'by what it is for']}
          lead="Organised by purpose rather than by logo — a wall of icons tells you nothing about depth, and depth is the only thing worth advertising."
        />

        <SkillMatrix categories={skillCategories} className="mt-14 md:mt-20" />
      </section>

      {/* ---------- principles ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="03"
          label="How I work"
          title={['Six things I believe', 'about building']}
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
          {principles.map((principle, index) => (
            <RevealItem key={principle.title} className="flex flex-col gap-4 bg-page p-6 md:p-8">
              <span className="u-eyebrow text-ink-faint u-tabular">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="max-w-[24ch] font-display text-[1.125rem] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[1.25rem]">
                {principle.title}
              </h3>
              <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-secondary">
                {principle.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- services ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="04"
          label="Engagements"
          title="Three ways people work with me"
          action={<ArrowLink to="/contact">Enquire</ArrowLink>}
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 lg:grid-cols-3" stagger={0.08}>
          {services.map((service, index) => (
            <RevealItem key={service.id} className="flex flex-col gap-5 bg-page p-6 md:p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[1.125rem] font-medium tracking-[-0.02em] text-ink md:text-[1.25rem]">
                  {service.title}
                </h3>
                <span className="u-eyebrow text-ink-faint u-tabular">{`0${index + 1}`}</span>
              </div>
              <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-secondary">{service.body}</p>
              <ul className="mt-auto flex flex-col gap-2 border-t border-line pt-5">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-center gap-2.5 text-[0.875rem] text-ink-muted">
                    <span aria-hidden className="h-px w-3 bg-accent" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal y={16} className="mt-16 flex flex-wrap items-center gap-4">
          <MagneticButton to="/work" size="lg" withArrow>
            See the work
          </MagneticButton>
          <MagneticButton to="/contact" variant="outline" size="lg">
            Start a conversation
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
