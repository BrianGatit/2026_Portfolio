import { useRef, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeSwift } from '@/utils/motion'
import { useIsTouch } from '@/hooks/useUi'
import { ArrowUpRight } from './Icons'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface MagneticButtonProps {
  children: ReactNode
  /** Internal route. */
  to?: string
  /** External URL — opens in a new tab. */
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: Variant
  size?: Size
  /** Pixels of pull towards the cursor. */
  strength?: number
  withArrow?: boolean
  className?: string
  'aria-label'?: string
}

const variants: Record<Variant, string> = {
  solid: 'bg-ink text-page border-ink hover:border-accent',
  outline: 'border-line-strong text-ink hover:border-accent',
  ghost: 'border-transparent text-ink hover:border-line-strong',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.78rem]',
  md: 'h-12 px-6 text-[0.82rem]',
  lg: 'h-14 px-8 text-[0.86rem] md:h-16 md:px-10',
}

/**
 * A button that leans towards the cursor, with an accent wipe on hover.
 *
 * The magnetism is a pointer affordance, so it is switched off entirely on
 * touch devices and for visitors who prefer reduced motion — the button keeps
 * its hover and focus states either way.
 */
export function MagneticButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  size = 'md',
  strength = 14,
  withArrow = false,
  className,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const isTouch = useIsTouch()
  const magnetic = !reduceMotion && !isTouch

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.4 })

  function handleMove(event: MouseEvent) {
    if (!magnetic || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (bounds.left + bounds.width / 2)
    const offsetY = event.clientY - (bounds.top + bounds.height / 2)
    rawX.set((offsetX / (bounds.width / 2)) * strength)
    rawY.set((offsetY / (bounds.height / 2)) * (strength * 0.6))
  }

  function handleLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  const shell = cn(
    'group/mag relative inline-flex items-center justify-center gap-2.5 overflow-hidden border',
    'font-mono uppercase tracking-[0.14em] leading-none',
    'transition-colors duration-500 ease-[var(--ease-editorial)]',
    'rounded-[var(--radius-card)] select-none',
    variants[variant],
    sizes[size],
    className,
  )

  const inner = (
    <>
      {/* accent wipe */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -z-0 origin-bottom scale-y-0 bg-accent',
          'transition-transform duration-[600ms] ease-[var(--ease-editorial)]',
          'group-hover/mag:scale-y-100 group-focus-visible/mag:scale-y-100',
        )}
      />
      <span
        className={cn(
          'relative z-[1] flex items-center gap-2.5 transition-colors duration-500',
          'group-hover/mag:text-on-accent group-focus-visible/mag:text-on-accent',
        )}
      >
        {children}
        {withArrow && (
          <ArrowUpRight className="text-[1.05em] transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/mag:translate-x-0.5 group-hover/mag:-translate-y-0.5" />
        )}
      </span>
    </>
  )

  const isExternal = Boolean(href)

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={magnetic ? { x, y } : undefined}
      // A small press, so a tap or click registers before the route changes.
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: easeSwift }}
      className="inline-block will-change-transform"
    >
      {to ? (
        <Link to={to} className={shell} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : isExternal ? (
        <a href={href} target="_blank" rel="noreferrer noopener" className={shell} aria-label={ariaLabel}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={shell} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </motion.div>
  )
}
