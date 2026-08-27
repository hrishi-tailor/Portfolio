import { Link } from "react-router-dom";
import "./NavToggle.css";

export default function NavToggle({ mode }: { mode: "game" | "text" }) {
  return (
    <div className="nav-toggle">
      {mode === "game" ? (
        <Link to="/text" className="nav-toggle__link">
          <span aria-hidden="true">☰</span> Skip to text version
        </Link>
      ) : (
        <Link to="/" className="nav-toggle__link">
          <span aria-hidden="true">⛳</span> Back to golf cart
        </Link>
      )}
    </div>
  );
}
