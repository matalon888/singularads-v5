/** The DSP partners named on the live site, each riding a tilted 3D slab. */
const PARTNERS = ['THE TRADE DESK', 'DV360', 'xandr', 'amazon', 'Yahoo', 'OpenX']

export function Marquee() {
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS]
  return (
    <section
      aria-label="Integrated demand partners"
      className="marquee-host relative w-full overflow-hidden border-y border-black/8 bg-white py-7"
      style={{ perspective: '900px' }}
    >
      <div className="marquee-track flex w-max items-center gap-4">
        {row.map((p, i) => (
          <div
            key={`${p}-${i}`}
            className="flex h-[52px] shrink-0 items-center rounded-[14px] border border-black/8 bg-card px-7 shadow-[0_10px_26px_-18px_rgba(11,11,18,0.5)]"
            style={{
              transform: `rotateX(8deg) rotateY(${i % 2 ? -7 : 7}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="text-[12px] font-semibold tracking-[0.14em] text-ink opacity-55">
              {p}
            </span>
          </div>
        ))}
      </div>

      {/* edge falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: 'linear-gradient(to left, #fff, rgba(255,255,255,0))' }}
      />
    </section>
  )
}
