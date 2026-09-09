# Upstream Sources

Compound Design intentionally builds on proven work instead of rewriting mature ideas from zero.

## Jakub Krehel — interface skills

Repository: `https://github.com/jakubkrehel/skills`

Pinned commit: `267330e1adfc66a718fb65fa6918c1f06d0a689e`

License: MIT — Copyright (c) 2026 Jakub Krehel.

Used as upstream knowledge for the internal `jakub` resource. Public presentation uses the authorial name **Interface Review**. The Compound resource adapts the source into a system-oriented Design Engineering context and does not impersonate or imply endorsement by Jakub Krehel.

## Emil Kowalski — design engineering skills

Repository: `https://github.com/emilkowalski/skills`

Pinned commit: `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7`

License: MIT — retain upstream copyright and permission notices when copying or substantially modifying source material.

Used as upstream knowledge for the internal `emi` resource. Public presentation uses the authorial name **Motion Review**. The Compound resource adapts the source to Compound Design and does not impersonate or imply endorsement by Emil Kowalski.

## Other references

Compound Design also studies and references, where relevant:

- Every / Compound Engineering — compounding workflow thesis and reusable engineering knowledge;
- Microsoft HAX — Human–AI interaction guidelines;
- Google PAIR — human-centered AI product guidance;
- Anthropic — skills/evals patterns and evidence tooling;
- OpenAI — agents, tools, guardrails, tracing and evaluation practices;
- Promptfoo — independent evaluation harness patterns;
- shadcn/ui — interface primitives and composable UI workflow.

These references validate mechanisms or provide source material. They do **not** certify, endorse or validate Compound Design as a product or methodology.

## Rule

Prefer composition over duplication:

- upstream work keeps its authorship;
- Compound Design adds routing, system context, evidence discipline, web-app specialization and reusable-learning logic;
- any copied or substantially modified upstream material must preserve applicable license and attribution requirements;
- public naming may be authorial, but internal provenance must remain explicit.

## Pin verification — 2026-09-09

`git ls-remote` (read-only) confirmed both upstream `HEAD`s equal to the pinned commits above: Jakub `267330e1…`, Emil `d23d7f88…`. No drift. The E2 harness vendors the Jakub pin into `compound-design/vendor/jakub-skills` (gitignored) via `e2 fetch-upstream`, verifies the SHA and LICENSE, and records drift without ever moving the pin.
