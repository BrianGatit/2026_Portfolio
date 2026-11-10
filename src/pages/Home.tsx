import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { featuredProjects } from '@/data/projects'
import { featuredArticles, articles } from '@/data/writing'
import { site, stats, services, story } from '@/data/site'
import { toolMarquee } from '@/data/skills'
import { useSeo } from '@/hooks/useSeo'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Marquee } from '@/components/ui/Marquee'
import { Reveal, RevealGroup, RevealItem, RuleLine } from '@/components/ui/Reveal'
import { HeroHeading } from '@/components/ui/HeroHeading'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectGrid } from '@/components/project/ProjectGrid'
import { ArticleCard } from '@/components/writing/ArticleCard'
import { HeroVisual } from '@/components/visual/HeroVisual'
import { Portrait } from '@/components/visual/Portrait'
import { ProjectVisual } from '@/components/visual/ProjectVisual'
import { ArrowDown } from '@/components/ui/Icons'
import { easeEditorial } from '@/utils/motion'
import { usePageParallax } from '@/hooks/useParallax'

/* ------------------------------------------------------------------ *\
   Hero
\* ------------------------------------------------------------------ */

function Hero() {
  // The photograph lags the headline slightly as the page scrolls away.
  const portraitY = usePageParallax(40)

  return (
    <section className="u-shell pt-32 pb-10 md:pt-40 md:pb-14" aria-labelledby="hero-heading">
      {/* status row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5"
      >
        <p className="u-eyebrow">
          {site.location} · {site.timezone}
        </p>
        <p className="u-eyebrow flex items-center gap-2.5 text-ink">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-accent" />
            <span
              aria-hidden
              className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70"
            />
          </span>
          {site.availability}
        </p>
      </motion.div>

      {/* The headline — name, a monumental profession and the roles that
          take turns beneath it, in a low-poly atmosphere. */}
      <HeroHeading
        name="Brian Mungai"
        headline="SOFTWARE ENGINEER"
        roles={['CREATIVE DEVELOPER', 'DATA SCIENTIST', 'GRAPHIC DESIGNER']}
        delay={0.2}
        className="mt-10 md:mt-14"
      />

      {/* lead + portrait */}
      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
        {/* The photograph leads on mobile, sits to the right on desktop. */}
        <motion.div
          style={{ y: portraitY }}
          className="order-1 lg:order-2 lg:col-span-4 lg:col-start-9"
        >
          <Portrait priority className="max-w-[26rem] lg:ml-auto" />
        </motion.div>

        <div className="order-2 lg:order-1 lg:col-span-5">
          <Reveal y={18} delay={0.35}>
            <p className="max-w-[44ch] text-lead text-ink-secondary">
              building is art. over time, i fell in love with technology not as a tool but as a medium, something you can shape, question, and refine. that curiosity pulled me into building products for myself and for others, which eventually led me deeper into ai, machine learning, and adjacent technical spaces. what drives me now is using these skills with intention to create systems that are thoughtful, useful, and grounded in both engineering and creativity
            </p>
          </Reveal>

          <Reveal y={16} delay={0.45} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton to="/work" size="lg" withArrow>
              View my work
            </MagneticButton>
            <MagneticButton to="/contact" variant="outline" size="lg">
              Let’s work together
            </MagneticButton>
          </Reveal>

          <Reveal y={12} delay={0.6} className="mt-14 hidden items-center gap-3 lg:flex">
            <ArrowDown className="animate-[u-drift_2.6s_ease-in-out_infinite] text-[1.1rem] text-ink-faint" />
            <span className="u-eyebrow text-ink-faint">Scroll</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   The system strip — the animated code/data/form drawing, moved
   directly below the hero now that the photograph leads it.
\* ------------------------------------------------------------------ */

function SystemStrip() {
  const drawingY = usePageParallax(26, 1100)

  return (
    <section className="u-shell pb-16 md:pb-24" aria-label="The overlap between my disciplines">
      <div className="grid grid-cols-1 gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-16 md:pt-14">
        <motion.div
          className="lg:col-span-8"
          style={{ y: drawingY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeEditorial, delay: 0.5 }}
        >
          <HeroVisual />
        </motion.div>

        <Reveal y={16} delay={0.2} className="flex flex-col justify-end lg:col-span-3 lg:col-start-10">
          <p className="u-eyebrow mb-5">The overlap</p>
          <p className="max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-secondary">
            One drawing, three axes: the data I model, the systems I build, and the form I give them.
            Everything on this site sits somewhere on it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   Disciplines — the triptych that explains the overlap
\* ------------------------------------------------------------------ */

const disciplineCards = [
  {
    to: '/engineering',
    label: 'Engineering',
    title: 'Products that hold up under real load',
    body: 'Typed React front ends, Python and Node services, modelled data, real authentication and deployments that are boring on purpose.',
    motif: 'engineering' as const,
    items: ['React & TypeScript', 'Django · FastAPI · Node', 'PostgreSQL & schema design', 'CI/CD, Docker, AWS'],
  },
  {
    to: '/data-science',
    label: 'Data & AI',
    title: 'Analysis that survives being questioned',
    body: 'From framing the decidable question to defending the estimate — predictive models, clustering, evaluation and retrieval systems.',
    motif: 'data' as const,
    items: ['Pandas · NumPy · Scikit-learn', 'Predictive & clustering models', 'RAG & evaluation harnesses', 'Power BI & custom dashboards'],
  },
  {
    to: '/design',
    label: 'Design',
    title: 'Identity built to reach the interface',
    body: 'Wordmarks, type and colour systems, editorial and campaign work — delivered as tokens a build can consume, not a PNG.',
    motif: 'design' as const,
    items: ['Brand identity systems', 'Editorial & poster design', 'Design systems & tokens', 'Data visualisation'],
  },
]

function Disciplines() {
  return (
    <section className="u-shell py-20 md:py-28" aria-labelledby="disciplines-heading">
      <SectionHeading
        id="disciplines-heading"
        index="01"
        label="The practice"
        title={['Three disciplines,', 'one way of working']}
        lead="Most people pick a lane. I kept all three because the interesting problems live where they meet — and because a product is rarely limited by only one of them."
      />

      <RevealGroup className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 lg:grid-cols-3" stagger={0.09}>
        {disciplineCards.map((card, index) => (
          <RevealItem key={card.to} className="group bg-page">
            <Link to={card.to} className="flex h-full flex-col">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.05]">
                  <ProjectVisual seed={`discipline-${card.label}`} discipline={card.motif} title={card.label} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="u-eyebrow text-ink-faint u-tabular">{`0${index + 1}`}</span>
                  <span className="u-eyebrow text-accent">{card.label}</span>
                </div>

                <h3 className="mt-5 max-w-[22ch] font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.12] font-medium tracking-[-0.025em] text-ink transition-colors duration-500 group-hover:text-accent">
                  {card.title}
                </h3>

                <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-secondary">
                  {card.body}
                </p>

                <ul className="mt-7 flex flex-col gap-2 border-t border-line pt-5">
                  {card.items.map((item) => (
                    <li key={item} className="font-mono text-[0.7rem] tracking-[0.04em] text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="mt-7 flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-ink uppercase">
                  <span className="relative">
                    Explore
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-x-100"
                    />
                  </span>
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   Selected work
\* ------------------------------------------------------------------ */

function SelectedWork() {
  return (
    <section className="u-shell py-20 md:py-28" aria-labelledby="work-heading">
      <SectionHeading
        id="work-heading"
        index="02"
        label="Selected work"
        title={['Case studies, not', 'screenshots']}
        lead="Four projects that show the whole arc: the decision behind them, the system that was built, and what actually changed as a result."
        action={<ArrowLink to="/work">All nine projects</ArrowLink>}
      />

      <ProjectGrid projects={featuredProjects} className="mt-16 md:mt-24" />
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   About preview
\* ------------------------------------------------------------------ */

function AboutPreview() {
  return (
    <section className="u-shell py-20 md:py-28" aria-labelledby="about-heading">
      <SectionHeading
        id="about-heading"
        index="03"
        label="About"
        title={['A designer who', 'ships, an engineer', 'who measures']}
        action={<ArrowLink to="/about">Full background</ArrowLink>}
      />

      <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
        {/* A specimen plate rather than a second photograph — the portrait
            leads the hero, and repeating it here would dilute it. */}
        <Reveal className="lg:col-span-5" y={20}>
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-surface">
            <ProjectVisual seed="practice-specimen-plate" discipline="design" title={site.shortName} />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-line bg-page/85 p-4 backdrop-blur-[2px]">
              <span className="u-eyebrow text-ink">Plate A — one system</span>
              <span className="u-eyebrow text-ink-faint">
                {site.location.split(',')[0]} · {site.since}—
              </span>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <RevealGroup stagger={0.1}>
            {story.map((paragraph, index) => (
              <RevealItem key={index}>
                <p
                  className={
                    index === 0
                      ? 'max-w-[52ch] font-display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.42] tracking-[-0.02em] text-ink'
                      : 'mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.75] text-ink-secondary'
                  }
                >
                  {paragraph}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* statistics */}
          <RevealGroup
            as="dl"
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4"
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
        </div>
      </div>

      {/* services */}
      <RevealGroup className="mt-20 grid grid-cols-1 gap-px bg-line md:mt-28 lg:grid-cols-3" stagger={0.08}>
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
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   Writing preview
\* ------------------------------------------------------------------ */

function WritingPreview() {
  const lead = featuredArticles[0]
  const rest = articles.filter((article) => article.slug !== lead?.slug).slice(0, 3)

  return (
    <section className="u-shell py-20 md:py-28" aria-labelledby="writing-heading">
      <SectionHeading
        id="writing-heading"
        index="04"
        label="Writing"
        title={['Notes on building', 'things that think']}
        lead="Essays on engineering, evaluation, data and craft — written mostly to work out what I actually believe about a problem."
        action={<ArrowLink to="/writing">All writing</ArrowLink>}
      />

      <div className="mt-14 md:mt-20">
        {lead && <ArticleCard article={lead} variant="feature" index={0} />}
        {rest.map((article, index) => (
          <ArticleCard key={article.slug} article={article} index={index + 1} />
        ))}
        <RuleLine />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   Contact band
\* ------------------------------------------------------------------ */

function ContactBand() {
  return (
    <section className="u-shell py-20 md:py-32" aria-labelledby="contact-heading">
      <RuleLine />
      <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-12 lg:gap-16 md:pt-16">
        <div className="lg:col-span-8">
          <p className="u-eyebrow mb-8">Next</p>
          <AnimatedText
            as="h2"
            id="contact-heading"
            text={['Have an idea?', 'Let’s build it.']}
            className="font-display text-display text-ink"
          />
        </div>

        <div className="flex flex-col justify-end gap-8 lg:col-span-4">
          <Reveal y={16}>
            <p className="max-w-[36ch] text-[1.0625rem] leading-[1.7] text-ink-secondary">
              Product engineering, an analysis that needs to be trusted, or an identity that has to work inside
              a real interface — tell me which one you are stuck on.
            </p>
          </Reveal>
          <Reveal y={14} delay={0.1} className="flex flex-wrap items-center gap-4">
            <MagneticButton to="/contact" size="lg" withArrow>
              Start a project
            </MagneticButton>
          </Reveal>
          <Reveal y={12} delay={0.15}>
            <a
              href={`mailto:${site.email}`}
              className="u-link font-display text-[1.0625rem] font-medium tracking-[-0.015em] text-ink"
            >
              {site.email}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *\
   Page
\* ------------------------------------------------------------------ */

export default function Home() {
  useSeo({
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    path: '/',
  })

  return (
    <>
      <Hero />
      <SystemStrip />

      <div className="border-y border-line">
        <div className="u-shell">
          <Marquee items={toolMarquee} />
        </div>
      </div>

      <Disciplines />
      <SelectedWork />
      <AboutPreview />
      <WritingPreview />
      <ContactBand />
    </>
  )
}
