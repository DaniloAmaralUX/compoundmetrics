# Compound Design Framework

Standalone working area for the evolving Compound Design framework.

## Purpose

Build a practical AI-assisted Design Engineering framework for web applications by combining proven workflows with an explicit authored layer.

## Core model

- **Skill** = procedure / how to do the work.
- **Agent** = specialist used by a procedure.
- **Resource** = any tool or asset that supports the procedure.

## Current release

**v0.2.1 — Evidence Infrastructure**

The framework remains **CEL E1**. Runtime uplift is still `not measured`.

v0.2.1 does not add a behavior claim. It makes the evidence system harder to drift or overstate:

- `registry/resource-registry.json` — canonical resource metadata;
- `registry/resource.schema.json` — machine-readable contract;
- `tools/cd-lint.mjs` — deterministic evidence/provenance/claim lint + mutation self-test;
- `quality/EVIDENCE-DEBT.md` — explicit gap between construction and proof;
- `learning/LEDGER.md` — safe real-work learning capture;
- `quality/WRAPPER-VALUE-AUDIT.md` — remove wrappers that do not add leverage;
- `research/AI-INTERACTION-SOURCE-MAP.md` — primary-source grounding for AI interaction quality;
- `quality/local-stress/` — optional zero-API-cost stress lane that never impersonates E2.

## Core loop

`Frame → Model → Craft → Build → Verify → Polish → Compound → Repeat`

The Compound step turns useful, evidenced learning into a better starting system for the next project.

## Source strategy

Do not rebuild mature work without reason. Study and adapt proven resources from Every, Jakub Krehel, Emil Kowalski and the shadcn/ui ecosystem while preserving provenance and license obligations.

A Compound wrapper must add a testable system property such as routing, integration, evidence discipline or reusable learning. If direct upstream use is equal or better, simplification/removal is a valid improvement.

## Evidence rule

- **CDQI** = construction quality.
- **CEL** = evidence maturity.
- E0/E1 runtime uplift stays `not measured`.
- Passing deterministic contracts does not prove outcome uplift.
- A new version needs a reproduced failure, measured improvement, efficiency gain with preserved quality, or a stronger boundary against a known failure class.

The E2 benchmark pack is pre-registered under `quality/e2/`. It compares base model, upstream direct use where applicable, and Compound v0.2 with repeated fresh runs and holdouts.

## Relationship with Supernova

- **Compound Design** explains the process and the evolving AI framework.
- **Supernova/cn** is the visual catalog of screens, flows and reusable systems.

Compound explains. Supernova shows.
