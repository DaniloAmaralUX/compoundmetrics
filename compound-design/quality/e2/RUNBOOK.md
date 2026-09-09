# E2 Benchmark Runbook

This folder is benchmark-ready. Runtime evidence has **not** been collected yet.

## 1. Preflight

Before any paid run:

- choose and pin one model snapshot in `CD_EVAL_MODEL`;
- confirm Promptfoo version;
- confirm Claude Agent SDK version;
- confirm upstream Jakub source is pinned for the run;
- confirm read-only tool permissions;
- set a maximum acceptable spend for the full benchmark;
- do not change test expectations after seeing candidate outputs without versioning the test set.

## 2. Validate configs without spending

Use Promptfoo config validation first.

```bash
npx promptfoo@latest validate -c compound-design/quality/e2/promptfoo-jakub.yaml
npx promptfoo@latest validate -c compound-design/quality/e2/promptfoo-quality-gate.yaml
```

If validation fails, fix the harness. Do not reinterpret a broken harness as a resource failure.

## 3. Route smoke test

Before the full repeated benchmark, run a single cheap task per condition and inspect raw metadata.

For `jakub` verify:

- A has no specialist route;
- B invokes an upstream Jakub skill from the pinned local plugin;
- C runs the `jakub` named agent from the project settings;
- model snapshot and tools are identical otherwise.

If B or C is not observably routed as intended, the comparison is invalid.

For `cd-quality-gate` verify:

- A has no quality skill;
- C invokes `cd-quality-gate` through a `Skill` tool call.

## 4. Full fresh benchmark

Only after route smoke passes:

```bash
npx promptfoo@latest eval -c compound-design/quality/e2/promptfoo-jakub.yaml --no-cache
npx promptfoo@latest eval -c compound-design/quality/e2/promptfoo-quality-gate.yaml --no-cache
```

The configs repeat each task three times.

Do not retry failed generations selectively. Provider/runtime errors should remain visible in the artifact and be separated from quality failures in analysis.

## 5. Human scoring for Jakub

Shuffle A/B/C output labels before review when practical.

Score each output using `BENCHMARK-PROTOCOL.md`:

- correct issue detection — 30;
- precision — 20;
- prioritization — 15;
- actionability — 15;
- boundary discipline — 10;
- verification honesty — 5;
- concision — 5.

Keep the original raw response unchanged.

## 6. Decision

Possible outcomes:

### Compound wins

If C satisfies the pre-registered E2 rule, promote only the tested scope to E2.

Do not create v0.3 unless the evidence also identifies a justified resource change.

### Compound ties upstream

If C is effectively equal to B with no meaningful efficiency advantage, simplify the wrapper. Direct upstream use becomes the default hypothesis.

### Compound loses upstream

Do not defend the wrapper. Mark the failure, identify the causal hypothesis, create a candidate change, preserve v0.2 as baseline, and rerun with a holdout.

### No reliable difference

Stay at E1. A benchmark that cannot distinguish conditions is still a useful result because it prevents a false version claim.

## 7. Artifact integrity

A valid E2 decision includes:

- exact git SHAs;
- exact model/provider identity;
- exact test-set version;
- Promptfoo/SDK versions;
- raw runs;
- failures and errors;
- human scoring where required;
- cost/latency only when actually measured;
- final decision and unresolved uncertainty.

## Current blocker to autonomous execution from ChatGPT

The repository and harness can be prepared from this environment, but a controlled LLM runtime requires an authenticated model execution context. Creating or spending against an API credential is intentionally not assumed by this runbook.

Until that execution exists, resources remain E1 and runtime uplift remains `not measured`.
