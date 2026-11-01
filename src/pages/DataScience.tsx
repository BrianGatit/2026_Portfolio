import { Link } from 'react-router-dom'
import { projectsByDiscipline } from '@/data/projects'
import { skillCategories } from '@/data/skills'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { ScrollStatement } from '@/components/ui/ScrollStatement'
import { Chart } from '@/components/charts/Chart'
import { Tag } from '@/components/ui/Tag'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SkillMatrix } from '@/components/skills/SkillGroup'
import type { Project } from '@/types'

const method = [
  { step: 'Frame', body: 'Find the question a decision actually depends on. Usually not the one in the brief.' },
  { step: 'Assemble', body: 'Build the panel. Every join asserted on row counts and nulls; every exclusion logged with a reason.' },
  { step: 'Explore', body: 'Distributions, missingness, heaping, leakage. Most findings are already visible here.' },
  { step: 'Model', body: 'Simplest thing that beats the named baseline, then a step up only if the gain survives validation.' },
  { step: 'Validate', body: 'Forward-chaining or grouped holdouts, calibration, interval coverage. Never random k-fold on time series.' },
  { step: 'Report', body: 'Two pages a committee can act on, including a plain statement of when not to trust the model.' },
]

const rigour = [
  {
    title: 'A named baseline, every time',
    body: 'The historical mean, the majority class, or the hand-written rule being replaced. A metric with nothing to beat is not a result.',
  },
  {
    title: 'Metrics that map to the action',
    body: 'Ranking problems get a lift curve. Thresholds get precision at that threshold. Forecasts get interval coverage. Accuracy at a 7% base rate is a trap.',
  },
  {
    title: 'Leakage is the default failure',
    body: 'Features are generated through an as-of function that takes the prediction date as an argument, so a window physically cannot see past it.',
  },
  {
    title: 'Calibrated, or not shown',
    body: 'If a confidence number reaches a human, it has been isotonically calibrated on a holdout. Otherwise any threshold they set is arbitrary.',
  },
  {
    title: 'Report the failure mode',
    body: 'Zone-holdout error roughly doubles in my last forecasting project. That sentence is in the first paragraph of the report, not an appendix.',
  },
  {
    title: 'Measure the automatic path forever',
    body: 'A mandatory random sample of auto-decisions routed back to human review. It costs time permanently and it is the only honest measurement.',
  },
]

/** An analysis dossier: the dataset, the questions, and one real chart. */
function AnalysisEntry({ project, index }: { project: Project; index: number }) {
  const analysis = project.study.analysis
  const dataset = analysis?.dataset

  return (
    <RevealItem
      as="article"
      className="grid grid-cols-1 gap-10 border-t border-line py-12 lg:grid-cols-12 lg:gap-12 lg:py-16"
    >
      <div className="lg:col-span-5">
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

        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-secondary">{project.summary}</p>

        {dataset && (
          <dl className="mt-8 flex flex-col border-t border-line">
            {[
              { label: 'Dataset', value: dataset.name },
              { label: 'Size', value: dataset.rows },
              { label: 'Features', value: dataset.features },
              { label: 'Period', value: dataset.span },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-3">
                <dt className="u-eyebrow pt-0.5 text-ink-faint">{row.label}</dt>
                <dd className="text-[0.875rem] leading-relaxed text-ink-secondary">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {analysis && (
          <div className="mt-7">
            <p className="u-eyebrow mb-3">Leading question</p>
            <p className="max-w-[46ch] font-display text-[1.0625rem] leading-snug tracking-[-0.015em] text-ink">
              {analysis.questions[0]}
            </p>
          </div>
        )}

        <ul className="mt-7 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 6).map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2">
          <ArrowLink to={`/work/${project.slug}`} size="sm">
            Full analysis
          </ArrowLink>
          {project.links?.repo && (
            <ArrowLink href={project.links.repo} size="sm">
              Notebooks
            </ArrowLink>
          )}
        </div>
      </div>

      {/* the chart does the arguing */}
      <div className="lg:col-span-7">
        {analysis ? (
          <Chart spec={analysis.charts[0]} />
        ) : (
          <div className="flex flex-col gap-4 border border-line bg-surface p-6">
            {project.study.results.slice(0, 4).map((metric) => (
              <div key={metric.label} className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
                <span className="u-eyebrow">{metric.label}</span>
                <span className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </RevealItem>
  )
}

export default function DataScience() {
  const projects = projectsByDiscipline('data', 'ai')
  const dataSkills = skillCategories.filter((category) => ['science', 'ml', 'data-stores'].includes(category.id))

  useSeo({
    title: 'Data Science & AI',
    description:
      'Predictive modelling, clustering, statistical analysis and retrieval systems — Python, Pandas, Scikit-learn, Power BI and evaluation you can defend.',
    path: '/data-science',
  })

  return (
    <>
      <PageHeader
        eyebrow="Data Science & AI"
        title={['From a messy CSV', 'to a decision', 'someone can defend']}
        lead="Analysis is not a chart at the end of a notebook. It is a chain of choices — framing, features, validation, communication — where any weak link makes the number worthless."
        meta={[
          { label: 'Analysis', value: 'Python · Pandas · NumPy · Statsmodels' },
          { label: 'Modelling', value: 'Scikit-learn · LightGBM · PyTorch' },
          { label: 'Visualisation', value: 'Matplotlib · Power BI · custom SVG' },
          { label: 'AI systems', value: 'RAG · embeddings · evaluation harnesses' },
        ]}
      />

      {/* ---------- method ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="01"
          label="Method"
          title="Six steps, in this order"
          lead="The order matters more than the tooling. Most failed analyses I have been asked to rescue went wrong in step one."
        />

        <RevealGroup as="ol" className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {method.map((item, index) => (
            <RevealItem as="li" key={item.step} className="flex flex-col gap-3 bg-page p-6 md:p-7">
              <div className="flex items-baseline gap-3">
                <span className="u-eyebrow text-accent u-tabular">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                  {item.step}
                </h3>
              </div>
              <p className="max-w-[38ch] text-[0.9063rem] leading-relaxed text-ink-secondary">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- projects ---------- */}
      <section className="u-shell py-20 md:py-28" aria-label="Data science projects">
        <SectionHeading
          index="02"
          label="Analyses"
          title="Four case studies, with the data"
          lead="Every chart here is the real figure from the project, rendered live — including its source note and a table view, because a picture of a chart is not evidence."
        />

        <RevealGroup className="mt-10 md:mt-14" stagger={0.1}>
          {projects.map((project, index) => (
            <AnalysisEntry key={project.slug} project={project} index={index} />
          ))}
        </RevealGroup>
      </section>

      {/* ---------- rigour ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading
          index="03"
          label="Rigour"
          title={['How I keep myself', 'honest']}
        />

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 md:grid-cols-2 xl:grid-cols-3"
          stagger={0.06}
        >
          {rigour.map((item, index) => (
            <RevealItem key={item.title} className="flex flex-col gap-4 bg-page p-6 md:p-8">
              <span className="u-eyebrow text-ink-faint u-tabular">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="max-w-[24ch] font-display text-[1.125rem] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[1.1875rem]">
                {item.title}
              </h3>
              <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-secondary">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------- toolset ---------- */}
      <section className="u-shell py-20 md:py-28">
        <SectionHeading index="04" label="Toolset" title="Analysis & modelling stack" />
        <SkillMatrix categories={dataSkills} className="mt-14 md:mt-20" />
      </section>

      <section className="u-shell pb-24 md:pb-32">
        <Reveal y={16} className="flex flex-col items-start gap-8 border-t border-line pt-12 md:pt-16">
          <ScrollStatement className="max-w-[40ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.03em] text-ink">
            Have data you suspect is telling you something?
          </ScrollStatement>
          <div className="flex flex-wrap gap-4">
            <MagneticButton to="/contact" size="lg" withArrow>
              Discuss an analysis
            </MagneticButton>
            <MagneticButton to="/engineering" variant="outline" size="lg">
              Engineering work
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  )
}
