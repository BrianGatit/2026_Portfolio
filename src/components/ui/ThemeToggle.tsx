import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'
import { Moon, Sun } from './Icons'

/**
 * Light/dark switch. Both themes are hand-picked sets of steps rather than an
 * inversion of one another, so this is a real choice, not a filter.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'group relative grid size-10 place-items-center overflow-hidden border border-line',
        'rounded-[var(--radius-card)] text-ink transition-colors duration-500',
        'hover:border-accent hover:text-accent',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: 14, opacity: 0, rotate: -25 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 25 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center text-[1.05rem]"
        >
          {isDark ? <Moon /> : <Sun />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
