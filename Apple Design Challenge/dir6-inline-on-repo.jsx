// dir6-inline-on-repo.jsx
// Direction 6 — Inline on Repo
// Looks like a familiar code-host repo view, but agent affordances are
// woven into files, lines, PRs, issues. The repo IS the surface;
// agents are not a separate destination. Lowest learning curve.

function D6Repos({ mode }) {
  return (
    <Screen label="REPO · /repos">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <span className="wf-h2">your repos</span>
          <input className="wf-input" placeholder="filter…" style={{ flex: 1, marginLeft: 10 }} />
          <button className="wf-btn sm">+ import</button>
        </div>
        <div className="wf-tabs">
          <span className="wf-tab active">all 142</span>
          <span className="wf-tab">owned 12</span>
          <span className="wf-tab">starred</span>
          <span className="wf-tab">teams</span>
        </div>
        {[
          ['payments-svc','go','main green · 4 prs · 2 cve','today'],
          ['checkout-web','typescript','main green · 7 prs','2h'],
          ['auth-edge','rust','main green · 1 pr','5h'],
          ['data-pipe','python','main red · 3 prs · 4 cve','1d'],
          ['ml-features','python','main green · 2 prs','1d'],
          ['notif-relay','go','main green · 0 prs','2d'],
        ].map(([n, l, m, when], i) => (
          <div key={n} className="wf-box" style={{ padding: 10, display:'flex', alignItems:'center', gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: 4, background: WF.lineFaint }} />
            <div style={{ flex: 1 }}>
              <div className="wf-mono" style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
              <div className="wf-tiny">{l} · {m}</div>
            </div>
            <span className="wf-tiny">{when}</span>
            <button className="wf-btn sm" style={{ borderStyle: 'dashed' }}>⚡ ask agent</button>
          </div>
        ))}
        <div style={{ marginTop:'auto' }}><ModeBanner mode={mode} /></div>
      </div>
    </Screen>
  );
}

function D6Insights() {
  return (
    <Screen label="REPO · payments-svc">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="wf-h2">payments-svc</span>
          <span className="wf-chip">main</span>
          <button className="wf-btn sm accent" style={{ marginLeft:'auto' }}>⚡ ask agent</button>
        </div>
        <div className="wf-tabs">
          <span className="wf-tab active">code</span>
          <span className="wf-tab">prs · 4</span>
          <span className="wf-tab">issues · 12</span>
          <span className="wf-tab">actions</span>
          <span className="wf-tab">insights</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 220px', gap: 12, flex: 1, overflow:'hidden' }}>
          <div className="wf-box" style={{ padding: 0, overflow:'hidden' }}>
            <div style={{ padding:'6px 10px', borderBottom:`1px dashed ${WF.lineFaint}`, fontFamily: WF.mono, fontSize: 11 }}>
              📁 payments-svc / main
            </div>
            {[
              ['📁','charge/','last commit · refactor receipt'],
              ['📁','webhook/','last commit · stripe v2'],
              ['📁','billing/','last commit · 3d ago'],
              ['📄','main.go','—'],
              ['📄','go.mod','18 deps stale ⚠'],
            ].map(([ic, n, m], i) => (
              <div key={n} style={{ display:'flex', alignItems:'center', gap: 8, padding:'7px 10px',
                borderBottom: i<4?`1px dashed ${WF.lineFaint}`:'none', fontFamily: WF.mono, fontSize: 11 }}>
                <span>{ic}</span>
                <span style={{ flex: 1 }}>{n}</span>
                <span className="wf-tiny">{m}</span>
                <button className="wf-btn sm ghost" style={{ fontSize: 9, padding: '1px 6px' }}>⚡</button>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            <div className="wf-box" style={{ padding: 8 }}>
              <div className="wf-label">agents see</div>
              <div className="wf-tiny" style={{ marginTop: 4, lineHeight: 1.6 }}>
                · 2 high CVEs in deps<br/>
                · 3 flaky tests in /charge<br/>
                · race in <span className="wf-mono">charge_handler.go:142</span><br/>
                · 18 outdated deps
              </div>
            </div>
            <div className="wf-box" style={{ padding: 8, background:'#fff7f3', borderColor: WF.accent }}>
              <div className="wf-label" style={{ color: WF.accent }}>quick agent</div>
              <div style={{ display:'flex', flexDirection:'column', gap: 4, marginTop: 6 }}>
                <button className="wf-btn sm">fix the race ↗</button>
                <button className="wf-btn sm">patch CVEs</button>
                <button className="wf-btn sm">upgrade deps</button>
                <button className="wf-btn sm ghost">type a task…</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function D6Trigger() {
  return (
    <Screen label="REPO · charge_handler.go · agent on file">
      <div style={{ padding: 0, height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'10px 14px', borderBottom:`1px solid ${WF.lineFaint}`, display:'flex', gap:8, alignItems:'center' }}>
          <span className="wf-mono wf-tiny">payments-svc / charge / charge_handler.go</span>
          <button className="wf-btn sm accent" style={{ marginLeft:'auto' }}>⚡ ask about this file</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', flex: 1, minHeight: 0 }}>
          <pre className="wf-mono" style={{ margin: 0, padding: 12, fontSize: 10.5, lineHeight: 1.6, color: WF.ink2,
            overflow:'hidden', whiteSpace:'pre' }}>{`140  func handleCharge(w http.ResponseWriter, r *http.Request) {
141    var req ChargeReq
142    if seen[req.OrderID] {              ← agent: race here
143      respond(w, 200, "duplicate")
144      return
145    }
146    seen[req.OrderID] = true            ← unprotected map
147    if err := process(req); err != nil {
148      respond(w, 500, err.Error())
149      return
150    }
151    respond(w, 200, "ok")
152  }`}</pre>
          <div style={{ borderLeft:`1px solid ${WF.lineFaint}`, padding: 12, display:'flex', flexDirection:'column', gap: 8 }}>
            <div className="wf-label">agent suggestion</div>
            <div className="wf-note" style={{ fontSize: 12 }}>
              Lines 142-146 read+write a shared map without a lock. Two stripe webhooks within ~50ms can both pass the check.
            </div>
            <div className="wf-box-soft" style={{ padding: 8, fontFamily: WF.mono, fontSize: 10.5, lineHeight: 1.5 }}>
              + var orderMu sync.Mutex<br/>
              + orderMu.Lock()<br/>
              + defer orderMu.Unlock()
            </div>
            <button className="wf-btn primary sm">apply + open PR</button>
            <button className="wf-btn sm">apply + add test</button>
            <button className="wf-btn sm ghost">explain more</button>
            <div className="wf-divider-dashed" style={{ margin:'4px 0' }} />
            <div className="wf-label">or, type a task</div>
            <div className="wf-input wf-mono" style={{ fontSize: 11, minHeight: 40 }}>
              fix this race + add a regression test
            </div>
            <div style={{ display:'flex', gap: 4 }}>
              <button className="wf-btn primary sm" style={{ flex:1 }}>run ↵</button>
              <button className="wf-btn sm ghost">plan</button>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function D6Live({ mode }) {
  return (
    <Screen label="REPO · charge_handler.go · agent live">
      <div style={{ padding: 0, height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'8px 14px', borderBottom:`1px solid ${WF.lineFaint}`, display:'flex', gap:8, alignItems:'center' }}>
          <Status kind="running" />
          <span className="wf-tiny">agent editing this file · {mode}</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>02:14 · #482 draft</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', flex: 1, minHeight: 0 }}>
          <pre className="wf-mono" style={{ margin: 0, padding: 12, fontSize: 10.5, lineHeight: 1.6, whiteSpace:'pre' }}>{`140  func handleCharge(w http.ResponseWriter, r *http.Request) {
141    var req ChargeReq
+      orderMu.Lock()                    ← agent
+      defer orderMu.Unlock()             ← agent
142    if seen[req.OrderID] {
143      respond(w, 200, "duplicate")
144      return
145    }
146    seen[req.OrderID] = true
147    if err := process(req); err != nil {
148      respond(w, 500, err.Error())
...
   ▌ writing webhook_test.go ...`}</pre>
          <div style={{ borderLeft:`1px solid ${WF.lineFaint}`, padding: 12, display:'flex', flexDirection:'column', gap: 8 }}>
            <div className="wf-label">live trace</div>
            <div className="wf-mono" style={{ fontSize: 10.5, lineHeight: 1.7 }}>
              <div style={{color: WF.ok}}>✓ read 314 ln</div>
              <div style={{color: WF.ok}}>✓ propose patch</div>
              <div style={{color: WF.ok}}>✓ apply edit</div>
              <div style={{color: WF.accent}}>▸ write test</div>
              <div style={{color: WF.muted}}>○ go test</div>
              <div style={{color: WF.muted}}>○ open PR</div>
            </div>
            <Progress marching />
            <div className="wf-divider-dashed" />
            <div className="wf-label">interrupt</div>
            <div className="wf-input wf-mono" style={{ fontSize: 11 }}>also patch refunds</div>
            <button className="wf-btn sm">send to agent</button>
            <button className="wf-btn sm ghost">⏸ pause</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function D6Results() {
  return (
    <Screen label="REPO · pr #482 · review">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="wf-mono" style={{ fontWeight: 700 }}>#482</span>
          <span className="wf-h2" style={{ fontSize: 16 }}>fix: charge race on duplicate webhook</span>
          <span className="wf-chip ok">checks ✓</span>
          <span className="wf-chip live"><span className="wf-dot"/>by agent</span>
        </div>
        <div className="wf-tabs">
          <span className="wf-tab">conversation</span>
          <span className="wf-tab">commits · 2</span>
          <span className="wf-tab active">files · 2</span>
          <span className="wf-tab">checks ✓</span>
        </div>
        <div className="wf-box" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ padding:'6px 10px', borderBottom:`1px dashed ${WF.lineFaint}`, display:'flex', gap: 8, alignItems:'center' }}>
            <span className="wf-mono" style={{ fontSize: 11 }}>charge_handler.go</span>
            <span className="wf-tiny" style={{ color: WF.ok }}>+8</span>
            <span className="wf-tiny" style={{ color: WF.err }}>−2</span>
          </div>
          <pre className="wf-mono" style={{ margin: 0, padding: 10, fontSize: 10.5, lineHeight: 1.6, whiteSpace:'pre' }}>{` 141  var req ChargeReq
+142  orderMu.Lock()
+143  defer orderMu.Unlock()
 144  if seen[req.OrderID] {
 145    respond(w, 200, "duplicate")`}</pre>
        </div>
        <div className="wf-box" style={{ padding: 8 }}>
          <div className="wf-label">why this change · agent</div>
          <div className="wf-note" style={{ marginTop: 4 }}>
            Two webhooks within 50ms could both pass the dup check. Mutex serializes the read+write of <span className="wf-mono">seen</span>. Test reproduces it deterministically.
          </div>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <button className="wf-btn primary">approve & merge</button>
          <button className="wf-btn">request changes</button>
          <button className="wf-btn ghost">reply to agent</button>
        </div>
      </div>
    </Screen>
  );
}

function D6History() {
  return (
    <Screen label="REPO · agent activity">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2" style={{ fontSize: 18 }}>agent activity · payments-svc</div>
        <div className="wf-tabs">
          <span className="wf-tab active">all 24</span>
          <span className="wf-tab">prs 14</span>
          <span className="wf-tab">commits 8</span>
          <span className="wf-tab">comments 2</span>
        </div>
        {[
          ['PR','#482 fix: charge race','merged','today'],
          ['PR','#481 deps: go-redis 8→9','merged','yest'],
          ['PR','#480 quarantine flaky tests','merged','yest'],
          ['cmt','review on #479 · 3 nits','—','2d'],
          ['PR','#478 docs: /v2 endpoints','draft','2d'],
          ['PR','#477 fix CVE-2026-1142','closed · superseded','3d'],
          ['cmt','explained billing/queue.go','—','3d'],
        ].map(([k, t, s, w], i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding: '8px 4px',
            borderBottom: i<6?`1px dashed ${WF.lineFaint}`:'none', fontSize: 12 }}>
            <span className="wf-chip ghost" style={{ fontSize: 9, width: 32, justifyContent:'center' }}>{k}</span>
            <span style={{ flex: 1 }}>{t}</span>
            <span className="wf-tiny">{s}</span>
            <span className="wf-tiny" style={{ width: 36, textAlign:'right' }}>{w}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

Object.assign(window, { D6Repos, D6Insights, D6Trigger, D6Live, D6Results, D6History });
