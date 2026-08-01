import { IlloAttentionGap } from '../components/Iso'
import { CountUp, Dim, Eyebrow, Reveal, Section, Tilt } from '../components/ui'

export function Problem() {
  return (
    <Section id="problem">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal className="order-2 md:order-1">
          <Eyebrow>The Problem</Eyebrow>
          <h2 className="display mt-6 text-[38px] text-ink md:text-[58px]">
            82% of display ads are <Dim tint="coral">never</Dim> actually seen by a
            human being.
          </h2>
          <p className="lede mt-7">
            Buried below the fold. Scrolled past. You're buying impressions — not
            attention.
          </p>

          <div className="mt-10 flex items-center gap-9">
            <div>
              <div className="display text-[46px] text-ink">
                <CountUp value={82} suffix="%" />
              </div>
              <div className="eyebrow mt-2">never seen</div>
            </div>
            <div className="h-12 w-px bg-black/10" />
            <div>
              <div className="display text-[46px] text-ink">
                <CountUp value={18} suffix="%" />
              </div>
              <div className="eyebrow mt-2">what you actually bought</div>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={0.1}>
          <Tilt max={7}>
            <div className="solid-card flex aspect-[13/10] w-full items-center justify-center bg-linear-to-b from-white to-[#f4f6fb] p-6">
              <IlloAttentionGap className="h-full w-full" />
            </div>
          </Tilt>
        </Reveal>
      </div>
    </Section>
  )
}
