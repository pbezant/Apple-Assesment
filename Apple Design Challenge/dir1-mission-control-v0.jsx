// dir1-mission-control-v0.jsx
// FROZEN ORIGINAL — Direction 1 · Mission Control (6-screen version)
//
// This file is intentionally NOT updated when the live version evolves.
// It exists so Wireframes.html can show the original design alongside the
// current state in D1-sandbox.html for before/after comparison.
//
// Live, evolving version: dir1-mission-control.jsx
// Components are suffixed `V0` to avoid colliding with the live file when
// both are loaded on the same page.

function D1V0RepoPicker({ mode }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', height: '100%' }}>
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
            gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'min-content', gap: 6 }}>
            {repos.map(([n, l, h, t, live, sp], i) =>
              <div key={n} className="wf-box" style={{ padding: 8, position: 'relative',
                background: i === 0 ? '#fff7f3' : '#fff',
                borderColor: i === 0 ? WF.accent : WF.line,
                borderWidth: i === 0 ? 2 : 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700,
                      overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</span>
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

        {/* RIGHT — selected repo insights + composer (original v0 design) */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, padding: 10, gap: 8 }}>
          <span className="wf-label">selected · payments-svc</span>
          <div className="wf-box" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="wf-label">insights</span>
            <div className="wf-mono" style={{ fontSize: 11, lineHeight: 1.7 }}>
              <div>cves · <span style={{ color: WF.warn }}>3</span></div>
              <div>deps stale · 18</div>
              <div>flaky · 3</div>
              <div>cov · 72%</div>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 8 }}>
            <span className="wf-label">quick actions</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
              <button className="wf-btn sm">create PR</button>
              <button className="wf-btn sm">upgrade deps</button>
              <button className="wf-btn sm">fix CVEs</button>
              <button className="wf-btn sm">scan repo</button>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span className="wf-label">prompt</span>
            <div className="wf-input wf-mono" style={{ fontSize: 11, marginTop: 6, padding: 6,
              flex: 1, lineHeight: 1.4 }}>
              fix the race in charge_handler.go…
            </div>
            <button className="wf-btn primary sm" style={{ marginTop: 6 }}>send ↵</button>
          </div>
        </div>
      </div>
    </Screen>);
}

function D1V0Trigger() {
  return (
    <Screen label="MISSION-CONTROL · /repo/payments-svc · new">
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

function D1V0Insights() {
  return (
    <Screen label="MISSION-CONTROL · /repo/payments-svc">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="wf-h2">payments-svc</span>
          <span className="wf-chip">go 1.22</span>
          <span className="wf-chip ok">main · green</span>
          <span className="wf-chip warn">3 cves</span>
          <button className="wf-btn accent sm" style={{ marginLeft: 'auto' }}>+ run agent</button>
        </div>
        <div className="wf-tabs">
          <span className="wf-tab active">insights</span>
          <span className="wf-tab">files</span>
          <span className="wf-tab">prs · 4</span>
          <span className="wf-tab">agents · 2</span>
          <span className="wf-tab">history</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            ['commits / wk', '24', [3, 5, 4, 7, 8, 5, 9, 7, 6, 8, 9, 11]],
            ['open prs', '12', [1, 2, 3, 2, 4, 3, 5, 4, 6, 5, 4, 6]],
            ['flaky tests', '3', null],
            ['coverage', '72%', null],
            ['deps outdated', '18 / 142', null],
            ['cve high', '2', null]].
            map(([k, v, d], i) =>
              <div key={i} className="wf-box-soft" style={{ padding: 10 }}>
                <div className="wf-label">{k}</div>
                <div className="wf-mono" style={{ fontSize: 22, fontWeight: 700, color: WF.ink, marginTop: 2 }}>{v}</div>
                {d && <div style={{ marginTop: 4 }}><Spark data={d} /></div>}
              </div>
            )}
        </div>
        <div className="wf-box" style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="wf-label">suggested agent runs</span>
            <span className="wf-tiny">based on signals · auto</span>
          </div>
          {[
            ['upgrade go-redis 8→9', 'est 12 min · 1 file changed', 'warn'],
            ['quarantine 3 flaky tests in /billing', 'est 4 min', 'ok'],
            ['fix CVE-2026-1142 in golang.org/x/net', 'est 8 min', 'err']].
            map(([t, s, k], i) =>
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px',
                borderBottom: i < 2 ? `1px dashed ${WF.lineFaint}` : 'none' }}>
                <span className="wf-tiny" style={{ width: 14 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 12 }}>{t}</span>
                <span className="wf-tiny">{s}</span>
                <button className="wf-btn sm">run</button>
              </div>
            )}
        </div>
      </div>
    </Screen>);
}

function D1V0Live({ mode }) {
  // Original: single click-to-expand (one step open at a time, idx 3 default).
  // No auto-expand-on-failed, no terminal-style FAIL output.
  const [openIdx, setOpenIdx] = React.useState(3);
  const trace = [
    { s: 'done', t: 'plan · 3 steps drafted', d: '08s', kind: null },
    { s: 'done', t: 'read charge_handler.go (314 ln)', d: '12s', kind: null },
    { s: 'done', t: 'go test ./charge/...', d: '06s', kind: null },
    { s: 'running', t: 'edit charge_handler.go — add mutex around order_id', d: '42s', kind: null },
    { s: 'next', t: 'write regression test for double-deliver', d: '—', kind: null },
    { s: 'next', t: 'run tests + open PR', d: '—', kind: null }];

  return (
    <Screen label="MISSION-CONTROL · /run/9f3a · live">
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Status kind="running" />
            <span className="wf-h2" style={{ fontSize: 16 }}>fix race in charge_handler</span>
            <span className="wf-tiny" style={{ marginLeft: 'auto' }}>02:14 elapsed · payments-svc</span>
          </div>
          <ModeBanner mode={mode} />
          <div className="wf-box" style={{ padding: 10, flex: 1, minHeight: 0,
            display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto' }}>
            <div className="wf-label">trace</div>
            {trace.map((row, i) =>
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 0', opacity: row.s === 'next' ? .55 : 1,
                borderBottom: i < trace.length - 1 ? `1px dashed ${WF.lineFaint}` : 'none' }}>
                <span className="wf-mono" style={{ fontSize: 10, width: 14,
                  color: row.s === 'running' ? WF.accent : WF.muted }}>
                  {row.s === 'done' ? '✓' : row.s === 'running' ? '▸' : '○'}
                </span>
                <span style={{ flex: 1, fontSize: 12 }}>{row.t}</span>
                <span className="wf-tiny">{row.d}</span>
              </div>
            )}
          </div>
          <div className="wf-box" style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="wf-label" style={{ flex: 'none' }}>nudge</span>
            <input className="wf-input" placeholder="add a constraint or hint…" style={{ flex: 1 }} />
            <button className="wf-btn sm">send</button>
            <button className="wf-btn ghost sm">pause</button>
            <button className="wf-btn ghost sm">stop</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div className="wf-box" style={{ padding: 8 }}>
            <div className="wf-label">live diff</div>
            <div className="wf-mono" style={{ fontSize: 11, marginTop: 4 }}>
              <span style={{ color: WF.ok }}>+12</span> / <span style={{ color: WF.err }}>−4</span>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 8 }}>
            <div className="wf-label">tools used</div>
            <div className="wf-mono" style={{ fontSize: 11, lineHeight: 1.7, marginTop: 4 }}>
              <div>read · 2</div>
              <div>edit · 1</div>
              <div>test · 1</div>
              <div>shell · 0</div>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 8 }}>
            <div className="wf-label">tokens · cost</div>
            <div className="wf-mono" style={{ fontSize: 11, lineHeight: 1.7, marginTop: 4 }}>
              <div>in · 8.4k</div>
              <div>out · 3.1k</div>
              <div>$0.04 so far</div>
            </div>
          </div>
        </div>
      </div>
    </Screen>);
}

function D1V0Results() {
  return (
    <Screen label="MISSION-CONTROL · /run/9f3a · done">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Status kind="done" />
          <span className="wf-h2" style={{ fontSize: 16 }}>PR #482 opened</span>
          <span className="wf-tiny" style={{ marginLeft: 'auto' }}>4m 12s · $0.06</span>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">summary</div>
          <div className="wf-note" style={{ marginTop: 4 }}>
            Wrapped order-id check in a mutex; added <span className="wf-mono">TestDoubleDeliver</span> covering
            duplicate webhook arrival within 50ms. All 412 tests pass.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="wf-box" style={{ padding: 10 }}>
            <div className="wf-label">files · 2</div>
            <div className="wf-mono" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.7 }}>
              <div>charge_handler.go <span style={{ color: WF.ok }}>+8</span> <span style={{ color: WF.err }}>−2</span></div>
              <div>webhook_test.go <span style={{ color: WF.ok }}>+38</span></div>
            </div>
          </div>
          <div className="wf-box" style={{ padding: 10 }}>
            <div className="wf-label">checks</div>
            <div className="wf-mono" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.7 }}>
              <div>✓ unit · 412 / 412</div>
              <div>✓ lint · clean</div>
              <div>✓ vet · clean</div>
            </div>
          </div>
        </div>
        <div className="wf-ph" style={{ flex: 1 }}>diff viewer · split</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="wf-btn primary">view PR ↗</button>
          <button className="wf-btn">merge</button>
          <button className="wf-btn ghost">re-run with edits</button>
          <button className="wf-btn ghost" style={{ marginLeft: 'auto' }}>save as recipe</button>
        </div>
      </div>
    </Screen>);
}

function D1V0History() {
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
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="wf-h2" style={{ fontSize: 18 }}>fleet history</span>
          <span className="wf-chip ghost">last 7d</span>
          <span className="wf-chip">142 runs</span>
          <input className="wf-input" placeholder="search…" style={{ marginLeft: 'auto', width: 160 }} />
        </div>
        <div className="wf-box" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 130px 90px 60px 60px',
            padding: '8px 12px', borderBottom: `1.5px solid ${WF.line}`, background: WF.paperAlt }}>
            {['id', 'task', 'repo', 'status', 'time', 'cost'].map((h) =>
              <span key={h} className="wf-label" style={{ textAlign: "center" }}>{h}</span>)}
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
    </Screen>);
}

Object.assign(window, { D1V0RepoPicker, D1V0Trigger, D1V0Insights, D1V0Live, D1V0Results, D1V0History });
