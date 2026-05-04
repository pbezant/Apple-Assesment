/**
 * Mission Control — automated demo with AI voiceover
 *
 * Usage:
 *   1. Generate voice clips (once):  OPENAI_API_KEY=sk-... npx tsx demo/generate-voice.ts
 *   2. Start dev server:             npm run dev
 *   3. Start screen recording (QuickTime → New Screen Recording, select browser window)
 *   4. Run:                          npx tsx demo/record.ts
 *   5. Stop screen recording when the script prints "Demo complete"
 *
 * Audio: pre-generated MP3s in demo/audio/ played via macOS afplay (blocks until done).
 *        Falls back to macOS `say` if a clip is missing.
 */

import { chromium } from '@playwright/test'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL   = 'http://localhost:5173'
const AUDIO_DIR  = path.join(__dirname, 'audio')
const W = 1280
const H = 800
// ─────────────────────────────────────────────────────────────────────────────

let clipIndex = 0

/** Play the next pre-generated clip, or fall back to macOS say */
function say(text: string) {
  clipIndex++
  const num = String(clipIndex).padStart(2, '0')
  const clipPath = path.join(AUDIO_DIR, `${num}.mp3`)

  if (fs.existsSync(clipPath)) {
    execSync(`afplay "${clipPath}"`)
  } else {
    // Fallback: macOS built-in TTS
    const clean = text.replace(/\*\*/g, '').replace(/`([^`]+)`/g, '$1')
    execSync(`say -v Samantha -r 185 "${clean.replace(/"/g, "'")}"`)
    console.warn(`  ⚠ Missing clip ${num}.mp3 — used fallback say`)
  }
}

/** Pause silently */
function pause(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

async function run() {
  const browser = await chromium.launch({
    headless: false,
    args: [`--window-size=${W},${H}`, '--window-position=0,0'],
  })
  const page = await browser.newPage()
  await page.setViewportSize({ width: W, height: H })

  // ── Scene 1: Fleet view & search ──────────────────────────────────────────
  // Navigate first, wait for the page to fully load, then start audio
  await page.goto(`${BASE_URL}/fleet`)
  await page.waitForLoadState('networkidle')
  await pause(800)

  say("Welcome to Mission Control — an agentic developer portal. The landing page shows your entire fleet of repos at a glance.")
  await pause(1200)

  say("Each card shows the language, a 7-day activity sparkline, health status, and a live agent indicator if something is running right now.")
  await pause(2000)

  say("Let's filter the fleet. I'll search for repos containing the word payments.")
  await page.getByPlaceholder('filter by name, language, or type…').click()
  await page.getByPlaceholder('filter by name, language, or type…').type('pay', { delay: 80 })
  await pause(600)

  say("Just payments-svc. Now let me show the CVE filter.")
  await page.getByPlaceholder('filter by name, language, or type…').clear()
  await page.getByText('CVE error').click()
  await pause(800)

  say("Only repos with active CVEs. Let's reset back to the full fleet.")
  await page.getByRole('button', { name: 'all 12' }).click()
  await pause(600)

  // ── Scene 2: Multi-select & batch actions ─────────────────────────────────
  say("Now for batch operations. Check the boxes to select multiple repos at once.")
  await page.locator('input[type="checkbox"]').nth(1).click()
  await pause(300)
  await page.locator('input[type="checkbox"]').nth(2).click()
  await pause(300)
  await page.locator('input[type="checkbox"]').nth(3).click()
  await pause(600)

  say("Three repos selected. The batch action bar appears with options to scan for CVEs, upgrade dependencies, generate docs, or launch a custom agent task across all selected repos simultaneously.")
  await pause(3000)

  say("Clearing the selection.")
  await page.getByText('clear').click()
  await pause(500)

  // ── Scene 3: Repo overview — insights ─────────────────────────────────────
  say("Click any repo card to open its overview. Let's go into payments-svc.")
  await page.getByText('payments-svc').first().click()
  await pause(1000)

  say("The Insights tab shows health signals at a glance — 3 CVEs, 18 stale dependencies, 3 flaky tests, and 72 percent coverage. Below that are AI-suggested tasks tailored to this repo's signals.")
  await pause(3500)

  say("Suggested tasks are one click away from pre-filling the agent composer. Let's try the go-redis upgrade.")
  await page.getByText('upgrade go-redis 8→9').first().click()
  await pause(800)

  // ── Scene 4: New agent tab — compose & launch ────────────────────────────
  say("We're now in the agent composer. The action is pre-selected and the prompt is filled in. You can edit the prompt, add scope paths to limit what the agent can touch, and set guardrails like requiring tests to pass.")
  await pause(3500)

  say("The estimated token cost is shown before you commit. No surprises. Let's launch.")
  await page.getByText('Launch ↵').click()
  await pause(1200)

  // ── Scene 5: Live execution & streaming ───────────────────────────────────
  say("The execution panel streams the agent's trace in real time. Steps flip from pending to running to done as work progresses.")
  await pause(2000)

  say("Running and failed steps expand automatically so your eye lands on what needs attention — completed steps collapse out of the way.")
  await pause(3000)

  say("A terminal step fails. The output expands instantly showing the exact error — colored just like your real shell.")
  await pause(2500)

  const termStep = page.locator('text=terminal').first()
  if (await termStep.isVisible()) {
    await termStep.click()
    await pause(1000)
  }

  say("We can retry from exactly the failed step — no re-running completed work.")
  const retryBtn = page.getByText('retry')
  if (await retryBtn.isVisible()) {
    await retryBtn.click()
    await pause(4000)
  }

  say("The agent completes and opens a pull request. Let's view it.")
  const viewPR = page.getByText('view PR')
  if (await viewPR.isVisible()) {
    await viewPR.click()
    await pause(1000)
  } else {
    await page.goto(`${BASE_URL}/prs/482`)
    await pause(1000)
  }

  // ── Scene 6: PR review & rationale ───────────────────────────────────────
  say("The agent opens a pull request reviewed exactly like any teammate's PR — title, branch info, checks passing, and a split diff.")
  await pause(2500)

  say("Inline, the agent explains why it made the change. You can give it a thumbs up or thumbs down and add a comment.")
  await page.getByText('👍').click()
  await pause(400)
  await page.getByPlaceholder('add a comment (optional)…').click()
  await page.getByPlaceholder('add a comment (optional)…').type('clear explanation', { delay: 60 })
  await pause(400)
  await page.getByText('submit').click()
  await pause(600)

  say("Feedback collapses to a single summary line — signal captured, review area stays clean.")
  await pause(1200)

  // ── Scene 7: Fleet history & run drawer ───────────────────────────────────
  say("Every run is logged in fleet history — cross-repo, searchable, with cost tracking.")
  await page.getByText('history').first().click()
  await pause(1000)

  say("Runs that produced a pull request show a direct PR link in the table. Click it to jump straight to the diff.")
  await pause(2000)

  say("Click any row to open the run details drawer — trace, token usage, retry or jump to the full view — without leaving the history page.")
  await page.locator('[class*="grid cursor-pointer"]').first().click()
  await pause(2000)

  say("That's the full loop: fleet overview, repo insights, agent composer, live trace, PR review, and fleet history. Mission Control gives your platform team one fast surface to delegate work to AI agents at scale.")
  await pause(2000)

  await browser.close()
  console.log('\n✓ Demo complete — stop your screen recording.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
