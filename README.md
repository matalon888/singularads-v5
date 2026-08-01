# singularads-v5 — "Solid Light"

A rebuild of singularads.com as a **single continuous 3D world you travel through**,
generated from one canonical spec: [`PROMPT.md`](./PROMPT.md).

Scroll does not move a page — it moves a camera along a spline through twelve built
sets, from an infinite white void, down under "the fold" into the graveyard of unseen
impressions, along the publisher's waterfall, around the exchange, through the stack,
over the attention field, and finally to the singular point. Copy rides above the world
on frosted plates. Copy is verbatim from the live site.

## The stack

React 19 · TypeScript · Vite · Tailwind v4 · Motion · react-three-fiber/drei · Lenis.
Fonts vendored via Fontsource — no external requests at runtime.

- `src/world/journey.ts` — the camera spline, chapter anchors, pacing
- `src/world/store.ts` — scroll → curve mapping, measured off `[data-chapter]` anchors
- `src/world/scenes.tsx` — the twelve sets
- `src/world/World.tsx` — canvas, fog, lights, camera rig, cursor light
- `src/journey/content.tsx` — the beats and panels
- `src/components/Iso.tsx` — 24 isometric extruded-solid illustrations

## Develop

```sh
npm install
npm run dev
```

## QA

Nothing ships without both passing.

```sh
npm run build
npx vite preview --port 4188 &
node scripts/qa.mjs        # 3 viewports: console errors, overflow, fonts, hidden copy
node scripts/journey.mjs   # travels all 12 chapters, asserts each set is on screen
```

`journey.mjs` samples the composited page screenshot rather than reading back the WebGL
canvas — a canvas without `preserveDrawingBuffer` reads back blank and every chapter
will look empty.

Live: <https://matalon888.github.io/singularads-v5/>
