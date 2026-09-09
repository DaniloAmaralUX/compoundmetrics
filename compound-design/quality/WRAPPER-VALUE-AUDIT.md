# Wrapper Value Audit

A Compound wrapper must add a real system property. Naming, reformatting or copying an upstream skill is not enough.

## Decision test

For each wrapper, map:

| Field | Question |
| --- | --- |
| Upstream capability | What does the source already solve? |
| Compound addition | What contract, routing, integration or learning mechanism is genuinely added? |
| Duplication risk | What is repeated without clear leverage? |
| Testable hypothesis | What should improve if the wrapper is valuable? |
| Removal test | What breaks if we call upstream directly? |

## `jakub` v0.2 finding

- Upstream already owns interface review routing and verdict/severity behavior.
- Compound adds explicit non-goals, cross-domain delegation boundaries, a prioritized evidence-bearing output contract and integration with the Compound loop.
- Possible duplication: a parallel P1/P2/P3 severity model.
- E2 hypothesis: Compound orchestration should improve prioritization/boundary discipline or measurable efficiency without reducing material-issue recall.
- Removal condition: if direct upstream is equal or better and the Compound wrapper adds no measurable integration advantage, replace the wrapper with a thin adapter or call upstream directly.

## Governance rule

`more Compound code` is not a success metric.

A deletion that reduces duplication while preserving or improving outcomes is a valid version improvement.
