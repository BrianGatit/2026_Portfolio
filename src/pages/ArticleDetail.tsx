import { Link, useParams } from 'react-router-dom'
import { getArticle, relatedArticles } from '@/data/writing'
import { site } from '@/data/site'
import { useSeo } from '@/hooks/useSeo'
import { formatDate } from '@/utils/format'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Reveal } from '@/components/ui/Reveal'
import { BlockRenderer } from '@/components/content/BlockRenderer'
import { ArticleCard } from '@/components/writing/ArticleCard'
import { ArrowLeft } from '@/components/ui/Icons'
import { MagneticButton } from '@/components/ui/MagneticButton'
import NotFound from './NotFound'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const article = getArticle(slug)

  useSeo({
    title: article?.title ?? 'Article not found',
    description: article?.dek,
    path: `/writing/${slug ?? ''}`,
    type: 'article',
    publishedTime: article?.date,
  })

  if (!article) return <NotFound context="article" />

  const related = relatedArticles(article.slug, 2)

  return (
    <article className="pb-24 md:pb-32">
      {/* ---------- header ---------- */}
      <header className="u-shell pt-28 md:pt-36">
        <Reveal y={10}>
          <Link
            to="/writing"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-ink-muted uppercase transition-colors hover:text-accent"
          >
            <ArrowLeft className="text-[1.1em] transition-transform duration-500 group-hover:-translate-x-1" />
            All writing
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <Reveal y={12}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="u-eyebrow text-accent">{article.category}</span>
                <span aria-hidden className="h-px w-8 bg-line-strong" />
                <time dateTime={article.date} className="u-eyebrow">
                  {formatDate(article.date)}
                </time>
                <span aria-hidden className="h-px w-8 bg-line-strong" />
                <span className="u-eyebrow text-ink-faint">{article.readingTime} min read</span>
              </div>
            </Reveal>

            <AnimatedText
              as="h1"
              text={article.title}
              immediate
              className="mt-7 max-w-[26ch] font-display text-display font-medium text-ink"
            />

            <Reveal y={14} delay={0.2}>
              <p className="mt-8 max-w-[54ch] text-subhead text-ink-secondary">{article.dek}</p>
            </Reveal>
          </div>

          <Reveal y={14} delay={0.25} className="lg:col-span-3">
            <div className="flex flex-col gap-4 border-t border-line pt-5">
              <div>
                <p className="u-eyebrow mb-2 text-ink-faint">Written by</p>
                <p className="font-display text-[1rem] font-medium tracking-[-0.015em] text-ink">{site.name}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-muted">{site.role}</p>
              </div>
              <div>
                <p className="u-eyebrow mb-2 text-ink-faint">Filed under</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {article.tags.map((tag) => (
                    <li key={tag} className="font-mono text-[0.68rem] tracking-[0.06em] text-ink-secondary">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- body ---------- */}
      <div className="u-shell mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="border-t border-line pt-10 lg:col-span-9 lg:col-start-2 md:pt-14">
            <BlockRenderer blocks={article.body} seed={article.slug} />
          </div>
        </div>
      </div>

      {/* ---------- footer ---------- */}
      <section className="u-shell mt-24 md:mt-32">
        <div className="grid grid-cols-1 gap-10 border-t border-line pt-12 lg:grid-cols-12 md:pt-16">
          <div className="lg:col-span-6">
            <p className="max-w-[34ch] font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.16] font-medium tracking-[-0.03em] text-ink">
              Working on something this touches? I would like to hear about it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton to="/contact" withArrow>
                Get in touch
              </MagneticButton>
              <ArrowLink href={`mailto:${site.email}`} direction="external">
                {site.email}
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="u-shell mt-20 md:mt-28">
        <div className="flex items-end justify-between gap-8">
          <h2 className="text-heading font-display font-medium text-ink">Keep reading</h2>
          <ArrowLink to="/writing">All writing</ArrowLink>
        </div>
        <div className="mt-10">
          {related.map((item, index) => (
            <ArticleCard key={item.slug} article={item} index={index} />
          ))}
          <div className="border-t border-line" />
        </div>
      </section>
    </article>
  )
}
