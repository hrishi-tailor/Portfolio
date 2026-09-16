// Single source of truth for portfolio content.
// Both the golf-cart game (signs) and the text portfolio read from here.

export const profile = {
  name: "Hrishi Tailor",
  role: "BMath Honours Mathematics @ University of Waterloo (2025 - 2030)",
  tagline: "Honours Mathematics student building full-stack platforms and software systems.",
  location: "Waterloo, ON",
  status: "OPEN TO SWE INTERNSHIPS - 2026",
  email: "tailorhrishi@gmail.com",
  linkedin: "https://www.linkedin.com/in/hrishitailor/",
  github: "https://github.com/hrishi-tailor",
};

export const about = {
  heading: "About",
  body: [
    "I am a BMath Honours Mathematics student at the University of Waterloo (2025 - 2030), passionate about full-stack software engineering and backend systems.",
    "I enjoy architecting end-to-end applications with robust data models, clean REST APIs, and responsive interfaces.",
    "Currently looking for software engineering internship opportunities to contribute and build impactful software.",
  ],
};

export type ProjectStat = { label: string; value: string };

export type Project = {
  id: string;
  ticker: string; // short trading-style symbol, e.g. TLR-CARDS
  status: "LIVE" | "FILLED" | "IN PROGRESS";
  name: string;
  pitch: string;
  stack: string[];
  stats: ProjectStat[];
  highlights: string[];
  repo?: string;
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "tailor-cards",
    ticker: "TLR-CARDS",
    status: "LIVE",
    name: "Tailor Cards",
    pitch:
      "Full-Stack E-Commerce Platform built with Spring Boot, PostgreSQL, and React. Deployed with custom domain at tailorcards.com via Render + Vercel.",
    stack: [
      "Spring Boot",
      "React",
      "PostgreSQL",
      "JPA/Hibernate",
      "REST APIs",
      "Render",
      "Vercel",
    ],
    stats: [
      { label: "Backend", value: "Spring Boot + REST" },
      { label: "Database", value: "PostgreSQL + JPA" },
      { label: "Live Domain", value: "tailorcards.com" },
      { label: "Hosting", value: "Render + Vercel" },
    ],
    highlights: [
      "Architected a full-stack e-commerce web platform integrating a Spring Boot REST API backend with a responsive React frontend.",
      "Designed and managed a relational database schema using PostgreSQL and JPA/Hibernate for persistent data storage.",
      "Engineered secure, transactional RESTful endpoints handling product catalog management, search, and checkout workflows.",
      "Configured continuous deployment and DNS routing with custom domain tailorcards.com across Render and Vercel hosting environments.",
    ],
    repo: "https://github.com/hrishi-tailor/tailor-cards",
    live: "https://tailorcards.com",
    featured: true,
  },
];

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    id: "exp-founder",
    role: "Founder",
    company: "Tailor Cards",
    period: "Sep 2024 - Present",
    summary: "Scaled trading card business to $11,000+ revenue across 123 transactions.",
    highlights: [
      "Founded and operated an online trading card enterprise, generating over $11,000 in gross revenue across 123 completed transactions.",
      "Managed end-to-end e-commerce operations, product sourcing, market pricing analysis, and customer fulfillment.",
      "Leveraged customer transaction insights and inventory data to drive repeatable sales growth.",
    ],
    stack: ["E-Commerce", "Operations", "Market Analytics"],
  },
  {
    id: "exp-boswin",
    role: "Coding Instructor",
    company: "Boswin Robotics",
    period: "June 2026 - September 2026",
    summary: "Designed Python/Java curriculum for 200+ students.",
    highlights: [
      "Designed and delivered programming curriculum covering Python, Java, and algorithmic fundamentals for 200+ students.",
      "Instructed students in object-oriented programming concepts, problem solving, and practical robotics applications.",
      "Mentored students through interactive coding exercises, debugging sessions, and collaborative technology projects.",
    ],
    stack: ["Python", "Java", "Robotics", "Curriculum Design"],
  },
  {
    id: "exp-tutoring",
    role: "Advanced Math/Science Tutor",
    company: "Independent Practice",
    period: "September 2022 - June 2025",
    summary: "Grew practice to 12 recurring students.",
    highlights: [
      "Established an independent STEM tutoring practice, scaling to 12 recurring students with individualized lesson plans.",
      "Taught advanced high school mathematics and sciences, developing structured problem-solving frameworks.",
      "Improved student academic performance and exam outcomes through personalized concept reinforcement.",
    ],
    stack: ["Advanced Mathematics", "STEM Pedagogy", "Mentorship"],
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Java", "JavaScript", "Python", "Swift", "HTML/CSS"],
  },
  {
    category: "Frameworks & Backend",
    items: ["Spring Boot", "React", "JPA/Hibernate", "REST APIs"],
  },
  {
    category: "Databases & Tools",
    items: ["PostgreSQL", "Git", "Xcode", "Render", "Vercel"],
  },
];

export const tickerFacts = [
  "HRISHI TAILOR - UW MATH (2025 - 2030)",
  "TAILOR CARDS: LIVE AT TAILORCARDS.COM",
  "FOUNDER: $11,000+ REVENUE ACROSS 123 SALES",
  "BOSWIN ROBOTICS: 200+ STUDENTS",
  "OPEN TO SWE INTERNSHIPS",
];
