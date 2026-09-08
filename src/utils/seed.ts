/**
 * Deterministic pseudo-randomness.
 *
 * The generated project visuals must be stable across renders and reloads —
 * a card that reshuffles on every navigation reads as noise. Seeding from the
 * project slug gives each project its own permanent composition.
 */

export function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, good enough for layout jitter. */
export function makeRandom(seed: string | number) {
  let a = typeof seed === 'number' ? seed >>> 0 : hashString(seed)
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random float in [min, max). */
export function makeRange(seed: string | number) {
  const rnd = makeRandom(seed)
  return (min: number, max: number) => min + rnd() * (max - min)
}
