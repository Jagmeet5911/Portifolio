// Single source of truth for every fact and link on the site.
// Everything here is verified against the resume, git history, or source code.
// Do not add numbers or claims that are not backed by one of those.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const profile = {
  name: "Jagmeet Singh",
  firstName: "Jagmeet",
  role: "AI Engineer",
  focus: "LLM agents & full\u2011stack platforms",
  location: "Mohali, Punjab, India",
  email: "sidhugurjant587@gmail.com",
  linkedin: "https://www.linkedin.com/in/jagmeet-singh5911",
  resume: "/Jagmeet_Singh_Resume.pdf",
  intro:
    "I build products end to end — schema, API, interface, release pipeline — and the AI agents that work inside them. Right now I lead engineering on Mind Circuit, a US K-12 classroom platform in production.",
  statement:
    "I don’t build demos. I build production systems — the kind that take real payments, run real classrooms, and trust AI agents with real work.",
};

export const heroStats = [
  { value: "8", label: "Products delivered at 1GEN since Jan 2025" },
  { value: "6", label: "Repositories I lead on Mind Circuit, live in the US" },
];

/** Shown by the particle morph in About, in this order. Each icon is drawn from particles. */
export const signature = [
  {
    icon: "lock",
    kicker: "Geny \u00b7 AI HR assistant",
    title: "Zero-knowledge architecture",
    body: "Salaries the server itself can\u2019t read. Each admin\u2019s key never leaves their browser, and every response is sealed with a fresh AES-256 key.",
  },
  {
    icon: "chat",
    kicker: "Mind Circuit \u00b7 US K-12, in production",
    title: "An AI agent that knows when to hand off",
    body: "It answers schools on WhatsApp and web chat, books demos, and passes the thread to a person in a live inbox \u2014 one reply per message, even through crashes.",
  },
  {
    icon: "plane",
    kicker: "Wingz \u00b7 Private aviation",
    title: "AI concierge for private jets",
    body: "Claude agents handle charter availability and quotes on web chat and WhatsApp, a voice assistant talks in real time \u2014 and no lead is lost when the model goes down.",
  },
  {
    icon: "heal",
    kicker: "AIOps agent \u00b7 SDK on PyPI",
    title: "Software that repairs itself",
    body: "It catches production errors, ranks them, and opens a fix pull request tested against the service\u2019s own suite \u2014 after a human approves.",
  },
  {
    icon: "heart",
    kicker: "1GEN Impact Cloud \u00b7 In production",
    title: "A cloud suite NGOs run on",
    body: "Backend for campaigns with SMS and email delivery, crowdfunding, team analytics and Gemini-powered matching \u2014 plus a seniors\u2019 community app.",
  },
] as const;

export const nav = [
  { href: "#mind-circuit", label: "Mind Circuit" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
];

export const marquee = ["AI agents", "LLM orchestration", "Payments & licensing", "Microservices", "Real-time voice", "Zero-knowledge crypto", "Release pipelines", "Multi-tenant SaaS"];

/* ------------------------------------------------------------------ */
/* Mind Circuit                                                        */
/* ------------------------------------------------------------------ */

export const mindCircuit = {
  url: "https://mindcircuit.org",
  tagline: "Short resets that bring a disrupted classroom back to instruction.",
  role: "Lead engineer · Jul 2026 – present",
  badges: ["In production", "US client · MOU", "Built at 1GEN"],
};

/** Five short beats — a glimpse, not a spec sheet. */
export const mcBeats = [
  {
    id: "apps",
    kicker: "Platform",
    title: "Five web apps. One API.",
    body: "Teachers, school and district admins, operators and analysts — each with their own app, all on one platform I lead.",
  },
  {
    id: "agent",
    kicker: "AI agent",
    title: "An agent with a human off-switch.",
    body: "It answers schools on WhatsApp and web chat, books demos — and hands the thread to a person the moment it should.",
  },
  {
    id: "pay",
    kicker: "Revenue",
    title: "Money that can’t be charged twice.",
    body: "Card checkout, signed webhooks and seat-based licences, built so a retry never becomes a second charge.",
  },
  {
    id: "atlas",
    kicker: "Reach",
    title: "Every US district, searchable.",
    body: "A district atlas on three.js, backed by the national school directory and refreshed on every deploy.",
  },
];

/* ------------------------------------------------------------------ */
/* Capabilities                                                        */
/* ------------------------------------------------------------------ */

export const capabilities = [
  {
    title: "AI agents & LLM orchestration",
    body: "Tool-using agents on Claude and Gemini, provider fallback, human takeover, and declarative capability registries.",
    tags: ["Claude tool use", "Gemini", "Fallback design", "Embeddings"],
    proof: "Mind Circuit · Geny · Wingz · AIOps",
    size: "wide",
  },
  {
    title: "Payments & security",
    body: "SCA checkout, signed webhooks, idempotency, token rotation and zero-knowledge encryption.",
    tags: ["Square", "HMAC", "JWT rotation", "RSA-OAEP + AES-GCM"],
    proof: "Mind Circuit · Wingz · Geny",
    size: "tall",
  },
  {
    title: "Backend & APIs",
    body: "NestJS, Flask, Express and Go services with queues, cron, advisory locks and caching.",
    tags: ["NestJS", "Flask", "Go · Gin", "PostgreSQL", "MongoDB", "Redis"],
    proof: "All projects",
    size: "base",
  },
  {
    title: "Product interfaces",
    body: "Next.js and React apps with GSAP and three.js motion — portals, dashboards and CRMs.",
    tags: ["Next.js", "React", "GSAP", "three.js"],
    proof: "Teacher portal · MCAP · Wingz CRM",
    size: "base",
  },
  {
    title: "Delivery & testing",
    body: "CI images, auto-migrations and Compose deploys on AWS, backed by real test suites.",
    tags: ["Docker", "GitHub Actions", "GHCR", "EC2 · RDS", "Jest", "pytest"],
    proof: "Mind Circuit release pipeline",
    size: "base",
  },
  {
    title: "Data & analytics",
    body: "Analytics APIs and dashboards, SQL analysis and scraping pipelines.",
    tags: ["MCAP dashboards", "SQL", "Pandas", "Power BI"],
    proof: "MCAP · internships",
    size: "wide",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Other work                                                          */
/* ------------------------------------------------------------------ */

export type Project = {
  id: string;
  name: string;
  kind: string;
  period: string;
  status: string;
  stack: string[];
  summary: string;
  points: string[];
  diagram: "geny" | "wingz" | "aiops";
  link?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    id: "geny",
    name: "Geny / OneOS",
    kind: "AI HR assistant · web chat & Slack",
    period: "Feb – Jun 2026",
    status: "Internal production",
    stack: ["Python", "Flask", "Gemini", "MongoDB", "Slack API", "AWS SES · S3"],
    summary:
      "Employees apply for leave, raise tickets and manage teams, salary structures, HR letters and inventory by talking to it. I owned the backend and agent layer.",
    points: [
      "Function-calling intent engine on a declarative registry: each of 14 HR actions is defined once — schema, API mapping, auto-filled fields, confirmation — so new actions ship without code.",
      "Zero-knowledge salaries: admins hold non-extractable RSA-2048 keys in the browser; every response is sealed with a fresh AES-256-GCM key. The server never holds a decryption key.",
      "Slack approvals inside the 3-second window, bulk salary-slip PDFs via SES, and 130+ pytest tests. Migrated the LLM backend from Claude to Gemini.",
    ],
    diagram: "geny",
  },
  {
    id: "wingz",
    name: "Wingz",
    kind: "Private-aviation charter platform",
    period: "Apr – Sep 2026",
    status: "Client platform",
    stack: ["Node.js", "Express", "Next.js", "PostgreSQL", "Claude", "Twilio", "ElevenLabs", "WebSockets"],
    summary:
      "AI agents, a CRM and revenue tooling for a charter business — plus auth and empty-leg seat bidding in its Kotlin Multiplatform app.",
    points: [
      "Claude tool-use concierge with separate anonymous and signed-in toolsets, and a WhatsApp booking agent behind a Twilio / Meta provider adapter.",
      "When the LLM is down, errors become customer-safe messages, a deterministic booking flow still captures the lead, and staff see the reason in the CRM.",
      "Jarvis voice assistant: a WebSocket proxy streaming ElevenLabs speech-to-text, low-latency TTS and barge-in, with keys kept server-side. JWT refresh rotation with reuse detection.",
    ],
    diagram: "wingz",
  },
  {
    id: "aiops",
    name: "AIOps Self-Healing Agent",
    kind: "Incident detection → fix pull requests",
    period: "Feb – Mar 2026",
    status: "Demo · SDK on PyPI",
    stack: ["Python", "Flask", "Claude / Gemini", "MongoDB", "Slack API", "GitHub API"],
    summary:
      "Captures failures from a running service, decides what matters, and proposes a tested fix as a pull request — with a human approving every change. Built v1 solo.",
    points: [
      "aiops-sdk captures unhandled exceptions, 4xx/5xx responses and ERROR logs, and sends a heartbeat every 30 seconds.",
      "Rule-based P0–P3 severity, SHA-256 fingerprint de-duplication, and an orchestrator driving auditor, fixer and reporter agents, gated by Slack approve / reject.",
      "A client-side code probe with no LLM or secrets locates the failing route, returns sanitized context, and runs candidate fixes against the service's own tests with rollback. It opened working PRs in a live demo.",
    ],
    diagram: "aiops",
    link: { href: "https://pypi.org/project/aiops-sdk/", label: "aiops-sdk on PyPI" },
  },
];

export const moreWork = [
  {
    name: "1GEN Impact Cloud",
    status: "Production",
    period: "May – Dec 2025",
    body: "Backend APIs across an NGO product suite — campaign SMS/email stats, sprint and ticket analytics, crowdfunding — plus Reciprocity matching on Gemini embeddings. Also Silver Talkies and TalentHub (built in one week).",
    stack: ["Flask", "MongoDB", "Gemini", "Firebase", "AWS SNS"],
  },
  {
    name: "Nano Pe",
    status: "Technical lead",
    period: "Dec 2025",
    body: "Led a small backend team on a lending app: eligibility, offers from a custom N-Score, EMI tracking and penalties. Built OTP auth and loan initiation myself.",
    stack: ["Flask", "MongoDB", "AWS SNS", "JWT"],
  },
  {
    name: "Luminous Super App",
    status: "Prototype",
    period: "Apr 2026",
    body: "Scale and security layer for Go microservices: rate limits, refresh tokens, Redis Pub/Sub chat fan-out, wallet fraud checks, Kafka events, full-text search and PgBouncer.",
    stack: ["Go", "Gin", "PostgreSQL", "Redis", "Kafka"],
  },
  {
    name: "GC Agent",
    status: "Demo",
    period: "May 2026",
    body: "Took over an AI general-contractor prototype on a deadline: Twilio signature checks, idempotent callbacks, DTMF IVR, stateful LLM intake and 20+ critical fixes verified end to end.",
    stack: ["Flask", "Claude", "Twilio Voice", "MongoDB"],
  },
];

/* ------------------------------------------------------------------ */
/* Questions a visitor might have                                      */
/* ------------------------------------------------------------------ */

export const faq = [
  {
    q: "What do you actually do best?",
    a: "Put AI agents inside real products and make them dependable. I own the whole path — database schema, APIs, the interface, CI/CD and AWS — so the agent isn’t a demo bolted on the side; it’s part of a system that takes payments and serves real users.",
  },
  {
    q: "Can you work with a US team?",
    a: "I already do. I’m the lead engineer on Mind Circuit, a US K-12 platform in production, working with the client under an MOU — shipping across six repositories from India.",
  },
  {
    q: "How do you keep AI reliable in production?",
    a: "Assume it will fail and design for that. Provider fallback between Claude and Gemini, deterministic flows that still capture the lead when the model is down, human takeover in a live inbox, and tests around the parts that touch money — 130+ pytest on Geny, about 30 Jest suites on Mind Circuit.",
  },
  {
    q: "Are you only an “AI person”?",
    a: "No. Most of my work is the platform around the AI: Square payments and licensing, multi-tenant admin, SSO, Redis caching, Go microservices, WebSocket voice, and release pipelines that cut Next.js build memory by 61%.",
  },
  {
    q: "Can I see your code?",
    a: "Client codebases are private, so I show architecture instead and am happy to walk through any of it on a call. aiops-sdk, the client for my self-healing incident agent, is public on PyPI.",
  },
  {
    q: "What’s your background?",
    a: "B.Tech in Computer Science (2025, CGPA 8.7) after a diploma in CS. I started in data analysis, joined 1GEN as a data scientist in January 2025, and moved into backend, agents and deployment — eight products since.",
  },
];

/* ------------------------------------------------------------------ */
/* Journey                                                             */
/* ------------------------------------------------------------------ */

export const journey = [
  { when: "2022", title: "Diploma, Computer Science", where: "Govt. Polytechnic College, Khunimajra · CGPA 8.2" },
  { when: "2024", title: "Data analyst internships", where: "Mentorness · Candiclie Consultancy — SQL, Power BI, Selenium" },
  { when: "Jan 2025", title: "Joined 1GEN as Data Scientist", where: "Moved into backend, agents and deployment" },
  { when: "2025", title: "B.Tech, Computer Science", where: "Quest Group of Institutions, Jhanjeri · CGPA 8.7" },
  { when: "May 2025", title: "1GEN Impact Cloud", where: "Backend APIs across an NGO product suite" },
  { when: "Dec 2025", title: "Technical lead, Nano Pe", where: "First team I led" },
  { when: "Feb 2026", title: "AIOps agent & Geny HR", where: "Agents, a published SDK, zero-knowledge crypto" },
  { when: "Apr 2026", title: "Wingz", where: "Concierge, WhatsApp and voice agents" },
  { when: "Jul 2026", title: "Lead engineer, Mind Circuit", where: "US K-12 platform, in production" },
];

export const certifications = [
  "BCG GenAI Job Simulation (Forage)",
  "Career Essentials in Generative AI (Microsoft & LinkedIn)",
];
