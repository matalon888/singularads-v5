/**
 * SOLID LIGHT — the isometric illustration system.
 *
 * Every illustration on the site is built from extruded solids on a true 2:1
 * isometric grid. No strokes: form comes from face shading alone (top light,
 * left mid, right dark) plus a soft elliptical contact shadow. Each
 * illustration loops its own ambient animation forever.
 */
import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export type Tint = 'blue' | 'violet' | 'pink' | 'coral' | 'ink' | 'white'

/** [top, left, right] face colours. */
const FACES: Record<Tint, [string, string, string]> = {
  blue: ['#93B6F7', '#5B8DEF', '#3E6CC9'],
  violet: ['#C0A9F7', '#9B7BF0', '#7355C7'],
  pink: ['#F7ACDC', '#F07BC8', '#C858A2'],
  coral: ['#FFB394', '#FF8A5B', '#D66A3F'],
  ink: ['#3A3B48', '#20212B', '#131419'],
  // The "white" solid is a stage, not paper — it has to read against a white card.
  white: ['#F2F5FA', '#E4E9F2', '#D0D7E4'],
}

const U = 13
const OX = 100
const OY = 92

/** Project isometric grid coordinates to screen space. */
export function p(x: number, y: number, z: number): string {
  return `${OX + (x - y) * U * 0.866},${OY + (x + y) * U * 0.5 - z * U}`
}

/** An extruded box: footprint w×d, height h, corner at (x, y, z). */
export function Solid({
  x = 0,
  y = 0,
  z = 0,
  w = 1,
  d = 1,
  h = 1,
  tint = 'blue',
  opacity = 1,
}: {
  x?: number
  y?: number
  z?: number
  w?: number
  d?: number
  h?: number
  tint?: Tint
  opacity?: number
}) {
  const [top, left, right] = FACES[tint]
  const t = z + h
  return (
    <g opacity={opacity}>
      {/* left face — the y = y+d plane */}
      <polygon
        points={`${p(x, y + d, z)} ${p(x + w, y + d, z)} ${p(x + w, y + d, t)} ${p(x, y + d, t)}`}
        fill={left}
      />
      {/* right face — the x = x+w plane */}
      <polygon
        points={`${p(x + w, y, z)} ${p(x + w, y + d, z)} ${p(x + w, y + d, t)} ${p(x + w, y, t)}`}
        fill={right}
      />
      {/* top face */}
      <polygon
        points={`${p(x, y, t)} ${p(x + w, y, t)} ${p(x + w, y + d, t)} ${p(x, y + d, t)}`}
        fill={top}
      />
    </g>
  )
}

/** Thin slab — the inventory motif. */
export function Slab(props: Parameters<typeof Solid>[0]) {
  return <Solid h={0.22} {...props} />
}

/** Soft elliptical contact shadow on the ground plane. */
export function Shadow({
  x = 0,
  y = 0,
  rx = 34,
  ry = 12,
  opacity = 0.13,
}: {
  x?: number
  y?: number
  rx?: number
  ry?: number
  opacity?: number
}) {
  const [cx, cy] = p(x, y, 0).split(',').map(Number)
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(11,11,18,1)" opacity={opacity} />
}

/** A floating node bead. */
export function Node({
  x,
  y,
  z,
  r = 4.4,
  tint = 'blue',
}: {
  x: number
  y: number
  z: number
  r?: number
  tint?: Tint
}) {
  const [cx, cy] = p(x, y, z).split(',').map(Number)
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={FACES[tint][1]} />
      <circle cx={cx - r * 0.28} cy={cy - r * 0.32} r={r * 0.42} fill={FACES[tint][0]} />
    </>
  )
}

/** Shared frame: fixed viewBox + the gradient used by the convergence cube. */
export function Iso({
  children,
  className = '',
  title,
}: {
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <svg
      /* Cropped tight to the drawn extents so the solids fill their frame. */
      viewBox="32 34 136 116"
      className={className}
      role="img"
      aria-label={title ?? 'Isometric illustration'}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="core-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="50%" stopColor="#9B7BF0" />
          <stop offset="100%" stopColor="#F07BC8" />
        </linearGradient>
        <linearGradient id="core-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3E6CC9" />
          <stop offset="100%" stopColor="#C858A2" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}

/* ── ambient motion presets ───────────────────────────────────────────────── */

const float = (i = 0, amp = 5, dur = 3.6) => ({
  animate: { y: [0, -amp, 0] },
  transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.22 },
})

const pulse = (i = 0) => ({
  animate: { opacity: [0.35, 1, 0.35], scale: [0.9, 1.06, 0.9] },
  transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.3 },
})

/* ═══════════════════════════════════════════════════════════════════════════
   THE 24 ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

type P = { className?: string }

/** Stacked slabs as inventory. */
export function IlloTiles({ className }: P) {
  return (
    <Iso className={className} title="Inventory slabs">
      <Shadow x={0.5} y={0.5} rx={40} />
      {(['blue', 'violet', 'pink'] as Tint[]).map((t, i) => (
        <motion.g key={t} {...float(i, 4, 3.4)}>
          <Slab x={-1} y={-1} z={i * 0.55} w={3} d={3} tint={t} />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Brand-safe by architecture. */
export function IlloShield({ className }: P) {
  return (
    <Iso className={className} title="Shield">
      <Shadow x={0.5} y={0.5} rx={34} />
      <Solid x={-1.2} y={-1.2} w={3.4} d={3.4} h={0.24} tint="white" />
      <motion.g {...float(0, 6, 4)}>
        <Solid x={-0.75} y={-0.75} z={0.9} w={2.5} d={2.5} h={0.7} tint="blue" />
        <Solid x={-0.2} y={-0.2} z={1.6} w={1.4} d={1.4} h={0.5} tint="violet" />
      </motion.g>
      {[0, 1, 2, 3].map((i) => (
        <motion.g key={i} {...pulse(i)}>
          <Node x={i % 2 ? -1.6 : 2.2} y={i < 2 ? -1.6 : 2.2} z={0.6} r={3.4} tint="coral" />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Verified attention score. */
export function IlloAttentionGauge({ className }: P) {
  return (
    <Iso className={className} title="Attention gauge">
      <Shadow rx={36} />
      <Solid x={-1.6} y={-1.6} w={4} d={4} h={0.2} tint="white" />
      {[0.9, 1.7, 2.6, 1.3].map((h, i) => (
        <motion.g
          key={i}
          animate={{ scaleY: [0.55, 1, 0.72, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          style={{ transformOrigin: `${OX}px ${OY}px` }}
        >
          <Solid
            x={-1.2 + i * 0.8}
            y={-1.2 + i * 0.8}
            z={0.2}
            w={0.6}
            d={0.6}
            h={h}
            tint={(['blue', 'violet', 'pink', 'coral'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Cookieless identity graph. */
export function IlloIdentityGraph({ className }: P) {
  const nodes: [number, number, number, Tint][] = [
    [-1.7, -1.7, 0.6, 'blue'],
    [1.7, -1.7, 1.5, 'violet'],
    [-1.7, 1.7, 1.5, 'pink'],
    [1.7, 1.7, 0.6, 'coral'],
  ]
  const [cx, cy] = p(0, 0, 1.5).split(',').map(Number)
  return (
    <Iso className={className} title="Identity graph">
      <Shadow rx={34} />
      {nodes.map(([x, y, z], i) => {
        const [nx, ny] = p(x, y, z).split(',').map(Number)
        return (
          <motion.line
            key={i}
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#0b0b12"
            strokeOpacity={0.16}
            strokeWidth={1.4}
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        )
      })}
      {nodes.map(([x, y, z, t], i) => (
        <motion.g key={i} {...float(i, 4, 3)}>
          <Node x={x} y={y} z={z} r={5} tint={t} />
        </motion.g>
      ))}
      <Solid x={-0.6} y={-0.6} z={1.1} w={1.2} d={1.2} h={0.8} tint="ink" />
    </Iso>
  )
}

/** Every DSP, one exchange. */
export function IlloHub({ className }: P) {
  return (
    <Iso className={className} title="Exchange hub">
      <Shadow rx={38} />
      <Solid x={-2} y={-2} w={4.6} d={4.6} h={0.18} tint="white" />
      {[
        [-1.7, -1.7, 'blue'],
        [1.5, -1.7, 'violet'],
        [-1.7, 1.5, 'pink'],
        [1.5, 1.5, 'coral'],
      ].map(([x, y, t], i) => (
        <motion.g key={i} {...float(i, 5, 3.2)}>
          <Solid x={x as number} y={y as number} z={0.18} w={0.9} d={0.9} h={0.5} tint={t as Tint} />
        </motion.g>
      ))}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${OX}px ${OY}px` }}
      >
        <Solid x={-0.7} y={-0.7} z={0.18} w={1.4} d={1.4} h={1.5} tint="ink" />
      </motion.g>
    </Iso>
  )
}

/** Brand lift & incrementality. */
export function IlloLift({ className }: P) {
  return (
    <Iso className={className} title="Lift">
      <Shadow rx={36} />
      <Solid x={-1.9} y={-1.9} w={4.2} d={4.2} h={0.18} tint="white" />
      {[0.5, 1.1, 1.9, 2.9].map((h, i) => (
        <motion.g
          key={i}
          animate={{ y: [8, 0], opacity: [0, 1] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            repeatDelay: 2.4,
            delay: i * 0.16,
            ease: 'easeOut',
          }}
        >
          <Solid
            x={-1.5 + i}
            y={-1.5 + i}
            z={0.18}
            w={0.72}
            d={0.72}
            h={h}
            tint={(['blue', 'blue', 'violet', 'pink'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Header bidding + SSP stack. */
export function IlloStack({ className }: P) {
  return (
    <Iso className={className} title="Unified stack">
      <Shadow rx={38} />
      {(['coral', 'pink', 'violet', 'blue'] as Tint[]).map((t, i) => (
        <motion.g
          key={t}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
        >
          <Solid x={-1.5} y={-1.5} z={i * 0.5} w={3.4} d={3.4} h={0.36} tint={t} />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Computer vision matching creative to environment. */
export function IlloSceneScan({ className }: P) {
  return (
    <Iso className={className} title="Scene analysis">
      <Shadow rx={36} />
      <Solid x={-1.8} y={-1.8} w={4} d={4} h={0.2} tint="white" />
      <Solid x={-1.1} y={-1.1} z={0.2} w={1} d={1} h={0.6} tint="violet" />
      <Solid x={0.3} y={-1.1} z={0.2} w={0.8} d={0.8} h={1} tint="blue" />
      <Solid x={-1.1} y={0.4} z={0.2} w={0.8} d={0.8} h={0.4} tint="pink" />
      <motion.g
        animate={{ y: [-6, 34, -6], opacity: [0.15, 0.5, 0.15] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <polygon
          points={`${p(-1.8, -1.8, 2.2)} ${p(2.2, -1.8, 2.2)} ${p(2.2, 2.2, 2.2)} ${p(-1.8, 2.2, 2.2)}`}
          fill="#5B8DEF"
        />
      </motion.g>
    </Iso>
  )
}

/** Supply path / route. */
export function IlloRoute({ className }: P) {
  const path = `M ${p(-2, 2, 0.4)} L ${p(-0.6, 0.6, 1.3)} L ${p(0.8, 0.8, 0.6)} L ${p(2.2, -1.6, 1.6)}`
  return (
    <Iso className={className} title="Supply path">
      <Shadow rx={36} />
      <Solid x={-2.2} y={-2.2} w={4.6} d={4.6} h={0.16} tint="white" />
      <motion.path
        d={path}
        fill="none"
        stroke="#9B7BF0"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="140"
        animate={{ strokeDashoffset: [140, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
      />
      <Node x={-2} y={2} z={0.4} tint="blue" r={5} />
      <Node x={2.2} y={-1.6} z={1.6} tint="pink" r={5} />
      <motion.g {...float(1, 5, 3)}>
        <Solid x={0.4} y={0.4} z={0.16} w={0.9} d={0.9} h={0.5} tint="coral" />
      </motion.g>
    </Iso>
  )
}

/** Audio waveform. */
export function IlloWave({ className }: P) {
  return (
    <Iso className={className} title="Audio">
      <Shadow rx={36} />
      <Solid x={-2} y={-2} w={4.4} d={4.4} h={0.16} tint="white" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.g
          key={i}
          animate={{ scaleY: [0.4, 1.25, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          style={{ transformOrigin: `${OX}px ${OY + 20}px` }}
        >
          <Solid
            x={-1.7 + i * 0.85}
            y={-1.7 + i * 0.85}
            z={0.16}
            w={0.5}
            d={0.5}
            h={0.7 + (i % 3) * 0.6}
            tint={(['blue', 'violet', 'pink', 'coral', 'violet'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Clean room — your data stays yours. */
export function IlloCleanRoom({ className }: P) {
  return (
    <Iso className={className} title="Clean room">
      <Shadow rx={34} />
      <Solid x={-1.6} y={-1.6} w={3.6} d={3.6} h={0.2} tint="white" />
      <motion.g animate={{ opacity: [0.55, 0.9, 0.55] }} transition={{ duration: 3, repeat: Infinity }}>
        <Solid x={-1.4} y={-1.4} z={0.2} w={3.2} d={3.2} h={2} tint="blue" opacity={0.28} />
      </motion.g>
      <motion.g {...float(0, 5, 3.2)}>
        <Solid x={-0.5} y={-0.5} z={0.6} w={1.1} d={1.1} h={0.8} tint="ink" />
      </motion.g>
      {[0, 1].map((i) => (
        <motion.g key={i} {...pulse(i)}>
          <Node x={i ? 1.2 : -1.2} y={i ? -1.2 : 1.2} z={1.6} tint="pink" r={4} />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Lightweight mobile SDK. */
export function IlloDevice({ className }: P) {
  return (
    <Iso className={className} title="Device">
      <Shadow rx={30} ry={11} />
      <motion.g {...float(0, 5, 3.8)}>
        <Solid x={-1} y={-1.4} z={0.4} w={2} d={2.8} h={0.28} tint="ink" />
        <Slab x={-0.8} y={-1.2} z={0.68} w={1.6} d={0.7} tint="blue" />
        <Slab x={-0.8} y={-0.35} z={0.68} w={1.6} d={0.7} tint="violet" />
        <Slab x={-0.8} y={0.5} z={0.68} w={1.6} d={0.7} tint="pink" />
      </motion.g>
    </Iso>
  )
}

/** DOOH billboard. */
export function IlloBillboard({ className }: P) {
  return (
    <Iso className={className} title="Billboard">
      <Shadow rx={30} />
      <Solid x={-0.3} y={-0.3} w={0.6} d={0.6} h={1.6} tint="ink" />
      <motion.g {...float(0, 4, 4.2)}>
        <Solid x={-1.6} y={-1.6} z={1.6} w={3.2} d={3.2} h={0.3} tint="white" />
        <Slab x={-1.3} y={-1.3} z={1.9} w={2.6} d={2.6} tint="coral" />
      </motion.g>
      <motion.g {...pulse(0)}>
        <Node x={1.7} y={-1.7} z={2.6} tint="pink" r={4} />
      </motion.g>
    </Iso>
  )
}

/** Agentic negotiation. */
export function IlloAgent({ className }: P) {
  return (
    <Iso className={className} title="AI agent">
      <Shadow rx={34} />
      <Solid x={-1.8} y={-1.8} w={4} d={4} h={0.18} tint="white" />
      <motion.g
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${OX}px ${OY - 6}px` }}
      >
        <Node x={-1.5} y={-1.5} z={1.4} tint="blue" r={4.6} />
        <Node x={1.5} y={1.5} z={1.4} tint="pink" r={4.6} />
        <Node x={1.5} y={-1.5} z={1.4} tint="violet" r={4.6} />
        <Node x={-1.5} y={1.5} z={1.4} tint="coral" r={4.6} />
      </motion.g>
      <motion.g animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ transformOrigin: `${OX}px ${OY}px` }}>
        <Solid x={-0.65} y={-0.65} z={0.18} w={1.3} d={1.3} h={1.1} tint="ink" />
      </motion.g>
    </Iso>
  )
}

/** Sub-100ms latency. */
export function IlloLatency({ className }: P) {
  return (
    <Iso className={className} title="Latency">
      <Shadow rx={36} />
      <Solid x={-2.1} y={-2.1} w={4.4} d={4.4} h={0.16} tint="white" />
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          animate={{ x: [-34, 34], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        >
          <Solid
            x={-0.9}
            y={-0.9 + i * 0.9}
            z={0.16 + i * 0.5}
            w={1}
            d={0.4}
            h={0.3}
            tint={(['blue', 'violet', 'pink'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Real-time yield. */
export function IlloYield({ className }: P) {
  return (
    <Iso className={className} title="Yield">
      <Shadow rx={40} />
      <Solid x={-2.2} y={-2.2} w={4.8} d={4.8} h={0.16} tint="white" />
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.g
          key={i}
          animate={{ scaleY: [0.5, 1, 0.65, 1.1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          style={{ transformOrigin: `${OX}px ${OY + 24}px` }}
        >
          <Solid
            x={-1.9 + i * 0.95}
            y={-1.9 + i * 0.95}
            z={0.16}
            w={0.62}
            d={0.62}
            h={0.6 + i * 0.42}
            tint={(['blue', 'blue', 'violet', 'pink', 'coral'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** 82% never seen — slabs sinking below the fold plane. */
export function IlloAttentionGap({ className }: P) {
  const cells = Array.from({ length: 25 }, (_, i) => i)
  // Scattered on purpose: an every-nth rule lands on the isometric diagonal,
  // where gx === gy projects to the same screen column.
  const SEEN = new Set([2, 8, 11, 17, 23])
  return (
    <Iso className={className} title="Attention gap">
      <Shadow rx={46} ry={16} opacity={0.07} />
      {cells.map((i) => {
        const gx = (i % 5) - 2
        const gy = Math.floor(i / 5) - 2
        const seen = SEEN.has(i)
        return (
          <motion.g
            key={i}
            animate={seen ? { y: [0, -7, 0] } : { y: [0, 6, 0], opacity: [0.55, 0.22, 0.55] }}
            transition={{
              duration: seen ? 2.6 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 7) * 0.16,
            }}
          >
            <Slab
              x={gx * 0.86}
              y={gy * 0.86}
              z={seen ? 0.5 : 0}
              w={0.76}
              d={0.76}
              h={seen ? 0.3 : 0.16}
              tint={seen ? 'blue' : 'white'}
            />
          </motion.g>
        )
      })}
    </Iso>
  )
}

/** The moment of convergence — the one gradient cube on the page. */
export function IlloConvergence({ className }: P) {
  const ring: [number, number][] = [
    [-2.4, 0],
    [-1.7, -1.7],
    [0, -2.4],
    [1.7, -1.7],
    [2.4, 0],
    [1.7, 1.7],
    [0, 2.4],
    [-1.7, 1.7],
  ]
  return (
    <Iso className={className} title="Convergence">
      <Shadow rx={44} ry={15} />
      {ring.map(([x, y], i) => (
        <motion.g
          key={i}
          animate={{ x: [0, -(x * 6), 0], y: [0, -(y * 3), 0], opacity: [1, 0.25, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
        >
          <Solid
            x={x}
            y={y}
            z={0.4}
            w={0.62}
            d={0.62}
            h={0.42}
            tint={(['blue', 'violet', 'pink', 'coral'] as Tint[])[i % 4]}
          />
        </motion.g>
      ))}
      <motion.g
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${OX}px ${OY}px` }}
      >
        <polygon
          points={`${p(-0.8, 0.8, 0)} ${p(0.8, 0.8, 0)} ${p(0.8, 0.8, 1.6)} ${p(-0.8, 0.8, 1.6)}`}
          fill="url(#core-left)"
        />
        <polygon
          points={`${p(0.8, -0.8, 0)} ${p(0.8, 0.8, 0)} ${p(0.8, 0.8, 1.6)} ${p(0.8, -0.8, 1.6)}`}
          fill="#3E6CC9"
        />
        <polygon
          points={`${p(-0.8, -0.8, 1.6)} ${p(0.8, -0.8, 1.6)} ${p(0.8, 0.8, 1.6)} ${p(-0.8, 0.8, 1.6)}`}
          fill="url(#core-face)"
        />
      </motion.g>
    </Iso>
  )
}

/** Full supply path transparency. */
export function IlloSupplyPath({ className }: P) {
  return (
    <Iso className={className} title="Transparent supply path">
      <Shadow rx={40} />
      <Solid x={-2.4} y={-2.4} w={5} d={5} h={0.14} tint="white" />
      {[0, 1, 2, 3].map((i) => (
        <motion.g key={i} {...float(i, 4, 3.4)}>
          <Solid
            x={-1.9 + i * 1.25}
            y={1.6 - i * 1.05}
            z={0.14 + i * 0.28}
            w={0.8}
            d={0.8}
            h={0.34}
            tint={(['blue', 'violet', 'pink', 'coral'] as Tint[])[i]}
          />
        </motion.g>
      ))}
      <motion.circle
        r={4}
        fill="#0b0b12"
        animate={{
          cx: [
            Number(p(-1.5, 2, 0.5).split(',')[0]),
            Number(p(1.9, -1.4, 1.3).split(',')[0]),
          ],
          cy: [
            Number(p(-1.5, 2, 0.5).split(',')[1]),
            Number(p(1.9, -1.4, 1.3).split(',')[1]),
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Iso>
  )
}

/** One exchange, every screen. */
export function IlloExchangeHub({ className }: P) {
  return (
    <Iso className={className} title="One exchange">
      <Shadow rx={44} ry={15} />
      <Solid x={-2.6} y={-2.6} w={5.4} d={5.4} h={0.14} tint="white" />
      {[
        [-2.2, -2.2, 'blue'],
        [1.4, -2.2, 'violet'],
        [-2.2, 1.4, 'pink'],
        [1.4, 1.4, 'coral'],
      ].map(([x, y, t], i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          <Solid x={x as number} y={y as number} z={0.14} w={0.8} d={0.8} h={0.4} tint={t as Tint} />
        </motion.g>
      ))}
      <Solid x={-0.9} y={-0.9} z={0.14} w={1.8} d={1.8} h={1.3} tint="ink" />
      <motion.g {...pulse(0)}>
        <Node x={0} y={0} z={1.9} tint="pink" r={5} />
      </motion.g>
    </Iso>
  )
}

/** One asset in, dozens out. */
export function IlloCreativeFanOut({ className }: P) {
  return (
    <Iso className={className} title="Creative fan-out">
      <Shadow rx={44} ry={15} />
      <motion.g {...float(0, 5, 3.6)}>
        <Solid x={-0.6} y={-0.6} z={1.6} w={1.2} d={1.2} h={0.7} tint="ink" />
      </motion.g>
      {[
        [-2.4, -0.4],
        [-1.4, -2.2],
        [0.9, -2.2],
        [2.2, -0.4],
        [2.2, 1.3],
        [0.5, 2.2],
        [-1.6, 1.8],
      ].map(([x, y], i) => (
        <motion.g
          key={i}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
        >
          <Slab
            x={x}
            y={y}
            z={0}
            w={0.72}
            d={0.72}
            tint={(['blue', 'violet', 'pink', 'coral'] as Tint[])[i % 4]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Auction — PMP, PG, open. */
export function IlloAuction({ className }: P) {
  return (
    <Iso className={className} title="Auction">
      <Shadow rx={36} />
      <Solid x={-2} y={-2} w={4.4} d={4.4} h={0.16} tint="white" />
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <Solid
            x={-1.5 + i * 1.3}
            y={-1.5 + i * 1.3}
            z={0.16}
            w={0.8}
            d={0.8}
            h={0.5 + i * 0.35}
            tint={(['blue', 'violet', 'coral'] as Tint[])[i]}
          />
        </motion.g>
      ))}
    </Iso>
  )
}

/** 180+ countries. */
export function IlloGlobe({ className }: P) {
  const [cx, cy] = p(0, 0, 1.2).split(',').map(Number)
  return (
    <Iso className={className} title="Global reach">
      <Shadow rx={34} />
      <circle cx={cx} cy={cy} r={30} fill="#EDEFF3" />
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <ellipse cx={cx} cy={cy} rx={30} ry={11} fill="none" stroke="#5B8DEF" strokeWidth={1.6} />
        <ellipse cx={cx} cy={cy} rx={11} ry={30} fill="none" stroke="#9B7BF0" strokeWidth={1.6} />
      </motion.g>
      <circle cx={cx - 9} cy={cy - 10} r={9} fill="#FFFFFF" opacity={0.55} />
      {[0, 1, 2].map((i) => (
        <motion.g key={i} {...pulse(i)}>
          <Node x={[-2.2, 2.1, 0][i]} y={[1.9, -1.6, -2.3][i]} z={1.4} tint={(['pink', 'coral', 'blue'] as Tint[])[i]} r={4} />
        </motion.g>
      ))}
    </Iso>
  )
}

/** Compliance vault. */
export function IlloVault({ className }: P) {
  return (
    <Iso className={className} title="Compliance">
      <Shadow rx={32} />
      <Solid x={-1.5} y={-1.5} w={3.2} d={3.2} h={1.5} tint="white" />
      <motion.g
        animate={{ rotate: [0, 180, 180, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${OX}px ${OY - 22}px` }}
      >
        <Solid x={-0.55} y={-0.55} z={1.5} w={1.1} d={1.1} h={0.4} tint="violet" />
      </motion.g>
      <motion.g {...pulse(1)}>
        <Node x={1.6} y={-1.4} z={1.2} tint="coral" r={4} />
      </motion.g>
    </Iso>
  )
}
