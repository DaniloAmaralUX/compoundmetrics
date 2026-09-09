# Design benchmark

Compound Design Audit Score of 11 design milestones (7 tools) against the frozen Compound Design Audit v3.6.0 ruler.

| File | What |
| --- | --- |
| `METHODOLOGY.md` | order of operations, score formula, bias controls, limitations |
| `rubric/` | frozen ruler: `compound-design-audit.json` (54 items), `RUBRIC-MANIFEST.json` (source SHA, hashes), `audit.html.frozen`, `ITEM-CLASSIFICATION.json` (deterministic vs judgment, declared before scoring) |
| `RANDOMIZATION.json` | seed, anonymised labels, order; mapping revealed only after `results/*/judgment.json` was frozen |
| `results/<V>/deterministic.json` | per surface × item: state, measured, expected, evidence |
| `results/<V>/judgment.json` | blinded verdicts with reasons |
| `results/<V>/source-craft.json` | instrument B (cl-audit 8 categories, static subset) |
| `results/<V>/site.json` | site-level aggregation per item and category |
| `screens/` | anonymised judgment material (`blind/DESIGN-X/…`) and the contact sheet inputs |
| `SUMMARY.json`, `DESIGN-EVOLUTION.csv` | scores and coverage per milestone and category |
| `EVOLUTION.md` | delta analysis (V(n) − V(n−1)), regressions, persistent failures |
| `reports/FINDINGS.json` | every FAIL with evidence (Findings Contract) |
| `reports/learning-yield.json` | findings → learning states → resource candidates |

Reproduce: `bash case-study/scripts/build-milestones.sh` → `node case-study/scripts/capture.mjs` → `node case-study/scripts/audit-deterministic.mjs` → `node case-study/scripts/audit-source.mjs` → `node case-study/scripts/randomize.mjs` → (judge) → `node case-study/scripts/aggregate.mjs`.
