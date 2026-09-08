import { useId, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { site, socials } from '@/data/site'
import { useSeo } from '@/hooks/useSeo'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { Reveal } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { socialIcons } from '@/components/ui/Icons'
import { cn } from '@/utils/cn'

const projectTypes = [
  { id: 'product', label: 'Product engineering' },
  { id: 'data', label: 'Data, AI & analysis' },
  { id: 'identity', label: 'Identity & design' },
  { id: 'other', label: 'Something else' },
] as const

const brief = [
  'What you are trying to change, in one sentence.',
  'Who it is for, and how they work today.',
  'What already exists — code, data, brand, or nothing at all.',
  'The date that matters, and roughly what the budget looks like.',
]

interface FormState {
  name: string
  email: string
  type: string
  message: string
}

const emptyForm: FormState = { name: '', email: '', type: 'product', message: '' }

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const formId = useId()

  useSeo({
    title: 'Contact',
    description: `Get in touch with ${site.name} about product engineering, data science, AI or identity design work.`,
    path: '/contact',
  })

  function validate(values: FormState) {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.name.trim()) next.name = 'Please add your name.'
    if (!values.email.trim()) next.email = 'Please add an email address so I can reply.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'That email does not look right.'
    if (values.message.trim().length < 20) next.message = 'A couple of sentences helps — 20 characters minimum.'
    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const type = projectTypes.find((item) => item.id === form.type)?.label ?? 'Enquiry'
    const subject = `${type} — enquiry from ${form.name}`
    const body = `${form.message}\n\n—\n${form.name}\n${form.email}\nProject type: ${type}`

    // No backend: this composes the message in the visitor's own mail client,
    // which is honest about where the data goes and never silently drops it.
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard blocked — the address is visible anyway */
    }
  }

  const fieldClasses =
    'w-full border-b border-line bg-transparent py-3 text-[1rem] text-ink placeholder:text-ink-faint transition-colors duration-300 focus:border-accent focus:outline-none'

  return (
    <>
      {/* ---------- statement ---------- */}
      <section className="u-shell pt-32 pb-16 md:pt-40 md:pb-24">
        <Reveal y={10}>
          <p className="u-eyebrow text-accent">Contact</p>
        </Reveal>

        <AnimatedText
          as="h1"
          text={['Have an idea?', 'Let’s build it.']}
          immediate
          className="mt-8 font-display text-mega text-ink"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal y={18} delay={0.25} className="lg:col-span-6">
            <p className="max-w-[46ch] text-lead text-ink-secondary">
              Whether it is a product that needs building, an analysis that has to be trusted, or an identity
              that must survive contact with a real interface — tell me which part you are stuck on and I will
              tell you honestly whether I am the right person for it.
            </p>
          </Reveal>

          <Reveal y={16} delay={0.35} className="lg:col-span-5 lg:col-start-8">
            <dl className="flex flex-col border-t border-line">
              {[
                { label: 'Email', value: site.email },
                { label: 'Based in', value: `${site.location} · ${site.timezone}` },
                { label: 'Availability', value: site.availability },
                { label: 'Response', value: 'Within two working days' },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="u-eyebrow pt-0.5 text-ink-faint">{row.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-ink-secondary">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------- form + rail ---------- */}
      <section className="u-shell pb-24 md:pb-32" aria-labelledby={`${formId}-heading`}>
        <div className="grid grid-cols-1 gap-14 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16 md:pt-16">
          {/* the form */}
          <div className="lg:col-span-7">
            <h2 id={`${formId}-heading`} className="text-heading font-display font-medium text-ink">
              Start a conversation
            </h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 border border-line bg-accent-wash p-6 md:p-8"
                role="status"
              >
                <p className="u-eyebrow mb-3 text-accent">Draft opened</p>
                <p className="max-w-[46ch] text-[1rem] leading-[1.7] text-ink-secondary">
                  Your mail client should have opened with the message ready to send. If it did not, email me
                  directly at{' '}
                  <a href={`mailto:${site.email}`} className="u-link text-ink">
                    {site.email}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setForm(emptyForm)
                  }}
                  className="u-eyebrow mt-6 border border-line px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  Write another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-8">
                {/* name + email */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${formId}-name`} className="u-eyebrow mb-2 block">
                      Your name
                    </label>
                    <input
                      id={`${formId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                      placeholder="Amina Okoth"
                      className={cn(fieldClasses, errors.name && 'border-accent')}
                    />
                    {errors.name && (
                      <p id={`${formId}-name-error`} className="mt-2 font-mono text-[0.68rem] text-accent">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className="u-eyebrow mb-2 block">
                      Email
                    </label>
                    <input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                      placeholder="you@company.com"
                      className={cn(fieldClasses, errors.email && 'border-accent')}
                    />
                    {errors.email && (
                      <p id={`${formId}-email-error`} className="mt-2 font-mono text-[0.68rem] text-accent">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* project type */}
                <fieldset>
                  <legend className="u-eyebrow mb-4">What kind of work?</legend>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => {
                      const isActive = form.type === type.id
                      return (
                        <label
                          key={type.id}
                          className={cn(
                            'cursor-pointer border px-4 py-2.5 font-mono text-[0.68rem] tracking-[0.1em] uppercase',
                            'transition-colors duration-400 ease-[var(--ease-editorial)]',
                            isActive
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                          )}
                        >
                          <input
                            type="radio"
                            name="projectType"
                            value={type.id}
                            checked={isActive}
                            onChange={() => setForm({ ...form, type: type.id })}
                            className="sr-only"
                          />
                          {type.label}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                {/* message */}
                <div>
                  <label htmlFor={`${formId}-message`} className="u-eyebrow mb-2 block">
                    What are you working on?
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                    placeholder="A sentence on the problem, who it is for, and what already exists."
                    className={cn(fieldClasses, 'resize-y leading-[1.7]', errors.message && 'border-accent')}
                  />
                  {errors.message && (
                    <p id={`${formId}-message-error`} className="mt-2 font-mono text-[0.68rem] text-accent">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <MagneticButton type="submit" size="lg" withArrow>
                    Send message
                  </MagneticButton>
                  <p className="max-w-[28ch] font-mono text-[0.65rem] leading-relaxed text-ink-faint">
                    Opens in your mail client — no form data is stored anywhere.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* the rail */}
          <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="u-eyebrow mb-4">Direct</p>
              <a
                href={`mailto:${site.email}`}
                className="u-link font-display text-[clamp(1.1rem,1.7vw,1.4rem)] font-medium tracking-[-0.02em] text-ink"
              >
                {site.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="u-eyebrow mt-5 block border border-line px-4 py-2.5 text-ink transition-colors duration-400 hover:border-accent hover:text-accent"
              >
                {copied ? 'Copied to clipboard' : 'Copy address'}
              </button>
            </div>

            <div>
              <p className="u-eyebrow mb-4">Elsewhere</p>
              <ul className="flex flex-col">
                {socials.map((social) => {
                  const Icon = socialIcons[social.label]
                  return (
                    <li key={social.label} className="border-t border-line last:border-b">
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span className="flex items-center gap-3">
                          {Icon && (
                            <Icon className="text-[1rem] text-ink-faint transition-colors duration-300 group-hover:text-accent" />
                          )}
                          <span className="text-[0.9375rem] text-ink transition-colors duration-300 group-hover:text-accent">
                            {social.label}
                          </span>
                        </span>
                        <span className="font-mono text-[0.68rem] text-ink-muted">{social.handle}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <p className="u-eyebrow mb-4">Useful in a first message</p>
              <ul className="flex flex-col gap-3">
                {brief.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent" />
                    <span className="text-[0.9063rem] leading-relaxed text-ink-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
