# Compound Learning Ledger

The ledger captures learning from work that was going to happen anyway. It does not require extra model calls and it does not upgrade CEL by itself.

Its purpose is to turn real failures, corrections and decisions into future regression cases and authored knowledge.

## Entry format

```yaml
id: CD-YYYYMMDD-NNN
observed_at: YYYY-MM-DD
project: <redacted/public-safe project label>
resource: <resource id>
resource_version: <semver>
model_runtime: <model/runtime if known>
task: <what the person was trying to do>
expected: <expected behavior>
observed: <what actually happened>
human_correction: <what the person changed or rejected>
impact: low | medium | high
reproducible: yes | no | unknown
privacy: public-safe | internal | confidential
candidate_eval: <yes/no and proposed eval id>
lesson: <smallest reusable lesson>
```

## Capture rules

1. Record only information safe for the destination repository. Never copy client secrets, credentials, personal data or confidential source material into this ledger.
2. Prefer behavior over opinion: describe what happened and what had to change.
3. One failure may become a regression eval; a separate holdout must remain unseen during the fix.
4. A successful use can be captured when it reveals a reusable mechanism, not merely because the output looked good.
5. Ledger entries are evidence inputs, not proof of uplift.

## Promotion path

`real work → ledger entry → reproducible failure → regression eval → minimal change → falsification/holdout → version decision`

## First observation to preserve

The v0.2 Source Parity Check found that Compound `jakub` has a parallel P1/P2/P3 severity layer while current upstream Jakub centralizes review verdict/severity in its own review architecture. This is a hypothesis for E2, not a defect claim. If the wrapper does not add measurable leverage, removal/simplification is a valid Compound outcome.

## Entries

Entries below record reproducible failures of the **experiment infrastructure** found while preparing the E2 pilot at zero cost. They are not model failures and do not change CEL.

```yaml
id: CD-20260909-001
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none (deterministic preparation)
task: run the pre-registered E2 pack in the standalone repository
expected: condition B (upstream direct) loads the pinned Jakub plugin
observed: promptfoo config pointed at compound-design/vendor/jakub-skills, which did not exist in the standalone (submodule dropped during extraction)
human_correction: added `e2 fetch-upstream` (pinned SHA, LICENSE check, drift recorded, pin never moved); self-test mutation "missing upstream" / "wrong upstream SHA"
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #4/#5
lesson: a benchmark condition that depends on an external checkout must verify the checkout, not assume it
```

```yaml
id: CD-20260909-002
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none
task: keep ground truth unreachable by the model under test
expected: the agent workspace contains fixtures only
observed: working_dir was the repository root with Read/Grep/Glob, so the task file (assertions), rubrics and protocol were readable by every condition
human_correction: disposable per-condition workspaces built by `e2 workspaces`; gate rejects task files, rubrics and ground-truth markers inside any workspace
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #2
lesson: "do not look" is not a defence; isolation must be structural
```

```yaml
id: CD-20260909-003
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none
task: respect the protocol's own holdout rule
expected: at least 30% holdout tasks per suite
observed: 2 of 8 (25%) in both suites; the protocol contradicted its own pack
human_correction: task sets v1.0.0 with 3/9 (33%) and 4/11 (36%); gate in `e2 validate`
impact: medium
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #1
lesson: pre-registered rules need a machine check or they drift silently
```

```yaml
id: CD-20260909-004
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none
task: score outputs fairly across conditions
expected: assertions measure review quality without favouring a condition
observed: keyword assertions rewarded vocabulary and expected internal sibling names (`emi`, `cd-ai-interaction-review`, `specialist`) that only the Compound condition could know; two prompts spelled out the answer ("Treat it as a holdout case", "Report root causes…"); Quality Gate prompts recited the decision criteria
human_correction: assertions demoted to non-scoring routing gates; prompt-hygiene gate; Quality Gate tasks rewritten as situations with artifacts and shared policy docs for the baseline; semantic `acceptable_equivalents`
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #3
lesson: an assertion that names the resource's own vocabulary measures the resource's presence, not its value
```

```yaml
id: CD-20260909-005
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none
task: configure repeated fresh runs and a symmetric turn budget
expected: 3 fresh runs per task; limits that do not bias against the condition that reads more files
observed: `defaultTest.options.repeat` is not a promptfoo key (runs would silently be 1); `max_turns 6` was below what the Compound agent needs to read its upstream files; `apiKeyRequired: false` would have used a local Claude Code session (corporate account)
human_correction: `evaluateOptions.repeat: 3`, `max_turns 12`, `max_budget_usd 1.0`, `apiKeyRequired: true`; templates only renderable through the guarded `paid-runtime`
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #16 (templates) and validate
lesson: harness keys must be verified against the harness version, not remembered
```

```yaml
id: CD-20260909-006
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none (exec echo provider)
task: prove blinding on the dry-run pipeline
expected: blinded payload carries no condition marker
observed: the harness's own echo provider printed `condition=A` into every output; the blind gate rejected the payload
human_correction: echo provider no longer prints the condition; gate kept
impact: medium
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test #11 and dry-run
lesson: the blinding gate must be adversarial to the harness itself, not only to the model
```

```yaml
id: CD-20260909-007
observed_at: 2026-09-09
project: compoundmetrics-e2-pilot
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none (exec echo provider)
task: separate provider errors from failed gates
expected: a failed deterministic gate is a scored run with gate_pass=false
observed: promptfoo stores failed assertions in `error`; the first classifier counted them as provider errors (7 of 20 rows per condition)
human_correction: classifier uses `failureReason` (1 = assert, 2 = error) and output presence
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — dry-run counts
lesson: infra failures and model failures must never share a column
```
