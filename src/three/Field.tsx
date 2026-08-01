import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { usePrefersReducedMotion } from '../components/ui'

/**
 * The convergence field. ~150 rounded "impression blocks" suspended in a white
 * studio, drifting and spinning. As the page scrolls each block lerps from its
 * scattered position toward the origin and the camera dollies in, until the
 * field resolves into a single dense core — many signals, one singular point.
 */

const TINTS = ['#5B8DEF', '#9B7BF0', '#F07BC8', '#FF8A5B', '#FFFFFF', '#FFFFFF']

type Block = {
  scattered: THREE.Vector3
  converged: THREE.Vector3
  rot: THREE.Euler
  spin: THREE.Vector3
  scale: number
  phase: number
}

function makeBlocks(count: number, radius: number): Block[] {
  // Deterministic pseudo-random so every reload composes the same field.
  let seed = 20260801
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  return Array.from({ length: count }, () => {
    // Fibonacci-ish spherical shell, jittered.
    const u = rnd() * 2 - 1
    const theta = rnd() * Math.PI * 2
    const r = radius * (0.42 + rnd() * 0.58)
    const s = Math.sqrt(1 - u * u)
    const scattered = new THREE.Vector3(
      Math.cos(theta) * s * r * 1.5,
      u * r * 0.78,
      Math.sin(theta) * s * r,
    )
    const scale = 0.26 + rnd() * 0.5
    return {
      scattered,
      converged: new THREE.Vector3(
        (rnd() - 0.5) * 1.5,
        (rnd() - 0.5) * 1.5,
        (rnd() - 0.5) * 1.5,
      ),
      rot: new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI),
      spin: new THREE.Vector3(rnd() * 0.3 - 0.15, rnd() * 0.3 - 0.15, rnd() * 0.2 - 0.1),
      scale,
      phase: rnd() * Math.PI * 2,
    }
  })
}

function Blocks({
  count,
  radius,
  progressRef,
  reduced,
}: {
  count: number
  radius: number
  progressRef: React.RefObject<number>
  reduced: boolean
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const blocks = useMemo(() => makeBlocks(count, radius), [count, radius])
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.18), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const c = new THREE.Color()
    blocks.forEach((_, i) => {
      c.set(TINTS[i % TINTS.length])
      mesh.setColorAt(i, c)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [blocks])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = reduced ? 0 : clock.getElapsedTime()
    const k = progressRef.current ?? 0
    // ease the convergence so it bites late and hard
    const e = k * k * (3 - 2 * k)

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]
      tmp.copy(b.scattered).lerp(b.converged, e)
      const drift = reduced ? 0 : Math.sin(t * 0.6 + b.phase) * 0.35 * (1 - e)
      dummy.position.set(tmp.x, tmp.y + drift, tmp.z)
      dummy.rotation.set(
        b.rot.x + b.spin.x * t,
        b.rot.y + b.spin.y * t,
        b.rot.z + b.spin.z * t,
      )
      const s = b.scale * (1 - e * 0.35)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial roughness={0.32} metalness={0.06} envMapIntensity={0.85} />
    </instancedMesh>
  )
}

function Rig({
  progressRef,
  dolly,
  baseZ,
  reduced,
}: {
  progressRef: React.RefObject<number>
  dolly: number
  baseZ: number
  reduced: boolean
}) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  useFrame(() => {
    const k = progressRef.current ?? 0
    const z = baseZ - k * dolly
    camera.position.x += (target.current.x * 1.9 - camera.position.x) * 0.05
    camera.position.y += (-target.current.y * 1.2 - camera.position.y) * 0.05
    camera.position.z += (z - camera.position.z) * 0.06
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function Field({
  className = '',
  count = 150,
  radius = 9,
  dolly = 6,
  baseZ = 15,
  /** 0 = fully scattered, 1 = fully converged. Omit to link to page scroll. */
  fixedProgress,
}: {
  className?: string
  count?: number
  radius?: number
  dolly?: number
  baseZ?: number
  fixedProgress?: number
}) {
  const host = useRef<HTMLDivElement>(null)
  const progressRef = useRef(fixedProgress ?? 0)
  const [visible, setVisible] = useState(true)
  const [small, setSmall] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const on = () => setSmall(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Pause the canvas whenever it leaves the viewport.
  useEffect(() => {
    const el = host.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '160px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Scroll-linked convergence.
  useEffect(() => {
    if (fixedProgress !== undefined) {
      progressRef.current = fixedProgress
      return
    }
    const onScroll = () => {
      const span = window.innerHeight * 1.15
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / span))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [fixedProgress])

  const n = small ? Math.round(count * 0.55) : count

  return (
    <div ref={host} className={className} aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={small ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, baseZ], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[6, 9, 6]} intensity={1.5} />
        <pointLight position={[-9, -3, 4]} intensity={38} color="#9B7BF0" distance={26} />
        <pointLight position={[9, 4, -4]} intensity={30} color="#5B8DEF" distance={26} />

        <Blocks count={n} radius={radius} progressRef={progressRef} reduced={reduced} />

        <ContactShadows
          position={[0, -6.4, 0]}
          opacity={0.34}
          scale={30}
          blur={2.6}
          far={9}
          color="#0b0b12"
        />

        {/* Procedural environment — no external HDR, works fully offline. */}
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#ffffff" />
          <Lightformer intensity={1.2} position={[-6, 1, 4]} scale={[8, 8, 1]} color="#dfe7ff" />
          <Lightformer intensity={1.2} position={[6, -2, 4]} scale={[8, 8, 1]} color="#ffe4f3" />
        </Environment>

        <Rig progressRef={progressRef} dolly={dolly} baseZ={baseZ} reduced={reduced} />
      </Canvas>
    </div>
  )
}
