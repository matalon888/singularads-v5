import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'

/* ── reduced motion ───────────────────────────────────────────────────────── */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ── scroll reveal ────────────────────────────────────────────────────────────
   Our own IntersectionObserver rather than Motion's whileInView: anything that
   cannot be observed resolves to visible, so copy is never gated behind an
   animation that may not run. */

function useInView<T extends HTMLElement>(rootMargin = '-12% 0px -8% 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (seen || !ref.current || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen, rootMargin])

  return [ref, seen] as const
}

const EASE = [0.16, 1, 0.3, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y, rotateX: 6 }}
      animate={seen || reduced ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

const StaggerCtx = createContext<{ seen: boolean; stagger: number }>({
  seen: true,
  stagger: 0.08,
})

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={className}>
      <StaggerCtx.Provider value={{ seen, stagger }}>{children}</StaggerCtx.Provider>
    </div>
  )
}

let itemSeq = 0

export function RevealItem({
  children,
  className,
  index,
}: {
  children: ReactNode
  className?: string
  index?: number
}) {
  const { seen, stagger } = useContext(StaggerCtx)
  const reduced = usePrefersReducedMotion()
  const i = useRef(index ?? itemSeq++ % 12).current
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 34, rotateX: 10 }}
      animate={seen || reduced ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      transition={{ duration: 0.85, ease: EASE, delay: i * stagger }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

/* ── word-by-word 3D flip-up ─────────────────────────────────────────────── */

export function FlipWords({
  children,
  className,
  delay = 0,
  style,
}: {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
}) {
  const reduced = usePrefersReducedMotion()
  const nodes = Array.isArray(children) ? children : [children]
  let k = 0
  return (
    <span className={className} style={{ perspective: 900, ...style }}>
      {nodes.map((node, ni) => {
        if (typeof node !== 'string') {
          const idx = k++
          return (
            <motion.span
              key={`n${ni}`}
              className="inline-block"
              initial={reduced ? false : { opacity: 0, y: '0.5em', rotateX: -85 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + idx * 0.07 }}
              style={{ transformOrigin: 'bottom center' }}
            >
              {node}
            </motion.span>
          )
        }
        return node.split(/(\s+)/).map((w, wi) => {
          if (!w.trim()) return <span key={`s${ni}-${wi}`}> </span>
          const idx = k++
          return (
            <motion.span
              key={`w${ni}-${wi}`}
              className="inline-block"
              initial={reduced ? false : { opacity: 0, y: '0.5em', rotateX: -85 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + idx * 0.07 }}
              style={{ transformOrigin: 'bottom center' }}
            >
              {w}
            </motion.span>
          )
        })
      })}
    </span>
  )
}

/* ── the dimensional word ─────────────────────────────────────────────────────
   One word per heading, extruded with a stack of offset layers, the face
   carrying an accent gradient. Skews toward the pointer. */

const EXTRUDE = Array.from({ length: 8 }, (_, i) => i + 1)

export function Dim({
  children,
  className,
  tint = 'blue',
}: {
  children: string
  className?: string
  tint?: 'blue' | 'violet' | 'pink' | 'coral'
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 140, damping: 18 })
  const sry = useSpring(ry, { stiffness: 140, damping: 18 })
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      ry.set(dx * 26)
      rx.set(-dy * 12)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rx, ry, reduced])

  const gradients: Record<string, string> = {
    blue: 'linear-gradient(96deg, #5b8def 0%, #9b7bf0 62%, #f07bc8 100%)',
    violet: 'linear-gradient(96deg, #9b7bf0 0%, #f07bc8 58%, #ff8a5b 100%)',
    pink: 'linear-gradient(96deg, #f07bc8 0%, #ff8a5b 60%, #5b8def 100%)',
    coral: 'linear-gradient(96deg, #ff8a5b 0%, #f07bc8 55%, #9b7bf0 100%)',
  }

  return (
    <span
      className={`relative inline-block align-baseline ${className ?? ''}`}
      style={{ perspective: 900 }}
      ref={ref}
    >
      <motion.span
        className="relative inline-block"
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      >
        {/* extrusion */}
        {EXTRUDE.map((i) => (
          <span
            key={i}
            aria-hidden
            className="absolute inset-0 select-none"
            style={{
              transform: `translate3d(${i * 1.4}px, ${i * 1.4}px, ${-i}px)`,
              color: `rgba(11,11,18,${0.16 - i * 0.017})`,
            }}
          >
            {children}
          </span>
        ))}
        {/* face */}
        <span
          className="relative bg-clip-text text-transparent"
          style={{ backgroundImage: gradients[tint] }}
        >
          {children}
        </span>
      </motion.span>
    </span>
  )
}

/* ── magnetic buttons ─────────────────────────────────────────────────────── */

function useMagnet(strength = 6) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 20 })
  const sy = useSpring(y, { stiffness: 260, damping: 20 })

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * strength * 2)
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * strength * 2)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }
  return { ref, sx, sy, onMove, onLeave }
}

export function InkButton({
  children,
  href,
  className = '',
  size = 'md',
}: {
  children: ReactNode
  href: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const { ref, sx, sy, onMove, onLeave } = useMagnet()
  const h = size === 'sm' ? 'h-[42px] px-5 text-[13px]' : 'h-[52px] px-7 text-[14px]'
  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-b from-[#33333d] via-[#18181f] to-[#0b0b12] font-medium text-white shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24),0_14px_30px_-12px_rgba(11,11,18,0.55)] ${h} ${className}`}
    >
      {children}
    </motion.a>
  )
}

export function GhostButton({
  children,
  href,
  className = '',
}: {
  children: ReactNode
  href: string
  className?: string
}) {
  const { ref, sx, sy, onMove, onLeave } = useMagnet(4)
  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 text-[14px] font-medium text-ink shadow-[0_10px_30px_-14px_rgba(11,11,18,0.35)] ${className}`}
    >
      {children}
    </motion.a>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 8h9m0 0L9 4.5M12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── pointer-tilted card ──────────────────────────────────────────────────── */

export function Tilt({
  children,
  className = '',
  max = 9,
  lift = 6,
}: {
  children: ReactNode
  className?: string
  max?: number
  lift?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const z = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const sz = useSpring(z, { stiffness: 200, damping: 22 })
  const reduced = usePrefersReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
    z.set(lift)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    z.set(0)
  }

  return (
    <div className={`stage h-full ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          rotateX: srx,
          rotateY: sry,
          y: useTransform(sz, (v) => -v),
          transformStyle: 'preserve-3d',
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── count-up figures ─────────────────────────────────────────────────────── */

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}) {
  const [ref, seen] = useInView<HTMLSpanElement>('-20% 0px')
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!seen || reduced) {
      if (reduced) setN(value)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      setN(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, value, reduced])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ── section furniture ────────────────────────────────────────────────────── */

export function Section({
  id,
  children,
  className = '',
  bone = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  bone?: boolean
}) {
  return (
    <section
      id={id}
      className={`relative w-full px-6 py-[92px] md:py-[130px] ${bone ? 'bg-bone' : 'bg-white'} ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

export function Stars({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease: EASE }}
        >
          <path
            d="M10 1.6l2.47 5.3 5.53.67-4.08 3.9 1.06 5.6L10 14.3l-4.98 2.77 1.06-5.6-4.08-3.9 5.53-.67L10 1.6z"
            fill="#FF8A5B"
          />
        </motion.svg>
      ))}
    </div>
  )
}

/* ── scroll progress rail ─────────────────────────────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-blue via-violet to-coral"
    />
  )
}

/* ── email capture ────────────────────────────────────────────────────────── */

export function EmailCapture({ id }: { id: string }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-[520px] items-center gap-2 rounded-[40px] border border-black/8 bg-[#fcfcfc] p-[6px] pl-6 shadow-[var(--shadow-pill)]"
    >
      <label htmlFor={id} className="sr-only">
        Your work email
      </label>
      <input
        id={id}
        type="email"
        required
        placeholder="Your work email"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-[#9a9da8]"
        style={{ letterSpacing: '-0.01em' }}
      />
      <button
        type="submit"
        className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#33333d] via-[#18181f] to-[#0b0b12] px-6 text-[14px] font-medium text-white shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] transition-transform duration-300 hover:-translate-y-px active:translate-y-0"
        style={{ letterSpacing: '-0.01em' }}
      >
        Request a Demo
      </button>
    </form>
  )
}
