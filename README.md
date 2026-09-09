# Compound Metrics

Compound Metrics is the standalone home of the Compound Design evidence system: a framework for turning useful human + AI working patterns into reusable, versioned, testable resources — and the public page that presents it.

> Build the application. Improve the system that builds the next one.

## Current state

- Framework release: **v0.2.1 — Evidence Infrastructure**
- Current evidence level: **E1 — Deterministic**
- Runtime uplift: **not measured**
- Core distinction: **CDQI measures construction quality; CEL measures evidence maturity.**

## Why this exists

Useful AI practice often remains tribal: process, context, review and judgment live in individual habits. Compound Design investigates how those practices can become shared capability without turning opinion into evidence.

The operating loop is:

`Frame → Model → Craft → Build → Verify → Polish → Compound → Repeat`

A resource earns stronger claims only when the evidence earns them.

## Running the site

The public page is a standalone Next.js app. The route `/` renders Compound Design directly.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export in out/
```

The build has no catalog, gallery or registry step: `npm run build` runs `next build` and nothing else.

Evidence-infrastructure checks (no model/API budget is spent):

```bash
npm run cd:lint    # registry lint + mutation self-test
npm run cd:evals   # deterministic E1 contract suite
npm run typecheck
npm run lint
```

E2 benchmark harness — zero-cost by default (`compound-design/quality/e2/`):

```bash
npm run e2:install        # pinned promptfoo / playwright-core / axe-core in their own lockfile; no browsers, no model SDKs
npm run e2 -- self-test   # every gate must reject its mutation
npm run e2 -- validate    # task, config and CI gates + promptfoo schema validation
npm run e2 -- dry-run     # exec-only echo provider: proves the pipeline without a model
```

Model runtime is a separate command that aborts unless `E2_PAID_RUNTIME_CONFIRMED=YES`. Current state: `E2 PRE-REGISTERED · ZERO-COST PREPARATION COMPLETE · PRIMARY RUBRIC FROZEN · RUNTIME NOT EXECUTED · COST BLOCKED · CEL E1`. See `compound-design/quality/e2/E2-PILOT-PLAN.md`.

## Repository map

```text
.
├── src/app/                 # Public page: layout.tsx, page.tsx, page.module.css, globals.css
├── public/                  # Static assets (favicon)
├── compound-design/         # Canonical framework, evidence and learning system
│   ├── docs/                # Process history and design critique
│   ├── learning/            # Learning Ledger + entry template
│   ├── quality/             # CDQI, CEL, Evidence Debt, Quality Gate, evals, releases
│   │   └── e2/              # pre-registered E2 pilot: tasks, rubrics, harness (zero-cost by default)
│   ├── registry/            # Canonical resource registry + schema
│   ├── releases/            # v0.2.1 evidence-infrastructure release notes and validation
│   ├── research/            # AI interaction source map
│   ├── tools/               # cd-lint (deterministic claim checks)
│   ├── AGENT-MAP.md
│   └── SOURCES.md           # Upstream provenance and source hierarchy
├── .claude/                 # Executable agent/skill resources (internal IDs)
├── .github/workflows/       # CI: cd-lint, contract evals, typecheck, lint, build
├── GOVERNANCE.md
├── CONTRIBUTING.md
└── NOTICE                   # Attribution and provenance
```

## Canonical resources

Public names are intentionally simple; internal IDs remain stable for evals and provenance.

| Public name | Internal ID | Role | Current CEL |
|---|---|---|---|
| Design Guide | `cd` | Orchestration | E1 |
| Interface Review | `jakub` | Interface craft specialist | E1 |
| Motion Review | `emi` | Motion and interaction specialist | E1 |
| Quality Gate | `cd-quality-gate` | Construction/evidence review | E1 |
| Resource Lab | `cd-resource-lab` | Failure-driven improvement | E1 |
| AI Interaction Review | `cd-ai-interaction-review` | AI-native UX review | E1 |

## Evidence policy

Compound Metrics does not treat strong construction as proof of runtime improvement.

- **CDQI**: construction quality, 0–10.
- **CEL**: evidence maturity, E0–E4.
- **E1** means contract-tested, not proven outcome uplift.
- **E2** requires controlled runtime comparison against relevant baselines with repeated runs.
- Vendor adoption, popularity or official documentation never counts as certification of Compound Design.

## Provenance

Compound Design is authored as a composition and specialization layer. It is informed by work from Every/Compound Engineering, Jakub Krehel, Emil Kowalski, Microsoft HAX, Google PAIR, Anthropic, OpenAI and Promptfoo where relevant. Upstream influence is documented; no endorsement or certification is implied.

See `NOTICE` and `compound-design/SOURCES.md`.

## Layout direction

The next presentation-layer iteration will study `evilrabbit/main` as a boilerplate/layout reference. That work is separate from the evidence architecture and must not overwrite provenance, quality history or evaluation contracts.
