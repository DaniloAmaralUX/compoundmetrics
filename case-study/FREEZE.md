# P0 — Freeze

Frozen: 2026-09-09 · branch `claude/compound-design-case-study` · base `921d751aff5df8e14d998f993e2d171db842719d` (product-experience preview head, itself on top of `main` = `a7f8319859263924a90d2f293be5cfd3c1c9cbab`).

## Evidence boundary (unchanged by this work)

| | |
| --- | --- |
| Release | v0.3.0-alpha.1 — candidate |
| Stable evidence baseline | v0.2.1 |
| Maximum CEL | E1 |
| E2 runtime | NOT EXECUTED |
| Runtime uplift | NOT MEASURED |
| Paid experimental runtime | 0 — and this work adds 0 |

Nothing below raises any of these. A design score against a frozen rubric is not runtime evidence and never becomes CEL.

## Current sites at freeze time

| Surface | Resolves to | Commit | Date (UTC) |
| --- | --- | --- | --- |
| https://compoundmetrics.vercel.app/ | project `compoundmetrics`, `dpl_6Av1MuU5xvbQAnS6uBkWVvKcUoA9` | `a7f8319` (compoundmetrics `main`) | 2026-09-09 12:18 |
| https://cdguide-seven.vercel.app/ | project `cd.guide`, `dpl_rJaafo9dBEAnsqyFvLQtKBFTHxHP` — a second project importing the same repo | `a7f8319` (same code as above) | 2026-09-09 12:31 |
| https://studio-dev-ui.vercel.app/ | project `studio-dev-ui`, `dpl_9DGd7MszCu9hF3ykiBspfM6DkyGW` | `231889f` (studio-dev-ui `main`) | 2026-09-09 09:14 |
| https://studio-dev-nejva0nnb-danilos-projects-94eff717.vercel.app/ | **the same deployment** `dpl_9DGd7MszCu9hF3ykiBspfM6DkyGW` | `231889f` | 2026-09-09 09:14 |
| https://compoundmetrics-git-claude-com-014611-…vercel.app/ | project `compoundmetrics`, preview `dpl_4qtC9oEDZ44USUgxByVBXB7Xf399` | `921d751` | 2026-09-09 13:33 |
| https://compound-labs-design.vercel.app/audit | project `compound-labs-design`, production `dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ` | `364430b` (v3.6.0) | 2026-07-16 20:24 |

Two of the four URLs the brief named are duplicates of another (same deployment, or same commit in a second project). They count once.

## Current audit

`DaniloAmaralUX/compound-labs-design` @ `364430b9d553c6b9f87e4ff3cbc0f31eaa5d1a33` — `audit.html` carries **54** `[data-audit-check]` items in **9** `data-cat` groups (read from source, not from the commit message). Version marker `v3.6.0`. Frozen copy and hash in `design-benchmark/rubric/`.

## Environment constraints recorded honestly

- This sandbox's egress proxy blocks every `*.vercel.app` host and `context7.com` for direct HTTP and for headless browsers. Historical surfaces are therefore captured by **building the exact deployed commit locally** and rendering it with Playwright — which ties every screenshot to a commit rather than to a URL — or, where a repository is not reachable, recorded as NOT CAPTURED with the reason.
- Context7 is unreachable; Remotion APIs are verified against `remotion-dev/skills` cloned at a pinned commit and against the installed package's type definitions (see `research/CONTEXT7-SOURCES.md`).
- No model runtime, no subagents, no paid calls. Judgment checks are performed in-session on anonymised screenshots.
