import { useEffect, useRef } from "react";

export type KeyState = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

const FORWARD_KEYS = ["KeyW", "ArrowUp"];
const BACK_KEYS = ["KeyS", "ArrowDown"];
const LEFT_KEYS = ["KeyA", "ArrowLeft"];
const RIGHT_KEYS = ["KeyD", "ArrowRight"];

/** Tracks live WASD / arrow key state in a ref (no re-renders per keystroke). */
export function useKeyboard() {
  const state = useRef<KeyState>({
    forward: false,
    back: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => setKey(e.code, true);
    const up = (e: KeyboardEvent) => setKey(e.code, false);

    function setKey(code: string, value: boolean) {
      if (FORWARD_KEYS.includes(code)) state.current.forward = value;
      if (BACK_KEYS.includes(code)) state.current.back = value;
      if (LEFT_KEYS.includes(code)) state.current.left = value;
      if (RIGHT_KEYS.includes(code)) state.current.right = value;
    }

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return state;
}
