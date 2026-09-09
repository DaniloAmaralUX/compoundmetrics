# Compound Design POC v0.1 — Execution Process

Date: 2026-09-09
Status: completed POC
Repository: `DaniloAmaralUX/supernova-catalogo`
Branch: `compound-design-framework`
Related application repository: `DaniloAmaralUX/studio-dev-ui`
Related application branch: `compound-design-poc`

## Purpose

Document the process used to turn Compound Design from a thesis/framework into a demonstrable POC with:

- a visible product narrative;
- a staged Design Engineering loop;
- reusable agents and skills;
- a transparent quality score;
- a versioning model;
- an evaluation loop;
- an isolated Vercel preview.

The goal of this document is not to freeze the framework. It exists so the process itself can compound: future versions should improve this workflow instead of rediscovering it.

---

## Core thesis

> Build the application. Improve the system that builds the next one.

Compound Design treats the end of one project as input for the next.

The loop is:

`real work → agents/resources → evaluation → failure → learning → new version → better next project`

The project does not end when the interface ships. Useful learning is promoted into reusable system capability.

---

## 1. Isolate the experiment

The first rule of the POC was to avoid destabilizing existing products.

Two isolated branches were used:

### Framework

Repository:

`DaniloAmaralUX/supernova-catalogo`

Branch:

`compound-design-framework`

Responsibility:

- methodology;
- agents;
- skills;
- resource scoring;
- evaluation model;
- documentation;
- version history.

### Product / presentation

Repository:

`DaniloAmaralUX/studio-dev-ui`

Branch:

`compound-design-poc`

Responsibility:

- POC interface;
- timeline;
- resource cards;
- rubric presentation;
- verifier loop;
- version presentation;
- deploy preview.

No `main` branch was used as an experimentation surface.

---

## 2. Structure the Design Engineering loop

The POC uses seven stages.

### 01 — Frame

Understand what should exist before generating what it looks like.

Typical resources:

- `ce-brainstorm`
- `ce-plan`
- Experience Brief

### 02 — Model

Model the system behind the screens: entities, states, roles, routes, relationships and edge cases.

Typical resources:

- `cd-model-system`
- System Model
- State Matrix

### 03 — Craft

Turn the model into deliberate hierarchy, interaction, content and visual behavior.

Typical resources:

- `jakub`
- `cd-craft`
- Supernova DS

### 04 — Build

Make design decisions executable inside the real product architecture.

Typical resources:

- `ce-work`
- `shadcn/ui`
- Claude Code / Codex

### 05 — Verify

Check the code, the flow and the experience — then test the resources themselves.

Typical resources:

- `cd-quality-gate`
- Promptfoo
- browser verification

### 06 — Polish

Working is the baseline. Refine motion, copy, rhythm, feedback and perceived quality.

Typical resources:

- `emi`
- `ce-polish`
- human craft review

### 07 — Compound

Promote proven learning so the next application starts from a better system.

Typical resources:

- `cd-resource-lab`
- regression evals
- version + promote

---

## 3. Define the first reusable resources

The POC started with a small set of reusable resources instead of creating a large speculative framework.

### `cd`

Type: orchestrator

Responsibility:

Run the Design Engineering loop and delegate specialist work without collapsing every concern into one agent.

### `jakub`

Type: agent

Responsibility:

Interface-craft specialist for hierarchy, layout, typography, color, accessibility, writing and reusable UI lessons.

Important boundary:

This is an authorial specialist resource informed by external design knowledge. It must not impersonate or imply endorsement from Jakub Krehel.

### `emi`

Type: agent

Responsibility:

Motion and interaction specialist focused on restraint, responsiveness, timing, perceived quality and reduced-motion behavior.

Important boundary:

This is an authorial specialist resource informed by external design knowledge. It must not impersonate or imply endorsement from Emil Kowalski.

### `cd-quality-gate`

Type: skill

Responsibility:

Block promotion until the candidate resource has been evaluated across structure, routing, outcome quality, reliability, trajectory, efficiency, safety, provenance and maintainability.

### `cd-resource-lab`

Type: skill

Responsibility:

Turn failures into evals, apply the smallest useful change, rerun the baseline and version only demonstrated improvements.

---

## 4. Score resources without inventing proof

The POC uses a 0–10 score, but the score must preserve its meaning across versions.

The v0.1 score class is:

`readiness`

A readiness score means:

- the resource has a bounded job;
- the invocation/routing boundary is reasonably clear;
- instructions are actionable;
- expected outputs are useful;
- safety/provenance rules exist;
- an empirical evaluation path exists.

It does **not** mean the resource has already demonstrated statistically or operationally verified uplift.

A future resource may only use the score class:

`verified`

when controlled evidence exists.

---

## 5. CD Resource Score v0.1

The rubric totals 10 points.

| Dimension | Weight |
| --- | ---: |
| Scope & contract | 1.25 |
| Routing quality | 1.25 |
| Instruction quality | 1.25 |
| Outcome usefulness | 2.00 |
| Reliability & regressions | 1.50 |
| Trajectory & efficiency | 1.25 |
| Safety, provenance & maintainability | 1.50 |
| **Total** | **10.00** |

Critical failures override the average score.

Examples of critical failure:

- fabricated evidence;
- unsafe tool behavior;
- broken provenance boundary;
- severe regression;
- claiming certification or endorsement that does not exist;
- a resource that cannot reliably perform its primary job.

---

## 6. v0.1 readiness results

The initial POC audit produced these readiness scores:

| Resource | Type | Score |
| --- | --- | ---: |
| `cd` | orchestrator | 8.0 |
| `emi` | agent | 8.1 |
| `jakub` | agent | 8.2 |
| `cd-resource-lab` | skill | 8.3 |
| `cd-quality-gate` | skill | 8.4 |

These are not marketing scores.

They are baseline measurements for future comparison.

The important artifact is not the absolute number. It is the ability to compare:

`v0.1 → v0.2 → v0.3`

using the same rubric and real evidence.

---

## 7. Verify the verifier

The system that judges quality must itself be evaluated.

The verifier loop is:

### 01 — Baseline

Run the same task without the candidate resource or with the previous best version.

### 02 — Run

Execute positive cases, negative routing cases, edge cases and repeated nondeterministic runs.

### 03 — Inspect

Inspect the trajectory, including:

- selected tools;
- specialist routing;
- retries;
- latency;
- token usage;
- failures;
- human craft quality.

### 04 — Capture

Every reproducible real failure becomes a regression eval.

### 05 — Improve

Make the smallest change connected to the observed failure.

Do not grow prompts or agent systems generically without evidence.

### 06 — Version

Rerun the same suite.

Promote only when evidence improves.

Otherwise keep the previous best version.

---

## 8. Evaluation stack

The evaluation stack is layered because no single evaluator is sufficient.

Preferred order:

1. deterministic assertions;
2. Promptfoo harness / automated eval cases;
3. independent model grader where deterministic checks are insufficient;
4. browser verification for actual product behavior;
5. human craft review for perceptual/interface quality.

External evaluators are evidence sources, not endorsement mechanisms.

Using a model from a company does not permit claims such as:

- "approved by OpenAI";
- "certified by Anthropic";
- "validated by Vercel";
- equivalent marketing language without explicit evidence.

---

## 9. Versioning policy

### v0.1

Purpose:

Architecture + transparent readiness audit + evaluation harness.

This version proves that the system is sufficiently structured to be tested.

### v0.2

Target:

First controlled baseline runs, regressions and score deltas.

A good v0.2 should produce evidence such as:

- routing precision;
- repeated pass rate;
- before/after outcome comparison;
- trajectory efficiency;
- failure inventory;
- regression suite.

### v1.0

Threshold:

Primary jobs demonstrate stable empirical uplift in their defined scope.

v1.0 should not be determined by visual completeness alone.

---

## 10. Build the public-facing POC

A dedicated route was created in the product repository:

`/compound-design`

The POC presentation contains:

- Compound Design positioning;
- seven-stage process timeline;
- reusable resource cards;
- v0.1 readiness scores;
- the visible 0–10 rubric;
- verifier loop;
- evaluation stack;
- continuous version model;
- compound feedback loop.

The page intentionally labels itself as a POC.

Its metadata uses `noindex` so the experimental preview does not become an accidental public release.

---

## 11. Deploy and verify the POC

The `compound-design-poc` branch was deployed automatically through the repository's Vercel Git integration.

Validation sequence:

1. commit the isolated implementation;
2. wait for Vercel preview build;
3. inspect deployment state;
4. inspect build errors/warnings;
5. fix blocking implementation issues;
6. redeploy from Git;
7. confirm the deployment reaches `READY`;
8. keep the preview protected;
9. use a temporary Vercel share URL when external inspection is needed.

A successful build/runtime proves that the POC presentation can execute.

It does **not** prove the agent/skill methodology itself.

Product runtime verification and resource outcome verification are separate evidence classes.

---

## 12. Reference architecture rule

External projects may be used as references, but the project must preserve provenance.

For example, the Evil Rabbit Lifeline reference was registered only as a reference source for interaction/timeline study.

Rule:

> Learn the mechanism. Do not disguise a copy as an original system.

The Compound Design interface should remain an authorial implementation even when inspired by public work.

---

## 13. Promotion rule

A reusable resource is promoted only when it improves the system.

Possible outcomes after evaluation:

- promote;
- keep experimental;
- revise;
- replace;
- consolidate;
- discard.

A high average score does not override a critical failure.

A newer version is not automatically the better version.

The previous best remains canonical until the candidate proves improvement.

---

## 14. Compound rule

The final question of every cycle is:

> What did this project teach us that should never need to be rediscovered from zero?

Possible compound assets include:

- components;
- patterns;
- flows;
- guidelines;
- templates;
- agents;
- skills;
- evaluators;
- guardrails;
- tests;
- regressions;
- tokens;
- interaction contracts;
- design decisions;
- system models.

Only reusable learning should be promoted.

Project-specific noise stays local.

---

## 15. Current state

At the end of the v0.1 execution cycle:

- the Compound Design framework exists as a structured repository branch;
- the first reusable resources exist;
- the scoring rubric exists;
- a readiness audit exists;
- the verifier loop exists;
- the version model exists;
- the POC interface exists;
- the POC successfully built on Vercel;
- the experiment remains isolated from `main`;
- the next meaningful milestone is empirical verification, not another cosmetic score increase.

---

## Next cycle

The next Compound Design cycle should focus on producing the first empirically verified resource score.

Recommended sequence:

`choose one primary job → baseline → candidate → repeated runs → inspect trajectory → human + automated grading → capture regressions → score delta → promote or reject`

The strongest candidate for this first verified cycle should be selected based on:

- frequent real-world use;
- measurable output;
- clear baseline;
- manageable evaluation cost;
- low ambiguity in success criteria.

---

## Permanent principle

> Quality that accumulates instead of restarting.

The purpose of Compound Design is not to create more process.

It is to make each completed application leave behind a better system for building the next one.
