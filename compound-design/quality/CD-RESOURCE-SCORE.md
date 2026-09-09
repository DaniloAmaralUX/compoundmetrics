# CD Resource Score — v0.1

A transparent 0–10 score for versioning Compound Design AI resources.

The score exists to compare a resource with its own previous version and a relevant baseline. It is not an external certification and must never be presented as vendor endorsement.

## Two score classes

### Readiness score

Used while empirical A/B execution is incomplete. It measures whether the resource is well-defined and ready to be tested. Any unmeasured empirical dimension receives only the evidence actually available; it is not silently treated as a pass.

Display as: `8.1 / 10 · readiness`.

### Verified score

Used only after representative baseline comparison and repeated runs exist for the primary job.

Display as: `8.6 / 10 · verified` plus eval-suite version and environment/model metadata.

## Weighted dimensions

| Dimension | Weight | What earns the points |
| --- | ---: | --- |
| Scope & contract | 1.25 | Clear job, non-goals, inputs, outputs and termination criteria. |
| Routing quality | 1.25 | Positive triggers are specific; unrelated tasks stay out; specialist boundaries are explicit. |
| Instruction quality | 1.25 | Actionable sequence, progressive disclosure, low ambiguity, no contradictory or decorative instruction. |
| Outcome usefulness | 2.00 | Primary task becomes materially better than baseline, or equivalent with a meaningful efficiency gain. |
| Reliability & regressions | 1.50 | Repeated runs are stable; known real failures become regression evals; critical failures are absent. |
| Trajectory & efficiency | 1.25 | Correct tools/specialists/order, limited retries/context waste, acceptable token/latency/cost delta. |
| Safety, provenance & maintainability | 1.50 | Permissions and boundaries are safe; provenance/licensing is correct; resource can be maintained/versioned without hidden dependencies. |
| **Total** | **10.00** | |

## Score bands

- `0.0–3.9` — broken or undefined
- `4.0–5.9` — experimental
- `6.0–6.9` — usable with material gaps
- `7.0–7.9` — good candidate
- `8.0–8.9` — strong resource for current scope
- `9.0–9.6` — excellent, broadly proven in its defined scope
- `9.7–10.0` — deliberately rare; requires unusually broad, stable evidence

A score is not enough to approve a resource. A known critical failure, systematic routing failure, unsafe behavior, invalid provenance or broken regression blocks `CD_APPROVED` regardless of the average.

## POC calibration rules

For v0.x, static inspection and eval-harness readiness may produce a positive readiness score around 8 when the architecture is strong. This does **not** mean empirical value has been proven.

The score should fall if evidence is missing in a dimension that depends on execution. Never fabricate latency, tokens, pass rates, uplift, variance or independent-review results.

## Version cycle

`v0.1 → run evals → capture failures → add regressions → minimal change → rescore → v0.2`

Every release record must preserve:

1. resource version;
2. score and score class;
3. rubric version;
4. eval-suite version;
5. baseline;
6. measured environment/model;
7. dimension scores;
8. critical failures;
9. evidence links/artifacts;
10. delta from previous version.

## Initial POC readiness calibration

These are architecture/readiness assessments from the current resource definitions, not empirical external validation:

| Resource | Version | Readiness | Main reason it is already strong | Biggest missing proof |
| --- | --- | ---: | --- | --- |
| `jakub` | 0.1 | **8.2** | Tight interface-craft scope, explicit routing and concrete review contract. | A/B outcome uplift + repeated routing runs. |
| `emi` | 0.1 | **8.1** | Strong motion restraint, interaction boundaries and reusable-rule output. | A/B polish quality + motion-specific regressions. |
| `cd` | 0.1 | **8.0** | Clear orchestration model and specialist delegation without trying to absorb all expertise. | End-to-end trajectory tests across real web-app tasks. |
| `cd-quality-gate` | 0.1 | **8.4** | Multi-axis evidence gate with baseline, reliability, trajectory and human craft checks. | Validate that the gate itself predicts useful promotion decisions. |
| `cd-resource-lab` | 0.1 | **8.3** | Evidence-first improvement loop tied directly to regression evals and version deltas. | Run it against multiple resource upgrades and measure whether scores correlate with outcome gains. |

The next meaningful score is not a nicer-looking 8.x. It is the first `verified` score backed by real baseline runs.
