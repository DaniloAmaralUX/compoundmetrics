# Provenance note — Every, Brad Frost, and what may be said

This note fixes the wording the case study, the film and the site may use about the two external sources that Atomic AI Design borrows from. It exists because both borrowings are real and both are easy to overstate. Where this note and any other case-study text disagree, this note wins.

Scope: **Every / Compound Engineering** and **Brad Frost / Atomic Design**. Other upstream sources (Jakub Krehel, Emil Kowalski, Evil Rabbit, HAX, PAIR, Anthropic, OpenAI, Promptfoo, shadcn/ui) are governed by `compound-design/SOURCES.md` and `NOTICE` and are not repeated here.

## 1. The recommended formulation

Quoted verbatim from PRD §20. Use it as written; do not paraphrase it into something stronger.

> Compound Design explores what happens when the compounding philosophy used in agentic engineering meets a design-system way of thinking about composable parts — and extends the "part" from UI components to reusable design knowledge.

The thesis sentence itself (PRD §1.3) is authorial:

> Atomic AI Design is a mental model for treating design knowledge as composable capability. Observations, decisions, rules, patterns, components, evals, skills and agents combine into larger work systems, while real products continuously feed new learning back into those systems.

The PRD's instruction on it is two lines long and is the whole rule: this is a formulation of the project's own; do not attribute it to Every or to Brad Frost.

## 2. Every — Compound Engineering

### What is true and already recorded in this repository

- Every publishes Compound Engineering as an open-source plugin (`EveryInc/compound-engineering-plugin`, MIT, Copyright (c) 2025 Every) and as an editorial guide. This project studied the repository at pinned commit `b36047e1b4b2123df2f3529bf04b5f2a7c5f84e4` (plugin version 3.24.0), read-only, and recorded every mechanism it looked at with an adopt/adapt/defer/reject decision in `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`.
- Mechanisms adapted from it are named in `compound-design/SOURCES.md` (v0.3.0-alpha.1 section): canonical skills with per-phase references, the configuration model and its fail-closed artifact root, the durable-learning bar, the five maintenance outcomes, report-only review with explicit apply, and pointer-first handoffs.
- `compound-design/FINDING-CONTRACT.md` credits the hydration gate, the confidence gate and consolidation-by-root-cause to "Every's Compound Engineering review architecture (MIT, `b36047e1`)" and ends: "No upstream author endorses this contract."
- `NOTICE` says: "Architecture mechanisms adapted from Every's Compound Engineering (MIT, Copyright (c) 2025 Every) are recorded with their source commit in `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`. No upstream author or vendor endorses Compound Design."
- The transfer graph records the transfer as verified (`case-study/knowledge/TRANSFER-GRAPH.md`, item 5 and the chain "Every → architecture snapshot → `cd-compound`"): the registry marks ten resources `upstream-informed` by Every.

### May be said

- Compound Design was inspired by the idea of compounding in Compound Engineering.
- Compound Design adapted named architecture mechanisms from Every's plugin at a pinned commit, under its MIT licence, with the decisions recorded.
- Every's Compound Engineering is a source the project studied and cites.
- The phrase "the compounding philosophy used in agentic engineering" in the recommended formulation refers to this lineage.

### May not be said

- That Every created, co-created, named or contributed to Atomic AI Design.
- That Every endorsed, reviewed, approved or is associated with Compound Design or this case study.
- That Every validated the thesis, the benchmark, the evidence levels or any result.
- That Compound Design is Compound Engineering "for design", "applied to design" or "the design version of" — those phrasings imply a relationship the source does not have with this project. Say "inspired by" and name what was adapted.
- Any wording that lets the reader conclude the philosophy is proven because Every practises something like it. Association is not evidence (PRD §20: "a filosofia foi comprovada por associação" is on the forbidden list).

## 3. Brad Frost — Atomic Design

### What is true and what the record shows

- Atomic Design is Brad Frost's methodology and book (2016) for composing interfaces from atoms, molecules, organisms, templates and pages. The layer names *atomic*, *molecular* and *organism* in this model are borrowed from it. *System*, *product* and *feedback* are not his layers; they replace *templates* and *pages* and change what the model is about.
- The transfer graph could not verify any attributed route from Atomic Design into this project's earlier tools. The term "atomic design" appears once in `supernova-catalogo` (README line 43; `src/design/atomic-direction.test.ts` line 7) with no author named; "Brad Frost" appears in no readable repository. Edge `E88` is recorded `verified: false` with that reason, and `case-study/history/CHRONOLOGY.md` lists Brad Frost / Atomic Design under `none_verified`.
- Nothing by Brad Frost is copied, vendored or quoted in this repository. The borrowing is a vocabulary and a way of thinking about parts, not material.

### May be said

- Compound Design was inspired by the logic of composing parts into systems found in Atomic Design.
- Atomic AI Design borrows the words atomic, molecular and organism from Brad Frost's Atomic Design and extends the "part" from UI components to reusable design knowledge.
- The model differs from Atomic Design in its top three layers and in having a feedback layer at all; that difference is the point, not an improvement claim.

### May not be said

- That Brad Frost endorsed, reviewed, approved, commented on or is aware of Compound Design or Atomic AI Design.
- That Atomic AI Design is "the official evolution", "the next step", "Atomic Design 2.0", "Atomic Design for AI" or any phrasing that positions this model as a continuation he sanctioned.
- That Atomic Design informed the earlier tools in the case study by attribution — the record does not support it (`E88`). Say that the term was in use in `supernova-catalogo` and that the author is not named there.
- That Atomic Design is superseded, outdated or incomplete. This model does not compete with it.

## 4. Forbidden claims — PRD §38, in full

The PRD's claim-discipline list, translated from the Portuguese. Never say:

1. Compound Design has proven to increase productivity.
2. Compound Design has proven to produce better design universally.
3. The benchmark is a universal objective measure.
4. Atomic AI Design is an externally recognised methodology.
5. Every endorsed the project.
6. Brad Frost endorsed the project.
7. CEL E1 proves runtime effectiveness.
8. A design score proves business impact.

And the same section's list of what may be said:

- interfaces were measured against a frozen rubric;
- we found differences between versions;
- we observed resource transfers;
- we found learnings that were reused;
- the system has deterministic contracts;
- the thesis is being tested in use.

PRD §20 adds five things not to say, which overlap with the above and are restated here so the two lists are in one place: Every created Atomic AI Design; Brad Frost endorsed Compound Design; Compound Design is "the official evolution" of Atomic Design; Every validated the thesis; the philosophy was proven by association.

## 5. Evidence boundary that no wording may cross — PRD §39

- v0.3.0-alpha.1 is a candidate.
- v0.2.1 remains the stable evidence baseline.
- Current maximum CEL is E1.
- E2 runtime: NOT EXECUTED.
- Runtime uplift: NOT MEASURED.
- Paid experimental runtime: 0, absent explicit future authorisation.

"The case can grow. The claim cannot grow without evidence." A sentence about Every or Brad Frost that makes a reader believe any of the six lines above has moved is a wrong sentence, whatever its grammar.

## 6. Phrasing check

Use before publishing any sentence that names either source.

| Write | Do not write |
| --- | --- |
| "inspired by the compounding idea in Every's Compound Engineering" | "built on Every's method", "Every's approach applied to design" |
| "adapted mechanism X from Every's plugin at commit `b36047e1` (MIT)" | "based on Every's framework" without naming what and where |
| "borrows the vocabulary of Brad Frost's Atomic Design" | "extends Atomic Design", "the evolution of Atomic Design" |
| "the term 'atomic design' appears in supernova-catalogo, unattributed" | "Atomic Design shaped the early tools" |
| "an authorial thesis, being tested in use" | "a recognised methodology", "validated by Every", "endorsed by Brad Frost" |
| "extends the 'part' from UI components to reusable design knowledge" | "does for knowledge what Atomic Design did for UI" as if the outcome were established |
| "contract-tested (E1); runtime uplift not measured" | "proven", "validated", "improves outcomes" |

## 7. Where the attribution lives

| Concern | File |
| --- | --- |
| Full source list, pins, licences, usage boundary | `compound-design/SOURCES.md` |
| Public-facing notice | `NOTICE` |
| Every mechanism-by-mechanism decisions | `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md` |
| Finding-contract provenance | `compound-design/FINDING-CONTRACT.md`, "Provenance" |
| Verified and unverified transfer edges | `case-study/knowledge/TRANSFER-GRAPH.json` (`E88` for Brad Frost) |
| Evidence boundary | `case-study/FREEZE.md`, `compound-design/quality/CD-EVIDENCE-LEVELS.md` |
| This model | `case-study/theory/ATOMIC-AI-DESIGN.md` |
