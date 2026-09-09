# Compound Design Resource Status — v0.3.0-alpha.1

v0.3.0-alpha.1 is a candidate release: the architecture and the behaviour changed, and nothing was shown to work better. v0.2.1 remains the stable evidence baseline. No resource exceeds E1 and runtime uplift is `not measured` for every one of them.

Resources authored or rewritten for this release entered the registry at `E0` and reached `E1` only by passing the deterministic contract suite (`compound-design/quality/releases/v0.3-contract-eval.json`), in a commit separate from the one that created them. `CDQI` stays `null` until a construction audit is written down.

| Resource | Public name | Kind | Version | CDQI | CEL | Runtime uplift |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `cd-frame` | Frame | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-model` | Model | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-build` | Build | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-verify` | Verify | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-polish` | Polish | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-compound` | Compound | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-strategy` | Strategy | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-compound-refresh` | Compound Refresh | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-setup` | Setup | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-handoff` | Handoff | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-interface-review` | Interface Review | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-motion-review` | Motion Review | skill | 0.3.0-alpha.1 | — | E1 | not measured |
| `cd-quality-gate` | Quality Gate | skill | 0.2.0 | 8.75 | E1 | not measured |
| `cd-resource-lab` | Resource Lab | skill | 0.2.0 | 8.65 | E1 | not measured |
| `cd-ai-interaction-review` | AI Interaction Review | skill | 0.1.0 | 8.35 | E1 | not measured |
| `compound-design` | Design Guide | orchestrator | 0.3.0-alpha.1 | — | E1 | not measured |
| `interface-reviewer` | Interface Reviewer | agent | 0.3.0-alpha.1 | — | E1 | not measured |
| `motion-reviewer` | Motion Reviewer | agent | 0.3.0-alpha.1 | — | E1 | not measured |
| `ai-interaction-reviewer` | AI Interaction Reviewer | agent | 0.3.0-alpha.1 | — | E1 | not measured |
| `evidence-reviewer` | Evidence Reviewer | agent | 0.3.0-alpha.1 | — | E1 | not measured |
| `learning-curator` | Learning Curator | agent | 0.3.0-alpha.1 | — | E1 | not measured |

Superseded, retained with their historical evidence: `jakub` → `cd-interface-review`, `emi` → `cd-motion-review`, `cd` → `compound-design`.

A dash under CDQI means construction quality has not been audited. It is never assumed from a passing contract suite.

## v0.2.1 infrastructure

- canonical resource registry + JSON Schema;
- deterministic lint rules for semver, CEL, CDQI, provenance, evidence inflation and vendor-certification language;
- mutation fixtures built into `cd-lint --self-test`;
- Evidence Debt ledger;
- safe Learning Ledger template;
- Resource Value Audit;
- AI Interaction source hierarchy;
- optional local-model stress lane classified separately from CEL.

## Evidence boundary

The current E1 contract suite proves deterministic resource contracts, not runtime outcome uplift.

No E2 runtime run has been executed. All runtime metrics remain `not measured`.

## Source parity finding

The internal `jakub` resource defines a parallel P1/P2/P3 severity model while the current upstream review architecture has its own verdict/severity conventions.

This may be useful orchestration or unnecessary duplication. The E2 benchmark must decide. If direct upstream is equal or better, simplification/removal is a valid improvement outcome.

## E2 readiness

```
E2 PRE-REGISTERED
ZERO-COST PREPARATION COMPLETE
PRIMARY RUBRIC FROZEN
RUNTIME NOT EXECUTED
COST BLOCKED
CEL E1
```

The pack under `quality/e2/` is now executable end to end without a model: versioned task sets (9/3 and 11/4 holdouts), deterministic ground truth with provenance, decoys, frozen 7-dimension primary rubric plus a diagnostic 10-dimension rubric, blind human review protocol, per-condition workspace isolation, pinned upstream, route/blind/aggregate tooling with mutation self-tests, an exec-only dry run, and a paid-runtime command that aborts unless `E2_PAID_RUNTIME_CONFIRMED=YES`. Paid model calls made: 0. See `quality/e2/E2-PILOT-PLAN.md`.

## Next evidence action

1. Run deterministic registry lint and mutation self-test locally when the repo is checked out.
2. Capture real-work failures in the Learning Ledger without confidential data.
3. Optionally use LOCAL-STRESS with an already-installed local model to find fragility; do not raise CEL from it.
4. When budget/runtime authorization exists, run the frozen E2 benchmark without changing expectations after seeing outputs.
5. Create a behavior-changing candidate only if evidence reveals a justified change.

If no material improvement is demonstrated, remaining on v0.2.x is the correct Compound Design result.
