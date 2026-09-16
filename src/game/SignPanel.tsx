import { useState } from "react";
import { about, experiences, profile, projects, skills } from "../data/content";
import "./SignPanel.css";

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
            aria-label="Close sign panel"
            title="Close (or press X)"
            tabIndex={signId ? 0 : -1}
          >
            <span aria-hidden="true" className="sign-panel__close-icon">✕</span>
            <kbd className="sign-panel__close-kbd">X</kbd>
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
        <p className="sign-panel__text mono">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
        <p className="sign-panel__text mono">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{" "}
          ·{" "}
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </>
    );
  }

  return null;
}
