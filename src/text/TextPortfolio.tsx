import { profile, about, projects, skills } from "../data/content";
import Ticker from "../components/Ticker";
import NavToggle from "../components/NavToggle";
import "./TextPortfolio.css";

export default function TextPortfolio() {
  return (
    <div className="page">
      <Ticker />
      <NavToggle mode="text" />

      <main className="wrap">
        {/* Hero */}
        <section className="hero">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {profile.status}
          </p>
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__role mono">{profile.role}</p>
          <p className="hero__tagline">
            <span className="prompt">&gt;</span> {profile.tagline}
            <span className="cursor" aria-hidden="true" />
          </p>
        </section>

        {/* About */}
        <Section command="cat about.md" title="About">
          {about.body.map((p, i) => (
            <p key={i} className="body-text">
              {p}
            </p>
          ))}
        </Section>

        {/* Projects */}
        <Section command="ps --projects" title="Projects">
          <div className="tickets">
            {projects.map((project) => (
              <article className="ticket" key={project.id}>
                <header className="ticket__header">
                  <span className="ticket__symbol mono">{project.ticker}</span>
                  <span
                    className={`ticket__status ticket__status--${project.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {project.status}
                  </span>
                </header>

                <h3 className="ticket__name">{project.name}</h3>
                <p className="ticket__pitch">{project.pitch}</p>

                <ul className="ticket__stats">
                  {project.stats.map((stat) => (
                    <li key={stat.label}>
                      <span className="ticket__stat-label mono">{stat.label}</span>
                      <span className="ticket__stat-value">{stat.value}</span>
                    </li>
                  ))}
                </ul>

                <ul className="ticket__highlights">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="ticket__stack">
                  {project.stack.map((s) => (
                    <span className="pill" key={s}>
                      {s}
                    </span>
                  ))}
                </div>

                {project.repo && (
                  <a
                    className="ticket__link"
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View repository →
                  </a>
                )}
              </article>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section command="watchlist --show" title="Skills">
          <div className="watchlist">
            {skills.map((group) => (
              <div className="watchlist__group" key={group.category}>
                <p className="eyebrow">{group.category}</p>
                <div className="watchlist__items">
                  {group.items.map((item) => (
                    <span className="pill pill--outline" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section command="contact --show" title="Contact">
          <div className="console">
            <p>
              <span className="console__flag">--email</span>{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>
              <span className="console__flag">--linkedin</span>{" "}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedin.replace("https://", "")}
              </a>
            </p>
            <p>
              <span className="console__flag">--github</span>{" "}
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.github.replace("https://", "")}
              </a>
            </p>
            <p>
              <span className="console__flag">--location</span> {profile.location}
            </p>
          </div>
        </Section>

        <footer className="footer">
          <a href="/">⛳ Prefer to drive around? Try the golf cart version.</a>
        </footer>
      </main>
    </div>
  );
}

function Section({
  command,
  title,
  children,
}: {
  command: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section" aria-labelledby={`section-${title}`}>
      <p className="eyebrow section__command">
        <span className="prompt">$</span> {command}
      </p>
      <h2 className="section__title" id={`section-${title}`}>
        {title}
      </h2>
      <div className="section__body">{children}</div>
    </section>
  );
}
