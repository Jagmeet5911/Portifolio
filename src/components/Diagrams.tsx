// Architecture sketches drawn from each repository. Paths draw in via [data-draw].

type Box = { x: number; y: number; w: number; label: string; sub?: string; tone?: "accent" | "warn" | "plain" };

function Node({ x, y, w, label, sub, tone = "plain" }: Box) {
  const h = sub ? 52 : 40;
  return (
    <g data-node className={`dg-node dg-node--${tone}`}>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      <text x={x + w / 2} y={y + (sub ? 22 : 25)} textAnchor="middle" className="dg-label">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 40} textAnchor="middle" className="dg-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

const Arrow = ({ d, dashed }: { d: string; dashed?: boolean }) => (
  <path data-path d={d} className={`dg-edge${dashed ? " dg-edge--dashed" : ""}`} markerEnd="url(#dg-arrow)" />
);

const Defs = () => (
  <defs>
    <marker id="dg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 10 5 0 10z" className="dg-arrowhead" />
    </marker>
  </defs>
);

export function GenyDiagram() {
  return (
    <svg viewBox="0 0 480 400" className="diagram" data-draw role="img" aria-label="Geny: an employee message goes through an LLM intent engine and a capability registry to a confirmation step and the HR API. Salary responses are sealed with a fresh AES-GCM key per response, readable only with the admin's browser-held RSA key.">
      <Defs />
      <Node x={20} y={20} w={130} label="Employee" sub="web chat · Slack" />
      <Node x={175} y={20} w={135} label="Intent engine" sub="LLM function calls" tone="accent" />
      <Node x={335} y={20} w={125} label="Registry" sub="14 HR actions" />
      <Arrow d="M150 46 H171" />
      <Arrow d="M310 46 H331" />
      <Node x={175} y={110} w={135} label="Confirm step" />
      <Node x={335} y={110} w={125} label="HR API" sub="MongoDB" />
      <Arrow d="M397 72 V106" />
      <Arrow d="M335 132 H314" />
      <Arrow d="M242 110 V76" dashed />
      <text x={20} y={212} className="dg-caption">ZERO-KNOWLEDGE SALARIES</text>
      <Node x={20} y={226} w={130} label="Server" sub="no private key" />
      <Node x={175} y={226} w={135} label="AES-256-GCM" sub="fresh per response" tone="warn" />
      <Node x={335} y={226} w={125} label="Admin browser" sub="RSA-2048 key" tone="accent" />
      <Arrow d="M150 252 H171" />
      <Arrow d="M310 252 H331" />
      <Node x={175} y={318} w={135} label="Key wrapped" sub="per admin" />
      <Arrow d="M242 278 V314" />
      <Arrow d="M310 344 C 400 344 397 300 397 282" />
    </svg>
  );
}

export function WingzDiagram() {
  return (
    <svg viewBox="0 0 480 400" className="diagram" data-draw role="img" aria-label="Wingz: a visitor talks to a Claude concierge with separate anonymous and signed-in toolsets. If the LLM fails, the error is classified into a customer-safe message, a deterministic booking flow still captures the lead, and staff see the reason in the CRM.">
      <Defs />
      <Node x={20} y={20} w={130} label="Visitor" sub="website chat" />
      <Node x={175} y={20} w={150} label="Claude concierge" sub="tool use" tone="accent" />
      <Node x={350} y={20} w={110} label="Toolsets" sub="anon · signed-in" />
      <Arrow d="M150 46 H171" />
      <Arrow d="M325 46 H346" />
      <text x={175} y={120} className="dg-caption">IF THE LLM FAILS</text>
      <Node x={175} y={134} w={150} label="Classify error" sub="customer-safe reply" tone="warn" />
      <Arrow d="M250 72 V130" dashed />
      <Node x={175} y={230} w={150} label="Deterministic flow" sub="still books the lead" />
      <Arrow d="M250 186 V226" />
      <Node x={350} y={230} w={110} label="CRM" sub="reason for staff" />
      <Arrow d="M325 256 H346" />
      <text x={20} y={330} className="dg-caption">JARVIS VOICE</text>
      <Node x={20} y={344} w={130} label="Browser mic" />
      <Node x={175} y={344} w={150} label="WS proxy" tone="accent" />
      <Node x={350} y={344} w={110} label="ElevenLabs" />
      <Arrow d="M150 364 H171" />
      <Arrow d="M325 358 H346" />
      <Arrow d="M346 372 H329" />
    </svg>
  );
}

export function AiopsDiagram() {
  return (
    <svg viewBox="0 0 480 400" className="diagram" data-draw role="img" aria-label="AIOps: aiops-sdk in the service captures failures and heartbeats. Incidents get P0 to P3 severity and SHA-256 fingerprint de-duplication, then an orchestrator drives auditor, fixer and reporter agents. A human approves in Slack, a code probe runs candidate fixes against the service's tests, and a GitHub pull request is opened.">
      <Defs />
      <Node x={20} y={20} w={140} label="Service" sub="aiops-sdk · 30 s beat" />
      <Node x={185} y={20} w={135} label="Ingest" sub="exceptions · 4xx/5xx" />
      <Node x={345} y={20} w={115} label="Triage" sub="P0–P3 · SHA-256" />
      <Arrow d="M160 46 H181" />
      <Arrow d="M320 46 H341" />
      <Node x={185} y={118} w={135} label="Orchestrator" tone="accent" />
      <Arrow d="M402 72 C 402 120 360 138 324 138" />
      <Node x={20} y={200} w={130} label="Auditor" />
      <Node x={175} y={200} w={135} label="Fixer" />
      <Node x={335} y={200} w={125} label="Reporter" />
      <Arrow d="M220 158 C 180 170 100 170 85 196" />
      <Arrow d="M252 158 V196" />
      <Arrow d="M285 158 C 330 170 390 170 397 196" />
      <Node x={175} y={278} w={135} label="Slack approve" tone="warn" />
      <Arrow d="M242 240 V274" />
      <Node x={20} y={340} w={180} label="Code probe" sub="tests in sandbox · rollback" />
      <Node x={280} y={340} w={180} label="GitHub PR" tone="accent" />
      <Arrow d="M200 304 C 150 304 110 315 110 336" />
      <Arrow d="M200 366 H276" />
    </svg>
  );
}

export const diagrams = { geny: GenyDiagram, wingz: WingzDiagram, aiops: AiopsDiagram };
