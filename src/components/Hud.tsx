import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CHAPTERS, N } from '../world/journey'
import { onChapter, state } from '../world/store'

/**
 * The travel HUD. A chapter rail down the left edge tells the visitor where in
 * the world they are and how far is left — the thing that turns scrolling into
 * travelling.
 */
export function Hud() {
  const [chapter, setChapter] = useState(0)
  const [overture, setOverture] = useState(true)

  useEffect(() => {
    const off = onChapter(setChapter)
    const onScroll = () => setOverture((v) => (v === state.overture ? v : state.overture))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      off()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-y-0 left-0 z-40 hidden items-center pl-7 transition-opacity duration-500 lg:flex ${
        overture ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <ol className="flex flex-col gap-[10px]">
        {CHAPTERS.map((c, i) => {
          const active = i === chapter
          const passed = i < chapter
          return (
            <li key={c.id} className="flex items-center gap-3">
              <span className="relative flex h-[7px] w-[7px] items-center justify-center">
                <motion.span
                  animate={{
                    scale: active ? 1 : 0.55,
                    opacity: active ? 1 : passed ? 0.42 : 0.16,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={`block h-[7px] w-[7px] rounded-full ${
                    active ? 'bg-linear-to-br from-blue to-pink' : 'bg-ink'
                  }`}
                />
                {active && (
                  <motion.span
                    layoutId="hud-ring"
                    className="absolute h-[17px] w-[17px] rounded-full border border-ink/25"
                  />
                )}
              </span>

              <AnimatePresence initial={false}>
                {active && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.35 }}
                    className="font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-ink/60 uppercase"
                  >
                    {String(i + 1).padStart(2, '0')} · {c.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** "Scroll to travel" — shown once, then never again. */
export function TravelCue() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const off = onChapter((c) => c > 0 && setGone(true))
    const onScroll = () => window.scrollY > 120 && setGone(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      off()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="pointer-events-none fixed inset-x-0 bottom-7 z-40 hidden flex-col items-center gap-2 md:flex"
        >
          <span className="travel-cue font-mono text-[10px] tracking-[0.22em] text-ink/45 uppercase">
            Scroll to travel
          </span>
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-[26px] w-px bg-linear-to-b from-ink/40 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** A thin rail of overall progress through the world. */
export function TravelProgress() {
  const [chapter, setChapter] = useState(0)
  useEffect(() => {
    const off = onChapter(setChapter)
    return () => void off()
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <motion.div
        animate={{ scaleX: (chapter + (state.local || 0)) / (N - 1) }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-full origin-left bg-linear-to-r from-blue via-violet to-coral"
      />
    </div>
  )
}
