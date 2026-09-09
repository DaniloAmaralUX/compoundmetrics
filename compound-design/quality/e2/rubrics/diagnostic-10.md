# Secondary diagnostic rubric — 10 dimensions (NO SCORE)

Status: `SECONDARY / DIAGNOSTIC` · `RUNTIME NOT EXECUTED`

Rule: **7 dims = decision · 10 dims = diagnosis.** The primary 7-dimension rubric in `primary-7.md` (pre-registered in `BENCHMARK-PROTOCOL.md`) is the only score used by any decision rule. The 10 dimensions below carry no weights, are never summed, and never create a second official score. They exist to explain a result, locate where a condition won or lost, structure the Human Craft Review, drive failure analysis, generate eval candidates and feed the Learning Ledger.

## Interface Review — 10 diagnostic dimensions

Each is annotated on a 3-level scale (`weak · adequate · strong`) with a one-line citation from the output. No numbers.

| # | Dimension | Question | Do not credit |
| --- | --- | --- | --- |
| 1 | correctness | Are the stated defects real for this fixture? | confident tone |
| 2 | prioritization | Does the order follow user/system consequence? | severity labels without reasoning |
| 3 | materiality | Do findings change what a builder would do next? | volume of findings |
| 4 | actionability | Is each change concrete (element → change)? | generic advice ("improve accessibility") |
| 5 | evidence/consequence | Is each finding tied to a specific element and a stated consequence? | a section titled "Evidence" |
| 6 | noise | How much output is cosmetic inventory or repetition? | length |
| 7 | severity calibration | After mapping the output's own scale to 3 levels, do levels match expected criticality? | using any particular label set |
| 8 | preservation of intent | Does it respect product intent and the prompt's scope, without redesign? | "innovative" proposals |
| 9 | accessibility awareness | Are the accessibility items in the ground truth identified (not merely mentioned)? | citing WCAG or frameworks |
| 10 | overall usefulness | Would a practitioner make a better decision with this output? Holistic, unweighted. | sophistication of language, obeying the wording of any resource |

## Quality Gate — 10 diagnostic dimensions

| # | Dimension | Question |
| --- | --- | --- |
| 1 | evidence boundary correctness | Does the recorded level match what the artifacts support? |
| 2 | construction/evidence separation | Is construction quality kept apart from effectiveness, in any vocabulary? |
| 3 | claim discipline | Are claims limited to what was measured? |
| 4 | promotion correctness | Is the state right, and scoped? |
| 5 | ability to reject insufficient evidence | Does it say no when the artifacts are thin, however polished the resource looks? |
| 6 | false-positive rate | Does it block things that should pass (Q05, Q06)? |
| 7 | handling of critical boundaries | Licensing, destructive autonomy, contaminated holdout, mismatched environments. |
| 8 | actionability | Is the next evidence step concrete? |
| 9 | consistency | Do the three repeats reach the same state? |
| 10 | hallucinated evidence | Any invented number, file or certification. **Automatic major penalty in the primary rubric** (cap 40, `NEEDS_WORK`). |

## Permitted uses

- Explain a primary-score difference between conditions (which diagnostic dimensions moved).
- Structure the blind Human Craft Review sheet.
- Failure analysis: which dimension a losing condition failed and whether the failure reproduces across repeats.
- Generate eval candidates for the Learning Ledger (a reproducible failure → regression case, with a separate holdout kept unseen).
- Detect a structural gap in the primary rubric — recorded as a future protocol proposal, never applied during the pilot.

## Forbidden uses

- Summing, weighting or averaging the 10 dimensions into a score.
- Using a diagnostic dimension to override a decision rule.
- Editing the primary rubric, tasks or thresholds after outputs exist.

## Mapping 7 → 10

See `primary-7.md` §"7 → 10 mapping".
