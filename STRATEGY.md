---
name: Compound Design
last_updated: 2026-09-09
---

# Compound Design Strategy

Compound Design is an open plugin of design-engineering skills and specialist agents, installed into the coding agent a design engineer already uses and run against their own repository.

## Purpose

A design engineer working through AI agents produces more interface than they can carefully judge, and the judgment they do apply disappears when the session ends. Capable models do not fix this: left alone they frame thinly, review by taste, and write nothing down that a later run can find. The practices that would correct that are hard to apply consistently and decay as models and hosts move underneath them.

## Positioning

Knowledge from humans and agents should compound, so each unit of design-engineering work is easier than the last. Compound Design imposes a loop — frame, model, build, verify, polish, then keep the one thing worth keeping — and holds two boundaries most tooling does not: an artifact must be earned, and a claim may never exceed its evidence. Around that core it adds specialists for interface craft, motion and user-facing AI, and an evidence system that is allowed to say no.

## Users

**Primary:** design engineers building web applications with AI agents, across more than one host, who want the judgment from each session to land in the repository instead of a transcript.

**Secondary:** teams adopting AI-assisted design engineering who need a way to tell a well-built resource from a proven one.

## How it succeeds

Success is not "Compound Design wins". Success is that the framework can discover it is wrong. The measures that matter, and where they live:

- Whether a resource beats no resource, and beats direct upstream use — the pre-registered pilot in `compound-design/quality/e2/`, not executed.
- Whether a learning captured in one project changes a later one — the discoverability contract; the retrieval mechanism is tested, the effect on decisions is not measured.
- Whether the store stays trustworthy as it grows — `cd-compound-refresh` outcomes over time.
- Whether claims stay inside evidence — the claim guard and the evidence levels in the registry.

## Current tracks

1. **Work system** — the loop, its specialists, the finding contract. Shipping in v0.3.0-alpha.1 as a candidate.
2. **Durable learning** — capture, discovery, maintenance and deletion.
3. **Evidence** — the frozen E2 pilot, blocked on paid runtime authorisation, plus a candidate lane to compare a rewritten resource against the version it replaced.
4. **Distribution** — three hosts, self-contained, no runtime dependency on any upstream.

## Boundaries

- Compound Design does not automate authorship. Human judgment stays at high-risk and high-taste decisions.
- Catalogue size is not a goal. A skill exists when a procedure has a consumer.
- Upstream work is a source and a provenance obligation, never a runtime dependency and never an endorsement.
- No claim of effectiveness is made without controlled evidence. `not measured` is the correct answer until it is not.
