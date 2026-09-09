# CEL — Compound Evidence Levels

CEL measures **how strongly a resource's effectiveness has been demonstrated**.

It is deliberately separate from CDQI construction quality.

## Levels

### E0 — Inspection
Evidence:
- prose/static review;
- source/provenance inspection;
- no executed evaluation artifact required.

Claim allowed:
`well-constructed / validation pending`

### E1 — Deterministic
Evidence:
- executable or reproducible contract checks;
- static invariants;
- deterministic regression assertions;
- artifact with pass/fail results.

Claim allowed:
`contract-tested`

Not allowed:
`proven to improve outcomes`

### E2 — Controlled runtime
Evidence:
- relevant baseline;
- same representative tasks;
- candidate vs baseline/previous version;
- repeated nondeterministic runs;
- outcome and routing deltas;
- cost/latency where relevant.

Claim allowed:
`demonstrated uplift in tested scope`

### E3 — Independent
Requires E2 plus at least one:
- independent/cross-model grader;
- separate evaluator framework/provider;
- blinded human comparison;
- representative external benchmark.

The artifact must identify evaluator, version/model and rubric.

Claim allowed:
`independently corroborated in tested scope`

Using a vendor's model is not vendor certification.

### E4 — Field evidence
Requires:
- real-use evidence over time;
- regression history across multiple versions;
- meaningful failure corpus;
- stable behavior across relevant runtime/model changes;
- rollback/version history.

Claim allowed:
`field-proven in defined scope`

## Current state

The current Compound Design resources remain at E1. No resource may be described as E2 until controlled runtime baseline artifacts exist.
