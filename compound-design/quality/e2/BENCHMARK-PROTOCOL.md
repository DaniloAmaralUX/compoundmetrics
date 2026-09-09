# Compound Design E2 Benchmark Protocol

Status: READY TO RUN — runtime not executed yet
Scope: first controlled evidence pass for `jakub` and `cd-quality-gate`

## Why this exists

v0.2 established E1: deterministic contracts and evidence discipline. E2 requires a different claim: controlled runtime evidence that a resource improves its intended job.

This protocol is pre-registered before model runs to reduce cherry-picking.

## Core experiment

For `jakub`:

- **A — Base model:** same model, same task, no interface specialist loaded.
- **B — Upstream:** same model with current/pinned Jakub upstream interface stack available directly.
- **C — Compound v0.2:** same model with Compound `jakub` v0.2.0.

For `cd-quality-gate`:

- **A — Base model:** same model, no quality-gate resource.
- **B — Comparator:** strongest relevant external evaluator available in the environment, recorded explicitly. If no valid comparator is available, omit B rather than invent equivalence.
- **C — Compound v0.2:** same model with `cd-quality-gate` v0.2.0.

The model snapshot, task files, permissions, working directory and tool availability must be constant within each comparison.

## Minimum runtime sample

POC minimum:

- 6 representative tasks per resource;
- 3 fresh runs per task per condition;
- `--no-cache`;
- same model snapshot;
- raw outputs retained.

Three repeats measure gross instability only. They are not statistical proof.

## Holdout rule

At least 30% of scoring tasks must be holdouts that were not used to design a candidate change.

If a failure inspires a future patch, that failure enters the regression set, while a separate holdout remains unseen during the fix.

## Jakub primary-job rubric — 100 points

| Dimension | Weight | What counts |
| --- | ---: | --- |
| Correct issue detection | 30 | Finds expected material interface problems without missing critical ones |
| Precision / false-positive control | 20 | Avoids taste-only, invented or unsupported findings |
| Prioritization | 15 | Puts highest user/system consequence first |
| Actionability | 15 | Gives concrete feasible changes, not commentary |
| Boundary discipline | 10 | Defers backend, motion-only and AI-reliance work correctly |
| Verification honesty | 5 | Distinguishes inspected vs unverified claims |
| Concision | 5 | High signal without exhaustive cosmetic inventory |

### Jakub E2 success rule

`jakub` may advance to E2 only if all are true:

1. mean score is at least **5 points higher than A**;
2. C is at least **non-inferior to B** on mean score (no more than 2 points lower), unless it is at least 15% more efficient on measured token/cost/latency while preserving critical-issue recall;
3. no new systematic boundary-routing failure appears;
4. no critical expected issue has < 2/3 detection rate across repeats;
5. holdout mean does not degrade by more than 2 points vs the stronger baseline.

If C does not beat B meaningfully, the default recommendation is to simplify or remove the wrapper and call upstream directly.

## Quality Gate primary-job rubric — 100 points

| Dimension | Weight | What counts |
| --- | ---: | --- |
| Decision correctness | 30 | Promotion state matches the evidence supplied |
| Evidence discipline | 25 | Never upgrades CEL or claims uplift without artifacts |
| Critical-boundary handling | 15 | Security/licensing/destructive-action failures block correctly |
| Baseline/repeatability reasoning | 10 | Requires controlled comparison where needed |
| Routing / scope | 10 | Invokes for reusable-resource quality work, not unrelated implementation |
| Actionability | 5 | Names the next missing eval or artifact |
| Non-fabrication | 5 | Preserves `not measured` and never invents external certification |

### Quality Gate E2 success rule

`cd-quality-gate` may advance to E2 only if all are true:

1. decision correctness >= 90% across the fixed task set;
2. evidence inflation errors = 0;
3. critical-boundary misses = 0;
4. unrelated-task false-positive routing <= 1 across all repeats;
5. mean score beats A by at least 5 points;
6. if B exists, C must be non-inferior to B or provide a documented efficiency advantage.

## Efficiency telemetry

Record when available:

- input/output tokens;
- wall-clock latency;
- tool calls;
- retries/errors;
- provider-reported cost;
- specialist/skill calls.

Missing telemetry must stay `not measured`.

## Blinded human review

For `jakub`, human craft scoring should be blinded to A/B/C labels when practical.

The reviewer receives shuffled outputs plus the fixed rubric and expected material issues. After scoring, labels are revealed and aggregated.

Do not ask the human reviewer to judge which framework they prefer.

## Output artifacts

Each benchmark run must produce:

- `environment.json` — date, model snapshot, harness version, provider, tool permissions;
- `tasks.json` — exact fixed task set and holdout markers;
- raw output per run;
- `scores.json` — machine assertions + human rubric where applicable;
- `summary.json` — means, variance/range, failures and efficiency deltas;
- `DECISION.md` — E1 stays E1, E2 promotion, deprecation/simplification, or candidate experiment.

## Anti-gaming rules

- no editing expected outputs after seeing candidate results without versioning the task set;
- no deleting failed runs;
- no switching model/provider between conditions;
- no benchmark score from cached outputs;
- no raising CDQI because runtime results are good;
- no raising CEL because construction looks strong;
- no `Claude Approved`, `OpenAI Approved`, `Promptfoo Certified` or equivalent vendor-endorsement language.

## Tooling choice

Primary harness: Promptfoo, because it can test agent skills, skill invocation, repeated fresh calls, latency/cost and structured assertions across providers.

Anthropic Skill Creator can be used as a supplemental optimizer/evaluator, not as the sole source of evidence. Public issues observed on 2026-09-09 show active measurement-integrity bugs/edge cases in its trigger-eval tooling, so its raw artifacts must be inspected before accepting a result.

## Version rule

The benchmark does **not** create v0.3 by itself.

v0.3 exists only if runtime evidence reveals a justified change and the changed candidate subsequently beats the released v0.2 baseline without failing holdouts.

If no material improvement is found, remaining at v0.2 is the correct result.
