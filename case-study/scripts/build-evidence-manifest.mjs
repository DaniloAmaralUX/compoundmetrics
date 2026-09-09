// EVIDENCE-MANIFEST.json (PRD §35): every artifact with provenance and SHA-256. No image without provenance.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const ROOT = "/home/user/compoundmetrics";
const CS = path.join(ROOT, "case-study");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const MS = JSON.parse(fs.readFileSync(path.join(CS, "history/DESIGN-MILESTONES.json"), "utf8")).milestones;
const RUB = JSON.parse(fs.readFileSync(path.join(CS, "design-benchmark/rubric/RUBRIC-MANIFEST.json"), "utf8"));
const artifacts = [];
const add = (rel, extra) => { const p = path.join(CS, rel); if (!fs.existsSync(p)) return; artifacts.push({ artifact_id: rel, type: extra.type, tool_id: extra.tool_id ?? null, milestone: extra.milestone ?? null, source_url: extra.source_url ?? null, source_sha: extra.source_sha ?? null, deployment_id: extra.deployment_id ?? null, viewport: extra.viewport ?? null, captured_at: extra.captured_at ?? null, sha256: sha(p), bytes: fs.statSync(p).size, capture_method: extra.capture_method ?? null }); };
for (const m of MS) {
  const meta = JSON.parse(fs.readFileSync(path.join(CS, "archive", m.id, "metadata.json"), "utf8"));
  const dep = (m.equivalent_deployments[0] || "").match(/dpl_[A-Za-z0-9]+/)?.[0] ?? null;
  const base = { tool_id: m.tool_ids.join("+"), milestone: m.id, source_url: m.representative_url, source_sha: m.source_sha, deployment_id: dep, captured_at: meta.captured_at, capture_method: meta.capture_method };
  for (const rel of Object.keys(meta.files)) add(`archive/${m.id}/${rel}`, { ...base, type: rel.endsWith(".png") ? (rel.startsWith("states/") ? "screenshot-state" : "screenshot") : "capture-metadata", viewport: /mobile/.test(rel) ? "390×844" : rel.endsWith(".png") ? "1440×900" : null });
  add(`archive/${m.id}/metadata.json`, { ...base, type: "capture-metadata" });
  for (const f of ["deterministic.json", "judgment.json", "source-review.json", "source-craft.json", "site.json"]) add(`design-benchmark/results/${m.id}/${f}`, { ...base, type: "audit-result", capture_method: f === "judgment.json" ? "blinded judgment (fresh-context model agent), frozen before reveal" : f === "deterministic.json" ? "playwright-core 1.63 + axe-core 4.13, pre-declared rules" : f === "source-craft.json" ? "static pattern scan of the exact commit" : f === "source-review.json" ? "repository documentation review (unblinded)" : "aggregation (scripts/aggregate.mjs)" });
}
for (const f of ["rubric/compound-design-audit.json", "rubric/RUBRIC-MANIFEST.json", "rubric/audit.html.frozen", "rubric/ITEM-CLASSIFICATION.json", "RANDOMIZATION.json", "RANDOMIZATION.mapping.json", "SUMMARY.json", "DESIGN-EVOLUTION.csv", "EVOLUTION.md", "METHODOLOGY.md", "reports/FINDINGS.json", "reports/learning-yield.json"]) add(`design-benchmark/${f}`, { type: "benchmark", source_url: "https://compound-labs-design.vercel.app/audit", source_sha: RUB.source_sha, deployment_id: "dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ" });
for (const f of ["history/TOOLS-MANIFEST.json", "history/DESIGN-MILESTONES.json", "history/CHRONOLOGY.md", "knowledge/TRANSFER-GRAPH.json", "theory/ATOMIC-AI-DESIGN.md", "theory/PROVENANCE-NOTE.md", "theory/atomic-ai-design.svg", "theory/atomic-ai-design-vertical.svg", "research/CONTEXT7-SOURCES.md", "COMPOUND-DESIGN-CASE.md", "FREEZE.md", "video/STORYBOARD.md", "video/SHOT-MANIFEST.json", "video/NARRATION.md", "ADVERSARIAL-REVIEW.md"]) add(f, { type: "document" });
if (fs.existsSync(path.join(CS, "video/out"))) for (const f of fs.readdirSync(path.join(CS, "video/out"))) add(`video/out/${f}`, { type: /\.mp4$/.test(f) ? "render-video" : /\.png$/.test(f) ? "render-still" : "render-aux", capture_method: "Remotion 4.0.523 render, local Chromium, data from case-study JSON only" });
const out = { generated_at: new Date().toISOString(), rule: "No historical image without provenance: every screenshot carries milestone, tool, source SHA, deployment (when retained), viewport, timestamp, capture method and SHA-256.", count: artifacts.length, artifacts };
fs.writeFileSync(path.join(CS, "EVIDENCE-MANIFEST.json"), JSON.stringify(out, null, 1));
console.log("artifacts", artifacts.length);
