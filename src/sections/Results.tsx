import { IlloAuction, IlloLift, IlloRoute, IlloShield } from '../components/Iso'
import {
  CountUp,
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Stars,
  Tilt,
} from '../components/ui'

const STATS = [
  {
    value: 47,
    prefix: '+',
    suffix: '%',
    decimals: 0,
    body: 'CPM uplift for a top-tier CTV publisher after switching from waterfall to Singular’s unified auction with attention-based pricing.',
    meta: 'CTV Publisher · EMEA · Q4 2025',
    Illo: IlloLift,
    stage: 'from-[#eef4ff] to-white',
  },
  {
    value: 3.2,
    prefix: '',
    suffix: '×',
    decimals: 1,
    body: 'Brand recall lift achieved by a global CPG brand using Singular’s AI-adapted native creative across mobile and web environments.',
    meta: 'CPG Advertiser · North America · 2025',
    Illo: IlloRoute,
    stage: 'from-[#f4eeff] to-white',
  },
  {
    value: -62,
    prefix: '',
    suffix: '%',
    decimals: 0,
    body: 'Reduction in invalid traffic after migrating to Singular’s OM SDK + behavioral biometrics stack. From 4.1% IVT to 1.5% within 30 days.',
    meta: 'Mobile Publisher Network · APAC · 2025',
    Illo: IlloShield,
    stage: 'from-[#fff0e8] to-white',
  },
]

export function Results() {
  return (
    <Section id="results">
      <div className="grid items-end gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
        <Reveal>
          <Eyebrow>Results</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            <Dim tint="coral">Proof</Dim>, not promises
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Tilt max={8}>
            <div className="solid-card flex aspect-[13/10] w-full items-center justify-center bg-linear-to-b from-white to-[#f4f6fb] p-6">
              <IlloAuction className="h-full w-full" />
            </div>
          </Tilt>
        </Reveal>
      </div>

      <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3">
        {STATS.map(({ value, prefix, suffix, decimals, body, meta, Illo, stage }, i) => (
          <RevealItem key={meta} index={i}>
            <Tilt>
              <div className="solid-card flex h-full flex-col bg-card p-7">
                <div
                  className={`mb-6 flex h-[128px] w-[128px] items-center justify-center rounded-[20px] border border-black/6 bg-linear-to-b ${stage}`}
                >
                  <Illo className="h-[116px] w-[116px]" />
                </div>
                <div className="display text-[54px] text-ink">
                  <CountUp
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                  />
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-[1.6] text-body opacity-80">
                  {body}
                </p>
                <p className="eyebrow mt-6 border-t border-black/8 pt-4">{meta}</p>
              </div>
            </Tilt>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-6" delay={0.05}>
        <figure className="solid-card p-9 md:p-14">
          <Stars className="mb-7" />
          <blockquote
            className="display max-w-[940px] text-[26px] text-ink md:text-[36px]"
            style={{ lineHeight: 1.22 }}
          >
            “We replaced three vendors with Singular. One integration, higher fill
            rates, and our CPMs went <Dim tint="violet">up</Dim> — not down. The
            creative tech is a genuine differentiator.”
          </blockquote>
          <figcaption className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-body">
            <span className="font-semibold text-ink">VP Monetization</span>
            <span className="opacity-60">Streaming Platform</span>
            <span className="h-3 w-px bg-black/12" />
            <span className="opacity-60">500M+ monthly impressions</span>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}
