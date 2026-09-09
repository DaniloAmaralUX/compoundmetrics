# Compound Design — case-study film · STORYBOARD

Pre-production document for the Remotion film (PRD §26–§34). Companion files: `SHOT-MANIFEST.json` (machine-readable shot list, validated against disk) and `NARRATION.md`.

| Composition | Frame | fps | Duration | Frames | Shots |
| --- | --- | --- | --- | --- | --- |
| `CompoundEvolution` (master) | 1920×1080 · 16:9 | 30 | **108 s** | 3240 | MS-01 … MS-29 |
| `CompoundEvolutionVertical` | 1080×1920 · 9:16 | 30 | **54 s** | 1620 | VT-01 … VT-19 |
| `CompoundTeaser` | 1920×1080 · 16:9 | 30 | **15 s** | 450 | TZ-01 … TZ-06 |

Audio: **none**. No music (no licensed or generated music). The film is silent; the author may record `NARRATION.md` and drop it in as `public/narration.wav` later. No synthetic voice.

---

## 0. Rules that every scene obeys

1. **No literal numbers in scene code.** Every numeral on screen is read from one of the four data files of PRD §32 at render time. The notation used below is `file.path` (e.g. `design-scores.milestones[V04].score`). Section 8 maps each file to its source of truth in this repository.
2. **On-screen text is restricted** to (a) the §26 key phrases, keyed `T.*` (registry in §7), and (b) data-driven labels, keyed `L.*`, whose visible characters come entirely from a data field (names, ids, types, dates, counts, deltas). Nothing else is typeset. The PRD Act quotes (§4) are used **only in narration**, never on screen.
3. **The tools count.** The film shows a numeral bound to `tools.stated_count_in_brief` (= 17) **only because the brief states it**. The manifest's own reconciliation says the account's metadata supports `tools.tool_candidates` (= 24) with `tools.verified_by_repository` (= 8), and that the two counts are *not reconciled*. Therefore the caption `L.tools.caption` = `candidates: {tools.tool_candidates}, verified: {tools.verified_by_repository}` appears **exactly once per composition** (master MS-03 at 5.0 s; vertical VT-02; teaser TZ-06). It is never repeated, and the film never states “17” without that caption having been shown in the same composition.
4. **Only verified edges are ever drawn.** `transfer-graph.edges[].verified === true` is a hard filter in `ToolConstellation.tsx`. The 8 unverified edges (E09, E10, E55, E62, E87, E88, E89, E90) and everything in `transfer-graph.none_verified` do not exist for the film. In particular: no line from the v0-era tools or client tools to anything; no Processo → compoundmetrics edge (E62).
5. **Tool nodes.** Nodes are `tools.tools[]` (24). Nodes whose tool is verified by a readable repository (`confidence: high` / present as `transfer-graph.nodes[type=tool]`) render solid with a hero thumbnail; the remaining 16 render as hollow rings **without labels** (client work is `privacy: review-required`; a ring shows that a tool exists without naming it). The Hook counts up to `tools.stated_count_in_brief` rings, not 24 — see rule 3 — and the caption immediately tells the audience why.
6. **Camera targets** are `sections.json` rectangles (`x,y,width,height` in page space) of the **full-page** capture `case-study/archive/<V>/surfaces/<SURFACE>-<device>.png`. `CameraShot.tsx` fits a target with `scale = min(1920/(w+2·pad), 1080/(h+2·pad))`, pad = 48 px page-space, and clamps so the image never shows its edge. `-first-screen.png` is only used when no target is given (thumbnails).
7. **Determinism.** No `Math.random`; constellation layout is a seeded force layout (`random(nodeId)` from `remotion`) frozen at frame 0 and only *interpolated* afterward. Every animation is a pure function of `frame`.
8. **Memory rail** (§29) is persistent from 5.0 s to the end; it never explains itself. Items are added at scene starts (schedule in §5). The audience must perceive accumulation before any narration explains it.
9. **Scores are auxiliary** (§30): never more than three numerals visible at once; every score is shown next to the actual screenshot it was measured on.

Easing vocabulary used below:
- `decel` = `Easing.bezier(0.2, 0, 0, 1)` (enter / camera arrive)
- `accel` = `Easing.bezier(0.4, 0, 1, 1)` (exit)
- `spring-flat` = `spring({fps, frame, config:{damping:200, stiffness:120, mass:1}})` — no overshoot, used for all camera moves
- `spring-pop` = `spring({fps, frame, config:{damping:14, stiffness:180}})` — small overshoot, used only for rail items and score digits
- `cut` = hard cut on the frame; `x-fade N` = cross-fade over N frames (TransitionSeries `fade`)

---

## 1. Master timeline (108 s)

§33 gives a 120 s beat sheet; every boundary is multiplied by 0.9 and lands on a frame boundary.

| # | Beat | §33 (120 s) | Master (108 s) | Frames | Rail state at start | Constellation at end |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hook | 0–8 | **0.0–7.2** | 0–216 | (hidden → empty at 5.0) | nodes only; 6-frame ghost of all verified edges |
| 2 | Repetition | 8–20 | **7.2–18.0** | 216–540 | + Interface | nodes only (constellation parked top-right, small) |
| 3 | Extraction | 20–32 | **18.0–28.8** | 540–864 | + Pattern | chain E49→E50→E51→E52→E53→E54 |
| 4 | Atomic AI Design | 32–45 | **28.8–40.5** | 864–1215 | + Component | + all `created` edges |
| 5 | Network | 45–60 | **40.5–54.0** | 1215–1620 | (no addition; Component pulses on each transfer) | + migrated, reused, informed, third-party edges |
| 6 | Audit | 60–78 | **54.0–70.2** | 1620–2106 | + Audit (54.0), + Eval (63.0) | + audit / eval-created / promoted-by-eval edges |
| 7 | Learning Yield | 78–94 | **70.2–84.6** | 2106–2538 | + Skill (74.0), + Agent (79.0) | + failure, promoted, superseded edges |
| 8 | Compound Design / Work System | 94–108 | **84.6–97.2** | 2538–2916 | + Work System (84.6); morph to final rail (93.5) | all verified edges, converging |
| 9 | Finale | 108–120 | **97.2–108.0** | 2916–3240 | Frame Model Build Verify Polish Compound | all verified edges, dim → lit |

---

## 2. Master — shot by shot

Each block: **timecode · shot id** — visual · on-screen text (keys) · sources (`milestone · file · section_key`) · rail · constellation · motion · data.

### Beat 1 · Hook · 0.0–7.2 s

**0.0–2.4 · MS-01** — Black. `Statement` sets `T.hook.1` (“I built {N} tools with AI this year.”) centred, one line, letter-spacing animates from +0.04em to 0 over 18 f (`decel`). `{N}` is a `ScoreReveal`-style digit that resolves from `tools.stated_count_in_brief` (counter runs 0→N over 12 f, `spring-pop`).
Sources: none. Rail: hidden. Constellation: hidden.
Data: `tools.stated_count_in_brief`.

**2.4–5.0 · MS-02** — `T.hook.1` shrinks to the top-left (scale 0.42, `spring-flat`, 20 f). `ToolConstellation` enters: `tools.stated_count_in_brief` nodes appear one per 3 f in `tools.tools[].id` order, each `spring-pop`. The 7 nodes that have a captured milestone get a hero thumbnail fill (match `milestones[*].tool_ids` → first milestone of that tool); the rest are hollow rings, unlabeled. `T.hook.2` (“They did not become a portfolio.”) fades in at 3.6 s below the field.
Sources (thumbnail fills, `ENTRY:desktop/hero`): V01, V02, V03, V05, V06, V07, V11.
Rail: hidden. Constellation: nodes only, no edges.
Data: `tools.stated_count_in_brief`, `tools.tools[].id`, `tools.tools[].confidence`, `transfer-graph.nodes[type=tool].label`.

**5.0–7.2 · MS-03** — `T.hook.2` → `T.hook.3` (“They became a system.”) by x-fade 10 f. On the word *system* (5.6 s) every `verified:true` edge flashes as a ghost for **6 frames** (opacity 0→0.35→0, `accel`), then disappears — foreshadow, not reveal. At 5.0 s the **Memory Rail** appears, empty: eight dim slots along the bottom edge (height 56 px, `decel` 16 f). **Caption `L.tools.caption`** — `candidates: {tools.tool_candidates}, verified: {tools.verified_by_repository}` — typesets in the small mono style under the headline from 5.2 s and stays until the cut at 7.2 s. **This is its only appearance in the master.**
Sources: same seven thumbnails. Rail: empty (visible). Constellation: nodes; ghost of all verified edges 6 f.
Data: `tools.tool_candidates`, `tools.verified_by_repository`, `transfer-graph.edges[verified=true].id`.

### Beat 2 · Repetition · 7.2–18.0 s  (interface match cuts)

Camera language: every cut in this beat is a **match cut on the same `sections.json` key**, aligned so the target rectangle lands on the same screen rectangle (top-third band, 1400×300 for nav; centre 1500×640 for hero; centre 560×160 for primary_action). Each image holds ~0.5 s, no motion inside the hold except a 2 % slow push (`interpolate(frame,[0,15],[1,1.02])`). The constellation parks top-right at 22 % scale; the node whose milestone is on screen lights up (a 1-frame-lag pulse), so the audience sees *which* product they're looking at without a label.

**7.2–10.8 · MS-04** — **nav → nav → nav**, 7 cuts × 15 f = 3.5 s: V01 → V02 → V03 → V04 → V05 → V06 → V07 (`ENTRY:desktop/nav`). Text: `T.pattern.1` (“Different products.”) at 7.2 s, `T.pattern.2` (“Same mistakes.”) at 9.0 s, both lower-left, 64 px. Label lower-right (mono, 22 px): `L.persistent[0]` = `{design-scores.delta.most_persistent_failures[0].id} · fails {…[0].fails} of {…[0].of}` — the audit item that fails most often across milestones, i.e. the *same mistake*, read from data.
Rail: **+ Interface** at 7.2 s (`spring-pop`, slot 1 lights). Constellation: nodes only.
Data: `design-scores.delta.most_persistent_failures[0].{id,fails,of}`, `milestones[*].name` (tooltip-sized caption under each cut, 18 px).

**10.8–14.4 · MS-05** — **hero → hero**, 6 cuts × 18 f: V01 → V02 → V03 → V05 → V06 → V11 (`ENTRY:desktop/hero`). Text: `T.pattern.3` / `T.pattern.4` (“Different products.” / “Same decisions.”). Label: `L.persistent[1]`.
Rail: Interface. Data: `design-scores.delta.most_persistent_failures[1].{id,fails,of}`, `milestones[*].name`.

**14.4–16.4 · MS-06** — **primary_action → primary_action**, 5 cuts × 12 f: V03 → V04 → V05 → V06 → V11 (`ENTRY:desktop/primary_action`; the camera crops tight, 560×160 band, so the CTA buttons of five different products sit in the same pixels). Text: `T.pattern.5` / `T.pattern.6` (“Different products.” / “Same knowledge.”). Label: `L.persistent[2]`.
Data: `design-scores.delta.most_persistent_failures[2].{id,fails,of}`.

**16.4–18.0 · MS-07** — Cut to a **contact grid** of all 11 `ENTRY:desktop/hero` targets (V01…V11, 4×3, last cell empty), each tile desaturated 60 %. `T.problem.1` (“The output was compounding.”) at 16.4 s; `T.problem.2` (“The knowledge wasn't.”) at 17.2 s, both centred over the grid on a 40 % scrim. Beneath every tile a 4 px bar whose length is `design-scores.milestones[V].counts.FAIL` normalised to the max — no numerals, just the visual fact that every product has failures.
Rail: Interface. Data: `milestones.milestone_count`, `design-scores.milestones[*].counts.FAIL`.

### Beat 3 · Extraction · 18.0–28.8 s  (finding → rule → resource)

This beat films **one real chain**, `transfer-graph.end_to_end_chains[0]` (`fully_verified: true`): a site-check failure on the product-experience site → ledger entry → solution doc → rule → reused by the check → discoverable via the contract. It is the only chain in the graph that is verified end-to-end *and* whose interface was captured (V11), so it is the one the film uses.

**18.0–21.6 · MS-08** — x-fade 12 f from the grid into **V11 `ENTRY:desktop/hero`** at 100 %, camera slowly pushing (1.00 → 1.06 over 108 f, `decel`). A `Finding` card slides in from the right (`spring-flat`, 20 f) typesetting `L.node.label[res-site-check]` and, below it, `L.node.label[res-ledger-013]` with the edge type `L.edge.type[E50]` (“failure”) between them. `T.turn.1` (“I stopped keeping good decisions in my head.”) lower-left at 18.6 s.
Rail: **+ Pattern** at 18.0 s. Constellation (now at 30 % scale, docked right): edge **E49** draws (tool-24 → res-site-check, 20 f), then **E50** draws in the failure colour.
Data: `transfer-graph.nodes[res-site-check].label`, `transfer-graph.nodes[res-ledger-013].label`, `transfer-graph.edges[E50].type`, `milestones[V11].name`.

**21.6–25.2 · MS-09** — Match cut to **V11 `DETAIL:desktop/hero`** (the `/resources/cd-interface-review` page: a resource, on screen). Card extends downward: `L.edge.type[E51]` → `L.node.label[res-solution-axe]` → `L.edge.type[E52]` → `L.node.label[res-site-check-wait-rule]`. Each row enters 8 f apart. `T.turn.2` (“I started encoding them.”) replaces `T.turn.1` at 22.0 s (x-fade 8 f).
Constellation: **E51, E52** draw (promoted colour).
Data: `transfer-graph.edges[E51].type`, `[E52].type`, `nodes[res-solution-axe].label`, `nodes[res-site-check-wait-rule].label`.

**25.2–28.8 · MS-10** — Camera pans down the V11 `/resources` page to **`DISCOVERY:desktop/section:The loop, in order`** (`spring-flat`, 30 f). The card closes the loop: `L.edge.type[E53]` (“reused”) arrow back to the top row; `L.edge.type[E54]` from the contract. Title of the card = `L.chain[0].name` (the chain's own name from the graph, 20 px mono, wraps to three lines). Along the bottom, above the rail, a **type ledger** appears: for each `transfer-graph.nodes[].type` present (`resource, eval, skill, agent, component, rule, contract, registry`) a small tag with its count `L.node.type.count[type]` — data-driven and the bridge into the next beat.
Constellation: **E53, E54** draw; the chain is now a closed shape.
Data: `transfer-graph.edges[E53].type`, `[E54].type`, `end_to_end_chains[0].{name,fully_verified}`, `nodes[].type`.

### Beat 4 · Atomic AI Design · 28.8–40.5 s

**28.8–32.4 · MS-11** — Three **component-level** targets, each a camera push-in from full page to target (`spring-flat`, 24 f) then a 12 f hold: V03 `DETAIL:desktop/section:div-0` (glass component doc) → V06 `DETAIL:desktop/section:div-0` (button doc) → V05 `DETAIL:desktop/form` (centred signup form). `T.atomic.1` (“What if the atomic unit was not only UI?”) centred top, 56 px, enters on the first push. Caption under each: `milestones[V].name`.
Rail: **+ Component** at 28.8 s. Constellation: unchanged (chain).
Data: `milestones[V03|V06|V05].name`.

**32.4–36.6 · MS-12** — Background: V02 `DETAIL:desktop/section:div-1` (themes gallery — tokens applied live), blurred 12 px, 40 % opacity. Foreground: `AtomicLayer` — a stack of horizontal slabs, one per node type in the graph, in this order from bottom: `component` · `resource` (patterns, rules, frames, plans) · `rule` · `contract` · `eval` · `skill` · `agent` · `registry`. Each slab enters from below (`spring-pop`, 6 f apart) and shows its type name + `L.node.type.count[type]`. `T.atomic.2` (“What if knowledge itself was composable?”) at 34.0 s.
Data: `transfer-graph.nodes[].type` (counts computed at render).

**36.6–40.5 · MS-13** — The slabs compress into a single tile (`spring-flat`, 20 f) and fly into the constellation, which grows to 60 % scale centre-right. All `transfer-graph.edges[type=created]` (verified) draw outward from their tool nodes, 3 f apart, in `id` order — the moment each product's resources are visibly *created*. Background camera: V09 `INTERACTION:desktop/section:aside-0` (playground controls) → x-fade 12 f → V04 `DISCOVERY:desktop/section:div-0` (gallery grid), both at 35 % opacity. Label `L.edge.type[created]` sits by the edge legend (the word “created” is the edge type string).
Data: `transfer-graph.edges[type=created].id`.

### Beat 5 · Network · 40.5–54.0 s  (resources transfer between tools)

`ResourceTransfer.tsx`: a small tile travels along an edge path (`interpolate` over 30 f, `decel`), leaving the edge lit behind it. The screenshot pair for each transfer is shown split-screen, source left, destination right, 46 % width each, with the edge drawn *across the gap* between them.

**40.5–45.0 · MS-14** — `T.compound.1` (“Products generate knowledge.”). Left: V05 `ENTRY:desktop/hero` (supernova-catalogo, tool-20). Right: V08 `ENTRY:desktop/hero` (compoundmetrics v0.2.1). Transfer: **E23** (`created`, tool-20 → res-cd-framework-v02) then **E31** (`migrated` → tool-24); the tile is labelled `L.node.label[res-cd-framework-v02]`. Date captions under each half: `milestones[V05].date_range`, `milestones[V08].date_range`. Also drawn (no tile): E32–E37, the other migrated resources.
Rail: Component pulses on tile arrival. Data: `transfer-graph.edges[E23|E31].type`, `nodes[res-cd-framework-v02].label`, `milestones[V05|V08].date_range`.

**45.0–49.5 · MS-15** — `T.compound.2` (“Knowledge becomes capability.”). Left: V09 `DETAIL:desktop/hero` (`/compound-design` inside studio-dev-ui). Right: V08 `ENTRY:desktop/hero`. These are the **same page** in two products; the film proves it by sliding the left image over the right (`interpolate` 30 f) and typesetting `L.identical` = `ahash Δ {milestones.merge_evaluation.pairs[V08,V09].ahash_hamming} bits`. Transfers: **E19** (reused) → **E17** (created) → **E20** (migrated). Then **E38, E39, E40, E78** draw (framework → skills, pack → candidate lane).
Data: `milestones.merge_evaluation.pairs[V08,V09].ahash_hamming`, `transfer-graph.edges[E19|E17|E20|E38].type`.

**49.5–54.0 · MS-16** — `T.compound.3` (“Capability improves the next product.”). Three-way: V07 `ENTRY:desktop/hero` · V06 `ENTRY:desktop/hero` · V11 `ENTRY:desktop/hero`, in a 3-up (30 % each). An external node `L.node.label[ext-lifeline]` appears above them; **E56/E57, E58/E59, E60/E61** draw to the three products. **E62 (processo → compoundmetrics) is not drawn** — it is unverified. All remaining verified `informed` and third-party `reused` edges draw softly (E05, E06, E11, E12, E21, E22, E24–E27, E18, E63–E69, E84, E85). Bottom-right label `L.graph.counts` = `edges verified {transfer-graph.counts.verified_edges} of {transfer-graph.counts.edges}` (mono 22 px, stays through the Audit beat).
Data: `transfer-graph.nodes[ext-lifeline].label`, `transfer-graph.counts.{verified_edges,edges,unverified_edges}`.

### Beat 6 · Audit · 54.0–70.2 s

**54.0–58.0 · MS-17** — `T.audit.1` (“The system does not only build interfaces.”). Cut to **V01 `INTERACTION:desktop/hero`** — the `/audit` page of the first Compound artifact, i.e. the instrument itself — then camera pans down (`spring-flat`, 36 f) to **`INTERACTION:desktop/section:Progresso da auditoria`**. Header label `L.score.label` = `design-scores.label`; footnote `L.rubric.sha` = first 8 chars of `design-scores.rubric_sha256` + `design-scores.meaning` in 18 px (this is what keeps “score” honest: it is performance against a frozen ruler, not universal quality).
Rail: **+ Audit** at 54.0 s. Constellation: **E02, E07** (audit page → frozen rubric, `eval-created`), **E04, E08** draw.
Data: `design-scores.label`, `design-scores.rubric_sha256`, `design-scores.meaning`, `transfer-graph.nodes[res-cld-audit-page].label`.

**58.0–63.0 · MS-18** — `T.audit.2` (“It inspects what it built.”) then three **`ScoreReveal`** cards, 1.6 s each, x-fade 6 f, in the §30 layout — tool id / score label / score / “Coverage” / coverage — each over the milestone's `ENTRY:desktop/hero` at 100 % so the design being scored is on screen:
- V04 — `design-scores.milestones[V04].tool_ids[0]` · `…[V04].score` · `…[V04].coverage`
- V06 — same fields for V06
- V11 — same fields for V11
Digits count up over 14 f (`spring-pop`); never more than one card visible.
Data: as listed (`score`, `coverage`, `tool_ids` per milestone).

**63.0–67.0 · MS-19** — **Delta pair**, §30 second layout (`+N / −N` per category, three rows max, sign and colour from the data). 63.0–65.5: `L.delta.improvement` — match cut V09 `ENTRY:desktop/hero` → V10 `ENTRY:desktop/hero` (the pair `design-scores.delta.biggest_improvement.from → .to`), rows = the three entries of `.category_delta` with largest |value|, header `.score_delta`, footnote `same_tool` rendered as the word from the data. 65.5–67.0: `L.delta.regression` — V08 `ENTRY:desktop/section:section-2` → V09 `DISCOVERY:desktop/hero` (the regression pair `biggest_regression.from → .to`; the regression lives in V09's own gallery surfaces, which is why DISCOVERY is the destination). Honesty: the film shows the regression at equal size to the improvement.
Rail: **+ Eval** at 63.0 s. Constellation: **E79** (tool-24 → v0.3 contract eval, `eval-created`) and the nine **E80-*** `promoted` edges fan out.
Data: `design-scores.delta.biggest_improvement.{from,to,score_delta,category_delta,same_tool}`, `design-scores.delta.biggest_regression.{from,to,score_delta,category_delta}`.

**67.0–70.2 · MS-20** — **Trend strip**: the 11 `ENTRY:desktop/hero` targets as a horizontal filmstrip (each 160×90) in `design-scores.chronological_trend[].milestone` order; above it two thin polylines — `score` and `coverage` per milestone — drawn left-to-right over 60 f. Only two numerals: `L.first_vs_last` = `design-scores.delta.first_vs_last.score_delta` with its `from → to`, and the persistent-failure ids `L.persistent[0..2]` as tags. Footnote 16 px: `L.avg_note` = `design-scores.average_note` (V10 excluded from the independent average — say so on screen, in the data's own words).
Data: `design-scores.chronological_trend[].{milestone,score,coverage}`, `design-scores.delta.first_vs_last.{from,to,score_delta}`, `design-scores.delta.most_persistent_failures[0..2].id`, `design-scores.average_note`.

### Beat 7 · Learning Yield · 70.2–84.6 s

**70.2–74.0 · MS-21** — `T.audit.3` (“It does not only fix failures.”) at 70.2, `T.audit.4` (“It decides which failures deserve to become knowledge.”) at 72.0. Background: V11 `INTERACTION:desktop/section:The Lab`. Two counters, 96 px, side by side: `L.yield.findings` and `L.yield.meaningful_failures` (the second is much smaller than the first — that gap *is* the decision). Constellation: the five **failure** edges (E41, E42, E44, E45, E50) pulse red-orange, 2 pulses of 12 f.
Data: `learning-yield.findings`, `learning-yield.meaningful_failures`, `learning-yield.sources.{findings,ledger}` (provenance line in 16 px).

**74.0–79.0 · MS-22** — **Yield ladder** (§31 layout, seven rows, one row per 18 f, `spring-pop`), right-aligned numerals, over V11 `INTERACTION:desktop/hero` dimmed 70 %:
`products` · `findings` · `meaningful failures` · `durable learnings` · `resource candidates` · `evals` · `skills improved`
Every numeral is `learning-yield.<field>`. **The example numbers in PRD §31 are never used**; if `learning-yield.json` is absent the composition throws at render (`data/learning-yield.ts` has no default).
Rail: **+ Skill** at 74.0 s. Data: `learning-yield.{products,findings,meaningful_failures,durable_learnings,resource_candidates,evals,skills_improved}`.

**79.0–84.6 · MS-23** — The ladder collapses into the chain **Finding → Correction → Durable Learning → Resource Candidate → Future Capability** rendered with the *actual* node labels of `transfer-graph.end_to_end_chains[0]` (ledger 013 → solution doc → wait rule → site-check), titled `L.chain[0].name`. Then the `promoted` edges (E43, E51, E52, E80-*) light in the promoted colour and the five `superseded` edges (E70–E74) fade the v0.2 agents out while the v0.3 agents (`transfer-graph.nodes[type=agent]` with the newer version in their label) light up. Background: V11 `DETAIL:desktop/hero` (the promoted skill's own page). Footnote 16 px: `transfer-graph.end_to_end_chains[0].note` first sentence — the caveat that reuse in a *later tool* is not shown. The film keeps the caveat.
Rail: **+ Agent** at 79.0 s. Data: `end_to_end_chains[0].{edges,note}`, `edges[type=promoted].id`, `edges[type=superseded].id`, `nodes[type=agent].label`.

### Beat 8 · Compound Design / Work System · 84.6–97.2 s

**84.6–89.0 · MS-24** — Cut to **V10 `ENTRY:desktop/hero`** (v0.3.0-alpha.1 Work System, production) full-frame, 1.00→1.04 push. Its title is typeset from data: `L.entry_title[V10]` = `milestones[V10].entry_title`. The constellation, now full-screen at 30 % opacity behind the screenshot, **converges**: every verified edge is lit; nodes interpolate 40 % of the way toward the centroid (`spring-flat`, 90 f); the name `L.entry_title[V11]` = `milestones[V11].entry_title` (“Compound Design”) fades in at the centroid at 87.0 s — the system's name as recorded, not typed. `L.graph.counts` stays bottom-right.
Rail: **+ Work System** at 84.6 s (slot 8 — the rail is full).
Data: `milestones[V10|V11].entry_title`, `transfer-graph.counts.{verified_edges,edges}`.

**89.0–93.5 · MS-25** — Camera on **V11 `DISCOVERY:desktop/section:The loop, in order`** panning left→right along the loop (`spring-flat`, 90 f), then x-fade 12 f to **V11 `ENTRY:desktop/hero`**. Over it, the list of skill nodes `L.node.type.list[skill]` = `transfer-graph.nodes[type=skill].label`, one per 4 f, mono 20 px, left column (these are the real cd-* skills of v0.3).
Data: `transfer-graph.nodes[type=skill].label`, `milestones[V11].{name,date_range}`.

**93.5–97.2 · MS-26** — **Rail morph.** The eight rail words (Interface … Work System) collapse leftward into a single lit bar (30 f, `accel`), then the bar splits into the six final words **Frame · Model · Build · Verify · Polish · Compound** (`spring-pop`, 5 f apart). The six words come from `storyboard.RAIL_FINAL` (PRD §29 verbatim). Note for the author: `Frame, Model, Build, Verify, Compound` each have a skill node in `transfer-graph.json` (`res-cd-frame` … `res-cd-compound`) and the film draws a hairline from each word to its node; **`Polish` has no node in the graph** — it is drawn without a hairline. Camera: V11 `ENTRY:desktop/hero` pulling back to the full page, ending on `ENTRY:desktop/footer`.
Rail: → **Frame Model Build Verify Polish Compound**. Constellation: all verified edges.
Data: `storyboard.RAIL_FINAL`, `transfer-graph.nodes[res-cd-frame|res-cd-model|res-cd-build|res-cd-verify|res-cd-compound].label`.

### Beat 9 · Finale · 97.2–108.0 s

**97.2–101.0 · MS-27** — All 11 `ENTRY:desktop/hero` targets drift slowly as a dim (25 %) mosaic behind a 60 % scrim. `T.finale.1` (“I thought I was building products with AI.”) centred, 64 px, `decel` 18 f. Constellation dimmed to 15 %.
Data: `milestones[*].id` (mosaic order).

**101.0–104.5 · MS-28** — Mosaic fades out; constellation returns to 100 % with all verified edges; `T.finale.2` (“I was actually building a way to build.”) replaces `T.finale.1` (x-fade 10 f).

**104.5–108.0 · MS-29** — `T.finale.3` (“Build the application.”) and `T.finale.4` (“Improve the system that builds the next one.”) stacked, 48 px. Bottom **evidence line** `L.evidence`, mono 16 px, one row: `milestones {milestones.milestone_count}` · `edges {transfer-graph.counts.verified_edges}/{transfer-graph.counts.edges} verified` · `rubric {design-scores.rubric_sha256[0:8]}` · `data {design-scores.generated_at}`. Fade to black 107.2–108.0 (24 f, `accel`). Rail holds final words until the fade.
Data: `milestones.milestone_count`, `transfer-graph.counts.{verified_edges,edges}`, `design-scores.rubric_sha256`, `design-scores.generated_at`, `transfer-graph.generated_at`, `tools.generated_at`.

---

## 3. Vertical variant · 9:16 · 54 s (1080×1920)

Same nine beats scaled ×0.45 from §33 (boundaries on frame lines): Hook 0–3.6 · Repetition 3.6–9.0 · Extraction 9.0–14.4 · Atomic 14.4–20.2 · Network 20.2–27.0 · Audit 27.0–35.1 · Learning Yield 35.1–42.3 · Work System 42.3–48.6 · Finale 48.6–54.0.

Layout changes only (all rules of §0 apply):
- **Mobile captures**: every source is `<SURFACE>-mobile.png` with `<SURFACE>:mobile/<key>` targets (all keys used were verified to exist; e.g. `ENTRY:mobile/nav`, `ENTRY:mobile/hero`, `DETAIL:mobile/form`, `INTERACTION:mobile/section:The Lab`, `INTERACTION:mobile/section:Progresso da auditoria`, `DISCOVERY:mobile/section:The loop, in order`).
- **Phone frame** instead of `BrowserFrame`: 390-wide device outline, screenshots at 2× (V06 mobile is 436 px wide — `CameraShot` fits by width, no special case).
- **Memory rail** moves to the **top** as a single row of 8 dots with the current word only; the final six words render as two rows of three.
- **Constellation** occupies the lower third (below the phone) at all times; split-screens of the Network beat become **stacked** (source above, destination below) with the edge drawn vertically.
- **Text** is 44 px, max two lines, always in the middle band between phone and constellation.
- `L.tools.caption` appears once, in VT-02 (2.0–3.6 s).

| Shot | Time | Scene | Content (sources are mobile) | Rail |
| --- | --- | --- | --- | --- |
| VT-01 | 0.0–2.0 | Hook | `T.hook.1` with `tools.stated_count_in_brief` | hidden |
| VT-02 | 2.0–3.6 | Hook | nodes with mobile hero fills V01 V02 V03 V05 V06 V07 V11 · `T.hook.3` · **`L.tools.caption`** | empty |
| VT-03 | 3.6–6.3 | Repetition | nav match cuts V01→V07 (7 × ~11 f) · `T.pattern.1/2` · `L.persistent[0]` | Interface |
| VT-04 | 6.3–9.0 | Repetition | hero match cuts V01 V02 V03 V05 V06 V11 · `T.pattern.3/4` then `T.problem.1/2` | Interface |
| VT-05 | 9.0–11.7 | Extraction | V11 ENTRY hero + finding card (res-ledger-013, E50) · `T.turn.1` | + Pattern |
| VT-06 | 11.7–14.4 | Extraction | V11 DISCOVERY “The loop, in order” · E51 E52 E53 types · `T.turn.2` | Pattern |
| VT-07 | 14.4–17.3 | Atomic | V03 DETAIL div-0 → V06 DETAIL div-0 → V05 DETAIL form · `T.atomic.1` | + Component |
| VT-08 | 17.3–20.2 | Atomic | V02 DETAIL div-1 blurred + AtomicLayer type counts · `T.atomic.2` · created edges | Component |
| VT-09 | 20.2–23.6 | Network | V05 hero over V08 hero, E23→E31 tile · `T.compound.1/2` | Component (pulse) |
| VT-10 | 23.6–27.0 | Network | V07 · V06 · V11 heroes, Lifeline fan (E56–E61), `L.graph.counts` · `T.compound.3` | Component |
| VT-11 | 27.0–30.0 | Audit | V01 INTERACTION hero → “Progresso da auditoria” · `T.audit.1` · `L.score.label` | + Audit |
| VT-12 | 30.0–33.0 | Audit | ScoreReveal V04 then V11 (mobile heroes) · `T.audit.2` | Audit |
| VT-13 | 33.0–35.1 | Audit | improvement pair V09→V10 category deltas · `L.first_vs_last` | + Eval |
| VT-14 | 35.1–38.7 | Yield | V11 INTERACTION “The Lab” · `T.audit.3/4` · findings vs meaningful failures | Eval |
| VT-15 | 38.7–42.3 | Yield | yield ladder (7 rows) over V11 INTERACTION hero | + Skill, + Agent |
| VT-16 | 42.3–45.5 | Work System | V10 ENTRY hero · `L.entry_title[V10]` · constellation converges | + Work System |
| VT-17 | 45.5–48.6 | Work System | V11 ENTRY hero · rail morph → final six words | Frame … Compound |
| VT-18 | 48.6–51.3 | Finale | dim mosaic of 11 mobile heroes · `T.finale.1` | final |
| VT-19 | 51.3–54.0 | Finale | `T.finale.2`, `T.finale.3/4` stacked · `L.evidence` · fade | final |

Dropped from the master for time: MS-06 (primary_action run), MS-10's type ledger (merged into VT-08), MS-19's regression pair (VT-13 shows only the improvement — **and therefore VT-13 must carry the footnote `design-scores.delta.biggest_regression.{from,to}` in 14 px** so the cut does not hide the regression), MS-20 trend strip, MS-23 chain/superseded (agents appear directly in VT-15), MS-25 skill list.

---

## 4. Teaser · 16:9 · 15 s (450 frames) — cut list

| Shot | Time | Cut | Text | Data | Rail |
| --- | --- | --- | --- | --- | --- |
| TZ-01 | 0.0–1.5 | black → `T.hook.1` | `T.hook.1` | `tools.stated_count_in_brief` | hidden |
| TZ-02 | 1.5–4.5 | **nav match cuts** V01 V02 V03 V05 V06 V07 (6 × 15 f) | `T.pattern.1` at 1.5, `T.pattern.2` at 3.0 | `design-scores.delta.most_persistent_failures[0].id` (tag) | Interface |
| TZ-03 | 4.5–6.5 | **hero match cuts** V04 V08 V11 (3 × 20 f) | `T.pattern.3` / `T.pattern.4` | — | Interface, Pattern |
| TZ-04 | 6.5–9.0 | V11 ENTRY hero + one ScoreReveal | `T.audit.2` · `L.score[V11]` · `L.coverage[V11]` | `design-scores.milestones[V11].{score,coverage}`, `design-scores.label` | … Audit, Eval (rail fills fast, 4 f apart) |
| TZ-05 | 9.0–12.0 | V10 ENTRY hero behind converging constellation, all verified edges | `T.compound.1/2/3` (one per 30 f) · `L.entry_title[V11]` | `transfer-graph.counts.verified_edges`, `milestones[V11].entry_title` | full (8) |
| TZ-06 | 12.0–15.0 | constellation alone → fade | `T.finale.2` · **`L.tools.caption`** (once) | `tools.tool_candidates`, `tools.verified_by_repository` | Frame … Compound |

The teaser has no audit-delta, no yield ladder (numbers it cannot contextualise in 15 s are not shown), and it still carries the tools caption once.

---

## 5. Memory rail schedule (master)

| Time (s) | Frame | Rail |
| --- | --- | --- |
| 5.0 | 150 | ∅ (eight empty slots appear) |
| 7.2 | 216 | Interface |
| 18.0 | 540 | Interface · Pattern |
| 28.8 | 864 | Interface · Pattern · Component |
| 54.0 | 1620 | … · Audit |
| 63.0 | 1890 | … · Eval |
| 74.0 | 2220 | … · Skill |
| 79.0 | 2370 | … · Agent |
| 84.6 | 2538 | … · Work System |
| 93.5 | 2805 | **Frame · Model · Build · Verify · Polish · Compound** (holds to 108.0) |

Motion: each addition `spring-pop` scale 0.6→1 plus a 1 px underline that extends left-to-right over 10 f; previous items dim to 70 %. The rail is 56 px tall, bottom-anchored, 24 px inset; never overlaps text (text safe area ends 96 px above the bottom).

## 6. Constellation state (master)

| Beat | Nodes | Edges visible (all `verified:true`) |
| --- | --- | --- |
| Hook | `tools.stated_count_in_brief` nodes (7 with hero fills, rest hollow) | none; 6-frame ghost of all verified edges at 5.6 s |
| Repetition | same, parked top-right 22 % | none |
| Extraction | + resource nodes of chain 0 | E49 E50 E51 E52 E53 E54 |
| Atomic | + all resource nodes that have a `created` edge | + E01 E02 E03 E13 E14 E15 E16 E17 E23 E28 E29 E30 E57 E59 E81 E82 E83 E86 |
| Network | + external nodes (ext-*) and third-party resources | + E31–E37 E19 E20 E38 E39 E40 E78 E56 E58 E60 E61 E05 E06 E11 E12 E18 E21 E22 E24–E27 E63 E64-* E65–E69 E84 E85 |
| Audit | + eval nodes | + E04 E07 E08 E79 E80-* |
| Learning Yield | + ledger / solution / rule nodes, agents | + E41 E42 E44 E45 E43 E70–E74 (superseded fade the v0.2 agents) |
| Work System / Finale | all | all 97 verified edges; nodes converge 40 % toward centroid |

Never drawn: E09 E10 E55 E62 E87 E88 E89 E90 (`verified:false`).

Edge colours by `type`: created (neutral), reused / migrated (accent), informed (thin, dotted), failure (warm), promoted / eval-created (bright accent), superseded (fades the source node).

## 7. Text registry (`data/storyboard.ts`)

All `T.*` strings are the §26 phrases verbatim. `{N}` in `T.hook.1` is substituted at render from `tools.stated_count_in_brief`.

| Key | Phrase |
| --- | --- |
| T.hook.1 | I built {N} tools with AI this year. |
| T.hook.2 | They did not become a portfolio. |
| T.hook.3 | They became a system. |
| T.problem.1 | The output was compounding. |
| T.problem.2 | The knowledge wasn't. |
| T.pattern.1 / .3 / .5 | Different products. |
| T.pattern.2 | Same mistakes. |
| T.pattern.4 | Same decisions. |
| T.pattern.6 | Same knowledge. |
| T.turn.1 | I stopped keeping good decisions in my head. |
| T.turn.2 | I started encoding them. |
| T.atomic.1 | What if the atomic unit was not only UI? |
| T.atomic.2 | What if knowledge itself was composable? |
| T.compound.1 | Products generate knowledge. |
| T.compound.2 | Knowledge becomes capability. |
| T.compound.3 | Capability improves the next product. |
| T.audit.1 | The system does not only build interfaces. |
| T.audit.2 | It inspects what it built. |
| T.audit.3 | It does not only fix failures. |
| T.audit.4 | It decides which failures deserve to become knowledge. |
| T.finale.1 | I thought I was building products with AI. |
| T.finale.2 | I was actually building a way to build. |
| T.finale.3 | Build the application. |
| T.finale.4 | Improve the system that builds the next one. |

`L.*` labels (all characters from data): `L.tools.caption` · `L.persistent[i]` · `L.score[V]` · `L.coverage[V]` · `L.score.label` · `L.rubric.sha` · `L.delta.improvement` · `L.delta.regression` · `L.trend` · `L.first_vs_last` · `L.avg_note` · `L.edge.type[E|type]` · `L.node.label[id]` · `L.node.type.count[type]` · `L.node.type.list[type]` · `L.chain[0].name` · `L.graph.counts` · `L.identical` · `L.entry_title[V]` · `L.yield.products` · `L.yield.findings` · `L.yield.meaningful_failures` · `L.yield.durable_learnings` · `L.yield.resource_candidates` · `L.yield.evals` · `L.yield.skills_improved` · `L.rail.final` · `L.evidence`.

## 8. Data sources (§32) — what each JSON is and where it comes from

| File (`case-study/video/public/data/`) | Produced from | Fields the film reads |
| --- | --- | --- |
| `tools.json` | copy of `case-study/history/TOOLS-MANIFEST.json` | `stated_count_in_brief`, `tool_candidates`, `verified_by_repository`, `reconciliation`, `tools[].{id,name,confidence,privacy}`, `generated_at` |
| `design-scores.json` | copy of `case-study/design-benchmark/SUMMARY.json` | `label`, `meaning`, `formula`, `rubric_sha256`, `generated_at`, `average_note`, `milestones[].{milestone,tool_ids,score,coverage,counts,categories}`, `chronological_trend[]`, `delta.{first_vs_last,biggest_improvement,biggest_regression,most_persistent_failures,pairs}` |
| `transfer-graph.json` | copy of `case-study/knowledge/TRANSFER-GRAPH.json` | `nodes[].{id,type,label}`, `edges[].{id,from,to,type,verified}`, `end_to_end_chains[]`, `counts`, `generated_at` |
| `learning-yield.json` | **to be generated** by `case-study/scripts/learning-yield.mjs` (not written yet) from `design-benchmark/reports/FINDINGS.json` (`count` → `findings`), `compound-design/learning/LEDGER.md` (entries → `meaningful_failures`; entries with `candidate_eval: yes` → `evals`), `TRANSFER-GRAPH.json` (`edges[type=promoted]` → `durable_learnings`; nodes of type `resource` reached by a `promoted` edge → `resource_candidates`; `edges[type=superseded]` targets of type `skill` → `skills_improved`), `TOOLS-MANIFEST.json` (`verified_by_repository` → `products`). Schema: `{ generated_at, products, findings, meaningful_failures, durable_learnings, resource_candidates, evals, skills_improved, sources:{findings,ledger,graph,tools} }`. Until it exists the Learning Yield scenes **fail the render** rather than show the §31 examples. |
| `milestones.ts` | copy of `case-study/history/DESIGN-MILESTONES.json` | `milestone_count`, `milestones[].{id,tool_ids,name,date_range,entry_title,surfaces}`, `merge_evaluation.pairs[]` |

`storyboard.ts` holds only: the timeline table of §1, the `T.*` registry, `RAIL` and `RAIL_FINAL` (PRD §29), easing constants. It holds **no numerals that describe the data**.

## 9. Rendering notes for the Remotion build (§27)

- Consult current Remotion docs (Context7) for `TransitionSeries`, `spring`, `interpolate`, `Img`, `staticFile`, `calculateMetadata` before implementing; do not rely on memory.
- Register three compositions + three stills (`CompoundCover`, `CompoundContactSheet`, `CompoundEvolutionMap`) exactly as `package.json` scripts expect. `CompoundContactSheet` = all 11 `ENTRY:desktop/hero` targets with `milestones[].id` and `date_range`; `CompoundEvolutionMap` = full constellation with all verified edges and `L.graph.counts`.
- Preload every image referenced in `SHOT-MANIFEST.json` (41 files) via `prefetch`/`Img`; full-page PNGs of V04/V09 DISCOVERY are 16 263 px tall — `CameraShot` must crop to the target ± pad and let the browser decode a scaled copy (use `Img` with `style` clip, not CSS `background`).
- `SHOT-MANIFEST.json` is the source of truth for scene boundaries: `Root.tsx` derives `durationInFrames` per composition from the last `end_s` × 30 and a test asserts that every `sources[].file` exists and every `section_key` resolves.
- Text safe areas: 96 px from every edge in 16:9; 120 px top/bottom in 9:16.
- Colour: page theme neutral dark; the screenshots carry the colour. No brand colours of third parties.
