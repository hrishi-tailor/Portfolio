# hrishitailor.com

A two-mode portfolio:

- **`/`** - a low-poly golf course you drive around (WASD, or on-screen controls on mobile). Signs mark About, Skills, Projects, and Experience - drive up to one and its content slides up from the bottom.
- **`/text`** - a fast, text-only dashboard with the same content, styled like a trading terminal. Always reachable via the "Skip to text version" link in the top-right corner of the game, and it loads instantly since the 3D engine is code-split away from that route.

Both views read from a single content file, so there's one place to update your bio, projects, and skills.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  data/content.ts        <- edit this to update About / Projects / Skills / Contact
  components/             Ticker, NavToggle - shared UI
  text/                   TextPortfolio.tsx - the fast fallback view
  game/                   GameView, Scene, Cart, Sign, Trail, Course, CameraRig
```

## Editing content

Everything under **About**, **Projects**, **Skills**, and **Contact** lives in
`src/data/content.ts`. Add a new project there and it automatically:

1. Gets its own sign in the game (add a `SignData` entry in `src/game/Scene.tsx`
   with a `position` along the course), and
2. Appears as a new ticket card on `/text`.

## Deploying

This is a static Vite build - `npm run build` produces a `dist/` folder you can
deploy on Vercel, Netlify, GitHub Pages, or Cloudflare Pages. Point
`hrishitailor.com`'s DNS at whichever host you pick and set the build command
to `npm run build` with output directory `dist`.

## Notes / next steps

- Swap the placeholder email in `src/data/content.ts` for your real one.
- The "This Portfolio" project entry in `content.ts` is a placeholder - update
  its `repo` link once this code is pushed to GitHub.
- Sounds, a minimap, or a "par" progress counter (mentioned in early design
  discussion) would be natural follow-ups but weren't built yet - the HUD
  already tracks `visitedCount` in `GameView.tsx` if you want to extend it.
