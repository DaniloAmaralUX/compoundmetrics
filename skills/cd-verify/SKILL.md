---
name: cd-verify
description: "Check whether what was built matches what was decided — requirements, behaviour, states, accessibility, responsiveness and AI interaction where it applies. Report-only by default; applying fixes is a separate explicit instruction."
argument-hint: "[what to verify, or a model/contract path]"
---

# Verify

**Did reality match intention?**

Verify compares the built thing against the contract and reports findings. Reviewing is not permission to change.

## When to use

- After `cd-build`, before anything ships.
- On existing work whose behaviour is in doubt.
- Whenever a claim needs checking rather than repeating.

## When not to use

- Nothing has been built yet.
- The question is craft refinement of something already correct — that is `cd-polish`.
- The subject is a reusable AI resource's evidence and promotion — that is `cd-quality-gate`.

## Scope

Owns: requirement coverage, behaviour against the contract, state coverage, accessibility, keyboard operation, responsive behaviour, error and empty states, and design-system consistency. Routes interface craft to `cd-interface-review`, motion to `cd-motion-review`, and user-facing AI to `cd-ai-interaction-review`, then merges their findings under one contract.

Does not own: deciding what should have been built, implementing fixes, or judging evidence for reusable resources.

## Inputs

The contract or requirement list. The implementation. The project's real checks. Where a browser is available, the rendered result. Deterministic accessibility tooling when the project has it.

## Procedure

1. **Establish the contract.** Verify against something written. With no contract, state the requirements you are verifying against and that you inferred them.
2. **Run the deterministic checks first** — the project's typecheck, lint, tests, build, and any accessibility checker it ships. Automated results are `observed`; their absence is not a pass.
3. **Walk the contract item by item.** Each is met, not met, or not verifiable here.
4. **Walk the states** the model named. An unreachable or undefined state is a finding.
5. **Check operation, not only appearance**: keyboard reachability and order, focus visibility, labels and names, contrast, reflow at small widths, error recovery.
6. **Route specialist concerns** rather than guessing at them.
7. **Apply the finding contract's gates** before reporting: hydration, confidence, consolidation, materiality, scope.
8. **Report.** Do not fix.

## Write authority

**Report-only by default** — no source file is modified. `default_review_mode` in `.compound-design/config.yaml` may be `report-only` (default) or `apply-local`; even under `apply-local`, changes are local, limited to findings in the report, and never committed or pushed. An instruction for this run overrides the default in either direction.

Never edits tests to make them pass, and never disables or skips a failing check.

## Artifact rule

- **lightweight** — the report is the output. Normal case.
- **bounded** — a written report in the response for a review with more than a handful of findings.
- **durable** — Verify writes no durable artifact of its own. A reproducible failure worth keeping goes to `cd-compound`.

## Output contract

Emits the shared shape defined in `compound-design/FINDING-CONTRACT.md` — fields `id, scope, severity, confidence, evidence, impact, recommendation, verification_state, source`; severity `blocker | major | minor`; verification state `observed | inferred | not-verified`; sections `FINDINGS`, `UNCONFIRMED`, `NOT VERIFIED`, `OUT OF SCOPE`, `FILTERED`. It adds one line before them:

```
COVERAGE   <what was checked, and by what means>
VERDICT    <ready | ready with fixes | not ready>
```

`ready` may only claim the coverage actually reported.

## Forbidden

Fixing under a report-only run. Presenting an unverified claim as observed. Reporting a check as run when it was not. Listing every cosmetic difference. Inventing a standard, a metric or a threshold. Approving a surface that was not inspected. Emitting a finding without evidence and impact.

## Missing dependency

No contract: verify against stated inferred requirements and label them. No browser: rendered behaviour is `not-verified`, never assumed. No accessibility tooling: check what static inspection supports and mark the rest `not-verified`. A specialist skill unavailable: name the uncovered domain rather than improvising it.

## Completion

Done when every contract item has a state, every finding passes the gates, everything unverifiable is listed as such, and the verdict claims no more coverage than was performed.

## Provenance

Report-only-by-default with explicit apply, and the deterministic gates, are adapted from Every's Compound Engineering review architecture (MIT, `b36047e1`). Accessibility checks follow WCAG normative rules. The finding contract is Compound Design's.
