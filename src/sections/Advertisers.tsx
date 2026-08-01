import type { ComponentType } from 'react'
import {
  IlloAttentionGauge,
  IlloCreativeFanOut,
  IlloHub,
  IlloIdentityGraph,
  IlloLift,
  IlloShield,
  IlloTiles,
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
    title: 'Creative Technology',
    body: 'One asset in. AI transforms it into native, video, CTV pause ads. No creative fees.',
    Illo: IlloTiles,
  },
  {
    title: 'Premium Supply',
    body: 'Direct relationships. Zero resold. Brand-safe by architecture.',
    Illo: IlloShield,
  },
  {
    title: 'Attention-Based Buying',
    body: 'Verified attention scores. Higher recall, lift, purchase intent.',
    Illo: IlloAttentionGauge,
  },
  {
    title: '1st-Party + Contextual AI',
    body: 'Cookieless via contextual intelligence + Unified ID 2.0.',
    Illo: IlloIdentityGraph,
  },
  {
    title: 'Every DSP. One Exchange',
    body: 'PMP, PG, open auction. Standard VAST tags and Deal IDs.',
    Illo: IlloHub,
  },
  {
    title: 'Brand Lift & Incrementality',
    body: 'Control groups. Real lift — not last-click theater.',
    Illo: IlloLift,
  },
]

export function Advertisers() {
  return (
    <Section id="advertisers" bone>
      <div className="grid items-end gap-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <Eyebrow>For Advertisers &amp; Agencies</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            From standard to <Dim>standout</Dim>
          </h2>
          <p className="lede mt-7">
            One asset in. AI transforms it into native, video, and CTV pause ads —
            bought against verified attention, not impressions.
          </p>
          <InkButton href="#contact" className="mt-9">
            Start Buying
            <Arrow />
          </InkButton>
        </Reveal>

        <Reveal delay={0.1}>
          <Tilt max={7}>
            <div className="solid-card flex aspect-[13/10] w-full items-center justify-center bg-linear-to-b from-white to-[#f6f2fd] p-6">
              <IlloCreativeFanOut className="h-full w-full" />
            </div>
          </Tilt>
        </Reveal>
      </div>

      <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(({ title, body, Illo }, i) => (
          <RevealItem key={title} index={i}>
            <Tilt>
              <div className="solid-card h-full p-7">
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
