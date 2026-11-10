import type { DesignLayer, DesignMotion } from '@/types'

/**
 * Layer maps for flat files whose elements sit apart on a plain ground, so
 * they can be cut out exactly: every region below was measured from the
 * file's own pixels (panel rules, gaps between tiles, circle edges).
 *
 * Between them the regions cover every mark in the file, and the base colour
 * is the file's own ground — so the resting frame is the original, untouched.
 */

type Rect = [number, number, number, number]
const rect = (r: Rect, enter: DesignLayer['enter'], at: number, loop?: DesignLayer['loop']): DesignLayer => ({
  shape: { rect: r },
  enter,
  at,
  loop,
})

/* ---------- Kachiliba TTI emblem — 500 × 500 ------------------------- */

/**
 * A seal is three objects: the lettered ring, the medallion inside it and the
 * ribbon across the foot. The ring turns into place, the medallion opens out
 * and then rocks very slightly, the ribbon unfurls from its centre.
 */
export const kachilibaLayers: DesignMotion = {
  kind: 'layers',
  size: [500, 500],
  base: '#ffffff',
  layers: [
    { shape: { ring: [241.5, 208, 72, 201] }, enter: 'spin', at: 0.15 },
    { shape: { circle: [241.5, 203.5, 77] }, enter: 'pop', at: 0.75, loop: 'sway' },
    rect([0, 392, 500, 108], 'unfold', 1.35),
  ],
}

/* ---------- Identity deck, closing slide — 820 × 457 ----------------- */

/**
 * The slide is ruled into eight panels. The rules draw first, then each panel
 * fills in its own way: the title rises line by line, the type specimen line
 * by line, the pattern tiles pop in and keep pulsing in turn, the colour pie
 * turns into place, the cards slide in from the edge.
 */
export const launchSlideLayers: DesignMotion = {
  kind: 'layers',
  size: [820, 457],
  base: '#f6f6f6',
  layers: [
    // the rules
    rect([3, 3, 814, 6], 'wipe-right', 0),
    rect([3, 3, 6, 450], 'wipe-down', 0.05),
    rect([200, 3, 6, 450], 'wipe-down', 0.2),
    rect([3, 297, 814, 6], 'wipe-right', 0.15),
    rect([613, 3, 6, 450], 'wipe-down', 0.35),
    rect([3, 447, 814, 6], 'wipe-right', 0.3),
    rect([810, 3, 6, 450], 'wipe-down', 0.5),
    rect([3, 147, 203, 6], 'wipe-right', 0.45),
    rect([613, 147, 203, 6], 'wipe-right', 0.55),
    // lockup: the mark, then the wordmark from behind it
    rect([30, 38, 68, 80], 'pop', 0.9, 'breathe'),
    rect([99, 38, 92, 80], 'from-left', 1.05),
    // the title, line by line
    rect([210, 55, 401, 53], 'rise', 1),
    rect([210, 116, 401, 54], 'rise', 1.12),
    rect([210, 178, 401, 58], 'rise', 1.24),
    rect([210, 236, 401, 52], 'rise', 1.36),
    // the type specimen, line by line
    rect([26, 315, 172, 16], 'rise', 1.5),
    rect([26, 330, 172, 14], 'rise', 1.58),
    rect([26, 344, 172, 20], 'rise', 1.66),
    rect([26, 370, 172, 13], 'rise', 1.74),
    rect([26, 382, 172, 40], 'rise', 1.82),
    // the pattern tiles
    rect([337, 316, 46, 38], 'pop', 1.6, 'pulse'),
    rect([337, 354, 46, 32], 'pop', 1.68, 'pulse'),
    rect([337, 386, 46, 37], 'pop', 1.76, 'pulse'),
    rect([382, 315, 55, 108], 'pop', 1.84, 'pulse'),
    rect([437, 315, 46, 39], 'pop', 1.92, 'pulse'),
    rect([437, 354, 46, 25], 'pop', 2, 'pulse'),
    rect([437, 379, 46, 44], 'pop', 2.08, 'pulse'),
    // the colour split, the cards, the date
    { shape: { circle: [715, 79, 60] }, enter: 'spin', at: 1.2, loop: 'breathe' },
    rect([632, 326, 180, 95], 'from-right', 1.9, 'float'),
    rect([762, 431, 48, 16], 'fade', 2.3),
  ],
}

/* ---------- Identity deck, imagery and icons — 852 × 474 ------------- */

/** The photo grid's fifteen tiles, column by column: [x, width, [top, height]…]. */
const photoColumns: [number, number, [number, number][]][] = [
  [36, 106, [[95, 113], [208, 110], [318, 117]]],
  [143, 105, [[95, 162], [257, 178]]],
  [250, 104, [[95, 113], [208, 110], [318, 117]]],
  [356, 106, [[95, 113], [208, 110], [318, 117]]],
  [462, 108, [[95, 112], [207, 52], [259, 176]]],
]
const tileEntrances: DesignLayer['enter'][] = ['rise', 'from-left', 'drop', 'wipe-right', 'from-right']

/**
 * A mood board of photographs beside an icon set. Each photograph is masked in
 * from a different side on a diagonal cascade, then drifts at its own pace
 * inside its frame; each icon pops in and keeps a small gesture of its own —
 * the gear turns, the bulb glows, the rocket and speech bubble float.
 */
export const imagerySlideLayers: DesignMotion = {
  kind: 'layers',
  size: [852, 474],
  base: '#f6f6f6',
  layers: [
    // the frame
    rect([3, 3, 846, 7], 'wipe-right', 0),
    rect([3, 3, 8, 468], 'wipe-down', 0.1),
    rect([3, 463, 846, 8], 'wipe-right', 0.2),
    rect([841, 3, 8, 468], 'wipe-down', 0.3),
    // headings, line by line
    rect([34, 38, 226, 19], 'rise', 0.5),
    rect([34, 58, 226, 24], 'rise', 0.62),
    rect([593, 38, 226, 19], 'rise', 0.7),
    rect([593, 58, 226, 24], 'rise', 0.82),
    // photography
    ...photoColumns.flatMap(([x, w, tiles], column) =>
      tiles.map(([y, h], row) =>
        rect([x, y, w, h], tileEntrances[(column + row) % tileEntrances.length], 0.9 + (column + row) * 0.09, 'parallax'),
      ),
    ),
    // iconography
    rect([599, 102, 98, 92], 'pop', 1.9, 'sway'),
    rect([723, 101, 95, 94], 'pop', 2, 'glow'),
    rect([599, 218, 98, 87], 'pop', 2.1, 'breathe'),
    { shape: { circle: [770, 261.5, 48] }, enter: 'pop', at: 2.2, loop: 'spin' },
    rect([599, 333, 98, 101], 'pop', 2.3, 'float'),
    rect([723, 337, 95, 95], 'pop', 2.4, 'float'),
    rect([788, 448, 54, 14], 'fade', 2.5),
  ],
}
