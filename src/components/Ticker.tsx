import { tickerFacts } from "../data/content";
import "./Ticker.css";

export default function Ticker() {
  const items = [...tickerFacts, ...tickerFacts]; // duplicate for seamless loop

  return (
    <div className="ticker" role="marquee" aria-label="Highlights">
      <div className="ticker__track">
        {items.map((fact, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__dot" aria-hidden="true" />
            {fact}
          </span>
        ))}
      </div>
    </div>
  );
}
