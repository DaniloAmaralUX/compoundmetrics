# Resource Transfer Graph — human summary

Generated 2026-09-09 from `TRANSFER-GRAPH.json` (PRD §18). Read-only research: file contents, commit messages and md5 comparisons at named commits. No transfer was inferred from plausibility; every edge in the JSON carries a file path + line, a commit, or a quote, or is marked `verified: false` with the reason.

## Counts

| | |
| --- | --- |
| Nodes | 80 (8 tools, 5 externals, 67 resources of type skill / agent / contract / rule / pattern / component / eval / registry / resource) |
| Edges | 105 |
| Verified | 97 |
| Unverified (recorded with reason) | 8 — E09, E10, E55, E62, E87, E88, E89, E90 |
| End-to-end chains | 9 — 8 fully verified, 1 partial |
| `none_verified` entries | 13 |

Edge types used: informed 29, reused 22, created 21, promoted 12, migrated 8, failure 5, superseded 5, eval-created 3. Node types: resource 30, skill 14, tool 8, eval 8, agent 7, external 5, component 3, registry 2, contract 2, rule 1.

Line-number citations into `scripts/site-check.mjs` (189, 208) were confirmed against the committed file at 921d751, not only the working tree (which other in-progress work has modified).

## What the sources actually support

**The transfers that hold, with the evidence type in brackets.**

1. **compound-labs-design → the benchmark's instruments.** The `/audit` page (edbfdd1, 54 items / 9 categories counted from `audit.html`) is the frozen rubric, instrument A (`RUBRIC-MANIFEST.json` names 364430b and hashes the page). The plugin's `cl-audit` playbook (8 categories, present since d08ec62) is instrument B (`audit-source.mjs` line 1). [file content + commits]
2. **supernova-catalogo@compound-design-framework → compoundmetrics.** `LEDGER.md` and the three v0.2 agents (`jakub`, `emi`, `cd`) are byte-identical (md5) at supernova 7af6553, compoundmetrics 18ffcf2 and the pinned `legacy-resources/v0.2/`. NOTICE names the source branch. [md5 + NOTICE]
3. **studio-dev-ui → compoundmetrics.** `src/app/compound-design/page.tsx` and `page.module.css` at 231889f are byte-identical to `src/app/page.tsx` / `page.module.css` at 18ffcf2. The v0.2 framework was presented on that page from the `compound-design-poc` branch (`V0.2-DEPLOYMENT.md`). [md5 + release record]
4. **Jakub Krehel / Emil Kowalski → v0.2 wrappers → v0.3 rewrites.** Vendored as submodules in supernova 8642462; wrapped by `jakub.md` / `emi.md` (line 9 of each); superseded by `cd-interface-review` / `cd-motion-review` (registry `supersedes` / `supersededBy`, MIGRATION lines 9–11); the rewrites cite the heuristics they kept (SOURCES.md lines 58–59, SKILL.md provenance sections); promoted E0 → E1 in c61b896 on `v0.3-contract-eval.json`. [registry + SOURCES + commits]
5. **Every Compound Engineering → v0.3 architecture.** `EVERY-ARCHITECTURE-SNAPSHOT.md` records the pinned commit and eight ADOPT decisions; the registry marks ten resources `upstream-informed` by Every; `cd-compound` carries the durable-learning bar verbatim in spirit (one learning per run, effort does not establish durability). [research doc + registry]
6. **Evil Rabbit Lifeline → three sibling adopters.** `processo` (6692884: boilerplate copied, MIT licence included), `geistlabsds` (28e765d: boilerplate copied, licence included), and compoundmetrics `Timeline.tsx` (interaction model adapted, nothing copied — `PRODUCT-EXPERIENCE-REFERENCES.md`, NOTICE, component docblock). The supernova framework branch also pinned Lifeline as a submodule (3835232). [commits + attribution files]
7. **Learning loops inside compoundmetrics.** Seven E2-pack failures (ledger 001–007); registry schema never executed (008) → validator wired into CI; claim-guard (011) → recurred in the CI guard (012, a recorded *non*-transfer) → both reused as PRIOR LEARNING in the product-experience frame → plan. [LEDGER + frames + plans]

## End-to-end chains (finding → learning → resource → reuse)

| Chain | Status | Note |
| --- | --- | --- |
| site-check axe defect → `CD-20260909-013` → `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md` → "measure the page at rest" rule → `scripts/site-check.mjs` lines 189 / 208 → discoverable via `DISCOVERABILITY-CONTRACT.md` | **fully verified** | Rule and reuse land in the same commit (921d751) in the same tool. The case-study scripts show the same behaviour (2000 ms wait before axe, `ERR_ABORTED` ignored) but cite nothing, so reuse in a *later* tool is recorded unverified (E55). |
| `/audit` checklist → frozen rubric A; `cl-audit` → instrument B | **fully verified** as two branches | The chronology's single chain "/audit → cl-audit → rubric" is not supported: `cl-audit` predates `/audit` by three days, uses 8 categories against 9, and neither references the other (E09 unverified). |
| Lifeline → compoundmetrics Timeline (direct) | **fully verified** | |
| Lifeline → processo → compoundmetrics Timeline (chronology line 43) | **partial** | Lifeline → processo verified; processo → compoundmetrics not shown by any file — nothing outside `case-study/` names processo, and the attribution goes straight to `evilrabbit/lifeline@8ddbb3d` (E62). |
| Jakub/Emil → v0.2 wrappers → migrated → superseded → promoted → pinned for E2 | **fully verified** | |
| Registry schema violation → ledger 008 → validator in CI | **fully verified** | |
| Ledger 011/012 → frame → plan | **fully verified** | Contains a recorded failure-to-transfer (E45). |
| supernova framework branch → compoundmetrics; studio-dev-ui page → compoundmetrics `/` | **fully verified** | The chronology says the migrate commits name the source branch; their bodies are empty — NOTICE does. |
| Every → architecture snapshot → `cd-compound` | **fully verified** | |

## What is implied but not proven (`none_verified`)

- Any v0-era tool (tool-01 … tool-08) or client project (tool-10, 11, 14–17, 19, 22) teaching a rule that a later tool reused — no repository readable, no reference anywhere.
- design-engineering-guide (tool-13) and studio-ds (tool-18) informing anything later — never referenced by a later repository.
- processo as the Lifeline intermediary; `/audit` producing `cl-audit`; compound-labs-design skills feeding the compoundmetrics legacy agents (both descend from `jakubkrehel/skills` independently).
- The `/audit` items' own source, the `compound-design-audit` skill in `DaniloAmaralUX/skills` — named by `build-audit.mjs`, but the repository is not readable here (`.research/history/skills` is `remotion-dev/skills`).
- studio-dev-ui's `docs/solutions` (2026-08-13) as origin of the compoundmetrics `docs/solutions` pattern — no attribution; the documented lineage is Every's `<root>/solutions/`.
- Supernova material inside geistlabsds (commit subjects only); Brad Frost / Atomic Design (the term appears in supernova-catalogo, the author nowhere).
- Canvas UI / React Bits code teaching anything to Compound Design — explicitly not carried over (18ffcf2).

## Corrections to the chronology this graph records

- Line 40: `/audit → cl-audit` direction unsupported (two separate instruments).
- Line 41: the `migrate` commits do not name the source branch; NOTICE does. The transfer is nonetheless proven by byte-identical files.
- Line 43: processo is not shown to be on the path to the compoundmetrics timeline.
- Line 44: the hop `compound-labs-design skills → compoundmetrics legacy resources` has no source.
