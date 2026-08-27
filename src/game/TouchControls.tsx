import type { MutableRefObject } from "react";
import type { KeyState } from "./useKeyboard";
import "./TouchControls.css";

export default function TouchControls({
  state,
}: {
  state: MutableRefObject<KeyState>;
}) {
  const bind = (key: keyof KeyState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      state.current[key] = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      state.current[key] = false;
    },
    onPointerLeave: () => {
      state.current[key] = false;
    },
  });

  return (
    <div className="touch-controls" aria-hidden="true">
      <button className="touch-controls__btn touch-controls__btn--left" {...bind("left")}>
        ◀
      </button>
      <div className="touch-controls__col">
        <button className="touch-controls__btn" {...bind("forward")}>
          ▲
        </button>
        <button className="touch-controls__btn" {...bind("back")}>
          ▼
        </button>
      </div>
      <button className="touch-controls__btn touch-controls__btn--right" {...bind("right")}>
        ▶
      </button>
    </div>
  );
}
