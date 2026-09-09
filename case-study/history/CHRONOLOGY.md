# Chronology report — 17 tools → one living system

Generated 2026-09-09 from `TOOLS-MANIFEST.json` (24 tool candidates, 8 verified against a readable repository) and `DESIGN-MILESTONES.json` (11 design milestones). Every date below is a git author date (UTC) or a Vercel project/deployment creation date. Nothing is inferred from memory.

## What the brief says vs what the metadata supports

| | Count | Basis |
| --- | --- | --- |
| Tools named in the brief | 17 | author's statement |
| Tool candidates found | 24 | Vercel project list (capped at 50 by the API) + git history + page content |
| Verified by a readable repository | 8 | `compound-labs-design`, `studio-dev-ui`, `design-engineering-guide`, `studio-ds`, `supernova-catalogo`, `geistlabsds`, `processo`, `compoundmetrics` |
| Inferred from Vercel names and dates only | 16 | marked medium / low confidence; client work marked `privacy: review-required` |
| Captured as design milestones | 7 tools → 11 milestones | see below |

The two counts are **not reconciled**. Nothing was removed to reach 17 and nothing was added to reach 24. The author decides which candidates count; the manifest keeps all of them with their confidence.

## Timeline (verified dates only)

| Date (UTC) | Event | Evidence |
| --- | --- | --- |
| 2025-11 → 2025-12 | v0-generated tools (Labs, dashboards, storefront, form builder, Laudo, AuditContábil…) appear as Vercel projects | Vercel project creation dates; no repository readable; **NOT CAPTURED** |
| 2026-02 → 2026-06 | client and internal projects (Agno handoff, SESI ×10, ouvidoria, NIM, tramontina, Studio Workspace…) | Vercel project creation dates; **NOT CAPTURED**, privacy review required |
| **2026-07-13** | `compound-labs-design` first commit `d08ec62` — the first artifact named *Compound*: Design Engineering skills (UI / Type / Color) + plugin | git |
| 2026-07-16 | `compound-labs-design` `364430b` (v3.6.0): `/audit` with **54** checks in 9 categories; production `dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ` — **V01**, and the audit instrument frozen for this benchmark | git + Vercel |
| 2026-07-16 | `studio-dev-ui` first commit `775f281` as a fork of DavidHDev/canvas-ui | git (fork state excluded from the benchmark) |
| 2026-07-20 | `design-engineering-guide` (knowledge base, no UI) | git |
| **2026-08-05** | `studio-ds` v1 in one day (8 commits, `54fcaf0`): landing, themes gallery with live apply, components, anti-drift test suite — **V02** | git + Vercel project |
| **2026-08-13** | `studio-dev-ui` `781d086` "the sea, actually moving": authorial rebuild of the fork — **V03** | git |
| 2026-08-22 → 08-24 | `studio-dev-ui` registry, gallery honesty gate, playground URL engine; `main` `d0e8931` — **V04**; Vercel projects `canvas-ui-v1`, `studio-dev-ui`, `studio-dev-ui-originals` created | git + Vercel |
| **2026-09-05 → 09-07** | `supernova-ui` (tokens) and `supernova-catalogo` `bcb35b3 → 7af6553` — **V05**; the `compound-design-framework` branch of the catalogue repo carries the framework v0.1 → v0.2.1 | git + Vercel |
| 2026-09-07 → 09-08 | `geistlabsds` (lab-design, lab-design-timeline) — **V06**; `processo` (Lifeline-style timeline, MIT-adapted) — **V07** | git + Vercel |
| **2026-09-09** 09:14 | `studio-dev-ui` `231889f` production `dpl_9DGd7MszCu9hF3ykiBspfM6DkyGW` — hosts the Compound Design v0.2 POC page — **V09** (two URLs, one deployment) | Vercel |
| 2026-09-09 | `compoundmetrics` initialised (`50c7a6a`), v0.2.1 migrated (`18ffcf2`) — **V08** | git |
| 2026-09-09 12:18 | `compoundmetrics` `main` = `a7f8319`, v0.3.0-alpha.1 Work System production `dpl_6Av1MuU5xvbQAnS6uBkWVvKcUoA9`; second project `cd.guide` `dpl_rJaafo9dBEAnsqyFvLQtKBFTHxHP` same commit — **V10** (two URLs, one commit) | Vercel |
| 2026-09-09 13:33 | product-experience preview `921d751` `dpl_4qtC9oEDZ44USUgxByVBXB7Xf399` — **V11** | Vercel |
| 2026-09-09 | this case study branch (`claude/compound-design-case-study`) starts from `921d751` | git |

## Relationships that the sources support

Verified edge by edge in `knowledge/TRANSFER-GRAPH.json` (97 of 105 edges carry file-level evidence; 8 are marked unverified with the reason). Four relationships first written here from commit subjects were corrected after that pass:

- `compound-labs-design` (V01) → the `/audit` checklist (54 items, 9 categories, commit `edbfdd1`) → the rubric frozen here (instrument A). **Verified.** The `cl-audit` playbook is a *sibling* instrument (8 categories) that predates `/audit` and does not reference it — the earlier "`/audit → cl-audit`" hop is **not supported**.
- `supernova-catalogo@compound-design-framework` → `compoundmetrics` (v0.2.1 standalone extraction). **Verified by md5-identical files** (LEDGER, three agents) and by `NOTICE`, which names the source branch; the `migrate` commit bodies themselves are empty.
- `studio-dev-ui` `/compound-design` page → `compoundmetrics` `/` (v0.2.1). **Verified**: `page.tsx` and `page.module.css` are md5-identical at `231889f` and `18ffcf2`; the studio-dev-ui root serves the same page (V09 ENTRY = V08 ENTRY).
- Evil Rabbit Lifeline (MIT) → `compoundmetrics` Timeline component. **Verified** by `NOTICE`/`SOURCES.md` attribution to `evilrabbit/lifeline@8ddbb3d`. Lifeline is a four-way upstream: also `processo` (boilerplate copy), `geistlabsds` `28e765d`, and studio-dev-ui `05ee94f` "lifeline-inspired". `processo` is **not** on the path to compoundmetrics (nothing in compoundmetrics names it).
- Interface / Motion heuristics (Jakub Krehel, Emil Kowalski, MIT) → v0.2 wrappers → migrated byte-identical → superseded by v0.3 rewrites → promoted E0→E1 (`c61b896`) → pinned for E2. **Verified.** The `compound-labs-design` skills and the compoundmetrics legacy agents descend from `jakubkrehel/skills` *independently* — no source shows one feeding the other.
- Every Compound Engineering → `EVERY-ARCHITECTURE-SNAPSHOT` → `cd-compound`. **Verified** (attributed inspiration, MIT).
- One end-to-end learning chain inside this repository: axe contrast defect during entrance animation → ledger `CD-20260909-013` → `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md` → "page at rest" rule → `scripts/site-check.mjs`. **Verified**, with the caveat that rule and reuse land in the same commit and tool.

Everything else (for example that a v0-era dashboard taught a rule that a later tool reused; Brad Frost's Atomic Design as a named source — the term appears once, unattributed, in supernova-catalogo) is **not verified** and is listed under `none_verified` in the graph.

## Uncertainties, explicitly

1. The Vercel project list is capped at 50 results; projects beyond the cap are unknown.
2. Deployment ids before 2026-09 were not retained by the API listing for most projects; those milestones are anchored to commits, not deployments.
3. V03 (`781d086`) may never have been deployed to the `studio-dev-ui` project (created nine days later); it is a source milestone.
4. Client repositories are not readable here; their tools are counted as candidates only.
5. Duplicates: two brief URLs point at one studio-dev-ui deployment; two projects (`compoundmetrics`, `cd.guide`) serve one commit. Both are counted once.
