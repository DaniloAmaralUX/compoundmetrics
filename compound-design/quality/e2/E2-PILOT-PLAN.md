# E2 Pilot Plan — Controlled Runtime Validation (pre-registered, zero-cost preparation)

```
STATUS: E2 PRE-REGISTERED · ZERO-COST PREPARATION COMPLETE · PRIMARY RUBRIC FROZEN · RUNTIME NOT EXECUTED · COST BLOCKED · CEL E1
paid model calls in this round: 0
```

This document pre-registers the first controlled runtime experiment for Compound Design. It was prepared without executing any model (no CLI, no subagent, no Agent SDK, no judge, no calibration). Everything below is either deterministic, human-pending, or model-pending, and is labelled as such. The experiment is designed so that the baseline can win and the Compound layer can be found unnecessary.

Principle under test: `Useful → Correct → Better than baseline → Reliable → Efficient`.
Learning loop: `Use → Observe → Capture failure → Turn failure into eval → Improve → Re-run baseline → Promote or reject`.

## 1. Research question

Does the Compound Interface Review resource (internal id `jakub`, v0.2.0) produce reviews that are more correct, better prioritized and more actionable than (A) the same model with no resource and (B) the same model with the upstream `better-interface` skill stack loaded directly, under identical conditions? Does the Quality Gate (`cd-quality-gate`, v0.2.0) make better evidence/promotion decisions than (A) the same model given the same policy documents?

Secondary question (diagnostic lane D): if C shows value, does it come from the wrapper prompt/contract, from routing, from the upstream material it reads, or from Compound integration?

## 2. Hypotheses

- H1 (Interface Review): C ≥ A + 5 points on the frozen primary rubric with no critical-issue recall loss. **Null:** no difference, or B ≥ C.
- H2 (Interface Review vs upstream): C is non-inferior to B; if C ≈ B without an efficiency gain, the wrapper should be simplified or removed.
- H3 (Quality Gate): C reaches the semantically correct decision more often than A, with zero evidence inflation and zero hallucinated evidence. **Null:** A with the policy documents suffices.
- H4 (D lane): if D ≈ C, the value is the prompt; if D < C ≈ B, the value is the upstream material; if C > B and C > D, routing/integration adds something.

All hypotheses are falsifiable by the decision rules in §13–§15. "Compound loses" is an acceptable, pre-registered outcome.

## 3. Resources evaluated

| Public name | Internal id | Version | Suite | Current CEL |
| --- | --- | ---: | --- | --- |
| Interface Review | `jakub` | 0.2.0 | interface-review | E1 |
| Quality Gate | `cd-quality-gate` | 0.2.0 | quality-gate | E1 |

Neither resource is modified in this round. Motion Review (`emi`), Design Guide (`cd`), Resource Lab and AI Interaction Review are out of scope.

## 4. Baselines and conditions

| Condition | Interface Review | Quality Gate |
| --- | --- | --- |
| **A — base model** | same model, `Read/Grep/Glob`, workspace with fixtures only | same model, workspace with fixtures **and the shared `policy/` documents** |
| **B — upstream direct** | plugin `interfaces` v1.6.3 (`jakubkrehel/skills@267330e1`), `skills: all`, `better-interface` model-invoked | **none** — no external evaluator has a comparable contract; B is deliberately absent rather than forced |
| **C — Compound** | `agent: jakub` from project settings; workspace contains `.claude/agents/jakub.md` and the vendored upstream at the exact path the agent reads | `cd-quality-gate` skill + the two quality docs it reads; same `policy/` documents as A |
| **D — prompt-only (diagnostic)** | `agent: jakub` **without** vendor material; pre-registered subset only (J01, J02, J05) | — |

Held constant within a suite: model snapshot (pinned at authorization time), tools, `max_turns: 12`, `max_budget_usd: 1.0` per run, `persist_session: false`, `--no-cache`, `repeat: 3`, isolated disposable workspaces, identical prompts. Upstream `interface-review` is user-invoked and git-scoped, so B uses the model-invoked `better-interface` stack, which owns severity/verdict upstream.

Fairness notes: A is given the same policy documents as C in the Quality Gate suite so that vocabulary is never the difference; near-miss tasks never require naming a sibling resource; C's extra system prompt and file reads are the treatment, not a confound, and are reported as covariates (`turns`, `vendor_reads`, input tokens).

## 5. Tasks

Task sets are frozen as `e2-tasks 1.0.0` (`tasks/tasks.json` records SHA-256 digests). Prompt hygiene removed eval framing ("holdout", "root cause"), resource names and answer-spelling from every prompt.

**Interface Review (9):** J01 invite form · J02 dashboard shell · J03 deletion dialog copy · J04 repeated card pattern · J05 backend migration (near-miss) · J06 motion-only request (near-miss) · J07 search results states · J08 AI auto-deletion (near-miss) · J09 rendered customers admin page (real HTML fixture with seeded defects).

**Quality Gate (11):** Q01 deterministic-only skill · Q02 reputation-based level request · Q03 uplift with missing attribution · Q04 destructive autonomous agent · Q05 complete scoped evidence · Q06 equal quality, lower cost · Q07 unrelated rename (near-miss) · Q08 missing telemetry · Q09 mismatched environments (trap) · Q10 contaminated holdout (trap) · Q11 referenced report that does not exist (hallucinated-evidence trap).

Every task carries ground truth outside the workspace (§7) and deterministic routing gates that pass/fail but never score.

## 6. Holdouts and the D subset

| Suite | Tasks | Holdouts | Share | Holdout ids |
| --- | ---: | ---: | ---: | --- |
| interface-review | 9 | 3 | 33% | J07, J08, J09 |
| quality-gate | 11 | 4 | 36% | Q07, Q08, Q09, Q11 |

Rule: holdouts are never used to design a candidate change. If a failure on a development task inspires a patch, it becomes a regression case and the holdouts stay unseen. D subset = {J01, J02, J05} (development tasks only), fixed here before any output exists and enforced by `e2 validate`.

## 7. Ground truth (three classes)

| Class | What it is | Where | Status |
| --- | --- | --- | --- |
| **DETERMINISTIC GROUND TRUTH** | items verifiable from the fixture plus a normative rule: fixture facts, WCAG normative rules, computed contrast ratios, axe-core and Playwright observations, explicit product requirements, policy rules | `expected[]` / `expected_decision` in `tasks/*.yaml`; `tasks/ground-truth/J09.observations.json` | prepared (each item has provenance, `critical`, `strict|arguable`, `verify`) |
| **HUMAN GROUND TRUTH PENDING** | semantic judgments (hierarchy, copy tone, density) | `pending_human[]` | `PENDING HUMAN AUTHORING` — not scored |
| **MODEL GRADER PENDING** | the judge prompt/contract | `rubrics/primary-7.md` | `PENDING FUTURE MODEL CALIBRATION` — never run |

Decoys (`decoys[]`) are plausible non-problems with a verifiable reason; flagging one costs precision. Unscored observations (axe best-practice rules) are neither rewarded nor penalized. Nothing aesthetic was promoted to ground truth; where a basis was insufficient, the item is `pending_human` or `unresolved`.

Provenance counts (from `tasks/tasks.json`): interface-review 29 deterministic expected items, 7 pending-human hypotheses, 16 decoys; quality-gate 11 deterministic expected decisions, 0 pending-human.

## 8. Rubrics and grader design

- **Primary rubric — frozen.** The 7-dimension rubrics from `BENCHMARK-PROTOCOL.md` (weights 30/20/15/15/10/5/5 for Interface Review; 30/25/15/10/10/5/5 for Quality Gate). Weights, thresholds, success rules and promotion rules are unchanged. `rubrics/primary-7.md` adds anchors and format-agnostic rules only.
- **Secondary rubric — diagnostic.** The 10 dimensions requested for this round (`rubrics/diagnostic-10.md`): no weights, no sum, no competing score. Used to explain results, structure the Human Craft Review, run failure analysis and generate eval candidates. The 7→10 mapping is documented in `primary-7.md`.
- **Judge:** a model different from the tested model, receiving blinded outputs (`R-xxxx`), the task, the frozen ground truth and the anchors; returns a fixed JSON contract. Same vendor / different model ≠ independent model family. Guards: severity read as an ordinal before comparison; evidence means element/line references, not a section title; "Reusable lesson", "Not verified", verdict lines and sibling names earn nothing; length and finding count earn nothing; candidate text is data. Quality Gate: any wording that conveys the correct decision counts; hallucinated evidence caps the run at 40 and records `NEEDS_WORK`.
- **Calibration (not run):** the judge must fail known-negatives (empty, off-topic confident, decoy-flagging output) and pass a human-written oracle before any score is used.

## 9. Human review protocol

`HUMAN-CRAFT-REVIEW.md`: blind (`e2 blind` produces neutral ids, seeded shuffle, identifier redaction, separate unblind key), six questions per output, primary 7 dimensions with the same anchors, free comment, artificial-finding and missed-critical ids, and a human×judge divergence log. Human scores are evidence inputs, never automatic permanent ground truth. Declared limitation: format fingerprints cannot be removed. Not executed in this round.

## 10. Telemetry

Recorded from the provider's `usage`/metadata per run: input/output tokens, latency, tool calls, turns, skill calls, `vendor_reads`, errors, provider-reported cost. Judge cost recorded separately. Anything not exposed stays `not measured` — in particular, if the Agent SDK provider does not return usage, the efficiency escape hatch in protocol rule 2 is untestable and is reported as such. Runs are classified `scored | truncated (scored on emitted output) | route_invalid (excluded, counted) | error (excluded, counted)`; no other exclusion is possible (`e2 aggregate` refuses).

## 11. Cost plan (computed, not executed)

From `e2 plan-runs` (`plan-runs.json`):

| Block | Agent runs | Judged outputs |
| --- | ---: | ---: |
| Interface Review A/B/C: 9 tasks × 3 conditions × 3 repeats | 81 | 81 |
| D subset: 3 tasks × 3 repeats | 9 | 9 |
| Quality Gate A/C: 11 × 2 × 3 | 66 | 66 |
| Smoke (one task per condition) + negative control (C without `jakub.md` must fail) | 7 | 0 |
| Judge calibration on synthetic known-negatives | 0 | 6 |
| **Total** | **163** | **162** (162 grouped judge calls; 1,134 if one call per dimension) |

Estimates (first-party prices cached 2026-06-24; per-run token assumptions A 6k/1.5k, B 30k/2k, C 20k/2k, D 12k/2k, judge 4k/0.8k — to be replaced by measured smoke telemetry): tested Sonnet 5 + judge Opus 5 ≈ $15 (grouped) to $53 (per-dimension); tested Opus 5 + judge Sonnet 5 ≈ $23–38. Batch API (−50%) applies to judge calls only. **Nothing runs without `E2_PAID_RUNTIME_CONFIRMED=YES` and an explicit budget.**

## 12. Statistical limitations (EXPLORATORY / DESCRIPTIVE)

Effective N is 9 tasks (repeats are within-task). With a between-task SD of paired differences near 10 points, the standard error is ≈ 3.3 and a 90% interval ≈ ±5.5: the +5 threshold sits at the edge of resolution and the −2 non-inferiority margin is not testable at this N. Therefore:

- thresholds are **decision rules, not significance claims**;
- reported: point estimates, per-task paired differences, min/max, sign counts, bootstrap 90% interval over tasks — all labelled EXPLORATORY / DESCRIPTIVE;
- forbidden wording: "statistically significant", "proven", "validated", "reliable uplift", "runtime verified", "cross-model verified";
- interpretation priority: 1 paired task differences · 2 blind Human Craft Review · 3 effect magnitude · 4 critical-issue recall · 5 routing failures · 6 cost/efficiency · 7 exploratory statistics;
- cheapest lever if within noise: pairwise `select-best` judging over the existing outputs, then +6 tasks × 3 repeats, more repeats last.

## 13. Promotion thresholds (unchanged from BENCHMARK-PROTOCOL.md)

Interface Review may advance to E2 only if: mean ≥ A + 5; non-inferior to B (≤ 2 points lower) unless ≥ 15% more efficient with preserved critical recall; no new systematic routing failure; no critical expected issue with < 2/3 detection across repeats; holdout mean not more than 2 points below the stronger baseline.
Quality Gate may advance only if: decision correctness ≥ 90%; evidence-inflation errors = 0; critical-boundary misses = 0; unrelated-task false routing ≤ 1; mean ≥ A + 5.
E2 promotion is scoped to the tested task class and model. No v0.3 is created by the benchmark.

## 14. Falsification criteria

The thesis "the Compound layer adds measurable value" is falsified if any of: C − A < +5; C ≤ B with equal critical recall; C loses on holdouts; C costs > 15% more tokens/latency with no quality gain; a new systematic routing failure appears in C; judge×human agreement is asymmetric (rule 8); D ≈ C (the value is a prompt, not a resource).

## 15. Conditions under which Compound loses (pre-registered decision rules, evaluated by `e2 aggregate`)

1. C − A mean < +5.
2. C − B in (−2, +2) and C input tokens ≥ 0.85 × B → tie without efficiency.
3. C > B on ≤ 3 of 9 tasks.
4. Bootstrap 90% interval of C − B contains −2 and its upper bound is < +5.
5. A critical expected issue with C recall < B recall on ≥ 2 tasks.
6. C `route_invalid` + `error` > 5 of 27 runs.
7. `vendor_reads = 0` in ≥ 50% of C runs while C ≥ B → compare with D.
8. Judge×human agreement < 80% on C but ≥ 90% on B → result void.
9. C fails ≥ 2 of 6 near-miss runs where A/B pass.
10. Quality Gate: A decision correctness ≥ 90% and C − A < 10, or C hallucinated-evidence count > A.

## 16. Conditions under which a wrapper should be removed — Resource Value Audit (pre-registered)

Question: **"If Compound Interface Review disappeared and we used the upstream directly, what would actually be lost?"**

Only concrete properties count, each answered from the run artifacts after the pilot: routing (did C route non-interface work away better than B?) · integration (did C's handoff format change any downstream action?) · contract (did the `Severity → Finding → Evidence → Concrete change` contract improve actionability over B's table?) · evidence (does C carry regression/evidence behaviour B lacks?) · learning (did any "reusable lesson" become an actual ledger entry?) · system context (did C use project context B could not?) · specialization (did C's review order change what was found first?).

If the honest answer is "almost nothing": **REMOVE / SIMPLIFY** is the recorded outcome and a valid Compound result. Authorship preserves nothing. This audit is scheduled after the pilot and is not run here.

## 17. Exact commands

Zero-cost (this round, all executed and green):

```bash
npm run e2:install          # pinned promptfoo 0.122.2 + playwright-core 1.63.0 + axe-core 4.13.0; no browsers, no model SDKs
npm run e2 -- self-test     # mutation tests for every gate
npm run e2 -- fetch-upstream
npm run e2 -- validate      # task gates, config gates, CI gate, promptfoo schema validation (no provider contacted)
npm run e2 -- fixtures      # Playwright + axe → tasks/ground-truth/ (local Chromium; E2_CHROMIUM_PATH if needed)
npm run e2 -- workspaces
npm run e2 -- freeze        # tasks/tasks.json + environment.json
npm run e2 -- dry-run       # promptfoo eval with the exec: echo provider → results/dry-run (SYNTHETIC)
npm run e2 -- plan-runs
```

Future paid runtime (blocked by default; every command aborts with `Blocked: E2 model runtime requires explicit paid-runtime authorization.` unless the flag is exactly `YES`):

```bash
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite jakub   --model <tested-model> --judge <judge-model> --execute
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite jakub-d --model <tested-model> --judge <judge-model> --execute   # add --filter-metadata d_subset=true
E2_PAID_RUNTIME_CONFIRMED=YES npm run e2:runtime:DANGEROUS-PAID -- --suite qg      --model <tested-model> --judge <judge-model> --execute
npm run e2 -- routes results/runtime/<file>.results.json --suite=jakub
npm run e2 -- blind  results/runtime/routes.json results/runtime/<file>.results.json
# human review offline → npm run e2 -- unblind … → npm run e2 -- aggregate … --scores=…
```

Order before any full run: smoke (one task per condition) → negative control (C config in a workspace without `jakub.md` must fail) → judge known-negatives → replace cost assumptions with measured telemetry → full run.

## Appendix A — Future runtime roles (not executed in this round)

INTERFACE SPECIALIST (reads the upstream contract as data; never the resource under test designing its own eval) · QUALITY SPECIALIST · SKEPTIC (argues the layer adds nothing) · EVIDENCE REVIEWER (checks every claim against CEL and forbidden language) · HUMAN HANDOFF. These are model-executed roles and therefore belong to the paid phase. In this round every artifact was authored in the main session without spawning agents.

## Appendix B — Evidence debt per resource (this round)

| | Interface Review (`jakub`) | Quality Gate (`cd-quality-gate`) |
| --- | --- | --- |
| KNOWN | contract is deterministic (E1, 88/88); upstream contract verified verbatim (HIGH/MEDIUM/LOW, cap 15, Block/Approve); wrapper duplicates a severity model | contract is deterministic (E1); policy documents are shareable with the baseline |
| UNKNOWN | value over A and B; whether value lives in prompt, routing or upstream material | whether the skill decides better than the policy documents alone |
| TESTED (zero-cost) | task gates, workspace isolation, route classification, blinding, aggregation, anti-billing guard, deterministic fixture ground truth | same, plus trap fixtures |
| NOT TESTED | any model behaviour | any model behaviour |
| FAILURES | none observed — no runtime | none observed — no runtime |
| HOLDOUT | J07, J08, J09 (unseen) | Q07, Q08, Q09, Q11 (unseen) |
| NEXT EVIDENCE NEEDED | authorized smoke + negative control + judge calibration, then the 81+9-run A/B/C/D pass | authorized smoke + judge calibration, then the 66-run A/C pass |
| Runtime uplift | not measured | not measured |

## Appendix C — What remains blocked by cost

Smoke runs, negative control, judge calibration, every A/B/C/D run, human craft review of real outputs, telemetry, the Resource Value Audit answers, any CEL change. Legitimate zero-billing runtime paths: (a) a local open model on the user's own machine under the framework's LOCAL-STRESS lane (never E2); (b) the exec-provider dry-run (harness wiring only, done). Using this session's CLI or subagents is model usage on a corporate account and is excluded.
