# Mission Control — Demo Script

**Duration:** ~3 minutes  
**URL:** http://localhost:5175  
**Voice:** Samantha · Rate 185 wpm  

---

## Scene 1 — Fleet View & Search (0:00–0:35)

`[LOAD] http://localhost:5175/fleet`  
`[PAUSE 1.2s]`

> Welcome to Mission Control — an agentic developer portal. The landing page shows your entire fleet of repos at a glance.

`[PAUSE 2s]`

> Each card shows the language, a 7-day activity sparkline, health status, and a live agent indicator if something is running right now.

`[PAUSE 2s]`

> Let's filter the fleet. I'll search for repos containing the word payments.

`[CLICK] search input`  
`[TYPE] "pay" (80ms delay between keystrokes)`  
`[PAUSE 0.6s]`

> Just payments-svc. Now let me show the CVE filter.

`[CLEAR] search input`  
`[CLICK] "CVE error" filter chip`  
`[PAUSE 0.8s]`

> Only repos with active CVEs. Let's reset back to the full fleet.

`[CLICK] "all 12" filter chip`  
`[PAUSE 0.6s]`

---

## Scene 2 — Multi-select & Batch Actions (0:35–1:00)

> Now for batch operations. Check the boxes to select multiple repos at once.

`[CLICK] checkbox on card 1`  
`[PAUSE 0.3s]`  
`[CLICK] checkbox on card 2`  
`[PAUSE 0.3s]`  
`[CLICK] checkbox on card 3`  
`[PAUSE 0.6s]`

> Three repos selected. The batch action bar appears with options to scan for CVEs, upgrade dependencies, generate docs, or launch a custom agent task across all selected repos simultaneously.

`[PAUSE 3s]`

> Clearing the selection.

`[CLICK] "clear" link`  
`[PAUSE 0.5s]`

---

## Scene 3 — Repo Overview: Insights (1:00–1:25)

> Click any repo card to open its overview. Let's go into payments-svc.

`[CLICK] "payments-svc" card`  
`[PAUSE 1s]`

> The Insights tab shows health signals at a glance — 3 CVEs, 18 stale dependencies, 3 flaky tests, and 72 percent coverage. Below that are AI-suggested tasks tailored to this repo's signals.

`[PAUSE 3.5s]`

> Suggested tasks are one click away from pre-filling the agent composer. Let's try the go-redis upgrade.

`[CLICK] "upgrade go-redis 8→9" suggested run button`  
`[PAUSE 0.8s]`

---

## Scene 4 — New Agent Tab: Compose & Launch (1:25–1:55)

> We're now in the agent composer. The action is pre-selected and the prompt is filled in. You can edit the prompt, add scope paths to limit what the agent can touch, and set guardrails like requiring tests to pass.

`[PAUSE 3.5s]`

> The estimated token cost is shown before you commit. No surprises. Let's launch.

`[CLICK] "Launch ↵" button`  
`[PAUSE 1.2s]`

---

## Scene 5 — Live Execution & Streaming (1:55–2:30)

> The execution panel streams the agent's trace in real time. Steps flip from pending to running to done as work progresses.

`[PAUSE 2s]`

> Running and failed steps expand automatically so your eye lands on what needs attention — completed steps collapse out of the way.

`[PAUSE 3s]`

> A terminal step fails. The output expands instantly showing the exact error — colored just like your real shell.

`[PAUSE 2.5s]`

`[CLICK] failed terminal step row` *(to expand output)*  
`[PAUSE 1s]`

> We can retry from exactly the failed step — no re-running completed work.

`[CLICK] "retry" button`  
`[PAUSE 4s]`

> The agent completes and opens a pull request. Let's view it.

`[CLICK] "view PR" button`  
`[PAUSE 1s]`

---

## Scene 6 — PR Review & Rationale (2:30–2:55)

> The agent opens a pull request reviewed exactly like any teammate's PR — title, branch info, checks passing, and a split diff.

`[PAUSE 2.5s]`

> Inline, the agent explains why it made the change. You can give it a thumbs up or thumbs down and add a comment.

`[CLICK] 👍 button`  
`[PAUSE 0.4s]`  
`[CLICK] comment input`  
`[TYPE] "clear explanation" (60ms delay between keystrokes)`  
`[PAUSE 0.4s]`  
`[CLICK] "submit" button`  
`[PAUSE 0.6s]`

> Feedback collapses to a single summary line — signal captured, review area stays clean.

`[PAUSE 1.2s]`

---

## Scene 7 — Fleet History & Run Drawer (2:55–3:10)

> Every run is logged in fleet history — cross-repo, searchable, with cost tracking.

`[CLICK] "history" nav link`  
`[PAUSE 1s]`

> Runs that produced a pull request show a direct PR link in the table. Click it to jump straight to the diff.

`[PAUSE 2s]`

> Click any row to open the run details drawer — trace, token usage, retry or jump to the full view — without leaving the history page.

`[CLICK] first history row`  
`[PAUSE 2s]`

> That's the full loop: fleet overview, repo insights, agent composer, live trace, PR review, and fleet history. Mission Control gives your platform team one fast surface to delegate work to AI agents at scale.

`[PAUSE 2s]`

`[END]`

---

## Notes

- Record browser window only (not full screen) for a cleaner crop
- Set browser zoom to 100% before starting
- Close notifications / Do Not Disturb on before recording
- If a step's timing feels rushed, increase the `[PAUSE]` before the next narration line in `demo/record.ts`
