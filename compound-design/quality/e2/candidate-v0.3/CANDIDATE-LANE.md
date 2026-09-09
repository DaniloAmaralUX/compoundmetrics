# E2 candidate lane — v0.3 rewrite versus the version it replaced

```
STATUS: PRE-REGISTERED · NOT EXECUTED · NO PAID RUNTIME · CEL UNCHANGED
```

The frozen pilot in the parent directory answers whether the Compound layer beats a base model and direct upstream use. This lane adds the question a rewrite creates: **is the new resource better than the one it replaced, or did we lose something?**

Nothing here changes the frozen pilot. Task sets, fixtures, ground truth, rubrics, holdouts, gates and the primary decision rules are reused **unchanged**; this lane only adds a condition.

## Conditions

| Condition | Resource | Source |
| --- | --- | --- |
| **A** | base model, no resource | — |
| **B** | upstream interface stack loaded directly | pinned `jakubkrehel/skills@267330e1`, fetched by `e2 fetch-upstream` |
| **C0** | the released v0.2.0 resource | `legacy-resources/v0.2/agents/jakub.md`, byte-equivalence proved by `RESOURCE-MANIFEST.json` |
| **C1** | the v0.3 rewrite | `skills/cd-interface-review/SKILL.md` + `agents/interface-reviewer.md` |

Held constant exactly as in the frozen protocol: one pinned model for every condition, the same tools, `max_turns 12`, `max_budget_usd 1.0`, `repeat 3`, `--no-cache`, isolated disposable workspaces, identical prompts, the same frozen 7-dimension primary rubric, the same blinding.

## The question this makes answerable

1. Does the rewrite beat no resource at all? (C1 vs A)
2. Does it beat direct upstream use? (C1 vs B)
3. **Did the rewrite lose anything the released version had?** (C1 vs C0)

Question 3 is the reason this lane exists. Without it, a rewrite can only look like progress.

## Decision rule for C1 vs C0

A rewrite is **rejected** when C1 shows **material underperformance against C0 under the frozen primary decision rules** — that is, when the same rules the pilot already pre-registers would fail C1 where they pass C0. Concretely, any of:

- C1 − C0 mean is negative by more than the frozen non-inferiority margin of 2 points on the primary rubric;
- C1 loses a critical expected issue that C0 detects, on 2 or more tasks;
- C1 fails a near-miss routing case that C0 passes;
- C1's holdout mean falls more than 2 points below C0's.

Outcome when rejected: **the candidate rewrite is rejected and C0 remains the baseline resource.** That is a decision about which resource is recommended, taken by a human with the artifacts in front of them.

It is explicitly **not** an automatic code revert. A trivial difference — anything inside the margin, or a single-task swing — decides nothing. `cd-resource-lab` then owns the follow-up: reproduce the specific regression, form a hypothesis, add the eval, and change the smallest thing linked to it. Deleting the rewrite is one possible outcome among several, and it needs the same evidence as any other change.

Symmetrically, C1 beating C0 does not promote anything on its own. It is a candidate result, gated by `cd-quality-gate` like every other claim.

## What is frozen and what is added

| | |
| --- | --- |
| Frozen, reused unchanged | task sets `e2-tasks 1.0.0`, fixtures, ground truth, decoys, holdouts, `rubrics/primary-7.md`, gates, blinding, aggregation |
| Added here | condition C1, its runtime template, and the C1-versus-C0 decision rule above |
| Not touched | every file under `compound-design/quality/e2/` outside this directory |

## Execution

Blocked by the same guard as the rest of the pilot. `e2 paid-runtime` aborts unless `E2_PAID_RUNTIME_CONFIRMED` is exactly `YES`, and no command in CI or in `npm run e2` can reach a model. Estimated additional cost of the C1 lane, at the frozen 9 tasks × 3 repeats: 27 agent runs plus 27 judged outputs, roughly $2–4 at the rates recorded in `plan-runs.json` — an estimate, to be replaced by measured smoke telemetry before any full run.

## Evidence boundary

This document pre-registers a comparison. It is not evidence, it does not raise any resource's evidence level, and no runtime has been executed. Runtime uplift for every resource remains `not measured`.
