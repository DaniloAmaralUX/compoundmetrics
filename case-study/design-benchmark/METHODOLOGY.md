# Methodology — Compound Design Evolution Benchmark

This benchmark measures **design milestones against a frozen ruler**: the Compound Design Audit v3.6.0 (54 items, 9 categories) as it existed in `DaniloAmaralUX/compound-labs-design@364430b` on 2026-07-16. The ruler was frozen and hashed **before** any surface was scored (`rubric/RUBRIC-MANIFEST.json`). The ruler is not a universal quality standard; the score is called **Compound Design Audit Score** and means *performance against this frozen ruler*, nothing more.

## 1. What is measured

| Object | Definition | Where |
| --- | --- | --- |
| Design milestone | a visually distinct design state, not a deployment; duplicate deployments collapse into one | `history/DESIGN-MILESTONES.json` |
| Surface | one of ENTRY, DISCOVERY, DETAIL, INTERACTION, MOBILE ENTRY, mapped semantically per milestone; absent → N/A | same file, `surfaces` |
| Capture | the exact commit built locally and rendered by headless Chromium at 1440×900 and 390×844 | `archive/<V>/` |
| Item | one of the 54 frozen audit items | `rubric/compound-design-audit.json` |
| State | PASS · FAIL · N/A · NOT_VERIFIED (kept separate) | `results/<V>/*.json` |

## 2. Order of operations (bias controls)

1. Freeze the rubric from source; hash it. *(done before any capture)*
2. Declare, per item, whether it is **deterministic** (decided by a pre-declared rule over DOM / computed style / axe-core / bounding boxes) or **judgment** (decided only in the blinded pass). 23 deterministic, 31 judgment. *(`rubric/ITEM-CLASSIFICATION.json`, declared before scoring)*
3. Declare milestone merge rules **before** fingerprints exist. *(`DESIGN-MILESTONES.json`)*
4. Capture every milestone; hash every artifact. *(`archive/`)*
5. Run the deterministic checks by script. *(`scripts/audit-deterministic.mjs` → `results/<V>/deterministic.json`)*
6. Randomise and anonymise the judgment material (DESIGN-A … DESIGN-K, seed saved), judge, freeze the file, then reveal the mapping. *(`RANDOMIZATION.json`, `results/<V>/judgment.json`)*
7. Aggregate; never re-weight after seeing results. *(`SUMMARY.json`, `DESIGN-EVOLUTION.csv`)*
8. Delta analysis, findings, learning yield. *(`EVOLUTION.md`, `reports/`)*

## 3. Score

```
Compound Design Audit Score = PASS / (PASS + FAIL) × 100
Verification Coverage       = (PASS + FAIL) / (PASS + FAIL + NOT_VERIFIED) × 100
```

N/A is excluded from both. NOT_VERIFIED is excluded from the score and counted in coverage. A score is never shown without its coverage. Category scores use the same formula over the category's items. Site-level score = union of item states across the milestone's representative surfaces, where an item FAILS if it fails on any surface where it applies, PASSES if it passes on every applicable surface, is N/A if it applies to no surface, and NOT_VERIFIED otherwise. Every site-level number can be reconstructed from the item-level files.

## 4. Deterministic checks

Rules and thresholds are the ones written in `ITEM-CLASSIFICATION.json` (for example: "≤ 10 distinct computed font sizes", "≥ 90 % of spacing values multiples of 4", "axe color-contrast 0 violations", "≥ 90 % of tap targets ≥ 44 px at 390"). They are heuristics with declared thresholds, not proofs of the underlying quality; they are reproducible. Tools: playwright-core 1.63 + local Chromium, axe-core 4.13, `reducedMotion: no-preference` for checks, `reduce` + `animations: disabled` for archive screenshots.

## 5. Judgment checks

Judgment items are scored by the session author on anonymised screenshots only (no URL, no milestone id, no chronology), in the randomised order, with the item text of the frozen rubric as the only reference. Each verdict carries a one-line reason. The judge is the same agent that built V08–V11 and captured all milestones; anonymisation cannot remove brand text visible inside screenshots. **This is a reduction of order/recency bias, not an independent evaluation** — the PRD says so and so does this file.

## 6. Source / craft audit (instrument B)

The `cl-audit` playbook's 8 categories are applied only where the exact source of the captured milestone exists (all 11 captured milestones). Only the static, pattern-checkable part is run (`scripts/audit-source.mjs`); categories with no static rule (hierarchy & purpose) are NOT_VERIFIED. Counts are raw pattern hits and include upstream-derived component code where a repository contains it (studio-dev-ui carries React Bits / canvas-ui components); they are reported as densities and never mixed into the Design Score.

## 7. Known limitations (recorded, not hidden)

- The sandbox cannot reach `*.vercel.app`, Google Fonts, Unsplash or any external host: captures are of **locally built exact commits**, and fonts loaded from Google Fonts fall back to system fonts (affects V01 typography fingerprints and any typography judgment on V01; recorded in `archive/V01/metadata.json.notes`). External images fail to load where a milestone used Unsplash (V03/V04/V09 detail pages).
- Deployment ids before 2026-09 were not retained by the API; those milestones are anchored to commits.
- 16 of the 24 tool candidates have no readable repository → **NOT CAPTURED**; the benchmark covers 7 tools / 11 milestones.
- Two milestones (V04 / V11) were built with `typescript.ignoreBuildErrors` because an unrelated `video/` package failed type-checking; no UI source was changed.
- The judgment pass is single-rater.

## 8. What this benchmark does not claim

It does not prove Compound Design increases productivity, produces universally better design, or has business impact; it does not raise CEL; it does not measure runtime uplift. See `../FREEZE.md` and PRD §38–39.
