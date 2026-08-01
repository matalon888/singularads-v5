import { Logo } from '../components/Logo'

const COLUMNS: [string, string[]][] = [
  [
    'Advertisers',
    ['Creative Technology', 'Premium Inventory', 'CTV & Streaming', 'Brand Safety'],
  ],
  ['Publishers', ['SSP & Ad Serving', 'Header Bidding', 'Mobile SDK', 'CTV Monetization']],
  ['Company', ['About Us', 'Leadership', 'Partners & Quality', 'Contact']],
  [
    'Resources',
    ['Publisher SDK Docs', 'Advertiser Docs', 'API Reference', 'News & Updates', 'Events'],
  ],
  ['Legal', ['Privacy Policy', 'Terms of Service']],
]

export function Footer() {
  return (
    <footer className="w-full border-t border-black/8 bg-bone px-6 py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Logo id="foot" />
            <p className="mt-5 max-w-[280px] text-[14px] leading-[1.6] text-body opacity-75">
              The AI-powered programmatic exchange. Premium inventory, creative
              technology, and intelligent decisioning.
            </p>
          </div>

          {COLUMNS.map(([heading, links]) => (
            <div key={heading}>
              <h4 className="eyebrow">{heading}</h4>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-[14px] text-body opacity-80 transition-opacity hover:opacity-100"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-7">
          <p className="text-[13px] text-body opacity-60">© 2026 DANDO ONLINE LTD</p>
          <p className="text-[13px] text-body opacity-60">
            GPP · GDPR · CCPA — EU AI Act ready. No consent, no bid.
          </p>
        </div>
      </div>
    </footer>
  )
}
