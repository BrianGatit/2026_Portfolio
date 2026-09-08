import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/utils/cn'
import { disciplineNav, primaryNav, site, socials } from '@/data/site'
import { useEscapeKey, useLockScroll } from '@/hooks/useUi'
import { Close } from '@/components/ui/Icons'
import { easeEditorial } from '@/utils/motion'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  currentPath: string
}

const panel = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.62, ease: easeEditorial, staggerChildren: 0.055, delayChildren: 0.14 },
  },
  exit: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.42, ease: easeEditorial } },
}

const item = {
  hidden: { y: 34, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: easeEditorial } },
}

/**
 * Full-screen navigation for small screens. It is not a stacked copy of the
 * desktop bar — the links are set as display type, and the disciplines get the
 * room they cannot have in the top bar.
 */
export function MobileMenu({ open, onClose, currentPath }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEscapeKey(open, onClose)
  useLockScroll(open)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[80] flex flex-col bg-page lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="u-shell flex items-center justify-between py-5">
            <motion.span variants={item} className="u-eyebrow">
              Menu
            </motion.span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-10 place-items-center border border-line text-ink transition-colors duration-500 hover:border-accent hover:text-accent"
            >
              <Close className="text-[1.1rem]" />
            </button>
          </div>

          <nav className="u-shell flex flex-1 flex-col justify-center gap-10 py-8" aria-label="Site">
            <ul className="flex flex-col">
              {primaryNav.map((navItem, index) => {
                const isActive =
                  navItem.to === '/' ? currentPath === '/' : currentPath.startsWith(navItem.to)
                return (
                  <motion.li key={navItem.to} variants={item} className="border-b border-line">
                    <Link
                      to={navItem.to}
                      onClick={onClose}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span
                        className={cn(
                          'font-display text-[clamp(2.2rem,11vw,3.4rem)] leading-none font-medium tracking-[-0.04em] transition-colors duration-300',
                          isActive ? 'text-accent' : 'text-ink group-hover:text-accent',
                        )}
                      >
                        {navItem.label}
                      </span>
                      <span className="u-eyebrow text-ink-faint u-tabular">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div variants={item}>
              <p className="u-eyebrow mb-4">Disciplines</p>
              <ul className="flex flex-col gap-3">
                {disciplineNav.map((discipline) => (
                  <li key={discipline.to}>
                    <Link
                      to={discipline.to}
                      onClick={onClose}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
                    >
                      <span className="font-display text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                        {discipline.label}
                      </span>
                      <span className="font-mono text-[0.63rem] tracking-[0.06em] text-ink-muted">
                        {discipline.note}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </nav>

          <motion.div variants={item} className="u-shell flex flex-col gap-4 border-t border-line py-6">
            <a
              href={`mailto:${site.email}`}
              className="font-display text-[1.125rem] font-medium tracking-[-0.02em] text-ink"
            >
              {site.email}
            </a>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="u-eyebrow transition-colors duration-300 hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="u-eyebrow text-ink-faint">{site.availability}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
