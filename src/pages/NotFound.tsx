import { primaryNav } from '@/data/site'
import { useSeo } from '@/hooks/useSeo'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Reveal } from '@/components/ui/Reveal'

export default function NotFound({ context = 'page' }: { context?: 'page' | 'project' | 'article' }) {
  useSeo({ title: 'Not found', description: 'That page does not exist.' })

  const message =
    context === 'project'
      ? 'That case study does not exist — it may have been renamed, or it might be one I have not published yet.'
      : context === 'article'
        ? 'That article does not exist. It may have been renamed, or it is still a draft.'
        : 'That page does not exist. The link may be old, or I may have moved things around.'

  return (
    <section className="u-shell flex min-h-[76vh] flex-col justify-center pt-32 pb-24 md:pt-40">
      <p className="u-eyebrow text-accent">Error 404</p>

      <AnimatedText
        as="h1"
        text={['Nothing here —', 'yet.']}
        immediate
        className="mt-8 font-display text-mega text-ink"
      />

      <Reveal y={16} delay={0.25} className="mt-10">
        <p className="max-w-[44ch] text-lead text-ink-secondary">{message}</p>
      </Reveal>

      <Reveal y={14} delay={0.35} className="mt-12 flex flex-wrap items-center gap-4">
        <MagneticButton to="/" size="lg" withArrow>
          Back to home
        </MagneticButton>
        <MagneticButton to="/work" variant="outline" size="lg">
          See the work
        </MagneticButton>
      </Reveal>

      <Reveal y={12} delay={0.45} className="mt-16 border-t border-line pt-6">
        <p className="u-eyebrow mb-5">Or try</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <ArrowLink to={item.to}>{item.label}</ArrowLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
