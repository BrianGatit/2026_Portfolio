import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge only knows Tailwind's default type scale. Without this, it
 * reads the site's own sizes (`text-mega`, `text-title`, …) as text *colours*,
 * and silently drops one whenever it meets `text-ink` in the same `cn()` call.
 * Keep this list in step with the `--text-*` sizes in `index.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['micro', 'body', 'lead', 'subhead', 'heading', 'title', 'display', 'mega'],
    },
  },
})

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
