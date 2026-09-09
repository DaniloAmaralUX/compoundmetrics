# EVOLUTION.md — Delta analysis (PRD §22), self-audit (§23), latest product experience (§24)

Eleven design milestones from seven tools, scored against the frozen **Compound Design Audit v3.6.0** ruler (54 items, 9 categories, `rubric/RUBRIC-MANIFEST.json` sha256 `7c7c6915…78a279`, frozen 2026-09-09T15:32:10Z, before any capture).

**What the number means.** "Compound Design Audit Score" = PASS / (PASS + FAIL) × 100, N/A excluded, NOT_VERIFIED excluded from the score and counted in coverage. It measures performance against this frozen ruler and nothing else. It is not a universal design-quality score, it is not runtime evidence, and it does not raise CEL. Evidence boundary unchanged: v0.3.0-alpha.1 is a candidate, v0.2.1 is the stable evidence baseline, maximum CEL is E1, E2 is NOT EXECUTED, runtime uplift is NOT MEASURED (`../FREEZE.md`).

**Sources.** Every number below is read from: `SUMMARY.json` (scores, counts, per-category, `delta.pairs`, `most_persistent_failures`, `chronological_trend`), `results/<V>/site.json` (item states + evidence), `results/<V>/judgment.json` (blinded reasons), `results/<V>/deterministic.json` (measured values), `results/<V>/source-review.json` (fundamentos verdicts), `results/<V>/source-craft.json` (instrument B), `../history/DESIGN-MILESTONES.json` (names, dates, merge evaluation), `METHODOLOGY.md`, `RANDOMIZATION.json`, `reports/FINDINGS.json`. Item ids are the rubric ids; plain-word glosses come from the item `label`/`desc` in `rubric/compound-design-audit.json`. Deterministic/judgment mode per item is from `rubric/ITEM-CLASSIFICATION.json` (23 deterministic, 31 judgment, declared before scoring).

---

## 1. Scores and coverage in chronological order

Source: `SUMMARY.json` → `milestones[]` (identical to `DESIGN-EVOLUTION.csv`). Category column titles are the rubric's `categories[].title`. "—" = no scored item in that category (all N/A, or NOT_VERIFIED only).

| V | Milestone (tool) | Date | Score | Cov. | PASS/FAIL/N-A/NV | Det. | Judg. | Antes de começar | Hierarquia visual | Estilo visual | Acessibilidade | Navegação e orientação | Carga cognitiva e feedback | Onboarding e estados vazios | Social proof e confiança | Formulários |
| --- | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| V01 | Compound Labs Design, site + /audit (tool-09) | 2026-07-13 → 07-16 | **73.2** | 95.3 | 30/11/11/2 | 57.1 | 90.0 | 100 | 100 | 57.1 | 88.9 | 33.3 | 50 | 100 | 0 | 0 |
| V02 | Studio DS v1 (tool-18) | 2026-08-05 | **73.0** | 97.4 | 27/10/16/1 | 61.1 | 84.2 | 60 | 100 | 71.4 | 55.6 | 50 | 100 | 100 | 100 | — |
| V03 | Dev Studio UI — authorial rebuild (tool-12) | 2026-08-13 | **72.5** | 93.0 | 29/11/11/3 | 47.6 | 100 | 100 | 85.7 | 57.1 | 77.8 | 60 | 50 | 100 | 100 | 0 |
| V04 | Studio Dev UI — registry + originals (tool-12) | 2026-08-22 → 08-24 | **62.5** | 90.9 | 25/15/10/4 | 33.3 | 94.7 | 100 | 71.4 | 57.1 | 55.6 | 40 | 50 | 100 | 100 | 0 |
| V05 | Supernova Catálogo (tool-20) | 2026-09-06 → 09-09 | **58.7** | 92.0 | 27/19/4/4 | 43.5 | 73.9 | 100 | 100 | 57.1 | 55.6 | 0 | 50 | 100 | 66.7 | 20 |
| V06 | Geist Labs DS (tool-21) | 2026-09-07 → 09-08 | **65.1** | 87.8 | 28/15/5/6 | 45.5 | 85.7 | 80 | 85.7 | 57.1 | 33.3 | 83.3 | 100 | 100 | 100 | 0 |
| V07 | Processo — Lifeline-style timeline (tool-23) | 2026-09-08 | **65.6** | 97.0 | 21/11/21/1 | 70.6 | 60.0 | 40 | 80 | 66.7 | 77.8 | 25 | 100 | 100 | — | — |
| V08 | Compound Metrics v0.2.1, single page (tool-24) | 2026-09-09 | **80.8** | 96.3 | 21/5/27/1 | 63.6 | 93.3 | 100 | 83.3 | 40 | 100 | — (NV) | 50 | 100 | 100 | — |
| V09 | Studio Dev UI main 2026-09-09, hosts the v0.2 POC page (tool-12 + tool-24) | 2026-09-09 | **63.2** | 92.7 | 24/14/13/3 | 35.0 | 94.4 | 100 | 57.1 | 57.1 | 55.6 | 66.7 | 50 | 100 | 100 | 0 |
| V10 | Compound Design v0.3.0-alpha.1 — production (tool-24) | 2026-09-09 | **67.9** | 96.6 | 19/9/25/1 | 63.6 | 70.6 | 60 | 71.4 | 40 | 80 | — (NV) | 100 | 100 | 50 | — |
| V11 | Compound Design — Product Experience preview, 8 routes (tool-24) | 2026-09-09 | **58.7** | 95.8 | 27/19/6/2 | 50.0 | 66.7 | 100 | 57.1 | 42.9 | 55.6 | 50 | 100 | 75 | 100 | 16.7 |

Trend (`SUMMARY.json.chronological_trend`): 73.2 → 73.0 → 72.5 → 62.5 → 58.7 → 65.1 → 65.6 → 80.8 → 63.2 → 67.9 → 58.7. First vs last (`delta.first_vs_last`): **−14.5**. Average of all milestones 67.4; average of independent designs 67.3 (excludes V10, same design as V08 — `average_note`). The curve is not monotonic and the newest milestone ties the lowest.

Two structural facts the table hides and §4 unpacks: the denominators differ (V08 scores 26 items, V11 scores 46), and in every milestone but V07 the deterministic score is lower than the judgment score (deterministic 33.3–70.6 across the eleven; judgment 60–100). The ruler's discriminating power sits almost entirely in its 23 rule-based items.

---

## 2. V(n) − V(n−1): what flipped

Source: `SUMMARY.json` → `delta.pairs[]` (`score_delta`, `coverage_delta`, `same_tool`, `improved`, `regressed`, `new_failures`, `removed_failures`). The finer split below (FAIL→PASS vs FAIL→N/A, PASS→FAIL vs N/A→FAIL) is read directly from the `items[].state` of consecutive `results/<V>/site.json` files, because `removed_failures` in SUMMARY.json counts a failure that vanished with its capability (FAIL→N/A) the same as one that was fixed (FAIL→PASS), and `new_failures` counts a capability that appeared failing (N/A→FAIL) the same as a regression (PASS→FAIL). Those are different events.

### 2.1 Cross-tool deltas (different repositories, different authorship lines)

| Pair | Δ score | Δ cov. | Fixed (FAIL→PASS) | Regressed (PASS→FAIL) | Appeared failing (N/A→FAIL) | Vanished (FAIL→N/A) | Appeared passing (N/A→PASS) |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| V01→V02 (tool-09→18) | −0.2 | +2.1 | estilo/tipo-sistema, estilo/motion, navegacao/menu-previsivel, carga/disclosure | fundamentos/macro-bet, fundamentos/restricoes, estilo/radius, acessibilidade/foco, acessibilidade/contraste, acessibilidade/semantica | navegacao/busca | confianca/logos, formularios/labels, formularios/tipos-campo, formularios/input-16px | confianca/numeros |
| V02→V03 (tool-18→12) | −0.5 | −4.4 | fundamentos/macro-bet, fundamentos/restricoes, acessibilidade/foco, acessibilidade/contraste, navegacao/onde-estou, navegacao/busca | hierarquia/escala-tipo, estilo/motion, navegacao/menu-previsivel, carga/chunks | navegacao/breadcrumbs, formularios/labels, formularios/input-16px | — | — |
| V04→V05 (tool-12→20) | −3.8 | +1.1 | hierarquia/headings, hierarquia/escala-tipo, estilo/motion, acessibilidade/teclado, acessibilidade/zoom | estilo/tipo-sistema, acessibilidade/foco, acessibilidade/nao-so-cor, navegacao/onde-estou, navegacao/busca | navegacao/links, confianca/logos, formularios/opcionais, formularios/submit-estado | — | confianca/seguranca, formularios/tipos-campo |
| V05→V06 (tool-20→21) | +6.4 | −4.2 | estilo/tipo-sistema, acessibilidade/nao-so-cor, navegacao/menu-previsivel, navegacao/breadcrumbs, navegacao/busca, navegacao/mobile-nav, navegacao/links, carga/chunks | fundamentos/macro-bet, hierarquia/headings, estilo/icones, acessibilidade/teclado, acessibilidade/contraste, acessibilidade/zoom | — | confianca/logos | onboarding/empty-states |
| V06→V07 (tool-21→23) | +0.5 | +9.2 | estilo/espaco-base, acessibilidade/teclado, acessibilidade/foco, acessibilidade/contraste, acessibilidade/zoom | fundamentos/convencao, fundamentos/documentado, hierarquia/whitespace, estilo/motion, navegacao/menu-previsivel, navegacao/mobile-nav | — | hierarquia/headings, estilo/radius, formularios/labels, formularios/input-16px, formularios/opcionais | — |
| V07→V08 (tool-23→24) | **+15.2** | −0.7 | fundamentos/macro-bet, fundamentos/convencao, fundamentos/documentado, hierarquia/whitespace, acessibilidade/semantica | hierarquia/escala-tipo, estilo/espaco-base, estilo/tipo-sistema | estilo/radius, carga/disclosure | estilo/icones, estilo/motion, acessibilidade/alvos, navegacao/menu-previsivel, navegacao/mobile-nav | hierarquia/headings, confianca/numeros |

Other transitions in these pairs (PASS→N/A, N/A→NOT_VERIFIED, etc.) change the denominator but not the FAIL side: V01→V02 dropped onboarding/empty-states and onboarding/progresso-fluxo to N/A; V06→V07 dropped hierarquia/cta-3s, navegacao/breadcrumbs, navegacao/busca, carga/disclosure, onboarding/empty-states, confianca/numeros from PASS to N/A and five NOT_VERIFIED items to N/A (N/A went 5 → 21); V07→V08 dropped acessibilidade/teclado, acessibilidade/foco, acessibilidade/reduced-motion, navegacao/links from PASS to N/A (N/A went 21 → 27).

### 2.2 Same-tool deltas (SUMMARY.json `same_tool: true`)

| Pair | Δ score | Δ cov. | Fixed (FAIL→PASS) | Regressed (PASS→FAIL) | Appeared failing (N/A→FAIL) | Vanished (FAIL→N/A) | Appeared passing (N/A→PASS) |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| V03→V04 (tool-12, same repo) | −10.0 | −2.1 | **none** | hierarquia/headings, acessibilidade/teclado, acessibilidade/zoom, navegacao/mobile-nav | — | — | — |
| V08→V09 (V09 carries tool-24: its ENTRY is V08's page) | **−17.6** | −3.6 | carga/disclosure | hierarquia/headings, acessibilidade/semantica, acessibilidade/zoom, carga/chunks | hierarquia/cta-3s, acessibilidade/teclado, acessibilidade/alvos, navegacao/menu-previsivel, formularios/labels, formularios/input-16px | — | estilo/icones, estilo/motion, acessibilidade/foco, acessibilidade/reduced-motion, navegacao/busca (+ navegacao/onde-estou NV→PASS) |
| V09→V10 | +4.7 | +3.9 | hierarquia/headings, acessibilidade/semantica, acessibilidade/zoom, carga/chunks | fundamentos/jtbd, fundamentos/restricoes, acessibilidade/nao-so-cor | confianca/logos | acessibilidade/teclado, acessibilidade/alvos, navegacao/menu-previsivel, formularios/labels, formularios/input-16px | — (five PASS→N/A: icones, motion, foco, reduced-motion, busca) |
| V10→V11 (tool-24, new design) | −9.2 | −0.8 | fundamentos/jtbd, fundamentos/restricoes | hierarquia/headings, acessibilidade/zoom | estilo/icones, acessibilidade/teclado, acessibilidade/alvos, navegacao/busca, navegacao/links, onboarding/empty-states, formularios/labels, formularios/erro-inline, formularios/input-16px, formularios/opcionais, formularios/submit-estado (11) | confianca/logos | estilo/motion, acessibilidade/foco, acessibilidade/reduced-motion, navegacao/menu-previsivel, carga/feedback, onboarding/progresso-fluxo, formularios/tipos-campo (7) (+ navegacao/onde-estou NV→PASS) |

Reading the `same_tool` flag honestly: V08→V09 and V09→V10 are flagged same-tool only because V09 lists tool-24 next to tool-12. `DESIGN-MILESTONES.json.merge_evaluation` records V08/V09 ENTRY at **0 bits** apart (studio-dev-ui main at 231889f serves the v0.2.1 page at its root) and notes V09 is kept only for its gallery/playground surfaces. So V08→V09 is "the same page plus three studio-dev-ui surfaces", and V09→V10 is a cross-shell comparison. The clean same-design pair is V08→V10 (§2.3). The clean same-repository-evolution pair is V03→V04, and it is the only pair in the benchmark with zero fixes.

Every V08→V09 new failure sits on a surface V08 did not have: headings, semantica, zoom, chunks, teclado, labels, input-16px on DISCOVERY (/gallery); alvos and input-16px on INTERACTION (/playground) — `results/V09/site.json` evidence. The single ENTRY-level flip, hierarquia/cta-3s (V08 N/A → V09 FAIL on the identical page), is a rater event, reported in §5.

### 2.3 Same-line deltas that are not consecutive

Read directly from `results/V08/site.json` vs `results/V10/site.json` and `results/V04/site.json` vs `results/V09/site.json`.

**V08 → V10 (one design, two content versions — `merge_evaluation.notes`: 2 bits apart, identical CSS bundle hash).** Score 80.8 → 67.9. Deterministic side identical: 4 FAIL in both (hierarquia/escala-tipo, estilo/espaco-base, estilo/tipo-sistema, estilo/radius) with near-identical measurements (font sizes: same 19 values; spacing 252/620 vs 269/629; families/weights identical: GeistMono/GeistSans, 7 weights). The entire −12.9 comes from the non-deterministic side: fundamentos/jtbd PASS→FAIL, fundamentos/restricoes PASS→FAIL, acessibilidade/nao-so-cor PASS→FAIL (all three: §5), hierarquia/cta-3s N/A→FAIL and confianca/logos N/A→FAIL (v0.3 added an "Install" section with three command cards, so a decision point now exists and has no CTA in the first screen and no social proof beside it — content-driven, consistent), carga/disclosure FAIL→PASS (the V10 judge credited eyebrow + headline + one-paragraph summary before each detail block; the V08 judge counted all secondary complexity expanded on a ~10,056 px page). As `DESIGN-MILESTONES.json` says, treat this as a content delta, not a design delta.

**V04 → V09 (tool-12 line, 16 days).** 62.5 → 63.2. PASS→FAIL: hierarquia/cta-3s, estilo/tipo-sistema (the V08 page became V09's ENTRY and DETAIL, bringing its 7 weights with it). FAIL→PASS: estilo/motion. FAIL→N/A: navegacao/breadcrumbs. FAIL→NOT_VERIFIED: navegacao/mobile-nav. Everything else unchanged, including the whole studio-dev-ui shell's deterministic failures (espaco-base, radius, alvos, teclado on DISCOVERY, zoom on DISCOVERY, chunks, labels, input-16px).

---

## 3. The §22 list

### 3.1 Biggest improvement

`SUMMARY.json.delta.biggest_improvement`: **V07 → V08, +15.2** (65.6 → 80.8), cross-tool. Decomposed (§2.1): 5 fixed, 3 regressed, 2 appeared failing, **5 vanished** (estilo/icones, estilo/motion, acessibilidade/alvos, navegacao/menu-previsivel, navegacao/mobile-nav went FAIL→N/A because the V08 page has no icons, no declared animations, no tap targets, no navigation — `results/V08/judgment.json.per_surface_notes`: "No buttons, links, forms, search or navigation menu are visible anywhere"). Of the 11 entries SUMMARY lists under `removed_failures`, 5 are capability removals, not fixes. The 5 genuine fixes are three source-review items (macro-bet, convencao, documentado — the compoundmetrics repository carries a design critique and evidence docs the Processo repository did not), hierarquia/whitespace and acessibilidade/semantica.

### 3.2 Biggest regression

`delta.biggest_regression`: **V08 → V09, −17.6** (80.8 → 63.2). As shown in §2.2 this is the cost of adding studio-dev-ui's gallery and playground surfaces around the same page; 6 of the 10 `new_failures` are N/A→FAIL (capabilities that appeared and failed) and 4 are PASS→FAIL (DISCOVERY's heading skip, heading-order axe violation, 175 px overflow at zoom 2, ungrouped link lists of 32/37/44/53).

Two other regressions matter more for the tool-24 line because they involve no denominator games: **V03 → V04, −10.0** with zero fixes (same repository, 11 days: headings level skip on DISCOVERY, `tabindex=-1` on DISCOVERY, 175 px horizontal overflow at zoom 2, 30 px hamburger at 390), and **V10 → V11, −9.2** (§4).

### 3.3 Most persistent failures

`SUMMARY.json.delta.most_persistent_failures` (fails "of 11" milestones); the "applicable" column counts milestones where the item was PASS or FAIL, from the `site.json` matrix.

| Item | Plain words (rubric label/desc) | Mode | Fails | Applicable | Passed in |
| --- | --- | --- | ---: | ---: | --- |
| estilo/espaco-base | spacing values sit on a 4/8-px base scale (rule: ≥ 90 % multiples of 4) | deterministic | 10 | 11 | V07 only |
| acessibilidade/alvos | touch targets ≥ 44 px at 390 wide (rule: ≥ 90 % of targets) | deterministic | 9 | 9 | never (N/A in V08, V10: no targets) |
| estilo/radius | same radii for the same roles, concentric when nested (rule: ≤ 4 distinct radii) | deterministic | 9 | 10 | V01 only |
| formularios/labels | every input has a visible label, placeholder is not a label | deterministic | 7 | 7 | never |
| formularios/input-16px | input text ≥ 16 px at 390 so iOS does not zoom | deterministic | 7 | 7 | never |
| acessibilidade/semantica | real headings/lists, `<button>`/`<a>` used correctly, landmarks present | deterministic | 7 | 11 | V01, V08, V10, V11 |
| estilo/tipo-sistema | ≤ 2 families, limited intentional weights | deterministic | 6 | 11 | V02, V03, V04, V06, V07 |
| navegacao/menu-previsivel | same navigation, same place, on every page | deterministic | 6 | 9 | V02, V06, V11 |
| hierarquia/escala-tipo | all sizes from one type scale (rule: ≤ 10 distinct computed sizes) | deterministic | 6 | 11 | V01, V02, V05, V06, V07 |
| navegacao/onde-estou | current nav item visibly highlighted | deterministic | 5 | 9 | V03, V04, V09, V11 |

All ten are deterministic. Eight items never failed anywhere (hierarquia/leitura, hierarquia/proximidade, hierarquia/cor-destaque, estilo/paleta, onboarding/valor-rapido, onboarding/dicas-contexto — judgment — plus estilo/elevacao and acessibilidade/alt-aria, deterministic). Three judgment items never passed where applicable: confianca/logos (FAIL in V01, V05, V10; N/A elsewhere), formularios/opcionais (FAIL V05, V06, V11), formularios/submit-estado (FAIL V05, V11; NOT_VERIFIED V06); formularios/erro-inline was FAIL once (V11) and NOT_VERIFIED twice (V05, V06), never PASS.

### 3.4 Category improved most / least, V01 → V11

`SUMMARY.json.delta.category_improved_most/least` plus the per-milestone `categories` block. Titles from the rubric.

| Category | V01 | V11 | Δ | What is behind it (`results/V01|V11/site.json`) |
| --- | ---: | ---: | ---: | --- |
| Social proof e confiança (confianca) | 0 | 100 | **+100 (most)** | one scored item each: V01 FAIL confianca/logos (no social proof beside the INSTALL box); V11 PASS confianca/numeros (specific, sourced figures) with logos N/A (no real decision point). A one-item-vs-one-item category; not a design improvement claim. |
| Carga cognitiva e feedback (carga) | 50 | 100 | +50 | V01: chunks PASS, disclosure FAIL; V11: chunks, disclosure, feedback PASS, prevencao NV. |
| Navegação e orientação (navegacao) | 33.3 | 50 | +16.7 | V01 1/3 (mobile-nav PASS; onde-estou, menu-previsivel FAIL); V11 2/4 (onde-estou, menu-previsivel PASS; busca, links FAIL; mobile-nav NV). |
| Formulários (formularios) | 0 | 16.7 | +16.7 | V01 0/3; V11 1/6 (tipos-campo PASS). |
| Antes de começar (fundamentos) | 100 | 100 | 0 | 5/5 both. |
| Estilo visual (estilo) | 57.1 | 42.9 | −14.2 | V01 fails espaco-base, tipo-sistema, motion; V11 fails espaco-base, tipo-sistema, radius, icones. |
| Onboarding e estados vazios (onboarding) | 100 | 75 | −25 | V11 empty-states FAIL (DETAIL "Known failures" block has no next step). |
| Acessibilidade (acessibilidade) | 88.9 | 55.6 | −33.3 | V01 fails alvos only; V11 fails teclado, alvos, nao-so-cor, zoom. |
| Hierarquia visual (hierarquia) | 100 | 57.1 | **−42.9 (least)** | V01 7/7; V11 fails cta-3s, headings, escala-tipo. |

### 3.5 New capabilities (N/A → PASS because a capability appeared)

From the consecutive `site.json` transitions: V01→V02 confianca/numeros · V04→V05 confianca/seguranca, formularios/tipos-campo (a sign-up form appeared with security signals and correct field types) · V05→V06 onboarding/empty-states · V07→V08 hierarquia/headings, confianca/numeros · V08→V09 estilo/icones, estilo/motion, acessibilidade/foco, acessibilidade/reduced-motion, navegacao/busca · V10→V11 estilo/motion, acessibilidade/foco, acessibilidade/reduced-motion, navegacao/menu-previsivel (7-item nav identical on all four surfaces), carga/feedback (submit changes the button and reveals "Reset the form"), onboarding/progresso-fluxo (four-step lab strip), formularios/tipos-campo (1/1 email field typed).

The mirror list — capabilities that appeared **failing** (N/A → FAIL) — is longer: V01→V02 busca · V02→V03 breadcrumbs, labels, input-16px · V04→V05 links, logos, opcionais, submit-estado · V07→V08 radius, disclosure · V08→V09 cta-3s, teclado, alvos, menu-previsivel, labels, input-16px · V09→V10 logos · V10→V11 the eleven items in §2.2. Across the benchmark, adding a capability produced a FAIL more often than a PASS.

### 3.6 Removed failures

Fixed (FAIL → PASS), per pair, are in the "Fixed" columns of §2. Vanished (FAIL → N/A) is the other half of SUMMARY's `removed_failures` and should not be read as improvement: V01→V02 logos, labels, tipos-campo, input-16px; V05→V06 logos; V06→V07 headings, radius, labels, input-16px, opcionais; V07→V08 icones, motion, alvos, menu-previsivel, mobile-nav; V09→V10 teclado, alvos, menu-previsivel, labels, input-16px; V10→V11 logos.

### 3.7 Unresolved failures

Within the tool-24 line (V08 → V10 → V11), six items fail in both V10 and V11: hierarquia/cta-3s, hierarquia/escala-tipo, estilo/espaco-base, estilo/tipo-sistema, estilo/radius, acessibilidade/nao-so-cor. Four of them (escala-tipo, espaco-base, tipo-sistema, radius) also fail in V08 — every deterministic failure of the first standalone page is still there two design generations later. Three more V11 failures were N/A in V08/V10 but FAIL in V01, the same author's first site: acessibilidade/alvos, formularios/labels, formularios/input-16px — they returned the moment navigation and a form returned.

---

## 4. Honest reading: the newest version scores among the lowest

`results/V11/site.json`: score **58.7**, coverage 95.8, 27 PASS / 19 FAIL / 6 N/A / 2 NOT_VERIFIED. That ties V05 for the lowest score in the benchmark and is 22.1 points below V08, 9.2 below V10, 14.5 below V01.

### 4.1 Which items fail, and by which mechanism

Deterministic (11 FAIL of 22 scored → `deterministic_only.score` 50.0), from `results/V11/deterministic.json`:

| Item | Surface(s) | Measured |
| --- | --- | --- |
| hierarquia/headings | DETAIL | 1 h1, **1 level skip** (h1 60 px, h2 40 px) |
| hierarquia/escala-tipo | ENTRY, DETAIL | 14 distinct sizes on ENTRY (12, 14, 28, 21, 17, 23, 13, 40, 52, 56, 11, 84, 25.5, 64); 11 on DETAIL |
| estilo/espaco-base | all four | 56.8 % / 64.7 % / 40.6 % / 54.5 % of spacing values on the 4-px grid (off-grid 10, 18, 6, 14, 2, 1, 5, 3 px) |
| estilo/tipo-sistema | ENTRY | 2 families (GeistSans, GeistMono), **5 weights** (300, 400, 500, 600, 700) |
| estilo/radius | INTERACTION | 5 distinct radii (2, 3, 4, 6, 7 px) |
| acessibilidade/teclado | INTERACTION | 29 interactive, **3 with `tabindex=-1`** |
| acessibilidade/alvos | all four | 8/32, 23/47, 8/26, 11/29 targets ≥ 44 px at 390; worst: brand link 184×30 and the seven nav links measured **6×52 … 6×107** |
| acessibilidade/zoom | all four | **13 px** horizontal overflow at CSS zoom 2 |
| navegacao/links | ENTRY | 0/6 in-text links distinguished by more than colour |
| formularios/labels | INTERACTION | 2/3 inputs visibly labelled |
| formularios/input-16px | INTERACTION | name, email, password inputs at **15 px** |

Judgment (8 FAIL of 24 scored → `judgment_only.score` 66.7), from `results/V11/judgment.json` (blinded as DESIGN-D):

| Item | Surface | Reason (abridged) |
| --- | --- | --- |
| hierarquia/cta-3s | ENTRY | first screen has headline, paragraph, timeline strip; first action link ~4400 px down a 6166 px page; page ends with two equal-weight links |
| estilo/icones | ENTRY, DISCOVERY, DETAIL | drawn lime → arrows and ⓘ icons mixed with typographic ↻ and ← glyphs of different weight/size |
| acessibilidade/nao-so-cor | INTERACTION | invalid email field marked only by a red border; after submit the button only turns grey |
| navegacao/busca | DISCOVERY | ~21 resource pages + 7 nav pages + field guide, no search control |
| onboarding/empty-states | DETAIL | "Known failures" empty state explains itself but offers no next step |
| formularios/erro-inline | INTERACTION | generic banner only; no per-field message |
| formularios/opcionais | INTERACTION | no required/optional marker on any field |
| formularios/submit-estado | INTERACTION | button turns grey with no message |

### 4.2 Why the denominators make V08's 80.8 and V11's 58.7 non-comparable without the counts

V08 is one page with no navigation, no actions, no forms, no icons, no declared animation: **27 N/A**, 26 items scored, 5 FAIL. V10 is the same page with v0.3 content: 25 N/A, 28 scored, 9 FAIL. V11 is eight routes with a 7-item nav, in-text links, a form, tooltips, an index of ~21 resources: **6 N/A**, 46 scored, 19 FAIL.

Read against V08 item by item (`results/V08/site.json` vs `results/V11/site.json`):

- 12 of V11's 19 failures are on items that were **N/A for V08** (cta-3s, icones, teclado, alvos, busca, links, empty-states, labels, erro-inline, input-16px, opcionais, submit-estado). They are the price of having the capability at all, scored by a ruler that does not grade on a curve.
- 7 items that were N/A for V08 entered V11 as PASS (motion, foco, reduced-motion, menu-previsivel, feedback, progresso-fluxo, tipos-campo), and onde-estou went NOT_VERIFIED → PASS.
- 3 items that V08 passed now fail (headings, nao-so-cor, zoom); 1 that V08 failed now passes (disclosure); 4 V08 failures persist (escala-tipo, espaco-base, tipo-sistema, radius).

Restricting V11 to the 26 items V08 actually scored gives 19 PASS / 7 FAIL = **73.1** — still below V08's 80.8, because of headings, zoom and nao-so-cor. This restricted figure is a comparison aid, not a score; the frozen score is 58.7.

### 4.3 The Lab specimen

`results/V11/judgment.json.per_surface_notes` records that the INTERACTION surface (/lab) "contains a signup-form specimen (the page itself says four defects are seeded)". The V11 source at 921d751 (`src/content/lab.ts`, `labFindings`) seeds exactly: IR-01 "Email field has no label, only a placeholder", IR-02 "Validation message is far from the field it describes", IR-03 "The submit button suppresses its focus ring", IR-04 "Submitting gives no feedback". The ruler has no exemption for intentional defects (`ITEM-CLASSIFICATION.json` `na_condition`s are about absence of a capability, not intent), so it scored them: formularios/labels (IR-01), formularios/erro-inline (IR-02), formularios/submit-estado (IR-04), and acessibilidade/nao-so-cor (the red-border-only email field, IR-01/IR-02). Two form failures are **not** seeded: formularios/opcionais (no required/optional marker) and formularios/input-16px (15 px inputs). IR-03 produced **no** FAIL — acessibilidade/foco sampled 12/12 elements with a visible focus change and the sample did not include the submit button; the deterministic rule missed a defect the page declares. acessibilidade/teclado's three `tabindex=-1` are the lab's stage buttons (`Lab.tsx` line 179, `tabIndex={stage === s.id ? 0 : -1}`, a roving-tabindex pattern); the frozen rule counts every `tabindex=-1` and the FAIL stands.

If the six specimen-related items (labels, erro-inline, submit-estado, nao-so-cor, opcionais, input-16px) were removed from the denominator V11 would be 27/40 = 67.5 — still below V01, V02, V03, V08 and V10. The most favourable reading available does not put V11 above the single page it replaces. That is the record.

### 4.4 Two rule effects worth knowing before fixing

- **alvos**: the seven nav links measure 6 px wide at 390 because they sit behind the "Menu" toggle; the bounding-box rule measures them collapsed. Excluding them, ENTRY would still be 8/25 = 32 % ≥ 44 px, far below the 90 % threshold, so the FAIL does not depend on the collapsed links.
- **zoom**: 13 px of overflow at zoom 2 on all four surfaces; the rule is binary (any overflow fails). V04/V09 failed the same rule at 175 px, V06 at 467 px.

---

## 5. Rater noise (single-rater inconsistency, recorded)

`METHODOLOGY.md` §5 and §7: the judgment pass is single-rater per design — eleven independent model agents in fresh contexts, one per anonymised design, none of which built any milestone; `RANDOMIZATION.json` shows the blinding (seed `bf990210267e2911`, DESIGN-F = V08, DESIGN-G = V10, DESIGN-C = V09, DESIGN-D = V11). `source-review.json` carries no reviewer field. Three same-design disagreements are in the data.

**(a) fundamentos, source review, V08 vs V10** (`results/V08/source-review.json`, `results/V10/source-review.json`). Same design (`merge_evaluation`: 2 bits, same CSS hash), commits 18ffcf2 and a7f8319.

| Item | V08 verdict and cited evidence | V10 verdict and cited evidence |
| --- | --- | --- |
| fundamentos/jtbd | PASS — "README.md opens with a single sentence stating what the repository/site is and does (the standalone home of the Compound Design evidence system plus the public page that presents it)" | FAIL — "STRATEGY.md and README.md state the framework/plugin's purpose (a paragraph, not the page's job); docs/frames/ holds only a README (no frame was written for the site)" |
| fundamentos/restricoes | PASS — "README 'Running the site' fixes the stack … and the 'Layout direction' section sets …" | FAIL — "No document records stack/time/team/design-system constraints for the site before it was built … The only constraint records are in the commit bodies of the commits that did the work (18ffcf2 …)" |

The documents did change between the two commits: the M10 worktree README has "## Running the site" (line 24) and "## Layout direction" (line 97); the M12 README is rewritten (title "Compound Design", install and loop sections) and has neither. But the V10 review explicitly saw the V08-era evidence (the 18ffcf2 commit body) and did not accept it, and the jtbd threshold moved from "a repository-level sentence counts" to "a page-level job is required". The JSON cannot separate document change from threshold change. Reported as single-rater inconsistency: at least 2 of the 5 fundamentos verdicts for one design are rater-sensitive, so the fundamentos column for the tool-24 line (V08 100 · V10 60 · V11 100) carries about ±40 points of rater noise and should not be read as the design losing and regaining its fundamentals.

**(b) Blinded pass, identical page judged twice.** V08 ENTRY and V09 ENTRY are 0 bits apart. DESIGN-F (V08) gave hierarquia/cta-3s **N/A**: "No call to action exists anywhere on the page … The page is a pure reading/manifesto surface by design". DESIGN-C (V09) gave the same page **FAIL**: "there is no button, link or anchor anywhere on the full page, so no primary action can be identified". Same observation, opposite state.

**(c) Blinded pass, near-identical page.** DESIGN-F (V08) acessibilidade/nao-so-cor **PASS**: "the current evidence level is spelled out as 'E1 evidence unchanged' and 'E1 current CEL'"; DESIGN-G (V10) **FAIL**: "the current level (E1 Deterministic) is signalled only by a lime border and lime 'E1' text, with no 'current' label". Both judges saw the lime-outlined E1 row; one credited text elsewhere on the page, the other did not. V10 also added content between the two captures, so this one is not proven to be pure rater noise.

Consequence for reading the tables: on a 26–28-item denominator each judgment flip is worth 3.6–3.8 points. Differences under about 10 points between milestones, and any fundamentos delta, should be read at the item level before being read as a design difference.

---

## 6. Self-audit (§23): the audit against its own ruler

V01 is `DaniloAmaralUX/compound-labs-design@364430b` — the exact commit that serves `https://compound-labs-design.vercel.app/audit` and from which the ruler was frozen (`rubric/RUBRIC-MANIFEST.json`). Its INTERACTION surface is `/audit.html`. No immunity was given: it was captured, blinded (DESIGN-E) and scored like the other ten.

Result (`results/V01/site.json`): **73.2 / 95.3**, 30 PASS · 11 FAIL · 11 N/A · 2 NOT_VERIFIED; deterministic 57.1 (12/9), judgment 90.0 (18/2). Second-highest score in the benchmark (after V08's 80.8 on 26 scored items); 100 in fundamentos, hierarquia and onboarding; accessibility 88.9 (only alvos fails).

Answer to the §23 question — does the audit that judges interfaces meet its own ruler? **No, on 11 of its 41 scored items**, nine of which land on the audit page itself:

| Item | Plain words | Mode | Where it fails | Evidence (`results/V01/deterministic.json` / `judgment.json`) | On /audit? |
| --- | --- | --- | --- | --- | --- |
| estilo/espaco-base | 4-px spacing base | det. | all four surfaces | /audit: 299/568 values on grid (52.6 %); off-grid 14 px×127, 2 px×60, 1 px×54, 10 px×24 | yes |
| estilo/tipo-sistema | ≤ 2 families | det. | DETAIL, INTERACTION | 3 families: Inter / Geist Mono / **Arial** | yes — but see caveat |
| estilo/motion | motion < 300 ms | det. | ENTRY, DISCOVERY, DETAIL | 500 ms durations (22/27, 23/28, 36/44 ≤ 300); /audit passes (503/520) | no |
| acessibilidade/alvos | ≥ 44 px targets at 390 | det. | all four | /audit: **1/64**; theme buttons 26×26, Copy 62×32, "Exportar relatório" 132×32 | yes |
| navegacao/onde-estou | active nav item highlighted | det. | DISCOVERY, DETAIL, INTERACTION | 2 nav items, no aria-current, no styled difference | yes |
| navegacao/menu-previsivel | same nav on every page | det. (site) | site | 2 distinct primary-nav texts across 4 surfaces (/audit shows "← Início", DETAIL "← Skills") | yes |
| formularios/labels | visible label per input | det. | DETAIL | 0/11 (markdown checkboxes in the skill doc; axe label ×11); /audit passes **54/54** | no |
| formularios/tipos-campo | correct input types/autocomplete | det. | INTERACTION | 0/11 candidates; the page has only checkboxes and a read-only command field (rule's candidate detection is heuristic, METHODOLOGY §4) | yes |
| formularios/input-16px | inputs ≥ 16 px at 390 | det. | DETAIL, INTERACTION | all 54 checkboxes at 13.33 px | yes |
| carga/disclosure | progressive disclosure | judg. | INTERACTION | all 54 items with descriptions and ref lines expanded on a 6709 px page, no collapsible sections | yes |
| confianca/logos | proof at the decision point | judg. | DETAIL, INTERACTION | INSTALL box (`npx skills add …`, Copy, Download .zip) with no social proof; only "Licença MIT" | yes |

NOT_VERIFIED (2), both on /audit: carga/feedback (no post-click state of the 54 checkboxes, Copy, Exportar, Reiniciar was captured) and carga/recuperacao ("Reiniciar" clears saved progress; no capture shows a confirmation or undo).

Caveats recorded, not used to exempt: the sandbox cannot reach Google Fonts (`METHODOLOGY.md` §7, `archive/V01/metadata.json.notes`), so the Arial family is the fallback, not the source; the input-16px and tipos-campo rules count checkboxes because the rule text counts every input. The ruler is frozen; the rules as written produce these FAILs, and the same rules were applied to every other milestone.

What the audit page passes on its own ruler: headings (1 h1, no skips), escala-tipo (7 sizes), elevacao, radius (4 radii), motion, teclado (64 interactive, 0 tabindex=-1), foco, contraste (0 axe violations), alt-aria, semantica (main + nav, 11 headings, 0 axe), reduced-motion, zoom (0 px overflow), chunks, labels (54/54), and the judgment items leitura, proximidade, nao-so-cor, valor-rapido, empty-states ("0/54 itens · 0%" explained in place), dicas-contexto, progresso-fluxo.

---

## 7. §24 — old Compound production (V10) vs new Product Experience preview (V11), audited separately

| | V10 | V11 |
| --- | --- | --- |
| Surface | `https://compoundmetrics.vercel.app/` (also `cdguide-seven.vercel.app`, same commit) | preview `compoundmetrics-git-claude-com-014611-…vercel.app` |
| Deployment | `dpl_6Av1MuU5xvbQAnS6uBkWVvKcUoA9` | `dpl_4qtC9oEDZ44USUgxByVBXB7Xf399` |
| Commit | `a7f8319` (compoundmetrics `main`) | `921d751` (branch claude/compound-design-product-experience) |
| Captured (`archive/<V>/metadata.json`) | 2026-09-09T15:50:47Z | 2026-09-09T15:51:19Z |
| Surfaces captured | ENTRY only (single page) | ENTRY /, DISCOVERY /resources, DETAIL /resources/cd-interface-review, INTERACTION /lab |
| Judgment label · frozen sha256 (`RANDOMIZATION.json`) | DESIGN-G · `15cd3d…4600c` | DESIGN-D · `c2a2aa…6987c6` |
| Score / coverage | **67.9 / 96.6** | **58.7 / 95.8** |
| PASS / FAIL / N/A / NV | 19 / 9 / 25 / 1 | 27 / 19 / 6 / 2 |
| Deterministic / judgment | 63.6 / 70.6 | 50.0 / 66.7 |

Order of operations as recorded: rubric frozen 15:32:10Z → classification declared 15:39:40Z → captures 15:50–15:51Z → deterministic run (V11 16:14:53Z) → judgment files frozen and hashed 16:51:35.421Z → mapping revealed 16:51:35.422Z → SUMMARY generated 16:51:35.505Z → this file. V11's `source_sha` 921d751 is the freeze base of the whole case study (`../FREEZE.md`); `METHODOLOGY.md` §7 records the only build adjustment (`typescript.ignoreBuildErrors` for the unrelated `video/` package, no UI source changed). **No V11 finding was fixed before scoring.** Any fix made after this file is a new milestone to be captured and scored against the same `RUBRIC-MANIFEST.json`; `results/V11/` does not change.

### 7.1 V10 findings (9) — `reports/FINDINGS.json`, `results/V10/site.json`

hierarquia/cta-3s (no action in the 1440×900 first screen; "Install" section later), hierarquia/escala-tipo (19 sizes), estilo/espaco-base (269/629 on grid), estilo/tipo-sistema (7 weights: 400, 500, 520, 540, 560, 600, 700), estilo/radius (999, 16, 10, 12, 7, 14 px), acessibilidade/nao-so-cor (E1 row signalled by lime border only), confianca/logos (no proof beside the Install cards), fundamentos/jtbd and fundamentos/restricoes (§5a). NOT_VERIFIED: navegacao/onde-estou (single page, no nav).

### 7.2 V11 findings (19) — the list the author may work from after this freeze

Ids are `reports/FINDINGS.json` ids. "Specimen" marks failures on the Lab's declared seeded defects (§4.3); the ruler scored them and they stay in the record. Everything else is the site.

| Finding id | Item (mode) | Surface | What the data says | Specimen? |
| --- | --- | --- | --- | --- |
| F-V11-hierarquia-cta-3s | hierarquia/cta-3s (judg.) | ENTRY | no action in the first screen; first link ~4400 px down; two equal-weight closing links | no |
| F-V11-hierarquia-headings | hierarquia/headings (det.) | DETAIL | heading levels skip once on the page (rule: h1→h2→h3 never skips); h1 60 px, h2 40 px | no |
| F-V11-hierarquia-escala-tipo | hierarquia/escala-tipo (det.) | ENTRY, DETAIL | 14 and 11 distinct computed sizes vs ≤ 10 | no |
| F-V11-estilo-espaco-base | estilo/espaco-base (det.) | all | 40.6–64.7 % on the 4-px grid vs ≥ 90 %; 10/18/14/6 px values dominate | no |
| F-V11-estilo-tipo-sistema | estilo/tipo-sistema (det.) | ENTRY | 5 weights (300–700) vs ≤ 4 | no |
| F-V11-estilo-radius | estilo/radius (det.) | INTERACTION | 5 radii (2, 3, 4, 6, 7 px) vs ≤ 4 | no |
| F-V11-estilo-icones | estilo/icones (judg.) | ENTRY, DISCOVERY, DETAIL | typographic ↻ / ← glyphs mixed with drawn → and ⓘ icons | no |
| F-V11-acessibilidade-teclado | acessibilidade/teclado (det.) | INTERACTION | 3 elements with `tabindex=-1` (lab stage buttons, roving tabindex) | lab UI, not a seeded defect |
| F-V11-acessibilidade-alvos | acessibilidade/alvos (det.) | all | 25–49 % of targets ≥ 44 px vs ≥ 90 %; brand link 184×30; collapsed nav links 6 px wide | no |
| F-V11-acessibilidade-nao-so-cor | acessibilidade/nao-so-cor (judg.) | INTERACTION | invalid email marked by red border only; submit turns grey only | **yes** (IR-01/IR-02) |
| F-V11-acessibilidade-zoom | acessibilidade/zoom (det.) | all | 13 px horizontal overflow at zoom 2 | no |
| F-V11-navegacao-busca | navegacao/busca (judg.) | DISCOVERY | ~21 resource destinations + 7 nav pages, no search control | no |
| F-V11-navegacao-links | navegacao/links (det.) | ENTRY | 0/6 in-text links distinguished by more than colour | no |
| F-V11-onboarding-empty-states | onboarding/empty-states (judg.) | DETAIL | "Known failures" empty state has no next step or link | no |
| F-V11-formularios-labels | formularios/labels (det.) | INTERACTION | 2/3 inputs labelled (email has placeholder only) | **yes** (IR-01) |
| F-V11-formularios-erro-inline | formularios/erro-inline (judg.) | INTERACTION | banner "Please fix the errors below." only; no per-field message | **yes** (IR-02) |
| F-V11-formularios-input-16px | formularios/input-16px (det.) | INTERACTION | name/email/password inputs at 15 px | no |
| F-V11-formularios-opcionais | formularios/opcionais (judg.) | INTERACTION | no required/optional marker | no |
| F-V11-formularios-submit-estado | formularios/submit-estado (judg.) | INTERACTION | button greys out with no submitting/success/failure text | **yes** (IR-04) |

Capture gaps to close in the next run (V11 NOT_VERIFIED): navegacao/mobile-nav — all four `state-*-mobile-nav-open.png` captures show a term tooltip popover instead of the open menu; carga/prevencao — no typing/blur state was captured for the email field. Both are capture-script defects, not design verdicts.

A fix pass that resolves only the seeded-specimen rows changes the specimen the Lab exists to show; the ruler will keep scoring the specimen as long as it is the INTERACTION surface. That is a decision for the author, recorded here as a consequence of the frozen na-conditions, not as advice.

---

## 8. Instrument B (source / craft) densities — reported alongside, never mixed in

`results/<V>/source-craft.json`: `cl-audit` playbook, static pattern subset only (`METHODOLOGY.md` §6); category 1-hierarquia NOT_VERIFIED everywhere. Density = `len(findings) / files_scanned`. Counts are raw pattern hits and include upstream-derived component code where a repository contains it.

| V | files_scanned | findings | HIGH | density | note |
| --- | ---: | ---: | ---: | ---: | --- |
| V01 | 10 | 20 | 0 | 2.00 | raw hex in `404.html`, motion-easing, performance |
| V02 | 29 | 18 | 1 | 0.62 | |
| V03 | 322 | 297 | 17 | 0.92 | includes React Bits / canvas-ui components |
| V04 | 355 | 316 | 25 | 0.89 | same |
| V05 | 403 | 400 | 27 | 0.99 | `findings_truncated: 728` — list capped, density understated |
| V06 | 268 | 93 | 31 | 0.35 | |
| V07 | 38 | 22 | 1 | 0.58 | |
| V08 | 6 | 26 | 0 | 4.33 | 24 of 26 in 2-tipografia |
| V09 | 357 | 339 | 25 | 0.95 | |
| V10 | 8 | 37 | 1 | 4.62 | 27 of 37 in 2-tipografia |
| V11 | 55 | 68 | 5 | 1.24 | 48 tipografia, 8 cor, 5 superficies (HIGH), 5 motion-easing, 2 performance |

The tool-24 line has the highest densities in the benchmark (4.33, 4.62, 1.24) because its file counts are tiny and its typography patterns are concentrated; V11 lowered the density by adding files, not by removing hits per file class. This instrument was not used in any score above.

---

## 9. What this file does not claim

It does not claim that Compound Design increases productivity, produces better design universally, or has business impact; that the ruler is objective or universal; that any method named in the milestones is externally recognised or endorsed by anyone; or that any score here is runtime evidence — CEL stays at E1, E2 stays NOT EXECUTED, runtime uplift stays NOT MEASURED. The judgment pass is single-rater per design (independent fresh-context agents, not the session that built four of the eleven milestones); §5 shows what single-rater noise costs. The frozen ruler has heuristics with declared thresholds, and §4.3 shows one of them missing a defect the page itself declares. If the newest version is the worst on this ruler, that is what the data says, and it is recorded.
