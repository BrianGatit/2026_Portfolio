import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'
import { primaryNav, site } from '@/data/site'
import { useScrolled } from '@/hooks/useUi'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LogoMark } from '@/components/ui/Logo'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MobileMenu } from './MobileMenu'

/** The logo mark doubles as the home link. */
function Monogram() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label={`${site.name} — home`}
    >
      <LogoMark className="h-8 w-auto shrink-0 md:h-9" />
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="font-display text-[0.9375rem] leading-none font-medium tracking-[-0.015em] text-ink">
          {site.name}
        </span>
        <span className="mt-1 font-mono text-[0.6rem] tracking-[0.14em] text-ink-muted uppercase">
          Engineer · Data · Design
        </span>
      </span>
    </Link>
  )
}

/**
 * Minimal by default, and it earns its background only once you have scrolled
 * past the hero. The active route is marked with an accent rule rather than a
 * filled pill, which keeps the bar quiet.
 */
export function Navbar() {
  const scrolled = useScrolled(40)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-[var(--ease-editorial)]',
          'border-b',
          scrolled
            ? 'border-line bg-page/85 py-3 backdrop-blur-md md:py-3.5'
            : 'border-transparent bg-transparent py-5 md:py-7',
        )}
      >
        <nav className="u-shell flex items-center justify-between gap-6" aria-label="Primary">
          <Monogram />

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group relative block py-1 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-300',
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {/* The active rule is one shared element, so it slides
                          from the old link to the new one on navigation; the
                          others draw their own rule on hover. */}
                      {isActive ? (
                        <motion.span
                          aria-hidden
                          layoutId="nav-active-rule"
                          transition={{ duration: 0.55, ease: easeEditorial }}
                          className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent/60 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-x-100"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden lg:block">
              <MagneticButton to="/contact" variant="outline" size="sm" strength={8}>
                Let’s talk
              </MagneticButton>
            </div>

            {/* mobile trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="group flex size-10 flex-col items-center justify-center gap-[5px] border border-line transition-colors duration-500 hover:border-accent lg:hidden"
            >
              <span className="h-px w-4 bg-ink transition-all duration-500 ease-[var(--ease-editorial)] group-hover:w-5 group-hover:bg-accent" />
              <span className="h-px w-4 bg-ink transition-all duration-500 ease-[var(--ease-editorial)] group-hover:w-3 group-hover:bg-accent" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} currentPath={location.pathname} />
    </>
  )
}
