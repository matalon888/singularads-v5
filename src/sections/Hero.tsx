import { motion } from 'motion/react'
import { Field } from '../three/Field'
import { Dim, EmailCapture, FlipWords, Stars } from '../components/ui'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-white"
    >
      {/* The convergence field */}
      <Field className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* White studio falloff so type always reads against the solids */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(74% 46% at 50% 40%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 42%, rgba(255,255,255,0.35) 68%, rgba(255,255,255,0) 86%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26vh]"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff 82%)' }}
      />

      <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-[30px] px-6 pt-[212px] pb-[128px] text-center md:pt-[248px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="eyebrow"
        >
          The AI-powered programmatic exchange
        </motion.div>

        <h1 className="display max-w-[1040px] text-[46px] text-ink sm:text-[74px] md:text-[104px]">
          <FlipWords delay={0.18}>
            {['The ', <Dim key="dim">singular</Dim>, ' moment is now here.']}
          </FlipWords>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="lede"
        >
          The AI-powered programmatic exchange. Premium inventory, creative
          technology, and intelligent decisioning — unified in one platform for
          publishers and advertisers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="flex w-full flex-col items-center gap-5"
        >
          <EmailCapture id="hero-email" />

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <Stars />
            <span
              className="text-[13px] font-medium text-body"
              style={{ letterSpacing: '-0.01em' }}
            >
              54B+ impressions/day
            </span>
            <span className="h-3 w-px bg-black/12" />
            <span className="text-[13px] text-body opacity-70">180+ countries</span>
            <span className="h-3 w-px bg-black/12" />
            <span className="text-[13px] text-body opacity-70">
              Zero resold inventory
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
