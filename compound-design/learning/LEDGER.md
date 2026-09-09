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
