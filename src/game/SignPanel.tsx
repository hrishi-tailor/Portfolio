import { useState } from "react";
import { about, experiences, profile, projects, skills } from "../data/content";
import "./SignPanel.css";

function ResumeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function SignPanel({
  signId,
  onDismiss,
}: {
  signId: string | null;
  onDismiss?: () => void;
}) {
  const [prevSignId, setPrevSignId] = useState<string | null>(signId);
  const [cachedSignId, setCachedSignId] = useState<string | null>(signId);

  if (signId !== prevSignId) {
    setPrevSignId(signId);
    if (signId !== null) {
      setCachedSignId(signId);
    }
  }

  const displayId = signId || cachedSignId;

  return (
    <div className={`sign-panel ${signId ? "sign-panel--open" : ""}`} aria-hidden={!signId}>
      {displayId && (
        <div className="sign-panel__card">
          <button
            type="button"
            className="sign-panel__close-btn"
            onClick={onDismiss}
            aria-label="Close sign panel (or press X)"
            title="Close (or press X)"
            tabIndex={signId ? 0 : -1}
          >
            <span aria-hidden="true">✕</span>
          </button>
          <PanelBody signId={displayId} />
        </div>
      )}
    </div>
  );
}

function PanelBody({ signId }: { signId: string }) {
  if (signId === "about") {
    return (
      <>
        <p className="eyebrow">{about.heading}</p>
        <h2>{profile.name}</h2>
        <p className="sign-panel__role mono">{profile.role}</p>
        {about.body.map((p, i) => (
          <p className="sign-panel__text" key={i}>
            {p}
          </p>
        ))}
      </>
    );
  }

  if (signId === "skills") {
    return (
      <>
        <p className="eyebrow">Skills</p>
        <h2>Technical Arsenal</h2>
        {skills.map((group) => (
          <div key={group.category} className="sign-panel__skill-group">
            <p className="eyebrow">{group.category}</p>
            <div className="sign-panel__stack">
              {group.items.map((item) => (
                <span className="pill pill--outline" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  const project = projects.find((p) => p.id === signId);
  if (project) {
    return (
      <>
        <p className="eyebrow">
          {project.ticker} · {project.status}
        </p>
        <h2>{project.name}</h2>
        <p className="sign-panel__text">{project.pitch}</p>
        <ul className="sign-panel__highlights">
          {project.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        <div className="sign-panel__stack">
          {project.stack.map((s) => (
            <span className="pill" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              Visit tailorcards.com →
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              View repository →
            </a>
          )}
        </div>
      </>
    );
  }

  const exp = experiences.find((e) => e.id === signId);
  if (exp) {
    return (
      <>
        <p className="eyebrow">
          Experience · {exp.period}
        </p>
        <h2>{exp.role}</h2>
        <p className="sign-panel__role mono">{exp.company}</p>
        <p className="sign-panel__text">{exp.summary}</p>
        <ul className="sign-panel__highlights">
          {exp.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        <div className="sign-panel__stack">
          {exp.stack.map((s) => (
            <span className="pill" key={s}>
              {s}
            </span>
          ))}
        </div>
      </>
    );
  }


  if (signId === "contact") {
    return (
      <>
        <p className="eyebrow">Contact</p>
        <h2>Get in Touch</h2>
        <p className="sign-panel__text">
          Feel free to reach out directly via email or connect through LinkedIn and GitHub.
        </p>
        <div className="sign-panel__contact-row">
          <a
            href={`mailto:${profile.email}`}
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <MailIcon className="sign-panel__btn-icon" />
            <span>{profile.email}</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <LinkedInIcon className="sign-panel__btn-icon" />
            <span>LinkedIn</span>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <GitHubIcon className="sign-panel__btn-icon" />
            <span>GitHub</span>
          </a>
        </div>
      </>
    );
  }

  if (signId === "finale") {
    return (
      <>
        <p className="eyebrow">FINAL HOLE · 18TH GREEN</p>
        <h2>Finish Line · Let's Connect</h2>
        <div className="sign-panel__status-pill mono">
          <span className="sign-panel__status-dot"></span>
          {profile.status}
        </div>
        <p className="sign-panel__role mono">{profile.role}</p>
        <p className="sign-panel__text">
          Seeking Software Engineering internship opportunities for 2026. Passionate about building robust backend architectures, distributed systems, and full-stack web applications with Spring Boot, React, and PostgreSQL.
        </p>
        <div className="sign-panel__action-row">
          <a
            href="/Hrishi_Tailor_Resume.pdf"
            download="Hrishi_Tailor_Resume.pdf"
            className="sign-panel__action-btn sign-panel__action-btn--primary"
          >
            <ResumeIcon className="sign-panel__btn-icon" />
            <span>Download Resume (PDF)</span>
          </a>
        </div>
        <div className="sign-panel__contact-row">
          <a
            href={`mailto:${profile.email}`}
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <MailIcon className="sign-panel__btn-icon" />
            <span>{profile.email}</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <LinkedInIcon className="sign-panel__btn-icon" />
            <span>LinkedIn</span>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="sign-panel__action-btn sign-panel__action-btn--outline"
          >
            <GitHubIcon className="sign-panel__btn-icon" />
            <span>GitHub</span>
          </a>
        </div>
      </>
    );
  }

  return null;
}
