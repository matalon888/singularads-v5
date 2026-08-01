import { useEffect, useRef, type RefObject } from 'react'

/**
 * Scroll-scrubbed video playback.
 *
 * Setting `currentTime` on every scroll frame is what naive scrub
 * implementations do, and it stalls hard — Safari and iOS queue seeks and drop
 * frames until the element is unusable. So every write is gated on the element
 * not already seeking: the newest target is held as `pending` and applied when
 * the previous `seeked` lands. Stale targets are simply overwritten, which is
 * exactly what you want while someone is flicking the scrollbar.
 *
 * Two more details that matter in practice:
 *  - The first frame is held (paused at ~0) so the element never shows black.
 *  - The decoder is warmed with one throwaway seek, because the first real seek
 *    after load is otherwise slow enough to be visible.
 */
export function useScrubber(ref: RefObject<HTMLVideoElement | null>) {
  const pending = useRef<number | null>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    const holdFirstFrame = () => {
      try {
        v.pause()
        if (v.currentTime < 0.001) v.currentTime = 0.001
      } catch {
        /* not ready yet; loadedmetadata will call us again */
      }
    }

    let warmed = false
    const warm = () => {
      if (warmed || !v.duration || Number.isNaN(v.duration)) return
      warmed = true
      const restore = () => {
        v.removeEventListener('seeked', restore)
        try {
          if (v.currentTime > 0.05) v.currentTime = 0.001
        } catch {
          /* ignore */
        }
      }
      v.addEventListener('seeked', restore)
      try {
        v.currentTime = Math.min(0.12, v.duration * 0.03)
      } catch {
        warmed = false
      }
    }

    const applyPending = () => {
      if (pending.current === null) return
      const t = pending.current
      pending.current = null
      if (Math.abs(v.currentTime - t) < 0.01) return
      try {
        v.currentTime = t
      } catch {
        /* ignore */
      }
    }

    v.addEventListener('loadedmetadata', holdFirstFrame)
    v.addEventListener('canplay', warm)
    v.addEventListener('seeked', applyPending)
    if (v.readyState >= 1) holdFirstFrame()
    if (v.readyState >= 3) warm()

    return () => {
      v.removeEventListener('loadedmetadata', holdFirstFrame)
      v.removeEventListener('canplay', warm)
      v.removeEventListener('seeked', applyPending)
    }
  }, [ref])

  /** Seek to a normalised position, 0…1. Safe to call every frame. */
  return (p: number) => {
    const v = ref.current
    if (!v) return
    const d = v.duration
    if (!d || Number.isNaN(d) || v.readyState < 1) return
    if (!v.paused) v.pause()
    const target = Math.min(d - 0.05, Math.max(0, p * d))
    if (!v.seeking && Math.abs(v.currentTime - target) < 0.03) return
    pending.current = target
    if (!v.seeking) {
      const t = pending.current
      pending.current = null
      try {
        v.currentTime = t
      } catch {
        /* ignore */
      }
    }
  }
}
