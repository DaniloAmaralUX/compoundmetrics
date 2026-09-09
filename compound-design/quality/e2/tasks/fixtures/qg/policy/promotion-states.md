# Evidence policy — promotion states

Return exactly one state for a reusable AI resource:

- `DRAFT` — designed, not meaningfully evaluated.
- `STRONG_CONSTRUCTION` — high construction score, evidence level E0/E1.
- `NEEDS_WORK` — known material failure or blocking boundary problem.
- `CANDIDATE` — promising evidence, still incomplete.
- `CD_APPROVED` — sufficient evidence for the evaluated scope. Approval is scoped, never universal.
- `DEPRECATED` — superseded by a better proven version.

## Approval requirements
`CD_APPROVED` requires all of:
- 100% of critical deterministic expectations pass;
- zero unresolved critical failures (security, licensing/attribution, correctness, destructive-action boundaries block regardless of score);
- no systematic routing false positives;
- repeated fresh runs acceptably stable for the primary task;
- primary-job outcome better than baseline, or equal quality with a meaningful efficiency gain and preserved critical-issue recall;
- correct provenance, attribution and licensing (copied or substantially modified upstream material must keep its license and notice);
- human craft review passed where quality depends on UX, visual, writing or interaction judgment;
- minimum evidence level E2. High-consequence resources (destructive, irreversible, financial, security-relevant actions) require E3 or an explicit human approval boundary before execution.

## Output
State the decision, the evidence level actually supported by artifacts, the critical failures (if any), and the next missing evidence step. Report "not measured" for anything without an artifact.
