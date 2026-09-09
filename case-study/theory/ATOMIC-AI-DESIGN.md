# Atomic AI Design

Atomic AI Design is a mental model for treating design knowledge as composable capability. Observations, decisions, rules, patterns, components, evals, skills and agents combine into larger work systems, while real products continuously feed new learning back into those systems. It is the authorial thesis of this case study — a lens the author uses to read the Compound Design record, not a result the record produced, and not a methodology anyone else has recognised.

Status: hypothesis under test in real use. Evidence boundary at the time of writing: CEL E1 (deterministic contracts), E2 runtime NOT EXECUTED, runtime uplift NOT MEASURED, paid experimental runtime 0 (`case-study/FREEZE.md`). Nothing in this document raises that boundary.

Provenance and the exact wording allowed about Every (Compound Engineering) and Brad Frost (Atomic Design) are in `PROVENANCE-NOTE.md`, next to this file. The short version: the compounding idea comes from Compound Engineering, the composition vocabulary comes from Atomic Design, the thesis and its name are this project's own.

## 1. Definition

The recommended formulation (PRD §20):

> Compound Design explores what happens when the compounding philosophy used in agentic engineering meets a design-system way of thinking about composable parts — and extends the "part" from UI components to reusable design knowledge.

Atomic AI Design is the model that extension produces. In a conventional design system the smallest reusable part is a UI element — a token, a button, a field. The claim here is that in an AI-native design practice the smallest reusable part can also be a unit of knowledge: a rule the work learned, a check that catches a known failure, a finding in a fixed shape, a prompt with its expected output. Those units compose upward the way UI elements do — into patterns, into skills and agents, into a work system — and the products built with the system send failures back down as new units.

Two things follow from that definition and are worth stating plainly:

1. The model describes **composition and feedback**, not quality. A knowledge unit can be well-formed, versioned and discoverable, and still be wrong or useless. The layers say where a thing sits; the evidence levels (`compound-design/quality/CD-EVIDENCE-LEVELS.md`) say how much it has been shown to help.
2. The model is only interesting if the feedback layer works. Composition alone is a library. A library that is rewritten by the failures of the things built from it is what the word "compound" is pointing at.

## 2. The six layers

Each layer is described by what it holds, then by things that actually exist in this repository. Every path was verified at the time of writing. The layer a thing sits in depends on how it is used, so the same file can legitimately be cited twice (see §4).

### 2.1 Atomic — one thing the work learned and can state in a sentence

Holds: observation, decision, rule, prompt, token, component, finding, test.

Examples in this repository:

- **Token.** `--accent: #d7ff57` and the rest of the token block in `src/app/globals.css` (lines 9–20). The comment on `--faint` — "4.7:1 on the ground — the quietest tone that may still carry text" — is a rule carried on a token: the value and the reason travel together.
- **Observation.** Ledger entry `CD-20260909-013` in `compound-design/learning/LEDGER.md` (lines 266–280): nine "serious" colour-contrast violations on `/project` that vanished a second later, because axe measured timeline markers mid-fade. One observation, in the fixed entry shape defined at the top of the ledger. The ledger holds 14 such entries.
- **Rule.** "An automated accessibility check is a measurement of the page at rest." The `lesson:` line of that entry, and the sentence that became the title of `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md`.
- **Finding.** One record in the shape of `compound-design/FINDING-CONTRACT.md`: id, scope, severity, confidence, evidence, impact, recommendation, verification state, source. The contract's own example id is `IR-03`.
- **Test / prompt.** One case in `skills/cd-quality-gate/evals/evals.json` — a prompt ("A skill has CDQI 9.1 but only static inspection. Can it be CD_APPROVED?"), an expected output, and a list of expectations. Also one item of the frozen benchmark rubric in `case-study/design-benchmark/rubric/ITEM-CLASSIFICATION.json`, e.g. `fundamentos/jtbd`, with its mode (`judgment` or deterministic), method, PASS rule and N/A condition.
- **Decision.** A single `supersedes` / `supersededBy` pair in `compound-design/registry/resource-registry.json` — `jakub → cd-interface-review`, `emi → cd-motion-review`, `cd → compound-design` — is a decision recorded as data rather than as prose.

What is not atomic: a skill, a page, a benchmark. Those are made of atoms.

### 2.2 Molecular — atoms that only make sense together

Holds: reusable pattern, prompt + context, component + behaviour, rule + check.

Examples:

- **Rule + check.** The "page at rest" rule plus the check that enforces it: `scripts/site-check.mjs` waits 1.6 s after `networkidle` before injecting axe (line 208, with the rule stated in the comment) and ignores `requestfailed` events whose error is `ERR_ABORTED` (line 189). The rule without the check is advice; the check without the rule is a magic number.
- **Learning + signals.** A durable learning under `docs/solutions/` is a molecule by contract: the rule, plus the frontmatter `compound-design/DISCOVERABILITY-CONTRACT.md` requires — `areas`, `concepts`, `applies_to`, and above all `signals`, the literal strings that will recur (`"color-contrast"`, `"axe.run"`, `"ERR_ABORTED"`). The contract's own point is that "a learning about a form field that failed silently is not found by searching 'form'; it is found by the symbol, the error text or the API name that will appear again."
- **Prompt + expected output + expectations.** An eval case as a unit: not the prompt alone, but the prompt with what a correct answer must and must not do.
- **The finding contract itself.** `compound-design/FINDING-CONTRACT.md` is nine fields, a three-level severity ladder and five gates applied in order. No single field is the pattern; the pattern is the set, and every reviewer composes it.
- **Component + behaviour.** `src/components/Timeline.tsx` with `Timeline.module.css`: one rail, horizontal on desktop and vertical on mobile, a rail that draws in on first view, markers that settle as they are reached. The interaction model is adapted from `evilrabbit/lifeline` at a pinned commit (recorded in `compound-design/research/PRODUCT-EXPERIENCE-REFERENCES.md`); the component and its behaviour are inseparable, which is what makes it a molecule rather than a token.

### 2.3 Organism — a bounded resource with a routing contract and an evaluation path

Holds: skill, agent, review system, eval suite, audit.

Examples:

- **Skills.** Fifteen under `skills/`, each a `SKILL.md` with frontmatter (`name`, `description`, `argument-hint`, optionally `disable-model-invocation`): `cd-frame`, `cd-model`, `cd-build`, `cd-verify`, `cd-polish`, `cd-compound`, `cd-compound-refresh`, `cd-strategy`, `cd-setup`, `cd-handoff`, `cd-interface-review`, `cd-motion-review`, `cd-ai-interaction-review`, `cd-quality-gate`, `cd-resource-lab`. Each description states when to use the skill and when not to — the routing contract.
- **Agents.** Six under `agents/`: `compound-design` (orchestrator), `interface-reviewer`, `motion-reviewer`, `ai-interaction-reviewer`, `evidence-reviewer`, `learning-curator`. Each declares dispatch conditions, non-dispatch conditions, and a tool policy, and points at the skill that owns the procedure. Three superseded agents (`jakub`, `emi`, `cd`) are kept for provenance under `compound-design/quality/e2/legacy-resources/v0.2/agents/`.
- **Review system.** The four skills that emit the finding contract — `cd-verify`, `cd-interface-review`, `cd-motion-review`, `cd-ai-interaction-review` — together with the contract they share. One shape, four domains.
- **Eval suites.** `compound-design/quality/evals/v0.3-contract-suite.json` (groups `v0.3-skill`, `carried-over-skill`, `v0.3-agent`, `discovery`) and the per-skill `evals/evals.json` files under `skills/cd-quality-gate/` and `skills/cd-ai-interaction-review/`. The run record is `compound-design/quality/releases/v0.3-contract-eval.json`: 26 resources checked, four groups passed, evidence level E1, with the note that this "proves nothing about runtime effectiveness."
- **Audit.** The frozen benchmark rubric under `case-study/design-benchmark/rubric/`: `audit.html.frozen` from `DaniloAmaralUX/compound-labs-design@364430b`, 54 items in 9 categories, hashed in `RUBRIC-MANIFEST.json`, each item classified before scoring in `ITEM-CLASSIFICATION.json`.

An organism is the first layer that can be **promoted or removed** on evidence. `compound-design/quality/WRAPPER-VALUE-AUDIT.md` exists to remove organisms that add no leverage; the registry records what replaced what.

### 2.4 System — organisms that route to one another, with a registry, a ledger and gates

Holds: workflow, pipeline, work system, design system, evidence system.

Examples:

- **Workflow.** `Frame → Model → Build → Verify → Polish → Compound → Repeat` (`compound-design/README.md`), owned by `agents/compound-design.md`, whose stated specialism is "choosing the smallest sufficient path" through it.
- **Pipeline.** `compound-design/tools/cd.mjs` — `discover` (deterministic, bounded search over solution frontmatter; no model involved), contract tests, plugin validation — and `compound-design/tools/cd-lint.mjs`, the evidence/provenance/claim lint with its mutation self-test.
- **Work system.** `compound-design/registry/resource-registry.json` against `resource.schema.json`: every skill and agent registered with its path, status, evidence level and supersession links. The registry is how the system knows what it is made of.
- **Design system.** The token block in `src/app/globals.css` and the components under `src/components/` — the conventional sense of "design system", present here as one system among several rather than as the whole.
- **Evidence system.** `compound-design/quality/CD-EVIDENCE-LEVELS.md` (E0–E4 and the claim each level permits), `EVIDENCE-DEBT.md` (the declared gap between construction and proof), `QUALITY-GATE.md`, and the release records under `quality/releases/`. This is the part of the system that stops the other parts from overclaiming.

### 2.5 Product — the interface a project ships, built with the system and judged against it

Holds: interface, application, tool.

Examples:

- This site — `compoundmetrics`, deployed at `compoundmetrics.vercel.app` and `cdguide-seven.vercel.app` from the same commit (`case-study/FREEZE.md`).
- `compound-labs-design`, whose `/audit` page became the frozen rubric.
- `studio-dev-ui`, whose `compound-design` page was carried byte-identical into this repository's `/` (`case-study/knowledge/TRANSFER-GRAPH.md`, chain 3).
- The wider set the case study is about: `case-study/history/TOOLS-MANIFEST.json` lists 24 tool candidates against the brief's figure of 17, of which 8 are verified against a readable repository. The two counts are deliberately not reconciled by the case study; the manifest says why.

The product layer is where the model is tested, because a product is the only layer that meets a user. Eleven milestones of this site were captured, built from their exact commits, and scored against the frozen rubric (`case-study/archive/V01` … `V11`, `case-study/design-benchmark/`).

### 2.6 Feedback — what the product sends back down

```text
PRODUCT
→ REAL USE
→ OBSERVATION
→ FAILURE
→ LEARNING
→ NEW ATOM
```

This is the layer the other five exist for. In this repository it has one fully verified end-to-end instance and several recorded failures, and both matter equally.

**The verified instance** (`case-study/knowledge/TRANSFER-GRAPH.md`, first chain):

| Stage | What it was | Where |
| --- | --- | --- |
| Product | the `/project` timeline on this site | `src/components/Timeline.tsx` |
| Real use | the deterministic site check run against the exported site | `scripts/site-check.mjs` |
| Observation | nine "serious" contrast violations that vanished a second later | `LEDGER.md` `CD-20260909-013` |
| Failure | the check measured the animation, not the design; a second false signal from aborted prefetches | same entry, `observed:` |
| Learning | "measure the page at rest"; treat `ERR_ABORTED` as noise | `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md`, `CD-SOL-20260909-01` |
| New atom | the wait before axe (line 208) and the `ERR_ABORTED` filter (line 189), with the rule stated in a comment; the solution discoverable by its `signals` | `scripts/site-check.mjs`; `compound-design/DISCOVERABILITY-CONTRACT.md` |

Note what the chain does not show: the rule and its reuse land in the same commit and the same tool. The case-study capture scripts wait 2000 ms before axe and ignore `ERR_ABORTED` too, but cite nothing, so reuse in a *later* tool is recorded as unverified (edge `E55`). The transfer graph refuses to infer what it cannot read.

**The recorded non-transfer** (edge `E45`): ledger entry `CD-20260909-011` fixed a bug in the claim guard; entry `CD-20260909-012` records "exactly the failure already fixed once in the claim guard, reintroduced in a second guard." The lesson line says why: the first fix was applied to one guard rather than turned into a rule for all of them. The loop did not close by itself. It closed when someone wrote the rule down.

## 3. The feedback loop in full

The six-step form above is the short version. The version the system actually runs has a gate in the middle:

```text
PRODUCT
  ↓
AUDIT / REAL USE
  ↓
FINDING
  ↓
LEARNING
  ↓
IS THIS DURABLE?
  ↓
RESOURCE CANDIDATE
  ↓
RULE / PATTERN / COMPONENT / EVAL / SKILL / AGENT
  ↓
SYSTEM IMPROVES
  ↓
NEXT PRODUCT
```

"Is this durable?" is the step that keeps the loop from filling the system with noise. `skills/cd-compound/SKILL.md` writes at most **one** learning per run, only when it "would otherwise have to be rediscovered" and is not already recoverable from the code, and says outright that "most work teaches nothing durable, and that is a valid result." `skills/cd-compound-refresh/SKILL.md` audits the store and applies one of five outcomes to each document — keep, update, consolidate, replace, delete — so bad knowledge can leave. `agents/learning-curator.md` owns the judgment. The ledger states the promotion path in one line:

`real work → ledger entry → reproducible failure → regression eval → minimal change → falsification/holdout → version decision`

Each arrow in that line is a place the loop can stop, and the ledger's own rule 5 is that "ledger entries are evidence inputs, not proof of uplift."

## 4. What the model is not

**Not a rigid taxonomy.** The layers are positions, not types. The finding contract is a molecule when a reviewer composes it and part of an organism when four reviewers share it. A token is an atom in the design system and a component of the product. `scripts/site-check.mjs` is a check (molecular, with its rule), a pipeline stage (system) and the "real use" of the product in the verified chain. If a thing must be filed in exactly one layer, the model is being used as a filing cabinet, which it is not for. Present it as composition plus feedback; that is the whole of it.

**Not a recognised methodology.** No body, publication or practitioner outside this project has adopted, reviewed or named Atomic AI Design. It is one author's model, first written down in the case study you are reading.

**Not an official evolution of Atomic Design.** Brad Frost's Atomic Design supplied the vocabulary of parts composing into wholes. He has not seen, endorsed or commented on this model, and the transfer graph could not even verify the term's route into this project's earlier work — it appears once, unattributed, in `supernova-catalogo` (edge `E88`, unverified). The term "atomic" here is a borrowing, acknowledged in `PROVENANCE-NOTE.md`, not a lineage.

**Not a product of Every.** Compound Engineering supplied the compounding idea and several architecture mechanisms, each recorded with an adopt/adapt/defer/reject decision in `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`. Every did not create, review or validate Atomic AI Design.

**Not a claim about outcomes.** Nothing in the six layers says a product built this way is better, faster or cheaper. The evidence system exists precisely so that the layers cannot be read as that claim. At E1 the permitted claim is "contract-tested"; "proven to improve outcomes" is listed as not allowed at that level (`CD-EVIDENCE-LEVELS.md`).

**Not self-closing.** Edge `E45` is in the record because the loop failed to close once already. A model whose feedback layer is described as automatic would be contradicted by its own ledger.

## 5. What would falsify this thesis

The thesis makes claims that can be wrong. Here is what wrong would look like, per claim, in terms of things this repository already measures.

**"Knowledge units compose like parts."** Falsified if organisms cannot be shown to be made of stated atoms — if a skill enforces rules that exist nowhere as a rule, token, check or finding, or if the contract suite (`v0.3-contract-suite.json`) cannot express what a skill must satisfy without reading the skill's prose. Currently 26 resources pass a deterministic contract; that supports composition at E1 and no further.

**"Knowledge units can be treated as parts — versioned, superseded, routed, removed."** Falsified if the registry's `supersedes` / `supersededBy` links, the five refresh outcomes and the wrapper-value audit turn out to be unused: if superseded resources keep being invoked, if no learning is ever deleted, if no wrapper is ever removed. "Part" would then be a metaphor rather than a mechanism. The record so far: three supersessions and one wrapper-value audit, all in one release cycle. Too few to confirm; enough to test.

**"Products feed new atoms back into the system."** Falsified if, over a run of products, no atom can be traced from a product failure: no ledger entry becomes a solution, no solution becomes a rule in code, or every reuse edge stays `verified: false`. The current count is one fully verified chain, one unverified reuse (`E55`) and one recorded non-transfer (`E45`). If the next several products add only unverified or failed edges, the feedback layer is a diagram, not a loop.

**"Learning is discoverable by a later, different context."** Falsified deterministically: `cd discover` returns nothing for the context the solution was written to serve, or the `discovery` group of the contract suite fails on the planted fixture. This is the cheapest falsification in the set and runs without a model.

**"The system improves the next product."** This is the operational thesis (`Build the application. Improve the system that builds the next one.`) and it is the one this repository cannot currently test. It would be falsified by the pre-registered E2 pack (`compound-design/quality/e2/`) showing Compound conditions no better than the base model or direct upstream use on the same tasks across repeated runs — or by the design benchmark's later milestones scoring no better than earlier ones against the frozen rubric on items the system was supposed to have learned. The benchmark (`case-study/design-benchmark/`) is a design score, not runtime evidence, and cannot substitute for E2. Until E2 runs, this claim is a hypothesis with a declared test and no result.

**"The lens is useful."** Weakest and most honest: falsified if the same record — chronology, transfer graph, learning yield, benchmark — is explained equally well without the six layers. A model that adds names but no distinctions should be dropped. The test is whether the layers let a reader predict where a failure will surface and where its fix will land. They did for `E45` (the fix landed one layer too low). One case.

## 6. Relation to the evidence boundary

Read alongside `case-study/FREEZE.md`, `compound-design/quality/CD-EVIDENCE-LEVELS.md` and `compound-design/quality/EVIDENCE-DEBT.md`:

| Layer | What can be said today | What cannot |
| --- | --- | --- |
| Atomic, molecular | they exist, in fixed shapes, at cited paths | that any one of them is correct in general |
| Organism | contract-tested (E1); registered; superseded where replaced | demonstrated uplift; measured routing accuracy |
| System | deterministic contracts, lint, discovery all pass | that the system improves outcomes |
| Product | measured against a frozen rubric; differences between milestones observed | that a design score is runtime evidence or business impact |
| Feedback | one verified chain, one recorded failure to transfer | that the loop closes reliably or automatically |

The case can grow. The claim cannot grow without evidence.

## 7. The claim, in one place

> The atomic unit of an AI-native design system is not only interface. It can also be knowledge.

That is the hypothesis. The rest of this document says what it would take to believe it, what exists that bears on it, and what would make it false.

## Sources

- PRD §0 executive summary, §1.3 thesis, §19 model, §20 inspiration boundary, §38 claim discipline, §39 evidence boundary, §47 narrative principle.
- `case-study/FREEZE.md` — evidence boundary and frozen surfaces.
- `case-study/knowledge/TRANSFER-GRAPH.md` / `.json` — verified and unverified transfers, edges `E45`, `E55`, `E88`.
- `compound-design/learning/LEDGER.md` — entries `CD-20260909-011`, `-012`, `-013`.
- `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md` — `CD-SOL-20260909-01`.
- `compound-design/FINDING-CONTRACT.md`, `compound-design/DISCOVERABILITY-CONTRACT.md`.
- `compound-design/registry/resource-registry.json`, `resource.schema.json`.
- `compound-design/quality/CD-EVIDENCE-LEVELS.md`, `EVIDENCE-DEBT.md`, `QUALITY-GATE.md`, `WRAPPER-VALUE-AUDIT.md`, `evals/v0.3-contract-suite.json`, `releases/v0.3-contract-eval.json`.
- `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`, `PRODUCT-EXPERIENCE-REFERENCES.md`; `compound-design/SOURCES.md`; `NOTICE`.
- `skills/*/SKILL.md`, `agents/*.md`, `scripts/site-check.mjs`, `src/app/globals.css`, `src/components/Timeline.tsx`.
- Figure: `case-study/theory/atomic-ai-design.svg` (1600×1000) and `atomic-ai-design-vertical.svg` (1080×1400).
