import type { ReactElement, SVGProps } from 'react'

/**
 * Hand-drawn stroke icons at a consistent 1.4 weight. Decorative by default —
 * anything that carries meaning gets an accessible label from its parent.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

export const ArrowRight = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M20 12H4" />
    <path d="M10 6l-6 6 6 6" />
  </svg>
)

export const ArrowDown = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M12 4v16" />
    <path d="M6 14l6 6 6-6" />
  </svg>
)

export const Sun = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.1M12 19.3v2.1M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
  </svg>
)

export const Moon = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
)

export const Close = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Plus = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Github = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden focusable="false" {...props}>
    <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.89c.51.1.7-.22.7-.49v-1.9c-2.84.62-3.44-1.2-3.44-1.2-.46-1.18-1.13-1.5-1.13-1.5-.93-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.91 1.56 2.39 1.11 2.97.85.09-.66.36-1.11.65-1.37-2.27-.26-4.65-1.13-4.65-5.04 0-1.11.4-2.02 1.05-2.73-.11-.26-.46-1.3.1-2.71 0 0 .85-.27 2.79 1.04a9.7 9.7 0 0 1 5.08 0c1.94-1.31 2.79-1.04 2.79-1.04.56 1.41.21 2.45.1 2.71.65.71 1.05 1.62 1.05 2.73 0 3.92-2.39 4.78-4.67 5.03.37.32.7.94.7 1.9v2.82c0 .27.18.6.71.49A10.2 10.2 0 0 0 12 1.8Z" />
  </svg>
)

export const LinkedIn = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden focusable="false" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.83v1.5h.05a4.2 4.2 0 0 1 3.78-2.07c4.04 0 4.79 2.66 4.79 6.11v5.46h-4V15.6c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.28v4.99h-4v-11Z" />
  </svg>
)

export const XLogo = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden focusable="false" {...props}>
    <path d="M17.3 3h3.3l-7.2 8.24L21.5 21h-6.1l-4.78-6.25L5.1 21H1.8l7.5-8.58L2.2 3h6.25l4.47 5.9L17.3 3Zm-1.16 16h1.83L7.02 4.9H5.06l11.08 14.1Z" />
  </svg>
)

export const Dribbble = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden focusable="false" {...props}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.6 4.6a8.3 8.3 0 0 1 1.9 5.1c-.7-.15-2.5-.5-4.5-.3-.1-.25-.2-.5-.3-.75-.2-.5-.45-1-.7-1.5 2.2-.9 3.2-2.2 3.6-2.55ZM12 3.5c2.05 0 3.9.78 5.3 2.05-.33.45-1.24 1.6-3.33 2.4A26 26 0 0 0 10.4 3.7c.5-.13 1.05-.2 1.6-.2ZM8.7 4.3a30 30 0 0 1 3.55 4.2 20.6 20.6 0 0 1-6.6 1A8.5 8.5 0 0 1 8.7 4.3ZM3.5 12v-.25c.55.02 4.2.1 8.1-1.2.2.4.4.8.57 1.2-2.9.85-5.4 3.2-6.3 4.4A8.44 8.44 0 0 1 3.5 12Zm2.6 5.35c.6-.95 2.85-3.35 6.1-4.35a25 25 0 0 1 1.5 5.6A8.45 8.45 0 0 1 6.1 17.35ZM15.2 18a26 26 0 0 0-1.42-5.4c1.9-.25 3.6.2 4.1.35a8.5 8.5 0 0 1-2.68 5.05Z" />
  </svg>
)

export const Mail = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

export const Document = (props: IconProps) => (
  <svg {...base} width="1em" height="1em" {...props}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
)

export const socialIcons: Record<string, (props: IconProps) => ReactElement> = {
  GitHub: Github,
  LinkedIn: LinkedIn,
  'X / Twitter': XLogo,
  Dribbble: Dribbble,
  'Read.cv': Document,
}
