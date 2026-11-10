import { cn } from '@/utils/cn'

/**
 * The M mark: two folded strokes, orange over amber. Inline rather than an
 * <img> so it ships with the bundle, stays crisp at any size and can move on
 * hover. The brand colours are fixed — they read on both paper and ink, so
 * the mark does not re-theme with the page.
 *
 * Decorative by default; the link around it carries the accessible name.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="228 228 584 553" className={cn('u-logo', className)} aria-hidden focusable="false">
      <path
        className="u-logo-right"
        fill="#fdb31b"
        d="M521 349 L624 236 Q631 228 642 228 H802 Q812 228 812 238 V661 A120 120 0 0 1 692 781 H523 C590 750 635 690 635 610 V492 Z"
      />
      <path
        className="u-logo-left"
        fill="#fd6f1d"
        d="M240 228 H395 Q407 228 415 237 L628 463 Q650 486 628 510 L531 611 Q520 623 509 611 L403 500 V772 Q403 780 395 780 H353 A125 125 0 0 1 228 655 V240 Q228 228 240 228 Z"
      />
    </svg>
  )
}
