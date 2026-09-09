# Compound Design E2 — Source Parity Check

Status: PRE-BENCHMARK (verified 2026-09-09, zero-cost)
Repository: `compoundmetrics` (standalone)
Purpose: identify where Compound Design adds intentional value vs where it accidentally duplicates or drifts from upstream resources before controlled runtime tests.

## Decision rule

An upstream-derived Compound resource should survive only if it adds one or more of these:

1. better routing between specialists;
2. a clearly stronger output contract for the Compound workflow;
3. organization-specific/system-specific boundaries;
4. measurable quality uplift;
5. equal quality with meaningful efficiency gain;
6. regression/evidence behavior that upstream does not provide.

If none of those are demonstrated, prefer direct upstream use.

---

## Jakub parity

### Upstream current behavior inspected

Current Jakub skills separate concerns deliberately:

- `interface-review` owns change scope and blast-radius resolution;
- `better-interface` owns review mode, severity, finding cap, consolidation, verification and verdict;
- domain `better-*` skills own UI, typography, layout, color, accessibility and writing rules;
- `interface-review` explicitly says not to duplicate or override the severity/output/verdict rules owned by `better-interface`;
- correctness, tests, security and performance are outside interface-review scope.

Sources reviewed on 2026-09-09:
- https://github.com/jakubkrehel/skills
- https://github.com/jakubkrehel/skills/blob/main/skills/interface-review/SKILL.md
- https://github.com/jakubkrehel/skills/blob/main/skills/better-ui/review-output.md

### Compound `jakub` v0.2 current delta

Compound adds:

- cross-resource routing back to `cd`, `emi`, and `cd-ai-interaction-review`;
- a review order that starts with task/hierarchy before polish;
- a compact `Severity → Finding → Evidence → Concrete change → Reusable lesson` handoff;
- a Compound/Promote hook for reusable lessons.

### Accidental divergence found

`jakub` v0.2 also defines its own P1/P2/P3 severity model while the current upstream stack centralizes severity/verdict under `better-interface`.

This is not automatically wrong because Compound `jakub` is a separate orchestration resource, but it creates three risks:

1. duplicated severity semantics;
2. possible disagreement between upstream HIGH/MEDIUM/LOW and Compound P1/P2/P3;
3. unnecessary wrapper behavior that may not improve outcomes.

### Hypothesis to test

> The useful Compound delta is orchestration + prioritization + reusable-learning handoff, not a parallel copy of Jakub's domain rules or severity system.

### Candidate direction — DO NOT PROMOTE YET

If runtime evidence supports it, a future patch should:

- keep upstream domain rules authoritative;
- preserve upstream review severity/verdict when an upstream review is being executed;
- add Compound-only metadata separately: `CD routing`, `Reusable lesson`, `Promote candidate`;
- avoid restating rules that `better-interface` already owns.

This is a candidate, not a release change. v0.2.0 remains the controlled baseline.

---

## Emil parity

Current pinned Emil source is still aligned with upstream main as of the latest visible repository commit on 2026-08-21.

Compound `emi` should remain a thin routing/specialization layer around motion and interaction judgment. No E2 work is scheduled for Emil until the first benchmark validates the measurement approach with `jakub` and `cd-quality-gate`.

---

## Every / Compound Engineering parity

Compound Engineering already provides a mature implementation loop and review/compound primitives. Compound Design should not reproduce these under new names merely for ownership.

Current relevant upstream behavior:

- `ce-code-review` selects review personas based on actual diff risk and confidence-gates findings;
- `ce-compound` writes reusable learning back into the repository so future brainstorm/plan/work cycles start with more context;
- the project's value is the return loop, not ceremony.

Compound Design's distinct job is therefore narrower:

- Design Engineering specialization;
- interface and AI-interaction judgment;
- reusable resource quality/evidence lifecycle;
- promotion of proven design knowledge into reusable system capability.

---

## Anthropic Skill Creator parity / caution

Anthropic's current Skill Creator is relevant as an optimization/evaluation resource, but it must not be treated as a single source of truth.

Fresh public inspection on 2026-09-09 found open issues affecting measurement integrity, including:

- documented artifact schema mismatches;
- installed-skill shadowing in trigger evals;
- MCP startup contamination of per-query timeout;
- trigger-route detection issues;
- Windows execution problems.

Therefore:

- use Skill Creator as a supplemental optimizer/evaluator;
- do not use its score alone for CEL advancement;
- prefer Promptfoo or another independent harness for the primary controlled benchmark;
- require raw artifacts and environment metadata before accepting results.

---

## Source Parity conclusion

We found one material pre-benchmark risk: the Compound `jakub` wrapper may be duplicating upstream review semantics instead of adding measurable leverage.

That is exactly what the E2 benchmark must answer.

The benchmark must compare:

- A — model without a specialist resource;
- B — current upstream Jakub stack directly;
- C — Compound `jakub` v0.2.0;

No v0.3 decision is allowed from source inspection alone.


---

## Verification record — 2026-09-09 (read-only, no model runtime)

- `jakubkrehel/skills`: remote `HEAD == 267330e1adfc66a718fb65fa6918c1f06d0a689e` (equal to the pin in `SOURCES.md`; **no drift**). Plugin manifest `interfaces` v1.6.3, MIT. Vendored for the benchmark by `e2 fetch-upstream` (gitignored, SHA-verified, LICENSE preserved).
- `emilkowalski/skills`: remote `HEAD == d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7` (equal to the pin; no drift). Reference only.
- `EveryInc/compound-engineering-plugin`: `HEAD == b36047e1b4b2123df2f3529bf04b5f2a7c5f84e4`, MIT. Reference only.

### Upstream `better-interface` contract (verbatim facts used to design condition B and the anchors)

- Severity: `HIGH` (blocks a task, misleads, hides content/controls, data-loss risk, repeated systemic failure) · `MEDIUM` (harms comprehension, efficiency, adaptability, consistency) · `LOW` (isolated polish).
- Cap: at most 15 findings; escalation triggers rank above the cap; "never pad to reach the cap".
- 13 escalation triggers are `HIGH` on sight (no accessible name; no visible focus; pointer-only reachability; ignores `prefers-reduced-motion`; clipped at 320px/200% zoom; failing contrast; meaning by color alone; destructive action without confirm/undo; truncation without access; content behind an uncued edge; error naming no recovery; semantic color misuse; state change by motion alone).
- Consolidation: one root cause is one finding, every location listed in the same row.
- Verification: "A check you cannot run is Not verified, never a finding." Read-only by default.
- Verdict: `Block` when any `HIGH` remains, `Approve` otherwise; `Approve` claims the coverage reported.
- Remediation order: Delete → use the platform → reuse what the project has → correct the value → add.
- `interface-review` is user-invoked (`disable-model-invocation: true`) and resolves git scope; it hands severity/verdict to `better-interface`. Not applicable to inline benchmark tasks → **B = `better-interface` stack, model-invoked via the local plugin.**
- No evals or tests ship upstream.

### Consequence for the benchmark

Ground truth must not be the upstream checklist (that would teach to B's test). Expected items therefore carry provenance limited to fixture facts, WCAG normative rules, computed contrast, axe, Playwright and explicit product requirements; decoys penalize checklist over-flagging; semantic items stay `PENDING HUMAN AUTHORING`. The severity-model duplication in Compound `jakub` remains the central hypothesis for the Resource Value Audit (`E2-PILOT-PLAN.md` §16).
