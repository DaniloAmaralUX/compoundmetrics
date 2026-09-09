# Learning Yield — findings → learning states → resource candidates

Generated 2026-09-09T17:07:55Z from `reports/FINDINGS.json` (139 findings), `results/<V>/site.json`, `knowledge/TRANSFER-GRAPH.json`, `history/TOOLS-MANIFEST.json`, `compound-design/learning/LEDGER.md`, `docs/solutions/`, `compound-design/registry/resource-registry.json` and `compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md`. Machine-readable twin: `reports/learning-yield.json`.

The Compound Design Audit Score says how each milestone performed against the frozen ruler. Learning Yield (PRD §17) asks the second question: how much of what the ruler found became reusable — a durable learning, a named resource candidate, a promoted resource, a resource a later tool reused.

**Evidence boundary, unchanged:** v0.3.0-alpha.1 is a candidate; v0.2.1 is the stable evidence baseline; CEL is at most E1; E2 was not executed; runtime uplift was not measured. Nothing below shows that Compound Design improved productivity, design quality or any business outcome. A tool with zero durable learnings is a legitimate result.

## Headline

| | count |
| --- | ---: |
| findings (every FAIL with evidence) | 139 |
| rejected (measurement artefact — kept, with reason) | 15 |
| duplicate-known-learning (same item failed earlier, or a rule already exists) | 99 |
| local-only | 9 |
| meaningful (not rejected, not duplicate) | 25 |
| durable learnings (findings) / distinct learnings | 16 / 14 |
| resource candidates (rule 6, component 3, pattern 2, eval 3, skill 0, agent 0, tool 0) | 14 |
| resources promoted (registry or ledger encodes the finding) | **0** |
| resources later reused (verified TRANSFER-GRAPH edge) | **0** |

Read the two zeros plainly. The 139 findings were produced on 2026-09-09, after the fact, by the frozen ruler; none has been promoted into a registry resource or a ledger entry, and no verified edge in the transfer graph starts from one of them. The one verified chain that goes all the way from a failure to a rule to a reuse (E49–E54: `site-check` failure → ledger `CD-20260909-013` → `docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md` → wait-before-axe rule → `scripts/site-check.mjs`) starts from the site's own deterministic check, not from a rubric finding, and the reuse is inside the same tool and commit (`921d751`).

Twenty-three of the 99 duplicates are duplicates because an active, registered resource already encodes the rule (mostly `cd-interface-review`, E1: invisible focus, contrast failure, meaning by colour alone, pointer-only reachability, reflow at zoom; and `cd-frame` / `cd-strategy` / `cd-compound` for the fundamentos items). That is knowledge the framework holds; it is not evidence that the knowledge changed any of the audited tools, and in V10 the tool that holds it failed the same fundamentos items on its own site before its frame was written.

## States (PRD §17.1)

| state | count | what it means here |
| --- | ---: | --- |
| local-only | 9 | a fix for one screen; not generalisable |
| duplicate-known-learning | 99 | the same audit item already failed in an earlier milestone (V01..V11, rejected ones excluded), or an active resource already encodes the rule (cited) |
| durable-learning | 2 | generalisable beyond one screen and not encoded, but no resource can honestly be named |
| rule-candidate | 6 | would become a named rule (in cd-polish / cd-interface-review scope) |
| component-candidate | 3 | would become a named component |
| pattern-candidate | 2 | would become a named pattern |
| eval-candidate | 3 | would become a deterministic check (site-check) |
| skill-candidate | 0 | none — no finding warrants a new skill |
| agent-candidate | 0 | none — no finding warrants a new agent |
| tool-candidate | 0 | none |
| rejected | 15 | measurement artefact: fonts blocked in the sandbox, checkbox inputs under text-input rules, a 999 px pill counted as a radius, roving tabindex read as unreachable, the deliberately defective Lab specimen, N/A-worthy social proof |

Precedence when a finding fits two states: rejected → duplicate → named candidate → durable-learning → local-only. Root causes are consolidated (FINDING-CONTRACT.md): V04's mobile-nav finding is a duplicate of the tap-target learning. V09's findings (milestone tool `tool-12+tool-24`) are attributed by surface: ENTRY/DETAIL to tool-24 (the hosted page is byte-identical to V08), the rest to tool-12.

## Per tool

| tool | milestones | findings | meaningful | durable | candidates | promoted | reused | rejected | duplicates | local-only |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| tool-09 · Compound Labs Design | V01 | 11 | 7 | 5 | 4 | 0 | 0 | 4 | 0 | 2 |
| tool-18 · Studio DS | V02 | 10 | 3 | 2 | 2 | 0 | 0 | 0 | 7 | 1 |
| tool-12 · Canvas UI fork → Dev Studio UI → Studio Dev UI | V03, V04, V09 | 35 | 5 | 4 | 4 | 0 | 0 | 0 | 30 | 1 |
| tool-20 · Supernova UI + Supernova Catálogo | V05 | 19 | 4 | 3 | 3 | 0 | 0 | 2 | 13 | 1 |
| tool-21 · Geist Labs DS (lab-design, lab-design-timeline) | V06 | 15 | 1 | 1 | 1 | 0 | 0 | 0 | 14 | 0 |
| tool-23 · Processo | V07 | 11 | 3 | 0 | 0 | 0 | 0 | 0 | 8 | 3 |
| tool-24 · Compound Metrics / Compound Design (cd.guide) | V08, V09, V10, V11 | 38 | 2 | 1 | 0 | 0 | 0 | 9 | 27 | 1 |
| **all** | V01–V11 | 139 | 25 | 16 | 14 | 0 | 0 | 15 | 99 | 9 |

`durable` counts findings in state durable-learning or any *-candidate; `candidates` counts the *-candidate subset. Chronological first-occurrence attribution means the earliest tool (tool-09, V01) owns most learnings; tool-23 (Processo) has zero durable learnings and eleven findings — three local to its one timeline page, eight repeats of things already known — which is a correct result, not a gap. tool-24 (this repository) has 38 findings and one durable learning of its own: its site repeats classes first seen in earlier tools (spacing base, type tokens, tap targets, headings, zoom reflow, search, link affordance, icon glyphs, input text size, required markers, radius count, disclosure, colour-only state), and nine of its findings are rejected — five measure the Lab's deliberately defective specimen or its roving-tabindex tablist, three are the 999 px pill counted as a radius, one is N/A-worthy social proof.

## Durable learnings

Fourteen distinct learnings from sixteen source findings. `promoted` is false for every one: nothing in the registry or the ledger encodes any of them as a result of the benchmark. Where the repository already does the thing (tool-24's site shell sets `aria-current`, the Lab teaches the disabled-submit lesson), that is noted as site code, not as a resource.

### DL-01 · none (decision pending: tokens vs ruler)

**The 4-px spacing base demanded by the author's own checklist is never met by the author's own stacks: every milestone uses the 2/6/10/14 px half-steps of the Tailwind/shadcn scale. Either the tokens declare a 4-px base or the checklist admits a declared half-step; the disagreement itself is the learning.**

- Source finding(s): `F-V01-estilo-espaco-base`
- Recurrences (classified duplicate-known-learning): 9 — `F-V02-estilo-espaco-base`, `F-V03-estilo-espaco-base`, `F-V04-estilo-espaco-base`, `F-V05-estilo-espaco-base`, `F-V06-estilo-espaco-base`, `F-V08-estilo-espaco-base`, `F-V09-estilo-espaco-base`, `F-V10-estilo-espaco-base`, `F-V11-estilo-espaco-base`
- Why durable: Fails in 10/11 milestones (all but V07) on 6/7 tools; not encoded in any skill, rule or check.
- Promoted: no · Later reused: no

### DL-02 · rule-candidate

**Site-shell targets (icon buttons, nav links, brand, theme toggle) ship below 44 px at 390 wide unless a rule forces the size.**

- Source finding(s): `F-V01-acessibilidade-alvos`
- Recurrences (classified duplicate-known-learning): 9 — `F-V02-acessibilidade-alvos`, `F-V03-acessibilidade-alvos`, `F-V04-acessibilidade-alvos`, `F-V04-navegacao-mobile-nav`, `F-V05-acessibilidade-alvos`, `F-V06-acessibilidade-alvos`, `F-V07-acessibilidade-alvos`, `F-V09-acessibilidade-alvos`, `F-V11-acessibilidade-alvos`
- Why durable: Fails in 9/11 milestones on all 7 tools; cd-interface-review names target size as scope but has no rule; site-check has no check.
- Becomes: rule: every interactive target in the site shell (icon buttons, nav links, brand link, theme toggle) is ≥ 44×44 px at 390 wide, or ≥ 24 px tall when it is an inline text link
- Promoted: no · Later reused: no

### DL-03 · component-candidate

**The current route must be marked (aria-current='page' + a visible style) by the shared nav component, not left to each page.**

- Source finding(s): `F-V01-navegacao-onde-estou`
- Recurrences (classified duplicate-known-learning): 4 — `F-V02-navegacao-onde-estou`, `F-V05-navegacao-onde-estou`, `F-V06-navegacao-onde-estou`, `F-V07-navegacao-onde-estou`
- Why durable: Fails on 5 tools across 5 milestones (V01, V02, V05, V06, V07); passes only where one shell component owns it (tool-24 V10/V11).
- Becomes: component: primary-nav link that sets aria-current='page' and a visible current-route style, shared by every route
- Promoted: no · Later reused: no

### DL-04 · pattern-candidate

**One site shell rendered from the root layout keeps the primary nav identical on every route; per-page headers drift.**

- Source finding(s): `F-V01-navegacao-menu-previsivel`
- Recurrences (classified duplicate-known-learning): 5 — `F-V03-navegacao-menu-previsivel`, `F-V04-navegacao-menu-previsivel`, `F-V05-navegacao-menu-previsivel`, `F-V07-navegacao-menu-previsivel`, `F-V09-navegacao-menu-previsivel`
- Why durable: Fails on 4 tools across 6 milestones (V01, V03, V04, V05, V07, V09); passes where the shell is a single layout component.
- Becomes: pattern: one shared site shell (header + primary nav) rendered from the root layout on every route, never per page
- Promoted: no · Later reused: no

### DL-05 · rule-candidate

**Every input needs a visible, associated label; placeholder or aria-label alone passes axe but fails users.**

- Source finding(s): `F-V01-formularios-labels`
- Recurrences (classified duplicate-known-learning): 5 — `F-V03-formularios-labels`, `F-V04-formularios-labels`, `F-V05-formularios-labels`, `F-V06-formularios-labels`, `F-V09-formularios-labels`
- Why durable: Fails on 4 tools across 6 milestones (non-rejected occurrences); only the accessible-name half is encoded in cd-interface-review.
- Becomes: rule: every input has a visible label programmatically associated with it; a placeholder or aria-label alone is not a label
- Encoding note: partially — skills/cd-interface-review/SKILL.md:85 'missing accessible name' (resource-registry.json id cd-interface-review (skill, active, CEL E1)); the visible-label requirement is not encoded
- Promoted: no · Later reused: no

### DL-06 · eval-candidate

**Landmark and heading structure (<main>, one <h1>, no level skips) must be a failing check, not a noted moderate axe result.**

- Source finding(s): `F-V02-acessibilidade-semantica`, `F-V04-hierarquia-headings`
- Recurrences (classified duplicate-known-learning): 9 — `F-V03-acessibilidade-semantica`, `F-V04-acessibilidade-semantica`, `F-V05-acessibilidade-semantica`, `F-V06-hierarquia-headings`, `F-V06-acessibilidade-semantica`, `F-V07-acessibilidade-semantica`, `F-V09-hierarquia-headings`, `F-V09-acessibilidade-semantica`, `F-V11-hierarquia-headings`
- Why durable: semantica fails on 5 tools (7 milestones) and headings on 3 tools (4 milestones); tool-24's site-check only notes these rules.
- Becomes: site-check: axe landmark-one-main, page-has-heading-one and heading-order fail the check (not merely noted); every route has <main>, a <nav> or <header>, and exactly one <h1>
- Promoted: no · Later reused: no

### DL-07 · pattern-candidate

**A catalogue surface above roughly 15 destinations needs a filter or search on the index itself.**

- Source finding(s): `F-V02-navegacao-busca`
- Recurrences (classified duplicate-known-learning): 2 — `F-V05-navegacao-busca`, `F-V11-navegacao-busca`
- Why durable: Fails on 3 tools (V02, V05, V11), including tool-24's own resources index.
- Becomes: pattern: a catalogue or index surface above ~15 destinations ships a keyboard-reachable filter/search on the index itself
- Promoted: no · Later reused: no

### DL-08 · rule-candidate

**Typography must be tokens declared once (≤ 2 families, ≤ 4 weights, ≤ 10 sizes); literal px sizes and variable-font weights leak otherwise.**

- Source finding(s): `F-V03-hierarquia-escala-tipo`, `F-V05-estilo-tipo-sistema`
- Recurrences (classified duplicate-known-learning): 9 — `F-V04-hierarquia-escala-tipo`, `F-V08-hierarquia-escala-tipo`, `F-V08-estilo-tipo-sistema`, `F-V09-hierarquia-escala-tipo`, `F-V09-estilo-tipo-sistema`, `F-V10-hierarquia-escala-tipo`, `F-V10-estilo-tipo-sistema`, `F-V11-hierarquia-escala-tipo`, `F-V11-estilo-tipo-sistema`
- Why durable: escala-tipo fails on 2 tools across 6 milestones and tipo-sistema on 2 tools across 5 (tool-24's site fails both in V08–V11).
- Becomes: rule: typographic tokens declared once — ≤ 10 sizes, ≤ 2 families, ≤ 4 weights — and no literal px font-size outside the token file (shared with DL-08's second source finding)
- Promoted: no · Later reused: no

### DL-09 · component-candidate

**Routes at path depth ≥ 3 need a parent link or breadcrumb from a shared component.**

- Source finding(s): `F-V03-navegacao-breadcrumbs`
- Recurrences (classified duplicate-known-learning): 2 — `F-V04-navegacao-breadcrumbs`, `F-V05-navegacao-breadcrumbs`
- Why durable: Fails on 2 tools across 3 milestones (V03, V04, V05).
- Becomes: component: parent link / breadcrumb rendered on every route whose path depth is ≥ 3
- Promoted: no · Later reused: no

### DL-10 · eval-candidate

**Text inputs below 16 px at 390 wide are a deterministic check, not a review item.**

- Source finding(s): `F-V03-formularios-input-16px`
- Recurrences (classified duplicate-known-learning): 4 — `F-V04-formularios-input-16px`, `F-V06-formularios-input-16px`, `F-V09-formularios-input-16px`, `F-V11-formularios-input-16px`
- Why durable: Fails on 3 tools across 5 milestones (V03, V04, V06, V09, V11); site-check has no input font-size check.
- Becomes: site-check: every visible text input, select and textarea has computed font-size ≥ 16 px at 390 wide
- Promoted: no · Later reused: no

### DL-11 · component-candidate

**A form field is one component carrying label, required/optional marker, inline error slot and ≥ 16 px input — or each is forgotten separately.**

- Source finding(s): `F-V05-formularios-opcionais`
- Recurrences (classified duplicate-known-learning): 2 — `F-V06-formularios-opcionais`, `F-V11-formularios-opcionais`
- Why durable: opcionais fails on 3 tools (V05, V06, V11); the sibling classes (labels, erro-inline, input-16px) recur with it.
- Becomes: component: form field with visible label, consistent required/optional marker, inline error slot bound by aria-describedby, and ≥ 16 px input text
- Promoted: no · Later reused: no

### DL-12 · rule-candidate

**A submit button is never disabled without a visible reason, and submitting/success/failure states are visible.**

- Source finding(s): `F-V05-formularios-submit-estado`
- Recurrences (classified duplicate-known-learning): 0
- Why durable: Fails in V05 and is the exact defect tool-24 chose to teach as Lab lesson IR-04 — encoded as a fixture, not as a rule.
- Becomes: rule: a submit button is never disabled without a visible reason; submitting, success and failure states are visible near the button
- Encoding note: not in the registry or ledger; taught as Lab lesson IR-04 in src/content/lab.ts:59-70 (site content, not a resource)
- Promoted: no · Later reused: no

### DL-13 · rule-candidate

**Icons come from one family; typographic glyphs (→ ← ↻, emoji) are not icons beside drawn ones.**

- Source finding(s): `F-V06-estilo-icones`
- Recurrences (classified duplicate-known-learning): 2 — `F-V07-estilo-icones`, `F-V11-estilo-icones`
- Why durable: Fails on 3 tools (V06, V07, V11), including tool-24's own site.
- Becomes: rule: icons come from one family at one stroke weight and optical size; typographic glyphs (→ ← ↻, emoji) are text, never icons beside drawn icons
- Promoted: no · Later reused: no

### DL-14 · none (content decision)

**The product landing page's first screen carries one identifiable primary action.**

- Source finding(s): `F-V09-hierarquia-cta-3s`
- Recurrences (classified duplicate-known-learning): 2 — `F-V10-hierarquia-cta-3s`, `F-V11-hierarquia-cta-3s`
- Why durable: Fails on tool-24's site in V09, V10 and V11; rater disagreement on identical bytes (V08 PASS) lowers confidence, and the fix is a content decision, so no resource is named.
- Promoted: no · Later reused: no

## Rejected findings (kept, with reason)

| finding | tool | reason |
| --- | --- | --- |
| `F-V01-estilo-tipo-sistema` | tool-09 | Measurement artefact: the third family is Arial, the system fallback rendered because the sandbox cannot reach Google Fonts (METHODOLOGY.md §7; case-study/archive/V01/metadata.json notes list the failed fonts.googleapis.com request on every surface). With the declared Inter + Geist Mono the surface has 2 families and 4 weights, which passes the rule. |
| `F-V01-confianca-logos` | tool-09 | N/A-worthy under the evidence boundary: the site is a personal experiment with no users, stars or customers. Any social proof placed beside the install box would have to be fabricated, which the claim discipline forbids. The ruler scores it FAIL; as a learning it is noise. |
| `F-V01-formularios-tipos-campo` | tool-09 | Measurement artefact: the only inputs on the V01 surfaces are the 54 checklist checkboxes (formularios/labels and formularios/input-16px on the same milestone count checkbox inputs only). A checkbox cannot carry type=email/tel/number; the 11 'email/tel/number-like' candidates are a text-heuristic misfire. Only occurrence of this item in the benchmark. |
| `F-V01-formularios-input-16px` | tool-09 | Measurement artefact: the sub-16 px inputs are all checkboxes (13.33 px). The 16 px rule exists to stop mobile browsers zooming on focus of text inputs; a checkbox's font-size has no such effect. The rule as written applies to 'every visible input/select/textarea' and so fired on checkboxes. |
| `F-V05-confianca-logos` | tool-20 | N/A-worthy: the 'Create account' card on /c/forms is a catalogue specimen of a form design, not a sign-up flow with customers; any social proof beside it would be invented. Also the same item as the rejected F-V01-confianca-logos. |
| `F-V05-formularios-input-16px` | tool-20 | Measurement artefact: the only sub-16 px input is a checkbox (14 px); the rule targets text inputs (see F-V01-formularios-input-16px). |
| `F-V08-estilo-radius` | tool-24 | Measurement artefact: the 999 px pill is counted as a distinct radius although the rule excludes 50 % / 9999 px pills — this site's pill is written as 999px, so the exclusion missed it. The residual five values would still exceed the threshold, but the measured value (6) is contaminated and the item is a heuristic with no user cost; kept as rejected, not deleted. |
| `F-V09-estilo-radius` | tool-24 | Same page and same 999 px pill artefact as F-V08-estilo-radius (V09 ENTRY is byte-identical to V08 ENTRY). |
| `F-V10-estilo-radius` | tool-24 | Same 999 px pill artefact as F-V08-estilo-radius on the same page family. |
| `F-V10-confianca-logos` | tool-24 | N/A-worthy: the Install section belongs to a candidate release with no users and CEL E1; the only honest 'proof' is the evidence state itself, and placing social proof there would breach the claim discipline. Same item as the rejected F-V01-confianca-logos. |
| `F-V11-acessibilidade-teclado` | tool-24 | Measurement artefact: the three tabindex=-1 elements are the Lab stepper's role=tab buttons using the roving-tabindex pattern (src/components/Lab.tsx:179, tabIndex={stage === s.id ? 0 : -1} with arrow-key handling), which is the correct ARIA tabs pattern; the deterministic rule cannot tell roving tabindex from an unreachable control. |
| `F-V11-acessibilidade-nao-so-cor` | tool-24 | Measured on the deliberately defective Lab specimen: the colour-only invalid field and grey-only submit are the specimen's declared defects IR-01 and IR-04 (src/content/lab.ts). src/components/Lab.tsx:99 (data-lab-fixture, aria-label 'Specimen under review: a signup form with deliberate defects'); scripts/site-check.mjs:204-212 excludes [data-lab-fixture] because 'its defects are the lesson'. The nav states on every surface pass. |
| `F-V11-formularios-labels` | tool-24 | Measured on the deliberately defective Lab specimen: the unlabelled email field is declared defect IR-01 (src/components/Lab.tsx:118-122 renders the label only once 'fixed'). src/components/Lab.tsx:99 (data-lab-fixture, aria-label 'Specimen under review: a signup form with deliberate defects'); scripts/site-check.mjs:204-212 excludes [data-lab-fixture] because 'its defects are the lesson'. |
| `F-V11-formularios-erro-inline` | tool-24 | Measured on the deliberately defective Lab specimen: the generic banner without a field-level message is declared defect IR-02 (src/components/Lab.tsx:104-108, 134-138). src/components/Lab.tsx:99 (data-lab-fixture, aria-label 'Specimen under review: a signup form with deliberate defects'); scripts/site-check.mjs:204-212 excludes [data-lab-fixture] because 'its defects are the lesson'. |
| `F-V11-formularios-submit-estado` | tool-24 | Measured on the deliberately defective Lab specimen: the greyed submit with no state text is declared defect IR-04 (src/components/Lab.tsx:147-150). src/components/Lab.tsx:99 (data-lab-fixture, aria-label 'Specimen under review: a signup form with deliberate defects'); scripts/site-check.mjs:204-212 excludes [data-lab-fixture] because 'its defects are the lesson'. |

## Local-only findings

- `F-V01-estilo-motion` (tool-09): Five declared 500 ms transitions on one site (22/27 within 300 ms). A token change on this codebase; the 300 ms threshold is a ruler heuristic and cd-motion-review already owns the judgment of what a duration communicates (skills/cd-motion-review/SKILL.md:27,71). Nothing generalisable beyond this site.
- `F-V01-carga-disclosure` (tool-09): The /audit checklist page shows all 54 items expanded; the page's job is to show the whole checklist, so collapsing is a choice for that one page. Not generalisable.
- `F-V02-estilo-radius` (tool-18): Eight distinct radii from shadcn's calc()-derived tokens (8.75, 5.6, 15 px …). A token tidy-up in one codebase; the '≤ 4 distinct' threshold is a ruler heuristic with no user cost, and FINDING-CONTRACT.md refuses taste as defect. Not generalisable as a rule beyond this codebase.
- `F-V03-carga-chunks` (tool-12): Four ungrouped lists of 12 links in the gallery index. A grouping change on one index page; the '> 9 without a heading' threshold is a ruler heuristic and the recurrence in V04/V05/V09 is the same index-list layout of catalogue sites rather than a user-cost defect.
- `F-V05-navegacao-mobile-nav` (tool-20): Two fixed bottom bars stack to ~180 px at 390 and cover the form's checkbox and submit button on DETAIL only; the other three surfaces pass. A layout bug on one surface.
- `F-V07-fundamentos-convencao` (tool-23): The whole content area is a horizontally panning timeline with no scroll cue; a property of this one Lifeline-derived page. tool-24 adapted the same interaction model with a visible rail and vertical mobile fallback (src/components/Timeline.tsx) and passes the item in V11, but that is a different implementation, not a reuse of a learning from this finding (TRANSFER-GRAPH E62 unverified).
- `F-V07-hierarquia-whitespace` (tool-23): Uniform bands above and below the timeline row on one page; a layout decision specific to this page.
- `F-V07-navegacao-mobile-nav` (tool-23): A two-page site with no navigation at 390 and a clipped footer step chain. An omission on one small site, not a pattern to encode.
- `F-V11-onboarding-empty-states` (tool-24): The 'Known failures' empty state on resource pages explains itself but offers no next step; the fix is one link to the ledger on one block. Not generalisable.

## Known learnings that were never encoded

The recurrence column above is the case study's sharpest signal. The same eleven audit items account for most of the 99 duplicates, and none of them has a rule, component or check in the framework. Ranked by recurrence:

- DL-01 (none (decision pending: tokens vs ruler)): 9 recurrences — The 4-px spacing base demanded by the author's own checklist is never met by the author's own stacks: every milestone uses the 2/6/10/14 px half-steps of the Tailwind/shadcn scale. Either the tokens declare a 4-px base or the checklist admits a declared half-step; the disagreement itself is the learning.
- DL-02 (rule-candidate): 9 recurrences — Site-shell targets (icon buttons, nav links, brand, theme toggle) ship below 44 px at 390 wide unless a rule forces the size.
- DL-06 (eval-candidate): 9 recurrences — Landmark and heading structure (<main>, one <h1>, no level skips) must be a failing check, not a noted moderate axe result.
- DL-08 (rule-candidate): 9 recurrences — Typography must be tokens declared once (≤ 2 families, ≤ 4 weights, ≤ 10 sizes); literal px sizes and variable-font weights leak otherwise.
- DL-04 (pattern-candidate): 5 recurrences — One site shell rendered from the root layout keeps the primary nav identical on every route; per-page headers drift.
- DL-05 (rule-candidate): 5 recurrences — Every input needs a visible, associated label; placeholder or aria-label alone passes axe but fails users.
- DL-03 (component-candidate): 4 recurrences — The current route must be marked (aria-current='page' + a visible style) by the shared nav component, not left to each page.
- DL-10 (eval-candidate): 4 recurrences — Text inputs below 16 px at 390 wide are a deterministic check, not a review item.
- DL-07 (pattern-candidate): 2 recurrences — A catalogue surface above roughly 15 destinations needs a filter or search on the index itself.
- DL-09 (component-candidate): 2 recurrences — Routes at path depth ≥ 3 need a parent link or breadcrumb from a shared component.
- DL-11 (component-candidate): 2 recurrences — A form field is one component carrying label, required/optional marker, inline error slot and ≥ 16 px input — or each is forgotten separately.
- DL-13 (rule-candidate): 2 recurrences — Icons come from one family; typographic glyphs (→ ← ↻, emoji) are not icons beside drawn ones.
- DL-14 (none (content decision)): 2 recurrences — The product landing page's first screen carries one identifiable primary action.

## What the transfer graph says

TRANSFER-GRAPH.json has 97 verified edges; none originates from a rubric finding. The only verified finding→learning→rule→reuse chain (E49–E54: site-check failure → ledger CD-20260909-013 → docs/solutions axe-at-rest → wait rule → scripts/site-check.mjs) starts from a site-check failure, not from one of the 139 rubric findings, and its reuse is inside the same tool and commit (921d751) — reuse in a later tool is not shown.

## Method

Inputs: reports/FINDINGS.json (139 FAIL findings with evidence), results/<V>/site.json, knowledge/TRANSFER-GRAPH.json (verified edges only count), history/TOOLS-MANIFEST.json, compound-design/learning/LEDGER.md (CD-20260909-001..013), docs/solutions/*.md, compound-design/registry/resource-registry.json (24 resources, CEL and evidenceDebt), compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md, and the active skills/agents. Every finding gets exactly one PRD §17.1 state. Rules applied, in precedence order: (1) rejected when the measurement is an artefact (fonts blocked in the sandbox, checkbox inputs under text-input rules, a 999 px pill counted as a radius, roving tabindex read as unreachable, the deliberately defective Lab specimen, N/A-worthy social proof for a zero-user experiment) — kept with the reason, never deleted; (2) duplicate-known-learning when the same audit item already failed in an earlier milestone (chronological V01..V11, rejected findings do not count as prior) or when an active resource already encodes the rule (cited); (3) a *-candidate only when the concrete resource is named; (4) durable-learning when generalisable beyond one screen and not encoded, but no resource can honestly be named; (5) local-only otherwise. Root-cause consolidation (FINDING-CONTRACT.md) makes V04 mobile-nav a duplicate of the tap-target learning. V09 findings (milestone tool 'tool-12+tool-24') are attributed by surface: ENTRY/DETAIL to tool-24 (the hosted page is byte-identical to V08, TRANSFER-GRAPH E20), the rest to tool-12. Metrics: meaningful = not rejected and not duplicate; durable_learnings = findings in state durable-learning or any *-candidate (a candidate is a durable learning with a named resource); resource_candidates = *-candidate findings; distinct_durable_learnings counts learning ids (DL-06 and DL-08 each have two source findings); resources_promoted requires a registry or ledger resource that encodes the finding; resources_later_reused requires a verified TRANSFER-GRAPH reuse edge. Both are 0 for every tool — the findings were produced on 2026-09-09 after the fact, and no promotion has happened. TRANSFER-GRAPH.json has 97 verified edges; none originates from a rubric finding. The only verified finding→learning→rule→reuse chain (E49–E54: site-check failure → ledger CD-20260909-013 → docs/solutions axe-at-rest → wait rule → scripts/site-check.mjs) starts from a site-check failure, not from one of the 139 rubric findings, and its reuse is inside the same tool and commit (921d751) — reuse in a later tool is not shown. Chronological first-occurrence attribution means the earliest tool (tool-09, V01) owns most learnings and a later tool with 0 durable learnings is a legitimate result, not a failure. Not optimised for more learning: 9 local-only, 15 rejected and 99 duplicates are recorded as such. States are performance against the frozen ruler only; nothing here measures runtime uplift.

## Claim discipline

Learning Yield counts states against the frozen Compound Design Audit ruler. It does not show that Compound Design improved productivity, design quality, or any business outcome; CEL stays at E1, E2 was not executed, runtime uplift was not measured.
