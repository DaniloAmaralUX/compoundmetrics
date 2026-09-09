---
name: cd
description: Compound Design orchestrator for AI-native web applications. Routes work through only the stages that add value, delegates specialist craft, adds AI Interaction Quality when AI is user-facing, and compounds proven learning into reusable assets.
version: 0.2.0
---

# CD — Compound Design Orchestrator

Compound Design coordinates a repeatable Design Engineering loop without forcing every task through every stage.

`Frame → Model → Craft → Build → Verify → Polish → Compound → Repeat`

## Core terms

- **Skill** = procedure.
- **Agent** = specialist used by a procedure.
- **Resource** = any tool or asset that improves the procedure.

## Routing rule

Start with the smallest sufficient path. Add a stage only when the task has a decision or risk that belongs there.

### Use specialists deliberately

- `jakub` — interface hierarchy, layout, typography, color, accessibility, writing and broad UI review.
- `emi` — motion, interaction feel, animation decisions, prototype behavior and polish.
- `cd-ai-interaction-review` — only when the product contains user-facing AI behavior, agentic actions, generated content, AI recommendations, or AI-mediated decisions.

Do not invoke a specialist merely because it exists.

## Stage responsibilities

### Frame
Define the problem, user, goal, constraints, success conditions and whether AI is actually justified.

For AI features, state:
- what the AI is responsible for;
- what stays deterministic;
- what the human must decide;
- the consequence of a wrong output.

### Model
Map:
- entities;
- routes;
- roles and permissions;
- states and transitions;
- edge cases;
- screen relationships;
- flows.

For agentic systems also separate:
- **instructions** — what the system may obey;
- **data** — what it may read or cite;
- **tools** — what capabilities it may call;
- **actions** — what state it may change.

### Craft
Inspect the existing design system, shadcn/ui, registries and project patterns before inventing new UI.

Use `jakub` for broad interface craft and `emi` for motion/interaction concerns.

For AI-facing experiences, use `cd-ai-interaction-review` to check fit, reliance, legibility, control, autonomy and evolution.

### Build
Turn decisions into executable product behavior. Preserve the product architecture and prefer existing primitives over parallel systems.

### Verify
Check:
- functionality;
- flow completion;
- state coverage;
- accessibility;
- responsive behavior;
- design-system consistency;
- interaction quality;
- visual craft.

For AI-facing work, also verify the six AI Interaction Quality gates.

When a reusable AI resource is created or changed, run `cd-quality-gate`.

### Polish
Improve the experience after it is functionally correct. Prioritize perceived quality, motion restraint, copy, feedback, rhythm and edge-state behavior.

### Compound
Ask:

`What did we learn here that the next project should not have to rediscover?`

Classify candidates as:
- Component
- Pattern
- Flow
- Guideline
- TasteRule
- Skill
- Agent rule
- Template
- Test
- Starter
- Local-only lesson

Promotion is evidence-gated. Existence is not proof.

## Evidence model

Compound Design v0.2 separates two things:

1. **CDQI Construction Score (0–10)** — how well the resource is designed.
2. **CEL Evidence Level (E0–E4)** — how strongly effectiveness is demonstrated.

Never convert a construction score into a claim of effectiveness.

## Supernova relationship

Compound Design explains how to build and improve the system that builds.

Supernova/cn shows reusable screens, flows and systems that survived the process.

Approved interface assets may become Supernova candidates; nothing is silently published.

## Source and attribution boundary

Upstream open-source sources may inform specialist resources. Preserve license obligations and provenance where derivative material remains. Never imply endorsement by upstream authors or vendors.
