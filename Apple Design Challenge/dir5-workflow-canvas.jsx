// dir5-workflow-canvas.jsx
// Direction 5 — Workflow Canvas
// Node-based view. Agent's plan is a graph of steps; live execution
// animates through the graph. Best for inspectable, branching agent runs.

function D5Canvas({ mode }) {
  return (
    <Screen label="CANVAS · /flows">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2" style={{ fontSize: 18 }}>flows · pick a starting point</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8 }}>
          {[
            ['blank flow', 'drag nodes onto canvas'],
            ['from recipe', 'pick a template flow'],
            ['from PR', 'replay an agent flow on a PR'],
          ].map(([t, s], i) => (
            <div key={t} className="wf-box" style={{ padding: 10, background: i===1?'#fff7f3':'#fff' }}>
              <div className="wf-ph" style={{ height: 56, marginBottom: 6 }}>graph</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
              <div className="wf-tiny">{s}</div>
            </div>
          ))}
        </div>
        <div className="wf-label">recent flows</div>
        {['fix bug → test → PR','scan deps → patch → 1 PR per group','docs sweep across services'].map(f => (
          <div key={f} className="wf-box-soft" style={{ padding: 8, fontSize: 12 }}>{f}</div>
        ))}
        <div style={{ marginTop:'auto' }}><ModeBanner mode={mode} /></div>
      </div>
    </Screen>
  );
}

function D5Insights() {
  return (
    <Screen label="CANVAS · context node">
      <div style={{ padding: 14, height:'100%', position:'relative', background: WF.paperAlt,
        backgroundImage:`radial-gradient(${WF.lineFaint} 1px, transparent 1px)`, backgroundSize:'14px 14px' }}>
        <div className="wf-box" style={{ position:'absolute', left: 16, top: 16, width: 150, padding: 8, background:'#fff' }}>
          <div className="wf-label">repo</div>
          <div className="wf-mono" style={{ fontSize: 11, fontWeight: 700 }}>payments-svc</div>
          <div className="wf-tiny">main · go 1.22</div>
          <Spark data={[2,4,3,5,4,6,5]} />
        </div>
        <div className="wf-box" style={{ position:'absolute', left: 200, top: 8, width: 130, padding: 8, background:'#fff' }}>
          <div className="wf-label">cve</div>
          <div className="wf-mono" style={{ fontSize: 11 }}>2 high · 5 med</div>
        </div>
        <div className="wf-box" style={{ position:'absolute', left: 200, top: 70, width: 130, padding: 8, background:'#fff' }}>
          <div className="wf-label">flaky</div>
          <div className="wf-mono" style={{ fontSize: 11 }}>3 tests · /charge</div>
        </div>
        <div className="wf-box" style={{ position:'absolute', left: 200, top: 132, width: 130, padding: 8, background:'#fff' }}>
          <div className="wf-label">deps</div>
          <div className="wf-mono" style={{ fontSize: 11 }}>18 outdated</div>
        </div>
        <svg style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <path d="M165,40 C 185,40 185,30 200,30" className="wf-anno-line" />
          <path d="M165,55 C 185,55 185,90 200,90" className="wf-anno-line" />
          <path d="M165,70 C 185,70 185,150 200,150" className="wf-anno-line" />
        </svg>
        <div className="wf-box" style={{ position:'absolute', right: 16, top: 16, width: 150, padding: 8, background:'#fff7f3', borderColor: WF.accent }}>
          <div className="wf-label" style={{ color: WF.accent }}>+ add agent</div>
          <div className="wf-tiny" style={{ marginTop: 4 }}>connect any signal node to a new agent</div>
        </div>
        <div style={{ position:'absolute', right: 14, bottom: 14, display:'flex', gap: 6 }}>
          <button className="wf-btn sm">+ node</button>
          <button className="wf-btn sm">fit</button>
          <button className="wf-btn primary sm">build flow →</button>
        </div>
      </div>
    </Screen>
  );
}

function D5Trigger() {
  // designed plan as graph
  const nodes = [
    [20, 30, 'read', 'charge_handler.go'],
    [20, 100, 'read', 'webhook_test.go'],
    [180, 65, 'analyze', 'find race'],
    [330, 30, 'edit', 'add mutex'],
    [330, 100, 'write', 'TestDoubleDeliver'],
    [490, 65, 'run', 'go test'],
    [630, 65, 'pr', 'open PR'],
  ];
  return (
    <Screen label="CANVAS · plan">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 8 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span className="wf-h2" style={{ fontSize: 16 }}>fix charge race · plan</span>
          <span className="wf-chip ghost">7 nodes · 2 branches</span>
          <button className="wf-btn primary sm" style={{ marginLeft:'auto' }}>approve & run</button>
        </div>
        <div style={{ flex: 1, position:'relative', background: WF.paperAlt, borderRadius: 6,
          backgroundImage:`radial-gradient(${WF.lineFaint} 1px, transparent 1px)`, backgroundSize:'12px 12px',
          overflow:'hidden' }}>
          <svg style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
            {[
              [120, 50, 180, 75], [120, 120, 180, 85],
              [280, 75, 330, 50], [280, 75, 330, 120],
              [430, 50, 490, 75], [430, 120, 490, 75],
              [590, 75, 630, 75],
            ].map((c, i) => (
              <path key={i} d={`M${c[0]},${c[1]} C ${c[0]+30},${c[1]} ${c[2]-30},${c[3]} ${c[2]},${c[3]}`}
                stroke={WF.line} strokeWidth="1.5" fill="none" />
            ))}
          </svg>
          {nodes.map(([x, y, kind, label], i) => (
            <div key={i} className="wf-box" style={{ position:'absolute', left: x, top: y, width: 100, padding: 6, background:'#fff' }}>
              <div className="wf-label" style={{ fontSize: 9 }}>{kind}</div>
              <div className="wf-mono" style={{ fontSize: 10, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="wf-tiny">click a node to edit · drag to add a step · ⌥+drag to branch</div>
      </div>
    </Screen>
  );
}

function D5Live({ mode }) {
  const nodes = [
    [20, 30, 'read', 'charge_handler.go', 'done'],
    [20, 100, 'read', 'webhook_test.go', 'done'],
    [180, 65, 'analyze', 'find race', 'done'],
    [330, 30, 'edit', 'add mutex', 'done'],
    [330, 100, 'write', 'TestDoubleDeliver', 'running'],
    [490, 65, 'run', 'go test', 'next'],
    [630, 65, 'pr', 'open PR', 'next'],
  ];
  const colors = { done:[WF.ok,'#f0f8f0'], running:[WF.accent,'#fff7f3'], next:[WF.muted,'#f5f3ee'] };
  return (
    <Screen label="CANVAS · live">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 8 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Status kind="running" />
          <span className="wf-h2" style={{ fontSize: 16 }}>fix charge race · running</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>{mode} · 02:14</span>
        </div>
        <div style={{ flex: 1, position:'relative', background: WF.paperAlt, borderRadius: 6,
          backgroundImage:`radial-gradient(${WF.lineFaint} 1px, transparent 1px)`, backgroundSize:'12px 12px',
          overflow:'hidden' }}>
          <svg style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
            {[
              [120, 50, 180, 75, 'done'], [120, 120, 180, 85, 'done'],
              [280, 75, 330, 50, 'done'], [280, 75, 330, 120, 'running'],
              [430, 50, 490, 75, 'next'], [430, 120, 490, 75, 'next'],
              [590, 75, 630, 75, 'next'],
            ].map(([x1,y1,x2,y2,s], i) => (
              <path key={i} d={`M${x1},${y1} C ${x1+30},${y1} ${x2-30},${y2} ${x2},${y2}`}
                stroke={s==='done'?WF.ok: s==='running'?WF.accent : WF.lineFaint}
                strokeDasharray={s==='running'?'4 3':'none'}
                strokeWidth="1.8" fill="none" />
            ))}
          </svg>
          {nodes.map(([x, y, kind, label, st], i) => (
            <div key={i} style={{ position:'absolute', left: x, top: y, width: 100, padding: 6,
              border: `1.5px solid ${colors[st][0]}`, borderRadius: 6, background: colors[st][1],
              boxShadow: st==='running' ? '0 0 0 3px rgba(196,74,44,.15)' : 'none' }}>
              <div className="wf-label" style={{ fontSize: 9, color: colors[st][0] }}>
                {st==='done'?'✓ ':'' }{kind}
              </div>
              <div className="wf-mono" style={{ fontSize: 10, fontWeight: 600 }}>{label}</div>
              {st==='running' && <Progress marching style={{ marginTop: 4 }} />}
            </div>
          ))}
        </div>
        <div className="wf-box" style={{ padding: 8 }}>
          <div className="wf-label">node detail · TestDoubleDeliver</div>
          <pre className="wf-mono" style={{ margin: '4px 0 0', fontSize: 10, lineHeight: 1.5 }}>{`writing test/webhook_test.go
+ func TestDoubleDeliver(t *testing.T) {
+   // fire same webhook twice within 50ms
+   ...`}</pre>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <input className="wf-input" placeholder="interrupt this node…" style={{ flex: 1 }} />
          <button className="wf-btn">send</button>
          <button className="wf-btn ghost">⏸</button>
        </div>
      </div>
    </Screen>
  );
}

function D5Results() {
  return (
    <Screen label="CANVAS · done">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Status kind="done" />
          <span className="wf-h2" style={{ fontSize: 16 }}>flow complete · PR #482</span>
          <span className="wf-tiny" style={{ marginLeft:'auto' }}>4m 12s · $0.06</span>
        </div>
        <div style={{ flex: 1, position:'relative', background: WF.paperAlt, borderRadius: 6 }}>
          <svg style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
            {[[100,40,170,75],[100,120,170,85],[270,80,340,50],[270,80,340,120],[440,50,510,75],[440,120,510,75],[610,75,640,75]].map((c, i) => (
              <path key={i} d={`M${c[0]},${c[1]} L ${c[2]},${c[3]}`} stroke={WF.ok} strokeWidth="1.5" fill="none" />
            ))}
          </svg>
          {[[20,30,'read'],[20,100,'read'],[180,65,'analyze'],[340,30,'edit'],[340,100,'write'],[510,65,'test'],[640,65,'pr']].map(([x,y,k], i) => (
            <div key={i} style={{ position:'absolute', left:x, top:y, width:80, padding:6, border:`1.5px solid ${WF.ok}`, borderRadius:6, background:'#f0f8f0' }}>
              <div className="wf-label" style={{ fontSize:9, color: WF.ok }}>✓ {k}</div>
            </div>
          ))}
        </div>
        <div className="wf-box" style={{ padding: 8 }}>
          <div className="wf-mono" style={{ fontSize: 11, lineHeight: 1.7 }}>
            ↗ PR #482 · payments-svc/fix-charge-race · +46 −2 · checks ✓
          </div>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <button className="wf-btn primary">view PR</button>
          <button className="wf-btn">merge</button>
          <button className="wf-btn ghost">save flow as recipe</button>
          <button className="wf-btn ghost">replay step-by-step</button>
        </div>
      </div>
    </Screen>
  );
}

function D5History() {
  return (
    <Screen label="CANVAS · runs">
      <div style={{ padding: 14, height:'100%', display:'flex', flexDirection:'column', gap: 10 }}>
        <div className="wf-h2" style={{ fontSize: 18 }}>flow runs</div>
        {[
          ['fix race · charge_handler','7 nodes','done',[1,1,1,1,1,1,1]],
          ['upgrade go-redis 8→9','12 nodes · 1 branch','done',[1,1,1,1,1,1,0,1,1,1,1,1]],
          ['docs sweep · /v2','9 nodes','running',[1,1,1,1,0.5,0,0,0,0]],
          ['CVE-2026-1142','5 nodes · waiting','waiting',[1,1,0.5,0,0]],
        ].map(([t, s, st, marks], i) => (
          <div key={i} className="wf-box" style={{ padding: 10 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{t}</span>
              <span className="wf-tiny">{s}</span>
              <Status kind={st} />
            </div>
            <div style={{ display:'flex', gap: 4, marginTop: 8 }}>
              {marks.map((m, j) => (
                <div key={j} style={{ width: 14, height: 14, borderRadius: 2,
                  background: m===1?WF.ok: m===0.5?WF.accent: WF.lineFaint }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

Object.assign(window, { D5Canvas, D5Insights, D5Trigger, D5Live, D5Results, D5History });
