# Compound Design — the case

Frozen 2026-09-09 on branch `claude/compound-design-case-study`, base `921d751aff5df8e14d998f993e2d171db842719d` (source: case-study/FREEZE.md). Every number in this document is read from a file in this repository and cited inline as (source: path). Paths are relative to the repository root.

**Evidence boundary, unchanged by anything below** (source: case-study/FREEZE.md): v0.3.0-alpha.1 is a candidate; v0.2.1 is the stable evidence baseline; the maximum Compound Evidence Level (CEL) is E1; the E2 runtime experiment is NOT EXECUTED; runtime uplift is NOT MEASURED; paid experimental runtime is 0 and this work adds 0.

**What the score means.** "Compound Design Audit Score" = PASS / (PASS + FAIL) × 100, N/A excluded, NOT_VERIFIED excluded from the score and counted in coverage. It is performance against one frozen ruler — the author's own 54-item audit as it existed on 2026-07-16 — and nothing else (source: case-study/design-benchmark/METHODOLOGY.md §3). It is not a universal quality score and it is not runtime evidence.

---

## 01 — I built 17 tools with AI

I built 17 tools with AI this year. They did not become a portfolio. They became a system.

Seventeen is the author's count. The account's metadata does not produce that number, and the case study does not force it to. What the metadata supports (source: case-study/history/TOOLS-MANIFEST.json):

| | Count | Basis |
| --- | ---: | --- |
| Tools named in the brief | 17 | author's statement |
| Tool candidates found | 24 | Vercel project list (capped at 50 by the API) + git history + page content, after merging duplicate projects and excluding a template (`nextjs-boilerplate`) and an unnamed project (`app`) |
| Verified against a readable repository | 8 | `compound-labs-design`, `studio-dev-ui`, `design-engineering-guide`, `studio-ds`, `supernova-catalogo`, `geistlabsds`, `processo`, `compoundmetrics` |
| Inferred from Vercel names and dates only | 16 | marked medium or low confidence; client work marked `privacy: review-required` |
| Captured as design milestones | 7 tools → 11 milestones | source: case-study/history/DESIGN-MILESTONES.json |

The two counts are not reconciled. Nothing was removed to reach 17 and nothing was added to reach 24; the manifest keeps every candidate with its confidence, and the author decides which count (source: case-study/history/CHRONOLOGY.md, "What the brief says vs what the metadata supports").

The verified dates run from 2025-01-15 (a v0.dev experiment, `v0-labs-zek4f33pdew`, purpose not recoverable) to 2026-09-09 (this repository) (source: case-study/history/TOOLS-MANIFEST.json, tool-01 and tool-24). Between them: v0-generated dashboards, a storefront, a form builder and a medical-report SaaS in late 2025; client and internal work (Agno handoff, ten SESI projects across four repositories, an ombudsman portal, Tramontina) through mid-2026; and, from 2026-07-13, the line that this case is about — `compound-labs-design`, the first artifact named *Compound* (source: case-study/history/CHRONOLOGY.md, Timeline).

"Verified" means a repository was readable in this session and the dates are git author dates. For the other sixteen candidates the only evidence is a Vercel project creation date. Their design was not captured and their code was not read (source: case-study/history/TOOLS-MANIFEST.json, `captured: "no"`).

## 02 — Output scaled faster than memory

The output was compounding. The knowledge wasn't.

The manifest is the record of that. For the first eight tool candidates — v0 Labs, two accounting dashboards, the storefront, Laudo, the form builder, Dashboard Contabilidade, Fino Acabamento, AuditContábil — `resources_created` is `[]` and `resources_reused` is `[]` for every one (source: case-study/history/TOOLS-MANIFEST.json, tool-01 … tool-08). Three Vercel projects for one accounting dashboard were created within 25 minutes of each other on 2025-12-31; the manifest treats them as one tool with two generations, because that is all the metadata can say about them (source: case-study/history/TOOLS-MANIFEST.json, tool-06). SESI alone left ten Vercel projects across four repositories between 2026-07-14 and 2026-09-03 (source: tool-11).

The transfer graph, which only records an edge when a file, a commit or a quote shows it, could not find a single rule, pattern or resource that any of those tools taught a later one. The claim "v0-era tools (tool-01 … tool-08) taught any rule, pattern or resource reused by a later tool" is listed under `none_verified` with the reason: no repository readable, no resources listed, no later reference anywhere (source: case-study/knowledge/TRANSFER-GRAPH.json, `none_verified`). The same holds for the client and internal projects (tool-10, 11, 14–17, 19, 22).

Two tools that did leave a repository still left no trace forward. `design-engineering-guide` (2026-07-20, a knowledge base with no interface) is never referenced by a later repository; `studio-ds` (2026-08-05, a registry site built in one day) is never named in the logs of the three later catalogue repositories — zero hits (source: case-study/knowledge/TRANSFER-GRAPH.md, "What is implied but not proven").

That is the problem stated in the data rather than from memory: by September 2026 there were twenty-four things deployed and the only knowledge that provably travelled between any of them is what had been written into a repository as a file. Everything held in the author's head about the first fifteen months is, for the purposes of this record, gone.

## 03 — Different tools, same problems

Different products. Same mistakes.

The frozen ruler was applied to eleven milestones from seven tools and produced 139 findings — every FAIL with evidence (source: case-study/design-benchmark/reports/FINDINGS.json, `count`). Ninety-nine of the 139 are classified `duplicate-known-learning`: the same audit item had already failed in an earlier milestone, or an active resource already encodes the rule (source: case-study/design-benchmark/reports/learning-yield.json, `states`).

The ten most persistent failures, with how many of the eleven milestones they fail in (source: case-study/design-benchmark/SUMMARY.json, `delta.most_persistent_failures`; plain-word glosses and "passed in" from case-study/design-benchmark/EVOLUTION.md §3.3):

| Item | Plain words | Mode | Fails | Applicable | Passed in |
| --- | --- | --- | ---: | ---: | --- |
| estilo/espaco-base | spacing values on a 4/8-px base (≥ 90 % multiples of 4) | deterministic | 10 | 11 | V07 only |
| acessibilidade/alvos | touch targets ≥ 44 px at 390 wide (≥ 90 % of targets) | deterministic | 9 | 9 | never (N/A in V08, V10: no targets) |
| estilo/radius | same radii for the same roles (≤ 4 distinct) | deterministic | 9 | 10 | V01 only |
| formularios/labels | every input has a visible label | deterministic | 7 | 7 | never |
| formularios/input-16px | input text ≥ 16 px at 390 so iOS does not zoom | deterministic | 7 | 7 | never |
| acessibilidade/semantica | real headings/lists, landmarks present | deterministic | 7 | 11 | V01, V08, V10, V11 |
| estilo/tipo-sistema | ≤ 2 families, limited intentional weights | deterministic | 6 | 11 | V02, V03, V04, V06, V07 |
| navegacao/menu-previsivel | same navigation, same place, on every page | deterministic | 6 | 9 | V02, V06, V11 |
| hierarquia/escala-tipo | all sizes from one type scale (≤ 10 distinct) | deterministic | 6 | 11 | V01, V02, V05, V06, V07 |
| navegacao/onde-estou | current nav item visibly highlighted | deterministic | 5 | 9 | V03, V04, V09, V11 |

All ten are deterministic — decided by a pre-declared rule over the DOM, computed style, axe-core or bounding boxes, not by a judge (source: case-study/design-benchmark/rubric/ITEM-CLASSIFICATION.json via EVOLUTION.md §3.3). What "the same mistake" looks like when measured:

- **Tap targets.** On the audit page itself, 1 of 64 targets meets 44 px at 390 wide; the theme buttons are 26×26 (source: case-study/design-benchmark/results/V01/site.json, `acessibilidade/alvos`, via EVOLUTION.md §6). Two months and six tools later, the product-experience preview measures 8/32, 23/47, 8/26 and 11/29 targets across its four surfaces, with the brand link at 184×30 (source: case-study/design-benchmark/results/V11/deterministic.json via EVOLUTION.md §4.1).
- **Spacing grid.** V01: 41 of 71 spacing values on the 4-px grid; off-grid values 10, 2, 14, 18, 6 px (source: case-study/design-benchmark/reports/FINDINGS.json, `F-V01-estilo-espaco-base`). V11: 40.6–64.7 % on grid, with 10, 18, 6, 14, 2 px dominating (source: EVOLUTION.md §4.1). The off-grid values are the half-steps of the Tailwind/shadcn scale every tool uses; the learning-yield report reads this as the author's checklist and the author's stacks disagreeing systematically (source: case-study/design-benchmark/reports/LEARNING-YIELD.md, DL-01).
- **Input labels and input size.** V01 DETAIL: 0 of 11 inputs labelled (markdown checkboxes in a skill document); V11 INTERACTION: 2 of 3, the email field has a placeholder only (source: EVOLUTION.md §6 and §4.1). The 16-px rule fails on 13.33-px checkboxes in V01 and on 15-px name/email/password inputs in V11 (same sources).
- **Zoom reflow.** Horizontal overflow at CSS zoom 2: 175 px in V04 and V09, 467 px in V06, 13 px on all four V11 surfaces (source: EVOLUTION.md §4.4).

Eight of the 54 items never failed anywhere (source: EVOLUTION.md §3.3). The rest of the ruler's discriminating power sits in its 23 rule-based items: in every milestone but V07 the deterministic score is lower than the judgment score (source: EVOLUTION.md §1).

## 04 — I started extracting decisions

I stopped keeping good decisions in my head. I started encoding them.

The first artifact named *Compound* is `DaniloAmaralUX/compound-labs-design`, first commit `d08ec62` on 2026-07-13: three Design Engineering skills — `compound-design-ui`, `compound-design-type`, `compound-design-color` — and a Claude Code plugin with `cl-design`, `cl-review` and `cl-audit` commands (source: case-study/history/CHRONOLOGY.md, Timeline; case-study/history/TOOLS-MANIFEST.json, tool-09 `resources_created`). Three days and 27 commits later, at `364430b` (v3.6.0, 2026-07-16), the site carried `/audit`: 54 `[data-audit-check]` items in 9 `data-cat` groups, counted from the source of `audit.html`, and deployed to production as `dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ` (source: case-study/FREEZE.md, "Current audit"; case-study/history/TOOLS-MANIFEST.json, tool-09). The `/audit` page was added at commit `edbfdd1` (source: case-study/knowledge/TRANSFER-GRAPH.md, item 1).

Two things about that first extraction the record insists on. The `cl-audit` playbook (8 categories) has existed since `d08ec62` and predates the `/audit` page by three days; neither references the other. The chronology's original line "`/audit` → `cl-audit`" is unsupported and is recorded as unverified edge E09 (source: case-study/knowledge/TRANSFER-GRAPH.json, E09). And the `/audit` items themselves are described by the site's build script as curated from a `compound-design-audit` skill in `DaniloAmaralUX/skills` — a repository that is not readable here, so the checklist's own upstream is unverified (E10, same source).

The extractions that followed, in date order (source: case-study/history/TOOLS-MANIFEST.json, `resources_created` per tool; dates from case-study/history/CHRONOLOGY.md):

| Date | Tool | What was written down |
| --- | --- | --- |
| 2026-07-13 → 07-16 | compound-labs-design (tool-09) | three skills, the 54-item `/audit`, the plugin |
| 2026-07-20 | design-engineering-guide (tool-13) | knowledge base: practices, skills, tools; no interface |
| 2026-08-05 | studio-ds (tool-18) | `registry.json` + catalog |
| 2026-08-13 | studio-dev-ui (tool-12) | `docs/solutions/` — "one note per problem actually solved" (commit `8265803`, source: TRANSFER-GRAPH.json E89) |
| 2026-08-22 → 08-24 | studio-dev-ui (tool-12) | catalog contract + taxonomy, gallery honesty gate, playground URL engine |
| 2026-09-05 → 09-07 | supernova-catalogo (tool-20) | the Compound Design framework v0.1 → v0.2.1 on branch `compound-design-framework` |
| 2026-09-09 | compoundmetrics (tool-24) | 15 skills, 6 agents, finding contract, discoverability contract, registry v0.3, E2 pre-registered harness |

Not every extraction travelled. The knowledge base and the studio-ds registry are the two that left no verified trace forward (§02). The `docs/solutions` pattern appears again in this repository, but no file attributes it to studio-dev-ui — the documented lineage is Every's `<root>/solutions/` — so that link is recorded unverified (E89) (source: case-study/knowledge/TRANSFER-GRAPH.json).

## 05 — Tools began feeding other tools

Different products. Same knowledge.

The transfer graph was built read-only from file contents, commit messages and md5 comparisons at named commits; nothing was inferred from plausibility (source: case-study/knowledge/TRANSFER-GRAPH.md, header). Its counts (source: case-study/knowledge/TRANSFER-GRAPH.json, `counts`; node/edge types from TRANSFER-GRAPH.md):

| | |
| --- | --- |
| Nodes | 80 — 8 tools, 5 externals, 67 resources (skill / agent / contract / rule / pattern / component / eval / registry / resource) |
| Edges | 105 |
| Verified | 97 |
| Unverified, with reason | 8 — E09, E10, E55, E62, E87, E88, E89, E90 |
| End-to-end chains | 9 — 8 fully verified, 1 partial |
| `none_verified` entries | 13 |

**Transfers that hold**, with the evidence type in brackets (source: case-study/knowledge/TRANSFER-GRAPH.md, "What the sources actually support"):

1. compound-labs-design → the benchmark's instruments. The `/audit` page (54 items) is the frozen rubric, instrument A; the plugin's `cl-audit` playbook (8 categories) is instrument B. [file content + commits]
2. supernova-catalogo@compound-design-framework → compoundmetrics. `LEDGER.md` and the three v0.2 agents (`jakub`, `emi`, `cd`) are byte-identical (md5) at supernova `7af6553`, compoundmetrics `18ffcf2` and the pinned `legacy-resources/v0.2/`. `NOTICE` names the source branch; the `migrate` commit bodies are empty. [md5 + NOTICE]
3. studio-dev-ui → compoundmetrics. `src/app/compound-design/page.tsx` and `page.module.css` at `231889f` are byte-identical to `src/app/page.tsx` / `page.module.css` at `18ffcf2`. [md5 + release record]
4. Jakub Krehel / Emil Kowalski heuristics (MIT) → v0.2 wrapper agents → migrated byte-identical → superseded by `cd-interface-review` / `cd-motion-review` → promoted E0→E1 in `c61b896` → pinned for E2. [registry + SOURCES + commits]
5. Every Compound Engineering → `EVERY-ARCHITECTURE-SNAPSHOT.md` (pinned commit, eight ADOPT decisions) → ten registry resources marked `upstream-informed` → `cd-compound`'s durable-learning bar. [research doc + registry]
6. Evil Rabbit Lifeline (MIT) → three sibling adopters: `processo` (boilerplate copied, licence included), `geistlabsds` (same), compoundmetrics `Timeline.tsx` (interaction model adapted, nothing copied). [commits + attribution files]
7. Learning loops inside compoundmetrics: seven E2-pack failures (ledger 001–007); registry schema never executed (008) → validator wired into CI; claim-guard bug (011) → recurred in a second guard (012, a recorded non-transfer) → both reused as PRIOR LEARNING in the product-experience frame → plan. [LEDGER + frames + plans]

**Transfers that do not hold**, each recorded with its reason (source: case-study/knowledge/TRANSFER-GRAPH.json, edges with `verified: false`):

| Edge | Claimed | Why unverified |
| --- | --- | --- |
| E09 | `/audit` → `cl-audit` | `cl-audit` predates `/audit` by three days; 8 vs 9 categories; no cross-reference |
| E10 | `DaniloAmaralUX/skills` `compound-design-audit` → `/audit` items | named by `build-audit.mjs`; repository not readable here |
| E55 | "page at rest" rule → case-study capture scripts | the scripts wait 2000 ms before axe and ignore `ERR_ABORTED`, but cite nothing |
| E62 | processo → compoundmetrics Timeline | nothing in compoundmetrics outside `case-study/` names processo; attribution goes straight to `evilrabbit/lifeline@8ddbb3d` |
| E87 | Supernova tokens → geistlabsds | commit subjects only; bodies empty; no file read |
| E88 | Brad Frost → supernova-catalogo | the term "atomic design" appears twice, unattributed; "Brad Frost" appears in no readable repository |
| E89 | studio-dev-ui `docs/solutions` → compoundmetrics `docs/solutions` | no attribution; documented lineage is Every's `solutions/` |
| E90 | compound-labs-design skills → compoundmetrics legacy agents | both descend from `jakubkrehel/skills` independently; no source shows one feeding the other |

Two of those corrections change the story the chronology first told: processo is not on the path to this repository's timeline (the Lifeline → compoundmetrics chain is verified *directly*, and the Lifeline → processo → compoundmetrics chain is the one partial chain), and the compound-labs-design skills did not feed the v0.2 agents (source: case-study/knowledge/TRANSFER-GRAPH.md, "Corrections to the chronology").

One edge is a transfer that failed and was written down as such. E45: the claim-guard fix recorded in `CD-20260909-011` was applied to one guard rather than turned into a rule for all of them, and the same bug reappeared in the benchmark's CI guard (`CD-20260909-012`) (source: case-study/knowledge/TRANSFER-GRAPH.md, chain "Ledger CD-20260909-011/012"; compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Adversarial review"). The loop did not close by itself.

## 06 — The audit became part of the system

The system does not only build interfaces. It inspects what it built.

The `/audit` page that a tool shipped in July became, in September, the ruler the whole line was measured with. It was frozen from source before any surface was scored: `audit.html` from `compound-labs-design@364430b`, version marker v3.6.0, 54 items in 9 categories, page sha256 `11034e8b…3947e2a`, rubric JSON sha256 `7c7c6915…78a279`, frozen at 2026-09-09T15:32:10Z (source: case-study/design-benchmark/rubric/RUBRIC-MANIFEST.json). Before scoring, each of the 54 items was declared either deterministic (23) or judgment (31) with its rule and N/A condition (source: case-study/design-benchmark/METHODOLOGY.md §2, `rubric/ITEM-CLASSIFICATION.json`). The order of operations is recorded to the second: rubric frozen 15:32:10Z → classification declared 15:39:40Z → captures 15:50–15:51Z → judgment files frozen and hashed 16:51:35.421Z → mapping revealed 16:51:35.422Z → SUMMARY generated 16:51:35.505Z (source: case-study/design-benchmark/EVOLUTION.md §7).

**The audit against its own ruler.** V01 is the exact commit that serves `/audit`. It was given no immunity: captured, blinded as DESIGN-E and scored like the other ten (source: EVOLUTION.md §6; case-study/design-benchmark/RANDOMIZATION.json, `mapping`). Result (source: case-study/design-benchmark/results/V01/site.json, `overall`, `deterministic_only`, `judgment_only`):

| | PASS | FAIL | N/A | NOT_VERIFIED | Score | Coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Overall | 30 | 11 | 11 | 2 | 73.2 | 95.3 |
| Deterministic items | 12 | 9 | 2 | 0 | 57.1 | 100 |
| Judgment items | 18 | 2 | 9 | 2 | 90.0 | 90.9 |

Per category: fundamentos 100, hierarquia 100, estilo 57.1, acessibilidade 88.9, navegacao 33.3, carga 50 (coverage 50), onboarding 100, confianca 0, formularios 0 (same source, `categories`).

Does the audit that judges interfaces meet its own ruler? No, on 11 of its 41 scored items, nine of which land on the audit page itself (source: EVOLUTION.md §6):

| Item | Where it fails | Evidence | On /audit? |
| --- | --- | --- | --- |
| estilo/espaco-base | all four surfaces | /audit: 299/568 values on grid (52.6 %) | yes |
| estilo/tipo-sistema | DETAIL, INTERACTION | 3 families: Inter / Geist Mono / Arial — Arial is the sandbox's fallback for blocked Google Fonts | yes, with caveat |
| estilo/motion | ENTRY, DISCOVERY, DETAIL | 500 ms durations; /audit passes | no |
| acessibilidade/alvos | all four | /audit: 1/64 targets ≥ 44 px; theme buttons 26×26 | yes |
| navegacao/onde-estou | DISCOVERY, DETAIL, INTERACTION | 2 nav items, no aria-current, no styled difference | yes |
| navegacao/menu-previsivel | site | 2 distinct primary-nav texts across 4 surfaces | yes |
| formularios/labels | DETAIL | 0/11; /audit itself passes 54/54 | no |
| formularios/tipos-campo | INTERACTION | 0/11 candidates; the page has only checkboxes and a read-only command field | yes |
| formularios/input-16px | DETAIL, INTERACTION | all 54 checkboxes at 13.33 px | yes |
| carga/disclosure | INTERACTION | all 54 items expanded on a 6709-px page | yes |
| confianca/logos | DETAIL, INTERACTION | INSTALL box with no social proof | yes |

NOT_VERIFIED (2), both on /audit: carga/feedback and carga/recuperacao — no post-click state was captured (same source). The caveats are recorded, not used to exempt: the ruler is frozen, the rules as written produce these FAILs, and the same rules were applied to every other milestone. Four of the eleven are later classified as measurement artefacts in the learning-yield pass (fonts blocked; checkbox inputs under text-input rules) and kept with their reason (source: case-study/design-benchmark/reports/learning-yield.json, `rejected_list`).

What the audit page passes on its own ruler: heading structure, type scale (7 sizes), radius (4 radii), motion, keyboard reach (64 interactive, 0 `tabindex=-1`), focus, contrast (0 axe violations), semantics, reduced motion, zoom (0 px overflow), labels (54/54), and the judgment items for reading order, proximity, colour-plus-signal, quick value, empty states ("0/54 itens · 0 %" explained in place), contextual hints and flow progress (source: EVOLUTION.md §6).

**Inspection inside the system.** The same move — build, then measure what was built — exists in the repository as executable steps: `scripts/site-check.mjs` runs axe and route checks against the exported site; `cd:claims` scans 14 active surfaces for inflated claims; `cd:registry` executes the registry schema, which is how a long-standing violation of it was found (`CD-20260909-008`); CI carries a `work-system` job that runs lint, registry, contract suite, plugin gate, claim guard and self-test (source: compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Changed" and "Verification performed"; .github/workflows/ci.yml). The one fully verified finding → learning → rule → reuse chain in the record starts from that site check, not from the rubric: nine "serious" contrast violations that vanished a second later → ledger `CD-20260909-013` → `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md` → "measure the page at rest" → the wait before axe and the `ERR_ABORTED` filter in `scripts/site-check.mjs` (lines 208, 189) → discoverable by its `signals` (source: case-study/knowledge/TRANSFER-GRAPH.md, first chain). Rule and reuse land in the same commit and tool; reuse in a later tool is not shown (same source).

It does not only fix failures. It decides which failures deserve to become knowledge. `cd-compound` writes at most one learning per run, only when it would otherwise have to be rediscovered, and states that most work teaches nothing durable and that this is a valid result; `cd-compound-refresh` can keep, update, consolidate, replace or delete a document (source: case-study/theory/ATOMIC-AI-DESIGN.md §3, citing `skills/cd-compound/SKILL.md` and `skills/cd-compound-refresh/SKILL.md`).

## 07 — The idea behind Atomic AI Design

What if the atomic unit was not only UI? What if knowledge itself was composable?

Atomic AI Design is the author's mental model for treating design knowledge as composable capability: observations, decisions, rules, patterns, components, evals, skills and agents combine into larger work systems, while real products feed new learning back into those systems. It is the authorial thesis of this case study — a lens the author uses to read the record, not a result the record produced, and not a methodology anyone else has recognised (source: case-study/theory/ATOMIC-AI-DESIGN.md, opening). Its status is "hypothesis under test in real use" (same source).

The recommended formulation, quoted as written (source: case-study/theory/PROVENANCE-NOTE.md §1, from PRD §20):

> Compound Design explores what happens when the compounding philosophy used in agentic engineering meets a design-system way of thinking about composable parts — and extends the "part" from UI components to reusable design knowledge.

The model has six layers. Each is named with one thing from this repository that sits in it (source: case-study/theory/ATOMIC-AI-DESIGN.md §2):

| Layer | Holds | One example at a cited path |
| --- | --- | --- |
| Atomic | observation, decision, rule, prompt, token, component, finding, test | ledger entry `CD-20260909-013` in `compound-design/learning/LEDGER.md`; the token `--accent` with its reason in `src/app/globals.css` |
| Molecular | atoms that only make sense together: rule + check, learning + signals, prompt + expected output | the "page at rest" rule plus the wait in `scripts/site-check.mjs`; a solution document with its `signals` frontmatter |
| Organism | a bounded resource with a routing contract and an evaluation path: skill, agent, eval suite, audit | the fifteen skills under `skills/`; the six agents under `agents/`; the frozen rubric under `case-study/design-benchmark/rubric/` |
| System | organisms that route to one another, with a registry, a ledger and gates | `compound-design/registry/resource-registry.json`; `compound-design/tools/cd.mjs`; the evidence levels in `compound-design/quality/` |
| Product | the interface a project ships | this site; `compound-labs-design`; `studio-dev-ui` |
| Feedback | PRODUCT → REAL USE → OBSERVATION → FAILURE → LEARNING → NEW ATOM | the verified `CD-20260909-013` chain; the recorded non-transfer E45 |

The model describes composition and feedback, not quality: a knowledge unit can be well-formed, versioned and discoverable and still be wrong or useless; the layers say where a thing sits, the evidence levels say how much it has been shown to help (source: ATOMIC-AI-DESIGN.md §1). The theory document lists what would falsify each of its claims in terms of things the repository already measures — including the operational claim "the system improves the next product", which it says the repository cannot currently test: E2 has not run, and the design benchmark is a design score, not runtime evidence (source: ATOMIC-AI-DESIGN.md §5).

**Provenance, as the record allows it to be stated** (source: case-study/theory/PROVENANCE-NOTE.md §2–§3):

- Compound Design was inspired by the compounding idea in Every's Compound Engineering. Named architecture mechanisms were adapted from Every's plugin at pinned commit `b36047e1` under its MIT licence, with an adopt/adapt/defer/reject decision recorded for each in `compound-design/research/EVERY-ARCHITECTURE-SNAPSHOT.md`. Every did not create, review, validate or endorse Atomic AI Design or this case study.
- Atomic AI Design borrows the words *atomic*, *molecular* and *organism* from Brad Frost's Atomic Design; *system*, *product* and *feedback* are not his layers. Nothing by Brad Frost is copied or quoted; he has not seen, endorsed or commented on this model. The transfer graph could not verify any attributed route from Atomic Design into the earlier tools — the term appears twice in `supernova-catalogo`, unattributed (E88).
- The thesis sentence and its name are this project's own.

Where this document and the provenance note disagree, the note wins (source: PROVENANCE-NOTE.md, header).

## 08 — From tools to Work System

Products generate knowledge. Knowledge becomes capability. Capability improves the next product. That is the loop the Work System is built to run; whether it runs it well is unmeasured.

**Lineage.** The framework was developed as v0.1 → v0.2.1 on the `compound-design-framework` branch of `supernova-catalogo` (2026-09-05 → 09-07), presented publicly on studio-dev-ui's `/compound-design` page, and extracted into this repository on 2026-09-09 (`50c7a6a` initialised, `18ffcf2` migrated) with the ledger and the three v0.2 agents byte-identical (source: case-study/history/CHRONOLOGY.md, Timeline; case-study/knowledge/TRANSFER-GRAPH.md, items 2–3). v0.2.1 remains the stable evidence baseline (source: case-study/FREEZE.md).

**v0.3.0-alpha.1 — Work System**, released 2026-09-09 at `a7f8319`, production `dpl_6Av1MuU5xvbQAnS6uBkWVvKcUoA9` (source: case-study/FREEZE.md; case-study/history/DESIGN-MILESTONES.json, V10). Release stage: candidate. Its own release note states the reason for that word: "A candidate release exists because the architecture and the behaviour changed, not because anything was shown to work better. Nothing here is evidence of effectiveness." (source: compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, header).

**What the registry holds**, counted from the file (source: compound-design/registry/resource-registry.json, `resources[]` by `kind` and `status`):

| Kind | Active | Superseded | Ids |
| --- | ---: | ---: | --- |
| skill | 15 | 0 | `cd-frame`, `cd-model`, `cd-build`, `cd-verify`, `cd-polish`, `cd-compound`, `cd-strategy`, `cd-compound-refresh`, `cd-setup`, `cd-handoff`, `cd-interface-review`, `cd-motion-review`, `cd-quality-gate`, `cd-resource-lab`, `cd-ai-interaction-review` |
| agent | 5 | 2 | active: `interface-reviewer`, `motion-reviewer`, `ai-interaction-reviewer`, `evidence-reviewer`, `learning-curator`; superseded: `jakub`, `emi` |
| orchestrator | 1 | 1 | active: `compound-design` (public name Design Guide); superseded: `cd` |
| **total** | **21** | **3** | 24 registry entries |

The release note's "six specialist agents" counts the `compound-design` orchestrator among them; the registry types it as `orchestrator`. Both counts describe the same six files under `agents/` (source: compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Added"; registry as above). Every active resource is at CEL E1; `runtimeUplift` is "not measured" on every entry; `cdqi` is `null` for all but three carried-over skills (`cd-quality-gate` 8.75, `cd-resource-lab` 8.65, `cd-ai-interaction-review` 8.35) and the three superseded resources (source: resource-registry.json). The registry's own policy line: "CDQI measures construction quality. CEL measures evidence maturity. They must never be merged into one claim." (source: resource-registry.json, `evidencePolicy.rule`).

**Contracts.** `compound-design/FINDING-CONTRACT.md` gives the four reviewers one finding shape — `id, scope, severity, confidence, evidence, impact, recommendation, verification_state, source` — with a three-level severity ladder and gates that drop a finding without evidence and impact and refuse taste as defect. `compound-design/DISCOVERABILITY-CONTRACT.md` defines addressable frontmatter and a bounded deterministic search that `cd-frame` and `cd-model` must run before asking anything, and that `cd-compound` must prove its learning satisfies (source: v0.3.0-alpha.1-WORK-SYSTEM.md, "Added").

**Supersession.** `jakub` → `cd-interface-review` + `interface-reviewer`; `emi` → `cd-motion-review` + `motion-reviewer`; `cd` → `compound-design`; `resource-lab` (never registered) → `learning-curator`. Each replacement was rewritten, entered the registry at E0 and reached E1 only by passing the v0.3 deterministic contract suite, in a separate commit (`c61b896`) on the strength of `v0.3-contract-eval.json` (source: compound-design/releases/MIGRATION-v0.2-to-v0.3.md; compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Evidence state"; case-study/knowledge/TRANSFER-GRAPH.md, item 4). Superseded entries keep their historical level and name their successor; their files are pinned under `compound-design/quality/e2/legacy-resources/v0.2/` with a manifest proving byte-equivalence to the baseline commit `5fc74f1` (source: MIGRATION-v0.2-to-v0.3.md).

**What was verified at release**, as recorded (source: compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Verification performed"):

```
cd:lint      24 resources, release 0.3.0-alpha.1, CEL E1; 9/9 mutations rejected
cd:registry  schema + evidence rules, 21 active resources
cd:evals     26 checks across 4 groups, all passed
cd:plugin    15 skills, 6 agents, 5 host manifests, no legacy identifier on an active surface
cd:claims    no inflated claim on 14 active surfaces
cd:selftest  40/40
e2 self-test 32/32, including frozen resource equivalence and both directions of the CI guard
```

The contract-eval artifact says what passing means: "Deterministic contract evidence only. Passing proves the resources declare and satisfy their contracts; it proves nothing about runtime effectiveness, which remains not measured." (source: compound-design/quality/releases/v0.3-contract-eval.json, `note`). A candidate benchmark lane, `compound-design/quality/e2/candidate-v0.3/`, pre-registers a comparison of the rewritten resources against the released version they replaced. Not executed (source: v0.3.0-alpha.1-WORK-SYSTEM.md, "Added").

The release records its own known unknowns: whether any v0.3 resource improves an outcome over no resource, over direct upstream use, or over the v0.2 resource it replaced; whether discoverability changes decisions; whether the durability bar keeps the store useful; whether the routing boundaries hold under real work; whether fifteen skills is the right number (source: v0.3.0-alpha.1-WORK-SYSTEM.md, "Known unknowns"). Its adversarial review's answer to "Did the system get simpler, or just bigger?" is "Both, honestly": the surface grew from six resources to twenty-one; the structure got one canonical implementation, one finding shape, executable configuration and no runtime dependency on an upstream checkout (same source, "Adversarial review before release").

## 09 — First heterogeneous design round

Eleven design milestones from seven tools, in five design families — static site, registry sites, a catalogue over tokens, a documentation-style lab, a timeline interaction, and this repository's single page and multi-route site — were scored against one ruler on one day (source: case-study/history/DESIGN-MILESTONES.json, `why_distinct` per milestone). Each milestone is a design state, not a deployment: duplicates of the same commit count once, and merge rules were declared before fingerprints existed (same source, `principle`, `merge_evaluation`). Every capture is the exact commit built locally and rendered by headless Chromium at 1440×900 and 390×844, because the sandbox cannot reach `*.vercel.app` (same source, `capture_method`; case-study/FREEZE.md, "Environment constraints").

**Scores and coverage in chronological order** (source: case-study/design-benchmark/SUMMARY.json, `milestones[]`; identical to case-study/design-benchmark/DESIGN-EVOLUTION.csv):

| V | Milestone (tool) | Date | Score | Cov. | PASS / FAIL / N/A / NV | Det. | Judg. |
| --- | --- | --- | ---: | ---: | --- | ---: | ---: |
| V01 | Compound Labs Design, site + /audit (tool-09) | 2026-07-13 → 07-16 | **73.2** | 95.3 | 30 / 11 / 11 / 2 | 57.1 | 90.0 |
| V02 | Studio DS v1 (tool-18) | 2026-08-05 | **73.0** | 97.4 | 27 / 10 / 16 / 1 | 61.1 | 84.2 |
| V03 | Dev Studio UI — authorial rebuild (tool-12) | 2026-08-13 | **72.5** | 93.0 | 29 / 11 / 11 / 3 | 47.6 | 100 |
| V04 | Studio Dev UI — registry + originals (tool-12) | 2026-08-22 → 08-24 | **62.5** | 90.9 | 25 / 15 / 10 / 4 | 33.3 | 94.7 |
| V05 | Supernova Catálogo (tool-20) | 2026-09-06 → 09-09 | **58.7** | 92.0 | 27 / 19 / 4 / 4 | 43.5 | 73.9 |
| V06 | Geist Labs DS (tool-21) | 2026-09-07 → 09-08 | **65.1** | 87.8 | 28 / 15 / 5 / 6 | 45.5 | 85.7 |
| V07 | Processo — Lifeline-style timeline (tool-23) | 2026-09-08 | **65.6** | 97.0 | 21 / 11 / 21 / 1 | 70.6 | 60.0 |
| V08 | Compound Metrics v0.2.1, single page (tool-24) | 2026-09-09 | **80.8** | 96.3 | 21 / 5 / 27 / 1 | 63.6 | 93.3 |
| V09 | Studio Dev UI main, hosts the v0.2 page (tool-12 + tool-24) | 2026-09-09 | **63.2** | 92.7 | 24 / 14 / 13 / 3 | 35.0 | 94.4 |
| V10 | Compound Design v0.3.0-alpha.1 — production (tool-24) | 2026-09-09 | **67.9** | 96.6 | 19 / 9 / 25 / 1 | 63.6 | 70.6 |
| V11 | Compound Design — Product Experience preview, 8 routes (tool-24) | 2026-09-09 | **58.7** | 95.8 | 27 / 19 / 6 / 2 | 50.0 | 66.7 |

**Per category** (source: case-study/design-benchmark/DESIGN-EVOLUTION.csv; "—" = no scored item in that category):

| V | Antes de começar | Hierarquia visual | Estilo visual | Acessibilidade | Navegação | Carga cognitiva | Onboarding | Social proof | Formulários |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| V01 | 100 | 100 | 57.1 | 88.9 | 33.3 | 50 | 100 | 0 | 0 |
| V02 | 60 | 100 | 71.4 | 55.6 | 50 | 100 | 100 | 100 | — |
| V03 | 100 | 85.7 | 57.1 | 77.8 | 60 | 50 | 100 | 100 | 0 |
| V04 | 100 | 71.4 | 57.1 | 55.6 | 40 | 50 | 100 | 100 | 0 |
| V05 | 100 | 100 | 57.1 | 55.6 | 0 | 50 | 100 | 66.7 | 20 |
| V06 | 80 | 85.7 | 57.1 | 33.3 | 83.3 | 100 | 100 | 100 | 0 |
| V07 | 40 | 80 | 66.7 | 77.8 | 25 | 100 | 100 | — | — |
| V08 | 100 | 83.3 | 40 | 100 | — | 50 | 100 | 100 | — |
| V09 | 100 | 57.1 | 57.1 | 55.6 | 66.7 | 50 | 100 | 100 | 0 |
| V10 | 60 | 71.4 | 40 | 80 | — | 100 | 100 | 50 | — |
| V11 | 100 | 57.1 | 42.9 | 55.6 | 50 | 100 | 75 | 100 | 16.7 |

Trend: 73.2 → 73.0 → 72.5 → 62.5 → 58.7 → 65.1 → 65.6 → 80.8 → 63.2 → 67.9 → 58.7. First versus last: −14.5. Average of all milestones 67.4; of independent designs 67.3 (excludes V10, which is V08's design with v0.3 content) (source: SUMMARY.json, `chronological_trend`, `delta.first_vs_last`, `average_score_all_milestones`, `average_score_independent_designs`, `average_note`).

**The honest reading: the newest version is not the highest.** V11, the product-experience preview at the freeze base commit, scores 58.7 — tied with V05 for the lowest in the benchmark, 22.1 points below V08, 9.2 below V10, 14.5 below V01 (source: case-study/design-benchmark/EVOLUTION.md §4). The curve is not monotonic, and no reading of the record makes it so.

**Why the N/A counts differ, and why that matters.** Surfaces are mapped semantically per milestone (ENTRY, DISCOVERY, DETAIL, INTERACTION, MOBILE ENTRY); an item whose capability is absent on every surface is N/A and leaves the denominator (source: METHODOLOGY.md §1, §3). V08 is one page with no navigation, no actions, no forms, no icons and no declared animation: 27 N/A, 26 items scored, 5 FAIL. V10 is the same page with v0.3 content: 25 N/A, 28 scored, 9 FAIL. V11 is eight routes with a seven-item nav, in-text links, a form, tooltips and an index of about 21 resources: 6 N/A, 46 scored, 19 FAIL (source: EVOLUTION.md §4.2). V07 renders as a fixed-viewport canvas with no discovery/detail structure: 21 N/A (source: DESIGN-MILESTONES.json, V07; SUMMARY.json). Twelve of V11's 19 failures are on items that were N/A for V08 — the price of having the capability at all, scored by a ruler that does not grade on a curve. Restricting V11 to the 26 items V08 scored gives 19/7 = 73.1, still below V08's 80.8, because of headings, zoom and colour-only state; removing the six items measured on the Lab's deliberately defective specimen gives 27/40 = 67.5, still below V01, V02, V03, V08 and V10 (source: EVOLUTION.md §4.2–§4.3). The most favourable reading available does not put V11 above the single page it replaces. Across the benchmark, adding a capability produced a FAIL more often than a PASS (source: EVOLUTION.md §3.5).

**Deltas that mean what they say and deltas that do not** (source: SUMMARY.json, `delta`; decomposition from EVOLUTION.md §2–§3):

- Biggest improvement, V07 → V08, +15.2. Of the 11 failures SUMMARY lists as removed, 5 vanished because the capability vanished (FAIL → N/A: icons, motion, tap targets, nav consistency, mobile nav); 5 were fixed, three of them source-review items about documentation the Processo repository did not carry.
- Biggest regression, V08 → V09, −17.6. V09's ENTRY is byte-identical to V08's (0 bits apart); the drop is the cost of adding studio-dev-ui's gallery and playground surfaces around it. 6 of the 10 new failures are N/A → FAIL.
- The clean same-repository pair, V03 → V04, −10.0 in eleven days with zero fixes: a heading skip, `tabindex=-1`, 175 px overflow at zoom 2, a 30-px hamburger.
- The clean same-design pair, V08 → V10, 80.8 → 67.9: the deterministic side is identical (4 FAIL in both); the entire drop is on the judgment and source-review side, part of it content-driven (v0.3 added an Install section that now needs a CTA and social proof) and part of it rater noise.

**Rater noise, recorded.** Two same-design fundamentos verdicts flipped between V08 and V10 (jtbd, restricoes); the identical V08/V09 page was judged N/A by one judge and FAIL by another on hierarquia/cta-3s. On a 26–28-item denominator each judgment flip is worth 3.6–3.8 points, so differences under about ten points, and any fundamentos delta, should be read at the item level before being read as a design difference (source: EVOLUTION.md §5).

**Blinding.** Judgment material was anonymised as DESIGN-A … DESIGN-K with seed `bf990210267e2911`; the label → milestone mapping was revealed only after every judgment file was frozen and hashed (source: case-study/design-benchmark/RANDOMIZATION.json, `seed`, `judgment_frozen`, `revealed_at`). Judges were model agents, one per anonymised design, each in a fresh context, given only the rubric text, the item classification and the image folder (source: METHODOLOGY.md §5). The four fundamentos items that need repository documentation were scored unblinded by reading the worktree (same source).

## 10 — Learning Yield

The score says how each milestone performed against the ruler. Learning Yield asks the second question: how much of what the ruler found became reusable (source: case-study/design-benchmark/reports/LEARNING-YIELD.md, opening).

**Headline** (source: case-study/design-benchmark/reports/learning-yield.json, `totals`, `states`):

| | Count |
| --- | ---: |
| Findings (every FAIL with evidence) | 139 |
| Rejected — measurement artefact, kept with reason | 15 |
| Duplicate of a known learning | 99 |
| Local-only | 9 |
| Meaningful (not rejected, not duplicate) | 25 |
| Durable learnings (findings) / distinct learnings | 16 / 14 |
| Resource candidates (rule 6, component 3, pattern 2, eval 3, skill 0, agent 0, tool 0) | 14 |
| Resources promoted (registry or ledger encodes the finding) | **0** |
| Resources later reused (verified transfer-graph edge) | **0** |

**Per tool** (source: learning-yield.json, `per_tool`):

| Tool | Milestones | Findings | Meaningful | Durable | Candidates | Promoted | Reused | Rejected | Duplicates | Local-only |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| tool-09 · Compound Labs Design | V01 | 11 | 7 | 5 | 4 | 0 | 0 | 4 | 0 | 2 |
| tool-18 · Studio DS | V02 | 10 | 3 | 2 | 2 | 0 | 0 | 0 | 7 | 1 |
| tool-12 · Canvas UI fork → Studio Dev UI | V03, V04, V09 | 35 | 5 | 4 | 4 | 0 | 0 | 0 | 30 | 1 |
| tool-20 · Supernova UI + Catálogo | V05 | 19 | 4 | 3 | 3 | 0 | 0 | 2 | 13 | 1 |
| tool-21 · Geist Labs DS | V06 | 15 | 1 | 1 | 1 | 0 | 0 | 0 | 14 | 0 |
| tool-23 · Processo | V07 | 11 | 3 | 0 | 0 | 0 | 0 | 0 | 8 | 3 |
| tool-24 · Compound Metrics / Compound Design | V08, V09, V10, V11 | 38 | 2 | 1 | 0 | 0 | 0 | 9 | 27 | 1 |
| **all** | V01–V11 | 139 | 25 | 16 | 14 | 0 | 0 | 15 | 99 | 9 |

Attribution is by chronological first occurrence, so the earliest tool owns most learnings; Processo's zero durable learnings from eleven findings is a correct result, not a gap (source: LEARNING-YIELD.md, "Per tool").

**Durable learnings**, all fourteen, none promoted (source: learning-yield.json, `durable_learnings_list`; recurrence counts from `known_but_never_encoded`):

| Id | Becomes | Recurrences | Learning |
| --- | --- | ---: | --- |
| DL-01 | none — decision pending, tokens vs ruler | 9 | The 4-px spacing base demanded by the author's own checklist is never met by the author's own stacks; either the tokens declare a 4-px base or the checklist admits a declared half-step. |
| DL-02 | rule | 9 | Site-shell targets ship below 44 px at 390 wide unless a rule forces the size. |
| DL-03 | component | 4 | The current route must be marked (`aria-current="page"` + visible style) by the shared nav component. |
| DL-04 | pattern | 5 | One site shell rendered from the root layout keeps the primary nav identical on every route. |
| DL-05 | rule | 5 | Every input needs a visible, associated label; placeholder or aria-label alone passes axe but fails users. |
| DL-06 | eval | 9 | Landmark and heading structure must be a failing check, not a noted moderate axe result. |
| DL-07 | pattern | 2 | A catalogue surface above roughly 15 destinations needs a filter or search on the index itself. |
| DL-08 | rule | 9 | Typography must be tokens declared once (≤ 2 families, ≤ 4 weights, ≤ 10 sizes). |
| DL-09 | component | 2 | Routes at path depth ≥ 3 need a parent link or breadcrumb from a shared component. |
| DL-10 | eval | 4 | Text inputs below 16 px at 390 wide are a deterministic check, not a review item. |
| DL-11 | component | 2 | A form field is one component carrying label, required/optional marker, inline error slot and ≥ 16 px input. |
| DL-12 | rule | 0 | A submit button is never disabled without a visible reason; submitting/success/failure states are visible. Taught as Lab lesson IR-04 — site content, not a resource. |
| DL-13 | rule | 2 | Icons come from one family; typographic glyphs are not icons beside drawn ones. |
| DL-14 | none — content decision | 2 | The product landing page's first screen carries one identifiable primary action. |

**Rejected findings are preserved**, fifteen of them, each with its reason: the Arial family on V01 is the sandbox's font fallback; the sub-16-px inputs on V01 and V05 are checkboxes under a text-input rule; the 999-px pill on V08/V09/V10 was counted as a radius because the rule's exclusion says 9999; the three `tabindex=-1` on V11 are a roving-tabindex tablist; four V11 form and colour failures are the Lab's declared seeded defects IR-01/IR-02/IR-04; and social proof beside an install box on a zero-user experiment (V01, V05, V10) would have to be fabricated, which the claim discipline forbids (source: learning-yield.json, `rejected_list`). Nine findings are local-only — a fix for one screen (source: `local_only_list`).

**The two zeros, read plainly.** The 139 findings were produced on 2026-09-09, after the fact, by the frozen ruler; none has been promoted into a registry resource or a ledger entry, and no verified edge in the transfer graph starts from one of them. Twenty-three of the 99 duplicates are duplicates because an active resource already encodes the rule — mostly `cd-interface-review` — which is knowledge the framework holds, not evidence that the knowledge changed any audited tool; in V10 the tool that holds it failed the same fundamentos items on its own site (source: LEARNING-YIELD.md, "Headline"). The only verified finding → learning → rule → reuse chain starts from a site-check failure, not from the rubric, and its reuse is inside the same tool and commit (source: learning-yield.json, `transfer_graph_check`).

## 11 — Material evidence

Every artifact the case rests on, with where it is (all paths verified in the working tree at the time of writing unless stated).

| Kind | Item | Where |
| --- | --- | --- |
| URLs | `https://compoundmetrics.vercel.app/`, `https://cdguide-seven.vercel.app/` (same commit, second project), `https://studio-dev-ui.vercel.app/` and `https://studio-dev-nejva0nnb-danilos-projects-94eff717.vercel.app/` (same deployment), `https://compoundmetrics-git-claude-com-014611-…vercel.app/` (preview), `https://compound-labs-design.vercel.app/audit` | case-study/FREEZE.md, "Current sites at freeze time" |
| Deployment ids | `dpl_6Av1MuU5xvbQAnS6uBkWVvKcUoA9` (compoundmetrics prod, `a7f8319`), `dpl_rJaafo9dBEAnsqyFvLQtKBFTHxHP` (cd.guide, `a7f8319`), `dpl_9DGd7MszCu9hF3ykiBspfM6DkyGW` (studio-dev-ui, `231889f`), `dpl_4qtC9oEDZ44USUgxByVBXB7Xf399` (preview, `921d751`), `dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ` (compound-labs-design, `364430b`, 2026-07-16) | case-study/FREEZE.md; case-study/history/DESIGN-MILESTONES.json, `equivalent_deployments` |
| SHAs | freeze base `921d751aff5df8e14d998f993e2d171db842719d`; `main` `a7f8319859263924a90d2f293be5cfd3c1c9cbab`; per-milestone `source_sha` for V01–V11; first/last known SHA for the 8 verified tools | case-study/FREEZE.md; case-study/history/DESIGN-MILESTONES.json; case-study/history/TOOLS-MANIFEST.json |
| Builds | eleven exact-commit builds M01, M03, M04, M06, M07, M08, M09, M10, M11, M12, M13 (+ build, capture and audit logs) | `.research/builds/`; case-study/scripts/build-milestones.sh, rebuild-m04-m11.sh |
| Screenshots | 262 PNGs across `archive/V01…V11` (V01 30, V02 26, V03 29, V04 30, V05 28, V06 29, V07 19, V08 7, V09 26, V10 7, V11 31): full pages, first screens, focus/hover/mobile-nav states, at 1440×900 and 390×844; 240 anonymised PNGs under `screens/blind/DESIGN-A…K` for the judges | case-study/archive/<V>/; case-study/design-benchmark/screens/blind/ |
| Hashes | sha256 and byte size of every archived file in `archive/<V>/metadata.json` → `files`; visual fingerprints (ahash, DOM, CSS, typography, colour) per milestone; rubric sha256 `7c7c6915…78a279` and `audit.html` sha256 `11034e8b…3947e2a`; sha256 of each frozen judgment file before reveal | case-study/archive/<V>/metadata.json; case-study/history/DESIGN-MILESTONES.json, `visual_fingerprint`; case-study/design-benchmark/rubric/RUBRIC-MANIFEST.json; case-study/design-benchmark/RANDOMIZATION.json, `judgment_frozen.sha256` |
| Evidence manifest | every artifact with provenance and SHA-256 in `case-study/EVIDENCE-MANIFEST.json`, emitted by the builder script (regenerated after the film renders) | case-study/scripts/build-evidence-manifest.mjs |
| Frozen ruler | `audit.html.frozen`, `compound-design-audit.json` (54 items), `ITEM-CLASSIFICATION.json` (23 deterministic / 31 judgment), `RUBRIC-MANIFEST.json` | case-study/design-benchmark/rubric/ |
| Results | per milestone: `deterministic.json`, `judgment.json`, `site.json`, `source-craft.json`, `source-review.json`; blind judgments DESIGN-A…K | case-study/design-benchmark/results/<V>/; results/blind/ |
| Aggregates and reports | SUMMARY.json, DESIGN-EVOLUTION.csv, EVOLUTION.md, METHODOLOGY.md, RANDOMIZATION.json (+ mapping), reports/FINDINGS.json (139), reports/learning-yield.json + LEARNING-YIELD.md | case-study/design-benchmark/ |
| Registries | `resource-registry.json` (24 entries, 21 active) against `resource.schema.json`; `RESOURCE-MANIFEST.json` proving legacy byte-equivalence to `5fc74f1`; studio-ds `registry.json` + catalog (tool-18) | compound-design/registry/; compound-design/quality/e2/legacy-resources/; TOOLS-MANIFEST.json tool-18 |
| Tests | `v0.3-contract-eval.json` (26 checked, 4 groups passed, E1); `v0.3-selftest.json` (40/40); `v0.2-contract-eval.json` (frozen, not re-executed); e2 self-test 32/32 and `self-test-report.json`; CI `work-system` job (lint, registry, evals, plugin, claims, selftest), site job (typecheck, lint, build, static site checks), e2 job (verify-legacy, self-test, validate, fixtures, workspaces, freeze, dry-run) | compound-design/quality/releases/; compound-design/quality/e2/; .github/workflows/ci.yml |
| Ledgers | learning ledger, 13 entries `CD-20260909-001` … `-013`; one solution document `2026-09-09-axe-contrast-during-entrance-animation.md`; transfer graph (105 edges) | compound-design/learning/LEDGER.md; docs/solutions/; case-study/knowledge/TRANSFER-GRAPH.json |
| Release records | v0.2.1 evidence infrastructure and validation notes; v0.3.0-alpha.1 work-system note; migration note; E2 pilot plan (pre-registered, not executed) | compound-design/releases/; compound-design/quality/e2/E2-PILOT-PLAN.md |
| Provenance | `NOTICE`, `compound-design/SOURCES.md`, `EVERY-ARCHITECTURE-SNAPSHOT.md`, `PRODUCT-EXPERIENCE-REFERENCES.md`, theory + provenance note, Context7 substitute record (Playwright 1.63.0, axe-core 4.13.0, Remotion 4.0.523 verified against installed `.d.ts` and `remotion-dev/skills@9ae8048a`) | repository root; compound-design/research/; case-study/theory/; case-study/research/CONTEXT7-SOURCES.md |

Two of the six URLs the brief named are duplicates — same deployment, or same commit in a second project — and count once (source: case-study/FREEZE.md). Deployment ids before 2026-09 were not retained by the API listing for most projects, so V02–V08 are anchored to commits, not deployments (source: case-study/history/CHRONOLOGY.md, "Uncertainties").

## 12 — What we know

Interfaces were measured against a frozen ruler. We found differences between versions. We observed resource transfers. We found learnings that were reused. The system has deterministic contracts. The thesis is being tested in use.

Those six sentences are the permitted claims (source: case-study/theory/PROVENANCE-NOTE.md §4, from PRD §38). Each mapped to what supports it:

| Permitted claim | Evidence | Source |
| --- | --- | --- |
| Interfaces were measured against a frozen ruler | 11 milestones × 54 items, ruler hashed at 15:32:10Z before any capture; 23 deterministic items scored by script, 31 judgment items scored blind with the mapping revealed after the verdicts were hashed | case-study/design-benchmark/rubric/RUBRIC-MANIFEST.json; METHODOLOGY.md §2; RANDOMIZATION.json |
| We found differences between versions | scores 58.7–80.8; V03→V04 −10.0 with zero fixes; V07→V08 +15.2; V08→V09 −17.6; V10→V11 −9.2; ten items failing in five or more milestones | SUMMARY.json `delta`, `chronological_trend`; EVOLUTION.md §2–§4 |
| We observed resource transfers | 97 verified edges; byte-identical ledger, agents and page across three repositories; three supersessions with E0→E1 re-earned; eight fully verified end-to-end chains | case-study/knowledge/TRANSFER-GRAPH.json; MIGRATION-v0.2-to-v0.3.md |
| We found learnings that were reused | `CD-20260909-013` → solution document → rule → `scripts/site-check.mjs` → discoverable by contract (same tool, same commit); ledger 011/012 reused as PRIOR LEARNING in a later frame and plan | TRANSFER-GRAPH.md, chains 1 and 7 |
| The system has deterministic contracts | 26 resources pass the v0.3 contract suite; 40/40 self-tests; 32/32 e2 self-tests; 9/9 lint mutations rejected; zero model, zero network | compound-design/quality/releases/v0.3-contract-eval.json, v0.3-selftest.json; v0.3.0-alpha.1-WORK-SYSTEM.md |
| The thesis is being tested in use | v0.3.0-alpha.1 is a candidate in use; the E2 pilot and the candidate lane are pre-registered with falsifiable decision rules, and "Compound loses" is an accepted outcome | compound-design/quality/e2/E2-PILOT-PLAN.md §2; v0.3.0-alpha.1-WORK-SYSTEM.md, "Known unknowns" |

Also known, and less comfortable: the audit fails 11 of 41 scored items on its own ruler (§06); the newest design scores lowest on that ruler under every reading tried (§09); of 139 findings, 0 have been promoted and 0 reused (§10); and one learning failed to transfer inside the same repository within a day (E45, §05). Those are findings too.

## 13 — What we do not know

Never say, in this case or anything derived from it (source: case-study/theory/PROVENANCE-NOTE.md §4, from PRD §38):

1. Compound Design has proven to increase productivity.
2. Compound Design has proven to produce better design universally.
3. The benchmark is a universal objective measure.
4. Atomic AI Design is an externally recognised methodology.
5. Every endorsed the project.
6. Brad Frost endorsed the project.
7. CEL E1 proves runtime effectiveness.
8. A design score proves business impact.

None of those is supported, and several are directly contradicted by the record above. The known unknowns, each with its source:

- **Runtime.** E2 was never executed; runtime uplift was never measured; whether any v0.3 resource improves an outcome over no resource, over direct upstream use, or over the v0.2 resource it replaced is unknown (source: case-study/FREEZE.md; compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Known unknowns"). A design score against a frozen rubric is not runtime evidence and never becomes CEL (source: FREEZE.md).
- **The API cap.** The Vercel project list returns at most 50 projects; projects beyond the cap are unknown, so 24 candidates is a floor, not a count (source: case-study/history/TOOLS-MANIFEST.json, `sources`; CHRONOLOGY.md, "Uncertainties" 1).
- **Deployment ids.** Not retained by the API for most projects before 2026-09; V02–V08 are anchored to commits. V03 (`781d086`) may never have been deployed to the studio-dev-ui project, which was created nine days later; it is a source milestone (source: CHRONOLOGY.md, "Uncertainties" 2–3; DESIGN-MILESTONES.json, V03).
- **Client and unreadable repositories.** 16 of 24 candidates have no readable repository; client work is additionally marked `privacy: review-required`. Their design was not captured and nothing can be said about what they taught (source: TOOLS-MANIFEST.json; DESIGN-MILESTONES.json, `excluded`). `DaniloAmaralUX/skills`, the stated upstream of the `/audit` items, is also unreadable (E10).
- **Single rater, model judges.** The judgment pass is single-rater per design. The judges are model agents, one per anonymised design, in fresh contexts; this reduces order, recency and authorship bias and is not an independent human evaluation. Anonymisation cannot remove brand text visible in screenshots. Model runtime was spent on these judges under the author's explicit authorisation for the production run; none of it is E2 (source: METHODOLOGY.md §5, §7). FREEZE.md and EVOLUTION.md §5 were aligned to this description after the fact (the earlier wording described the rater as the building session).
- **Rater noise measured.** Three same-design disagreements are in the data; each judgment flip is worth 3.6–3.8 points on the tool-24 denominators (source: EVOLUTION.md §5).
- **Fonts and external hosts blocked.** The sandbox cannot reach `*.vercel.app`, Google Fonts, Unsplash or Context7. V01's third font family is the Arial fallback; external images fail on V03/V04/V09 detail pages; every capture is a locally built exact commit, not the live URL (source: FREEZE.md, "Environment constraints"; METHODOLOGY.md §7; case-study/research/CONTEXT7-SOURCES.md §1).
- **Build adjustments.** V04 and V11 were built with `typescript.ignoreBuildErrors` because an unrelated `video/` package failed type-checking; no UI source was changed (source: METHODOLOGY.md §7).
- **Rule heuristics.** The deterministic rules are heuristics with declared thresholds. One missed a defect the page itself declares (IR-03, the suppressed focus ring, not sampled); one fired on a correct roving-tabindex pattern; one counted a 999-px pill as a radius; two counted checkboxes under text-input rules (source: EVOLUTION.md §4.3; learning-yield.json, `rejected_list`).
- **Capture gaps.** V11's navegacao/mobile-nav and carga/prevencao are NOT_VERIFIED because the capture script recorded a tooltip instead of the open menu and no typing state — script defects, not design verdicts (source: EVOLUTION.md §7.2).
- **Unreconciled counts.** 17 (author) versus 24 (metadata) versus 8 (verified) are not reconciled and will not be by this document (source: TOOLS-MANIFEST.json, `reconciliation`).
- **The loop's yield so far.** 0 of 139 rubric findings promoted; 0 reused; the one verified end-to-end chain reuses its rule in the same commit and tool, and the only later work with the same behaviour cites nothing (source: learning-yield.json, `transfer_graph_check`; TRANSFER-GRAPH.json, E55).
- **Whether the lens is useful.** The theory document's own weakest claim: falsified if the same record is explained equally well without the six layers. One case (E45) so far (source: case-study/theory/ATOMIC-AI-DESIGN.md §5).
- **Whether fifteen skills, six agents and twenty-one active resources are the right number.** "Nothing here is evidence that it is." (source: v0.3.0-alpha.1-WORK-SYSTEM.md, "Known unknowns").

## 14 — The system now evaluates itself

I thought I was building products with AI. I was actually building a way to build.

The record, without the adjectives: I built 17 tools with AI. Those tools started teaching one another — 97 verified edges, 8 refused for lack of a source. Failures became rules — 13 ledger entries, one of them a rule that reached code and can be found again by the strings that will recur. Rules became resources — 15 skills, 6 agents, two contracts, a registry that is executed rather than assumed. Resources became skills, agents, evals and systems — 26 resources under deterministic contract at E1, and nothing above E1. The system began evaluating its own output — the audit a tool shipped in July was frozen, hashed and turned on all eleven milestones including the tool that shipped it and the site that carries the system now; it found 139 things, and it found that the newest design scores lowest and that none of the 139 has yet become a resource. And the next product no longer started from zero — the framework was extracted byte-identical from one repository into another, superseded its own agents, and re-earned their evidence level rather than inheriting it.

Build the application. Improve the system that builds the next one. That is what the repository does mechanically: capture writes addressable learning and Frame and Model retrieve it, proved without a model; whether it improves a decision is not measured (source: compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, "Adversarial review", "Does Compound actually close the loop?").

Products generate knowledge. Knowledge becomes capability. Capability improves the next product. The first two clauses have cited instances in this record, contract-tested at E1 and no further. The third is a hypothesis with a pre-registered test and no result (source: case-study/theory/ATOMIC-AI-DESIGN.md §5–§6).

And this is the hypothesis of Atomic AI Design: the atomic unit of an AI-native design system is not only interface. It can also be knowledge.

The case can grow. The claim cannot grow without evidence (source: case-study/FREEZE.md; case-study/theory/PROVENANCE-NOTE.md §5).
