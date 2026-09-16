import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Scene, { SIGNS } from "./Scene";
import { useKeyboard } from "./useKeyboard";
import TouchControls from "./TouchControls";
import SignPanel from "./SignPanel";
import NavToggle from "../components/NavToggle";
import "./GameView.css";

export default function GameView() {
  const keys = useKeyboard();
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const visited = useRef<Set<string>>(new Set());

  const handleActiveSign = useCallback((id: string | null) => {
    setActiveSign(id);
    if (id) {
      setShowHint(false);
      if (!visited.current.has(id)) {
        visited.current.add(id);
        setVisitedCount(visited.current.size);
      }
    }
  }, []);

  useEffect(() => {
    const dismiss = () => setShowHint(false);
    window.addEventListener("keydown", dismiss, { once: true });
    return () => window.removeEventListener("keydown", dismiss);
  }, []);

  return (
    <div className="game-view">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 1.5]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
        }}
      >
        <Suspense fallback={null}>
          <Scene keys={keys} onActiveSign={handleActiveSign} />
        </Suspense>
      </Canvas>

      <NavToggle mode="game" />

      <div className="game-hud-top">
        <span className="mono game-hud__progress">
          {visitedCount}/{SIGNS.length} explored
        </span>
      </div>

      {showHint && (
        <div className="game-hint mono" role="status">
          Drive with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> - visit the signs
        </div>
      )}

      <TouchControls state={keys} />
      <SignPanel signId={activeSign} />
    </div>
  );
}
