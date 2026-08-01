import { Field } from '../three/Field'
import {
  Arrow,
  Dim,
  EmailCapture,
  GhostButton,
  Reveal,
  Stars,
} from '../components/ui'

export function ClosingCTA() {
  return (
    <section id="contact" className="w-full bg-white px-6 py-[104px] md:py-[136px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] border border-black/8 bg-white shadow-[var(--shadow-solid)]">
            {/* The same field, fully converged — the page closes where it opened */}
            <Field
              className="pointer-events-none absolute inset-0 h-full w-full"
              count={110}
              radius={11}
              dolly={0}
              baseZ={13}
              fixedProgress={0.26}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(66% 44% at 50% 56%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 44%, rgba(255,255,255,0.3) 72%, rgba(255,255,255,0) 90%)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-[30px] px-6 pt-[150px] pb-[110px] text-center md:px-16">
              <h2 className="display max-w-[920px] text-[38px] text-ink md:text-[68px]">
                Better ads. Better for <Dim tint="violet">everyone</Dim>.
              </h2>

              <p className="lede">
                Premium inventory, creative technology, and intelligent decisioning —
                unified in one platform for publishers and advertisers.
              </p>

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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
