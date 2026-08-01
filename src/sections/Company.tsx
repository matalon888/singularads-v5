import { IlloGlobe, IlloSupplyPath } from '../components/Iso'
import {
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
} from '../components/ui'

const BADGES = ['GeoEdge', 'Pixalate', 'IAB Member', 'TAG Certified', 'OM SDK', 'ads.txt']

const OPS = [
  ['Engineering', 'Tel Aviv · Lisbon · London'],
  ['Partnerships', 'New York · Singapore'],
  ['Leadership', 'Daniel Avital, Founder & CEO'],
]

export function Company() {
  return (
    <Section id="company">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <Eyebrow>Company</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            Built on <Dim>trust</Dim>
          </h2>
          <p className="lede mt-7">
            Founded by ad tech veterans with 20+ years building exchanges, SSPs, and
            creative platforms. Headquartered in the EU. Serving 180+ countries.
          </p>

          <dl className="mt-10 space-y-5">
            {OPS.map(([k, v]) => (
              <div
                key={k}
                className="flex flex-wrap items-baseline gap-x-4 border-t border-black/8 pt-5"
              >
                <dt className="eyebrow w-[120px] shrink-0">{k}</dt>
                <dd className="text-[16px] text-ink" style={{ letterSpacing: '-0.01em' }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-5">
            <Tilt max={7}>
              <div className="solid-card flex aspect-[13/8] w-full items-center justify-center bg-linear-to-b from-white to-[#f6f2fd] p-6">
                <IlloSupplyPath className="h-full w-full" />
              </div>
            </Tilt>
            <Tilt max={7}>
              <div className="solid-card flex aspect-[13/8] w-full items-center justify-center bg-linear-to-b from-white to-[#eef4ff] p-6">
                <IlloGlobe className="h-full w-full" />
              </div>
            </Tilt>
          </div>
        </Reveal>
      </div>

      <RevealGroup
        className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        stagger={0.05}
      >
        {BADGES.map((b, i) => (
          <RevealItem key={b} index={i}>
            <Tilt max={14} lift={4}>
              <div className="flex h-[70px] items-center justify-center rounded-[16px] border border-black/8 bg-card text-[13px] font-medium text-body shadow-[0_14px_30px_-22px_rgba(11,11,18,0.7)]">
                {b}
              </div>
            </Tilt>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
