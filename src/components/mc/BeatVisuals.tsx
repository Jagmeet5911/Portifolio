// Small looping illustrations for the Mind Circuit beats. Pure CSS/SVG motion,
// switched off under prefers-reduced-motion.

export function OrbitVisual() {
  const apps = ["Teacher", "School", "District", "Ops", "MCAP"];
  return (
    <div className="bv bv--orbit" aria-hidden="true">
      <div className="bv-orbit__ring bv-orbit__ring--outer" />
      <div className="bv-orbit__ring bv-orbit__ring--inner" />
      <div className="bv-orbit__spin">
        {apps.map((a, i) => (
          <span key={a} className="bv-orbit__sat" style={{ ["--a" as string]: `${(360 / apps.length) * i}deg` }}>
            <span className="bv-orbit__label">{a}</span>
          </span>
        ))}
      </div>
      <span className="bv-orbit__core">API</span>
    </div>
  );
}

export function ChatVisual() {
  return (
    <div className="bv bv--chat" aria-hidden="true">
      <span className="bv-chat__b bv-chat__b--in">Can we see a demo?</span>
      <span className="bv-chat__tool">book_demo()</span>
      <span className="bv-chat__b bv-chat__b--out">Booked for Tuesday ✓</span>
      <span className="bv-chat__b bv-chat__b--in">We need a district contract.</span>
      <span className="bv-chat__switch">
        <span className="bv-chat__knob" />
        <em>AI</em>
        <em>Human</em>
      </span>
    </div>
  );
}

export function PayVisual() {
  return (
    <div className="bv bv--pay" aria-hidden="true">
      <span className="bv-pay__card">
        <span className="bv-pay__chip" />
        <span className="bv-pay__num">•••• 4242</span>
      </span>
      <span className="bv-pay__ghost">retry</span>
      <svg className="bv-pay__check" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="23" />
        <path d="M15 27l7 7 15-16" />
      </svg>
      <span className="bv-pay__tag">charged once</span>
    </div>
  );
}

export function AtlasVisual() {
  const cols = 17;
  const rows = 9;
  const hot = [
    [4, 3],
    [11, 5],
    [14, 2],
  ];
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = Math.min(...hot.map(([hx, hy]) => Math.hypot(c - hx, r - hy)));
      dots.push(<span key={`${r}-${c}`} style={{ ["--d" as string]: d.toFixed(2) }} className={d < 0.5 ? "is-hot" : undefined} />);
    }
  }
  return (
    <div className="bv bv--atlas" aria-hidden="true">
      <div className="bv-atlas__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {dots}
      </div>
    </div>
  );
}

export const beatVisuals = { apps: OrbitVisual, agent: ChatVisual, pay: PayVisual, atlas: AtlasVisual };
