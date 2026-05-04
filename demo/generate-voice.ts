/**
 * generate-voice.ts — Pre-generate AI voiceover clips for the demo
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx demo/generate-voice.ts
 *
 * Outputs MP3s to demo/audio/NN.mp3 (numbered in script order).
 * Run once; record.ts plays them with afplay.
 *
 * Voice options: alloy | echo | fable | onyx | nova | shimmer
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'audio')
fs.mkdirSync(OUT_DIR, { recursive: true })

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const VOICE = 'nova'    // nova = warm, clear female voice — great for product demos
const MODEL = 'tts-1-hd'

// ── Narration lines in order ──────────────────────────────────────────────────
// Keep in sync with the say() calls in record.ts
const lines: string[] = [
  // Scene 1 — Fleet view
  "Welcome to Mission Control — an agentic developer portal. The landing page shows your entire fleet of repos at a glance.",
  "Each card shows the language, a 7-day activity sparkline, health status, and a live agent indicator if something is running right now.",
  "Let's filter the fleet. I'll search for repos containing the word payments.",
  "Just payments-svc. Now let me show the CVE filter.",
  "Only repos with active CVEs. Let's reset back to the full fleet.",

  // Scene 2 — Multi-select
  "Now for batch operations. Check the boxes to select multiple repos at once.",
  "Three repos selected. The batch action bar appears with options to scan for CVEs, upgrade dependencies, generate docs, or launch a custom agent task across all selected repos simultaneously.",
  "Clearing the selection.",

  // Scene 3 — Repo overview
  "Click any repo card to open its overview. Let's go into payments-svc.",
  "The Insights tab shows health signals at a glance — 3 CVEs, 18 stale dependencies, 3 flaky tests, and 72 percent coverage. Below that are AI-suggested tasks tailored to this repo's signals.",
  "Suggested tasks are one click away from pre-filling the agent composer. Let's try the go-redis upgrade.",

  // Scene 4 — Compose & launch
  "We're now in the agent composer. The action is pre-selected and the prompt is filled in. You can edit the prompt, add scope paths to limit what the agent can touch, and set guardrails like requiring tests to pass.",
  "The estimated token cost is shown before you commit. No surprises. Let's launch.",

  // Scene 5 — Live execution
  "The execution panel streams the agent's trace in real time. Steps flip from pending to running to done as work progresses.",
  "Running and failed steps expand automatically so your eye lands on what needs attention — completed steps collapse out of the way.",
  "A terminal step fails. The output expands instantly showing the exact error — colored just like your real shell.",
  "We can retry from exactly the failed step — no re-running completed work.",
  "The agent completes and opens a pull request. Let's view it.",

  // Scene 6 — PR review
  "The agent opens a pull request reviewed exactly like any teammate's PR — title, branch info, checks passing, and a split diff.",
  "Inline, the agent explains why it made the change. You can give it a thumbs up or thumbs down and add a comment.",
  "Feedback collapses to a single summary line — signal captured, review area stays clean.",

  // Scene 7 — Fleet history
  "Every run is logged in fleet history — cross-repo, searchable, with cost tracking.",
  "Runs that produced a pull request show a direct PR link in the table. Click it to jump straight to the diff.",
  "Click any row to open the run details drawer — trace, token usage, retry or jump to the full view — without leaving the history page.",
  "That's the full loop: fleet overview, repo insights, agent composer, live trace, PR review, and fleet history. Mission Control gives your platform team one fast surface to delegate work to AI agents at scale.",
]

async function generate() {
  console.log(`Generating ${lines.length} clips with ${MODEL} / ${VOICE}...\n`)

  for (let i = 0; i < lines.length; i++) {
    const num = String(i + 1).padStart(2, '0')
    const outPath = path.join(OUT_DIR, `${num}.mp3`)

    if (fs.existsSync(outPath)) {
      console.log(`  skip  ${num}.mp3 (already exists)`)
      continue
    }

    const response = await client.audio.speech.create({
      model: MODEL,
      voice: VOICE,
      input: lines[i],
      speed: 1.0,
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(outPath, buffer)
    console.log(`  ✓ ${num}.mp3  — "${lines[i].slice(0, 60)}…"`)
  }

  console.log(`\nDone. ${lines.length} clips saved to demo/audio/`)
  console.log('Run the demo with: npm run demo')
}

generate().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
