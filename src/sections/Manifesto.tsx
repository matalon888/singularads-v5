import { IlloConvergence } from '../components/Iso'
import {
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
} from '../components/ui'

const PRINCIPLES = [
  {
    numeral: 'I',
    lead: 'Ads should blend, not interrupt.',
    body: 'Our creative technology adapts ads to match every content environment.',
  },
  {
    numeral: 'II',
    lead: 'Premium means premium.',
    body: 'Direct relationships. Zero resold. Lowest fraud rates.',
  },
  {
    numeral: 'III',
    lead: 'Measure attention, not impressions.',
    body: 'We optimize for real human attention.',
  },
  {
    numeral: 'IV',
    lead: 'Every screen. One platform.',
    body: 'One exchange. One integration. One unified view.',
  },
  {
    numeral: 'V',
    lead: 'Privacy is a revenue strategy.',
    body: 'Contextual AI + 1st-party data + Clean Rooms.',
  },
  {
    numeral: 'VI',
    lead: 'We win when everyone wins.',
    body: 'Full supply path transparency.',
  },
]

export function Manifesto() {
  return (
    <Section id="manifesto" bone>
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <Eyebrow>Manifesto</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            What we <Dim tint="violet">believe</Dim>
          </h2>
          <p className="lede mt-7">
            Six principles that decide what we build, what we refuse to sell, and how
            every bid on the exchange is priced.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Tilt max={7}>
            <div className="solid-card flex aspect-[13/10] w-full items-center justify-center bg-white p-6">
              <IlloConvergence className="h-full w-full" />
            </div>
          </Tilt>
        </Reveal>
      </div>

      <RevealGroup className="mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map(({ numeral, lead, body }, i) => (
          <RevealItem key={numeral} index={i}>
            <div className="border-t border-black/10 pt-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[22px] font-semibold text-ink/25">
                  {numeral}
                </span>
                <span className="eyebrow">Principle</span>
              </div>
              <h3
                className="mt-4 text-[21px] font-semibold text-ink"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.2 }}
              >
                {lead}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-body opacity-80">
                {body}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
