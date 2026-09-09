# Human Craft Review — protocol and templates

Status: `PROTOCOL PREPARED` · `NOT EXECUTED` · human review is never run automatically.

The model under test must not be the only judge of its own output, and a model grader must not be the only judge either. The Human Craft Review is a blind, per-task judgment by a person. It is the second interpretation priority after paired task differences (see `E2-PILOT-PLAN.md` §12).

## What the reviewer receives

Produced by `e2 blind`:

- `blind/payload.json` — outputs under neutral ids (`R-xxxx`), shuffled with a recorded seed, with resource/agent/skill/upstream identifiers redacted (`[REDACTED-ID]`, count recorded per output). Condition labels are rejected at build time.
- `blind/human-score-sheet.csv` — one row per output, columns below.
- The task prompt, the frozen `expected[]` / `decoys[]` / `expected_decision` for that task, and the anchors in `rubrics/primary-7.md`.

The reviewer never receives `blind/unblind-key.json` until every row is filled. **Declared limitation:** format fingerprints (tables, verdict lines, severity vocabulary) cannot be removed and may hint at the condition; reviewers note when they suspect it (`format_hint_noticed`).

## Six questions (per output)

1. Would I make a better decision using this output? (`better_decision_yn`)
2. Did the review find what really matters? (`found_what_matters_yn`)
3. Did it invent a problem? (`invented_problem_yn`; list ids in `artificial_finding_ids`)
4. Did it miss something obvious? (`missed_obvious_yn`; list ids in `critical_issue_missed_ids`)
5. Did it get stuck in its own rubric or format? (`stuck_to_rubric_yn`)
6. Would a simpler answer have been equally useful? (`simpler_baseline_equal_yn`)

Plus the primary 7 dimensions (0–10 each, same anchors as the model judge) and a free-text `qualitative_comment`.

## Score sheet columns

```
blind_id, task_id, holdout, truncated,
correct_detection_30, precision_20, prioritization_15, actionability_15, boundary_10, verification_5, concision_5, primary_total_100,
better_decision_yn, found_what_matters_yn, invented_problem_yn, missed_obvious_yn, stuck_to_rubric_yn, simpler_baseline_equal_yn,
critical_issue_missed_ids, artificial_finding_ids, qualitative_comment
```

Optional columns the reviewer may add: `format_hint_noticed`, `diagnostic_notes` (10-dimension annotations, `weak|adequate|strong`).

## Divergence log (human × judge)

After unblinding, every row where the human and the model judge differ by ≥ 2 anchor steps on any dimension, or disagree on `hallucinated_evidence`, is recorded in `blind/divergence-log.csv`:

```
blind_id, task_id, condition, dimension, judge_value, human_value, who_is_right_if_known, reason, action
```

`action` ∈ `keep-human`, `keep-judge`, `unresolved`, `judge-prompt-issue`, `rubric-gap`. The human may disagree with the judge; the disagreement is kept, not averaged away. Judge×human agreement is reported per condition; if agreement is < 80% on one condition but ≥ 90% on another, decision rule 8 voids the result.

## What human judgment is — and is not

- Human scores are evidence inputs for this pilot. They are **not** converted into permanent ground truth. A human observation becomes `expected[]` only through a separate authoring pass (`pending_human` → authored, with provenance `human-blind` and the reviewer's initials/date), and only for future task-set versions.
- A single reviewer is a POC minimum. Two independent reviewers with reported agreement are the target.
- The reviewer is not asked which framework they prefer, and never learns conditions before finishing.

## Procedure

1. `e2 routes <results>` → `e2 blind <routes> <results>`.
2. Reviewer fills `human-score-sheet.csv` offline. No model assistance.
3. `e2 unblind blind/unblind-key.json blind/human-score-sheet.csv` → `scores.unblinded.json`.
4. `e2 aggregate <routes> --scores=scores.unblinded.json` → `summary.json` + `DECISION.draft.md` (skeleton; the decision text is written by a human).
5. Fill `divergence-log.csv`; file Learning Ledger entries for reproducible failures.
