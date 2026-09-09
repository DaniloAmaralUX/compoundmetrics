# Compound Design

A living framework for design engineers building web applications with humans and AI agents.

> Build the application.
> Improve the system that builds the next one.

Compound Design is a plugin of skills and specialist agents that structures design-engineering work as a loop — and, at the end of each pass, keeps the one thing worth keeping where the next pass will find it.

```
Frame → Model → Build → Verify → Polish → Compound → (repeat, with better context)
```

Craft is not a stage. It happens through specialists and decisions inside Model, Verify and Polish, and only when the work has a question that needs them. Nothing forces a small change through seven stages.

## Current state

| | |
| --- | --- |
| Release | **v0.3.0-alpha.1 — Work System** (candidate) |
| Stable evidence baseline | v0.2.1 |
| Evidence level | E1 — deterministic contracts |
| Runtime uplift | not measured |
| Paid benchmark runtime | never executed |

A candidate release means the architecture and the behaviour changed. It does not mean anything was shown to work better. Every claim in this repository stays inside what has actually been checked.

## Install

```text
/plugin marketplace add DaniloAmaralUX/compoundmetrics
/plugin install compound-design@compound-design
```

Then, in any project:

```text
/cd-setup
```

Codex and Cursor, plus local development, are covered in [docs/install.md](docs/install.md).

## The loop

| Skill | Question it answers |
| --- | --- |
| [`cd-frame`](skills/cd-frame/SKILL.md) | What are we actually solving? |
| [`cd-model`](skills/cd-model/SKILL.md) | How should the product behave? |
| [`cd-build`](skills/cd-build/SKILL.md) | Make it real. |
| [`cd-verify`](skills/cd-verify/SKILL.md) | Did reality match intention? |
| [`cd-polish`](skills/cd-polish/SKILL.md) | Is it deliberate? |
| [`cd-compound`](skills/cd-compound/SKILL.md) | What deserves to survive this project? |

Around the loop: [`cd-strategy`](skills/cd-strategy/SKILL.md) holds the project anchor that Frame and Model read; [`cd-compound-refresh`](skills/cd-compound-refresh/SKILL.md) keeps the learning store true, distinct and findable — including by deleting; [`cd-setup`](skills/cd-setup/SKILL.md) and [`cd-handoff`](skills/cd-handoff/SKILL.md) handle configuration and continuity.

Specialists: [`cd-interface-review`](skills/cd-interface-review/SKILL.md), [`cd-motion-review`](skills/cd-motion-review/SKILL.md), [`cd-ai-interaction-review`](skills/cd-ai-interaction-review/SKILL.md), [`cd-quality-gate`](skills/cd-quality-gate/SKILL.md), [`cd-resource-lab`](skills/cd-resource-lab/SKILL.md).

## Three words that mean different things

- **Skill** = a procedure. How the work is done.
- **Agent** = a specialist. A worker dispatched into its own context to perform scoped work and return a result.
- **Resource** = any tool or asset a procedure uses.

An agent never restates its skill's procedure; it points at it. That boundary is enforced by a deterministic test, not by convention.

## What it does not do

**Compound Design does not automate authorship.** It routes, structures, checks and remembers. Human judgment stays at the decisions that carry taste or risk: what problem is worth solving, what a good interface feels like, what deserves to become a rule, and when the evidence is not good enough yet.

Three more boundaries, on purpose:

- **An artifact must be earned.** Most runs write no document. A durable file appears when a decision, a constraint or a learning would otherwise have to be rediscovered.
- **Review is report-only by default.** Reviewing something is not permission to change it.
- **A claim never exceeds its evidence.** Construction quality and evidence maturity are separate numbers, and neither is allowed to borrow from the other.

## Run one teaches; run two starts smarter

`cd-compound` writes a learning with the frontmatter defined in the [discoverability contract](compound-design/DISCOVERABILITY-CONTRACT.md), including the literal signals that will recur. `cd-frame` and `cd-model` run a bounded deterministic search before they ask anything, so a constraint paid for once is not paid for twice.

```bash
node compound-design/tools/cd.mjs discover --context "the checkout page throws InvalidAuthenticityToken after deploy"
```

The retrieval mechanism is tested without a model. Whether it makes anyone's decisions better is not measured, and is not claimed.

## Evidence

Compound Design measures two different things and never merges them:

- **CDQI** — construction quality, 0–10. How well a resource is built.
- **CEL** — evidence maturity, E0–E4. How strongly its effectiveness has been shown.

A resource can be well built and unproven at the same time; that is the normal case here. Resources authored for this release entered the registry at **E0** and reached **E1** only by passing the deterministic contract suite. Nothing exceeds E1. The pre-registered controlled-runtime pilot in `compound-design/quality/e2/` has never been executed, and its runtime command refuses to start without explicit paid-runtime authorisation.

Vendor adoption, model quality, popularity and official documentation are never evidence of anything about Compound Design.

## Repository map

```text
skills/                  15 skills — the canonical implementation, read directly by every host
agents/                  6 specialists — thin dispatch definitions that point at their skill
.claude-plugin/          Claude Code manifest and marketplace
.codex-plugin/           Codex manifest
.cursor-plugin/          Cursor manifest and marketplace
.compound-design/        repository configuration (example tracked; local override gitignored)
docs/                    project work memory: frames, plans, solutions, handoffs, guides
compound-design/         the framework's own infrastructure: quality, registry, learning, research, releases, tools
src/                     this site
STRATEGY.md              the project anchor
```

`docs/` holds artifacts produced **by using** Compound Design. `compound-design/` holds the evidence system **of** Compound Design. They are deliberately not the same tree.

## Checks

Every check here is deterministic, offline, and never calls a model.

```bash
npm run cd:all        # registry, contract suite, plugin, claim guard, self-tests
npm run cd:setup-check
npm run typecheck && npm run lint && npm run build
```

## Provenance

Compound Design is a composition and specialisation layer. Its architecture was studied from Every's Compound Engineering; its interface and motion heuristics were informed by the open-source skills of Jakub Krehel and Emil Kowalski; its AI-interaction gates are grounded in Microsoft HAX, Google PAIR and mixed-initiative interaction research. Upstream material is a source, never a runtime dependency: the installed plugin is self-contained and clones nothing.

Attribution and licences are in [NOTICE](NOTICE) and [compound-design/SOURCES.md](compound-design/SOURCES.md). No upstream author or vendor endorses Compound Design.
