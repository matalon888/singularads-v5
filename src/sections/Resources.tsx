import { IlloAgent, IlloDevice, IlloLatency } from '../components/Iso'
import {
  Arrow,
  Dim,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Tilt,
} from '../components/ui'

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

export function Resources() {
  return (
    <Section id="resources" bone>
      <Reveal className="max-w-[820px]">
        <Eyebrow>Resources</Eyebrow>
        <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
          News, docs &amp; <Dim tint="pink">integrations</Dim>
        </h2>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3">
        {NEWS.map(({ date, title, body, Illo, stage }, i) => (
          <RevealItem key={title} index={i}>
            <Tilt>
              <a
                href="#resources"
                className="solid-card group flex h-full flex-col overflow-hidden"
              >
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
              style={{ letterSpacing: '-0.01em' }}
            >
              {d}
              <Arrow className="opacity-50" />
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
