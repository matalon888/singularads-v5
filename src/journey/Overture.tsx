import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Logo } from '../components/Logo'
import { Dim, EmailCapture, Stars } from '../components/ui'
import { state } from '../world/store'

/**
 * THE OVERTURE — the pinned opening.
 *
 * House lights down. The world plays full-bleed under a giant wordmark, then
 * collapses into a card at the centre of a dark room while the mark blurs away.
 * The logo and headline assemble out of nothing. Then the card floods back to
 * full-bleed, the lights come up to white, and two story beats fly past the
 * camera before the journey proper takes over.
 *
 * The "media" is the live WebGL world, not a video: it is ours, it never 404s,
 * and it means the opening and the journey are literally the same scene.
 */

/* Phase boundaries in section progress (0…1). */
const MEGA_END = 0.22
const COLLAPSE_END = 0.32
const ASSEMBLE_END = 0.48
const HOLD_END = 0.56
const EXPAND_END = 0.68

const EASE = [0.16, 1, 0.3, 1] as const

/** Card geometry at the centre of the collapse, in CSS pixels. */
function cardRect() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = vw < 768 ? Math.min(vw * 0.6, 300) : Math.max(240, Math.min(vw * 0.28, 400))
  const h = w * (10 / 16)
  return {
    top: (vh - h) / 2 - vh * 0.04,
    left: (vw - w) / 2,
    right: (vw - w) / 2,
    bottom: (vh + h) / 2 + vh * 0.04 > vh ? 0 : vh - ((vh - h) / 2 - vh * 0.04) - h,
  }
}

export function Overture() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* ── the world frame: clip + scale, written straight to the DOM ─────────── */
  const applyFrame = (p: number) => {
    const clip = document.getElementById('world-clip')
    const scale = document.getElementById('world-scale')
    const veil = document.getElementById('stage-veil')
    if (!clip || !scale || !veil) return

    // How closed the frame is: 0 = full bleed, 1 = card.
    let closed = 0
    if (p >= MEGA_END && p < COLLAPSE_END) closed = (p - MEGA_END) / (COLLAPSE_END - MEGA_END)
    else if (p >= COLLAPSE_END && p < HOLD_END) closed = 1
    else if (p >= HOLD_END && p < EXPAND_END) closed = 1 - (p - HOLD_END) / (EXPAND_END - HOLD_END)

    const e = closed * closed * (3 - 2 * closed)
    const r = cardRect()
    clip.style.clipPath = `inset(${r.top * e}px ${r.right * e}px ${r.bottom * e}px ${r.left * e}px round ${16 * e}px)`
    scale.style.transform = `scale(${1 - e * 0.14})`

    // Our canvas is transparent, so a clipped frame alone would read as blocks
    // floating in the dark rather than a lit panel. The card needs a surface.
    clip.style.background = e > 0.001 ? `rgba(14,18,30,${e})` : 'transparent'

    // House lights: down for the reveal, up into the white world.
    const lit = p <= HOLD_END ? 1 : Math.max(0, 1 - (p - HOLD_END) / (EXPAND_END - HOLD_END))
    veil.style.background = '#05070c'
    veil.style.opacity = String(lit)
    document.documentElement.dataset.stage = lit > 0.5 ? 'dark' : 'light'

    // Slow forward push through the field, easing off as the frame closes.
    state.heroDolly = Math.min(1, p / MEGA_END) * (1 - e * 0.6)
    state.overture = p < 0.98
  }

  useMotionValueEvent(scrollYProgress, 'change', applyFrame)

  useEffect(() => {
    // The event only fires on change, so the very first frame — the one every
    // visitor lands on — has to be painted explicitly.
    applyFrame(scrollYProgress.get())
    const onResize = () => applyFrame(scrollYProgress.get())
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      // Leave the page in its normal state if the overture ever unmounts.
      const clip = document.getElementById('world-clip')
      const scale = document.getElementById('world-scale')
      const veil = document.getElementById('stage-veil')
      if (clip) {
        clip.style.clipPath = ''
        clip.style.background = 'transparent'
      }
      if (scale) scale.style.transform = ''
      if (veil) veil.style.opacity = '0'
      document.documentElement.dataset.stage = 'light'
      state.heroDolly = 0
      state.overture = false
    }
  }, [])

  /* ── the giant wordmark ─────────────────────────────────────────────────── */
  const markOpacity = useTransform(scrollYProgress, [0, MEGA_END, COLLAPSE_END], [1, 1, 0])
  const markScale = useTransform(scrollYProgress, [MEGA_END, COLLAPSE_END], [1, 0.55])
  const markBlur = useTransform(
    scrollYProgress,
    [MEGA_END, COLLAPSE_END],
    ['blur(0px)', 'blur(24px)'],
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
  // Quiets the world under the closing beats, then clears for the handoff.
  const storyScrim = useTransform(
    scrollYProgress,
    [EXPAND_END - 0.02, EXPAND_END + 0.03, 0.97, 1],
    [0, 0.72, 0.72, 0],
  )
  const sideOpacity = useTransform(
    scrollYProgress,
    [COLLAPSE_END + 0.06, ASSEMBLE_END, HOLD_END, EXPAND_END - 0.02],
    [0, 1, 1, 0],
  )

  return (
    <section ref={ref} className="relative w-full" style={{ height: '520vh' }}>
      {/* The world camera starts travelling from here on. */}
      <div data-chapter={0} className="absolute left-0 h-px w-px" style={{ top: '92%' }} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── wordmark ─────────────────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          style={{ opacity: markOpacity, scale: markScale, filter: markBlur }}
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
        </motion.div>

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
        <Route p={scrollYProgress} from={0.90} />
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
