import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { disciplineNav, primaryNav, site, socials } from '@/data/site'
import { socialIcons } from '@/components/ui/Icons'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { easeEditorial } from '@/utils/motion'
import { LogoMark } from '@/components/ui/Logo'

/** Local time in Nairobi — a small signal that a person is behind this. */
function LocalTime() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Nairobi',
        hour12: false,
      }).format(new Date())

    setTime(format())
    const timer = window.setInterval(() => setTime(format()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span className="u-eyebrow text-ink-faint u-tabular">
      {time && `${time} · ${site.timezone}`}
    </span>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-page">
      <div className="u-shell py-16 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* identity */}
          <div className="col-span-2 md:col-span-5">
            <p className="u-eyebrow">{site.role}</p>
            <p className="mt-5 max-w-[34ch] text-[1rem] leading-[1.7] text-ink-secondary">
              Working across engineering, data and design from {site.location}. Currently taking on selected
              product, analysis and identity work.
            </p>
            <div className="mt-7">
              <ArrowLink to="/contact">Start a project</ArrowLink>
            </div>
          </div>

          {/* nav */}
          <nav className="md:col-span-3 md:col-start-7" aria-label="Footer">
            <p className="u-eyebrow mb-5 text-ink-faint">Navigate</p>
            <ul className="flex flex-col gap-3">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="u-link text-[0.9375rem] text-ink-secondary transition-colors duration-300 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* disciplines */}
          <nav className="md:col-span-2" aria-label="Disciplines">
            <p className="u-eyebrow mb-5 text-ink-faint">Practice</p>
            <ul className="flex flex-col gap-3">
              {disciplineNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="u-link text-[0.9375rem] text-ink-secondary transition-colors duration-300 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* elsewhere */}
          <div className="md:col-span-2">
            <p className="u-eyebrow mb-5 text-ink-faint">Elsewhere</p>
            <ul className="flex flex-col gap-3">
              {socials.map((social) => {
                const Icon = socialIcons[social.label]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-2.5 text-[0.9375rem] text-ink-secondary transition-colors duration-300 hover:text-ink"
                    >
                      {Icon && <Icon className="text-[0.95rem] text-ink-faint transition-colors group-hover:text-accent" />}
                      <span className="u-link">{social.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* the signature: name set as large as the page allows */}
      <div className="u-shell overflow-hidden pb-8">
        <motion.p
          initial={{ y: '18%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: easeEditorial }}
          className="flex items-baseline font-display text-[clamp(3.4rem,15.5vw,15rem)] leading-[0.82] font-medium tracking-[-0.05em] text-ink select-none"
          aria-hidden
        >
          {site.name}
          <span className="ml-[0.06em] text-accent">.</span>
        </motion.p>
      </div>

      <div className="u-shell flex flex-col gap-3 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
        <p className="u-eyebrow flex items-center gap-3 text-ink-faint">
          <LogoMark className="h-4 w-auto shrink-0" />
          <span>© {year} {site.name} — All rights reserved</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <LocalTime />
          <span className="u-eyebrow text-ink-faint">Built with React, TypeScript & Vite</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="u-eyebrow transition-colors duration-300 hover:text-accent"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
