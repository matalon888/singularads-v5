import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import { Chapter, Panel } from '../components/Chapter'
import {
  IlloAgent,
  IlloAttentionGauge,
  IlloAuction,
  IlloBillboard,
  IlloCleanRoom,
  IlloDevice,
  IlloGlobe,
  IlloHub,
  IlloIdentityGraph,
  IlloLatency,
  IlloLift,
  IlloRoute,
  IlloSceneScan,
  IlloShield,
  IlloStack,
  IlloTiles,
  IlloVault,
  IlloWave,
} from '../components/Iso'
import {
  Arrow,
  CountUp,
  Dim,
  EmailCapture,
  Eyebrow,
  FlipWords,
  GhostButton,
  InkButton,
  Reveal,
  RevealGroup,
  RevealItem,
  Stars,
  Tilt,
} from '../components/ui'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── partner ticker ───────────────────────────────────────────────────────── */

const PARTNERS = ['THE TRADE DESK', 'DV360', 'xandr', 'amazon', 'Yahoo', 'OpenX']

export function Ticker() {
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS]
  return (
    <section
      aria-label="Integrated demand partners"
      className="marquee-host relative z-10 w-full overflow-hidden py-6"
      style={{ perspective: '900px' }}
    >
      <div className="marquee-track flex w-max items-center gap-4">
        {row.map((p, i) => (
          <div
            key={`${p}-${i}`}
            className="flex h-[50px] shrink-0 items-center rounded-[14px] border border-black/8 bg-white/80 px-7 shadow-[0_10px_26px_-18px_rgba(11,11,18,0.5)] backdrop-blur-sm"
            style={{ transform: `rotateX(8deg) rotateY(${i % 2 ? -7 : 7}deg)` }}
          >
            <span className="text-[12px] font-semibold tracking-[0.14em] text-ink opacity-55">
              {p}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   01 · THE FOLD
   ════════════════════════════════════════════════════════════════════════════ */

export function TheFold() {
  return (
    <Chapter chapter={1} id="problem">
      <Eyebrow>The Problem</Eyebrow>
      <h2 className="display mt-7 max-w-[1000px] text-[38px] text-ink md:text-[68px]">
        82% of display ads are <Dim tint="coral">never</Dim> actually seen by a human
        being.
      </h2>
      <p className="lede mt-8">
        Buried below the fold. Scrolled past. You're buying impressions — not
        attention.
      </p>
      <div className="mt-12 flex items-center gap-10">
        <div className="text-center">
          <div className="display text-[54px] text-ink">
            <CountUp value={82} suffix="%" />
          </div>
          <div className="eyebrow mt-2">never seen</div>
        </div>
        <div className="h-14 w-px bg-black/12" />
        <div className="text-center">
          <div className="display text-[54px] text-ink">
            <CountUp value={18} suffix="%" />
          </div>
          <div className="eyebrow mt-2">what you actually bought</div>
        </div>
      </div>
    </Chapter>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   02 · THE WATERFALL — for publishers
   ════════════════════════════════════════════════════════════════════════════ */

const PUB_PILLARS: [string, string, ComponentType<{ className?: string }>][] = [
  ['Header Bidding + SSP', 'Unified ad serving + real-time yield optimization.', IlloStack],
  ['High-Impact Native', 'Computer vision matches creative to every environment.', IlloSceneScan],
  ['Premium Brand Demand', 'PMP, PG, curated marketplaces via deep DSP integrations.', IlloRoute],
  ['Streaming Monetization', 'Pause ads. Shoppable overlays. Dynamic podding.', IlloWave],
  ['1st-Party Data Activation', 'Clean room tech. Your data stays yours.', IlloCleanRoom],
  ['Lightweight Mobile SDK', 'Display, video, native, rewarded, audio — one SDK.', IlloDevice],
]

export function TheWaterfall() {
  return (
    <>
      <Chapter chapter={2} id="publishers" align="left">
        <Eyebrow>For Publishers</Eyebrow>
        <h2 className="display mt-7 max-w-[900px] text-[38px] text-ink md:text-[68px]">
          Durable revenue. <Dim tint="pink">Beautiful</Dim> ads.
        </h2>
        <p className="lede mt-8">
          One integration replaces the waterfall. Unified ad serving, real-time yield
          optimization, and premium brand demand on every screen you own.
        </p>
        <InkButton href="#contact" className="mt-10">
          Start Monetizing
          <Arrow />
        </InkButton>
      </Chapter>

      <Panel>
        <PillarGrid pillars={PUB_PILLARS} />
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   03 · THE FOUNDRY — for advertisers
   ════════════════════════════════════════════════════════════════════════════ */

const ADV_PILLARS: [string, string, ComponentType<{ className?: string }>][] = [
  [
    'Creative Technology',
    'One asset in. AI transforms it into native, video, CTV pause ads. No creative fees.',
    IlloTiles,
  ],
  ['Premium Supply', 'Direct relationships. Zero resold. Brand-safe by architecture.', IlloShield],
  [
    'Attention-Based Buying',
    'Verified attention scores. Higher recall, lift, purchase intent.',
    IlloAttentionGauge,
  ],
  [
    '1st-Party + Contextual AI',
    'Cookieless via contextual intelligence + Unified ID 2.0.',
    IlloIdentityGraph,
  ],
  ['Every DSP. One Exchange', 'PMP, PG, open auction. Standard VAST tags and Deal IDs.', IlloHub],
  ['Brand Lift & Incrementality', 'Control groups. Real lift — not last-click theater.', IlloLift],
]

export function TheFoundry() {
  return (
    <>
      <Chapter chapter={3} id="advertisers" align="right">
        <Eyebrow>For Advertisers &amp; Agencies</Eyebrow>
        <h2 className="display mt-7 max-w-[900px] text-[38px] text-ink md:text-[68px]">
          From standard to <Dim>standout</Dim>
        </h2>
        <p className="lede mt-8 ml-auto">
          One asset in. AI transforms it into native, video, and CTV pause ads — bought
          against verified attention, not impressions.
        </p>
        <InkButton href="#contact" className="mt-10">
          Start Buying
          <Arrow />
        </InkButton>
      </Chapter>

      <Panel>
        <PillarGrid pillars={ADV_PILLARS} />
      </Panel>
    </>
  )
}

function PillarGrid({
  pillars,
}: {
  pillars: [string, string, ComponentType<{ className?: string }>][]
}) {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pillars.map(([title, body, Illo], i) => (
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
              <p className="mt-2 text-[15px] leading-[1.55] text-body opacity-80">{body}</p>
            </div>
          </Tilt>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   04 · THE FORMAT ROOM
   ════════════════════════════════════════════════════════════════════════════ */

const FORMATS = [
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

export function TheFormatRoom() {
  return (
    <>
      <Chapter chapter={4} id="formats" tall={false}>
        <Eyebrow>Formats</Eyebrow>
        <h2 className="display mt-7 text-[38px] text-ink md:text-[68px]">
          Ads people <Dim tint="violet">engage</Dim> with
        </h2>
        <p className="lede mt-8">
          Every surface a person actually looks at — rendered natively, adapted by
          machine, measured on attention.
        </p>
      </Chapter>

      <Panel>
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   05 · THE EXCHANGE
   ════════════════════════════════════════════════════════════════════════════ */

export function TheExchange() {
  return (
    <Chapter chapter={5} id="technology">
      <Eyebrow>Technology</Eyebrow>
      <h2 className="display mt-7 max-w-[1000px] text-[38px] text-ink md:text-[68px]">
        Infrastructure behind <Dim>every</Dim> impression
      </h2>
      <p className="lede mt-8">
        Six layers, one exchange. Everything between a bid request and a rendered frame
        — owned, measured, and auditable.
      </p>
    </Chapter>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   06 · THE STACK
   ════════════════════════════════════════════════════════════════════════════ */

const LAYERS: [string, string, ComponentType<{ className?: string }>][] = [
  ['Ad Context Protocol', 'Agents discover, negotiate, activate — natural language.', IlloAgent],
  ['Agentic RTB (ARTF)', '80% latency reduction. Sub-100ms.', IlloLatency],
  ['Unified ID 2.0', 'Cross-device. Privacy-preserving. Full GPP + TCF.', IlloIdentityGraph],
  ['Dynamic Creative', 'Scene-level analysis. Adapts to tone, sentiment, safety.', IlloSceneScan],
  ['OM SDK + Attention', 'Hardware attestation. Attention beyond viewability.', IlloAttentionGauge],
  ['Compliance', 'GPP · GDPR · CCPA — EU AI Act ready. No consent, no bid.', IlloVault],
]

const INTELLIGENCE = [
  ['Scene-Level Intelligence', 'Multimodal AI — tone, sentiment, visuals'],
  ['Auto-Format Adaptation', 'One asset in, dozens out'],
  ['1st-Party Graph', 'Consented segments via clean rooms'],
  ['Real-Time Yield', 'All auction types simultaneously'],
  ['Brand Safety AI', 'Context-aware beyond blocklists'],
  ['99.7% Valid Traffic', 'OM SDK + behavioral biometrics'],
  ['Curated Marketplaces', 'One-click Deal IDs by vertical'],
  ['Supply Path Optimization', 'Shortest path. Less tech tax'],
  ['Clean Room', 'Encrypted overlap & attribution'],
]

export function TheStack() {
  return (
    <>
      <div data-chapter={6} />
      <Panel>
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map(([title, body, Illo], i) => (
            <RevealItem key={title} index={i}>
              <Tilt>
                <div className="solid-card flex h-full items-start gap-5 p-6">
                  <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[16px] border border-black/6 bg-white">
                    <Illo className="h-[84px] w-[84px]" />
                  </div>
                  <div>
                    <h3
                      className="text-[16px] font-semibold text-ink"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-body opacity-80">
                      {body}
                    </p>
                  </div>
                </div>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-[14vh] max-w-[820px]">
          <Eyebrow>Intelligence</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            Intelligent at <Dim tint="pink">every</Dim> layer
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {INTELLIGENCE.map(([title, body], i) => (
            <RevealItem key={title} index={i % 6}>
              <div className="group flex items-baseline gap-4 border-b border-black/8 py-6">
                <span className="w-7 shrink-0 font-mono text-[12px] text-ink/30 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="text-[16px] font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-[1.55] text-body opacity-75">{body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   07 · THE ATTENTION FIELD — results
   ════════════════════════════════════════════════════════════════════════════ */

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

export function TheAttentionField() {
  return (
    <>
      <Chapter chapter={7} id="results" tall={false}>
        <Eyebrow>Results</Eyebrow>
        <h2 className="display mt-7 text-[38px] text-ink md:text-[68px]">
          <Dim tint="coral">Proof</Dim>, not promises
        </h2>
      </Chapter>

      <Panel>
        <RevealGroup className="grid gap-5 lg:grid-cols-3">
          {STATS.map(({ value, prefix, suffix, decimals, body, meta, Illo, stage }, i) => (
            <RevealItem key={meta} index={i}>
              <Tilt>
                <div className="solid-card flex h-full flex-col p-7">
                  <div
                    className={`mb-6 flex h-[128px] w-[128px] items-center justify-center rounded-[20px] border border-black/6 bg-linear-to-b ${stage}`}
                  >
                    <Illo className="h-[116px] w-[116px]" />
                  </div>
                  <div className="display text-[54px] text-ink">
                    <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
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
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   08 · THE QUIET — manifesto
   ════════════════════════════════════════════════════════════════════════════ */

const PRINCIPLES = [
  ['I', 'Ads should blend, not interrupt.', 'Our creative technology adapts ads to match every content environment.'],
  ['II', 'Premium means premium.', 'Direct relationships. Zero resold. Lowest fraud rates.'],
  ['III', 'Measure attention, not impressions.', 'We optimize for real human attention.'],
  ['IV', 'Every screen. One platform.', 'One exchange. One integration. One unified view.'],
  ['V', 'Privacy is a revenue strategy.', 'Contextual AI + 1st-party data + Clean Rooms.'],
  ['VI', 'We win when everyone wins.', 'Full supply path transparency.'],
]

export function TheQuiet() {
  return (
    <>
      <Chapter chapter={8} id="manifesto" tall={false}>
        <Eyebrow>Manifesto</Eyebrow>
        <h2 className="display mt-7 text-[38px] text-ink md:text-[68px]">
          What we <Dim tint="violet">believe</Dim>
        </h2>
        <p className="lede mt-8">
          Six principles that decide what we build, what we refuse to sell, and how
          every bid on the exchange is priced.
        </p>
      </Chapter>

      <Panel>
        <RevealGroup className="grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(([numeral, lead, body], i) => (
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
                <p className="mt-3 text-[15px] leading-[1.6] text-body opacity-80">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   09 · THE ARCHIVE — company + resources
   ════════════════════════════════════════════════════════════════════════════ */

const BADGES = ['GeoEdge', 'Pixalate', 'IAB Member', 'TAG Certified', 'OM SDK', 'ads.txt']
const OPS = [
  ['Engineering', 'Tel Aviv · Lisbon · London'],
  ['Partnerships', 'New York · Singapore'],
  ['Leadership', 'Daniel Avital, Founder & CEO'],
]
const NEWS = [
  {
    date: 'February 2026',
    title: 'Singular Launches Agentic RTB Protocol',
    body: 'Our new ARTF protocol reduces bidding latency by 80% — sub-100ms decision-making powered by AI agents.',
    Illo: IlloLatency,
    stage: 'from-[#eef4ff] to-white',
  },
  {
    date: 'January 2026',
    title: 'Ad Context Protocol (AdCP) v3.0',
    body: 'Natural language ad discovery and activation. AI agents negotiate, discover, and activate campaigns autonomously.',
    Illo: IlloAgent,
    stage: 'from-[#f4eeff] to-white',
  },
  {
    date: 'Coming Soon',
    title: 'Singular @ Programmatic I/O 2026',
    body: 'Meet our team at Programmatic I/O. Book a private demo session and explore our creative technology live.',
    Illo: IlloDevice,
    stage: 'from-[#ffeef8] to-white',
  },
]
const DOCS = [
  'Publisher SDK Docs',
  'Advertiser Docs',
  'API Reference',
  'News & Updates',
  'Events',
]

export function TheArchive() {
  return (
    <>
      <Chapter chapter={9} id="company" tall={false}>
        <Eyebrow>Company</Eyebrow>
        <h2 className="display mt-7 text-[38px] text-ink md:text-[68px]">
          Built on <Dim>trust</Dim>
        </h2>
        <p className="lede mt-8">
          Founded by ad tech veterans with 20+ years building exchanges, SSPs, and
          creative platforms. Headquartered in the EU. Serving 180+ countries.
        </p>
      </Chapter>

      <Panel>
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <dl className="space-y-5">
              {OPS.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline gap-x-4 border-t border-black/8 pt-5"
                >
                  <dt className="eyebrow w-[120px] shrink-0">{k}</dt>
                  <dd className="text-[16px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <Tilt max={7}>
              <div className="solid-card flex aspect-[13/8] w-full items-center justify-center bg-linear-to-b from-white to-[#eef4ff] p-6">
                <IlloGlobe className="h-full w-full" />
              </div>
            </Tilt>
          </Reveal>
        </div>

        <RevealGroup
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          stagger={0.05}
        >
          {BADGES.map((b, i) => (
            <RevealItem key={b} index={i}>
              <Tilt max={14} lift={4}>
                <div className="flex h-[70px] items-center justify-center rounded-[16px] border border-black/8 bg-white text-[13px] font-medium text-body shadow-[0_14px_30px_-22px_rgba(11,11,18,0.7)]">
                  {b}
                </div>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-[14vh] max-w-[820px]">
          <Eyebrow>Resources</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]" id="resources">
            News, docs &amp; <Dim tint="pink">integrations</Dim>
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3">
          {NEWS.map(({ date, title, body, Illo, stage }, i) => (
            <RevealItem key={title} index={i}>
              <Tilt>
                <a href="#resources" className="solid-card group flex h-full flex-col overflow-hidden">
                  <div
                    className={`flex h-[178px] items-center justify-center border-b border-black/6 bg-linear-to-b ${stage}`}
                  >
                    <Illo className="h-[156px] w-[156px]" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <span className="eyebrow">{date}</span>
                    <h3
                      className="mt-4 text-[19px] font-semibold text-ink"
                      style={{ letterSpacing: '-0.025em', lineHeight: 1.25 }}
                    >
                      {title}
                    </h3>
                    <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-body opacity-80">
                      {body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                      Read more
                      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-6 flex flex-wrap gap-3" stagger={0.04}>
          {DOCS.map((d, i) => (
            <RevealItem key={d} index={i}>
              <a
                href="#resources"
                className="inline-flex h-[50px] items-center gap-2 rounded-full border border-black/8 bg-white px-6 text-[14px] font-medium text-ink shadow-[0_14px_30px_-22px_rgba(11,11,18,0.7)] transition-transform duration-300 hover:-translate-y-[3px]"
              >
                {d}
                <Arrow className="opacity-50" />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Panel>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · THE GATEWAY
   ════════════════════════════════════════════════════════════════════════════ */

export function TheGateway() {
  return (
    <Chapter chapter={10} id="get-started" scrim={false}>
      <div className="grid w-full gap-5 md:grid-cols-2">
        <Tilt max={6}>
          <div className="solid-card flex h-full flex-col overflow-hidden text-left">
            <div className="flex h-[190px] items-center justify-center border-b border-black/6 bg-linear-to-b from-[#eef4ff] to-white">
              <IlloHub className="h-[168px] w-[168px]" />
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

        <Tilt max={6}>
          <div className="solid-card flex h-full flex-col overflow-hidden text-left">
            <div className="flex h-[190px] items-center justify-center border-b border-black/6 bg-linear-to-b from-[#ffeef8] to-white">
              <IlloAuction className="h-[168px] w-[168px]" />
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
      </div>
    </Chapter>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   11 · THE SINGULAR POINT
   ════════════════════════════════════════════════════════════════════════════ */

export function TheSingularPoint() {
  return (
    <Chapter chapter={11} id="contact">
      <h2 className="display max-w-[960px] text-[38px] text-ink md:text-[76px]">
        Better ads. Better for <Dim tint="violet">everyone</Dim>.
      </h2>
      <p className="lede mt-8">
        Premium inventory, creative technology, and intelligent decisioning — unified in
        one platform for publishers and advertisers.
      </p>
      <div className="mt-9 flex flex-col items-center gap-6">
        <EmailCapture id="cta-email" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <GhostButton href="#advertisers">
            Start Buying
            <Arrow />
          </GhostButton>
          <GhostButton href="#publishers">
            Start Monetizing
            <Arrow />
          </GhostButton>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <Stars />
          <span className="text-[13px] text-body opacity-70">
            54B+ impressions/day · 180+ countries · Zero resold inventory
          </span>
        </div>
        <p className="eyebrow mt-2">Click anywhere to scatter the core</p>
      </div>
    </Chapter>
  )
}
