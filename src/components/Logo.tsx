import { useState } from 'react'
import { motion } from 'motion/react'

/**
 * "The Singular Core" — an isometric cube whose three visible faces sit slightly
 * exploded apart around an ink core at their shared vertex. On load and on hover
 * the faces converge onto the core and the cube turns 360° on rotateY.
 */

const W = 8.6
const H = 5
const Z = 10
const CX = 17
const CY = 20

const v = (x: number, y: number, z: number) =>
  `${CX + (x - y) * W},${CY + (x + y) * H - z * Z}`

const A = v(0, 0, 1)
const B = v(1, 0, 1)
const C = v(1, 1, 1)
const D = v(0, 1, 1)
const E = v(0, 1, 0)
const F = v(1, 1, 0)
const G = v(1, 0, 0)

const SPRING = { type: 'spring' as const, stiffness: 180, damping: 16 }

export function Logo({ id = 'logo' }: { id?: string }) {
  const [hover, setHover] = useState(false)

  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-[10px]"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label="Singular — home"
    >
      <motion.svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        aria-hidden
        initial={{ rotateY: 0 }}
        animate={{ rotateY: hover ? 360 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* top face — signal blue */}
        <motion.polygon
          points={`${A} ${B} ${C} ${D}`}
          fill="#5B8DEF"
          initial={{ y: -3.4, opacity: 0 }}
          animate={{ y: hover ? 0 : -2, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.02 }}
        />
        {/* left face — compute violet */}
        <motion.polygon
          points={`${D} ${C} ${F} ${E}`}
          fill="#9B7BF0"
          initial={{ x: -3.4, y: 2, opacity: 0 }}
          animate={{ x: hover ? 0 : -1.7, y: hover ? 0 : 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.08 }}
        />
        {/* right face — attention pink */}
        <motion.polygon
          points={`${C} ${B} ${G} ${F}`}
          fill="#F07BC8"
          initial={{ x: 3.4, y: 2, opacity: 0 }}
          animate={{ x: hover ? 0 : 1.7, y: hover ? 0 : 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.14 }}
        />
        {/* the core at the shared vertex */}
        <motion.circle
          cx={Number(C.split(',')[0])}
          cy={Number(C.split(',')[1])}
          r={3.1}
          fill="#0b0b12"
          initial={{ scale: 0 }}
          animate={{ scale: hover ? 1.22 : 1 }}
          transition={SPRING}
          style={{ transformOrigin: `${C.replace(',', 'px ')}px` }}
        />
      </motion.svg>

      <span className="flex items-baseline gap-[5px]" id={id}>
        <span
          className="text-[19px] text-ink"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
          }}
        >
          singular
        </span>
        <span
          className="text-[10px] text-ink/55"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.18em',
          }}
        >
          ADS
        </span>
      </span>
    </a>
  )
}
