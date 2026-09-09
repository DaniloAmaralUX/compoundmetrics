# Model — the Guide route

Date: 2026-09-09 · produced with `cd-model` · durable because it fixes how the whole site's content is retold as one process, and which reference shaped that retelling.

## Decision

`/guide` retells every existing content module as a single long-form guide, in the structure and register of Every's Compound Engineering guide, starting from Compound Design and written as a process an organisation adopts. It is rendered with the Comet formula (`src/app/comet/comet.module.css` and the Comet section modules), outside the site shell, so its layout matches `/comet` rather than the editorial dark site.

## Reference structure → chapter → source of truth

| Reference section (Every) | Guide chapter | Compound Design source |
| --- | --- | --- |
| The philosophy | Philosophy | `STRATEGY.md`, `README.md`, `src/content/examples.ts` (`whatCompounds`, `durabilityTest`) |
| The main loop (Plan → Work → Review → Compound) | The loop (Frame → Model → Build → Verify → Polish → Compound) | `skills/cd-*/SKILL.md` procedures, `src/content/examples.ts` (`loop`) |
| Compound, the most important step | Compound, the most important step | `skills/cd-compound/SKILL.md` |
| Three phases (human · agent · human) | Who does what | `agents/*.md`, `compound-design/AGENT-MAP.md` |
| The plugin · Where things live · Core commands | The plugin | `README.md` install, `.compound-design/config.example.yaml`, `docs/*/README.md`, registry counts via `src/content/current-state.ts` |
| (no equivalent) | Where the learning goes | `src/content/examples.ts` chain and `whatCompounds` |
| Beliefs to let go (8) · Transition challenges | Beliefs to let go (8) · Transition challenges | authored against the framework's boundaries |
| Beliefs to adopt · Core principles (8) | Beliefs to adopt · Core principles (8) | `STRATEGY.md` boundaries, `compound-design/FINDING-CONTRACT.md`, artifact rule in every skill |
| Getting started: stages 0–5 · How to level up | Getting started: stages 0–5 · How to level up | authored; each “compounding move” names a real resource |
| Three questions | Three questions | `compound-design/FINDING-CONTRACT.md` verification states |
| Best practices (Traditional vs Compound) | Best practices | `cd-interface-review`, `cd-compound-refresh`, `cd-ai-interaction-review`, `cd-handoff`, `compound-design/quality/*` |

## Rules kept

- Factual state (version, counts, level, runtime status) is read from `src/content/current-state.ts`; the guide's content module writes none of it.
- Every mechanism named is Compound Design's own. Structure and register are borrowed; prose is not.
- The claim guard and the literal-drift gate cover `src/content/guide.ts` and `src/app/guide` like any other surface.

## States

Single static page. Accordion items closed by default; chapter navigation by anchors; reduced motion disables the Comet reveal and parallax.

## Not modelled

A Portuguese edition (the site's canonical language is English; `/comet` is Portuguese because its reference is). A per-chapter route. A print stylesheet.
