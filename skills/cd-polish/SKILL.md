---
name: cd-polish
description: "Make a working interface feel deliberate — hierarchy, typography, spacing, colour, copy, interaction feel and consistency. Runs only after the product works; it is refinement, not repair and not redesign."
argument-hint: "[what to polish]"
---

# Polish

**Is it deliberate?**

Working is the baseline, not the goal. Polish removes the accidental: the spacing nobody chose, the third shade of grey, the label written by whoever was closest.

## When to use

- The behaviour is correct and verified, and the result still feels unconsidered.
- Before showing work to users or stakeholders.
- When a surface has visibly drifted from the rest of the product.

## When not to use

- Something is broken, missing or unverified — Polish never substitutes for `cd-build` or `cd-verify`.
- The interface structure itself is wrong — that is `cd-model`.
- A full redesign is wanted; Polish refines the existing direction, it does not replace it.

## Scope

Owns: visual hierarchy, typographic scale and rhythm, spacing and density, colour use within the system, copy and microcopy, feedback and empty states, interaction feel, and consistency with the rest of the product.

Delegates: structural interface critique to `cd-interface-review`, motion decisions to `cd-motion-review`. Polish applies their judgment; it does not duplicate their procedures.

## Inputs

The working interface. The design system, its tokens and its existing components. Sibling surfaces to compare against. Any Verify report, so polish does not paper over an unfixed defect.

## Procedure

1. **Confirm it works.** If Verify has open `blocker` or `major` findings, stop and route back. Polishing a broken surface is how a defect ships looking finished.
2. **Compare against siblings.** Most polish findings are drift from something the product already does well.
3. **Reduce before adding.** The first move is deleting an inconsistency, not introducing a refinement.
4. **Use the system's tokens.** A one-off value needs a reason; "it looked better here" applies to the token, not to this instance.
5. **Read the copy as a user in a hurry.** Labels that name the action, errors that name the recovery, empty states that name the next step.
6. **Judge interaction feel** — feedback timing, perceived speed, state changes that are legible without motion.
7. **Keep changes reversible and small**, each tied to a named improvement.

## Write authority

May modify presentation-level source inside the stated scope: styles, tokens, copy, component composition. Never changes behaviour, data, routing or business logic — a behavioural change discovered during Polish is routed, not made. Never commits, pushes or publishes.

## Artifact rule

- **lightweight** — the diff plus a short list of what changed and why. Normal case.
- **bounded** — a written pass in the response when the changes span several surfaces.
- **durable** — none. A rule worth reusing across projects goes to `cd-compound` as a candidate.

## Output contract

```
BASELINE     <what already worked, confirmed before touching anything>
CHANGES      <surface → change → why it is more deliberate>
TOKENS       <system values used; one-offs listed with their reason>
COPY         <text changed, before → after>
LEFT ALONE   <what was deliberate already, or out of scope>
ROUTED       <behavioural or structural issues sent elsewhere>
NEXT         <cd-verify to re-check | cd-compound | stop>
```

## Forbidden

Polishing over a known defect. Redesigning under the name of polish. Introducing a new visual language, palette or type scale. Adding motion for decoration. Changing behaviour. Producing an exhaustive list of trivia. Claiming an improvement in feel that was not exercised.

## Missing dependency

No design system: polish toward internal consistency with the most-used existing pattern and say the project has no system. No Verify report: check the obvious failure states first and say verification was not available. No sibling surfaces: say the pass had no comparison baseline.

## Completion

Done when every change is tied to a named improvement, one-off values are justified or removed, nothing behavioural was changed, and anything routed elsewhere is listed.

## Provenance

The reduce-before-adding order and the "working is the baseline" boundary are Compound Design's, informed by the interface and motion sources recorded in `compound-design/SOURCES.md`. No upstream author endorses this procedure.
