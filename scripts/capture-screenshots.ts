/**
 * capture-screenshots.ts
 *
 * Usage (from Apple-Assesment/):
 *   npx tsx scripts/capture-screenshots.ts
 *
 * Requires: @playwright/test (already in devDeps), npx serve (auto-installed)
 * Outputs: resume-1/public/images/projects/apple-design-challenge/*.png
 */

import { chromium } from '@playwright/test'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WIREFRAMES_DIR = path.resolve(__dirname, '../Apple Design Challenge')
const OUT_DIR = path.resolve(__dirname, '../../resume-1/public/images/projects/apple-design-challenge')
const DEPLOYED_URL = 'https://marvelous-parfait-92a13d.netlify.app'
const LOCAL_PORT = 7391

fs.mkdirSync(OUT_DIR, { recursive: true })

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

/**
 * Navigate the wireframe canvas so that the section with data-dc-section=sectionId
 * is visible in the top-left of the viewport, then return the section's height.
 */
async function focusCanvasSection(page: import('@playwright/test').Page, sectionId: string): Promise<boolean> {
  return page.evaluate((sid) => {
    const section = document.querySelector<HTMLElement>(`[data-dc-section="${sid}"]`)
    if (!section) return false

    // The inner canvas content div has willChange:'transform' in its inline style.
    // It may or may not have translate3d yet (only set after user interaction).
    const transformEl =
      document.querySelector<HTMLElement>('[style*="translate3d"]') ??
      document.querySelector<HTMLElement>('[style*="will-change"]')
    if (!transformEl) return false

    const rect = section.getBoundingClientRect()
    const t = transformEl.style.transform ?? ''
    const m = t.match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/)
    const cx = m ? parseFloat(m[1]) : 0
    const cy = m ? parseFloat(m[2]) : 0

    // Shift so the section's top-left lands at (20, 20) in the viewport
    const pad = 20
    transformEl.style.transition = 'none'
    transformEl.style.transform = `translate3d(${cx + pad - rect.left}px, ${cy + pad - rect.top}px, 0) scale(1)`
    return true
  }, sectionId)
}

async function run() {
  // ── Serve wireframes bundle via Python (no extension-stripping redirects) ───
  console.log('Starting static server for wireframes...')
  // Kill any stale process on the port before starting
  try {
    const { execSync } = await import('child_process')
    execSync(`lsof -ti :${LOCAL_PORT} | xargs kill -9 2>/dev/null || true`, { stdio: 'pipe' })
  } catch { /* ignore */ }
  await sleep(500)

  const server = spawn('python3', [
    '-m', 'http.server', String(LOCAL_PORT),
    '--directory', WIREFRAMES_DIR,
  ], { stdio: 'pipe' })

  // Give the server time to start
  await sleep(2000)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  try {
    // ── Load wireframes (React + Babel Standalone — needs ~8s to transpile) ───
    console.log('Capturing wireframe direction shots...')
    await page.goto(`http://localhost:${LOCAL_PORT}/Wireframes.html`, { waitUntil: 'load', timeout: 30000 })
    await sleep(15000) // wait for CDN loads (React, Babel) + transpile + render

    // Verify the React root rendered (not just the static empty div)
    const sections = await page.evaluate(() =>
      [...document.querySelectorAll('[data-dc-section]')].map(e => e.getAttribute('data-dc-section'))
    )
    console.log('  Sections found in DOM:', JSON.stringify(sections))
    if (!sections.length) {
      console.error('  ✗ React did not render — check console errors')
      const consoleErrors = await page.evaluate(() => window.__errors__ ?? [])
      console.error('  Errors:', consoleErrors)
    }

    const directions = [
      { sectionId: 'd1', name: 'dir1-mission-control' },
      { sectionId: 'd2', name: 'dir2-command-palette' },
      { sectionId: 'd3', name: 'dir3-action-catalog' },
      { sectionId: 'd4', name: 'dir4-conversational' },
      { sectionId: 'd5', name: 'dir5-workflow-canvas' },
      { sectionId: 'd6', name: 'dir6-inline-on-repo' },
    ]

    for (const { sectionId, name } of directions) {
      const ok = await focusCanvasSection(page, sectionId)
      if (!ok) {
        console.warn(`  ⚠ Section [data-dc-section="${sectionId}"] not found`)
        continue
      }
      await sleep(300)
      const outPath = path.join(OUT_DIR, `${name}.png`)
      await page.screenshot({ path: outPath })
      console.log(`  ✓ ${name}.png`)
    }

    // ── Deployed prototype shots ──────────────────────────────────────────────
    console.log('Capturing deployed prototype shots...')
    await page.setViewportSize({ width: 1280, height: 800 })

    const routes = [
      { route: '/fleet',              name: 'd1-fleet' },
      { route: '/repos/payments-svc', name: 'd1-repo-overview' },
      { route: '/runs/9f3a',          name: 'd1-live-execution' },
      { route: '/prs/482',            name: 'd1-pr-review' },
      { route: '/history',            name: 'd1-history' },
    ]

    for (const { route, name } of routes) {
      await page.goto(`${DEPLOYED_URL}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
      await sleep(800)
      await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`) })
      console.log(`  ✓ ${name}.png`)
    }

    // hero = same as fleet view
    fs.copyFileSync(path.join(OUT_DIR, 'd1-fleet.png'), path.join(OUT_DIR, 'hero.png'))
    console.log('  ✓ hero.png (copy of d1-fleet)')

    console.log(`\nAll screenshots saved to:\n  ${OUT_DIR}`)
  } finally {
    await browser.close()
    server.kill()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
