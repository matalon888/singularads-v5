import type { ComponentType } from 'react'
import { IlloBillboard, IlloDevice, IlloTiles, IlloWave } from '../components/Iso'
import {
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
} from '../components/ui'

type Format = {
  title: string
  body: string
  stage: string
  Illo: ComponentType<{ className?: string }>
}

const FORMATS: Format[] = [
  {
    title: 'Native & High-Impact',
    body: 'Seven formats — image, cinemagraph, scroll, window, carousel, branded video, content.',
    stage: 'from-[#eef4ff] to-white',
    Illo: IlloTiles,
  },
  {
    title: 'CTV & Streaming',
    body: 'Pause ads. Shoppable overlays. Enhanced spots. VAST.',
    stage: 'from-[#f4eeff] to-white',
    Illo: IlloDevice,
  },
  {
    title: 'Audio & In-Game',
    body: '100% completion.',
    stage: 'from-[#ffeef8] to-white',
    Illo: IlloWave,
  },
  {
    title: 'DOOH & Retail',
    body: 'Programmatic DOOH. Retail media. Closed-loop.',
    stage: 'from-[#fff0e8] to-white',
    Illo: IlloBillboard,
  },
]

export function Formats() {
  return (
    <Section id="formats" bone>
      <Reveal className="max-w-[760px]">
        <Eyebrow>Formats</Eyebrow>
        <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
          Ads people <Dim tint="violet">engage</Dim> with
        </h2>
        <p className="lede mt-7">
          Every surface a person actually looks at — rendered natively, adapted by
          machine, measured on attention.
        </p>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map(({ title, body, stage, Illo }, i) => (
          <RevealItem key={title} index={i}>
            <Tilt max={11}>
              <div className="solid-card flex h-full flex-col overflow-hidden">
                <div
                  className={`flex h-[208px] items-center justify-center border-b border-black/6 bg-linear-to-b ${stage}`}
                >
                  <Illo className="h-[176px] w-[176px]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
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
              </div>
            </Tilt>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
