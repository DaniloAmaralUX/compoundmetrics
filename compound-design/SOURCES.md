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

## v0.3.0-alpha.1 — runtime independence

The v0.3 resources are self-contained. Interface Review and Motion Review were **rewritten** as Compound Design resources; they do not load, require or ship any upstream checkout at runtime, and the installed plugin clones nothing.

What remains from upstream is knowledge and the obligation that comes with it:

- **Jakub Krehel — skills** (MIT, `267330e1adfc66a718fb65fa6918c1f06d0a689e`). Informed the escalation classes, the cheapest-fix ordering and the "a check you cannot run is not verified" rule now expressed in `skills/cd-interface-review/SKILL.md`. Public name: Interface Review. The resource does not impersonate its author and implies no endorsement.
- **Emil Kowalski — skills** (MIT, `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7`). Informed the motion decision order and the delete-first remediation ordering in `skills/cd-motion-review/SKILL.md`. Public name: Motion Review. Same boundary.
- **Every / Compound Engineering** (MIT, `b36047e1b4b2123df2f3529bf04b5f2a7c5f84e4`). Informed the architecture: canonical skills with per-phase references, the configuration model and its fail-closed artifact root, the durable-learning bar, the five maintenance outcomes, report-only review with explicit apply, and pointer-first handoffs. Recorded mechanism by mechanism, with adopt/adapt/defer/reject decisions, in `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`.

The pinned upstream is still fetched, SHA-verified and gitignored for **benchmark condition B only** — comparing against direct upstream use requires having it. It is never part of the plugin and never on a runtime path.

## Product experience — design references (2026-09-09)

Two repositories by Evil Rabbit were studied for the public site, read-only, at pinned commits: `evilrabbit/main` (`c71d5bc226c0a8b9b18644c34b9b3428f9c1725f`, no license file → principles only, nothing copied) and `evilrabbit/lifeline` (`8ddbb3d3ad0ac6ec5bbe8efda1c051d93d04a63a`, MIT © 2026 Evil Rabbit → the timeline interaction model is adapted, no file copied). Observations, decisions and the attribution rule are in `compound-design/research/PRODUCT-EXPERIENCE-REFERENCES.md`. Design references validate nothing about Compound Design's effectiveness.
