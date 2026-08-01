import { useEffect } from 'react'
import Lenis from 'lenis'
import { World } from './world/World'
import { Hud, TravelCue, TravelProgress } from './components/Hud'
import { Nav } from './sections/Nav'
import { Footer } from './sections/Footer'
import { Overture } from './journey/Overture'
import {
  TheArchive,
  TheAttentionField,
  TheExchange,
  TheFold,
  TheFormatRoom,
  TheFoundry,
  TheGateway,
  TheQuiet,
  TheSingularPoint,
  TheStack,
  TheWaterfall,
  Ticker,
} from './journey/content'

/** Smooth, weighted scroll — travel through the world should have inertia. */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
    // Exposed so the QA harness (and anything else that needs to drive the page
    // programmatically) can move the scroller Lenis owns.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Anchor links must still work with a hijacked scroller.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')!
      if (href.length < 2) return
      const el = document.querySelector(href)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -60 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [])
}

export default function App() {
  useSmoothScroll()

  return (
    <>
      <World />
      <TravelProgress />
      <Hud />
      <TravelCue />
      <Nav />

      <main className="relative z-10">
        <Overture />
        <Ticker />
        <TheFold />
        <TheWaterfall />
        <TheFoundry />
        <TheFormatRoom />
        <TheExchange />
        <TheStack />
        <TheAttentionField />
        <TheQuiet />
        <TheArchive />
        <TheGateway />
        <TheSingularPoint />
      </main>

      <Footer />
    </>
  )
}
