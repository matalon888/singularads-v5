# singularads-v5 — "Solid Light"

A rebuild of singularads.com generated from a single canonical prompt:
[`PROMPT.md`](./PROMPT.md). Copy is verbatim from the live site; everything
visual is new.

- **Background** pure white, everywhere. No dark sections.
- **Type** Bricolage Grotesque + Instrument Sans + JetBrains Mono (Geist and
  Instrument Serif are retired). One *dimensional word* per heading — extruded
  glyph stack with a gradient face that skews toward the pointer.
- **Logo** "The Singular Core" — an isometric cube with three exploded faces
  that converge onto an ink core.
- **3D, three layers deep**
  1. Real WebGL (react-three-fiber): ~150 rounded impression blocks that
     converge into a single core as you scroll; a second, calmer field closes
     the page.
  2. CSS 3D: every card tilts toward the pointer in a perspective context.
  3. 24 isometric extruded-solid illustrations, each looping its own animation.

```sh
npm install
npm run dev
npm run build && npx vite preview --port 4188   # then: npm run qa
```

`scripts/qa.mjs` drives Puppeteer across three viewports and checks console
errors, horizontal overflow, invisible copy, font loading and live WebGL
contexts, writing screenshots to `./qa`.

Live: <https://matalon888.github.io/singularads-v5/>
