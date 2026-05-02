// dir3-action-catalog.jsx
// Direction 3 — Action Catalog
// Browse a gallery of pre-built agent "recipes". Pick a recipe, point it at
// a repo. Real-time view shows step cards animating with a checkpoint
// approval pattern. Best for less-technical platform users + governance.

function D3Catalog({ mode }) {
  const cats = [
    ['ship', ['create PR from spec','fix bug from issue','add endpoint']],
    ['maintain', ['upgrade dependencies','patch CVEs','refactor → smaller files','remove dead code']],
    ['quality', ['run tests','quarantine flaky','add coverage','review PR']],
    ['knowledge', ['generate docs','generate ADR','explain module','draw arch diagram']],
    ['audit', ['dependency map','licence scan','secret scan','perf profile']],
  ];
  return (
    <Screen label="CATALOG · /agents">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <span className="wf-h1" style={{ fontSize: 22 }}>agent recipes</span>
          <input className="wf-input" placeholder="search 38 recipes…" style={{ flex: 1, marginLeft: 10 }} />
          <button className="wf-btn sm">+ new recipe</button>
        </div>
        <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
          <span className="wf-chip live">all 38</span>
          <span className="wf-chip ghost">official 22</span>
          <span className="wf-chip ghost">team 11</span>
          <span className="wf-chip ghost">mine 5</span>
        </div>
        <div style={{ flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 10 }}>
          {cats.map(([cat, items]) => (
            <div key={cat}>
              <div className="wf-label" style={{ marginBottom: 6 }}>{cat}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 6 }}>
                {items.map((t, i) => (
                  <div key={t} className="wf-box" style={{ padding: 8, background: cat==='maintain' && i===0 ? '#fff7f3' : '#fff' }}>
                    <div className="wf-ph" style={{ height: 30, marginBottom: 6, fontSize: 9 }}>{t.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{t}</div>
                    <div className="wf-tiny" style={{ marginTop: 2 }}>used 142× · {Math.floor(Math.random()*4+2)}m avg</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'auto' }}>
          <ModeBanner mode={mode} />
        </div>
      </div>
    </Screen>
  );
}

function D3Insights() {
  return (
    <Screen label="CATALOG · recipe + repo">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
          <span className="wf-h2">upgrade dependencies</span>
          <span className="wf-chip ghost">official</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>used 1.2k× · 92% success</span>
        </div>
        <div className="wf-note">Scans your manifest, picks a safe upgrade plan, runs tests, and opens a PR per package.</div>
        <div className="wf-divider-dashed" />
        <div className="wf-label">point at a repo</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 6 }}>
          {[
            ['payments-svc','18 outdated · 2 cve'],
            ['checkout-web','7 outdated'],
            ['auth-edge','3 outdated'],
            ['data-pipe','24 outdated · 4 cve'],
            ['notif-relay','2 outdated'],
            ['search-idx','11 outdated'],
          ].map(([n, s], i) => (
            <div key={n} className="wf-box" style={{ padding: 8, borderColor: i===0?WF.accent:WF.line,
              background: i===0?'#fff7f3':'#fff' }}>
              <div className="wf-mono" style={{ fontSize: 11, fontWeight: 700 }}>{n}</div>
              <div className="wf-tiny" style={{ marginTop: 2 }}>{s}</div>
              <Spark data={[3,4,3,5,4,6,5]} />
            </div>
          ))}
        </div>
        <div className="wf-divider-dashed" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
          <div className="wf-box" style={{ padding: 8 }}>
            <div className="wf-label">repo health · payments-svc</div>
            <div className="wf-mono" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.6 }}>
              go 1.22 · 142 deps · 18 outdated<br/>
              cve-high: 2 · cve-med: 5<br/>
              tests: 412 · pass 100%
            </div>
          </div>
          <div className="wf-box" style={{ padding: 8 }}>
            <div className="wf-label">recipe will</div>
            <ol className="wf-mono" style={{ fontSize: 11, margin:'4px 0 0 16px', padding: 0, lineHeight: 1.6 }}>
              <li>scan manifest</li>
              <li>group safe minor bumps</li>
              <li>flag majors for approval</li>
              <li>run tests after each</li>
              <li>open one PR per group</li>
            </ol>
          </div>
        </div>
        <button className="wf-btn primary" style={{ alignSelf:'flex-end', marginTop:'auto' }}>configure & launch →</button>
      </div>
    </Screen>
  );
}

function D3Trigger() {
  return (
    <Screen label="CATALOG · configure">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2">configure · upgrade deps on payments-svc</div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">strategy</div>
          <div style={{ display:'flex', gap: 6, marginTop: 6 }}>
            <button className="wf-btn sm primary">conservative</button>
            <button className="wf-btn sm">balanced</button>
            <button className="wf-btn sm ghost">yolo</button>
          </div>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">include</div>
          <div className="wf-mono" style={{ fontSize: 11, marginTop: 6, lineHeight: 1.8 }}>
            <div>☑ patch versions  · 12</div>
            <div>☑ minor versions · 4</div>
            <div>☐ major versions · 2 <span className="wf-tiny">(go-redis, prom-client)</span></div>
            <div>☑ security only · always</div>
          </div>
        </div>
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">grouping</div>
          <div className="wf-mono" style={{ fontSize: 11, marginTop: 6 }}>
            ◉ one PR per ecosystem (recommended)<br/>
            ○ one PR per package<br/>
            ○ single mega PR
          </div>
        </div>
        <div style={{ display:'flex', gap: 6, marginTop:'auto' }}>
          <span className="wf-tiny">est 11m · 3 prs · ~$0.18</span>
          <button className="wf-btn ghost" style={{ marginLeft:'auto' }}>save preset</button>
          <button className="wf-btn primary">launch</button>
        </div>
      </div>
    </Screen>
  );
}

function D3Live({ mode }) {
  const steps = [
    ['done', 'scan manifest', '142 packages found'],
    ['done', 'group plan', '3 prs · 16 bumps · 2 majors held'],
    ['running', 'group 1: patch bumps', 'running tests · 240/412'],
    ['waiting', 'group 2: minor bumps', 'awaiting your approval'],
    ['next', 'group 3: open prs', '—'],
  ];
  return (
    <Screen label="CATALOG · live">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Status kind="running" />
          <span className="wf-h2" style={{ fontSize: 16 }}>upgrade deps · payments-svc</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>03:42 · step 3 of 5</span>
        </div>
        <ModeBanner mode={mode} />
        <div style={{ display:'flex', flexDirection:'column', gap: 8, flex: 1, overflow:'hidden' }}>
          {steps.map(([s, t, sub], i) => (
            <div key={i} className="wf-box" style={{ padding: 10, opacity: s==='next'?.5:1,
              borderColor: s==='running'?WF.accent: s==='waiting'?WF.warn: WF.line,
              background: s==='running'?'#fff7f3': s==='waiting'?'#fff8eb': '#fff' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <span className="wf-mono" style={{ width: 16, color: s==='done'?WF.ok: s==='running'?WF.accent: s==='waiting'?WF.warn: WF.muted }}>
                  {s==='done'?'✓': s==='running'?'▸': s==='waiting'?'⏸': '○'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{i+1}. {t}</span>
                <Status kind={s==='running'?'running': s==='done'?'done': s==='waiting'?'waiting':'idle'} />
              </div>
              <div className="wf-tiny" style={{ marginLeft: 24, marginTop: 4 }}>{sub}</div>
              {s==='running' && <Progress marching style={{ marginTop: 8 }} />}
              {s==='waiting' && (
                <div style={{ display:'flex', gap: 6, marginLeft: 24, marginTop: 8 }}>
                  <button className="wf-btn sm primary">approve · ↵</button>
                  <button className="wf-btn sm">edit plan</button>
                  <button className="wf-btn sm ghost">skip</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="ask · ‘why is fasthttp held back?’" style={{ flex: 1 }} />
          <button className="wf-btn">ask</button>
          <button className="wf-btn ghost">⏸</button>
          <button className="wf-btn ghost">✕</button>
        </div>
      </div>
    </Screen>
  );
}

function D3Results() {
  return (
    <Screen label="CATALOG · done">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Status kind="done" />
          <span className="wf-h2" style={{ fontSize: 16 }}>upgrade deps · 3 PRs ready</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>11m 04s · $0.18</span>
        </div>
        {[
          ['#482','patch bumps · 12 packages','+312 −308','green'],
          ['#483','minor bumps · 4 packages','+118 −96','green'],
          ['#484','go-redis 8→9 · NEEDS REVIEW','+412 −287','warn'],
        ].map(([num, t, d, k], i) => (
          <div key={num} className="wf-box" style={{ padding: 10, borderColor: k==='warn'?WF.warn:WF.line }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <span className="wf-mono" style={{ fontWeight: 700, fontSize: 12 }}>{num}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{t}</span>
              <span className="wf-mono wf-tiny">{d}</span>
              <Status kind={k==='warn'?'waiting':'done'} label={k==='warn'?'review':'tests pass'} />
            </div>
          </div>
        ))}
        <div className="wf-box" style={{ padding: 10 }}>
          <div className="wf-label">held back · need human call</div>
          <div className="wf-mono" style={{ fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
            prom-client 14→15 · breaking labels API<br/>
            fasthttp 1.50→1.60 · ABI risk in /charge
          </div>
        </div>
        <div style={{ display:'flex', gap: 6, marginTop:'auto' }}>
          <button className="wf-btn primary">open all 3 PRs</button>
          <button className="wf-btn">merge greens</button>
          <button className="wf-btn ghost">re-run on remaining</button>
        </div>
      </div>
    </Screen>
  );
}

function D3History() {
  return (
    <Screen label="CATALOG · runs">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2" style={{ fontSize: 18 }}>recent runs · grouped by recipe</div>
        {[
          ['upgrade deps', 24, '92% green', [3,4,5,4,6,5,7,4,8]],
          ['fix CVEs', 11, '100% green', [2,3,2,4,3,5,4,3,5]],
          ['quarantine flaky', 8, '88% green', [2,1,3,2,4,3,2,3]],
          ['generate docs', 6, '100% green', [1,2,1,3,2,2,3,2]],
        ].map(([name, n, q, sp], i) => (
          <div key={name} className="wf-box" style={{ padding: 10, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div className="wf-tiny">{n} runs · last 7d · {q}</div>
            </div>
            <Spark data={sp} />
            <button className="wf-btn sm ghost">view all →</button>
          </div>
        ))}
        <div className="wf-divider-dashed" />
        <div className="wf-label">all runs · 49 total</div>
        <div className="wf-ph" style={{ flex: 1 }}>full run table</div>
      </div>
    </Screen>
  );
}

Object.assign(window, { D3Catalog, D3Insights, D3Trigger, D3Live, D3Results, D3History });
