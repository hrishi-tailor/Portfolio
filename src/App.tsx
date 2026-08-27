import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import TextPortfolio from "./text/TextPortfolio";

// Lazy-load the game (and Three.js with it) so the text fallback route
// never has to download the 3D engine just to render fast, scannable content.
const GameView = lazy(() => import("./game/GameView"));

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<GameLoading />}>
            <GameView />
          </Suspense>
        }
      />
      <Route path="/text" element={<TextPortfolio />} />
      <Route path="*" element={<TextPortfolio />} />
    </Routes>
  );
}

function GameLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#8fd3f4",
        color: "#0a0d0b",
        fontFamily: "var(--font-mono)",
        fontSize: "0.9rem",
      }}
    >
      Loading course…
    </div>
  );
}
