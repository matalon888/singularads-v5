import { N } from './journey'

/**
 * A module-level scroll store. The world reads it every frame from useFrame;
 * nothing here triggers a React render. The HUD subscribes on chapter change
 * only, so travelling never re-renders the tree.
 */

type Listener = (chapter: number) => void

export const state = {
  /** 0…1 along the camera curve. */
  u: 0,
  /** Nearest chapter index. */
  chapter: 0,
  /** Progress within the current chapter, 0…1. */
  local: 0,
  /** Pointer in NDC (-1…1). */
  px: 0,
  py: 0,
  /** Set when the visitor grabs the core. */
  burst: 0,
  reduced: false,
}

const listeners = new Set<Listener>()

export function onChapter(fn: Listener) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit(chapter: number) {
  if (chapter === state.chapter) return
  state.chapter = chapter
  for (const fn of listeners) fn(chapter)
}

/**
 * Measure the DOM anchors ([data-chapter]) and build a piecewise map from page
 * scroll to curve parameter. Anchoring to real elements — rather than assuming
 * every chapter is the same height — keeps the world in step with the copy no
 * matter how tall a section grows.
 */
let stops: number[] = []

export function measure() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-chapter]'),
  ).sort((a, b) => Number(a.dataset.chapter) - Number(b.dataset.chapter))

  const next: number[] = []
  for (const el of els) {
    const i = Number(el.dataset.chapter)
    const r = el.getBoundingClientRect()
    // Align the chapter's centre with the middle of the viewport.
    next[i] = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2
  }
  // Fill any gaps so the map is always monotonic and complete.
  for (let i = 0; i < N; i++) {
    if (next[i] === undefined) next[i] = i === 0 ? 0 : next[i - 1]
    if (i > 0 && next[i] < next[i - 1]) next[i] = next[i - 1]
  }
  stops = next
}

export function updateFromScroll() {
  if (stops.length < 2) return
  const y = window.scrollY
  const last = stops[N - 1]

  if (y <= stops[0]) {
    state.u = 0
    state.local = 0
    emit(0)
    return
  }
  if (y >= last) {
    state.u = 1
    state.local = 1
    emit(N - 1)
    return
  }

  let i = 0
  while (i < N - 2 && y >= stops[i + 1]) i++
  const span = Math.max(1, stops[i + 1] - stops[i])
  const t = (y - stops[i]) / span
  state.u = (i + t) / (N - 1)
  state.local = t
  emit(t > 0.5 ? i + 1 : i)
}
