---
name: cd-resource-lab
description: Improves reusable AI resources through reproduced failures, explicit hypotheses, minimal changes, regression capture and evidence-gated versioning. Use when a skill, agent, plugin or workflow should become measurably better rather than longer.
version: 0.2.0
---

# CD Resource Lab

Improve resources by evidence, not prompt decoration.

## Release rule

A new version is justified only if it:
- fixes a reproduced failure;
- improves a measured primary-job outcome;
- reduces unnecessary complexity/cost while preserving quality; or
- strengthens a boundary that prevents a known class of failure.

“No obvious regression” is not enough to claim improvement.

## Loop

### 1. Reproduce
Capture one concrete failure or limitation.

Write:
`task → expected → observed → consequence`

If the problem cannot be reproduced or clearly described, keep it as an observation, not an eval.

### 2. Form a hypothesis
State one causal hypothesis:

`If we change X, metric/behavior Y should improve because Z.`

Avoid “make the prompt better.”

### 3. Add the eval first
Create:
- positive case;
- negative/near-miss routing case when relevant;
- regression case for the reproduced failure;
- holdout case not used to design the fix when practical.

### 4. Establish baseline
Use:
- previous released version;
- no-resource baseline; or
- strongest relevant alternative.

Keep runtime variables stable.

### 5. Make the smallest linked change
Change only what the hypothesis requires.

Do not add generic rules without a failing or preventive eval.

### 6. Re-run
Compare:
- primary outcome;
- regressions;
- routing;
- reliability;
- efficiency;
- trajectory.

### 7. Try to falsify the improvement
Look for:
- overfitting to the new eval;
- new false-positive routing;
- longer outputs with no added value;
- hidden cost/latency;
- degradation on holdout cases.

### 8. Score and version
Use both:
- CDQI Construction Score;
- CEL Evidence Level.

A score increase without evidence of better construction is not allowed. A CEL increase requires new evidence artifacts.

## Semantic evidence versions

- `0.x` — calibration and architecture can still change.
- `1.x` — primary job has controlled baseline uplift and stable regression coverage.
- major version — contract/routing/behavior changes materially.

## Release record

Every release records:
- previous version;
- hypothesis;
- files changed;
- evals added;
- baseline;
- pass/fail;
- measured deltas;
- CEL before/after;
- CDQI before/after;
- unresolved uncertainty;
- rollback condition.

## Output

`Failure → Hypothesis → Eval → Minimal change → Falsification check → Evidence delta → CDQI/CEL delta → Version decision`
