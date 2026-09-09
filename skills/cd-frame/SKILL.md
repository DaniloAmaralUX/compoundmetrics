---
name: cd-frame
description: "Establish what a piece of work is actually solving before anything is designed or built — problem, user, outcome, constraints, scope, risk and success conditions. Use at the start of a change whose shape is not obvious; skip it for work whose problem is already settled."
argument-hint: "[what you are trying to do]"
---

# Frame

**What are we actually solving?**

Frame decides whether the work is worth doing, for whom, and what would count as done. It does not design the behaviour and does not plan the implementation.

## When to use

- A change whose problem statement is still moving, or where two people would describe the goal differently.
- Before `cd-model` on anything with more than one plausible shape.
- When a request arrives as a solution ("add a filter panel") and the underlying need has not been stated.
- When the risk of building the wrong thing is higher than the cost of one framing pass.

## When not to use

- The problem is already settled and written down — go to `cd-model`, or straight to `cd-build` for a small local change.
- Copy edits, dependency bumps, renames, single-line fixes.
- Product strategy for the whole project — that is `cd-strategy`, and Frame reads it rather than rewriting it.

## Scope

Owns: problem, affected user, current behaviour and its cost, desired outcome, constraints, explicit non-goals, risks, open decisions, success conditions, and whether AI belongs in the solution at all.

Does not own: information architecture, flows, states, entities (`cd-model`); implementation (`cd-build`); visual craft (`cd-polish`); product direction (`cd-strategy`).

## Inputs

The request in the user's words. `STRATEGY.md` when it exists, read for whether the work is on-strategy — never rewritten here. Existing artifacts under `<root>/frames/` and `<root>/solutions/` that name the same area, so a known constraint is not rediscovered. The codebase, read only to ground a question, never to answer it.

## Procedure

1. **Restate the request** in one paragraph, in problem terms rather than solution terms. Show it and invite correction before going further.
2. **Discover prior learning — before asking anything.** Run the bounded deterministic search defined in `compound-design/DISCOVERABILITY-CONTRACT.md`:

   ```bash
   node compound-design/tools/cd.mjs discover --context "<the request, verbatim>"
   ```

   Every result is carried into constraints with its `id` named as the source. Report the outcome explicitly, including `none found`. This is the step that makes run two start smarter than run one; skipping it silently is a contract violation.
3. **Ask only what the repository cannot answer.** One question at a time, through the host's blocking question tool when one is available; a numbered list on the visible surface otherwise. Never invent an answer and never skip the question silently.
4. **Name the user and the outcome.** Who is affected, what they can do afterwards that they cannot do now.
5. **State constraints and non-goals.** Technical, product, legal, timeline. A non-goal is worth more than another requirement.
6. **Judge AI fit** when the solution might contain user-facing AI: what the AI is responsible for, what stays deterministic, what the human decides, and the cost of a wrong output. If AI is not clearly better than deterministic UI here, say so.
7. **Write success conditions** that can be checked by `cd-verify` later.
8. **Decide the artifact level** by the rule below, then hand off.

## Write authority

May write one frame artifact under `<root>/frames/` and nothing else. Never edits source code, `STRATEGY.md`, configuration, or another skill's artifact. Never commits, pushes, or opens a pull request.

<!-- cd-artifact-root:start -->
**Resolve the artifact root `<root>` before composing any artifact path.**

- **Read** `docs_root` from `<repo-root>/.compound-design/config.yaml` only (`<repo-root>` = `git rev-parse --show-toplevel`). Never from `config.local.yaml`. Unset → `<root>` is `docs`.
- **Validate** a set value: a repo-relative directory whose real, symlink-resolved path stays inside the repository and is neither the repository root nor under `.git/`. Otherwise stop with an error naming `docs_root` and its value — never fall back to `docs`.
- **Use** `<root>` as the sole artifact location: create it if absent, compose each path as `<root>/<subdir>`, and never also read or write `docs` when a root is configured.

`node compound-design/tools/cd.mjs config --json` resolves and validates this deterministically.
<!-- cd-artifact-root:end -->

## Artifact rule

An artifact must be earned.

- **lightweight** — the answer fits in the conversation and nothing durable was decided. Say it and stop. No file.
- **bounded** — a short written frame in the response, at most one open decision for the user. No file.
- **durable** — write `<root>/frames/YYYY-MM-DD-<slug>.md` only when a decision, a constraint or a risk was established that a future reader would otherwise have to rediscover. Multi-session work, more than one plausible shape, or a real risk qualifies; a clear small change does not.

## Output contract

```
PROBLEM        <one paragraph, problem terms>
USER           <who is affected>
OUTCOME        <what they can do afterwards>
CONSTRAINTS    <technical, product, legal, timeline>
NON-GOALS      <what this work will not do>
PRIOR LEARNING <id · title · why it applies here, one line each — or "none found">
AI FIT         <only when user-facing AI is in play; otherwise omit>
RISKS          <what could make this the wrong thing to build>
OPEN DECISIONS <what the human still has to decide>
SUCCESS        <checkable conditions for cd-verify>
NEXT           <cd-model | cd-build | stop>
```

## Forbidden

Designing the solution. Writing implementation plans. Deriving the goal from the codebase and presenting it as the user's intent. Filling an unanswered question with a plausible guess. Using a prior learning without naming its `id`. Reporting "none found" without having run discovery. Writing a durable artifact for work that did not earn one. Claiming a constraint that no source supports.

## Missing dependency

No `STRATEGY.md`: proceed and say the work is unanchored. No `<root>/solutions/` or no discovery tool: proceed, and record that prior learning could not be searched rather than reporting "none found". No blocking question tool: fall back to a numbered list on the visible surface. Unresolvable `docs_root`: stop with the error rather than writing anywhere.

## Completion

Done when the problem, user, outcome, constraints, non-goals and success conditions are stated; every open decision is either answered or explicitly listed as the human's; and the next step is named. A frame with unanswered decisions listed is complete, not blocked.

## Provenance

The artifact-must-be-earned rule and the "ask only what the environment cannot settle" discipline are adapted from Every's Compound Engineering (MIT, `b36047e1`); the AI-fit questions come from the Human-AI interaction sources recorded in `compound-design/research/AI-INTERACTION-SOURCE-MAP.md`. Composition, boundaries and output contract are Compound Design's.
