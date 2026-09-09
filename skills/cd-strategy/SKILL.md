---
name: cd-strategy
description: "Create or maintain STRATEGY.md — the project anchor stating what the product is, who it serves, how it succeeds and where effort is going. Frame and Model read it when it exists. Use when starting a product, adding an anchor to an existing repo, or when direction changes."
argument-hint: "[optional: section to revisit, e.g. users or metrics]"
---

# Strategy

**What is this product, and what is it for?**

An anchor, not a plan. Strategy says what the product is; features belong to Frame, behaviour to Model, schedules to the tracker.

## When to use

- No `STRATEGY.md` exists and Frame keeps having to re-litigate direction.
- Direction changed and the anchor no longer matches what is being built.
- A specific section is stale — metrics, users, positioning.

## When not to use

- Planning a feature, a release or a sprint.
- Recording an implementation decision — that is `cd-model` or a solution document.
- Nothing about direction has changed. Rewriting a healthy anchor is churn.

## Scope

Owns the sections it authors in `STRATEGY.md`: purpose, positioning, users, how it succeeds (and where those metrics live), current tracks, boundaries.

Does not own: features, prioritisation, implementation, evidence policy, or any section of the file another author wrote.

## Inputs

The user's answers — the primary source. The repository, used only to ground a sharper question: README, existing `STRATEGY.md`, `docs/CONCEPTS.md`, what the code is organised around, where recent attention went.

## Procedure

1. **Build a repo model and show it.** Three to five lines on what the product appears to be, who it appears to serve, and where attention has gone, each with its source named. Invite correction before the first question.
2. **Route by file state.** No file → interview. File exists → review and update only what is stale.
3. **Interview one question at a time**, through the host's blocking question tool when one is available, otherwise a numbered list. Push back once on a vague answer; accept the second answer and mark the section as worth revisiting rather than looping.
4. **Record where metrics live**, not what they read today. A number in an anchor is stale within a week.
5. **Show the diff before writing.** The user gets an edit pass.
6. **Respect other authorship.** A file, or a section, that this skill did not author is read by meaning and edited minimally in its own shape — never restructured, never given uninvited headings. A section marked author-approved is not edited at all: report the conflict instead.

## Write authority

May create or edit `STRATEGY.md` (or the path in `strategy_path`), and only the sections it authors, after showing the change. Never edits source code, configuration or another skill's artifact. Never commits or pushes.

## Artifact rule

- **lightweight** — a question about direction that the existing anchor already answers: answer it, write nothing.
- **bounded** — a proposed section shown in the response for the user to accept.
- **durable** — `STRATEGY.md` itself. It is the one durable artifact this skill produces, and it is a living document rather than a dated one.

## Output contract

```
REPO MODEL   <what the repo suggests, each line with its source>
ROUTE        <first run | update: sections touched>
SECTIONS     <section → what it now says → what changed>
DEFERRED     <sections the user could not sharpen, named for a later pass>
FILE         <path written>
READERS      <which skills will read this: cd-frame, cd-model>
```

## Forbidden

Deriving the strategy from the repository and presenting it as the user's. Turning the anchor into a roadmap or a feature list. Restructuring a document this skill does not own. Writing metric values instead of metric locations. Expanding the document because it looks thin — short is a feature.

## Missing dependency

No repository content: say so in one line and run the interview ungrounded. No blocking question tool: numbered list on the visible surface. `strategy_path` points somewhere unwritable: stop and report it.

## Completion

Done when the file exists at the resolved path, every section this skill authored came from an answer the user saw and could edit, deferred sections are named, and nothing owned by another author was restructured.

## Provenance

The anchor-not-plan boundary, "the user answers and the repo only grounds the question", "short is a feature", and the ownership test for a file another author wrote are adapted from Every's Compound Engineering `ce-strategy` (MIT, `b36047e1`). Section set and contract are Compound Design's.
