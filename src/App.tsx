import { ScrollProgress } from './components/ui'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { Problem } from './sections/Problem'
import { Advertisers } from './sections/Advertisers'
import { Publishers } from './sections/Publishers'
import { Formats } from './sections/Formats'
import { Technology } from './sections/Technology'
import { Results } from './sections/Results'
import { Manifesto } from './sections/Manifesto'
import { Company } from './sections/Company'
import { Resources } from './sections/Resources'
import { GetStarted } from './sections/GetStarted'
import { ClosingCTA } from './sections/ClosingCTA'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Advertisers />
        <Publishers />
        <Formats />
        <Technology />
        <Results />
        <Manifesto />
        <Company />
        <Resources />
        <GetStarted />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
