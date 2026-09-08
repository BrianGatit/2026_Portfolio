import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Article } from '@/types'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import { ArrowUpRight } from '@/components/ui/Icons'
import { fadeUp, inViewEarly } from '@/utils/motion'

interface ArticleCardProps {
  article: Article
  index?: number
  /** 'row' is the magazine index; 'feature' is the lead item. */
  variant?: 'row' | 'feature'
}

/**
 * Writing is presented as a magazine index rather than as blog cards: a rule,
 * a date, a category, and a headline doing the work.
 */
export function ArticleCard({ article, index, variant = 'row' }: ArticleCardProps) {
  const isFeature = variant === 'feature'

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewEarly}
      className="group border-t border-line"
    >
      <Link
        to={`/writing/${article.slug}`}
        className={cn(
          'grid grid-cols-1 gap-x-8 gap-y-4 py-8 md:py-10',
          isFeature ? 'lg:grid-cols-12' : 'md:grid-cols-12',
        )}
      >
        {/* rail: number, date, category */}
        <div className={cn('flex items-baseline gap-4 md:col-span-3 md:flex-col md:gap-2.5 lg:col-span-2')}>
          {index !== undefined && (
            <span className="u-eyebrow text-ink-faint u-tabular">{String(index + 1).padStart(2, '0')}</span>
          )}
          <time dateTime={article.date} className="u-eyebrow">
            {formatDate(article.date)}
          </time>
          <span className="u-eyebrow text-accent">{article.category}</span>
        </div>

        {/* headline + dek */}
        <div className={cn('md:col-span-8 lg:col-span-8', isFeature && 'lg:col-span-7')}>
          <h3
            className={cn(
              'font-display font-medium tracking-[-0.028em] text-ink transition-colors duration-500 group-hover:text-accent',
              isFeature ? 'text-title' : 'text-[clamp(1.35rem,2.3vw,1.9rem)] leading-[1.1]',
            )}
          >
            {article.title}
          </h3>
          <p
            className={cn(
              'mt-3.5 text-ink-secondary',
              isFeature ? 'max-w-[56ch] text-subhead' : 'max-w-[62ch] text-[0.9688rem] leading-relaxed',
            )}
          >
            {article.dek}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="u-eyebrow text-ink-faint">{article.readingTime} min read</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {article.tags.map((tag) => (
                <li key={tag} className="font-mono text-[0.65rem] tracking-[0.08em] text-ink-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* arrow */}
        <div className="flex items-start justify-end md:col-span-1 lg:col-span-2 lg:col-start-11">
          <span
            className={cn(
              'grid size-10 place-items-center border border-line text-ink',
              'transition-all duration-500 ease-[var(--ease-editorial)]',
              'group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent',
            )}
          >
            <ArrowUpRight className="text-[1.05rem] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
