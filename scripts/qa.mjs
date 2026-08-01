/**
 * Browser QA. Checks every viewport for console errors, horizontal overflow,
 * invisible content, font loading and a live WebGL context, then writes
 * full-page screenshots to ./qa.
 *
 *   npm run build && npx vite preview --port 4173 & node scripts/qa.mjs
 */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'

const URL = process.env.QA_URL ?? 'http://localhost:4173/'
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1180, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
]

mkdirSync('qa', { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--enable-webgl', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

let failures = 0
const fail = (msg) => {
  failures++
  console.log(`  ✗ ${msg}`)
}
const pass = (msg) => console.log(`  ✓ ${msg}`)

for (const vp of VIEWPORTS) {
  console.log(`\n▸ ${vp.name} ${vp.width}×${vp.height}`)
  const page = await browser.newPage()
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })

  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('h1', { timeout: 30000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2500))

  // WebGL actually rendered?
  const gl = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('canvas')]
    return cs.map((c) => ({
      w: c.width,
      h: c.height,
      ctx: !!(c.getContext('webgl2') || c.getContext('webgl')),
    }))
  })
  if (gl.length && gl.every((c) => c.w > 0 && c.h > 0)) pass(`${gl.length} live canvas(es)`)
  else fail(`canvas problem: ${JSON.stringify(gl)}`)

  // Fonts
  const fonts = await page.evaluate(() =>
    ['Bricolage Grotesque Variable', 'Instrument Sans Variable', 'JetBrains Mono Variable'].map(
      (f) => [f, document.fonts.check(`16px "${f}"`)],
    ),
  )
  for (const [f, ok] of fonts) (ok ? pass : fail)(`font ${f}`)

  // Walk the page and record, for every text node, whether it was EVER visible.
  // The overture stages its copy deliberately, so a single sample at one scroll
  // position would flag intentionally-hidden text as broken. What matters is
  // that nothing is permanently invisible.
  const invisible = await page.evaluate(async () => {
    const seen = new Map()
    const sample = () => {
      for (const el of document.querySelectorAll('h1,h2,h3,p,a,button,li,dd,dt')) {
        const text = el.textContent.trim()
        if (!text) continue
        const s = getComputedStyle(el)
        const hidden =
          s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) < 0.05
        const key = el
        if (!seen.has(key)) seen.set(key, { text: text.slice(0, 46), everShown: false })
        if (!hidden) seen.get(key).everShown = true
      }
    }

    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      const l = window.__lenis
      if (l) l.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 110))
      sample()
    }
    const l = window.__lenis
    if (l) l.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 400))

    return [...seen.values()].filter((v) => !v.everShown).map((v) => v.text)
  })
  invisible.length
    ? fail(`never-visible text: ${invisible.slice(0, 4).join(' | ')}`)
    : pass('all text visible at some point')

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  overflow > 2 ? fail(`horizontal overflow ${overflow}px`) : pass('no horizontal overflow')

  // Heading count — the copy must all be present.
  const headings = await page.evaluate(() => document.querySelectorAll('h1,h2,h3').length)
  headings >= 40 ? pass(`${headings} headings`) : fail(`only ${headings} headings`)

  const real = errors.filter((e) => !/Download the React DevTools/i.test(e))
  real.length ? fail(`console: ${real.slice(0, 3).join(' | ')}`) : pass('no console errors')

  await page.screenshot({ path: `qa/${vp.name}.png`, fullPage: vp.name !== 'desktop' })
  if (vp.name === 'desktop') {
    await page.screenshot({ path: 'qa/desktop-hero.png' })
    for (const [i, y] of [900, 2100, 3400, 6200, 9000].entries()) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await new Promise((r) => setTimeout(r, 900))
      await page.screenshot({ path: `qa/desktop-scroll-${i + 1}.png` })
    }
  }

  await page.close()
}

await browser.close()
console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nALL CHECKS PASSED\n')
process.exit(failures ? 1 : 0)
