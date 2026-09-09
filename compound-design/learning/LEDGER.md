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

## v0.3.0-alpha.1 — architecture round

```yaml
id: CD-20260909-008
observed_at: 2026-09-09
project: compoundmetrics-v0.3
resource: resource-registry
resource_version: 0.2.1
model_runtime: none (deterministic)
task: validate the registry while adding v0.3 resources
expected: the registry conforms to resource.schema.json
observed: `publicName` had been added to every resource in an earlier release but never added to the schema, which declares additionalProperties:false — so the registry had been violating its own schema, undetected, because nothing ever ran the schema against it
human_correction: added publicName, status, supersedes, supersededBy and path to the schema; allowed cdqi null and a prerelease release; wrote a schema validator into cd.mjs and wired `cd:registry` into CI
impact: medium
reproducible: yes
privacy: public-safe
candidate_eval: yes — cd selftest "schema: unknown property rejected"
lesson: a schema that is never executed is documentation, not a contract
```

```yaml
id: CD-20260909-009
observed_at: 2026-09-09
project: compoundmetrics-v0.3
resource: e2-benchmark-pack
resource_version: 0.2.1
model_runtime: none
task: move the resources under E2 test out of the active runtime without disturbing the experiment
expected: pinning the resource files is enough to keep the benchmark stable
observed: the Quality Gate resource instructs the model to read two quality documents at runtime; those live documents were still being copied into the benchmark workspace, so editing them in v0.3 would have silently changed a benchmark input while every digest still matched
human_correction: pinned the transitive runtime inputs alongside the resource; added RESOURCE-MANIFEST.json with byte-equivalence proof against the baseline commit, `e2 verify-legacy` re-deriving each baseline blob from git, and a mutation test
impact: high
reproducible: yes
privacy: public-safe
candidate_eval: yes — e2 self-test "legacy v0.2 resources byte-equivalent to the baseline commit"
lesson: a task-set digest proves the tasks did not change and nothing else; a resource's inputs include everything it reads at runtime, not only its own file
```

```yaml
id: CD-20260909-010
observed_at: 2026-09-09
project: compoundmetrics-v0.3
resource: cd-plugin-validator
resource_version: 0.3.0-alpha.1
model_runtime: none
task: forbid legacy runtime identifiers on active surfaces
expected: a word-boundary match on the legacy id finds only legacy usage
observed: `\bresource-lab\b` matched inside the active id `cd-resource-lab`, failing three healthy files; a hyphen is a word boundary
human_correction: lookbehind excluding the active prefix, plus a comment explaining why
impact: low
reproducible: yes
privacy: public-safe
candidate_eval: no — covered by the plugin gate passing on the real tree
lesson: an identifier ban needs to know which identifiers legitimately contain it
```

```yaml
id: CD-20260909-011
observed_at: 2026-09-09
project: compoundmetrics-v0.3
resource: claim-guard
resource_version: 0.3.0-alpha.1
model_runtime: none
task: stop inflated evidence claims reaching an active surface
expected: banning the words E2, validated and proven would work
observed: a word ban makes the evidence documents unwritable — the CEL ladder has to say "demonstrated uplift in tested scope" to define E2, and the forbidden-terms list has to quote the terms it forbids
human_correction: matched claim phrases rather than words, and skipped any line that negates, forbids or defines the phrase; added self-tests for both directions
impact: medium
reproducible: yes
privacy: public-safe
candidate_eval: yes — cd selftest claim cases, including the four negative ones
lesson: a guard that cannot tell a rule from a violation blocks the rule
```
