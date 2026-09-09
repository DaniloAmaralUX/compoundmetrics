// Fills visual_fingerprint in DESIGN-MILESTONES.json from archive metadata and evaluates the
// merge rules that were declared before capture. Pure data; no judgment.
import fs from "node:fs";
import path from "node:path";
const ROOT = "/home/user/compoundmetrics";
const P = path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json");
const D = JSON.parse(fs.readFileSync(P, "utf8"));
const fp = {};
for (const m of D.milestones) { const mp = path.join(ROOT, "case-study/archive", m.id, "metadata.json"); if (!fs.existsSync(mp)) continue; const meta = JSON.parse(fs.readFileSync(mp, "utf8")); fp[m.id] = meta.visual_fingerprint; m.visual_fingerprint = `ahash:${meta.visual_fingerprint.ahash16_entry_top_band}|dom:${meta.visual_fingerprint.dom_signature.slice(0, 12)}|css:${(meta.visual_fingerprint.css_sha256 || "none").slice(0, 12)}|typo:${meta.visual_fingerprint.typography.slice(0, 12)}|color:${meta.visual_fingerprint.color.slice(0, 12)}`; m.entry_title = meta.fingerprint_detail?.ENTRY?.title || null; }
const ham = (a, b) => { let x = BigInt("0x" + a) ^ BigInt("0x" + b); let n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };
const pairs = [["V03", "V04"], ["V04", "V09"], ["V08", "V10"], ["V08", "V09"], ["V10", "V11"]];
D.merge_evaluation = { rule: "declared per milestone before capture: merge only if ENTRY ahash Hamming distance ≤ 6 bits (256-bit hash) AND DOM signature identical", evaluated_at: new Date().toISOString(), pairs: pairs.map(([a, b]) => ({ a, b, ahash_hamming: ham(fp[a].ahash16_entry_top_band, fp[b].ahash16_entry_top_band), dom_identical: fp[a].dom_signature === fp[b].dom_signature, css_identical: fp[a].css_sha256 === fp[b].css_sha256, typography_identical: fp[a].typography === fp[b].typography, merged: ham(fp[a].ahash16_entry_top_band, fp[b].ahash16_entry_top_band) <= 6 && fp[a].dom_signature === fp[b].dom_signature })) };
D.merge_evaluation.notes = [
  "V03/V04: hero near-identical (3 bits) but DOM signature differs (section order / nav changed) → kept separate by the declared rule; visually they are one design family with two structural versions.",
  "V08/V10: 2 bits apart, same CSS bundle hash, DOM signature differs only because v0.3 content added sections → kept separate by the letter of the rule. For the evolution narrative they are ONE design with two content versions; EVOLUTION.md treats V08→V10 as a content delta, not a design delta.",
  "V08/V09: 0 bits apart — studio-dev-ui main at 231889f serves the Compound Design v0.2.1 page at its root (same title). V09's ENTRY is therefore the same page as V08's; V09 is kept as a milestone only for its gallery/playground surfaces (DISCOVERY/DETAIL/INTERACTION), and its ENTRY score is not counted as an independent data point in averages (see SUMMARY.json duplicates).",
];
fs.writeFileSync(P, JSON.stringify(D, null, 1));
console.log(JSON.stringify(D.merge_evaluation.pairs));
