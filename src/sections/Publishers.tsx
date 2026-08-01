import type { ComponentType } from 'react'
import {
  IlloCleanRoom,
  IlloDevice,
  IlloRoute,
  IlloSceneScan,
  IlloStack,
  IlloWave,
  IlloYield,
} from '../components/Iso'
import {
  Arrow,
  Dim,
  Eyebrow,
  InkButton,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
} from '../components/ui'

type Pillar = {
  title: string
  body: string
  Illo: ComponentType<{ className?: string }>
}

const PILLARS: Pillar[] = [
  {
    title: 'Header Bidding + SSP',
    body: 'Unified ad serving + real-time yield optimization.',
    Illo: IlloStack,
  },
  {
    title: 'High-Impact Native',
    body: 'Computer vision matches creative to every environment.',
    Illo: IlloSceneScan,
  },
  {
    title: 'Premium Brand Demand',
    body: 'PMP, PG, curated marketplaces via deep DSP integrations.',
    Illo: IlloRoute,
  },
  {
    title: 'Streaming Monetization',
    body: 'Pause ads. Shoppable overlays. Dynamic podding.',
    Illo: IlloWave,
  },
  {
    title: '1st-Party Data Activation',
    body: 'Clean room tech. Your data stays yours.',
    Illo: IlloCleanRoom,
  },
  {
    title: 'Lightweight Mobile SDK',
    body: 'Display, video, native, rewarded, audio — one SDK.',
    Illo: IlloDevice,
  },
]

export function Publishers() {
  return (
    <Section id="publishers">
      <div className="grid items-end gap-12 md:grid-cols-2 md:gap-20">
        <Reveal className="order-2 md:order-1">
          <Tilt max={7}>
            <div className="solid-card flex aspect-[13/10] w-full items-center justify-center bg-linear-to-b from-white to-[#fdf3ee] p-6">
              <IlloYield className="h-full w-full" />
            </div>
          </Tilt>
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={0.1}>
          <Eyebrow>For Publishers</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            Durable revenue. <Dim tint="pink">Beautiful</Dim> ads.
          </h2>
          <p className="lede mt-7">
            One integration replaces the waterfall. Unified ad serving, real-time
            yield optimization, and premium brand demand on every screen you own.
          </p>
          <InkButton href="#contact" className="mt-9">
            Start Monetizing
            <Arrow />
          </InkButton>
        </Reveal>
      </div>

      <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(({ title, body, Illo }, i) => (
          <RevealItem key={title} index={i}>
            <Tilt>
              <div className="solid-card h-full bg-card p-7">
                <div className="mb-5 flex h-[124px] w-[124px] items-center justify-center rounded-[18px] border border-black/6 bg-white">
                  <Illo className="h-[112px] w-[112px]" />
                </div>
                <h3
                  className="text-[17px] font-semibold text-ink"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-body opacity-80">
                  {body}
                </p>
              </div>
            </Tilt>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
