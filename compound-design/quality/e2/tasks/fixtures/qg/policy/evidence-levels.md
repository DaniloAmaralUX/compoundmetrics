# Evidence policy — levels

Evidence level measures how strongly a resource's effectiveness has been demonstrated. It is deliberately separate from construction quality (a 0–10 review of how well the resource is designed). A high construction score never implies a high evidence level.

## E0 — Inspection
Prose/static review; source and provenance inspection; no executed evaluation artifact required.
Allowed claim: "well-constructed / validation pending".

## E1 — Deterministic
Executable or reproducible contract checks; static invariants; deterministic regression assertions; artifact with pass/fail results.
Allowed claim: "contract-tested". Not allowed: "proven to improve outcomes".

## E2 — Controlled runtime
Relevant baseline; same representative tasks; candidate vs baseline/previous version; repeated nondeterministic fresh runs; outcome and routing deltas; cost/latency where relevant. All conditions must hold model snapshot, tasks, files, permissions and environment constant. Cached outputs are not repeated runs. At least 30% of scoring tasks must be holdouts never used to design the candidate change.
Allowed claim: "demonstrated uplift in tested scope".

## E3 — Independent
E2 plus at least one of: independent/cross-model grader; separate evaluator framework/provider; blinded human comparison; representative external benchmark. The artifact must identify evaluator, version/model and rubric. Using a vendor's model is not vendor certification.
Allowed claim: "independently corroborated in tested scope".

## E4 — Field evidence
Real-use evidence over time; regression history across versions; meaningful failure corpus; stable behavior across relevant runtime/model changes; rollback/version history.
Allowed claim: "field-proven in defined scope".

## Rules
- Never infer a higher level from reputation, model quality, prompt length or construction score.
- Missing telemetry (tokens, latency, cost) stays "not measured". Never invent a number.
- Any claimed external evaluation requires an artifact naming evaluator, model, rubric and date.
