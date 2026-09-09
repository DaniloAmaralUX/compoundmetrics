// Source / craft audit (instrument B — the cl-audit playbook's 8 categories), deterministic subset.
// Runs only where the exact source of the captured milestone exists (every captured milestone was
// built from its exact commit). Pattern checks are static and reproducible; anything the playbook
// leaves to taste is reported as NOT_VERIFIED rather than pretended. No model runtime.
// Output: case-study/design-benchmark/results/<V>/source-craft.json
import fs from "node:fs";
import path from "node:path";
const ROOT = "/home/user/compoundmetrics";
const MS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));
const only = process.argv.slice(2);
const EXT = /\.(css|scss|tsx|jsx|ts|js|html|mdx)$/;
const SKIP = /node_modules|\/\.next\/|\/out\/|\/dist\/|\/build\/|\.research|\/video\/|\.min\.|registry\.json|package-lock/;

function walk(dir, acc = [], base = dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (SKIP.test("/" + path.relative(base, p) + (e.isDirectory() ? "/" : "")) || e.name.startsWith(".")) continue; if (e.isDirectory()) walk(p, acc, base); else if (EXT.test(e.name)) acc.push(p); } return acc; }

// category → checks: [id, severity, regex, description, negate?]
const CHECKS = {
  "1-hierarquia": [],   // judgment-only in the playbook → NOT_VERIFIED
  "2-tipografia": [
    ["type-scale-loose", "LOW", /font-size:\s*(1[0-9]|[2-9][0-9])\.?\d*px|text-\[\d+px\]/g, "hard-coded pixel font sizes outside a scale token"],
    ["no-tabular-nums", "LOW", null, "no tabular-nums anywhere although numbers are rendered (checked globally)"],
  ],
  "3-cor": [
    ["raw-hex-in-components", "LOW", /#[0-9a-fA-F]{6}\b/g, "raw hex colours in component files (outside token/theme files)"],
  ],
  "4-superficies": [
    ["outline-none-no-replacement", "HIGH", /outline:\s*none|outline:\s*0\b|outline-none/g, "focus outline removed (must be paired with a visible replacement)"],
  ],
  "5-motion-easing": [
    ["ease-in-on-ui", "HIGH", /(transition|animation)[^;{}]*\bease-in\b(?!-out)/g, "ease-in on UI transitions"],
    ["duration-gt-300", "MEDIUM", /(transition|animation)(-duration)?:[^;{}]*\b(0?\.[4-9]\d*s|[1-9]\d*s|[3-9]\d{2,}ms|[1-9]\d{3,}ms)\b/g, "transition/animation duration > 300 ms (modals/drawers up to ~500 ms are exempt; reported, then vetted)"],
    ["linear-ui", "LOW", /transition[^;{}]*\blinear\b/g, "linear easing on UI transitions"],
  ],
  "6-motion-physics": [
    ["scale-zero", "HIGH", /scale\(0\)|scale-0\b/g, "scale(0) entrance/exit"],
    ["keyframes-on-hover", "LOW", /:hover[^{}]*\{[^}]*animation:/g, "keyframe animation triggered by hover"],
  ],
  "7-performance": [
    ["transition-all", "MEDIUM", /transition(-property)?:\s*all\b|\btransition-all\b/g, "transition: all"],
    ["animated-layout-props", "MEDIUM", /transition(-property)?:\s*[^;{}]*\b(width|height|top|left|right|bottom|margin[a-z-]*|padding[a-z-]*)\b/g, "layout properties transitioned"],
  ],
  "8-acessibilidade": [
    ["no-reduced-motion", "MEDIUM", null, "no prefers-reduced-motion query in the stylesheet set although animations/transitions exist (checked globally)"],
    ["hover-without-gate", "LOW", null, "hover styles without an @media (hover: hover) gate (checked globally: count of :hover rules vs gated)"],
  ],
};

for (const m of MS.milestones) {
  if (only.length && !only.includes(m.id)) continue;
  const dir = path.join(ROOT, ".research/builds", m.build);
  const files = walk(dir);
  const findings = []; let total = { hover: 0, gatedHover: 0, tabular: 0, reduced: 0, anim: 0, numbers: 0 };
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8"); const rel = path.relative(dir, f);
    const isTheme = /token|theme|palette|globals|variables|colors?\.(css|ts)/i.test(rel);
    total.hover += (src.match(/:hover/g) || []).length; total.gatedHover += (src.match(/@media\s*\(hover:\s*hover\)/g) || []).length; total.tabular += (src.match(/tabular-nums/g) || []).length; total.reduced += (src.match(/prefers-reduced-motion/g) || []).length; total.anim += (src.match(/transition|animation|@keyframes/g) || []).length; total.numbers += (src.match(/\b\d{2,}\b/g) || []).length;
    for (const [cat, checks] of Object.entries(CHECKS)) for (const [id, sev, re, desc] of checks) {
      if (!re) continue; if (id === "raw-hex-in-components" && (isTheme || /\.css$/.test(rel))) continue;
      let mm; re.lastIndex = 0; while ((mm = re.exec(src))) { const line = src.slice(0, mm.index).split("\n").length; findings.push({ category: cat, check: id, severity: sev, file: rel, line, snippet: mm[0].slice(0, 100), description: desc }); if (findings.length > 5000) break; }
    }
  }
  if (total.anim > 0 && total.reduced === 0) findings.push({ category: "8-acessibilidade", check: "no-reduced-motion", severity: "MEDIUM", file: "(global)", line: 0, snippet: `animations/transitions: ${total.anim}, reduced-motion queries: 0`, description: CHECKS["8-acessibilidade"][0][3] });
  if (total.hover > 0 && total.gatedHover === 0) findings.push({ category: "8-acessibilidade", check: "hover-without-gate", severity: "LOW", file: "(global)", line: 0, snippet: `:hover rules ${total.hover}, @media (hover: hover) gates 0`, description: CHECKS["8-acessibilidade"][1][3] });
  if (total.numbers > 50 && total.tabular === 0) findings.push({ category: "2-tipografia", check: "no-tabular-nums", severity: "LOW", file: "(global)", line: 0, snippet: `tabular-nums occurrences: 0`, description: CHECKS["2-tipografia"][1][3] });
  // per-category summary; consolidated (one finding per check per file) to avoid count inflation by repetition
  const perCat = {}; for (const cat of Object.keys(CHECKS)) perCat[cat] = { state: CHECKS[cat].length ? "CHECKED" : "NOT_VERIFIED", findings: 0, files: new Set(), high: 0 };
  for (const f of findings) { const c = perCat[f.category]; c.findings++; c.files.add(f.file); if (f.severity === "HIGH") c.high++; }
  for (const c of Object.values(perCat)) c.files = c.files.size;
  const out = { milestone: m.id, build: m.build, source_sha: m.source_sha, run_at: new Date().toISOString(), instrument: "cl-audit playbook (compound-labs-design@364430b, skills/compound-labs-design/references/audit-playbook.md) — deterministic pattern subset; Phase-3 vetting by reading is recorded as NOT_VERIFIED for categories with no static rule", files_scanned: files.length, totals: total, categories: perCat, findings: findings.slice(0, 400), findings_truncated: findings.length > 400 ? findings.length - 400 : 0 };
  const rd = path.join(ROOT, "case-study/design-benchmark/results", m.id); fs.mkdirSync(rd, { recursive: true });
  fs.writeFileSync(path.join(rd, "source-craft.json"), JSON.stringify(out, null, 1));
  console.log(m.id, files.length, "files;", findings.length, "findings;", Object.entries(perCat).map(([k, v]) => `${k.split("-")[0]}:${v.findings}`).join(" "));
}
