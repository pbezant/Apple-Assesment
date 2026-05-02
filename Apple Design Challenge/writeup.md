# Agentic Developer Portal — UX Write-up

**Brief:** Design and prototype a slice of an AI-native developer portal: pick a repo → view insights → trigger an agent task → watch it run in real time. Audience is a Platform / DevEx engineer overseeing many services.

This document explains the *why* behind the wireframes in `Wireframes.html`. The deliverable explores **six distinct mental models** for the same end-to-end flow, so we can compare like-for-like before committing to a direction.

---

## 1. The user we designed for

A Platform/DevEx engineer is not writing one feature at a time. On any given hour they have:

- a fleet of ~100+ services to keep healthy,
- a backlog of cross-repo chores (deps, CVEs, flakes, docs drift),
- limited attention per repo,
- and now a growing set of AI agents that can do real work — but might also do harm.

Their job is *triage and delegation at scale*, not depth in any single repo. Three things follow from that:

1. **Information density beats whitespace.** They want to see many repos and many running agents at once.
2. **Trust mechanics matter.** Agents touch shared infrastructure; "approve, edit, interrupt" must be first-class, not buried.
3. **Keyboard speed matters.** They live in terminals; the portal must feel as fast as a CLI.

These three pressures shaped every direction.

---

## 2. The six directions and why each exists

We deliberately sampled a *wide* design space instead of polishing one idea early. Each direction takes the **same 6-step flow** (pick repo → insights → trigger → live → results → history) and re-frames it around a different mental model. Reading the canvas left-to-right inside one direction shows the flow; reading top-to-bottom across directions shows the bet.

| # | Direction | Bet it makes | Risk it carries |
|---|---|---|---|
| ① | **Mission Control** | The user's primary unit of work is the *fleet*, not any one repo. | Density can overwhelm newcomers. |
| ② | **Command Palette** | Power users want zero-click flows; ⌘K should be the homepage. | Discoverability for less keyboard-fluent users. |
| ③ | **Action Catalog** | Agent capabilities should feel like a library of audited recipes. | Over-templating; the recipe list becomes a maintenance burden. |
| ④ | **Conversational Workspace** | Real work emerges from dialogue, not a form. Each repo gets a thread. | Hard to scan many threads at once; weak for fleets. |
| ⑤ | **Workflow Canvas** | Agent plans are graphs — show them as graphs and let users edit nodes. | Higher learning curve; visually heavy. |
| ⑥ | **Inline-on-Repo** | Lowest cognitive jump — the repo is already the surface; weave agents in. | Requires hosting the whole code-host UI. |

These aren't mutually exclusive. The recommendation (below) combines them.

---

## 3. Cross-cutting design decisions

A few choices apply to every direction; they're worth calling out because they're where most of the trust and clarity work lives.

### 3.1 One reserved color for "agent is live"

Every direction uses a single warm accent for *active* agent surfaces — running runs, streaming nodes, agent-authored PRs. Everything else is grayscale. The eye learns in seconds: orange = something is happening *right now*. Status is also encoded in a small set of chips (`idle / queued / running / paused / waiting / done / failed`) that appear identically everywhere.

### 3.2 Approval model is a top-level mode, not a buried setting

The Tweaks panel exposes four approval models — *fire-and-forget*, *plan-first*, *checkpoints*, *interactive*. Toggling it changes the live-execution screens across all six directions. The reasoning: at this user's scale, **the same agent action might need different supervision in different contexts** (a CVE patch on a critical service vs. a docs sweep on a side project). The portal must let policies attach to actions, repos, and teams — and the UI must show the active policy at all times. Each live-execution screen carries a small `mode` banner so the user is never surprised by how autonomous the agent is.

### 3.3 Real-time treatment is the design's center of gravity

Three of the six directions deliberately try different visual vocabularies for "watch the agent work":

- **Step cards** (D1, D3) — clean milestone cards, sub-details on demand, easiest to scan at a glance.
- **Terminal stream** (D2) — raw, transparent, fastest signal-to-noise for engineers who debug from logs.
- **Inline tool-call thread** (D4) — narrated, conversational, easiest for cross-functional review.
- **Animating graph** (D5) — best when an agent's plan branches or parallelizes.
- **Inline diff stream** (D6) — best when the user *is* reviewing code and wants to see edits land in place.

This is the most user-test-worthy axis — engineers genuinely disagree about what "transparent" should look like.

### 3.4 Interrupt is a primary control everywhere

The user picked "fully interactive — I can interrupt, redirect, ask mid-run", so every live screen has:

- a persistent input for redirecting the agent ("also handle refunds"),
- a pause button,
- a stop button,
- and feedback that the interrupt was received before the next step starts.

This is non-negotiable for a Platform engineer overseeing fleets — the cost of a mis-aimed agent run is real.

### 3.5 History is a fleet object, not a per-repo log

Every direction's history view is grouped to make *patterns* visible — runs by recipe (D3), runs across repos (D1, D6), threads (D4), flow shapes (D5). This is where DevEx engineers will spend more time than they expect: spotting which agents waste tokens, which repos eat the most retries, which recipes drift toward yellow.

---

## 4. What the wireframes deliberately do *not* do

- **No real visuals.** Diffs, charts, avatars are striped placeholders. We're testing structure, not pixels.
- **No agent personality.** Tone is left undecided so we can argue mental model first.
- **No PR-merge UX in depth.** The slice ends at "PR opened, here's the diff" — full review/merge belongs in a follow-up.
- **No org/permissions modeling.** Important for a real Platform tool, out of scope for this exercise.

---

## 5. Recommendation

The strongest synthesis for this user is:

- **Mission Control as the shell** — the fleet view is the home; live agents always pinned in a dock.
- **Conversational threads inside each repo** — once you click into a repo, work happens through dialogue. The agent narrates, tool calls render inline, the user can interrupt.
- **⌘K palette as the keyboard layer** — floats over everything; power users never need to click.
- **Recipes from the catalog** — surface as suggested actions inside the palette and the repo's quick-agent rail. They become reusable, audited capability — not a separate destination.
- **Workflow canvas as a power-user view** — opt-in, for cases where the agent's plan branches and the user wants to edit it as a graph before approving.
- **Inline-on-repo affordances** — adopted selectively (file-level "explain", line-level "fix this"), but the repo view stays familiar.

This gives one clear front door, one consistent mental model per layer of expertise, and a path from novice → power-user without changing tools.

---

## 6. What I'd do next

1. **Test the real-time treatments.** Show 3–4 platform engineers the four live-execution variants (cards / terminal / thread / graph) and watch which they trust under stress.
2. **Define the agent capability model.** Settle the trigger contract — action, scope, guardrails, approval policy — so the trigger UI in any direction stays consistent.
3. **Push directions ① + ④ to hi-fi.** Prototype the interrupt/redirect interaction at depth — that's where this product lives or dies.
4. **Decide approval-mode defaults per action.** CVE patches and major-version bumps default to `plan-first`; docs and quarantine default to `fire-and-forget`. Make these org-overridable.
5. **Stress-test density.** Mission Control's 12-repo grid is a starting point; we'll need a real plan for 100+ services (faceted filters, saved views, alerts).
