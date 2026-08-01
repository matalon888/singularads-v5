import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { chapterAnchor, rng } from './journey'
import { state } from './store'

/* ── shared resources ─────────────────────────────────────────────────────── */

export const BOX = new RoundedBoxGeometry(1, 1, 1, 3, 0.16)
export const SLAB = new RoundedBoxGeometry(1, 0.16, 1, 2, 0.05)

export const TINT = {
  blue: '#5B8DEF',
  violet: '#9B7BF0',
  pink: '#F07BC8',
  coral: '#FF8A5B',
  white: '#FFFFFF',
  ink: '#14141C',
  dead: '#C9CDD6',
}
const PALETTE = [TINT.blue, TINT.violet, TINT.pink, TINT.coral, TINT.white, TINT.white]

const dummy = new THREE.Object3D()
const tmpColor = new THREE.Color()

/** Paint an instanced mesh's per-instance colours once. */
function paint(mesh: THREE.InstancedMesh, pick: (i: number) => string, n: number) {
  for (let i = 0; i < n; i++) {
    tmpColor.set(pick(i))
    mesh.setColorAt(i, tmpColor)
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

/**
 * A chapter's set. Anchored just ahead of its camera waypoint so it emerges out
 * of the fog; culled entirely once the camera is far enough past it.
 */
function Set({
  chapter,
  children,
  range = 200,
  scale = 1,
  offset = [0, 0, 0],
}: {
  chapter: number
  children: ReactNode
  range?: number
  /** Sets are viewed from ~62 units away; this sizes them to fill that frame. */
  scale?: number
  offset?: [number, number, number]
}) {
  const ref = useRef<THREE.Group>(null)
  const anchor = useMemo(() => chapterAnchor(chapter), [chapter])

  useFrame(({ camera }) => {
    const g = ref.current
    if (!g) return
    g.visible = camera.position.distanceTo(g.position) < range
  })

  return (
    <group
      ref={ref}
      position={[anchor.x + offset[0], anchor.y + offset[1], anchor.z + offset[2]]}
      scale={scale}
    >
      {children}
    </group>
  )
}

/* ── 0 · ARRIVAL ──────────────────────────────────────────────────────────────
   You are floating in an infinite white world. Millions of impressions drift
   around you, going nowhere in particular. */

export function Arrival() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const n = 170
  const blocks = useMemo(() => {
    const r = rng(9931)
    return Array.from({ length: n }, () => {
      const u = r() * 2 - 1
      const th = r() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const rad = 8 + r() * 16
      return {
        p: new THREE.Vector3(Math.cos(th) * s * rad * 1.4, u * rad * 0.7, Math.sin(th) * s * rad),
        rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
        spin: new THREE.Vector3(r() * 0.3 - 0.15, r() * 0.3 - 0.15, r() * 0.2 - 0.1),
        s: 0.35 + r() * 0.85,
        ph: r() * 6.28,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    if (!m.userData.painted) {
      paint(m, (i) => PALETTE[i % PALETTE.length], n)
      m.userData.painted = true
    }
    const t = state.reduced ? 0 : clock.getElapsedTime()
    for (let i = 0; i < n; i++) {
      const b = blocks[i]
      dummy.position.set(b.p.x, b.p.y + Math.sin(t * 0.5 + b.ph) * 0.5, b.p.z)
      dummy.rotation.set(b.rot.x + b.spin.x * t, b.rot.y + b.spin.y * t, b.rot.z + b.spin.z * t)
      dummy.scale.setScalar(b.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <Set chapter={0} range={230} scale={1.5}>
      <instancedMesh ref={mesh} args={[BOX, undefined, n]}>
        <meshStandardMaterial roughness={0.3} metalness={0.05} envMapIntensity={0.9} />
      </instancedMesh>
    </Set>
  )
}

/* ── 1 · THE FOLD ─────────────────────────────────────────────────────────────
   A horizon plane. Eighteen impressions float above it, lit. Eighty-two have
   sunk beneath it into a grey field that runs off into the fog. You are flown
   underneath. This is the graveyard the industry pays for. */

export function Fold() {
  const above = useRef<THREE.InstancedMesh>(null)
  const below = useRef<THREE.InstancedMesh>(null)
  const nA = 18
  const nB = 240

  const seen = useMemo(() => {
    const r = rng(4471)
    return Array.from({ length: nA }, () => ({
      p: new THREE.Vector3((r() - 0.5) * 46, 2 + r() * 7, (r() - 0.5) * 46),
      s: 0.7 + r() * 0.7,
      ph: r() * 6.28,
    }))
  }, [])

  const dead = useMemo(() => {
    const r = rng(7717)
    return Array.from({ length: nB }, () => ({
      p: new THREE.Vector3((r() - 0.5) * 92, -3 - r() * 26, (r() - 0.5) * 92),
      rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
      s: 0.5 + r() * 0.8,
      ph: r() * 6.28,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    const a = above.current
    if (a) {
      if (!a.userData.painted) {
        paint(a, (i) => PALETTE[i % 4], nA)
        a.userData.painted = true
      }
      for (let i = 0; i < nA; i++) {
        const b = seen[i]
        dummy.position.set(b.p.x, b.p.y + Math.sin(t * 0.7 + b.ph) * 0.6, b.p.z)
        dummy.rotation.set(t * 0.12 + b.ph, t * 0.16 + b.ph, 0)
        dummy.scale.setScalar(b.s)
        dummy.updateMatrix()
        a.setMatrixAt(i, dummy.matrix)
      }
      a.instanceMatrix.needsUpdate = true
    }

    const d = below.current
    if (d) {
      if (!d.userData.painted) {
        paint(d, () => TINT.dead, nB)
        d.userData.painted = true
      }
      for (let i = 0; i < nB; i++) {
        const b = dead[i]
        // Barely alive: a slow, heavy settle rather than a float.
        dummy.position.set(b.p.x, b.p.y + Math.sin(t * 0.18 + b.ph) * 0.16, b.p.z)
        dummy.rotation.copy(b.rot)
        dummy.scale.setScalar(b.s)
        dummy.updateMatrix()
        d.setMatrixAt(i, dummy.matrix)
      }
      d.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <Set chapter={1} range={240} scale={1.15}>
      {/* the fold itself */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[170, 170]} />
        <meshBasicMaterial color="#0b0b12" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={above} args={[BOX, undefined, nA]}>
        <meshStandardMaterial roughness={0.28} metalness={0.05} envMapIntensity={1} />
      </instancedMesh>
      <instancedMesh ref={below} args={[BOX, undefined, nB]}>
        <meshStandardMaterial roughness={0.85} metalness={0} envMapIntensity={0.3} />
      </instancedMesh>
    </Set>
  )
}

/* ── 2 · THE WATERFALL ────────────────────────────────────────────────────────
   The publisher's waterfall, literally: six descending shelves with inventory
   tumbling down them, losing its colour at every step it falls. */

export function Waterfall() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const n = 150
  const STEPS = 6

  const drops = useMemo(() => {
    const r = rng(2287)
    return Array.from({ length: n }, () => ({
      x: (r() - 0.5) * 26,
      z: (r() - 0.5) * 12,
      t0: r(),
      speed: 0.09 + r() * 0.1,
      s: 0.4 + r() * 0.5,
      rot: r() * 6.28,
    }))
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const t = state.reduced ? 0.4 : clock.getElapsedTime()
    for (let i = 0; i < n; i++) {
      const d = drops[i]
      const k = (d.t0 + t * d.speed) % 1
      const step = Math.floor(k * STEPS)
      dummy.position.set(d.x, 14 - k * 34, d.z + step * 5.4)
      dummy.rotation.set(d.rot + t * 0.5, d.rot + t * 0.4, 0)
      dummy.scale.setScalar(d.s * (1 - k * 0.35))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      // colour drains as value is lost down the waterfall
      tmpColor.set(PALETTE[i % 4]).lerp(tmpColor.clone().set(TINT.dead), k)
      m.setColorAt(i, tmpColor)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <Set chapter={2} range={230} scale={1.9}>
      {Array.from({ length: STEPS }, (_, i) => (
        <mesh key={i} geometry={SLAB} position={[0, 12 - i * 5.6, i * 5.4]} scale={[30, 12, 5]}>
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.5}
            transparent
            opacity={0.6 - i * 0.06}
          />
        </mesh>
      ))}
      <instancedMesh ref={mesh} args={[BOX, undefined, n]}>
        <meshStandardMaterial roughness={0.35} metalness={0.04} />
      </instancedMesh>
    </Set>
  )
}

/* ── 3 · THE FOUNDRY ──────────────────────────────────────────────────────────
   One asset goes in. The machine turns it into every format there is. */

export function Foundry() {
  const ring = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const outputs = useMemo(() => {
    const r = rng(5519)
    return Array.from({ length: 14 }, (_, i) => ({
      a: (i / 14) * Math.PI * 2,
      rad: 9 + r() * 4,
      y: (r() - 0.5) * 9,
      s: 0.8 + r() * 1.5,
      tint: PALETTE[i % 4],
      ph: r() * 6.28,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (ring.current) ring.current.rotation.y = t * 0.16
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.07
      core.current.scale.setScalar(3.1 * pulse)
      core.current.rotation.set(t * 0.24, t * 0.32, 0)
    }
  })

  return (
    <Set chapter={3} range={230} scale={2.4}>
      <mesh ref={core} geometry={BOX}>
        <meshStandardMaterial color={TINT.ink} roughness={0.24} metalness={0.4} />
      </mesh>
      <group ref={ring}>
        {outputs.map((o, i) => (
          <mesh
            key={i}
            geometry={BOX}
            position={[Math.cos(o.a) * o.rad, o.y, Math.sin(o.a) * o.rad]}
            rotation={[o.ph, o.a, 0]}
            scale={o.s}
          >
            <meshStandardMaterial color={o.tint} roughness={0.3} metalness={0.05} />
          </mesh>
        ))}
      </group>
    </Set>
  )
}

/* ── 4 · THE FORMAT ROOM ──────────────────────────────────────────────────────
   Four monoliths, one per surface. You fly between them. */

export function FormatRoom() {
  const g = useRef<THREE.Group>(null)
  const slabs = useMemo(
    () => [
      { p: [-13, 2, 0], s: [9, 13, 0.7], tint: TINT.blue },
      { p: [13, -1, -9], s: [12, 7, 0.7], tint: TINT.violet },
      { p: [-9, -7, -20], s: [7, 7, 0.7], tint: TINT.pink },
      { p: [12, 6, -28], s: [11, 6, 0.7], tint: TINT.coral },
    ],
    [],
  )

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (!g.current) return
    g.current.children.forEach((c, i) => {
      c.position.y = (slabs[i].p[1] as number) + Math.sin(t * 0.6 + i) * 0.8
      c.rotation.y = Math.sin(t * 0.3 + i) * 0.22
    })
  })

  return (
    <Set chapter={4} range={230} scale={2.1}>
      <group ref={g}>
        {slabs.map((s, i) => (
          <mesh
            key={i}
            geometry={BOX}
            position={s.p as [number, number, number]}
            scale={s.s as [number, number, number]}
          >
            <meshStandardMaterial color={s.tint} roughness={0.26} metalness={0.08} />
          </mesh>
        ))}
      </group>
    </Set>
  )
}

/* ── 5 · THE EXCHANGE ─────────────────────────────────────────────────────────
   The money shot. A core with orbiting rings, six demand pylons around it, and
   bids streaming inward as light. You arc all the way around it. */

export function Exchange() {
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const bids = useRef<THREE.InstancedMesh>(null)
  const n = 120

  const streams = useMemo(() => {
    const r = rng(8123)
    return Array.from({ length: n }, () => ({
      a: r() * Math.PI * 2,
      y: (r() - 0.5) * 14,
      t0: r(),
      speed: 0.18 + r() * 0.22,
      s: 0.24 + r() * 0.3,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (ringA.current) ringA.current.rotation.set(Math.PI / 2, 0, t * 0.24)
    if (ringB.current) ringB.current.rotation.set(Math.PI / 2.5, t * 0.3, t * 0.16)

    const m = bids.current
    if (!m) return
    if (!m.userData.painted) {
      paint(m, (i) => PALETTE[i % 4], n)
      m.userData.painted = true
    }
    for (let i = 0; i < n; i++) {
      const b = streams[i]
      const k = (b.t0 + t * b.speed) % 1
      const rad = 29 * (1 - k) + 5.4
      dummy.position.set(Math.cos(b.a) * rad, b.y * (1 - k * 0.8), Math.sin(b.a) * rad)
      dummy.rotation.set(k * 6, b.a, 0)
      dummy.scale.setScalar(b.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <Set chapter={5} range={240} scale={1.0} offset={[0, -9, 0]}>
      <mesh>
        <icosahedronGeometry args={[5.2, 2]} />
        <meshStandardMaterial
          color={TINT.violet}
          roughness={0.12}
          metalness={0.55}
          emissive={TINT.blue}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[12, 0.3, 12, 90]} />
        <meshStandardMaterial color={TINT.blue} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[19, 0.22, 12, 110]} />
        <meshStandardMaterial color={TINT.pink} roughness={0.3} metalness={0.4} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            geometry={BOX}
            position={[Math.cos(a) * 25, 0, Math.sin(a) * 25]}
            scale={[1.8, 13, 1.8]}
          >
            <meshStandardMaterial color="#FFFFFF" roughness={0.42} metalness={0.1} />
          </mesh>
        )
      })}
      <instancedMesh ref={bids} args={[BOX, undefined, n]}>
        <meshStandardMaterial roughness={0.2} metalness={0.1} />
      </instancedMesh>
    </Set>
  )
}

/* ── 6 · THE STACK ────────────────────────────────────────────────────────────
   Six infrastructure layers. You fall straight through all of them. */

export function Stack() {
  const g = useRef<THREE.Group>(null)
  const tints = [TINT.blue, TINT.violet, TINT.pink, TINT.coral, TINT.blue, TINT.violet]

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (!g.current) return
    g.current.children.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 0.22 + i * 0.5) * 0.14
      c.position.y = 16 - i * 6.4 + Math.sin(t * 0.5 + i) * 0.3
    })
  })

  return (
    <Set chapter={6} range={240} scale={1.2}>
      <group ref={g}>
        {tints.map((tint, i) => (
          <group key={i} position={[0, 16 - i * 6.4, 0]}>
            <mesh geometry={SLAB} scale={[34 - i * 1.4, 12, 34 - i * 1.4]}>
              <meshStandardMaterial
                color="#FFFFFF"
                roughness={0.36}
                metalness={0.05}
                transparent
                opacity={0.82}
              />
            </mesh>
            <mesh geometry={SLAB} position={[0, 0.42, 0]} scale={[26 - i * 1.2, 3, 1.1]}>
              <meshStandardMaterial color={tint} roughness={0.25} metalness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </Set>
  )
}

/* ── 7 · THE ATTENTION FIELD ──────────────────────────────────────────────────
   A landscape made of measured attention. It breathes. You fly over it. */

export function AttentionField() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const COLS = 22
  const ROWS = 22
  const n = COLS * ROWS

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const t = state.reduced ? 0 : clock.getElapsedTime()
    let i = 0
    for (let cx = 0; cx < COLS; cx++) {
      for (let cz = 0; cz < ROWS; cz++) {
        const x = (cx - COLS / 2) * 3.4
        const z = (cz - ROWS / 2) * 3.4
        const d = Math.sqrt(x * x + z * z)
        const h = 2 + Math.sin(d * 0.16 - t * 0.9) * 3.4 + Math.cos(cx * 0.5 + t * 0.4) * 1.4
        dummy.position.set(x, h / 2 - 8, z)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1.5, Math.max(0.4, h), 1.5)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
        tmpColor.set(PALETTE[(cx + cz) % 4]).lerp(tmpColor.clone().set('#FFFFFF'), 0.45)
        m.setColorAt(i, tmpColor)
        i++
      }
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <Set chapter={7} range={240} scale={1.2}>
      <instancedMesh ref={mesh} args={[BOX, undefined, n]}>
        <meshStandardMaterial roughness={0.34} metalness={0.06} />
      </instancedMesh>
    </Set>
  )
}

/* ── 8 · THE QUIET ────────────────────────────────────────────────────────────
   A held beat. Six principles, six slow monoliths, nothing else. */

export function Quiet() {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (!g.current) return
    g.current.rotation.y = t * 0.04
    g.current.children.forEach((c, i) => {
      c.position.y = Math.sin(t * 0.32 + i * 1.1) * 1.6
    })
  })

  return (
    <Set chapter={8} range={230} scale={2.1}>
      <group ref={g}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={i}
              geometry={BOX}
              position={[Math.cos(a) * 17, 0, Math.sin(a) * 17]}
              scale={[2.2, 11 - i * 0.8, 2.2]}
            >
              <meshStandardMaterial
                color="#FFFFFF"
                roughness={0.4}
                metalness={0.06}
                transparent
                opacity={0.9}
              />
            </mesh>
          )
        })}
      </group>
    </Set>
  )
}

/* ── 9 · THE ARCHIVE ──────────────────────────────────────────────────────────
   Where the receipts live: a slow orbiting shelf of certified slabs. */

export function Archive() {
  const g = useRef<THREE.Group>(null)
  const items = useMemo(() => {
    const r = rng(3313)
    return Array.from({ length: 26 }, (_, i) => ({
      a: (i / 26) * Math.PI * 2,
      rad: 13 + r() * 7,
      y: (r() - 0.5) * 16,
      s: 1 + r() * 1.6,
      tint: i % 5 === 0 ? PALETTE[i % 4] : '#FFFFFF',
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (g.current) g.current.rotation.y = -t * 0.09
  })

  return (
    <Set chapter={9} range={230} scale={2.0}>
      <group ref={g}>
        {items.map((it, i) => (
          <mesh
            key={i}
            geometry={SLAB}
            position={[Math.cos(it.a) * it.rad, it.y, Math.sin(it.a) * it.rad]}
            rotation={[0, -it.a, 0]}
            scale={[it.s * 3, 6, it.s * 2]}
          >
            <meshStandardMaterial color={it.tint} roughness={0.38} metalness={0.08} />
          </mesh>
        ))}
      </group>
    </Set>
  )
}

/* ── 10 · THE GATEWAY ─────────────────────────────────────────────────────────
   Two doors: buy, or monetize. You pass between them. */

export function Gateway() {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    if (!g.current) return
    g.current.children.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 0.4 + i * 3.14) * 0.3
      c.position.y = Math.sin(t * 0.55 + i) * 0.9
    })
  })
  return (
    <Set chapter={10} range={230} scale={1.7}>
      <group ref={g}>
        <mesh geometry={BOX} position={[-13, 0, 0]} scale={[1.6, 24, 8]}>
          <meshStandardMaterial color={TINT.blue} roughness={0.24} metalness={0.25} />
        </mesh>
        <mesh geometry={BOX} position={[13, 0, 0]} scale={[1.6, 24, 8]}>
          <meshStandardMaterial color={TINT.pink} roughness={0.24} metalness={0.25} />
        </mesh>
      </group>
    </Set>
  )
}

/* ── 11 · THE SINGULAR POINT ──────────────────────────────────────────────────
   Every signal in the world arrives at one place. Grab it and it scatters. */

export function SingularPoint() {
  const shell = useRef<THREE.InstancedMesh>(null)
  const core = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const n = 200

  const shellBlocks = useMemo(() => {
    const r = rng(6151)
    return Array.from({ length: n }, (_, i) => {
      // golden-angle shell so the sphere is evenly covered
      const y = 1 - (i / (n - 1)) * 2
      const rad = Math.sqrt(Math.max(0, 1 - y * y))
      const th = i * 2.39996
      return {
        dir: new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad),
        dist: 7 + r() * 3,
        s: 0.3 + r() * 0.4,
        ph: r() * 6.28,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const t = state.reduced ? 0 : clock.getElapsedTime()
    state.burst *= 0.94

    const m = shell.current
    if (m) {
      if (!m.userData.painted) {
        paint(m, (i) => PALETTE[i % 4], n)
        m.userData.painted = true
      }
      for (let i = 0; i < n; i++) {
        const b = shellBlocks[i]
        const breathe = 1 + Math.sin(t * 0.7 + b.ph) * 0.05
        const d = b.dist * breathe + state.burst * 22
        dummy.position.set(b.dir.x * d, b.dir.y * d, b.dir.z * d)
        dummy.rotation.set(t * 0.3 + b.ph, t * 0.24 + b.ph, 0)
        dummy.scale.setScalar(b.s)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }

    if (core.current) {
      core.current.rotation.set(t * 0.2, t * 0.3, 0)
      core.current.scale.setScalar(2.6 * (1 + Math.sin(t * 1.3) * 0.05 + state.burst * 0.5))
    }
    if (halo.current) halo.current.rotation.set(Math.PI / 2, 0, t * 0.2)
  })

  return (
    <Set chapter={11} range={250} scale={2.4}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color={TINT.violet}
          emissive={TINT.pink}
          emissiveIntensity={0.55}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
      <mesh ref={halo}>
        <torusGeometry args={[11, 0.14, 10, 100]} />
        <meshStandardMaterial color={TINT.coral} roughness={0.3} metalness={0.4} />
      </mesh>
      <instancedMesh ref={shell} args={[BOX, undefined, n]}>
        <meshStandardMaterial roughness={0.26} metalness={0.08} envMapIntensity={1} />
      </instancedMesh>
    </Set>
  )
}
