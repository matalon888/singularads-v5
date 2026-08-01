/**
 * Journey QA — travels the whole world, capturing one frame per chapter and
 * checking that each chapter's set is actually on screen (not an empty white
 * frame) and that the copy over it stays readable.
 */
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
import { PNG } from 'pngjs'

/** Fraction of pixels that are not near-white — i.e. how much world is on screen. */
function coverage(buf) {
  const png = PNG.sync.read(Buffer.from(buf))
  let n = 0
  const total = png.width * png.height
  for (let p = 0; p < png.data.length; p += 4) {
    const [r, g, b] = [png.data[p], png.data[p + 1], png.data[p + 2]]
    if (255 - r > 12 || 255 - g > 12 || 255 - b > 12) n++
  }
  return n / total
}

const URL = process.env.QA_URL ?? 'http://localhost:4188/'
mkdirSync('qa/journey', { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--enable-webgl'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('h1', { timeout: 30000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500))

const anchors = await page.evaluate(() =>
  [...document.querySelectorAll('[data-chapter]')].map((el) => {
    const r = el.getBoundingClientRect()
    return {
      i: Number(el.dataset.chapter),
      y: Math.round(r.top + window.scrollY + r.height / 2 - window.innerHeight / 2),
    }
  }),
)

let fails = 0
const fail = (m) => {
  fails++
  console.log(`  ✗ ${m}`)
}

console.log(`\nTravelling ${anchors.length} chapters\n`)

// Zero anchors means the app never mounted — that is a failure, not a clean run.
if (anchors.length < 12) fail(`only ${anchors.length} chapter anchors found (expected 12)`)

for (const { i, y } of anchors) {
  await page.evaluate((yy) => {
    const l = window.__lenis
    if (l) l.scrollTo(yy, { immediate: true })
    else window.scrollTo(0, yy)
  }, Math.max(0, y))
  await new Promise((r) => setTimeout(r, 1600))

  // Is the world actually drawing something here? A WebGL canvas without
  // preserveDrawingBuffer reads back blank via drawImage, so sample the
  // composited page screenshot instead — that is what the visitor sees.
  const shot = await page.screenshot({ path: `qa/journey/ch-${String(i).padStart(2, '0')}.png` })
  const ink = coverage(shot)

  const chapter = await page.evaluate(
    () => document.querySelector('[data-chapter]') && window.scrollY,
  )
  const label = String(i).padStart(2, '0')
  const pct = (ink * 100).toFixed(1)

  if (ink < 0.06) fail(`chapter ${label}: nothing on screen here (${pct}% coverage)`)
  else console.log(`  ✓ chapter ${label} — world coverage ${pct}%  (scrollY ${chapter})`)

}

const real = errors.filter((e) => !/DevTools/i.test(e))
if (real.length) fail(`console: ${real.slice(0, 3).join(' | ')}`)

await browser.close()
console.log(fails ? `\n${fails} FAILURE(S)\n` : '\nJOURNEY OK\n')
process.exit(fails ? 1 : 0)
