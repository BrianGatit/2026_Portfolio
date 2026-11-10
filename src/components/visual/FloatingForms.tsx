import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/utils/cn'
import { easeEditorial } from '@/utils/motion'

/**
 * Low-poly shards: each a handful of facets, shaded light-to-dark so they read
 * as solid forms catching one warm light from the upper right.
 */
const shards = [
  {
    // a tall crystal, upper right
    box: 'right-[4%] top-[2%] w-[clamp(4.5rem,10vw,10rem)]',
    viewBox: '0 0 100 140',
    facets: [
      ['M50 0 L100 48 L58 70Z', 'var(--cinema-sweep)', 0.34],
      ['M50 0 L58 70 L8 52Z', 'var(--accent)', 0.22],
      ['M8 52 L58 70 L44 140Z', 'var(--accent)', 0.3],
      ['M58 70 L100 48 L44 140Z', 'var(--ink)', 0.08],
    ],
    depth: 26,
    duration: 13,
  },
  {
    // a small tetrahedron, mid right
    box: 'right-[24%] top-[46%] w-[clamp(2.25rem,4.4vw,4.5rem)]',
    viewBox: '0 0 100 90',
    facets: [
      ['M50 0 L100 90 L52 62Z', 'var(--accent)', 0.26],
      ['M50 0 L52 62 L0 90Z', 'var(--cinema-sweep)', 0.4],
      ['M0 90 L52 62 L100 90Z', 'var(--ink)', 0.07],
    ],
    depth: 44,
    duration: 10,
  },
  {
    // a flat diamond, lower right, furthest back
    box: 'right-[9%] bottom-[-6%] w-[clamp(3rem,6.5vw,6.5rem)]',
    viewBox: '0 0 120 80',
    facets: [
      ['M0 40 L60 0 L60 40Z', 'var(--cinema-sweep)', 0.3],
      ['M60 0 L120 40 L60 40Z', 'var(--accent)', 0.2],
      ['M0 40 L60 40 L60 80Z', 'var(--accent)', 0.26],
      ['M60 40 L120 40 L60 80Z', 'var(--ink)', 0.07],
    ],
    depth: 14,
    duration: 16,
  },
] as const

interface FloatingFormsProps {
  /** Pointer position, -1…1 on each axis (0 at rest); each shard drifts by its depth. */
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  className?: string
  delay?: number
}

type ShardProps = Omit<FloatingFormsProps, 'className'> & { shard: (typeof shards)[number]; index: number }

function Shard({ shard, index, pointerX, pointerY, delay = 0 }: ShardProps) {
  const reduceMotion = useReducedMotion()
  // Nearer shards (larger depth) move further with the pointer — parallax.
  const x = useTransform(pointerX, (v) => (reduceMotion ? 0 : v * shard.depth))
  const y = useTransform(pointerY, (v) => (reduceMotion ? 0 : v * shard.depth * 0.6))

  // Parallax and entrance live on separate elements so their `y` never collide.
  return (
    <motion.div className={cn('absolute', shard.box)} style={{ x, y }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.6, ease: easeEditorial, delay: delay + index * 0.18 }}
      >
        <svg viewBox={shard.viewBox} className="u-shard block w-full" style={{ animationDuration: `${shard.duration}s` }}>
          {shard.facets.map(([d, fill, opacity]) => (
            <path key={d} d={d} fill={fill} fillOpacity={opacity} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}

/**
 * Three floating geometric forms for the hero's atmosphere — few, small and
 * faint, kept to the right so they frame the heading rather than sit under it.
 * They drift slowly on their own and, on desktop, shift with the pointer at
 * different depths. Decorative only.
 */
export function FloatingForms({ pointerX, pointerY, className, delay = 0 }: FloatingFormsProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none', className)}>
      {shards.map((shard, index) => (
        <Shard key={index} shard={shard} index={index} pointerX={pointerX} pointerY={pointerY} delay={delay} />
      ))}
    </div>
  )
}
