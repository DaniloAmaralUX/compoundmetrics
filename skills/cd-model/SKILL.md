---
name: cd-model
description: "Turn a framed problem into how the product must behave — information architecture, flows, states, entities, edge cases and the contract Build implements. Use when behaviour needs deciding before code; skip it when the behaviour is already obvious and local."
argument-hint: "[what to model, or a frame artifact path]"
---

# Model

**How should the product behave?**

Frame owns *what* and *why*. Model owns *behaviour* and the *system contract*. It is the last place where a decision is cheap.

## When to use

- Behaviour, states or data shape must be decided before code is written.
- More than one screen, role, state or entity is involved.
- An agentic or AI-mediated feature, where instructions, data, tools and actions have to be separated.
- After `cd-frame`, or directly when the problem was already settled elsewhere.

## When not to use

- The behaviour is obvious and contained in one component — go to `cd-build`.
- The problem itself is unclear — go back to `cd-frame`.
- Visual refinement of behaviour that already works — that is `cd-polish`.

## Scope

Owns: information architecture, entities and their relationships, routes and screen relationships, roles and permissions, states and transitions, edge and error cases, empty and loading behaviour, the interaction model, and the executable contract Build implements. For AI-mediated features it also owns the boundary between **instructions** (what the system may obey), **data** (what it may read or cite), **tools** (what it may call) and **actions** (what state it may change).

Does not own: problem definition, implementation, visual craft, motion detail, evidence policy.

## Inputs

The frame (artifact or conversation). `STRATEGY.md` when it exists. The existing system: current components, design system, routes, data model, naming. Prior learning under `<root>/solutions/` for this area.

## Procedure

1. **Discover prior learning first.** `node compound-design/tools/cd.mjs discover --context "<what is being modelled>"` per `compound-design/DISCOVERABILITY-CONTRACT.md`. A behavioural constraint a previous run already paid for is cheaper here than anywhere later. Name each result's `id` where it shapes the model.
2. **Read the existing system.** Name the components, patterns and primitives that already exist. A model that invents a parallel system where one exists is a defect, not a design.
3. **Model entities and their relationships**, using the project's own vocabulary.
4. **Map routes and screen relationships**: what leads where, what is reachable from where.
5. **Enumerate states** for every surface that has more than one: empty, loading, partial, error, permission-denied, offline, success. An unlisted state becomes a bug.
6. **Define transitions** and what triggers each.
7. **Cover edge cases** the frame's constraints imply.
8. **Separate the four boundaries** for AI or agentic behaviour, and state what a wrong output costs.
9. **Write the behaviour contract** so `cd-build` can implement it and `cd-verify` can check it without re-deciding anything.
10. **Decide the artifact level**, then hand off.

## Write authority

May write one model artifact under `<root>/plans/` and nothing else. Never edits source code, configuration or another skill's artifact. Never commits, pushes or opens a pull request.

<!-- cd-artifact-root:start -->
**Resolve the artifact root `<root>` before composing any artifact path.**

- **Read** `docs_root` from `<repo-root>/.compound-design/config.yaml` only (`<repo-root>` = `git rev-parse --show-toplevel`). Never from `config.local.yaml`. Unset → `<root>` is `docs`.
- **Validate** a set value: a repo-relative directory whose real, symlink-resolved path stays inside the repository and is neither the repository root nor under `.git/`. Otherwise stop with an error naming `docs_root` and its value — never fall back to `docs`.
- **Use** `<root>` as the sole artifact location: create it if absent, compose each path as `<root>/<subdir>`, and never also read or write `docs` when a root is configured.

`node compound-design/tools/cd.mjs config --json` resolves and validates this deterministically.
<!-- cd-artifact-root:end -->

## Artifact rule

- **lightweight** — one component, states obvious: state the contract in the response, no file.
- **bounded** — a written model in the response for work finishing this session.
- **durable** — write `<root>/plans/YYYY-MM-DD-<slug>.md` when the work spans sessions or people, when a behavioural decision closes off alternatives, or when Build and Verify will be run by someone who was not here.

## Output contract

```
ENTITIES     <name: fields that matter, relationships>
ROUTES       <path → purpose → who can reach it>
STATES       <surface: every state it can be in>
TRANSITIONS  <from → event → to>
EDGE CASES   <case → required behaviour>
AI BOUNDARY  <instructions | data | tools | actions; cost of a wrong output — only when AI is involved>
PRIOR LEARNING <id · title · how it constrains this model — or "none found">
REUSES       <existing components, patterns and primitives this uses>
CONTRACT     <numbered, checkable behaviour statements for cd-build and cd-verify>
OPEN         <what the human still has to decide>
NEXT         <cd-build | back to cd-frame>
```

## Forbidden

Inventing a parallel design system when one exists. Writing implementation code. Leaving a multi-state surface with only its happy path. Turning an open decision into a silent assumption. Specifying visual detail that belongs to Polish. Claiming a behaviour is required when no frame constraint or requirement supports it.

## Missing dependency

No frame: reconstruct the minimum problem statement, show it, and say the model rests on it. No design system: model against what the codebase actually contains and say so. No discovery tool: say prior learning could not be searched rather than reporting "none found". Unresolvable `docs_root`: stop with the error rather than writing anywhere.

## Completion

Done when every surface in scope has its states, every state has a defined behaviour, the AI boundary is drawn where AI exists, the contract is checkable, and reused existing pieces are named. Open decisions listed for the human do not block completion.

## Provenance

The instructions / data / tools / actions separation follows agentic-system guidance in `compound-design/research/AI-INTERACTION-SOURCE-MAP.md`. Structure, boundaries and contract are Compound Design's.
