// dir1-mission-control.jsx
// Direction 1 — Mission Control
// Fleet-first dashboard. Many repos visible at once. Live agents pinned in a
// bottom dock. Heavy-density, telemetry-feel. The user's primary view IS
// the fleet; repos are picked from the grid. Trigger via inline "+ agent".

// MERGED screen: fleet grid (left) + selected-repo insights & action sidebar
// (right). Clicking an action chip in the sidebar fills the prompt at the
// bottom; the user can edit it before launching.
function D1RepoPicker({ mode }) {
  const repos = [
  ['payments-svc', 'Go', 'ok', 'svc', true, [3, 4, 5, 4, 6, 5, 7, 4, 8]],
  ['checkout-web', 'TS', 'ok', 'UI', true, [2, 3, 4, 3, 5, 4, 6]],
  ['ml-features', 'Py', 'warn', 'ml', true, [1, 2, 3, 2, 4, 3, 2]],
  ['auth-edge', 'Rust', 'ok', 'svc', false, [2, 3, 3, 4, 3, 5, 4]],
  ['data-pipe', 'Py', 'err', 'etl', false, [5, 4, 3, 2, 3, 4, 2]],
  ['mobile-ios', 'Swift', 'ok', 'app', false, [2, 2, 3, 3, 4, 3, 4]],
  ['notif-relay', 'Go', 'ok', 'svc', false, [2, 3, 2, 4, 3, 4, 3]],
  ['search-idx', 'Java', 'ok', 'svc', false, [3, 3, 4, 3, 4, 5, 4]],
  ['billing-svc', 'Go', 'ok', 'svc', false, [2, 3, 4, 5, 4, 5, 6]]];

  return (
    <Screen label="MISSION-CONTROL · /fleet · payments-svc selected">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* APP NAV — fleet-level chrome, shared with /history */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px',
          borderBottom: `1px solid ${WF.line}`, background: WF.paperAlt, flexShrink: 0 }}>
          <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>MISSION CTL</span>
          <span className="wf-tab active" style={{ borderBottom: `2px solid ${WF.ink}`, paddingBottom: 4 }}>fleet</span>
          <span className="wf-tab">history</span>
          <span className="wf-tab">recipes</span>
          <span className="wf-tab">settings</span>
          <span className="wf-tiny" style={{ marginLeft: 'auto', color: WF.muted }}>preston · acme-corp</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', flex: 1, minHeight: 0 }}>
        {/* LEFT — fleet grid */}
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0,
          borderRight: `1px solid ${WF.lineFaint}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-h2" style={{ fontSize: 16 }}>fleet · 142 repos</span>
            <span className="wf-chip live" style={{ marginLeft: 6 }}><span className="wf-dot" />7 live</span>
            <input className="wf-input" placeholder="filter…" style={{ flex: 1, marginLeft: 8 }} />
            <button className="wf-btn sm">sort: activity</button>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span className="wf-chip">all 142</span>
            <span className="wf-chip ghost">Upgradeable 12</span>
            <span className="wf-chip ghost">CVE error</span>
            <span className="wf-chip ghost">flagged</span>
          </div>
          <ModeBanner mode={mode} />
          <div style={{ flex: 1, overflow: 'hidden', display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 'min-content', gap: 6 }}>
            {repos.map(([n, l, h, t, live, sp], i) =>
            <div key={n} className="wf-box" style={{ padding: 8, position: 'relative',
              background: i === 0 ? '#fff7f3' : '#fff',
              borderColor: i === 0 ? WF.accent : WF.line,
              borderWidth: i === 0 ? 2 : 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</span>
                    <span className="wf-tiny">{t} · {l}</span>
                </div>
                  {live && <span className="wf-chip live" style={{ fontSize: 9, padding: '0 5px' }}><span className="wf-dot" /></span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <Spark data={sp} />
                  <span className="wf-tiny" style={{ marginLeft: 'auto' }}>{h === 'err' ? '!' : h === 'warn' ? '·' : '✓'}</span>
                </div>
                {i === 0 &&
              <div className="wf-tiny" style={{ marginTop: 4, color: WF.accent, fontWeight: 700 }}>↳ selected</div>
              }
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — general AI agent chat (full panel) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
          <div style={{ padding: '10px 12px', borderBottom: `1px dashed ${WF.lineFaint}`,
            display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="wf-chip live" style={{ fontSize: 9, padding: '0 5px' }}><span className="wf-dot" />agent</span>
            <span className="wf-h2" style={{ fontSize: 13 }}>fleet copilot</span>
            <span className="wf-tiny" style={{ marginLeft: 'auto' }}>scope · all 142 repos</span>
          </div>
          <div style={{ padding: '10px 12px', flex: 1, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, lineHeight: 1.45 }}>
            <div className="wf-tiny">today · 9:42</div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="wf-box-soft" style={{ padding: '6px 8px', maxWidth: '85%',
                background: '#fff7f3', borderColor: WF.accent }}>
                which of my repos are most at risk this week?
              </div>
            </div>

            <div className="wf-box" style={{ padding: '6px 8px' }}>
              3 repos with high-severity CVEs, 2 with failing main builds. <u>data-pipe</u> looks worst — 4 stale deps + a red build.
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                <span className="wf-chip">open data-pipe</span>
                <span className="wf-chip">scan all 3</span>
                <span className="wf-chip">draft PRs</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="wf-box-soft" style={{ padding: '6px 8px', maxWidth: '85%',
                background: '#fff7f3', borderColor: WF.accent }}>
                fix the race in payments-svc charge_handler — open a PR
              </div>
            </div>

            <div className="wf-box" style={{ padding: '6px 8px' }}>
              On it. Reading <span className="wf-mono">charge_handler.go</span> + tests now.
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <span className="wf-chip live" style={{ fontSize: 9, padding: '0 5px' }}><span className="wf-dot" />run/9f3a</span>
                <span className="wf-tiny">→ open in live view</span>
              </div>
            </div>
          </div>
          <div style={{ padding: 10, borderTop: `1.5px solid ${WF.line}`, background: WF.paperAlt }}>
            <div className="wf-input" style={{ minHeight: 36, padding: 6, fontSize: 11, lineHeight: 1.4 }}>
              ask anything · @ to scope to a repo · / for actions_
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center' }}>
              <span className="wf-chip ghost" style={{ fontSize: 9 }}>@payments-svc</span>
              <span className="wf-chip ghost" style={{ fontSize: 9 }}>/create-pr</span>
              <button className="wf-btn primary sm" style={{ marginLeft: 'auto' }}>send ↵</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Screen>);

}

function D1Insights() {
  // kept as deeper repo drill-down — used as "③ deep dive (optional)"
  return (
    <Screen label="MISSION-CONTROL · /repo/payments-svc · new agent">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0 }}>
        {/* Repo header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="wf-h2">payments-svc</span>
          <span className="wf-chip">go 1.22</span>
          <span className="wf-chip ok">main · green</span>
          <span className="wf-chip warn">3 cves</span>
        </div>
        <div className="wf-tabs">
          <span className="wf-tab">insights</span>
          <span className="wf-tab active" style={{ color: WF.accent }}>new agent</span>
          <span className="wf-tab">files</span>
          <span className="wf-tab">prs · 4</span>
          <span className="wf-tab">agents · 2</span>
          <span className="wf-tab">history</span>
        </div>

        {/* 2-col body: composer (left, primary) | context rail (right) */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 10, minHeight: 0 }}>
          {/* LEFT — composer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
            <div className="wf-box" style={{ padding: 10 }}>
              <div className="wf-label">action</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
                {['create PR', 'refactor', 'deps upgrade', 'docs', 'tests', 'review', 'scan', 'audit'].map((a, i) =>
                <button key={a} className="wf-btn sm" style={{
                  borderStyle: i === 2 ? 'solid' : 'dashed',
                  background: i === 2 ? WF.ink : WF.paper, color: i === 2 ? WF.paper : WF.ink }}>{a}</button>
                )}
              </div>
            </div>

            <div className="wf-box" style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div className="wf-label">prompt</div>
              <div className="wf-input wf-mono" style={{ marginTop: 6, padding: 10, flex: 1, lineHeight: 1.5 }}>
                upgrade go-redis 8 → 9 and migrate Pipeline() calls.<br />
                open one PR. keep tests green.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <div>
                  <span className="wf-label">scope</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    <span className="wf-chip">/cache</span>
                    <span className="wf-chip">/queue</span>
                    <span className="wf-chip ghost">+ path</span>
                  </div>
                </div>
                <div>
                  <span className="wf-label">guardrails</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    <span className="wf-chip ok">tests must pass</span>
                    <span className="wf-chip ghost">+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch bar — single line, no overlap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              border: `1.5px solid ${WF.line}`, borderRadius: 6, background: WF.paperAlt }}>
              <span className="wf-tiny">est ~14k tok · ~$0.07</span>
              <button className="wf-btn ghost sm" style={{ marginLeft: 'auto' }}>save as recipe</button>
              <button className="wf-btn primary sm">launch ↵</button>
            </div>
          </div>

          {/* RIGHT — context rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
            <div className="wf-box" style={{ padding: 10, background: '#fff7f3', borderColor: WF.accent }}>
              <div className="wf-label">suggested for this repo</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                {[
                ['upgrade go-redis 8→9', 'warn · 1 file', 'warn', true],
                ['quarantine 3 flaky tests', '/billing', 'ok', false],
                ['fix CVE-2026-1142', 'high · x/net', 'err', false]].
                map(([t, s, k, active], i) =>
                <button key={i} className="wf-btn sm" style={{
                  flexDirection: 'column', alignItems: 'flex-start', padding: '6px 8px',
                  textAlign: 'left', gap: 2, width: '100%',
                  borderStyle: active ? 'solid' : 'dashed',
                  borderColor: active ? WF.accent : WF.line,
                  background: active ? '#fff' : WF.paper }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{t}</span>
                    <span className="wf-tiny" style={{ color: k === 'err' ? WF.err : k === 'warn' ? WF.warn : WF.ok }}>{s}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="wf-box" style={{ padding: 10 }}>
              <div className="wf-label">repo signals</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6, fontFamily: WF.mono, fontSize: 11 }}>
                {[
                ['cves', '3', WF.warn],
                ['stale deps', '18', WF.muted],
                ['flaky tests', '3', WF.warn],
                ['coverage', '72%', WF.ok]].
                map(([k, v, c], i) =>
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px',
                  border: `1px dashed ${WF.lineFaint}`, borderRadius: 4 }}>
                    <span style={{ color: WF.muted }}>{k}</span>
                    <span style={{ color: c, fontWeight: 700 }}>{v}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="wf-box" style={{ padding: 10, flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="wf-label">recent runs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, fontSize: 11 }}>
                {[
                ['9f3a', 'fix race · charge_handler', 'done'],
                ['9f39', 'upgrade go-redis 8→9', 'done'],
                ['9f37', 'docs for /v2 endpoints', 'running']].
                map(([id, t, s], i) =>
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="wf-mono wf-tiny" style={{ color: WF.muted }}>{id}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
                    <Status kind={s} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>);

}

function D1Trigger() {
  return (
    <Screen label="MISSION-CONTROL · /repo/payments-svc · new agent">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="wf-h2">new agent run</span>
          <span className="wf-tiny">on payments-svc · main</span>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">action</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
            {['create PR', 'refactor', 'deps upgrade', 'docs', 'tests', 'review', 'scan', 'audit'].map((a, i) =>
            <button key={a} className="wf-btn sm" style={{
              borderStyle: i === 0 ? 'solid' : 'dashed',
              background: i === 0 ? WF.ink : WF.paper, color: i === 0 ? WF.paper : WF.ink }}>{a}</button>
            )}
          </div>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">prompt</div>
          <div className="wf-input wf-mono" style={{ marginTop: 6, padding: 10, minHeight: 60, lineHeight: 1.5 }}>
            fix the race in <u>charge_handler.go</u> when stripe webhook<br />
            arrives twice. open a PR with a regression test.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="wf-box" style={{ padding: 10 }}>
            <div className="wf-label">scope</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              <span className="wf-chip">/charge</span>
              <span className="wf-chip">/webhook</span>
              <span className="wf-chip ghost">+ add path</span>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 10 }}>
            <div className="wf-label">guardrails</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              <span className="wf-chip ok">tests must pass</span>
              <span className="wf-chip">no public api</span>
              <span className="wf-chip ghost">+</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <span className="wf-tiny">est tokens · ~14k · ~$0.07</span>
          <button className="wf-btn ghost sm" style={{ marginLeft: 'auto' }}>save as recipe</button>
          <button className="wf-btn primary">launch ↵</button>
        </div>
      </div>
    </Screen>);

}

function D1Live({ mode }) {
  // Default expansion rules: running = open; failed = open; success = collapsed.
  // (Validated 2026-05-02 — see design-rationale.md §1.)
  const [overrides, setOverrides] = React.useState({});
  const trace = [
  { s: 'done', t: 'plan · 3 steps drafted', d: '08s', kind: null },
  { s: 'done', t: 'read charge_handler.go (314 ln)', d: '12s', kind: 'files',
    files: [
    ['charge_handler.go', '314 ln', 'read'],
    ['stripe_client.go', '88 ln', 'read']]
  },
  { s: 'failed', t: 'go test ./charge/...', d: '06s', kind: 'term',
    term: [
    '$ go test ./charge/...',
    'ok   payments/charge       0.412s',
    'FAIL payments/charge/race  1.204s',
    '--- FAIL: TestDoubleDeliver (1.18s)',
    '    handler_test.go:142: expected 1 charge, got 2']
  },
  { s: 'running', t: 'edit charge_handler.go — add mutex around order_id', d: '42s', kind: 'files',
    files: [
    ['charge_handler.go', '+8 / −2', 'edit'],
    ['webhook_test.go', '+38', 'new']]
  },
  { s: 'next', t: 'write regression test for double-deliver', d: '—', kind: null },
  { s: 'next', t: 'run tests + open PR', d: '—', kind: null }];


  return (
    <Screen label="MISSION-CONTROL · /run/9f3a · live">
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12, height: '100%' }}>
        {/* LEFT — header + trace + composer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Status kind="running" />
            <span className="wf-h2" style={{ fontSize: 16 }}>fix race in charge_handler</span>
            <span className="wf-tiny" style={{ marginLeft: 'auto' }}>02:14 elapsed · payments-svc</span>
          </div>
          <ModeBanner mode={mode} />
          <div className="wf-box" style={{ padding: 10, flex: 1, minHeight: 0,
            display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto' }}>
            <div className="wf-label">trace · running + failed steps open by default</div>
            {trace.map((row, i) => {
              // default: running & failed open; done closed
              const defaultOpen = row.s === 'running' || row.s === 'failed';
              const open = overrides[i] !== undefined ? overrides[i] : defaultOpen;
              return (
                <div key={i} style={{ borderBottom: i < trace.length - 1 ? `1px dashed ${WF.lineFaint}` : 'none' }}>
                  <div onClick={() => row.kind && setOverrides({ ...overrides, [i]: !open })}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
                    cursor: row.kind ? 'pointer' : 'default', opacity: row.s === 'next' ? .55 : 1 }}>
                    <span className="wf-mono" style={{ fontSize: 10, width: 14,
                      color: row.s === 'running' ? WF.accent : row.s === 'failed' ? WF.err : WF.muted }}>
                      {row.s === 'done' ? '✓' : row.s === 'running' ? '▸' : row.s === 'failed' ? '✗' : '○'}
                    </span>
                    <span style={{ flex: 1, fontSize: 12 }}>{row.t}</span>
                    {row.kind === 'files' && <span className="wf-chip ghost" style={{ fontSize: 9, padding: '0 5px' }}>files</span>}
                    {row.kind === 'term' && <span className="wf-chip ghost" style={{ fontSize: 9, padding: '0 5px' }}>terminal</span>}
                    <span className="wf-tiny">{row.d}</span>
                    {row.kind && <span className="wf-tiny" style={{ width: 10 }}>{open ? '▾' : '▸'}</span>}
                  </div>
                  {open && row.kind === 'files' &&
                  <div style={{ margin: '4px 0 8px 22px', padding: 8, background: WF.paperAlt,
                    border: `1px dashed ${WF.line}`, borderRadius: 2 }}>
                      <div className="wf-label" style={{ marginBottom: 4 }}>touched files · click → diff</div>
                      {row.files.map(([f, m, k], j) =>
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8,
                      padding: '3px 4px', cursor: 'pointer',
                      borderBottom: j < row.files.length - 1 ? `1px dotted ${WF.lineFaint}` : 'none' }}>
                          <span className="wf-mono" style={{ fontSize: 11, flex: 1 }}>{f}</span>
                          <span className="wf-chip" style={{ fontSize: 9, padding: '0 5px',
                        borderColor: k === 'edit' ? WF.accent : WF.line,
                        background: k === 'edit' ? '#fff7f3' : WF.paper }}>{k}</span>
                          <span className="wf-mono wf-tiny" style={{ width: 60, textAlign: 'right' }}>{m}</span>
                          <span className="wf-tiny" style={{ width: 32, textAlign: 'right' }}>diff →</span>
                        </div>
                    )}
                    </div>
                  }
                  {open && row.kind === 'term' &&
                  <div style={{ margin: '4px 0 8px 22px', padding: 8, background: '#1a1814',
                    color: '#e8e3d6', fontFamily: WF.mono, fontSize: 10.5, lineHeight: 1.5,
                    borderRadius: 2, whiteSpace: 'pre' }}>
                      {row.term.map((ln, j) =>
                    <div key={j} style={{ color: ln.startsWith('FAIL') || ln.startsWith('---') ? '#f5a572' : ln.startsWith('$') ? '#a8d4a8' : '#e8e3d6' }}>{ln}</div>
                    )}
                    </div>
                  }
                </div>);

            })}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="wf-input" placeholder="interrupt · 'also handle refunds'" style={{ flex: 1 }} />
            <button className="wf-btn">send</button>
            <button className="wf-btn ghost">⏸ pause</button>
            <button className="wf-btn ghost">✕ stop</button>
          </div>
        </div>

        {/* RIGHT — repo insights + actions + tools/tokens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10,
          borderLeft: `1px dashed ${WF.lineFaint}`, paddingLeft: 12, minHeight: 0, overflow: 'auto' }}>
          <div>
            <div className="wf-label" style={{ marginBottom: 4 }}>payments-svc · insights</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {[['cve', '2 high'], ['deps', '18 stale'], ['flaky', '3 tests'], ['cov', '72%']].map(([k, v]) =>
              <div key={k} className="wf-box-soft" style={{ padding: '3px 6px' }}>
                  <div className="wf-label" style={{ fontSize: 8 }}>{k}</div>
                  <div className="wf-mono" style={{ fontSize: 11, fontWeight: 700 }}>{v}</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="wf-label" style={{ marginBottom: 4 }}>quick actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['create PR', 'upgrade deps', 'fix CVEs', 'run tests', 'refactor', 'generate docs', 'scan'].map((a, i) =>
              <button key={a} className="wf-btn sm" style={{
                borderStyle: 'dashed', justifyContent: 'flex-start',
                padding: '3px 6px', fontSize: 10 }}>{a}</button>
              )}
            </div>
          </div>
          <div>
            <div className="wf-label" style={{ marginBottom: 4 }}>tools used</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <span className="wf-chip">read</span>
              <span className="wf-chip">grep</span>
              <span className="wf-chip live"><span className="wf-dot" />edit</span>
              <span className="wf-chip ghost">test</span>
              <span className="wf-chip ghost">pr</span>
            </div>
          </div>
          <div>
            <div className="wf-label" style={{ marginBottom: 4 }}>tokens · cost</div>
            <div className="wf-mono" style={{ fontSize: 11 }}>4,210 / ~14k<br />$0.021 spent</div>
            <Progress pct={32} style={{ marginTop: 4 }} />
          </div>
        </div>
      </div>
    </Screen>);

}

function RationalePanel() {
  const [state, setState] = React.useState('open'); // 'open' | 'submitted'
  const [vote, setVote] = React.useState(null); // 'up' | 'down' | null
  const [note, setNote] = React.useState('');

  if (state === 'submitted') {
    return (
      <div style={{ margin: '8px 10px', padding: '6px 8px', border: `1px dashed ${WF.lineFaint}`,
        borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, background: WF.paperAlt }}>
        <span style={{ color: vote === 'up' ? WF.ok : WF.err, fontWeight: 700 }}>
          {vote === 'up' ? '👍' : '👎'}
        </span>
        <span className="wf-tiny" style={{ color: WF.muted }}>feedback recorded</span>
        {note && <span className="wf-tiny" style={{ flex: 1, fontStyle: 'italic',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          "{note}"
        </span>}
        <button className="wf-btn ghost sm" onClick={() => {setState('open');setVote(null);setNote('');}}
        style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px' }}>undo</button>
      </div>);

  }

  return (
    <div className="wf-box-soft" style={{ margin: '8px 10px', padding: 8, borderColor: WF.ink, background: WF.paperAlt }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="wf-chip" style={{ fontSize: 9, padding: '0 5px', background: WF.ink, color: WF.paper }}>agent rationale</span>
        <span className="wf-tiny" style={{ color: WF.muted }}>why this change</span>
      </div>
      <div className="wf-note" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
        Two webhook deliveries from Stripe within ~3ms can both pass the <span className="wf-mono">seen[orderID]</span> check
        before either sets the flag, causing a duplicate charge. A mutex around the check-and-set is the minimal fix; the
        regression test in <span className="wf-mono">webhook_test.go</span> reproduces the race with a 50ms window.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 6,
        borderTop: `1px dashed ${WF.lineFaint}` }}>
        <span className="wf-tiny" style={{ color: WF.muted }}>was this rationale useful?</span>
        <button className="wf-btn sm" onClick={() => setVote(vote === 'up' ? null : 'up')}
        style={{ padding: '2px 8px', fontSize: 11,
          borderColor: vote === 'up' ? WF.ok : WF.line,
          background: vote === 'up' ? '#e6f4ea' : WF.paper,
          borderStyle: vote === 'up' ? 'solid' : 'dashed' }}>👍</button>
        <button className="wf-btn sm" onClick={() => setVote(vote === 'down' ? null : 'down')}
        style={{ padding: '2px 8px', fontSize: 11,
          borderColor: vote === 'down' ? WF.err : WF.line,
          background: vote === 'down' ? '#fde7e3' : WF.paper,
          borderStyle: vote === 'down' ? 'solid' : 'dashed' }}>👎</button>
        <input className="wf-input" placeholder="add a comment (optional)…"
        value={note} onChange={(e) => setNote(e.target.value)}
        style={{ flex: 1, fontSize: 11, padding: '3px 6px' }} />
        <button className="wf-btn primary sm"
        disabled={!vote && !note}
        onClick={() => vote || note ? setState('submitted') : null}
        style={{ padding: '3px 10px', fontSize: 11,
          opacity: !vote && !note ? 0.4 : 1 }}>submit</button>
      </div>
    </div>);

}

function D1Results() {
  return (
    <Screen label="MISSION-CONTROL · /pr/482 · payments-svc">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        {/* PR header (GitHub-style) */}
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${WF.lineFaint}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-h2" style={{ fontSize: 15 }}>fix: race in charge_handler on duplicate stripe webhook</span>
            <span className="wf-mono wf-tiny" style={{ color: WF.muted }}>#482</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11 }}>
            <span className="wf-chip live" style={{ fontSize: 9, padding: '0 5px' }}><span className="wf-dot" />open</span>
            <span className="wf-chip" style={{ fontSize: 9, padding: '0 5px' }}>agent · run 9f3a</span>
            <span className="wf-tiny" style={{ color: WF.muted }}>
              wants to merge <b>1 commit</b> into <span className="wf-mono">main</span> from <span className="wf-mono">agent/fix-race-9f3a</span>
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="wf-tabs" style={{ padding: '0 14px', borderBottom: `1.5px solid ${WF.line}` }}>
          <span className="wf-tab">conversation · 3</span>
          <span className="wf-tab">commits · 1</span>
          <span className="wf-tab">checks · ✓ 3</span>
          <span className="wf-tab active">files changed · 2</span>
        </div>

        {/* Body — file tree + diff */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: 0 }}>
          <div style={{ borderRight: `1px dashed ${WF.lineFaint}`, padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="wf-label">files · 2</div>
            <div className="wf-mono" style={{ fontSize: 10.5, lineHeight: 1.6, marginTop: 4 }}>
              <div style={{ color: WF.muted }}>charge/</div>
              <div style={{ paddingLeft: 8, background: '#fff7f3', borderLeft: `2px solid ${WF.accent}`, padding: '1px 4px 1px 8px' }}>
                charge_handler.go <span style={{ color: WF.ok }}>+8</span> <span style={{ color: WF.err }}>−2</span>
              </div>
              <div style={{ color: WF.muted, marginTop: 4 }}>charge/test/</div>
              <div style={{ paddingLeft: 8 }}>
                webhook_test.go <span style={{ color: WF.ok }}>+38</span>
              </div>
            </div>
            <div className="wf-label" style={{ marginTop: 10 }}>reviewers</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <span className="wf-chip" style={{ fontSize: 9, padding: '0 5px' }}>JD</span>
              <span className="wf-tiny">jdoe · pending</span>
            </div>
            <div className="wf-label" style={{ marginTop: 10 }}>checks</div>
            <div className="wf-mono" style={{ fontSize: 10.5, lineHeight: 1.7 }}>
              <div><span style={{ color: WF.ok }}>✓</span> unit · 412/412</div>
              <div><span style={{ color: WF.ok }}>✓</span> lint</div>
              <div><span style={{ color: WF.ok }}>✓</span> vet</div>
            </div>
          </div>

          {/* Diff viewer (split) */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <div style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px dashed ${WF.lineFaint}`, background: WF.paperAlt }}>
              <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700 }}>charge/charge_handler.go</span>
              <span className="wf-tiny" style={{ marginLeft: 'auto' }}>split · unified</span>
              <span className="wf-chip ghost" style={{ fontSize: 9, padding: '0 5px' }}>viewed</span>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', fontFamily: WF.mono, fontSize: 10.5, lineHeight: 1.55 }}>
              {/* before */}
              <div style={{ borderRight: `1px dashed ${WF.lineFaint}`, padding: '6px 8px', overflow: 'hidden', background: '#fff' }}>
                <div style={{ color: WF.muted }}>@@ −41,7 +41,9 @@ func (h *Handler) Charge(</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>41</span> if seen[orderID] {'{'}</div>
                <div style={{ background: '#fde7e3' }}><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>42</span>   return ErrDup</div>
                <div style={{ background: '#fde7e3' }}><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>43</span> {'}'}</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>44</span> seen[orderID] = true</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>45</span></div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>46</span> return h.process(o)</div>
              </div>
              {/* after */}
              <div style={{ padding: '6px 8px', overflow: 'hidden', background: '#fff' }}>
                <div style={{ color: WF.muted }}>@@ −41,7 +41,9 @@ func (h *Handler) Charge(</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>41</span> h.mu.Lock()</div>
                <div style={{ background: '#e6f4ea' }}><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>42</span> defer h.mu.Unlock()</div>
                <div style={{ background: '#e6f4ea' }}><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>43</span> if seen[orderID] {'{'}</div>
                <div style={{ background: '#e6f4ea' }}><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>44</span>   return ErrDup</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>45</span> {'}'}</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>46</span> seen[orderID] = true</div>
                <div><span style={{ color: WF.muted, width: 18, display: 'inline-block' }}>47</span> return h.process(o)</div>
              </div>
            </div>
            {/* Agent rationale panel + reviewer feedback (see design-rationale.md §4) */}
            <RationalePanel />
            {/* inline conversation thread on the diff */}
            <div className="wf-box-soft" style={{ margin: '8px 10px', padding: 8, borderColor: WF.accent, background: '#fff7f3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="wf-chip live" style={{ fontSize: 9, padding: '0 5px' }}><span className="wf-dot" />agent</span>
                <span className="wf-tiny">commented on line 42</span>
              </div>
              <div className="wf-note" style={{ fontSize: 11, marginTop: 4 }}>
                Added a mutex around the duplicate-id check. Without it, two webhook deliveries within ~3ms could both pass the seen[] check before either set the flag.
              </div>
            </div>
          </div>
        </div>

        {/* Merge bar */}
        <div style={{ padding: '8px 14px', borderTop: `1.5px solid ${WF.line}`, display: 'flex', alignItems: 'center', gap: 6, background: WF.paperAlt }}>
          <span className="wf-chip ok" style={{ fontSize: 9, padding: '0 5px' }}>✓ all checks passed</span>
          <span className="wf-tiny">no conflicts with main</span>
          <button className="wf-btn ghost sm" style={{ marginLeft: 'auto' }}>request changes</button>
          <button className="wf-btn sm">approve</button>
          <button className="wf-btn primary sm">merge pull request ▾</button>
        </div>
      </div>
    </Screen>);

}

function D1History() {
  const rows = [
  ['9f3a', 'fix race · charge_handler', 'payments-svc', 'done', '4m', '$0.06'],
  ['9f39', 'upgrade go-redis 8→9', 'payments-svc', 'done', '11m', '$0.18'],
  ['9f38', 'quarantine flaky tests', 'billing-svc', 'done', '3m', '$0.04'],
  ['9f37', 'docs for /v2 endpoints', 'checkout-web', 'running', '—', '$0.02'],
  ['9f36', 'refactor session store', 'auth-edge', 'failed', '7m', '$0.09'],
  ['9f35', 'CVE-2026-1142 patch', 'data-pipe', 'waiting', '—', '—'],
  ['9f34', 'generate openapi', 'notif-relay', 'done', '2m', '$0.02'],
  ['9f33', 'run integration suite', 'search-idx', 'done', '9m', '$0.12']];

  return (
    <Screen label="MISSION-CONTROL · /history">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* APP NAV — same as /fleet, with history active */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px',
          borderBottom: `1px solid ${WF.line}`, background: WF.paperAlt, flexShrink: 0 }}>
          <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>MISSION CTL</span>
          <span className="wf-tab">fleet</span>
          <span className="wf-tab active" style={{ borderBottom: `2px solid ${WF.ink}`, paddingBottom: 4 }}>history</span>
          <span className="wf-tab">recipes</span>
          <span className="wf-tab">settings</span>
          <span className="wf-tiny" style={{ marginLeft: 'auto', color: WF.muted }}>preston · acme-corp</span>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="wf-h2" style={{ fontSize: 18 }}>fleet history</span>
          <span className="wf-chip ghost">last 7d</span>
          <span className="wf-chip">142 runs</span>
          <input className="wf-input" placeholder="search…" style={{ marginLeft: 'auto', width: 160 }} />
        </div>
        <div className="wf-box" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 130px 90px 60px 60px',
            padding: '8px 12px', borderBottom: `1.5px solid ${WF.line}`, background: WF.paperAlt }}>
            {['id', 'task', 'repo', 'status', 'time', 'cost'].map((h) => <span key={h} className="wf-label" style={{ textAlign: "center" }}>{h}</span>)}
          </div>
          {rows.map((r, i) =>
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 130px 90px 60px 60px',
            padding: '7px 12px', borderBottom: i < rows.length - 1 ? `1px dashed ${WF.lineFaint}` : 'none',
            alignItems: 'center', fontSize: 12, fontFamily: WF.mono }}>
              <span style={{ color: WF.muted }}>{r[0]}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r[1]}</span>
              <span style={{ color: WF.muted }}>{r[2]}</span>
              <Status kind={r[3]} />
              <span className="wf-tiny" style={{ textAlign: "center" }}>{r[4]}</span>
              <span className="wf-tiny">{r[5]}</span>
            </div>
          )}
        </div>
        </div>
      </div>
    </Screen>);

}

Object.assign(window, { D1RepoPicker, D1Insights, D1Trigger, D1Live, D1Results, D1History });