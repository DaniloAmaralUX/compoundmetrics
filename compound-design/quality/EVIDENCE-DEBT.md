# Evidence Debt — v0.3.0-alpha.1

Evidence debt is the explicit gap between what a resource is built to do and what has actually been demonstrated.

It is not a defect score. It prevents unmeasured capability from being narrated as proven impact.

## Current rule

- CDQI may improve when construction improves.
- CEL may improve only when new evidence is produced.
- E0/E1 runtime uplift must remain `not measured`.
- A new version is not justified by added prose alone.

## Current debt

| Resource | CEL | What we know | What remains unproven |
| --- | --- | --- | --- |
| `cd` | E1 | contract/routing structure is explicit | runtime orchestration uplift, efficiency, route quality |
| `jakub` | E1 | interface-review contract is testable | value over base model and direct upstream, blind craft delta |
| `emi` | E1 | motion scope and non-goals are explicit | runtime motion-review uplift and holdout behavior |
| `cd-quality-gate` | E1 | evidence boundaries are deterministic | decision correctness in model runtime, false-positive routing |
| `cd-resource-lab` | E1 | failure→eval→change loop is explicit | measured improvement across real resource versions |
| `cd-ai-interaction-review` | E1 | six AI interaction gates are explicit | reliance/autonomy outcome improvement in representative tasks |

## v0.3 candidate resources (2026-09-09)

Twelve skills and six agents authored or rewritten for v0.3 hold **E1**: their contracts are declared and deterministically checked. What none of them has is any runtime evidence at all — not against a base model, not against direct upstream use, and, for the two rewritten specialists, not against the v0.2 resource they replaced. The candidate lane in `quality/e2/candidate-v0.3/` exists so that last comparison is answerable; it has not been run.

The discoverability mechanism is a second, narrower case: retrieval is proved mechanically, and its effect on any decision is unmeasured. Building a mechanism is not evidence that it helps.

## E2 preparation state (2026-09-09)

The E2 pilot for `jakub` and `cd-quality-gate` is pre-registered and prepared at zero cost (`quality/e2/E2-PILOT-PLAN.md`). No runtime was executed; every runtime cell in the table above remains `not measured`. Preparation repays no evidence debt.

## Debt repayment order

1. `jakub`: A/B/C against base model and direct upstream.
2. `cd-quality-gate`: controlled decision tasks with zero evidence inflation.
3. `emi` and `cd-ai-interaction-review` after the first E2 protocol is proven operational.
4. `cd` and `cd-resource-lab` after specialist-level evidence exists.

## What does not repay evidence debt

- a higher self-assigned score;
- a new prompt revision with no reproduced failure;
- model praise;
- screenshots of good outputs;
- vendor tooling used as if it were vendor certification;
- passing the same examples used to write the resource.
