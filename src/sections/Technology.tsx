import { useEffect, useRef, useState, type ComponentType } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import {
  IlloAgent,
  IlloAttentionGauge,
  IlloIdentityGraph,
  IlloLatency,
  IlloSceneScan,
  IlloVault,
} from '../components/Iso'
import {
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
  usePrefersReducedMotion,
} from '../components/ui'

type Layer = {
  title: string
  body: string
  Illo: ComponentType<{ className?: string }>
}

const INFRASTRUCTURE: Layer[] = [
  {
    title: 'Ad Context Protocol',
    body: 'Agents discover, negotiate, activate — natural language.',
    Illo: IlloAgent,
  },
  {
    title: 'Agentic RTB (ARTF)',
    body: '80% latency reduction. Sub-100ms.',
    Illo: IlloLatency,
  },
  {
    title: 'Unified ID 2.0',
    body: 'Cross-device. Privacy-preserving. Full GPP + TCF.',
    Illo: IlloIdentityGraph,
  },
  {
    title: 'Dynamic Creative',
    body: 'Scene-level analysis. Adapts to tone, sentiment, safety.',
    Illo: IlloSceneScan,
  },
  {
    title: 'OM SDK + Attention',
    body: 'Hardware attestation. Attention beyond viewability.',
    Illo: IlloAttentionGauge,
  },
  {
    title: 'Compliance',
    body: 'GPP · GDPR · CCPA — EU AI Act ready. No consent, no bid.',
    Illo: IlloVault,
  },
]

const INTELLIGENCE = [
  ['Scene-Level Intelligence', 'Multimodal AI — tone, sentiment, visuals'],
  ['Auto-Format Adaptation', 'One asset in, dozens out'],
  ['1st-Party Graph', 'Consented segments via clean rooms'],
  ['Real-Time Yield', 'All auction types simultaneously'],
  ['Brand Safety AI', 'Context-aware beyond blocklists'],
  ['99.7% Valid Traffic', 'OM SDK + behavioral biometrics'],
  ['Curated Marketplaces', 'One-click Deal IDs by vertical'],
  ['Supply Path Optimization', 'Shortest path. Less tech tax'],
  ['Clean Room', 'Encrypted overlap & attribution'],
]

/**
 * The pinned stack: six infrastructure slabs assemble one by one in 3D as the
 * section scrolls past. Below md — and under reduced motion — it degrades to a
 * plain stacked grid, fully visible.
 */
function LayerStack() {
  const reduced = usePrefersReducedMotion()
  const [pinned, setPinned] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setPinned(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // PinnedStack owns its own scroll target, so the ref is attached on its very
  // first render — a shared ref across two branches never measures.
  return pinned && !reduced ? <PinnedStack /> : <GridStack />
}

function GridStack() {
  return (
    <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {INFRASTRUCTURE.map(({ title, body, Illo }, i) => (
        <RevealItem key={title} index={i}>
          <Tilt>
            <div className="solid-card flex h-full items-start gap-5 p-6">
              <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[16px] border border-black/6 bg-white">
                <Illo className="h-[84px] w-[84px]" />
              </div>
              <div>
                <h3
                  className="text-[16px] font-semibold text-ink"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-body opacity-80">
                  {body}
                </p>
              </div>
            </div>
          </Tilt>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

function PinnedStack() {
  const host = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: host,
    offset: ['start start', 'end end'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.4 })

  return (
    <div ref={host} className="relative mt-14 h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div
          className="relative h-[520px] w-full max-w-[860px]"
          style={{ perspective: '1500px' }}
        >
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {INFRASTRUCTURE.map(({ title, body, Illo }, i) => (
              <Slab key={title} i={i} p={p} title={title} body={body} Illo={Illo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Slab({
  i,
  p,
  title,
  body,
  Illo,
}: {
  i: number
  p: ReturnType<typeof useSpring>
  title: string
  body: string
  Illo: ComponentType<{ className?: string }>
}) {
  const n = INFRASTRUCTURE.length
  const start = (i * 0.82) / n
  const end = start + 0.26

  const y = useTransform(p, [start, end], [300, i * 68 - 172])
  const opacity = useTransform(p, [start, start + 0.04, end], [0, 1, 1])
  // Keep the final tilt shallow enough that the copy stays comfortably legible.
  const rotateX = useTransform(p, [start, end], [52, 34])
  const scale = useTransform(p, [start, end], [0.84, 1])

  return (
    <motion.div
      style={{
        y,
        opacity,
        rotateX,
        scale,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        zIndex: i,
      }}
      className="absolute inset-x-0 top-1/2 flex items-center gap-6 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_40px_80px_-40px_rgba(11,11,18,0.45)]"
    >
      <span className="eyebrow w-[34px] shrink-0">{String(i + 1).padStart(2, '0')}</span>
      <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[16px] border border-black/6 bg-bone">
        <Illo className="h-[84px] w-[84px]" />
      </div>
      <div>
        <h3
          className="text-[19px] font-semibold text-ink"
          style={{ letterSpacing: '-0.025em' }}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-[15px] leading-[1.55] text-body opacity-80">{body}</p>
      </div>
    </motion.div>
  )
}

export function Technology() {
  return (
    <Section id="technology">
      <Reveal className="max-w-[820px]">
        <Eyebrow>Technology</Eyebrow>
        <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
          Infrastructure behind <Dim>every</Dim> impression
        </h2>
        <p className="lede mt-7">
          Six layers, one exchange. Everything between a bid request and a rendered
          frame — owned, measured, and auditable.
        </p>
      </Reveal>

      <LayerStack />

      <Reveal className="mt-[104px] max-w-[820px]">
        <Eyebrow>Intelligence</Eyebrow>
        <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
          Intelligent at <Dim tint="pink">every</Dim> layer
        </h2>
      </Reveal>

      <RevealGroup
        className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.05}
      >
        {INTELLIGENCE.map(([title, body], i) => (
          <RevealItem key={title} index={i % 6}>
            <div className="group flex items-baseline gap-4 border-b border-black/8 py-6">
              <span className="w-7 shrink-0 font-mono text-[12px] text-ink/30 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  className="text-[16px] font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {title}
                </h3>
                <p className="mt-1 text-[14px] leading-[1.55] text-body opacity-75">
                  {body}
                </p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
