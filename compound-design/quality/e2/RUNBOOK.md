# E2 Benchmark Runbook

```
STATUS: E2 PRE-REGISTERED · ZERO-COST PREPARATION COMPLETE · PRIMARY RUBRIC FROZEN · RUNTIME NOT EXECUTED · COST BLOCKED · CEL E1
```

Everything in section 1 runs without a model and was executed in this round. Section 2 is blocked by design until explicit paid-runtime authorization exists.

## 1. Zero-cost preparation (executed, reproducible)

```bash
npm run e2:install          # compound-design/quality/e2: promptfoo 0.122.2, playwright-core 1.63.0, axe-core 4.13.0 (lockfile-pinned; no browsers, no model SDKs)
npm run e2 -- self-test     # every gate must reject its mutation
npm run e2 -- fetch-upstream   # jakubkrehel/skills @ 267330e1adfc… → compound-design/vendor/ (gitignored); verifies SHA + LICENSE; records drift, never moves the pin
npm run e2 -- validate      # task gates (holdout ≥ 30%, provenance, decoys, prompt hygiene, D subset), exec-only configs, guarded templates, zero-cost CI, promptfoo schema validation
npm run e2 -- fixtures      # Playwright + axe observations for rendered fixtures → tasks/ground-truth/ (needs a local Chromium; E2_CHROMIUM_PATH=/path/to/chrome if not auto-detected)
npm run e2 -- workspaces    # .workspaces/<suite>/<condition>/ — disposable; gate: no task file, rubric or ground truth inside
npm run e2 -- freeze        # tasks/tasks.json (task-set SHA-256, holdouts, D subset) + environment.json (repo SHA, versions, pins)
npm run e2 -- dry-run       # promptfoo eval with the deterministic exec: echo provider → results/dry-run (SYNTHETIC — NOT MODEL OUTPUT); then routes → blind → aggregate
npm run e2 -- plan-runs     # future call counts and cost estimate (plan-runs.json) — not executed
```

Why promptfoo is not a devDependency of the app: it pulls ~80 required packages plus optional cloud/agent SDKs and a browser download; Vercel installs devDependencies during the build. The harness therefore lives in its own pinned package with its own lockfile.

## 2. Paid runtime (BLOCKED by default)

Every runtime command aborts with `Blocked: E2 model runtime requires explicit paid-runtime authorization.` unless `E2_PAID_RUNTIME_CONFIRMED` is exactly `YES`. There is no smoke run during install, build, test or CI.

Preflight (all before spending):
1. explicit written budget authorization and a maximum spend;
2. pin one tested model and one judge model (must differ; same vendor ≠ independent family);
3. `e2 fetch-upstream` reports `drift: false` (if `true`, record the delta in SOURCE-PARITY and stop — pins are never moved automatically);
4. `e2 validate`, `e2 workspaces`, `e2 freeze` green on the exact commit that will be benchmarked;
5. an API key provided explicitly for the run (`apiKeyRequired: true`; the harness never searches for keys and never borrows a local Claude Code session).

Order:
1. **Smoke** — one task per condition; inspect `metadata.skillCalls`/`toolCalls`: A has no skill/agent, B invoked `better-*`, C ran `agent: jakub`, D ran `agent: jakub` with `vendor_reads = 0`.
2. **Negative control** — render C against a workspace without `.claude/agents/jakub.md`; the run must fail. If it silently succeeds, the route is not load-bearing and the comparison is invalid.
3. **Judge calibration** — known-negatives (empty, off-topic confident, decoy-flagging) must fail; a human-written oracle must pass.
4. **Replace cost assumptions** in `plan-runs.json` with the smoke telemetry.
5. **Full run**:

```bash
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite jakub   --model <tested> --judge <judge> --execute
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite jakub-d --model <tested> --judge <judge> --execute   # subset lane; add --filter-metadata d_subset=true to the printed promptfoo command
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite qg      --model <tested> --judge <judge> --execute
```

6. **Classify, blind, review, aggregate** (zero-cost again):

```bash
npm run e2 -- routes    results/runtime/<suite>.results.json --suite=jakub
npm run e2 -- blind     results/runtime/routes.json results/runtime/<suite>.results.json
# human fills blind/human-score-sheet.csv offline (HUMAN-CRAFT-REVIEW.md)
npm run e2 -- unblind   results/runtime/blind/unblind-key.json results/runtime/blind/human-score-sheet.csv
npm run e2 -- aggregate results/runtime/routes.json --scores=results/runtime/blind/scores.unblinded.json
```

`aggregate` writes `summary.json` and a `DECISION.draft.md` skeleton. The decision text is written by a human against the pre-registered rules in `E2-PILOT-PLAN.md` §13–§16.

## 3. Decision outcomes (unchanged)

Compound wins (scoped E2, no v0.3 unless a justified change exists) · Compound ties upstream (simplify the wrapper) · Compound loses upstream (do not defend; candidate + separate holdout) · no reliable difference (stay at E1). Each is a valid result.

## 4. Artifact integrity

A valid decision includes: `environment.json` (exact repo SHA, upstream pin and drift, harness versions, model/judge ids), `tasks/tasks.json` (task-set digest, holdouts, D subset), raw results, `routes.json`, blind payload and key, human sheet and divergence log, `summary.json`, and the human-written `DECISION.md` with unresolved uncertainty. Missing telemetry stays `not measured`.
