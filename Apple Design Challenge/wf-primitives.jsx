// wf-primitives.jsx
// Shared wireframe primitives — sketchy, hand-drawn vibe.
// All directions share these so the system feels coherent.

const WF = {
  ink: '#1a1814',
  ink2: '#3a3530',
  muted: '#6a635a',
  faint: '#9a948a',
  paper: '#fafaf7',
  paperAlt: '#f3f1ec',
  line: 'rgba(26,24,20,0.55)',
  lineFaint: 'rgba(26,24,20,0.18)',
  accent: '#c44a2c', // single warm accent for "live/active/agent"
  accentSoft: '#f4d8cf',
  ok: '#3a7a3a',
  warn: '#a8782a',
  err: '#a83a2a',
  // sketchy fonts
  hand: '"Caveat", "Bradley Hand", "Segoe Print", cursive',
  body: '"Architects Daughter", "Caveat", "Bradley Hand", cursive',
  ui: '"Kalam", "Architects Daughter", "Bradley Hand", cursive',
  mono: '"Cutive Mono", "Courier Prime", ui-monospace, monospace'
};

if (typeof document !== 'undefined' && !document.getElementById('wf-styles')) {
  const s = document.createElement('style');
  s.id = 'wf-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Architects+Daughter&family=Kalam:wght@300;400;700&family=Cutive+Mono&display=swap');
    .wf{ font-family: ${WF.ui}; color: ${WF.ink}; background:${WF.paper}; }
    .wf *{ box-sizing:border-box; }
    .wf-mono{ font-family:${WF.mono}; }
    .wf-hand{ font-family:${WF.hand}; }
    .wf-body{ font-family:${WF.body}; }

    .wf-box{ border:1.5px solid ${WF.line}; border-radius:6px; background:${WF.paper}; }
    .wf-box-dashed{ border:1.5px dashed ${WF.line}; border-radius:6px; }
    .wf-box-soft{ border:1.5px solid ${WF.lineFaint}; border-radius:6px; }
    .wf-divider{ height:1.5px; background:${WF.line}; opacity:.4; border:0; margin:0; }
    .wf-divider-dashed{ border:0; border-top:1.5px dashed ${WF.line}; opacity:.4; margin:0; }

    .wf-chip{ display:inline-flex; align-items:center; gap:5px; padding:2px 8px;
      border:1.2px solid ${WF.line}; border-radius:999px; font-size:11px; font-family:${WF.mono};
      color:${WF.ink2}; background:${WF.paper}; line-height:1.4; white-space:nowrap; }
    .wf-chip.live{ border-color:${WF.accent}; color:${WF.accent}; background:#fff; }
    .wf-chip.ok{ border-color:${WF.ok}; color:${WF.ok}; }
    .wf-chip.warn{ border-color:${WF.warn}; color:${WF.warn}; }
    .wf-chip.err{ border-color:${WF.err}; color:${WF.err}; }
    .wf-chip.ghost{ border-style:dashed; color:${WF.muted}; }

    .wf-btn{ display:inline-flex; align-items:center; gap:6px; padding:6px 12px;
      border:1.5px solid ${WF.ink}; border-radius:6px; background:${WF.paper}; font-family:${WF.ui};
      font-size:13px; color:${WF.ink}; cursor:pointer; line-height:1.2; }
    .wf-btn.primary{ background:${WF.ink}; color:${WF.paper}; }
    .wf-btn.accent{ background:${WF.accent}; border-color:${WF.accent}; color:#fff; }
    .wf-btn.ghost{ border-style:dashed; color:${WF.muted}; }
    .wf-btn.sm{ padding:3px 8px; font-size:11px; border-radius:5px; }

    .wf-input{ border:1.5px solid ${WF.line}; border-radius:6px; padding:6px 10px;
      font-family:${WF.mono}; font-size:12px; color:${WF.ink}; background:#fff; }

    .wf-h1{ font-family:${WF.hand}; font-size:26px; font-weight:700; line-height:1.1; color:${WF.ink}; }
    .wf-h2{ font-family:${WF.hand}; font-size:20px; font-weight:600; line-height:1.15; color:${WF.ink}; }
    .wf-h3{ font-family:${WF.ui}; font-size:13px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:${WF.muted}; }
    .wf-label{ font-family:${WF.mono}; font-size:10px; letter-spacing:.06em; text-transform:uppercase; color:${WF.muted}; }
    .wf-note{ font-family:${WF.body}; font-size:13px; color:${WF.ink2}; line-height:1.4; }
    .wf-tiny{ font-family:${WF.mono}; font-size:10px; color:${WF.muted}; }

    /* ascii-ish sparkline placeholder */
    .wf-spark{ display:inline-flex; align-items:flex-end; gap:2px; height:18px; }
    .wf-spark > i{ display:block; width:3px; background:${WF.ink2}; border-radius:1px; opacity:.7; }

    /* image / chart placeholder with diagonal stripes */
    .wf-ph{ position:relative; background-color:${WF.paperAlt};
      background-image:repeating-linear-gradient(135deg, ${WF.lineFaint} 0 1px, transparent 1px 9px);
      border:1.5px solid ${WF.line}; border-radius:6px;
      display:flex; align-items:center; justify-content:center;
      font-family:${WF.mono}; font-size:10px; color:${WF.muted}; text-align:center; padding:6px; }

    /* subtle pulsing dot for "live" */
    .wf-dot{ display:inline-block; width:7px; height:7px; border-radius:999px; background:${WF.accent}; box-shadow:0 0 0 0 ${WF.accent}; animation:wfpulse 1.6s ease-out infinite; }
    @keyframes wfpulse{ 0%{ box-shadow:0 0 0 0 rgba(196,74,44,.5);} 70%{ box-shadow:0 0 0 6px rgba(196,74,44,0);} 100%{ box-shadow:0 0 0 0 rgba(196,74,44,0);} }

    /* progress underline (animated dashes) */
    .wf-prog{ height:3px; background:${WF.lineFaint}; border-radius:2px; overflow:hidden; position:relative; }
    .wf-prog>i{ position:absolute; top:0; left:0; bottom:0; background:${WF.accent}; border-radius:2px; }
    .wf-prog-marching{ height:3px; border-radius:2px; background-image:repeating-linear-gradient(90deg, ${WF.accent} 0 6px, transparent 6px 12px); background-size:24px 100%; animation:wfmarch 1.2s linear infinite; }
    @keyframes wfmarch{ to{ background-position:24px 0; } }

    /* tab strip */
    .wf-tabs{ display:flex; gap:14px; border-bottom:1.5px solid ${WF.lineFaint}; padding:0 4px; }
    .wf-tab{ padding:6px 2px; font-family:${WF.ui}; font-size:12px; color:${WF.muted}; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1.5px; }
    .wf-tab.active{ color:${WF.ink}; border-bottom-color:${WF.ink}; font-weight:600; }

    /* annotation arrow + post-it inside artboard */
    .wf-anno{ font-family:${WF.hand}; font-size:14px; color:${WF.accent}; line-height:1.2; }
    .wf-anno-line{ stroke:${WF.accent}; stroke-width:1.5; fill:none; stroke-dasharray:3 3; }

    /* approval banner colors */
    .wf-mode{ font-family:${WF.mono}; font-size:10px; letter-spacing:.06em; text-transform:uppercase; padding:3px 8px; border-radius:4px; border:1.2px solid ${WF.line}; color:${WF.ink2}; background:${WF.paper}; }

    /* generic icon glyph wrapper (we draw simple shapes inline) */
    .wf-ic{ display:inline-block; vertical-align:middle; }
  `;
  document.head.appendChild(s);
}

// ── small helper components ─────────────────────────────────────────

function Spark({ data = [3, 5, 4, 7, 6, 9, 7, 8, 5, 9, 11, 8, 12, 10, 9, 11], color }) {
  const max = Math.max(...data);
  return (
    <span className="wf-spark">
      {data.map((v, i) =>
      <i key={i} style={{ height: `${v / max * 100}%`, background: color || WF.ink2 }} />
      )}
    </span>);

}

function Ph({ label, w, h, style }) {
  return <div className="wf-ph" style={{ width: w, height: h, ...style }}>{label}</div>;
}

// progress underline driven by % (or "marching" if running w/o pct)
function Progress({ pct, marching, style }) {
  if (marching) return <div className="wf-prog-marching" style={style} />;
  return (
    <div className="wf-prog" style={style}>
      <i style={{ width: `${pct}%` }} />
    </div>);

}

// status chip helper
function Status({ kind = 'idle', label }) {
  const map = {
    idle: { cls: 'ghost', text: label || 'idle' },
    queued: { cls: 'ghost', text: label || 'queued' },
    running: { cls: 'live', text: label || 'running' },
    paused: { cls: 'warn', text: label || 'paused' },
    waiting: { cls: 'warn', text: label || 'needs you' },
    done: { cls: 'ok', text: label || 'done' },
    failed: { cls: 'err', text: label || 'failed' }
  };
  const m = map[kind] || map.idle;
  return (
    <span className={`wf-chip ${m.cls}`} style={{ width: "90px" }}>
      {kind === 'running' && <span className="wf-dot" />}
      {m.text}
    </span>);

}

// approval-mode banner shown at top of execution screens
function ModeBanner({ mode }) {
  const txt = {
    fireforget: 'Fire-and-forget · review the PR when done',
    plan: 'Plan first · agent proposes, you approve, it executes',
    checkpoint: 'Checkpoints · agent pauses at key decisions',
    interactive: 'Interactive · interrupt, redirect, ask questions any time'
  }[mode] || mode;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
      border: `1.2px dashed ${WF.line}`, borderRadius: 6, background: '#fff' }}>
      <span className="wf-mode">approval · {mode}</span>
      <span className="wf-tiny">{txt}</span>
    </div>);

}

// repo row item — used in many places
function RepoLine({ name, lang, health = 'ok', stat, dim }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px',
      borderBottom: `1px dashed ${WF.lineFaint}`, opacity: dim ? .55 : 1, fontFamily: WF.mono, fontSize: 12 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: WF.lineFaint, flexShrink: 0 }} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ color: WF.muted, fontSize: 10 }}>{lang}</span>
      {stat && <span className="wf-tiny" style={{ minWidth: 36, textAlign: 'right' }}>{stat}</span>}
      <span className={`wf-chip ${health === 'ok' ? 'ok' : health === 'warn' ? 'warn' : health === 'err' ? 'err' : 'ghost'}`}
      style={{ fontSize: 9, padding: '0 6px' }}>{health}</span>
    </div>);

}

// sketch of an arrow connecting two annotation points
function Arrow({ from, to, curve = 0.3 }) {
  const [x1, y1] = from,[x2, y2] = to;
  const mx = (x1 + x2) / 2 + (y2 - y1) * curve;
  const my = (y1 + y2) / 2 + (x1 - x2) * curve;
  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} className="wf-anno-line" />
      <polygon points={`${x2},${y2} ${x2 - 6},${y2 - 3} ${x2 - 6},${y2 + 3}`} fill={WF.accent} />
    </svg>);

}

// thin sketchy frame used to wrap a whole screen so each artboard reads
// as a "screen mock", with a tiny screen label up top
function Screen({ label, children, style }) {
  return (
    <div className="wf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: WF.paper, ...style }}>
      <div style={{ padding: '6px 10px', borderBottom: `1px solid ${WF.lineFaint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}>
        <span className="wf-tiny">{label}</span>
        <span className="wf-tiny" style={{ opacity: .5 }}>· · ·</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>);

}

Object.assign(window, { WF, Spark, Ph, Progress, Status, ModeBanner, RepoLine, Arrow, Screen });