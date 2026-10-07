/**
 * Full-page screenshot of the dev build at the 1366px artboard width.
 * Output: .verify/build.png
 *
 *   npx playwright install chromium   # once
 *   node scripts/shot.mjs
 *
 * Optional env:
 *   WIDTH=1920        render at another width
 *   OUT=foo.png       output filename inside .verify/
 *   SETTLE=2500       ms to wait after load, for entrance animations to finish
 *   CHROMIUM=/path    explicit browser binary
 */
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const width = Number(process.env.WIDTH || 1366)
const settle = Number(process.env.SETTLE || 1500)
const out = process.env.OUT || 'build.png'

mkdirSync(resolve(root, '.verify'), { recursive: true })

const server = await createServer({
  root,
  server: { port: 5190, open: false },
  logLevel: 'error',
})
await server.listen()

const browser = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
)
const page = await browser.newPage({
  viewport: { width, height: 900 },
  deviceScaleFactor: 1,
})

await page.goto('http://localhost:5190/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

// scroll the whole page once so IntersectionObserver / ScrollTrigger entrances
// all fire, then return to the top before capturing
await page.evaluate(async () => {
  const step = window.innerHeight
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(settle)

await page.screenshot({ path: resolve(root, '.verify', out), fullPage: true })

const [h, sw] = await page.evaluate(() => [
  document.body.scrollHeight,
  document.documentElement.scrollWidth,
])
console.log(`${out}  width=${width}  height=${h}  scrollWidth=${sw}` +
  (sw > width ? '  ** HORIZONTAL OVERFLOW **' : ''))
if (width === 1366 && h !== 6520) {
  console.log(`  ! expected height 6520, got ${h} — layout has shifted`)
}

await browser.close()
await server.close()
