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
const LOCAL_PORT = 4321

fs.mkdirSync(OUT_DIR, { recursive: true })

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function run() {
  // ── Serve the wireframes bundle locally ──────────────────────────────────
  console.log('Starting static server for wireframes...')
  const server = spawn('npx', ['serve', WIREFRAMES_DIR, '-p', String(LOCAL_PORT), '--no-clipboard'], {
    stdio: 'pipe',
    shell: true,
  })

  // Wait for the server to be ready
  await sleep(2500)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  try {
    // ── Wireframe direction shots ──────────────────────────────────────────
    console.log('Capturing wireframe direction shots...')
    await page.goto(`http://localhost:${LOCAL_PORT}/Wireframes.html`, { waitUntil: 'load' })
    // Wait for Babel to transpile and React to render — takes several seconds
    await sleep(6000)

    const directions: Array<{ id: string; name: string }> = [
      { id: 'd1-1', name: 'dir1-mission-control' },
      { id: 'd2-1', name: 'dir2-command-palette' },
      { id: 'd3-1', name: 'dir3-action-catalog' },
      { id: 'd4-1', name: 'dir4-conversational' },
      { id: 'd5-1', name: 'dir5-workflow-canvas' },
      { id: 'd6-1', name: 'dir6-inline-on-repo' },
    ]

    for (const { id, name } of directions) {
      try {
        const locator = page.locator(`#${id}`)
        await locator.waitFor({ state: 'visible', timeout: 10000 })
        const outPath = path.join(OUT_DIR, `${name}.png`)
        await locator.screenshot({ path: outPath })
        console.log(`  ✓ ${name}.png`)
      } catch {
        // fallback: full-page screenshot scrolled to element
        try {
          await page.evaluate((elId) => {
            const el = document.getElementById(elId)
            if (el) el.scrollIntoView()
          }, id)
          await sleep(500)
          const outPath = path.join(OUT_DIR, `${name}.png`)
          await page.screenshot({ path: outPath })
          console.log(`  ✓ ${name}.png (full-page fallback)`)
        } catch {
          console.warn(`  ⚠ Element #${id} not found, skipping ${name}.png`)
        }
      }
    }

    // ── Hero: full D1 section ────────────────────────────────────────────────
    try {
      const d1Section = page.locator('#d1-1').first()
      await d1Section.waitFor({ state: 'visible', timeout: 5000 })
      await d1Section.screenshot({ path: path.join(OUT_DIR, 'hero.png') })
      console.log('  ✓ hero.png')
    } catch {
      console.warn('  ⚠ Could not capture hero.png')
    }

    // ── Deployed prototype shots ─────────────────────────────────────────────
    console.log('Capturing deployed prototype shots...')
    await page.setViewportSize({ width: 1280, height: 800 })

    const routes: Array<{ path: string; name: string }> = [
      { path: '/fleet',                name: 'd1-fleet' },
      { path: '/repos/payments-svc',   name: 'd1-repo-overview' },
      { path: '/runs/9f3a',            name: 'd1-live-execution' },
      { path: '/prs/482',              name: 'd1-pr-review' },
      { path: '/history',              name: 'd1-history' },
    ]

    for (const { path: routePath, name } of routes) {
      await page.goto(`${DEPLOYED_URL}${routePath}`, { waitUntil: 'networkidle', timeout: 30000 })
      await sleep(800)
      const outPath = path.join(OUT_DIR, `${name}.png`)
      await page.screenshot({ path: outPath, fullPage: false })
      console.log(`  ✓ ${name}.png`)
    }

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
