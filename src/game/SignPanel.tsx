import { about, profile, projects, skills } from "../data/content";
import "./SignPanel.css";

export default function SignPanel({ signId }: { signId: string | null }) {
  return (
    <div className={`sign-panel ${signId ? "sign-panel--open" : ""}`}>
      {signId && <PanelBody signId={signId} />}
    </div>
  );
}

function PanelBody({ signId }: { signId: string }) {
  if (signId === "about") {
    return (
      <div>
        <p className="eyebrow">{about.heading}</p>
        <h2>{profile.name}</h2>
        <p className="sign-panel__role mono">{profile.role}</p>
        {about.body.map((p, i) => (
          <p className="sign-panel__text" key={i}>
            {p}
          </p>
        ))}
      </div>
    );
  }

  const project = projects.find((p) => p.id === signId);
  if (project) {
    return (
      <div>
        <p className="eyebrow">
          {project.ticker} · {project.status}
        </p>
        <h2>{project.name}</h2>
        <p className="sign-panel__text">{project.pitch}</p>
        <ul className="sign-panel__highlights">
          {project.highlights.slice(0, 3).map((h, i) => (
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
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            View repository →
          </a>
        )}
      </div>
    );
  }

  if (signId === "skills") {
    return (
      <div>
        <p className="eyebrow">Skills</p>
        <h2>Watchlist</h2>
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
      </div>
    );
  }

  if (signId === "contact") {
    return (
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Let's talk</h2>
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
      </div>
    );
  }

  return null;
}
