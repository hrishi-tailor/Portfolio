# AGENT.md — hrishitailor.com portfolio

## Project overview
A two-mode personal portfolio site for a CS student (Waterloo) applying to SWE
internships:

- **`/`** — a low-poly, Crossy-Road-style golf cart driving game (React Three
  Fiber). The player drives around an infinite procedural golf course; signs
  planted around the course reveal portfolio content when approached.
- **`/text`** — a fast, text-only fallback dashboard styled like a trading
  terminal (a nod to the flagship Kafka matching-engine project). Reachable
  via a persistent "Skip to text version" link on the game screen. This
  route is code-split from the game so it never downloads Three.js.

Both views read from **one content file** (`src/data/content.ts`) so bio,
projects, skills, and experience never drift out of sync between the two
views.

## Stack
- Vite + React + TypeScript
- react-router-dom (routes: `/`, `/text`, catch-all → `/text`)
- three, @react-three/fiber, @react-three/drei
- No Tailwind — hand-written CSS per component, using CSS custom properties
  defined in `src/index.css`

## Design system
Trading-terminal aesthetic (grounded in the matching-engine project), applied
to the **text portfolio and all HUD/overlay chrome** — not the 3D game world,
which has its own golf-course palette.

- Colors: `--bg #0a0d0b`, `--bg-panel #101512`, `--amber #ffb000` (primary
  accent), `--green #3ddc84`, `--red #ff5c5c`, text tones `--text` /
  `--text-dim` / `--text-faint`. Defined in `src/index.css`.
- Fonts: IBM Plex Mono (headers, data, labels) + Inter (body). Loaded via
  Google Fonts `<link>` in `index.html`.
- Motifs: scrolling ticker tape, `$ command` style section headers, blinking
  CLI cursor (`.cursor` class, respects `prefers-reduced-motion`), project
  cards styled as trading "tickets" with a status badge (LIVE / IN PROGRESS).

**3D game aesthetic rule: smooth blocky primitives only — no cones, no plain
sharp-edged boxes.** Use `@react-three/drei`'s `RoundedBox` for all geometry
that reads as a "block" (trees, cart panels, signs, person). Curved
primitives (cylinder, torus) are only acceptable for genuinely round
accessories (wheel axles, flagpoles) — evaluate case by case against the
Crossy Road reference look.

## File structure

    src/
      data/content.ts        Single source of truth: profile, about, projects,
                              skills, (experience — not yet added), tickerFacts
      index.css               Global tokens + base styles
      App.tsx                 Router; lazy-loads GameView so /text stays light
      components/
        Ticker.tsx / .css      Scrolling ticker tape
        NavToggle.tsx / .css   Game <-> text switch link
      text/
        TextPortfolio.tsx/.css The fallback dashboard
      game/
        GameView.tsx / .css    Canvas host, HUD, hint text, mounts Scene
        Scene.tsx              Lighting, sign placement (SIGNS array), proximity
                                detection, mounts Cart/Course/Trail/CameraRig
        Cart.tsx                Golf cart mesh + WASD driving physics
        Course.tsx               Infinite tiling ground + decoration rendering
        terrain.ts               Shared tile/obstacle generation — imported by
                                  BOTH Course.tsx (rendering) and (pending)
                                  Cart.tsx (collision), so obstacles are
                                  identical in both places. Deterministic hash
                                  per tile coordinate, not random per frame.
        Sign.tsx                 Sign mesh + billboard label
        SignPanel.tsx / .css     Content overlay when near a sign
        Trail.tsx                Fading trail behind the cart
        CameraRig.tsx            Fixed-angle orthographic birds-eye camera
                                  (offset never rotates with the cart — this is
                                  what gives the constant Crossy-Road angle)
        TouchControls.tsx/.css   On-screen WASD for touch devices
        useKeyboard.ts           WASD/arrow key state in a ref (no re-renders)

## Conventions
- **Camera**: `OrthographicCamera` in `CameraRig.tsx`, `makeDefault`, fixed
  world-space offset `(11, 16, 11)` from the cart — do not make it rotate
  with cart heading, that would break the Crossy Road look.
- **Ground**: `Course.tsx` renders a grid of `TILE_SIZE=24` tiles re-centered
  on the cart's tile coordinate each frame it changes (not every frame) —
  keep it that way for performance. Obstacle placement is a pure function of
  `(tx, tz)` via `hash()` in `terrain.ts`, so the same tile always looks the
  same when revisited.
- **Signs**: positions are hardcoded in the `SIGNS` array in `Scene.tsx`, one
  entry per content section. Adding a new content section (e.g. Experience)
  means: add data to `content.ts` → add a `SignData` entry in `Scene.tsx` →
  add a case in `SignPanel.tsx` → add a section in `TextPortfolio.tsx`.
- **Movement**: cart physics (accel/friction/turn) live entirely in
  `Cart.tsx`'s `useFrame`. Keep collision, braking, etc. in that same loop
  rather than spreading physics logic across components.

## Status: what's implemented
- [x] Routing + code-split `/text` fallback
- [x] Text portfolio (terminal dashboard) — About / Projects / Skills / Contact
- [x] Game: WASD driving, third-person-turned-birds-eye camera, infinite
      tiling ground, varied trees (treeA/B/C), bushes, lakes, bunkers,
      decorative pin flags, signs with proximity-triggered content panel
- [x] `terrain.ts` shared module with `nearbyObstacles()` helper ready for
      collision, but **not yet wired into `Cart.tsx`**

## Status: NOT yet implemented (active backlog, most recent request)
These were requested but not built before this handoff — build in roughly
this order since some depend on each other (person + steering wheel need the
cart redesign first; collision needs `terrain.ts`, which already exists):

1. **Cart redesign** — replace remaining plain-box panels with `RoundedBox`
   throughout; general visual pass so it looks intentional, not just blocky
   by default.
2. **Wheels**: replace cylinder wheels with flattened `RoundedBox` wheels
   that visibly spin (rotate around local axle axis) proportional to
   `speed.current` each frame.
3. **Person in the cart**: simple Minecraft-style blocky figure (no face),
   golf hat, polo shirt, jeans, sitting inside the cart, parented to the cart
   group so it naturally turns with it. Add a small extra lean/turn on the
   torso proportional to steering input for a bit of life.
4. **Steering wheel**: small low-poly wheel/ring held by the person's hands
   that visibly rotates with left/right input (spring back toward 0 when not
   turning).
5. **Golf bag**: simple bag + a few thin club rods in the back of the cart,
   same blocky aesthetic.
6. **Blocky tire trail**: replace `Trail.tsx`'s circular fading dots with
   small dark-green `RoundedBox` blocks, emitted from each rear wheel's
   world position (not the cart's center) — two parallel trails.
7. **Default forward direction**: fix the cart's spawn rotation. Currently
   `rotation.y = 0`, which — given `forward = (sin(rotY), 0, cos(rotY))` —
   actually drives the cart *away* from the sign path (signs sit at negative
   z). Spawn rotation should be `Math.PI` so pressing W drives toward the
   signs immediately, both on first load and whenever `GameView` remounts
   (e.g. navigating back from `/text`).
8. **Brake behavior**: in `Cart.tsx`'s `useFrame`, holding `forward` and
   `back` simultaneously currently just triggers the forward branch (it's an
   `if / else if` chain). Add an explicit check: both held → rapidly damp
   `speed.current` toward 0 (brake), rather than falling through to either
   accel branch.
9. **Collision with trees/bushes/lakes**: use `terrain.nearbyObstacles(x, z)`
   in `Cart.tsx` each frame — compute the cart's *intended* next position,
   check distance against each obstacle's radius + a cart collision radius
   (~0.7), and if it collides, cancel the position update for that frame
   (and probably zero `speed.current` so it reads as hitting something, not
   just stopping smoothly).
10. **Signs → "flag on a hole"**: redesign `Sign.tsx` so it reads as an
    oversized golf flag/pin marking a hole, rather than a roadside board —
    bigger flag on a pole, square pennant (per the earlier "no triangular
    flags" rule), sitting in/near a small green or cup, rather than the
    current flat rectangular board.
11. **Persistent WASD indicator**: `GameView.tsx` currently shows a one-time
    hint that disappears after the first key press or sign visit. Add (or
    replace it with) a small always-available control diagram (small W/A/S/D
    key glyphs with directional arrows) in a HUD corner, not just a
    transient banner.
12. **Zone indicators**: some clear signal of where each content section
    "starts" along the course — e.g. an arch/gate with the section name
    (About / Experience / Projects / Skills / Contact) a short distance
    before its sign, and/or a ground color/stripe change per zone.
13. **Experience section** (new content + new sign + new zone):
    - Add to `content.ts`: CS/Robotics instructor at **Boswin Robotics**,
      taught Python. Keep it modest/honest in tone — it's a limited-scope
      role, don't oversell it.
    - Add a corresponding entry to `SIGNS` in `Scene.tsx` (pick a position
      along the existing path, e.g. between About and the first Project).
    - Add a case in `SignPanel.tsx`.
    - Add a `Section` block in `TextPortfolio.tsx`, in the same place in the
      reading order (About → Experience → Projects → Skills → Contact).

## Build/verify commands

    npm install
    npm run dev        # local dev server
    npx tsc -b          # typecheck — keep this clean before handing off
    npx oxlint           # lint — keep this clean too
    npm run build       # production build; watch the GameView chunk size

## Non-goals / things intentionally left out
- No localStorage/browser persistence (per project constraints) — any
  "remember last visited sign" type feature must live in React state only.
- Real email address has been swapped to tailorhrishi@gmail.com in content.ts.