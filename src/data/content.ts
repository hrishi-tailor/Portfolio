// Single source of truth for portfolio content.
// Both the golf-cart game (signs) and the text portfolio read from here.

export const profile = {
  name: "Hrishi Tailor",
  role: "CS Student @ University of Waterloo",
  tagline: "Building systems that stay correct under load.",
  location: "Waterloo, ON",
  status: "OPEN TO SWE INTERNSHIPS — 2026",
  email: "hrishi.tailor@example.com", // TODO: swap in real address
  linkedin: "https://www.linkedin.com/in/hrishi-tailor-990696224/",
  github: "https://github.com/hrishi-tailor",
};

export const about = {
  heading: "About",
  body: [
    "I'm a Computer Science student at the University of Waterloo, interested in backend systems, distributed architectures, and the kind of software where correctness under concurrency actually matters.",
    "Most of what I build starts from a question about how real infrastructure works under the hood — order books, event streams, matching logic — and turns into a project I can pull apart and rebuild myself.",
    "Right now I'm looking for a software engineering internship where I can keep building things that scale.",
  ],
};

export type ProjectStat = { label: string; value: string };

export type Project = {
  id: string;
  ticker: string; // short trading-style symbol, e.g. MATCH-ENG
  status: "LIVE" | "FILLED" | "IN PROGRESS";
  name: string;
  pitch: string;
  stack: string[];
  stats: ProjectStat[];
  highlights: string[];
  repo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "matching-engine",
    ticker: "MATCH-ENG",
    status: "LIVE",
    name: "Kafka Matching Engine",
    pitch:
      "A limit order book matching engine with price-time priority, plus a connected Kafka-backed market data pipeline with rolling stats and anomaly detection.",
    stack: ["Java", "Kafka", "Concurrency", "WebSocket"],
    stats: [
      { label: "Book structure", value: "TreeMap + LinkedHashMap" },
      { label: "Cancel", value: "O(1) by order ID" },
      { label: "Concurrency model", value: "Single-writer thread" },
    ],
    highlights: [
      "Single dedicated thread owns and mutates the order book; producer threads enqueue onto a BlockingQueue, eliminating race conditions in the matching logic entirely — the same single-writer pattern LMAX Disruptor uses.",
      "Prices stored as long (ticks), never floating point, to avoid rounding errors in trade execution.",
      "Trade execution always honors the resting order's price — the core rule of price-time priority.",
      "Market data pipeline computes rolling VWAP / moving average / volatility incrementally (O(1) per tick) and flags anomalies via z-score and spread-blowout detection.",
      "EventBus is pluggable: in-memory for local dev, real Kafka producer/consumer for production — swap one line, zero other code changes.",
    ],
    repo: "https://github.com/hrishi-tailor/matching-engine",
    featured: true,
  },
  {
    id: "portfolio",
    ticker: "PORT-SITE",
    status: "IN PROGRESS",
    name: "This Portfolio",
    pitch:
      "A two-mode portfolio: a low-poly golf-cart driving game for exploring projects, and this text dashboard for anyone who wants the facts fast.",
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber"],
    stats: [
      { label: "Game engine", value: "React Three Fiber" },
      { label: "Fallback", value: "This page" },
      { label: "Shared", value: "One content source" },
    ],
    highlights: [
      "Both views read from the same content file, so the game and the text dashboard never drift out of sync.",
      "Built the text version first as the reliable baseline, then layered the 3D scene on top as an enhancement.",
    ],
    repo: "https://github.com/hrishi-tailor/hrishi-tailor",
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  { category: "Languages", items: ["Java", "Python", "C++", "TypeScript", "Kotlin", "Swift"] },
  { category: "Systems", items: ["Kafka", "Concurrency", "Data Structures", "OOP Design"] },
  { category: "Web", items: ["React", "Node.js", "REST APIs"] },
  { category: "Tools", items: ["Git", "Docker", "VS Code", "Linux"] },
];

export const tickerFacts = [
  "CS @ WATERLOO",
  "MATCH-ENG: PRICE-TIME PRIORITY",
  "KAFKA EVENT PIPELINES",
  "OPEN TO SWE INTERNSHIPS",
  "BUILT WITH REACT + THREE.JS",
];
