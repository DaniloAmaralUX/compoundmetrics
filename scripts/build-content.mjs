#!/usr/bin/env node
// Builds src/content/generated/resources.json from the canonical skills and agents.
//
// The site consumes the framework; it does not restate it. Every resource page renders the
// sections of the real SKILL.md / agent file, so the public description can never drift from
// what the plugin actually installs. Deterministic, dependency-free, no model runtime.
//
//   node scripts/build-content.mjs          # write
//   node scripts/build-content.mjs --check  # exit 1 if the committed file is stale
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const OUT = path.join(ROOT, "src/content/generated/resources.json");
const REGISTRY = JSON.parse(fs.readFileSync(path.join(ROOT, "compound-design/registry/resource-registry.json"), "utf8"));

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    data[kv[1]] = v;
  }
  return { data, body: text.slice(m[0].length) };
}

function slug(s) {
  return s.toLowerCase().replace(/^\d+\.\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseSections(body) {
  const lines = body.split(/\r?\n/);
  let title = "";
  const lede = [];
  const sections = [];
  let cur = null;
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;
    if (!inFence && /^# /.test(line) && !title) { title = line.replace(/^# /, "").trim(); continue; }
    if (!inFence && /^## /.test(line)) {
      cur = { id: slug(line.replace(/^## /, "")), heading: line.replace(/^## /, "").trim(), markdown: [] };
      sections.push(cur);
      continue;
    }
    if (cur) cur.markdown.push(line);
    else if (title) lede.push(line);
  }
  // Skill bodies open with a one-line bold question; keep it separately as the "question".
  const ledeText = lede.join("\n").trim();
  const q = ledeText.match(/^\*\*(.+?)\*\*/);
  return {
    title,
    question: q ? q[1] : null,
    lede: ledeText.replace(/^\*\*(.+?)\*\*\s*/, "").trim(),
    sections: sections.map((s) => ({ ...s, markdown: s.markdown.join("\n").trim() })),
  };
}

const items = {};
const inputs = [];
for (const r of REGISTRY.resources) {
  if (r.status !== "active") continue;
  const file = path.join(ROOT, r.path);
  if (!fs.existsSync(file)) throw new Error(`registry path missing on disk: ${r.path}`);
  const text = fs.readFileSync(file, "utf8");
  inputs.push({ path: r.path, sha256_16: sha(text) });
  const { data, body } = parseFrontmatter(text);
  const parsed = parseSections(body);
  items[r.id] = {
    id: r.id,
    kind: r.kind,
    path: r.path,
    frontmatter: data,
    title: parsed.title,
    question: parsed.question,
    lede: parsed.lede,
    sections: parsed.sections,
    lines: text.split(/\r?\n/).length,
  };
}

// Learning Ledger entries, so a resource page can show the failures recorded against it — or say
// honestly that none has been.
const LEDGER = fs.readFileSync(path.join(ROOT, "compound-design/learning/LEDGER.md"), "utf8");
const ledger = [];
for (const block of LEDGER.matchAll(/```yaml\n([\s\S]*?)```/g)) {
  const e = {};
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) e[kv[1]] = kv[2].trim();
  }
  if (e.id && e.id !== "CD-YYYYMMDD-NNN") ledger.push({ id: e.id, resource: e.resource, resource_version: e.resource_version, task: e.task, lesson: e.lesson, impact: e.impact, observed_at: e.observed_at, candidate_eval: e.candidate_eval });
}

const output = {
  generatedBy: "scripts/build-content.mjs",
  note: "Derived from the canonical skills/ and agents/ files named in the registry. Regenerate with `npm run content`; CI fails if this file is stale.",
  registryRelease: REGISTRY.release,
  inputs: inputs.sort((a, b) => a.path.localeCompare(b.path)),
  items: Object.fromEntries(Object.keys(items).sort().map((k) => [k, items[k]])),
  ledger,
};
const json = JSON.stringify(output, null, 2) + "\n";

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== json) {
    console.error(`content stale: ${path.relative(ROOT, OUT)} does not match skills/ and agents/. Run: npm run content`);
    process.exit(1);
  }
  console.log(`content fresh: ${Object.keys(items).length} resources, ${inputs.length} inputs`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, json);
  console.log(`content → ${path.relative(ROOT, OUT)} (${Object.keys(items).length} resources)`);
}
