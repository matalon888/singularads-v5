import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { cameraCurve, lookAtPoint, paceU } from './journey'
import { measure, state, updateFromScroll } from './store'
import {
  Archive,
  Arrival,
  AttentionField,
  Exchange,
  Fold,
  Foundry,
  FormatRoom,
  Gateway,
  Quiet,
  SingularPoint,
  Stack,
  Waterfall,
} from './scenes'

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()
const _cur = new THREE.Vector3()
const _fwd = new THREE.Vector3()

/** Drives the camera along the journey spline from the scroll store. */
function Rig() {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, -1))

  useFrame((_, delta) => {
    const u = paceU(state.u)
    cameraCurve.getPoint(u, _pos)
    lookAtPoint(u, _look)

    // Pointer parallax — small, so it reads as a hand-held camera, not a toy.
    _pos.x += state.px * 2.4
    _pos.y += -state.py * 1.6

    // The overture pushes the camera forward through the arrival field before
    // the journey proper takes over.
    if (state.heroDolly > 0) {
      _fwd.copy(_look).sub(_pos).normalize()
      _pos.addScaledVector(_fwd, state.heroDolly * 24)
    }

    const k = state.reduced ? 1 : Math.min(1, delta * 4.2)
    camera.position.lerp(_pos, k)
    look.current.lerp(_look, k)
    camera.lookAt(look.current)
  })

  return null
}

/** A light that follows the visitor's cursor through the world. */
function CursorLight() {
  const ref = useRef<THREE.PointLight>(null)
  const { camera } = useThree()

  useFrame(() => {
    const l = ref.current
    if (!l) return
    _cur.set(state.px * 26, -state.py * 18, -18).applyQuaternion(camera.quaternion)
    l.position.copy(camera.position).add(_cur)
  })

  return <pointLight ref={ref} intensity={260} distance={70} decay={1.7} color="#ffffff" />
}

export function World() {
  const dpr = useRef<[number, number]>([1, 1.75])

  useEffect(() => {
    state.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => updateFromScroll()
    const onResize = () => {
      measure()
      updateFromScroll()
    }
    const onPointer = (e: PointerEvent) => {
      state.px = (e.clientX / window.innerWidth - 0.5) * 2
      state.py = (e.clientY / window.innerHeight - 0.5) * 2
    }
    // The one verb: at the singular point, click to scatter it.
    const onClick = () => {
      if (state.chapter >= 10) state.burst = 1
    }

    measure()
    updateFromScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('click', onClick)

    // Sections settle (fonts, images, reveals) after first paint — remeasure.
    const t1 = setTimeout(onResize, 400)
    const t2 = setTimeout(onResize, 1600)
    document.fonts?.ready.then(onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('click', onClick)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <>
      {/* Two wrappers on purpose: the outer one is clipped to the card, the
          inner one scales. Clipping and scaling the same element would fight
          each other, and resizing the canvas itself every frame is far too
          expensive to scrub. */}
      <div
        id="world-clip"
        className="pointer-events-none fixed inset-0 z-[2]"
        aria-hidden
        data-world
      >
        <div id="world-scale" className="h-full w-full">
      <Canvas
        dpr={dpr.current}
        camera={{ position: [0, 1.5, 20], fov: 46, near: 0.5, far: 460 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        {/* White exponential fog: everything is born out of, and dies back into,
            the white page. It is what makes this feel like a world and not a
            floating object on a background. */}
        <fogExp2 attach="fog" args={['#ffffff', 0.006]} />

        <ambientLight intensity={1.05} />
        <directionalLight position={[10, 18, 8]} intensity={1.5} />
        <pointLight position={[-24, -8, 10]} intensity={900} distance={90} color="#9B7BF0" />
        <pointLight position={[24, 10, -14]} intensity={800} distance={90} color="#5B8DEF" />
        <CursorLight />

        <Arrival />
        <Fold />
        <Waterfall />
        <Foundry />
        <FormatRoom />
        <Exchange />
        <Stack />
        <AttentionField />
        <Quiet />
        <Archive />
        <Gateway />
        <SingularPoint />

        <Environment resolution={96}>
          <Lightformer intensity={2.2} position={[0, 6, -10]} scale={[12, 12, 1]} color="#ffffff" />
          <Lightformer intensity={1.3} position={[-8, 1, 6]} scale={[9, 9, 1]} color="#dfe7ff" />
          <Lightformer intensity={1.3} position={[8, -3, 6]} scale={[9, 9, 1]} color="#ffe4f3" />
        </Environment>

        <PerformanceMonitor
          onDecline={() => {
            dpr.current = [1, 1]
          }}
        />
        <Rig />
      </Canvas>
        </div>
      </div>
    </>
  )
}
