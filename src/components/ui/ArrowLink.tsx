import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { ArrowRight, ArrowUpRight } from './Icons'

interface ArrowLinkProps {
  children: ReactNode
  to?: string
  href?: string
  className?: string
  /** 'right' for internal navigation, 'external' for anything off-site. */
  direction?: 'right' | 'external'
  size?: 'sm' | 'md'
}

/**
 * Inline text link. The rule under it grows from the left and the arrow steps
 * forward — the same micro-interaction everywhere, so links feel like one family.
 */
export function ArrowLink({ children, to, href, className, direction, size = 'md' }: ArrowLinkProps) {
  const isExternal = Boolean(href)
  const arrow = (direction ?? (isExternal ? 'external' : 'right')) === 'external'

  const classes = cn(
    'group/link inline-flex items-center gap-2 font-mono uppercase tracking-[0.14em] text-ink',
    'transition-colors duration-300 hover:text-accent focus-visible:text-accent',
    size === 'sm' ? 'text-[0.68rem]' : 'text-[0.75rem]',
    className,
  )

  const content = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        />
      </span>
      {arrow ? (
        <ArrowUpRight className="text-[1.15em] transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      ) : (
        <ArrowRight className="text-[1.15em] transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/link:translate-x-1" />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
      {content}
    </a>
  )
}
