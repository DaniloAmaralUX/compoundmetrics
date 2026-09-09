# Model — Product Experience information architecture

Date: 2026-09-09 · produced with `cd-model` from the frame of the same date · durable because it fixes the route contract every later change to the site builds on.

## Journey

```
SEE IT → UNDERSTAND IT → NAME IT → INSPECT IT → VERIFY IT
  /         /how-it-works   /learn    /resources    /evidence
  /lab                                /project
```

Experience first, mental model second, term third, technical detail after. No route opens with a term the visitor has not been given a reason for.

## Routes

| Route | Reader outcome | Opens with | Never opens with |
| --- | --- | --- | --- |
| `/` | I understand the idea | the two canonical lines, then the transformation Project 01 → Project 02 | version, CEL, CDQI, counts |
| `/how-it-works` | I understand the mechanism | one concrete signup example changing form | an abstract framework diagram |
| `/lab` | I saw Compound happen | a real small interface to review | a definition |
| `/project` | I understand what this experiment is | "an experiment in cumulative Design Engineering" + status | marketing |
| `/resources` | I understand what capability has been encoded | grouped public names | internal ids |
| `/resources/[resource]` | I can use this one | name, one sentence, what it does | technical id |
| `/evidence` | I understand what has and hasn't been demonstrated | "Not everything that is built is proven." | a dashboard |
| `/learn` | I can explain the vocabulary | "What do you want to understand?" | an alphabetical glossary |
| `/learn/[concept]` | I can explain this term | one plain sentence, then an analogy | the technical definition |

## Navigation

Primary: Home · How it Works · Lab · Project · Resources · Evidence · Field Guide.
Internal architecture (Registry, CEL, CDQI, Ledger, Evals, Benchmarks) never appears in navigation; it is reached through content.

## Entities

| Entity | Source of truth | Consumed by |
| --- | --- | --- |
| `CurrentState` | `compound-design/registry/resource-registry.json` (release, stage, baseline, CEL, uplift) + `quality/releases/v0.3-contract-eval.json` (latest evidence, date) + `quality/e2/environment.json` (runtime status) | Home, Project, Evidence, Resources, footer |
| `Resource` / `Agent` | registry entries + sections parsed from `skills/*/SKILL.md` and `agents/*.md` into `src/content/generated/resources.json` | Resources, resource detail, Home (counts) |
| `ProjectStage` | release documents, each fact with a `source` path | Project timeline |
| `EvidenceLevel` | `quality/CD-EVIDENCE-LEVELS.md` | Evidence, ConceptLink popovers |
| `Concept` | authored in `src/content/concepts.ts` against the framework documents, each with `source` | Field Guide, ConceptLink |
| `Example` | the signup example, authored once | How it Works, Lab |

Rule: a factual value (version, level, status, count) is written in `src/content/` exactly once. A gate fails the build if `src/app` or `src/components` restate one.

## States

- Resource detail: active resource → page; superseded resource → no page, named under the successor's provenance; unknown id → 404 (static export: not generated).
- Concept detail: known id → page; unknown → 404.
- Field Guide search: empty query → curated starting points; query with matches → ranked list; query without matches → "no concept matches; try one of these" with the nearest by alias.
- Lab: idle → finding selected → correction applied → compounded. Every state reachable by keyboard; reduced motion ends every transition in its settled state.
- ConceptLink: closed → open (popover) → closed by Escape, outside click or focus leaving.

## Components

Shell: `SiteHeader` (skip link, current route, mobile disclosure), `SiteFooter`.
Editorial: `PageIntro`, `SectionIntro`, `EditorialGrid`, `Row` (label / meta / hairline).
Teaching: `Transformation`, `ProcessFlow`, `LearningTransformation`, `EvidenceBoundary`, `Timeline`, `TechnicalDisclosure`.
State: `CurrentState`, `EvidenceBadge`, `ResourceCard`, `Finding`.
Interactive islands (client): `ConceptLink`, `FieldGuideSearch`, `Lab`, `Timeline` (scroll behaviour only).

## Not modelled on purpose

A CMS, MDX, i18n, analytics, a theme switch, comments, search across the whole site. Each would be a dependency without a consumer this phase.
