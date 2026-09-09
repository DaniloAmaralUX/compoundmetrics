---
name: cd-motion-review
description: "Decide whether motion should exist here at all, then whether the motion that exists is interruptible, coherent and respectful of user preference. Report-only. Use when interaction feel or animation is the question, not general interface craft."
argument-hint: "[what to review]"
---

# Motion Review

**Should this move, and if so, does it move well?**

Most motion questions are answered by removing the motion. This review asks that first.

## When to use

- An interaction has animation, transition or temporal behaviour whose quality is in question.
- A surface feels slow, jumpy or disorienting and the structure is already correct.
- `cd-polish` or `cd-verify` needs motion judgment.

## When not to use

- The interface structure or hierarchy is the problem — that is `cd-interface-review`.
- Nothing is built yet, or the behaviour is undecided — that is `cd-model`.
- The concern is data, logic or backend behaviour.

## Scope

Owns: whether motion is justified, what state or causality it communicates, interruption and reversal, exit behaviour, perceived speed, continuity between states, reduced-motion support, and whether the project's existing motion tokens or library can express it.

Does not own: layout, hierarchy, typography, colour, copy, correctness, performance profiling beyond motion cost.

## Inputs

The interaction under review. The project's motion tokens, easing scale and animation library. A rendered page when one is available; motion claims from static code are `inferred` at best.

## Procedure

1. **Should it exist?** What does the motion tell the user that a static change would not. If the answer is "it looks nice", the finding is to remove it.
2. **What does it communicate?** State change, causality, spatial relationship, or nothing.
3. **Interruption.** What happens when the user acts mid-animation. Motion that cannot be interrupted is a defect, not a detail.
4. **Exit.** What happens on the way out, and whether the surface can be re-entered mid-exit.
5. **Perceived speed.** Whether the motion makes the product feel faster or adds waiting to something that was instant.
6. **Continuity.** Whether the element that moved is recognisably the same element.
7. **Reduced motion.** Whether `prefers-reduced-motion` is honoured with an equivalent, non-animated path — not with a broken one.
8. **Cost.** Whether the existing tokens or library already express it.

Then apply the gates in `compound-design/FINDING-CONTRACT.md` before reporting.

## Write authority

**Report-only.** Modifies no source file. `default_review_mode: apply-local` permits local edits limited to findings already in the report; nothing is committed or pushed. An instruction for this run overrides the default.

## Artifact rule

- **lightweight** — the report is the output. Normal case.
- **bounded** — a written report when several interactions are reviewed together.
- **durable** — none. A reusable motion rule goes to `cd-compound` as a candidate.

## Output contract

Emits `compound-design/FINDING-CONTRACT.md` verbatim, prefixed by:

```
COVERAGE   <interactions inspected, and by what means — static, rendered>
VERDICT    <motion justified | motion should be removed | mixed>
```

Fix ordering, cheapest first: remove the animation, use the platform or library default, reuse the project's tokens, correct duration or easing, and only then add new motion.

## Forbidden

Recommending animation as decoration. Specifying durations or easings without saying what they communicate. Claiming rendered behaviour — interruption, timing, reduced-motion — was observed when it was inferred from code. Reviewing layout, typography or copy. Introducing a new motion system when the project has one. Reporting a taste preference as a defect.

## Missing dependency

No rendered page: every timing, interruption and reduced-motion claim is `inferred` or `not-verified`, never `observed`. No motion tokens: review for internal consistency and say the project has no motion system. No reduced-motion handling anywhere in the project: report it once as a systemic finding, not per animation.

## Completion

Done when the existence question was answered first, interruption and exit were addressed for every animation in scope, reduced motion was checked or declared unverifiable, and every finding passes the gates.

## Provenance

Compound Design resource, authored for this framework. The decision order (should it exist → what does it communicate → interruption → exit → perceived speed → continuity → reduced motion), the delete-first remediation ordering and the treatment of uninterruptible motion as a defect are adapted from the MIT-licensed design-engineering skills of Emil Kowalski recorded in `compound-design/SOURCES.md`. This resource does not load, require or ship that upstream at runtime, does not impersonate its author, and implies no endorsement.
