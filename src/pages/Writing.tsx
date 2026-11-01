import { useMemo, useState } from 'react'
import { articles, writingCategories } from '@/data/writing'
import { useSeo } from '@/hooks/useSeo'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleCard } from '@/components/writing/ArticleCard'
import { Reveal, RuleLine } from '@/components/ui/Reveal'
import { ScrollStatement } from '@/components/ui/ScrollStatement'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { cn } from '@/utils/cn'

export default function Writing() {
  const [category, setCategory] = useState<string>('All')

  const visible = useMemo(
    () => (category === 'All' ? articles : articles.filter((article) => article.category === category)),
    [category],
  )

  const [lead, ...rest] = visible

  useSeo({
    title: 'Writing',
    description:
      'Essays on software engineering, data science, AI, evaluation and design craft — notes on building things that think.',
    path: '/writing',
  })

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title={['Notes on building', 'things that think']}
        lead="Essays written mostly to work out what I actually believe about a problem — evaluation, domain modelling, retrieval, typography and the places they overlap."
        meta={[
          { label: 'Pieces', value: `${articles.length} published` },
          { label: 'Subjects', value: 'Engineering · Data · AI · Craft' },
          { label: 'Cadence', value: 'Monthly, roughly' },
          { label: 'Length', value: '6–10 minutes' },
        ]}
      />

      {/* category rail */}
      <div className="u-shell mt-14 md:mt-20">
        <Reveal y={12}>
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-line py-4"
            role="group"
            aria-label="Filter writing by subject"
          >
            {writingCategories.map((item) => {
              const count =
                item === 'All' ? articles.length : articles.filter((article) => article.category === item).length
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
      </div>

      <section className="u-shell py-14 md:py-20" aria-label="Articles">
        {lead && <ArticleCard article={lead} variant="feature" index={0} />}
        {rest.map((article, index) => (
          <ArticleCard key={article.slug} article={article} index={index + 1} />
        ))}
        <RuleLine />

        {visible.length === 0 && (
          <p className="py-16 text-lead text-ink-muted">Nothing published under this subject yet.</p>
        )}
      </section>

      <section className="u-shell pb-24 md:pb-32">
        <Reveal y={16} className="flex flex-col items-start gap-8 border-t border-line pt-12 md:pt-16">
          <ScrollStatement className="max-w-[40ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.03em] text-ink">
            Disagree with something here? That is the most useful email you could send me.
          </ScrollStatement>
          <MagneticButton to="/contact" size="lg" withArrow>
            Get in touch
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
