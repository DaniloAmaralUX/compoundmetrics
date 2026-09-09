# Agent Map

Compound Design uses agents as composed specialists rather than rewriting every upstream skill.

## Mental model

- **Skill** = procedure / how to do the work.
- **Agent** = specialist used by a procedure.
- **Resource** = any tool or asset that helps the procedure.

## Agents

### `cd`
Orchestrator. Owns the Compound Design loop, system modeling, flow integrity, verification and promotion of reusable assets.

### `jakub`
Interface-craft specialist. Reads the vendored Jakub Krehel skills when relevant and focuses on UI, layout, typography, color, accessibility, writing and review.

### `emi`
Motion and interaction specialist. Reads the vendored Emil Kowalski skills when relevant and focuses on motion, interaction feel, animation decisions, prototyping and polish.

## Flow

`cd → jakub / emi → implementation → verify → compound → promote`

The agents do not impersonate the upstream authors. They adapt open-source knowledge into the Compound Design workflow while preserving attribution.
