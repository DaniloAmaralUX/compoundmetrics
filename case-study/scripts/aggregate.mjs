// Aggregates item-level states into site-level results, scores, coverage, CSV, findings and deltas.
// Formula (PRD §12): score = PASS/(PASS+FAIL)×100 ; coverage = (PASS+FAIL)/(PASS+FAIL+NOT_VERIFIED)×100. N/A excluded.
import fs from "node:fs";
import path from "node:path";
const ROOT = "/home/user/compoundmetrics";
const BD = path.join(ROOT, "case-study/design-benchmark");
const RUB = JSON.parse(fs.readFileSync(path.join(BD, "rubric/compound-design-audit.json"), "utf8"));
const CLS = JSON.parse(fs.readFileSync(path.join(BD, "rubric/ITEM-CLASSIFICATION.json"), "utf8"));
const MS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));
const TOOLS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/TOOLS-MANIFEST.json"), "utf8"));
const CATS = RUB.categories.map((c) => (typeof c === "string" ? c : c.id));
const catTitle = Object.fromEntries(RUB.items.map((i) => [i.category, i.category_title]));
const mode = Object.fromEntries(CLS.items.map((i) => [i.id, i.mode]));
const SOURCE_ITEMS = ["fundamentos/jtbd", "fundamentos/macro-bet", "fundamentos/restricoes", "fundamentos/documentado"];
const rd = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);
const combine = (states) => { const s = states.filter(Boolean); if (!s.length) return "NOT_VERIFIED"; if (s.includes("FAIL")) return "FAIL"; if (s.every((x) => x === "N/A")) return "N/A"; if (s.includes("PASS") && s.every((x) => x === "PASS" || x === "N/A")) return "PASS"; return "NOT_VERIFIED"; };
const score = (items) => { const c = { PASS: 0, FAIL: 0, "N/A": 0, NOT_VERIFIED: 0 }; for (const s of items) c[s] = (c[s] || 0) + 1; const den = c.PASS + c.FAIL; return { ...c, score: den ? Math.round((c.PASS / den) * 1000) / 10 : null, coverage: den + c.NOT_VERIFIED ? Math.round((den / (den + c.NOT_VERIFIED)) * 1000) / 10 : null }; };

const summary = { generated_at: new Date().toISOString(), label: "Compound Design Audit Score", meaning: "performance against the frozen Compound Design Audit v3.6.0 ruler (54 items); not a universal design-quality score", formula: { score: "PASS/(PASS+FAIL)×100", coverage: "(PASS+FAIL)/(PASS+FAIL+NOT_VERIFIED)×100", na: "excluded" }, rubric_sha256: CLS.rubric_sha256, milestones: [] };
const findings = []; const csvRows = [];
for (const m of MS.milestones) {
  const det = rd(path.join(BD, "results", m.id, "deterministic.json")); const jud = rd(path.join(BD, "results", m.id, "judgment.json")); const src = rd(path.join(BD, "results", m.id, "source-review.json"));
  const items = {};
  for (const it of RUB.items) {
    const id = it.id; let state, evidence = [];
    if (mode[id] === "deterministic") {
      const per = []; for (const [surface, res] of Object.entries(det?.surfaces || {})) if (res[id]) { per.push(res[id].state); if (res[id].state === "FAIL") evidence.push({ surface, ...res[id] }); }
      if (det?.site_level?.[id]) { per.push(det.site_level[id].state); if (det.site_level[id].state === "FAIL") evidence.push({ surface: "site", ...det.site_level[id] }); }
      state = combine(per); if (!per.length) state = "NOT_VERIFIED";
      items[id] = { state, mode: "deterministic", per_surface: Object.fromEntries(Object.entries(det?.surfaces || {}).map(([s, r]) => [s, r[id]?.state]).filter(([, v]) => v)), evidence };
    } else if (SOURCE_ITEMS.includes(id)) {
      const v = src?.verdicts?.find((x) => x.id === id); state = v ? v.state : "NOT_VERIFIED";
      items[id] = { state, mode: "judgment (source review, unblinded)", evidence: v ? [v] : [] };
    } else {
      const v = jud?.verdicts?.find((x) => x.id === id); state = v ? v.state : "NOT_VERIFIED";
      items[id] = { state, mode: "judgment (blinded)", surface: v?.surface, evidence: v ? [v] : [] };
    }
    if (state === "FAIL") {
      const ev = items[id].evidence[0] || {};
      findings.push({ id: `F-${m.id}-${id.replace("/", "-")}`, milestone: m.id, tool: m.tool_ids.join("+"), surface: ev.surface || items[id].surface || "site", viewport: /alvos|input-16px|mobile/.test(id) ? "390×844" : "1440×900", audit_item: id, category: it.category, state: "FAIL", evidence: ev.evidence || ev.reason || "", screenshot: `case-study/archive/${m.id}/surfaces/${(ev.surface || items[id].surface || "ENTRY").split(/[ ,+]/)[0].replace("all", "ENTRY").replace("site", "ENTRY")}-${/alvos|input-16px|mobile/.test(id) ? "mobile" : "desktop"}.png`, measured_value: ev.measured != null ? JSON.stringify(ev.measured) : ev.measured_value || "", expected_value: ev.expected || ev.expected_value || it.desc, confidence: mode[id] === "deterministic" ? "high (rule-based)" : "medium (single-rater judgment)", impact: it.category === "acessibilidade" ? "high" : "medium", notes: mode[id] === "deterministic" ? "deterministic rule from ITEM-CLASSIFICATION.json" : "blinded judgment" });
    }
  }
  const all = score(Object.values(items).map((i) => i.state));
  const cats = {}; for (const c of CATS) cats[c] = score(RUB.items.filter((i) => i.category === c).map((i) => items[i.id].state));
  const detOnly = score(RUB.items.filter((i) => mode[i.id] === "deterministic").map((i) => items[i.id].state)); const judOnly = score(RUB.items.filter((i) => mode[i.id] !== "deterministic").map((i) => items[i.id].state));
  const site = { milestone: m.id, name: m.name, tool_ids: m.tool_ids, source_sha: m.source_sha, date_range: m.date_range, overall: all, deterministic_only: detOnly, judgment_only: judOnly, categories: cats, items };
  fs.writeFileSync(path.join(BD, "results", m.id, "site.json"), JSON.stringify(site, null, 1));
  summary.milestones.push({ milestone: m.id, name: m.name, tool_ids: m.tool_ids, date_range: m.date_range, score: all.score, coverage: all.coverage, counts: { PASS: all.PASS, FAIL: all.FAIL, "N/A": all["N/A"], NOT_VERIFIED: all.NOT_VERIFIED }, deterministic_score: detOnly.score, judgment_score: judOnly.score, categories: Object.fromEntries(CATS.map((c) => [c, { score: cats[c].score, coverage: cats[c].coverage }])) });
  csvRows.push([m.id, m.name.replace(/,/g, ";"), m.date_range, all.score, all.coverage, all.PASS, all.FAIL, all["N/A"], all.NOT_VERIFIED, ...CATS.map((c) => cats[c].score ?? "")]);
}
// averages: per tool (V09 ENTRY duplicates V08; V08/V10 same design) — declare which milestones enter the average
const independent = summary.milestones.filter((x) => !["V10"].includes(x.milestone)); // V10 = V08 design with v0.3 content
summary.average_score_all_milestones = Math.round((summary.milestones.reduce((a, x) => a + (x.score || 0), 0) / summary.milestones.length) * 10) / 10;
summary.average_score_independent_designs = Math.round((independent.reduce((a, x) => a + (x.score || 0), 0) / independent.length) * 10) / 10;
summary.average_note = "average_score_independent_designs excludes V10 (same design as V08 with v0.3 content). V09 stays because its DISCOVERY/DETAIL/INTERACTION surfaces are its own even though its ENTRY equals V08's.";
// deltas
const order = summary.milestones; const deltas = [];
for (let i = 1; i < order.length; i++) { const a = order[i - 1], b = order[i]; const sa = rd(path.join(BD, "results", a.milestone, "site.json")).items, sb = rd(path.join(BD, "results", b.milestone, "site.json")).items; const improved = [], regressed = [], removed_failures = [], new_failures = []; for (const id of Object.keys(sb)) { const x = sa[id]?.state, y = sb[id]?.state; if (x === "FAIL" && y === "PASS") improved.push(id); if (x === "PASS" && y === "FAIL") regressed.push(id); if (x === "FAIL" && y !== "FAIL") removed_failures.push(id); if (x !== "FAIL" && y === "FAIL") new_failures.push(id); } deltas.push({ from: a.milestone, to: b.milestone, score_delta: a.score != null && b.score != null ? Math.round((b.score - a.score) * 10) / 10 : null, coverage_delta: Math.round((b.coverage - a.coverage) * 10) / 10, category_delta: Object.fromEntries(CATS.map((c) => [c, a.categories[c].score != null && b.categories[c].score != null ? Math.round((b.categories[c].score - a.categories[c].score) * 10) / 10 : null])), improved, regressed, removed_failures, new_failures, same_tool: a.tool_ids.some((t) => b.tool_ids.includes(t)) }); }
const failCount = {}; for (const m of MS.milestones) { const s = rd(path.join(BD, "results", m.id, "site.json")).items; for (const [id, v] of Object.entries(s)) if (v.state === "FAIL") failCount[id] = (failCount[id] || 0) + 1; }
const persistent = Object.entries(failCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id, n]) => ({ id, fails: n, of: MS.milestones.length }));
const first = order[0], last = order[order.length - 1];
const catImprove = CATS.map((c) => ({ category: c, first: first.categories[c].score, last: last.categories[c].score, delta: first.categories[c].score != null && last.categories[c].score != null ? Math.round((last.categories[c].score - first.categories[c].score) * 10) / 10 : null })).filter((x) => x.delta != null).sort((a, b) => b.delta - a.delta);
const withScore = deltas.filter((d) => d.score_delta != null);
summary.delta = { pairs: deltas, biggest_improvement: withScore.reduce((a, b) => (b.score_delta > (a?.score_delta ?? -1e9) ? b : a), null), biggest_regression: withScore.reduce((a, b) => (b.score_delta < (a?.score_delta ?? 1e9) ? b : a), null), most_persistent_failures: persistent, category_improved_most: catImprove[0] || null, category_improved_least: catImprove[catImprove.length - 1] || null, first_vs_last: { from: first.milestone, to: last.milestone, score_delta: Math.round((last.score - first.score) * 10) / 10 } };
summary.chronological_trend = order.map((x) => ({ milestone: x.milestone, score: x.score, coverage: x.coverage }));
fs.writeFileSync(path.join(BD, "SUMMARY.json"), JSON.stringify(summary, null, 1));
fs.writeFileSync(path.join(BD, "DESIGN-EVOLUTION.csv"), ["Version,Name,Date range,Score,Coverage,PASS,FAIL,N/A,NOT_VERIFIED," + CATS.map((c) => catTitle[c] || c).join(",")].concat(csvRows.map((r) => r.join(","))).join("\n") + "\n");
fs.mkdirSync(path.join(BD, "reports"), { recursive: true });
fs.writeFileSync(path.join(BD, "reports/FINDINGS.json"), JSON.stringify({ generated_at: summary.generated_at, count: findings.length, findings }, null, 1));
console.log(order.map((x) => `${x.milestone} ${x.score}% (cov ${x.coverage}%)`).join(" | "));
console.log("findings", findings.length);
