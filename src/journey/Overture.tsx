import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Dim, EmailCapture, Stars } from '../components/ui'
import { state } from '../world/store'
import { useScrubber } from './useScrubber'

/**
 * THE OVERTURE — the pinned opening.
 *
 * House lights down. The arrival film plays full-bleed under a giant wordmark,
 * scrubbed by the scroll, then collapses into a card at the centre of a dark
 * room while the mark blurs away. The logo and headline assemble out of
 * nothing. The second film — convergence — floods out of that card to
 * full-bleed as the lights come up to white, and two story beats fly past the
 * camera before the live 3D world takes over for the journey.
 *
 * Both clips are Seedance 2.0 generations vendored into `public/footage/`, so
 * the hero can never 404 on someone else's CDN. See scripts/generate_footage.py.
 */

/* Phase boundaries in section progress (0…1). */
const MEGA_END = 0.22
const COLLAPSE_END = 0.32
const ASSEMBLE_END = 0.48
const HOLD_END = 0.56
const EXPAND_END = 0.68
/** Where the film hands over to the live world. */
const HANDOFF = 0.9

const BASE = import.meta.env.BASE_URL

type Rect = { top: number; left: number; width: number; height: number }

/** Card geometry at the centre of the collapse, in CSS pixels. */
function cardRect(): Rect {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = vw < 768 ? Math.min(vw * 0.6, 300) : Math.max(240, Math.min(vw * 0.28, 400))
  const h = w * (10 / 16)
  return { top: (vh - h) / 2 - vh * 0.04, left: (vw - w) / 2, width: w, height: h }
}

function fullRect(): Rect {
  return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
}

function lerpRect(a: Rect, b: Rect, t: number): Rect {
  return {
    top: a.top + (b.top - a.top) * t,
    left: a.left + (b.left - a.left) * t,
    width: a.width + (b.width - a.width) * t,
    height: a.height + (b.height - a.height) * t,
  }
}

function place(el: HTMLElement | null, r: Rect, radius: number) {
  if (!el) return
  el.style.top = `${r.top}px`
  el.style.left = `${r.left}px`
  el.style.width = `${r.width}px`
  el.style.height = `${r.height}px`
  el.style.borderRadius = `${radius}px`
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export function Overture() {
  const ref = useRef<HTMLElement>(null)
  const megaWrap = useRef<HTMLDivElement>(null)
  const heroWrap = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const megaVideo = useRef<HTMLVideoElement>(null)
  const heroVideo = useRef<HTMLVideoElement>(null)

  const scrubMega = useScrubber(megaVideo)
  const scrubHero = useScrubber(heroVideo)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const applyFrame = (p: number) => {
    const card = cardRect()
    const full = fullRect()

    // How closed the first film is: 0 = full bleed, 1 = card.
    let closed = 0
    if (p >= MEGA_END && p < COLLAPSE_END) closed = (p - MEGA_END) / (COLLAPSE_END - MEGA_END)
    else if (p >= COLLAPSE_END) closed = 1

    // How open the second film is: 0 = card, 1 = full bleed.
    let open = 0
    if (p >= HOLD_END && p < EXPAND_END) open = (p - HOLD_END) / (EXPAND_END - HOLD_END)
    else if (p >= EXPAND_END) open = 1

    place(megaWrap.current, lerpRect(full, card, smooth(closed)), 16 * smooth(closed))
    place(heroWrap.current, lerpRect(card, full, smooth(open)), 16 * (1 - smooth(open)))

    // Each film is scrubbed across the stretch it owns.
    scrubMega(Math.min(1, p / MEGA_END))
    scrubHero(Math.max(0, (p - HOLD_END) / (1 - HOLD_END)))

    // The wordmark is driven imperatively. Bound to motion values its opacity
    // and filter silently stopped tracking (transform kept working), and a
    // wordmark that never leaves sits on top of the whole story sequence.
    const m = mark.current
    if (m) {
      const k = smooth(
        Math.max(0, Math.min(1, (p - MEGA_END) / (COLLAPSE_END - MEGA_END))),
      )
      m.style.opacity = String(1 - k)
      m.style.filter = `blur(${(24 * k).toFixed(2)}px)`
      m.style.transform = `scale(${(1 - 0.45 * k).toFixed(4)})`
    }

    document.documentElement.dataset.stage = p < EXPAND_END - 0.06 ? 'dark' : 'light'
    state.heroDolly = 0
    state.overture = p < 0.98
  }

  useMotionValueEvent(scrollYProgress, 'change', applyFrame)

  useEffect(() => {
    // The event only fires on change, so the first frame — the one every
    // visitor lands on — has to be painted explicitly.
    applyFrame(scrollYProgress.get())
    const onResize = () => applyFrame(scrollYProgress.get())
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      document.documentElement.dataset.stage = 'light'
      state.overture = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── the room, and the handoff to the live world ────────────────────────── */
  const roomColor = useTransform(scrollYProgress, [HOLD_END, EXPAND_END], ['#05070c', '#ffffff'])
  const roomOpacity = useTransform(scrollYProgress, [HANDOFF, 1], [1, 0])
  const megaOpacity = useTransform(scrollYProgress, [HANDOFF, 1], [1, 0])
  // The second film sits at the card position from the start, so it has to stay
  // hidden until the first one has collapsed — otherwise it gives the reveal away.
  const heroFilmOpacity = useTransform(
    scrollYProgress,
    [COLLAPSE_END - 0.05, COLLAPSE_END, HANDOFF, 1],
    [0, 1, 1, 0],
  )

  /* ── the assembled hero ─────────────────────────────────────────────────── */
  const assemble = (from: number, to: number) => ({
    opacity: useTransform(scrollYProgress, [from, to, HOLD_END, EXPAND_END], [0, 1, 1, 0]),
    scale: useTransform(scrollYProgress, [from, to, HOLD_END, EXPAND_END], [0.4, 1, 1, 0.86]),
    filter: useTransform(
      scrollYProgress,
      [from, to, HOLD_END, EXPAND_END],
      ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(20px)'],
    ),
  })

  const logoIn = assemble(COLLAPSE_END + 0.02, ASSEMBLE_END - 0.04)
  const titleIn = assemble(COLLAPSE_END + 0.05, ASSEMBLE_END)
  const sideOpacity = useTransform(
    scrollYProgress,
    [COLLAPSE_END + 0.06, ASSEMBLE_END, HOLD_END, EXPAND_END - 0.02],
    [0, 1, 1, 0],
  )

  // Quiets the film under the closing beats so the copy reads.
  const storyScrim = useTransform(
    scrollYProgress,
    [EXPAND_END - 0.02, EXPAND_END + 0.03, 0.97, 1],
    [0, 0.84, 0.84, 0],
  )

  return (
    <section ref={ref} className="relative w-full" style={{ height: '520vh' }}>
      {/* The world camera starts travelling from here on. */}
      <div data-chapter={0} className="absolute left-0 h-px w-px" style={{ top: '94%' }} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* the room */}
        <motion.div
          aria-hidden
          style={{ background: roomColor, opacity: roomOpacity }}
          className="absolute inset-0 z-0"
        />

        {/* ── film 1 · arrival ─────────────────────────────────────────────── */}
        <motion.div
          ref={megaWrap}
          aria-hidden
          style={{ opacity: megaOpacity }}
          className="absolute z-[5] overflow-hidden bg-black/40"
        >
          <video
            ref={megaVideo}
            src={`${BASE}footage/arrival.mp4`}
            poster={`${BASE}footage/arrival.jpg`}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* ── film 2 · convergence ─────────────────────────────────────────── */}
        <motion.div
          ref={heroWrap}
          aria-hidden
          style={{ opacity: heroFilmOpacity }}
          className="absolute z-[6] overflow-hidden bg-black/40"
        >
          <video
            ref={heroVideo}
            src={`${BASE}footage/convergence.mp4`}
            poster={`${BASE}footage/convergence.jpg`}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* ── wordmark ─────────────────────────────────────────────────────── */}
        <div
          ref={mark}
          aria-hidden
          className="pointer-events-none absolute right-[clamp(20px,2.7vw,40px)] bottom-[clamp(24px,4vh,44px)] z-20 origin-bottom-right max-md:bottom-[132px]"
        >
          <span
            className="block text-[clamp(64px,12.2vw,180px)] leading-[0.8] text-white"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
            }}
          >
            singular
          </span>
        </div>

        {/* ── the assembled hero ───────────────────────────────────────────── */}
        {/* `md:contents` dissolves this wrapper on desktop so each child keeps
            its own absolute placement around the card; below md they stack. */}
        <div className="absolute inset-x-5 top-[calc(50%+min(60vw,300px)*0.3125+26px)] z-20 flex flex-col items-center gap-3 text-center md:contents">
          <motion.div
            style={{ opacity: logoIn.opacity, scale: logoIn.scale, filter: logoIn.filter }}
            className="pointer-events-none absolute top-[calc(50%-4vh-min(28vw,400px)*0.3125-22px)] left-[calc(50%-min(28vw,400px)/2-56px)] z-20 max-md:static"
          >
            <span className="block h-[34px] w-[34px]">
              <svg viewBox="0 0 34 34" aria-hidden>
                <polygon points="17,10 25.6,15 17,20 8.4,15" fill="#5B8DEF" />
                <polygon points="8.4,15 17,20 17,30 8.4,25" fill="#9B7BF0" />
                <polygon points="17,20 25.6,15 25.6,25 17,30" fill="#F07BC8" />
                <circle cx="17" cy="20" r="3.1" fill="#F0F1F3" />
              </svg>
            </span>
          </motion.div>

          <motion.h1
            style={{ opacity: titleIn.opacity, scale: titleIn.scale, filter: titleIn.filter }}
            className="display pointer-events-none absolute top-[calc(50%+4vh)] left-[calc(50%+min(28vw,400px)/2+clamp(16px,2vw,32px))] z-20 w-[clamp(220px,30vw,440px)] text-[clamp(28px,4.6vw,64px)] text-white max-md:static max-md:w-full max-md:text-[34px]"
          >
            The <Dim>singular</Dim> moment is now here.
          </motion.h1>

          <motion.p
            style={{ opacity: sideOpacity }}
            className="pointer-events-none absolute top-[calc(50%-4vh-min(28vw,400px)*0.3125-4px)] left-[clamp(20px,2.7vw,40px)] z-20 w-[clamp(220px,25.6vw,377px)] text-[14px] leading-[1.35] font-medium text-white/85 max-md:static max-md:w-full"
          >
            The AI-powered programmatic exchange. Premium inventory, creative
            technology, and intelligent decisioning — unified in one platform for
            publishers and advertisers.
          </motion.p>

          <motion.div
            style={{ opacity: sideOpacity }}
            className="absolute bottom-[clamp(24px,4vh,44px)] left-[clamp(20px,2.7vw,40px)] z-20 flex flex-col gap-4 max-md:static max-md:w-full max-md:items-center"
          >
            <div className="w-[min(520px,86vw)]">
              <EmailCapture id="overture-email" />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 max-md:justify-center">
              <Stars />
              <span className="text-[13px] text-white/75 max-md:text-[11px]">
                54B+ impressions/day · 180+ countries · Zero resold inventory
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── story beats ──────────────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          style={{ opacity: storyScrim }}
          className="pointer-events-none absolute inset-0 z-10 bg-white"
        />

        <Beat p={scrollYProgress} word="Attention." from={0.69} span={0.04} />
        <Bars p={scrollYProgress} from={0.775} />
        <Caption p={scrollYProgress} from={0.785} to={0.86}>
          Verified attention scores. Higher recall, lift, purchase intent.
        </Caption>

        <Beat p={scrollYProgress} word="Singular." from={0.865} span={0.035} />
        <Route p={scrollYProgress} from={0.9} />
        <Caption p={scrollYProgress} from={0.93} to={0.999}>
          One exchange. One integration. One unified view.
        </Caption>
      </div>
    </section>
  )
}

/* ── a word flying past the camera ────────────────────────────────────────── */

function Beat({
  p,
  word,
  from,
  span = 0.05,
}: {
  p: MotionValue<number>
  word: string
  from: number
  span?: number
}) {
  const IN = span
  const OUT = span
  const opacity = useTransform(p, [from, from + IN, from + IN + OUT], [0, 1, 0])
  const z = useTransform(p, [from, from + IN + OUT], [-160, 240])
  const scale = useTransform(p, [from, from + IN, from + IN + OUT], [0.9, 1, 1.08])
  const filter = useTransform(
    p,
    [from, from + IN, from + IN + OUT],
    ['blur(12px)', 'blur(0px)', 'blur(12px)'],
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ perspective: 1000 }}
    >
      <motion.span
        style={{ opacity, z, scale, filter }}
        className="display text-center text-[clamp(48px,9vw,168px)] leading-[0.9] text-ink"
      >
        {word}
      </motion.span>
    </div>
  )
}

/* ── the attention bars ───────────────────────────────────────────────────── */

const BAR_COUNT = 27
const TINTS = ['#5B8DEF', '#9B7BF0', '#F07BC8', '#FF8A5B']

function Bars({ p, from }: { p: MotionValue<number>; from: number }) {
  const host = useRef<SVGSVGElement>(null)
  const SPAN = 0.085
  const opacity = useTransform(
    p,
    [from, from + 0.03, from + SPAN - 0.03, from + SPAN],
    [0, 1, 1, 0],
  )

  useMotionValueEvent(p, 'change', (v) => {
    const svg = host.current
    if (!svg) return
    const k = (v - from) / SPAN
    if (k < -0.1 || k > 1.1) return
    const clamped = Math.max(0, Math.min(1, k))
    // Ramp in and out at the edges so the bars grow and settle rather than pop.
    const EDGE = 0.22
    const env =
      clamped < EDGE ? clamped / EDGE : clamped > 1 - EDGE ? (1 - clamped) / EDGE : 1
    const bars = svg.querySelectorAll<SVGRectElement>('rect')
    bars.forEach((bar, i) => {
      const dance = state.reduced
        ? 1
        : 0.5 + 0.5 * Math.abs(Math.sin(clamped * Math.PI * 3 + i * 0.5))
      bar.style.transform = `scaleY(${(env * dance).toFixed(4)})`
    })
  })

  const W = 600
  const H = 200
  const BAR_W = 8
  const GAP = (W - BAR_COUNT * BAR_W) / (BAR_COUNT - 1)

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      <svg ref={host} viewBox={`0 0 ${W} ${H}`} className="w-[clamp(300px,42vw,560px)]">
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const t = i / (BAR_COUNT - 1)
          const barH = (0.18 + 0.82 * Math.sin(t * Math.PI)) * H * 0.9
          return (
            <rect
              key={i}
              x={i * (BAR_W + GAP)}
              y={(H - barH) / 2}
              width={BAR_W}
              height={barH}
              rx={BAR_W / 2}
              fill={TINTS[i % TINTS.length]}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: 'scaleY(0)',
              }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ── the supply path ──────────────────────────────────────────────────────── */

function Route({ p, from }: { p: MotionValue<number>; from: number }) {
  const SPAN = 0.062
  const opacity = useTransform(p, [from, from + 0.03, from + SPAN], [0, 1, 1])
  const draw = useTransform(p, [from + 0.01, from + SPAN], [1, 0])
  const dot1 = useTransform(p, [from + 0.03, from + 0.05], [0, 1])
  const dot2 = useTransform(p, [from + 0.05, from + 0.07], [0, 1])
  const dot3 = useTransform(p, [from + 0.07, from + 0.09], [0, 1])

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      <svg viewBox="0 0 620 240" className="w-[clamp(300px,42vw,560px)]">
        <motion.path
          d="M 40 170 C 160 170 210 84 310 84 C 410 84 460 170 580 170"
          stroke="#0b0b12"
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: draw }}
        />
        {(
          [
            [40, 170, dot1, '#5B8DEF'],
            [310, 84, dot2, '#9B7BF0'],
            [580, 170, dot3, '#F07BC8'],
          ] as const
        ).map(([cx, cy, o, fill], i) => (
          <motion.g key={i} style={{ opacity: o, scale: o, transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r={26} fill={fill} />
            <path
              d={`M ${cx - 10} ${cy + 1} L ${cx - 3} ${cy + 8} L ${cx + 11} ${cy - 7}`}
              stroke="#fff"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  )
}

/* ── beat captions ────────────────────────────────────────────────────────── */

function Caption({
  p,
  from,
  to,
  children,
}: {
  p: MotionValue<number>
  from: number
  to: number
  children: React.ReactNode
}) {
  const opacity = useTransform(p, [from, from + 0.02, to - 0.02, to], [0, 1, 1, 0])
  const y = useTransform(p, [from, from + 0.02], [20, 0])

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute bottom-[clamp(28px,5vh,56px)] left-[clamp(20px,2.7vw,40px)] z-30 flex w-[min(377px,calc(100%-80px))] flex-col items-start gap-4"
    >
      <span className="h-4 w-4 rounded-full bg-linear-to-br from-blue to-pink" />
      <p className="text-[14px] leading-[1.35] font-medium text-ink" style={{ margin: 0 }}>
        {children}
      </p>
    </motion.div>
  )
}
