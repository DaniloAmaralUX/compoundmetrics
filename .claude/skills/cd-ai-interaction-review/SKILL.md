---
name: cd-ai-interaction-review
description: Reviews user-facing AI experiences for AI fit, appropriate reliance, legibility, human control, proportional autonomy and resilience to model/data changes. Use only when AI behavior materially affects the user experience or product action.
version: 0.1.0
---

# CD AI Interaction Review

Evaluate the quality of interaction between a human and an AI system. This is not a generic UI review and not a model-safety audit.

Use it when the product includes generated content, AI recommendations, conversational AI, agentic actions, AI-assisted decisions or autonomous workflows.

Do not use it for ordinary deterministic UI.

## Six gates

### 1. AI Fit
Ask whether AI is the right interaction primitive.

Check:
- would deterministic UI be clearer, cheaper or more reliable?
- is variability actually useful?
- is the AI role explicit?
- are high-consequence tasks appropriately constrained?

Failure: AI is present mainly because it is novel.

### 2. Appropriate Reliance
Design for the user to accept good output and detect/reject bad output.

Check:
- consequential output is cheap to verify;
- uncertainty is not disguised as precision;
- provenance/evidence is available when useful;
- the UI does not reward blind acceptance;
- users can correct imperfect output.

Failure: acceptance rate is treated as success regardless of correctness.

### 3. Legibility
The user should understand what the system is doing at the level needed to act.

Check:
- current status is visible;
- plan/progress is exposed when multi-step work benefits from it;
- sources, changed objects or tool effects are inspectable where relevant;
- the interface separates generated claims from verified facts;
- waiting states explain meaningful progress rather than showing generic theater.

Failure: the system performs consequential work behind an opaque spinner.

### 4. Human Control
Control must be cheaper than recovery.

Check:
- edit, reject, retry, stop and undo are available when relevant;
- destructive or difficult-to-reverse actions expose scope before execution;
- approval points appear before, not after, the risky action;
- users can redirect a long-running process without restarting everything.

Failure: “regenerate” is the only correction mechanism.

### 5. Proportional Autonomy
Autonomy should scale with stakes and reversibility.

Use this model:

`allowed autonomy ∝ reversibility / consequence`

Check:
- read-only exploration can be more autonomous;
- external communication, deletion, payment, permission changes and irreversible actions require stronger confirmation;
- tool permissions are narrower than “all available tools” when possible;
- instructions, data, tools and actions are treated as distinct boundaries.

Failure: the agent has broad action power for a task that only needs analysis.

### 6. Evolution
AI behavior is a dependency that can regress.

Check:
- model/provider/data changes have a regression suite;
- critical interaction behavior is tested independently of model wording;
- fallbacks do not silently remove user control;
- the product records which model/runtime produced evaluated behavior;
- a worse new model can be rolled back.

Failure: model upgrades are treated as invisible infrastructure changes.

## Review output

Return only relevant findings using:

`Gate → Severity → Finding → Evidence → Concrete change → Eval to add`

Severity:
- **P1** — unsafe/destructive ambiguity, severe overreliance risk, missing control for high-consequence actions.
- **P2** — material trust, verification, control or autonomy problem.
- **P3** — optimization/polish.

End with:
- strongest gate;
- weakest gate;
- one highest-value eval to add.

## Evidence posture

The principles are hypotheses until validated in the product context. Do not claim that adding explanations, sources, confirmations or traces automatically improves trust or outcomes. Measure behavior when consequences matter.
