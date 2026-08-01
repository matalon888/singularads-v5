import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'

/**
 * A beat in the journey. Copy rides over the world in a soft white scrim so it
 * always reads, and is staged as entrance → hold → exit rather than simply
 * appearing. `chapter` binds this block to a camera waypoint (see world/store).
 */
export function Chapter({
  chapter,
  id,
  children,
  className = '',
  align = 'center',
  scrim = true,
  tall = true,
}: {
  chapter: number
  id?: string
  children: ReactNode
  className?: string
  align?: 'center' | 'left' | 'right'
  scrim?: boolean
  tall?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.intersectionRatio > 0.12),
      { threshold: [0, 0.12, 0.5] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const place =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-center text-center'

  return (
    <section
      ref={ref}
      id={id}
      data-chapter={chapter}
      className={`relative z-10 flex w-full overflow-x-clip ${tall ? 'min-h-screen' : ''} items-center justify-center px-6 py-[15vh] lg:pl-[104px] ${className}`}
    >
      <div className={`relative flex w-full max-w-[1200px] flex-col ${place}`}>
        {scrim && (
          /* A frosted plate, not a white wash. The world stays visible — and
             coloured — through the copy; blurring it is what makes the type
             readable without deleting the scene behind it. */
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-[9vw] -inset-y-[9vh] -z-10"
            style={{
              backdropFilter: 'blur(18px) saturate(1.15)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.15)',
              background:
                'radial-gradient(58% 50% at 50% 50%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.66) 52%, rgba(255,255,255,0) 84%)',
              maskImage:
                'radial-gradient(58% 50% at 50% 50%, #000 0%, #000 54%, transparent 86%)',
              WebkitMaskImage:
                'radial-gradient(58% 50% at 50% 50%, #000 0%, #000 54%, transparent 86%)',
            }}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 44, filter: 'blur(6px)' }}
          animate={
            visible
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 22, filter: 'blur(5px)' }
          }
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`flex w-full flex-col ${place}`}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

/** A chapter that carries dense content (card grids) rather than a single beat. */
export function Panel({
  chapter,
  id,
  children,
  className = '',
}: {
  /** Omit when the panel is extra content for a chapter that is already anchored. */
  chapter?: number
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      data-chapter={chapter}
      className={`relative z-10 w-full overflow-x-clip px-6 py-[13vh] lg:pl-[104px] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 12%, rgba(255,255,255,0.94) 88%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  )
}
