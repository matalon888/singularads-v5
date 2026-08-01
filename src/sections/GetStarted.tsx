import { IlloConvergence, IlloExchangeHub } from '../components/Iso'
import {
  Arrow,
  Dim,
  Eyebrow,
  GhostButton,
  InkButton,
  Reveal,
  Section,
  Tilt,
} from '../components/ui'

export function GetStarted() {
  return (
    <Section id="get-started">
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal>
          <Tilt max={6}>
            <div className="solid-card flex h-full flex-col overflow-hidden">
              <div className="flex h-[220px] items-center justify-center border-b border-black/6 bg-linear-to-b from-[#eef4ff] to-white">
                <IlloExchangeHub className="h-[190px] w-[260px]" />
              </div>
              <div className="flex flex-1 flex-col p-8 md:p-10">
                <Eyebrow>Advertisers &amp; Agencies</Eyebrow>
                <h3 className="display mt-5 text-[30px] text-ink md:text-[40px]">
                  Start buying <Dim>attention</Dim>
                </h3>
                <p className="mt-4 flex-1 text-[16px] leading-[1.6] text-body opacity-80">
                  Verified attention scores, AI-adapted creative, and premium supply —
                  through the DSP you already use.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <InkButton href="#contact">
                    Start Buying
                    <Arrow />
                  </InkButton>
                  <GhostButton href="#resources">
                    Documentation
                    <Arrow />
                  </GhostButton>
                </div>
              </div>
            </div>
          </Tilt>
        </Reveal>

        <Reveal delay={0.1}>
          <Tilt max={6}>
            <div className="solid-card flex h-full flex-col overflow-hidden">
              <div className="flex h-[220px] items-center justify-center border-b border-black/6 bg-linear-to-b from-[#ffeef8] to-white">
                <IlloConvergence className="h-[190px] w-[260px]" />
              </div>
              <div className="flex flex-1 flex-col p-8 md:p-10">
                <Eyebrow>Publishers</Eyebrow>
                <h3 className="display mt-5 text-[30px] text-ink md:text-[40px]">
                  Start monetizing <Dim tint="pink">smarter</Dim>
                </h3>
                <p className="mt-4 flex-1 text-[16px] leading-[1.6] text-body opacity-80">
                  One SDK, one auction, one unified view of yield across display, video,
                  native, CTV, and audio.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <InkButton href="#contact">
                    Start Monetizing
                    <Arrow />
                  </InkButton>
                  <GhostButton href="#resources">
                    Documentation
                    <Arrow />
                  </GhostButton>
                </div>
              </div>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </Section>
  )
}
