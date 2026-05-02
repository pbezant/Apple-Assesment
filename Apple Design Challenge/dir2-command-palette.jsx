// dir2-command-palette.jsx
// Direction 2 — Command Palette
// Keyboard-first. The palette is the homepage. Repo + action chosen via
// fuzzy search. Live execution is terminal-like. Built for someone who
// types fast and never wants to lift their hands.

function D2Palette({ mode }) {
  return (
    <Screen label="CMD · ⌘K">
      <div style={{ height:'100%', display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding: '24px 18px', background: WF.paperAlt }}>
        <div className="wf-box" style={{ width: '100%', background: '#fff', boxShadow:'0 8px 24px rgba(0,0,0,.08)' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1.5px solid ${WF.line}`, display:'flex', alignItems:'center', gap: 10 }}>
            <span className="wf-mono" style={{ color: WF.accent, fontSize: 14 }}>›</span>
            <span className="wf-mono" style={{ fontSize: 14, flex: 1 }}>upgrade deps in <span style={{background:WF.accentSoft, padding:'1px 4px'}}>payments-svc</span>_</span>
            <span className="wf-tiny">esc</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div className="wf-label" style={{ padding: '4px 14px' }}>matches · 4</div>
            {[
              ['↻','upgrade go-redis 8 → 9','payments-svc · 142 deps · 1 file', true],
              ['↻','upgrade all minor versions','payments-svc · 17 deps', false],
              ['🛡','scan + patch CVEs (2 high)','payments-svc · est 8m', false],
              ['📄','generate openapi from handlers','payments-svc · 14 routes', false],
            ].map(([ic, t, sub, sel], i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'8px 14px',
                background: sel ? WF.accentSoft : 'transparent', borderLeft: sel ? `3px solid ${WF.accent}` : '3px solid transparent' }}>
                <span className="wf-mono" style={{ width: 18 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: sel ? 700 : 500 }}>{t}</div>
                  <div className="wf-tiny">{sub}</div>
                </div>
                {sel && <span className="wf-mono wf-tiny">↵</span>}
              </div>
            ))}
            <div className="wf-divider-dashed" style={{ margin: '4px 14px' }} />
            <div className="wf-label" style={{ padding: '4px 14px' }}>repos · 142</div>
            {['payments-svc','checkout-web','auth-edge','data-pipe'].map(r => (
              <div key={r} style={{ display:'flex', alignItems:'center', gap: 10, padding:'5px 14px' }}>
                <span className="wf-mono" style={{ width: 18, color: WF.muted }}>↗</span>
                <span className="wf-mono" style={{ fontSize: 12, flex: 1 }}>{r}</span>
                <Spark data={[2,3,5,4,6,5,7]} />
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 14px', borderTop: `1px dashed ${WF.lineFaint}`, display:'flex', gap: 14 }}>
            <span className="wf-tiny">↑↓ navigate</span>
            <span className="wf-tiny">↵ run</span>
            <span className="wf-tiny">⌘↵ plan first</span>
            <span className="wf-tiny" style={{ marginLeft:'auto' }}>{mode}</span>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function D2Insights() {
  return (
    <Screen label="CMD · payments-svc">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10, fontFamily: WF.mono }}>
        <div style={{ fontSize: 12, color: WF.muted }}>~/repos/payments-svc › <span style={{color:WF.ink}}>info</span></div>
        <pre className="wf-mono" style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: WF.ink2, whiteSpace:'pre' }}>{`╭─ payments-svc · go 1.22 · main green ──────────────╮
│  commits/wk    24  ▂▃▂▄▆▃▅▇▆▅▇█                    │
│  open prs      12  · 4 mine                        │
│  coverage      72% · target 80                     │
│  flaky tests   3   · TestCharge*                   │
│  deps          142 · 18 outdated · 2 cve high      │
│  last release  v3.14.0 · 2d ago                    │
╰────────────────────────────────────────────────────╯`}</pre>
        <div className="wf-label" style={{ marginTop: 4 }}>suggested · type to filter</div>
        {[
          ['agent upgrade go-redis','est 12m'],
          ['agent fix CVE-2026-1142','est 8m'],
          ['agent quarantine flaky','est 4m'],
          ['agent docs /v2 routes','est 6m'],
        ].map(([c, e], i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 8, padding:'4px 0' }}>
            <span className="wf-mono" style={{ color: WF.muted, fontSize: 11, width: 14 }}>›</span>
            <span style={{ fontSize: 12, flex: 1 }}>{c}</span>
            <span className="wf-tiny">{e}</span>
            <span className="wf-tiny" style={{ color: WF.accent }}>⌘{i+1}</span>
          </div>
        ))}
        <div style={{ marginTop:'auto', display:'flex', gap: 8 }}>
          <span className="wf-tiny">⌘K palette</span>
          <span className="wf-tiny">⌘P repo</span>
          <span className="wf-tiny">⌘L logs</span>
          <span className="wf-tiny">⌘H history</span>
        </div>
      </div>
    </Screen>
  );
}

function D2Trigger() {
  return (
    <Screen label="CMD · compose">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-mono wf-tiny">› compose agent run</div>
        <div className="wf-box" style={{ padding: 10 }}>
          <pre className="wf-mono" style={{ margin: 0, fontSize: 11, lineHeight: 1.7, color: WF.ink2 }}>{`repo:    payments-svc@main
action:  upgrade
target:  go-redis  v8.x → v9.x
scope:   /charge,/webhook
guards:  tests-pass,no-public-api
mode:    plan-first`}</pre>
        </div>
        <div className="wf-label">prompt</div>
        <div className="wf-input wf-mono" style={{ minHeight: 60, lineHeight: 1.5 }}>
          upgrade go-redis to v9, migrate the deprecated <span style={{background:WF.accentSoft}}>Pipeline()</span><br/>
          calls. open a PR titled "deps: go-redis 8→9".
        </div>
        <div style={{ display:'flex', gap: 6, marginTop:'auto', alignItems:'center' }}>
          <span className="wf-tiny">tab to autocomplete · ↵ run</span>
          <button className="wf-btn ghost sm" style={{ marginLeft:'auto' }}>save → ~/.recipes</button>
          <button className="wf-btn primary">↵ run</button>
        </div>
      </div>
    </Screen>
  );
}

function D2Live({ mode }) {
  return (
    <Screen label="CMD · run/9f3a · live">
      <div style={{ padding: 12, height:'100%', display:'flex', flexDirection:'column', gap: 8, background:'#16140f', color:'#e8e3d8' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="wf-mono" style={{ fontSize: 11, color:'#f8a888' }}>● live</span>
          <span className="wf-mono" style={{ fontSize: 11, color:'#aaa19a' }}>run/9f3a · payments-svc · {mode}</span>
          <span className="wf-mono wf-tiny" style={{ marginLeft:'auto', color:'#aaa19a' }}>02:14 · 4,210t</span>
        </div>
        <pre style={{ margin: 0, fontSize: 10.5, lineHeight: 1.55, fontFamily: WF.mono, flex: 1, overflow:'hidden', whiteSpace:'pre' }}>{`[00:00] ▸ plan
        1. read charge_handler.go
        2. propose mutex around order_id check
        3. write regression test
        4. run tests + open PR
[00:08] ✓ plan ready · 3 steps
[00:09] ▸ read charge_handler.go (314 ln)
[00:21] ✓ identified race at L142-L156
[00:22] ▸ read webhook_test.go
[00:26] ✓ found existing test scaffolding
[00:27] ▸ propose patch
        @@ charge_handler.go @@
        + var orderMu sync.Mutex
        + orderMu.Lock()
        + defer orderMu.Unlock()
[01:09] ▸ writing TestDoubleDeliver
[02:14] ▸ go test ./charge/... ░░░░░░░░░░░ 32%`}</pre>
        <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
          <span style={{ fontFamily: WF.mono, color:'#f8a888' }}>›</span>
          <input className="wf-input" placeholder="interrupt · also handle refunds"
            style={{ flex: 1, background:'#1f1c16', color:'#e8e3d8', borderColor:'#3a342a' }} />
          <span className="wf-tiny" style={{ color:'#aaa19a' }}>⌘I interrupt · ⌘. stop</span>
        </div>
      </div>
    </Screen>
  );
}

function D2Results() {
  return (
    <Screen label="CMD · run/9f3a · done">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <pre className="wf-mono" style={{ margin: 0, fontSize: 11, lineHeight: 1.6 }}>{`✓ run/9f3a complete · 4m 12s · $0.06

→ pr #482 opened
  payments-svc/fix-charge-race
  +46 −2 · 2 files · 412/412 tests pass

  charge_handler.go         +8  −2
  webhook_test.go           +38

  checks: ✓ unit  ✓ lint  ✓ vet  ✓ govulncheck`}</pre>
        <div className="wf-ph" style={{ flex: 1 }}>diff · charge_handler.go</div>
        <div style={{ display:'flex', gap: 6 }}>
          <button className="wf-btn primary">⌘O open pr</button>
          <button className="wf-btn">⌘M merge</button>
          <button className="wf-btn ghost">⌘R re-run</button>
          <button className="wf-btn ghost" style={{ marginLeft:'auto' }}>↑ promote to recipe</button>
        </div>
      </div>
    </Screen>
  );
}

function D2History() {
  return (
    <Screen label="CMD · history">
      <div style={{ padding: 14, height:'100%', fontFamily: WF.mono, fontSize: 11, lineHeight: 1.7 }}>
        <div className="wf-mono wf-tiny">› history · last 50 · ↑↓ to select</div>
        <pre style={{ margin: '8px 0 0', whiteSpace:'pre', fontSize: 10.5, lineHeight: 1.7 }}>{`9f3a  ✓  fix race · charge_handler        payments    4m   $0.06
9f39  ✓  upgrade go-redis 8 → 9            payments   11m   $0.18
9f38  ✓  quarantine flaky tests            billing     3m   $0.04
9f37  ●  docs for /v2 endpoints            checkout    —    $0.02
9f36  ✗  refactor session store            auth-edge   7m   $0.09
9f35  ⏸  CVE-2026-1142 patch               data-pipe   —     —
9f34  ✓  generate openapi                  notif       2m   $0.02
9f33  ✓  run integration suite             search      9m   $0.12
9f32  ✓  bump rails 7.0 → 7.1              admin       8m   $0.10
9f31  ✓  refactor: extract billing types   payments    5m   $0.07
9f30  ✓  generate adr for queue choice     infra       3m   $0.04
9f2f  ✗  fix flaky e2e in checkout         checkout    6m   $0.08
9f2e  ✓  add otel spans to handlers        notif       4m   $0.05`}</pre>
        <div style={{ marginTop: 12, display:'flex', gap: 12 }}>
          <span className="wf-tiny">↵ open</span>
          <span className="wf-tiny">⌘D diff</span>
          <span className="wf-tiny">⌘R re-run</span>
          <span className="wf-tiny">/ filter</span>
        </div>
      </div>
    </Screen>
  );
}

Object.assign(window, { D2Palette, D2Insights, D2Trigger, D2Live, D2Results, D2History });
