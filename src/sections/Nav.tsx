import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from '../components/Logo'
import { Arrow, InkButton } from '../components/ui'

const LINKS = [
  { label: 'Advertisers', href: '#advertisers' },
  { label: 'Publishers', href: '#publishers' },
  { label: 'Technology', href: '#technology' },
  { label: 'Company', href: '#company' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-black/6 bg-white/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[74px] w-full max-w-[1200px] items-center justify-between px-6">
        <Logo id="nav" />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-[14px] font-medium text-body transition-colors hover:text-ink"
              style={{ letterSpacing: '-0.01em' }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-linear-to-r from-blue to-pink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <InkButton
            href="#contact"
            size="sm"
            className="hidden font-mono text-[11px] tracking-[0.14em] uppercase sm:inline-flex"
          >
            Get Started
            <Arrow />
          </InkButton>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/10 bg-white lg:hidden"
          >
            <span className="relative block h-[10px] w-[16px]">
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
                className="absolute inset-x-0 top-0 h-[1.6px] rounded bg-ink"
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
                className="absolute inset-x-0 bottom-0 h-[1.6px] rounded bg-ink"
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-black/6 bg-white lg:hidden"
          >
            <div className="mx-auto grid w-full max-w-[1200px] gap-1 px-6 py-5">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-[16px] font-medium text-ink hover:bg-bone"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
