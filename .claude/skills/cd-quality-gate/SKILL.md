---
name: cd-quality-gate
description: Evaluates Compound Design skills, agents, plugins, MCP resources and reusable AI workflows before promotion. Separates construction quality from evidence maturity and blocks claims that exceed the available proof.
version: 0.2.0
---

# CD Quality Gate

A resource is not valuable because its prompt sounds sophisticated. It is valuable when its construction is strong **and** evidence supports its intended job.

Compound Design v0.2 separates these dimensions instead of blending them into one number.

## 1. CDQI Construction Score — 0 to 10

Read `compound-design/quality/CD-QUALITY-INDEX.md`.

Score:
- scope & contract — 15%
- routing & boundaries — 15%
- domain grounding — 15%
- instruction design — 15%
- output contract & actionability — 15%
- evalability — 15%
- maintainability & provenance — 10%

CDQI describes resource construction. It is not an effectiveness score.

## 2. CEL — Compound Evidence Level

Read `compound-design/quality/CD-EVIDENCE-LEVELS.md`.

- `E0` — inspection only
- `E1` — deterministic contract/regression evidence
- `E2` — controlled baseline comparison + repeated runtime runs
- `E3` — independent/cross-model evidence + real representative tasks
- `E4` — field evidence + regression history across versions

Never infer a higher CEL from reputation, model quality, prompt length or CDQI.

## Required evaluation layers

### Static validity
Check structure, naming, frontmatter/manifest, scope, conflicts, permissions, provenance and required license boundaries.

### Routing
Test:
- positive trigger;
- negative trigger;
- near-miss/sibling routing.

Prefer trace/tool evidence over self-report when runtime support exists.

### Outcome
Compare the same representative task:
- no resource vs candidate; or
- previous best version vs candidate.

Hold model, task, files, permissions and environment constant where possible.

### Reliability
Repeat nondeterministic runs. Three runs is a POC minimum, not statistical proof.

### Efficiency
Record tokens, latency, tool calls, steps, retries/errors and cost when available.

### Trajectory
Inspect specialist choice, tools, arguments, sequence, unnecessary calls, retries and recovery.

### Human craft
For UX, motion, visual quality and writing, keep an independent human review in the loop.

## Meta-evaluation

The quality gate itself must be evaluated.

At minimum:
- it must reject evidence inflation;
- it must distinguish CDQI from CEL;
- it must not approve a resource solely on score;
- it must require an artifact for claimed external evaluation;
- it must preserve `not measured` for missing telemetry.

## Decision states

Return one:
- `DRAFT`
- `STRONG_CONSTRUCTION`
- `NEEDS_WORK`
- `CANDIDATE`
- `CD_APPROVED`
- `DEPRECATED`

A high CDQI can still be `DRAFT` or `STRONG_CONSTRUCTION` when CEL is low.

## Promotion defaults

`CD_APPROVED` requires:
- no unresolved P1/critical failure;
- deterministic expectations pass;
- primary-job outcome is better than baseline or equal with meaningful efficiency gain;
- repeated runtime runs are acceptably stable;
- routing has no systematic false-positive pattern;
- provenance/security boundaries are correct;
- human craft review passes when applicable.

Default minimum evidence level for `CD_APPROVED`: `E2`.

For high-consequence resources, require `E3` or explicit human governance.

## Output contract

Return:

1. Resource
2. Version
3. CDQI
4. CDQI breakdown
5. CEL
6. Evidence artifacts
7. Baseline
8. Runtime/repeatability
9. Routing
10. Outcome delta
11. Efficiency delta
12. Critical failures
13. Decision
14. Next eval
15. Next version target

Never manufacture benchmark results or external badges.
