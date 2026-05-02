// dir4-conversational.jsx
// Direction 4 — Conversational Workspace
// Chat-led. Each repo has an agent thread. Tasks emerge from conversation.
// Live execution shows as in-thread tool calls. Two-pane: thread + workspace.

function D4Threads({ mode }) {
  return (
    <Screen label="CHAT · /threads">
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', height:'100%' }}>
        <div style={{ borderRight:`1px solid ${WF.lineFaint}`, padding: 10, display:'flex', flexDirection:'column', gap: 8 }}>
          <div className="wf-h2" style={{ fontSize: 16 }}>threads</div>
          <input className="wf-input" placeholder="search…" />
          <button className="wf-btn sm" style={{ borderStyle:'dashed' }}>+ new thread</button>
          <div className="wf-label" style={{ marginTop: 6 }}>active</div>
          {['payments-svc','checkout-web','data-pipe'].map((r, i) => (
            <div key={r} className="wf-box" style={{ padding: 8, borderColor: i===0?WF.accent:WF.line, background: i===0?'#fff7f3':'#fff' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>{r}</span>
                {i<2 && <span className="wf-dot" />}
              </div>
              <div className="wf-tiny" style={{ marginTop: 2 }}>fix race in charge_handler</div>
            </div>
          ))}
          <div className="wf-label" style={{ marginTop: 6 }}>archived</div>
          {['auth-edge','notif-relay','search-idx'].map(r => (
            <div key={r} className="wf-mono" style={{ fontSize: 11, padding: 4, color: WF.muted }}>{r}</div>
          ))}
        </div>
        <div style={{ padding: 14, display:'flex', flexDirection:'column', gap: 10 }}>
          <ModeBanner mode={mode} />
          <div className="wf-h1" style={{ fontSize: 22 }}>start a thread</div>
          <div className="wf-note">Pick a repo. We'll load its context — files, deps, tests, recent PRs — so you can just say what you want.</div>
          <input className="wf-input" placeholder="@repo …" style={{ marginTop: 6 }} />
          <div className="wf-label">recent</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6 }}>
            {['@payments-svc fix the charge race','@checkout-web why is /v2 slow?','@data-pipe upgrade pandas','@auth-edge add otel spans'].map(p => (
              <div key={p} className="wf-box" style={{ padding: 8, fontSize: 12 }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

function D4Insights() {
  return (
    <Screen label="CHAT · @payments-svc · context">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="wf-h2">@payments-svc</span>
          <span className="wf-chip ok">context loaded</span>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
            <div className="wf-ph" style={{ width: 28, height: 28, borderRadius: 14, fontSize: 9 }}>A</div>
            <div className="wf-note" style={{ flex: 1 }}>
              I've loaded <b>payments-svc</b>. Quick read: Go 1.22, 142 deps (18 stale, 2 high CVE), 412 tests
              passing but 3 flaky around <span className="wf-mono">TestCharge*</span>, last release 2d ago.
              Coverage 72%. What do you want to do?
            </div>
          </div>
          <div style={{ display:'flex', gap: 6, marginTop: 8, marginLeft: 36, flexWrap:'wrap' }}>
            <button className="wf-btn sm">fix the flaky tests</button>
            <button className="wf-btn sm">upgrade deps</button>
            <button className="wf-btn sm">patch CVEs</button>
            <button className="wf-btn sm ghost">explain the charge flow</button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 6 }}>
          {[['commits/wk','24'],['open prs','12'],['coverage','72%'],['cve high','2'],['flaky','3'],['deps stale','18']].map(([k,v]) => (
            <div key={k} className="wf-box-soft" style={{ padding: 8 }}>
              <div className="wf-label">{k}</div>
              <div className="wf-mono" style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'auto', display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="say something…" style={{ flex: 1 }} />
          <button className="wf-btn primary">send ↵</button>
        </div>
      </div>
    </Screen>
  );
}

function D4Trigger() {
  return (
    <Screen label="CHAT · @payments-svc · plan proposed">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 8 }}>
        <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
          <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>U</div>
          <div className="wf-box" style={{ padding: 8, background: WF.accentSoft, flex: 1, fontSize: 13 }}>
            fix the race in charge_handler when stripe sends the webhook twice. open a PR with a regression test.
          </div>
        </div>
        <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
          <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>A</div>
          <div className="wf-box" style={{ padding: 10, flex: 1, fontSize: 13 }}>
            <div style={{ marginBottom: 8 }}>Here's what I'd do — say <b>go</b> or edit anything:</div>
            <div className="wf-box-soft" style={{ padding: 8, fontFamily: WF.mono, fontSize: 11, lineHeight: 1.7 }}>
              1. read charge_handler.go + webhook_test.go<br/>
              2. add <span className="wf-mono">sync.Mutex</span> around the order-id check (L142–156)<br/>
              3. write <span className="wf-mono">TestDoubleDeliver</span> covering 50ms duplicate<br/>
              4. run <span className="wf-mono">go test ./charge/...</span><br/>
              5. open PR titled "fix: charge race on duplicate webhook"
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
              <button className="wf-btn primary sm">go ↵</button>
              <button className="wf-btn sm">edit step 2</button>
              <button className="wf-btn sm ghost">change approach</button>
            </div>
            <div className="wf-tiny" style={{ marginTop: 8 }}>est 4m · ~$0.06 · plan-first mode</div>
          </div>
        </div>
        <div style={{ marginTop:'auto', display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="reply…" style={{ flex: 1 }} />
          <button className="wf-btn primary">send</button>
        </div>
      </div>
    </Screen>
  );
}

function D4Live({ mode }) {
  return (
    <Screen label="CHAT · @payments-svc · live">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 8, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <Status kind="running" />
          <span className="wf-tiny">{mode}</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>02:14 · 4.2k tokens</span>
        </div>
        <div style={{ flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 8 }}>
          <div style={{ display:'flex', gap: 8 }}>
            <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>A</div>
            <div style={{ flex: 1, fontSize: 12, color: WF.ink2 }}>Reading the handler now…</div>
          </div>
          <div className="wf-box-soft" style={{ padding: 8, fontFamily: WF.mono, fontSize: 11, marginLeft: 32 }}>
            ▸ <span style={{color:WF.muted}}>read</span> charge_handler.go · 314 lines<br/>
            <span className="wf-tiny">found race at L142–156 ✓</span>
          </div>
          <div className="wf-box-soft" style={{ padding: 8, fontFamily: WF.mono, fontSize: 11, marginLeft: 32 }}>
            ▸ <span style={{color:WF.muted}}>edit</span> charge_handler.go<br/>
            <pre style={{ margin:'4px 0 0', fontSize: 10, lineHeight: 1.5 }}>{`+ var orderMu sync.Mutex
+ orderMu.Lock()
+ defer orderMu.Unlock()`}</pre>
          </div>
          <div className="wf-box-soft" style={{ padding: 8, fontFamily: WF.mono, fontSize: 11, marginLeft: 32 }}>
            ▸ <span style={{color:WF.accent}}>writing</span> webhook_test.go · TestDoubleDeliver
            <Progress marching style={{ marginTop: 6 }} />
          </div>
          <div style={{ display:'flex', gap: 8, marginTop: 4 }}>
            <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>U</div>
            <div className="wf-box" style={{ padding: 8, background: WF.accentSoft, flex: 1, fontSize: 12 }}>
              also handle refunds the same way please
            </div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>A</div>
            <div style={{ flex: 1, fontSize: 12, color: WF.ink2 }}>Got it — I'll add the same lock in <span className="wf-mono">refund_handler.go</span> after this test compiles.</div>
          </div>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="interrupt or ask…" style={{ flex: 1 }} />
          <button className="wf-btn primary">send</button>
          <button className="wf-btn ghost">⏸</button>
        </div>
      </div>
    </Screen>
  );
}

function D4Results() {
  return (
    <Screen label="CHAT · @payments-svc · done">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', gap: 8 }}>
          <div className="wf-ph" style={{ width: 24, height: 24, borderRadius: 12, fontSize: 9 }}>A</div>
          <div className="wf-box" style={{ padding: 10, flex: 1, fontSize: 13 }}>
            <Status kind="done" /> <b style={{ marginLeft: 6 }}>Done.</b> PR #482 is up.
            <div className="wf-note" style={{ marginTop: 6 }}>
              Locked <span className="wf-mono">order_id</span> + <span className="wf-mono">refund_id</span> reads,
              added <span className="wf-mono">TestDoubleDeliver</span> for both. 412/412 pass, lint+vet clean.
            </div>
            <div className="wf-box-soft" style={{ padding: 8, marginTop: 8 }}>
              <div className="wf-mono" style={{ fontSize: 11, lineHeight: 1.7 }}>
                <div>↗ <b>PR #482</b> · payments-svc/fix-charge-race</div>
                <div>+46 −2 · 2 files</div>
                <div>checks ✓ unit ✓ lint ✓ vet ✓ govulncheck</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
              <button className="wf-btn primary sm">open PR</button>
              <button className="wf-btn sm">merge</button>
              <button className="wf-btn sm ghost">also patch refunds in v2</button>
            </div>
          </div>
        </div>
        <div style={{ marginTop:'auto', display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="anything else?" style={{ flex: 1 }} />
          <button className="wf-btn primary">send</button>
        </div>
      </div>
    </Screen>
  );
}

function D4History() {
  return (
    <Screen label="CHAT · all threads">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2" style={{ fontSize: 18 }}>thread history</div>
        {[
          ['@payments-svc','fix charge race','done · PR #482','today'],
          ['@payments-svc','upgrade go-redis','done · PR #481','yest'],
          ['@checkout-web','docs for /v2','running','today'],
          ['@auth-edge','refactor session store','failed','2d'],
          ['@data-pipe','CVE-2026-1142','waiting · you','2d'],
          ['@notif-relay','generate openapi','done','3d'],
        ].map(([r, t, st, when], i) => (
          <div key={i} className="wf-box" style={{ padding: 10, display:'flex', alignItems:'center', gap: 10 }}>
            <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, width: 130 }}>{r}</span>
            <span style={{ flex: 1, fontSize: 13 }}>{t}</span>
            <span className="wf-tiny">{st}</span>
            <span className="wf-tiny" style={{ width: 40, textAlign:'right' }}>{when}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

Object.assign(window, { D4Threads, D4Insights, D4Trigger, D4Live, D4Results, D4History });
