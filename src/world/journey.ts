import * as THREE from 'three'

/**
 * THE JOURNEY — a single continuous world, twelve chapters deep.
 *
 * Scroll does not move a page; it moves a camera along a spline through a white
 * infinite world. Each chapter's set is anchored slightly ahead of its waypoint
 * so it emerges out of the fog, grows, and is passed through. The HTML copy
 * rides above as pinned overlays.
 */

export const CHAPTERS = [
  { id: 'arrival', label: 'Arrival' },
  { id: 'fold', label: 'The Fold' },
  { id: 'waterfall', label: 'The Waterfall' },
  { id: 'foundry', label: 'The Foundry' },
  { id: 'formats', label: 'The Format Room' },
  { id: 'exchange', label: 'The Exchange' },
  { id: 'stack', label: 'The Stack' },
  { id: 'attention', label: 'The Attention Field' },
  { id: 'manifesto', label: 'The Quiet' },
  { id: 'trust', label: 'The Archive' },
  { id: 'gateway', label: 'The Gateway' },
  { id: 'singular', label: 'The Singular Point' },
] as const

export const N = CHAPTERS.length

/**
 * Camera waypoints — one per chapter, in world space.
 *
 * The z spacing is deliberately large (~150 units). Packed any tighter, every
 * set bleeds into its neighbours and the camera flies straight through the
 * scenery instead of approaching it: one set per view is the whole point.
 */
const WAYPOINTS: [number, number, number][] = [
  [0, 2, 40], // 0  arrival — floating in the field
  [8, 14, -108], // 1  climbing above the fold plane…
  [-9, -16, -258], // 2  …then dropped beneath it, into the graveyard
  [17, 4, -408], // 3  swung out alongside the waterfall
  [-15, 6, -558], // 4  around the foundry
  [12, 3, -708], // 5  through the format room
  [-20, 9, -858], // 6  a wide arc around the exchange
  [0, 34, -1008], // 7  high above the stack
  [3, -9, -1158], // 8  fallen through it, over the attention field
  [-12, 5, -1308], // 9  the quiet
  [10, 3, -1458], // 10 the archive
  [0, 1, -1614], // 11 approach to the singular point
]

export const cameraCurve = new THREE.CatmullRomCurve3(
  WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'catmullrom',
  0.32,
)

/** u for the centre of chapter i. CatmullRom hits waypoint i exactly here. */
export const chapterU = (i: number) => i / (N - 1)

const LOOK_AHEAD = 0.028

const _tan = new THREE.Vector3()
const CURVE_LENGTH = cameraCurve.getLength()

/**
 * Point on the path, extrapolated past the end.
 *
 * Everything here looks *ahead* of the camera, so the final chapter would
 * otherwise clamp to u = 1 — putting its set exactly where the camera is and
 * leaving lookAt with no direction at all. Past the end we continue along the
 * closing tangent instead.
 */
export function pointAt(u: number, out: THREE.Vector3) {
  if (u <= 1) return cameraCurve.getPoint(u, out)
  cameraCurve.getPoint(1, out)
  cameraCurve.getTangent(1, _tan)
  return out.addScaledVector(_tan, (u - 1) * CURVE_LENGTH)
}

/** Where the camera should be looking at parameter u. */
export function lookAtPoint(u: number, out: THREE.Vector3) {
  return pointAt(u + LOOK_AHEAD, out)
}

/** Where chapter i's set is built — just ahead of its waypoint, so you fly into it. */
export function chapterAnchor(i: number): THREE.Vector3 {
  return pointAt(chapterU(i) + LOOK_AHEAD * 1.35, new THREE.Vector3())
}

/**
 * Cinematic pacing: ease each inter-chapter segment so the camera accelerates
 * out of a chapter, cruises, then settles into the next one. Without this the
 * travel is a constant, characterless glide.
 */
export function paceU(u: number): number {
  const seg = 1 / (N - 1)
  const i = Math.min(N - 2, Math.floor(u / seg))
  const t = (u - i * seg) / seg
  const eased = t * t * (3 - 2 * t)
  return (i + eased) * seg
}

/** Deterministic PRNG — the world composes identically on every visit. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
