# O Que Sobrevive

The Compound process as a research + documentation page, in PT-BR, for readers with little time: two layered timelines (the six project stages, then the eleven captured milestones of the design benchmark), the key metrics with their caveats, the executed and never-executed validations as "can say / cannot say", the compounds-vs-does-not filter, a deep dive, a glossary with tooltips, and three reading depths.

Isolated from the site runtime, like `case-study/video/`. The root `typecheck` and `lint` exclude this directory.

## Run

```bash
npm ci
npm run dev       # local preview
npm run build     # tsc --noEmit, vite build, then dist/artifact.html for the Artifact host
```

## Where it is published

- Vercel project `lifeliferesearch`, linked to this repository with this directory as root; production deploys from `main`, previews from every other branch (`vercel.json`).

## What is reused verbatim

`src/components/lifeline/*`, `src/components/lifeline-shell.tsx`, `src/components/theme-switcher.tsx`, `src/components/copy-command.tsx`, `src/lib/lifeline-data.ts`, `src/lib/utils.ts` and `src/globals.css` are the upstream files of [evilrabbit/lifeline](https://github.com/evilrabbit/lifeline) at `8ddbb3d` (MIT, see `LICENSE.lifeline`). Two adaptations, outside those files: `next/image` is aliased to `src/shims/next-image.tsx`, and the two column headers ("Age" / "Years") are relabelled in the DOM after render by `useRailLabels` in `src/App.tsx`. `next-themes` is the real package. The favicon (`public/icon.svg`, `icon.png`, `apple-icon.png`) is Evil Rabbit's own from the same repository. The page commits to the site's dark ground and carries no link that leaves it. The favicon (`public/icon.svg`, `icon.png`, `apple-icon.png`) is Evil Rabbit's own from the same repository. The page commits to the site's dark ground and carries no link that leaves it. The one edit inside a copied file is a commented-out `@import "shadcn/tailwind.css"` in `globals.css`, whose base layer that file already restates.

## Data

- `src/data/fases.ts` — the six stages at three depths, quoted from `src/content/project.ts` and the release records.
- `src/data/marcos.ts` — the eleven milestones on a day axis (day 0 = 2026-07-13), from `case-study/design-benchmark/SUMMARY.json` and `case-study/history/CHRONOLOGY.md`. Scores are never shown without coverage.
- `public/captures/V01..V11.webp` — the archive's `ENTRY-desktop-first-screen.png` frames, resized to 1200px.

No claim on the page exceeds what the repository has checked: everything is E1, runtime uplift is not measured.
