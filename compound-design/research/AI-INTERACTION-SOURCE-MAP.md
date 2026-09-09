# AI Interaction Quality — Source Map

Purpose: keep `cd-ai-interaction-review` grounded without copying a 39-item checklist into the framework.

## Primary-source hierarchy

1. Microsoft Human-AI Interaction Guidelines / appropriate reliance research.
2. Google PAIR guidance on user needs, mental models, explainability, feedback/control and graceful failure.
3. Mixed-initiative interaction research for allocation of initiative and control.
4. Current model/provider behavioral specifications when a gate depends on model behavior.
5. Secondary syntheses such as the 39 Principles article as discovery aids, not sole authority.

## Compound six-gate map

| Compound gate | Research question | Evidence we eventually need |
| --- | --- | --- |
| AI Fit | Is probabilistic AI preferable to deterministic UI for this job? | task success/cost/clarity comparison |
| Reliance | Can users accept good output and detect/reject bad output? | overreliance + underreliance cases |
| Legibility | Is enough state, source or plan visible for a sound decision? | verification time + error detection |
| Human Control | Can users edit, reject, stop, approve and undo cheaply? | recovery success + intervention cost |
| Autonomy | Does action power scale with consequence/reversibility? | approval/rollback behavior on high-risk tasks |
| Evolution | Can model/provider/data changes be regression-tested? | same-suite behavior deltas across versions |

## Guardrails

- No principle becomes an absolute rule merely because it appears in a source.
- Prefer a testable design hypothesis over a copied maxim.
- Accessibility remains a general product responsibility, not duplicated here.
- Privacy/security/legal concerns may trigger escalation; this skill is not a substitute for specialist review.
- Provider names are provenance, never certification.
