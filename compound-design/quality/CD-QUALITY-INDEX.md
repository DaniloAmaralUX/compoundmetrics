# CDQI v0.2 — Construction Quality

The Compound Design Quality Index is a **construction score**, not a proof-of-effectiveness score.

v0.2 deliberately removes runtime evidence from the numeric score. Evidence is reported separately through CEL (`CD-EVIDENCE-LEVELS.md`).

This fixes a v0.1 ambiguity where resource construction and evidence maturity could influence the same number.

## Weighted rubric

Each dimension is scored 0–10.

| Dimension | Weight | Question |
| --- | ---: | --- |
| Scope & contract | 15% | Is the primary job explicit, bounded and internally coherent? |
| Routing & boundaries | 15% | Is it clear when to use, not use, and defer to a sibling resource? |
| Domain grounding | 15% | Are relevant sources/principles correctly specialized rather than copied decoratively? |
| Instruction design | 15% | Are instructions ordered, decision-oriented and free of avoidable conflict? |
| Output & actionability | 15% | Does the output contract drive concrete action rather than commentary? |
| Evalability | 15% | Can important claims, routing and failures be tested? |
| Maintainability & provenance | 10% | Can the resource evolve safely with clear source/license boundaries? |

Formula:

`CDQI = Σ(dimension × weight)`

## Interpretation

- `0.0–3.9` — weak/unsafe construction
- `4.0–5.9` — experimental
- `6.0–6.9` — promising
- `7.0–7.9` — good internal resource
- `8.0–8.9` — strong construction
- `9.0–9.6` — mature construction with unusually strong boundaries/evalability
- `9.7–10.0` — reserved; almost no material construction weakness

A resource can score 8.8 at `E0`. That means it is well designed, not that it works.

## v0.2 construction audit

| Resource | Version | CDQI | Key construction change |
| --- | ---: | ---: | --- |
| `cd` | 0.2.0 | 8.45 | smallest-sufficient routing + explicit AI interaction branch + evidence separation |
| `jakub` | 0.2.0 | 8.55 | primary job/non-goals + severity + ordered review contract |
| `emi` | 0.2.0 | 8.50 | primary job/non-goals + motion decision sequence + severity |
| `cd-quality-gate` | 0.2.0 | 8.75 | CDQI/CEL separation + meta-evaluation + stronger promotion defaults |
| `cd-resource-lab` | 0.2.0 | 8.65 | hypothesis-first improvement + falsification/holdout checks |
| `cd-ai-interaction-review` | 0.1.0 | 8.35 | six bounded AI Interaction Quality gates + explicit non-generic trigger |

These are internal construction audits. They do not assert vendor certification or runtime uplift.

## Version comparability

v0.1 scores were readiness scores under a different rubric. Preserve them historically but do not plot a numeric “improvement” from v0.1 to v0.2 as if the formulas were identical.

v0.2 becomes the new baseline for future CDQI deltas.

## Critical rule

A P1 security, licensing, correctness or destructive-action boundary failure blocks promotion regardless of CDQI.
