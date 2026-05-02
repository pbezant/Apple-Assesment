# Mission Control — Design Rationale

A working doc capturing the *why* behind the design decisions in `D1-sandbox.html`.
This is a rationale document, not a spec — it's meant to make the reasoning auditable
and the trade-offs explicit, so we can revisit them with evidence later.

---

## Process

I started by generating **6 distinct design directions** in parallel, each one
optimizing for a different aspect of the brief:

1. **Mission Control** — agent-first, terminal-style, optimizes for *trust through transparency*
2. **Pipeline / Kanban** — optimizes for *fleet-wide observability*
3. **Inbox** — optimizes for *triage and async review*
4. **Conversational** — chat-as-OS, optimizes for *low-friction trigger*
5. **Map / Spatial** — optimizes for *visualizing dependencies across the fleet*
6. **Recipe Book** — optimizes for *reusable, parameterized agent runs*

Generating divergent directions before converging is standard double-diamond
practice — it surfaces design tensions early (e.g. *transparency vs. speed*,
*fleet vs. repo*, *one-shot vs. recipe*) instead of locking into the first
reasonable answer.

In a normal cycle I'd put these in front of 5–8 platform engineers, run a
~15 min unmoderated test on each (think-aloud, "where would you click to do X"),
and merge the strongest signals into a single direction. For this assessment I
picked **#1 (Mission Control)** to take to high-fidelity because it mapped most
cleanly to the workflows I observed in research.

---

## Why direction #1

Three pieces of evidence converged on Mission Control:

- **It mirrors the dominant developer mental model.** Devs already live in
  CLI / terminal / agent-runner UIs (Claude Code, Cursor agent, GitHub Actions,
  Vercel deploy logs). Reusing that vocabulary — `run id`, `trace`, `tokens`,
  `cost`, `status: running/done/failed` — means zero learning curve.
- **It's the only direction where transparency is the core feature, not a
  sidebar.** That maps directly to the #1 complaint I heard about Claude Code:
  the agent's work is hidden behind a spinner, and when something goes wrong
  you can't tell *what* it did. Trust scales with visibility, especially when
  you're delegating to 142 repos at once.
- **It composes with the others.** The Inbox, Recipe, and Map directions can
  all live as *views* inside Mission Control. Picking #1 doesn't kill the
  others — it makes them tabs/screens within a coherent shell.

---

## Key design decisions

### 1. The "wizard of Oz" accordion in the live trace

**Decision.** Each step in the agent's trace (`read charge_handler.go`,
`go test ./charge/...`, `edit charge_handler.go`) is collapsible. Expanding a
`read`/`edit` step shows the touched files with diff size and a `diff →` link.
Expanding a shell step shows the actual terminal output, including colored
FAIL lines.

**Default behavior** (validated 2026-05-02):

- **Currently-running step:** expanded by default
- **Successful step:** collapsed by default
- **Failed step:** expanded by default (and stays expanded)

**Reasoning.**

- The single biggest gripe from devs using agentic tools is the *opacity* of
  work in flight. "What is it actually doing right now?" is the question that
  erodes trust and forces people to abandon the agent and do it themselves.
- The accordion is a *progressive disclosure* pattern — surface confidence by
  default (`✓ done · 12s`), reveal proof on demand. It pulls back the curtain,
  but only when the user asks. That's the wizard-of-Oz reference: there *is*
  something behind the curtain, and we let you see it.
- The default-expansion rules above mean the user's eye lands on (a) what's
  happening *right now*, and (b) anything that needs their attention
  (failures), without making them open every step.
- It also collapses two screens into one. Previously you'd click a step,
  navigate to a "logs" or "files" sub-page, then back. Now the evidence is
  inline with the timeline.

**Evidence this is the right pattern.** GitHub Actions, Vercel, CircleCI, and
Linear's agent UI all use the same expand-step-to-see-logs pattern. It's the
de-facto standard in the CI/CD space, which is the closest analog to "watching
an agent work."

---

### 2. Repo screen: tabbed, action-first

**Decision.** Inside a repo view, the tab order is
`insights · + new agent · files · prs · agents · history`.
The `insights` tab is the default landing tab — it shows the *why* (CVEs,
stale deps, flaky tests, suggested runs). The `+ new agent` tab is rendered in
accent and is one click away.

**Reasoning.**

- **Context co-locates with the trigger.** The earlier flow had the user
  leaving the insights view to compose a run on a separate screen. That's a
  lossy handoff — the *why* (signals) and the *what* (the prompt I'm writing)
  lived on different pages, so the user had to hold the signals in working
  memory.
- **The tab-bar pattern was already there.** GitHub-style repo anatomy
  (`Code · Issues · PRs · Actions · Settings`) is something every developer
  already knows. Adding tabs to the agent screen fits the existing mental
  model — no new chrome to learn.
- **It collapses a step.** Insights → Trigger was a 2-screen flow. With the
  tab, it's one screen with a toggle.
- **Natural deep-linking.** Clicking a suggested run ("upgrade go-redis 8→9")
  in the insights tab pre-populates the new-agent tab. The tab structure
  makes that affordance obvious.

**Tab order — insights first** (validated 2026-05-02):
The first iteration put `+ new agent` first to push agent-as-primary. Feedback
was that users coming to a repo view expect insights first — that's where they
land in GitHub today, and that's where they evaluate *whether* an agent run
is even warranted. Insights first → agent tab one click away preserves the
agent-forward stance without breaking the dominant convention.

---

### 3. Repo screen layout: 2-column, composer-left / context-right

**Decision.** Inside the new-agent tab, left column holds
`action picker → prompt → scope/guardrails → launch bar`. Right rail holds
`suggested runs · repo signals · recent runs`.

**Reasoning.**

- The earlier vertical stack ran out of vertical space and the launch bar
  started overlapping the meta caption. A 2-column workbench layout solves
  the overflow *and* makes the page feel less cramped.
- Reading order matches task flow: pick an action → write a prompt → set
  guardrails → launch. The launch bar sits in its own bordered tray at the
  bottom-left so it reads as a terminal "submit" affordance.
- The right rail is *reference material*, not workflow. Splitting "do" from
  "know" reduces visual noise on the primary path while keeping signals one
  glance away.

---

### 4. PR review screen modeled on GitHub

**Decision.** The agent's output isn't a custom "agent results" screen — it's
a familiar GitHub PR page: title + #number + open chip, branch info, tabs
(`Conversation · Commits · Checks · Files changed`), file tree on the left,
split-diff in the main area, inline agent comment thread on the touched lines,
green "all checks passed" merge bar at the bottom with
`merge / approve / request changes`.

A dedicated **agent rationale panel** sits inline with the diff, with a
thumbs-up / thumbs-down / comment feedback control. Once the user submits
feedback it collapses into a single-line summary under the rationale (so the
signal stays visible without taking up review-area real estate).

**Reasoning.**

- The agent's output is reviewed with the same skills, in the same headspace,
  as a human teammate's PR. Using a different UI for "agent PR vs. human PR"
  would create a two-class system and make agent output feel less trustworthy
  ("why is this one weird?").
- Every developer can already operate this layout. Zero learning cost.
- It makes the agent feel like a **teammate, not a tool**. The agent commits
  to a branch, opens a PR, gets reviewed, and merges through the same gates
  as anyone else. That framing is the entire trust story for the product.
- The rationale panel + feedback widget creates an explicit place for
  reviewer-to-agent learning signal. We *want* that signal — both for the
  user (a place to vent / agree) and for us (training data on what reviewers
  consider a good or bad rationale).

---

### 5. App-level nav (fleet · history · recipes · settings)

**Decision.** A persistent top nav bar — `MISSION CTL · fleet · history · recipes · settings · <user · org>` — sits above the screen body on the fleet-level screens (picker + history). The active tab is underlined ink-black so the user knows where they are. `recipes` and `settings` are scaffolded for future screens.

**Reasoning.**

- **The flat artboard layout was hiding a real navigation gap.** Each screen lived in isolation on the canvas; in the real product the user had no way to *get to* fleet history from the picker, or back. The nav makes that connection explicit.
- **Fleet ↔ history is a fleet-level pairing.** History is cross-repo telemetry — the same scope as the picker. They belong in the same chrome. Repo-level screens (live, PR review, repo · new agent) are *deeper* contexts and inherit the nav implicitly when implemented; we kept them un-chromed in the wireframe to avoid bloating the artboards.
- **Two entry points to history, not one.** Top nav for deliberate navigation; "history ↗" link in the picker chat panel for "what just ran?" moments. Discoverability through both intent and conversation.
- **The chrome doubles as branding/identity.** `MISSION CTL` wordmark + user · org chip on the right is the product's persistent shell — it tells the user what app they're in and which org context they're operating against. Important when this product will eventually live alongside Claude Code, Cursor, and other agentic tools in the same browser.

**Open question.** Should the app nav appear on repo-level screens too (live, PR review, repo · new agent)? Argument for: consistent way home from anywhere. Argument against: those are "focused work" screens — adding chrome could make them feel less immersive. Worth A/B-ing in usage.

---

## Open questions / things to validate next

- **Suggested runs vs. blank slate.** Decision: keep pre-population.
  Concern to monitor: does giving the user a basic suggestion to work off of
  reduce the deliberate "compose a prompt" step and turn the agent into a
  yes-button? Worth measuring `time-to-launch` and `pre-launch edits` once
  there's real usage data.
- **Rationale-feedback sample size.** The thumbs/comment widget only pays off
  if a non-trivial fraction of reviewers actually submit feedback. Track
  submit-rate; if <5%, redesign the prompt or move it inline with the merge bar.
- **Trace accordion on long runs.** The expand-running-collapse-success rule
  is fine for ~6-step traces. For 50-step traces the running step might
  scroll off screen. Future iteration: pin the running step to the top, or
  add a mini-map.
- **Cross-repo agent runs.** Current flow assumes one agent run = one repo.
  When the user wants "upgrade go-redis 8→9 across all 17 services," does
  that fan out to 17 PRs from one launch, or 17 separate runs? Open question.
