---
name: cd-build
description: "Implement a modelled behaviour in the existing architecture, verify it locally, and report exactly what changed. Use to turn a decided contract into working product behaviour; it never publishes, merges, or absorbs work it did not create."
argument-hint: "[what to build, or a model artifact path]"
---

# Build

**Make it real.**

Build executes a decision that has already been made. It does not re-open the model, and it does not acquire authority over the repository just because it is writing to it.

## When to use

- A behaviour contract exists — from `cd-model`, a plan, an issue, or a clear request — and needs implementing.
- A small, local change whose behaviour is obvious and needs no modelling.

## When not to use

- The behaviour is undecided — go to `cd-model`.
- The problem is undecided — go to `cd-frame`.
- The change is a review or a critique — that is `cd-verify`.

## Scope

Owns: implementation inside the existing architecture, local verification of what was implemented, and an accurate report of what changed.

Does not own: deciding behaviour, reviewing craft, publishing, release, or anything outside the stated scope of the change.

## Inputs

The behaviour contract. The existing architecture, primitives and conventions. The project's own checks — its lint, typecheck, test and build commands, read from its configuration rather than assumed.

## Procedure

1. **Read the contract and the code it touches.** Never implement from memory of the plan.
2. **Prefer existing primitives.** A new component, hook, utility or pattern needs a reason that a reviewer would accept; "it was faster to write a new one" is not that reason.
3. **Check the working tree before writing.** Uncommitted work that is not yours is not yours to include, move, revert or stash. Name it and leave it alone.
4. **Implement the smallest change that satisfies the contract.** Scope creep in Build is invisible until review, which is where it costs the most.
5. **Run the project's own checks** — the real commands, not an approximation. Fix what your change broke.
6. **Verify the behaviour**, not just the compile: exercise the states the contract names, at the sizes and inputs it names.
7. **Report changes exactly**, file by file, including anything you touched that the contract did not ask for and why.

## Write authority

May create and modify source files **inside the stated scope of the change**, and nothing else.

Never, without an explicit instruction for this run: commit, push, open or merge a pull request, tag a release, delete or rewrite work it did not create, stash or revert uncommitted changes, edit CI configuration, edit `.compound-design/config.yaml`, or change any evidence, registry or benchmark artifact.

Uncommitted user work is untouchable. If it blocks the change, stop and say so.

## Artifact rule

- **lightweight** — the diff and the change report are the whole output. This is the normal case; Build rarely earns a document.
- **bounded** — a written summary in the response when the implementation deviated from the contract and the deviation needs a decision.
- **durable** — Build itself writes no durable artifact. A learning worth keeping goes to `cd-compound`; a continuity record goes to `cd-handoff`.

## Output contract

```
IMPLEMENTED   <contract item → how it is satisfied>
FILES         <path → what changed there>
UNPLANNED     <anything touched beyond the contract, and why>
CHECKS        <command → result, using the project's real commands>
BEHAVIOUR     <what was exercised and what it did>
NOT DONE      <contract items left, with the reason>
UNTOUCHED     <pre-existing uncommitted work that was left alone>
NEXT          <cd-verify | cd-polish | stop>
```

## Forbidden

Publishing anything. Committing or pushing unless this run was explicitly told to. Including someone else's uncommitted work in a change. Reporting a check as passing without running it. Silently widening scope. Building a parallel implementation of something the project already has. Disabling, skipping or deleting a test to make a check pass.

## Missing dependency

No contract: implement only what is unambiguous, and list what you did not implement rather than inventing it. No test or lint command: report that the project exposes none, rather than claiming a check passed. A check that fails for reasons unrelated to the change: report it separately and do not fix it under this change.

## Completion

Done when every contract item is implemented or explicitly listed as not done with a reason, the project's own checks were actually run and reported with their real results, and the change report matches the diff.

## Provenance

The write-authority boundary and the "never absorb work the user did not offer" rule are adapted from Every's Compound Engineering execution discipline (MIT, `b36047e1`). Everything else is Compound Design's.
