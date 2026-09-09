---
name: cd-interface-review
description: "Review an interface for the defects that materially cost a user — reachability, comprehension, hierarchy, states, contrast, reflow, copy and system consistency. Report-only. Use when interface craft is the question; route backend, motion-only and AI-reliance concerns elsewhere."
argument-hint: "[what to review]"
---

# Interface Review

**What in this interface materially costs the user?**

A prioritised, evidence-bearing review. Not a redesign, not a taste inventory, not a rewrite of the design system.

## When to use

- An interface exists — as code, markup or a rendered page — and its craft is in question.
- `cd-verify` or `cd-polish` needs interface judgment.
- A surface has drifted from the rest of the product.

## When not to use

- Nothing is built yet — that is `cd-model`.
- The request is backend, data or migration work with no user-facing surface. Name it as outside and stop.
- The question is only whether an animation is right — that is `cd-motion-review`.
- The question is how a user should rely on AI output — that is `cd-ai-interaction-review`.

## Scope

Owns: operability (keyboard reachability and order, focus visibility, accessible names, target size), comprehension (hierarchy, labels, grouping, density), state coverage (empty, loading, partial, error, permission, offline), colour and contrast, typographic system use, reflow and small-viewport behaviour, copy that names actions and recoveries, and consistency with the product's own patterns.

Does not own: correctness of logic, tests, security, performance, backend design, motion timing, AI reliance. Each is named once and routed, never developed.

## Inputs

The interface under review. The design system, its tokens and components. A rendered page when one is available. Deterministic accessibility output when the project has it.

## Procedure

Inspect in this order, so decoration cannot hide a structural failure:

1. **Reachability and operability.** Can every action be reached and operated without a pointer, with a visible focus, under a name a screen reader can announce.
2. **Task and hierarchy.** Can the primary task be found. Does visual weight match consequence.
3. **States.** Every state the surface can be in, especially the ones nobody designed.
4. **Contrast and colour.** Computed, not estimated. Meaning never carried by colour alone.
5. **Reflow.** Content usable at small widths and at zoom without a horizontal scroll.
6. **Typography and spacing** as system use, not as preference.
7. **Copy.** Labels that name the action, errors that name the recovery, empty states that name the next step.
8. **Consistency** with sibling surfaces and existing components.

Then apply the gates in `compound-design/FINDING-CONTRACT.md` — hydration, confidence, consolidation, materiality, scope — before reporting anything.

## Write authority

**Report-only.** Modifies no source file. `default_review_mode: apply-local` permits local edits limited to findings already in the report; even then, nothing is committed or pushed. An instruction for this run overrides the default in either direction.

## Artifact rule

- **lightweight** — the report is the output. Normal case.
- **bounded** — a written report for a review spanning several surfaces.
- **durable** — none. A recurring defect class worth keeping goes to `cd-compound`.

## Output contract

Emits `compound-design/FINDING-CONTRACT.md` verbatim: `id, scope, severity, confidence, evidence, impact, recommendation, verification_state, source`, severity `blocker | major | minor`, sections `FINDINGS`, `UNCONFIRMED`, `NOT VERIFIED`, `OUT OF SCOPE`, `FILTERED`. Prefixed by:

```
COVERAGE   <what was inspected, and by what means — static, rendered, tooling>
```

Fixes are ordered by cost, cheapest first: delete the problem, use the platform default, reuse what the project already has, correct the value, and only then add something new. A fix that adds where deleting was available is itself a finding.

## Forbidden

Redesigning. Proposing a new visual language, palette or type scale. Reporting preference as defect. One finding per instance of the same root cause. Claiming contrast, reflow or screen-reader behaviour was checked when it was inferred. Reviewing backend, tests, security or performance. Exhaustive cosmetic inventory. Inventing a standard reference.

## Missing dependency

No rendered page: static findings are `observed`, anything needing a render is `not-verified`. No accessibility tooling: check what static inspection supports, mark the rest `not-verified`, and never report the absence of a tool as a pass. No design system: review for internal consistency and say the project has none.

## Completion

Done when the ordered inspection was performed or its gaps declared, every finding passes the gates, unverifiable claims are labelled, out-of-scope concerns are named once and routed, and the coverage line claims no more than was inspected.

## Provenance

Compound Design resource, authored for this framework. The escalation classes (missing accessible name, invisible focus, pointer-only reachability, contrast failure, meaning by colour alone, destructive action without confirmation or undo, truncation without access to the full value, error without recovery), the cheapest-fix ordering and the "a check you cannot run is not verified" rule are adapted from the MIT-licensed interface skills of Jakub Krehel recorded in `compound-design/SOURCES.md`; the accessibility criteria follow WCAG normative rules. This resource does not load, require or ship that upstream at runtime, does not impersonate its author, and implies no endorsement.
