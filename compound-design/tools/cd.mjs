#!/usr/bin/env node
/*
 * Compound Design — deterministic tooling.
 *
 * Every subcommand here is zero-model and zero-network: configuration resolution,
 * durable-learning discovery, resource contract tests, plugin validation, registry
 * validation, the contextual claim guard, and the setup health check.
 *
 * Nothing here produces evidence about effectiveness. Passing these checks is
 * deterministic contract evidence (E1) and nothing more.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, "../..");
const CONFIG_DIR = ".compound-design";

// ---------------------------------------------------------------- helpers
const log = (...a) => console.log(...a);
const fail = (m) => { const e = new Error(m); e.isGate = true; throw e; };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p) || ".";
function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name === "node_modules" || e.name === ".git") continue; walk(p, out); }
    else out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------- minimal YAML (flat scalars, inline and block arrays)
export function parseYamlish(text) {
  const out = {};
  const lines = String(text).split("\n");
  const scalar = (raw) => {
    const v = raw.trim();
    if (v === "" ) return "";
    if (v === "true") return true;
    if (v === "false") return false;
    if (v === "null" || v === "~") return null;
    if ((v.startsWith('"') && v.endsWith('"') && v.length > 1) || (v.startsWith("'") && v.endsWith("'") && v.length > 1)) return v.slice(1, -1);
    if (v.startsWith("[") && v.endsWith("]")) return v.slice(1, -1).split(",").map((x) => scalar(x)).filter((x) => x !== "");
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    return v;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(#|$)/.test(line)) continue;
    const m = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, rest] = m;
    if (rest.trim() === "") {
      const items = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (/^\s*#/.test(lines[j])) continue;
        const im = /^\s+-\s+(.*)$/.exec(lines[j]);
        if (!im) { if (/^\s*$/.test(lines[j])) continue; break; }
        items.push(scalar(im[1]));
      }
      if (items.length) { out[key] = items; i = j - 1; continue; }
      out[key] = "";
      continue;
    }
    out[key] = scalar(rest);
  }
  return out;
}
export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(String(text));
  if (!m) return { frontmatter: null, body: String(text) };
  return { frontmatter: parseYamlish(m[1]), body: m[2] };
}

// ---------------------------------------------------------------- configuration
export const CONFIG_KEYS = {
  docs_root: { default: "docs", repoOnly: true, failClosed: true, consumers: ["cd-frame", "cd-model", "cd-compound", "cd-compound-refresh", "cd-handoff"] },
  strategy_path: { default: "STRATEGY.md", consumers: ["cd-strategy", "cd-frame", "cd-model"] },
  evidence_root: { default: "compound-design", consumers: ["cd-quality-gate", "cd-resource-lab"] },
  default_review_mode: { default: "report-only", enum: ["report-only", "apply-local"], consumers: ["cd-verify", "cd-interface-review", "cd-motion-review"] },
  runtime_policy: { default: "zero-cost", enum: ["zero-cost", "allow-paid"], consumers: ["cd-quality-gate", "cd-resource-lab"] },
  provenance_policy: { default: "strict", enum: ["strict", "relaxed"], consumers: ["cd-quality-gate", "cd-resource-lab"] },
};

/** Repo-relative path that must stay inside the repo, not be the root, not be under .git/. */
export function validateRepoRelativeDir(value, repo = REPO) {
  if (typeof value !== "string" || value.trim() === "") return { ok: false, reason: "not a non-empty string" };
  const v = value.trim();
  if (path.isAbsolute(v)) return { ok: false, reason: "must be repo-relative, not absolute" };
  if (v.split(/[\\/]/).includes("..")) return { ok: false, reason: "must not traverse upward with .." };
  const target = path.resolve(repo, v);
  const realRepo = fs.realpathSync(repo);
  // resolve the deepest existing ancestor so a not-yet-created directory can still be validated
  let probe = target;
  while (!exists(probe) && path.dirname(probe) !== probe) probe = path.dirname(probe);
  let realProbe;
  try { realProbe = fs.realpathSync(probe); } catch { return { ok: false, reason: "path cannot be resolved" }; }
  const realTarget = path.join(realProbe, path.relative(probe, target));
  if (exists(target) && !fs.statSync(target).isDirectory()) return { ok: false, reason: "exists and is not a directory" };
  if (realTarget !== realRepo && !realTarget.startsWith(realRepo + path.sep)) return { ok: false, reason: "real path escapes the repository" };
  if (realTarget === realRepo) return { ok: false, reason: "must not be the repository root" };
  const gitDir = path.join(realRepo, ".git");
  if (realTarget === gitDir || realTarget.startsWith(gitDir + path.sep)) return { ok: false, reason: "must not be under .git/" };
  return { ok: true, absolute: target, value: v };
}

export function resolveConfig(repo = REPO) {
  const layers = [
    { name: "config.local.yaml", file: path.join(repo, CONFIG_DIR, "config.local.yaml") },
    { name: "config.yaml", file: path.join(repo, CONFIG_DIR, "config.yaml") },
  ];
  const loaded = layers.map((l) => ({ ...l, present: exists(l.file), values: exists(l.file) ? parseYamlish(read(l.file)) : {} }));
  const resolved = {}, sources = {}, problems = [];
  for (const [key, spec] of Object.entries(CONFIG_KEYS)) {
    let value, source = "default";
    for (const layer of loaded) {
      if (!(key in layer.values)) continue;
      if (spec.repoOnly && layer.name !== "config.yaml") { problems.push(`${key} is read only from config.yaml; the value in ${layer.name} is ignored`); continue; }
      const raw = layer.values[key];
      if (raw === "" || raw === null) continue; // empty falls through to the next layer
      if (spec.enum && !spec.enum.includes(raw)) {
        if (spec.failClosed) { problems.push(`${key}: invalid value ${JSON.stringify(raw)}`); }
        else { problems.push(`${key}: invalid value ${JSON.stringify(raw)} in ${layer.name} — falling through`); continue; }
      }
      value = raw; source = layer.name; break;
    }
    if (value === undefined) { resolved[key] = spec.default; sources[key] = "default"; }
    else { resolved[key] = value; sources[key] = source; }
  }
  // docs_root fails closed: an unusable value stops the run instead of falling back
  const dr = validateRepoRelativeDir(resolved.docs_root, repo);
  const docsRoot = { value: resolved.docs_root, source: sources.docs_root, valid: dr.ok, reason: dr.reason ?? null, absolute: dr.absolute ?? null };
  if (!dr.ok) problems.push(`docs_root invalid (${resolved.docs_root}): ${dr.reason} — Compound Design will not write artifacts until this is fixed`);
  return { repo, layers: loaded.map((l) => ({ name: l.name, present: l.present })), resolved, sources, docsRoot, problems, valid: dr.ok };
}
function artifactDir(cfg, sub) { if (!cfg.valid) fail(`docs_root invalid: ${cfg.docsRoot.reason}`); return path.join(cfg.docsRoot.absolute, sub); }

function cmdConfig(args) {
  const cfg = resolveConfig();
  if (args.includes("--json")) { log(JSON.stringify(cfg, null, 2)); return cfg.valid ? cfg : fail("configuration invalid"); }
  log(`repository        ${cfg.repo}`);
  for (const l of cfg.layers) log(`${l.name.padEnd(18)}${l.present ? "present" : "absent"}`);
  for (const [k, v] of Object.entries(cfg.resolved)) log(`${k.padEnd(18)}${String(v).padEnd(28)}(${cfg.sources[k]})`);
  log(`artifact root     ${cfg.docsRoot.valid ? cfg.docsRoot.absolute : "INVALID — " + cfg.docsRoot.reason}`);
  for (const p of cfg.problems) log(`  ! ${p}`);
  if (!cfg.valid) fail("configuration invalid");
  return cfg;
}

// ---------------------------------------------------------------- discovery (DISCOVERABILITY-CONTRACT.md)
const STOP = new Set(["with", "that", "this", "from", "when", "what", "into", "than", "then", "them", "they", "have", "does", "will", "your", "about", "which", "after", "before", "while", "there", "their", "would", "could", "should", "because"]);
export const DISCOVERY = { maxResults: 7, minScore: 3, weights: { signal: 5, concept: 3, area: 2, title: 1 } };

export function loadSolutions(dir) {
  const out = [];
  for (const f of walk(dir).filter((f) => f.endsWith(".md") && path.basename(f) !== "README.md")) {
    const { frontmatter } = parseFrontmatter(read(f));
    out.push({ file: f, frontmatter });
  }
  return out;
}
export function discover(context, solutions, opts = {}) {
  const ctx = String(context ?? "").toLowerCase();
  const area = opts.area ? String(opts.area).toLowerCase() : null;
  const whole = (needle) => new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(ctx);
  const hits = [];
  for (const s of solutions) {
    const fm = s.frontmatter;
    if (!fm || fm.status === "superseded") continue;
    let score = 0; const why = [];
    for (const sig of [].concat(fm.signals ?? [])) if (sig && ctx.includes(String(sig).toLowerCase())) { score += DISCOVERY.weights.signal; why.push(`signal:${sig}`); }
    for (const c of [].concat(fm.concepts ?? [])) if (c && whole(String(c))) { score += DISCOVERY.weights.concept; why.push(`concept:${c}`); }
    for (const a of [].concat(fm.areas ?? [])) if (a && (whole(String(a)) || (area && String(a).toLowerCase() === area))) { score += DISCOVERY.weights.area; why.push(`area:${a}`); }
    for (const w of String(fm.title ?? "").toLowerCase().split(/[^a-z0-9]+/)) if (w.length >= 4 && !STOP.has(w) && whole(w)) { score += DISCOVERY.weights.title; why.push(`title:${w}`); }
    if (score >= DISCOVERY.minScore) hits.push({ id: fm.id ?? path.basename(s.file), title: fm.title ?? "", file: s.file, date: fm.date ?? "", score, why });
  }
  hits.sort((a, b) => b.score - a.score || String(b.date).localeCompare(String(a.date)));
  return hits.slice(0, DISCOVERY.maxResults);
}
function cmdDiscover(args) {
  const ctxArg = args.indexOf("--context");
  const context = ctxArg >= 0 ? args[ctxArg + 1] : args.filter((a) => !a.startsWith("--"))[0];
  if (!context) fail('usage: cd discover --context "<text>" [--area <a>] [--json]');
  const areaArg = args.indexOf("--area");
  const cfg = resolveConfig();
  if (!cfg.valid) fail(`docs_root invalid: ${cfg.docsRoot.reason}`);
  const dir = artifactDir(cfg, "solutions");
  const hits = discover(context, loadSolutions(dir), { area: areaArg >= 0 ? args[areaArg + 1] : null });
  if (args.includes("--json")) { log(JSON.stringify({ context, root: rel(dir), searched: exists(dir), results: hits.map((h) => ({ ...h, file: rel(h.file) })) }, null, 2)); return hits; }
  if (!exists(dir)) { log(`no solutions store at ${rel(dir)} — prior learning could not be searched (this is not "none found")`); return hits; }
  if (!hits.length) { log(`none found (${loadSolutions(dir).length} documents searched)`); return hits; }
  for (const h of hits) log(`${String(h.score).padStart(2)}  ${h.id}  ${h.title}\n    ${rel(h.file)}  [${h.why.join(", ")}]`);
  return hits;
}

// ---------------------------------------------------------------- contextual claim guard
export const INFLATED_CLAIMS = [
  { re: /\bE[2-4]\s+(?:validated|verified|proven|confirmed)\b/i, why: "asserts an evidence level as validated" },
  { re: /\bvalidated\s+at\s+E[0-4]\b/i, why: "asserts validation at an evidence level" },
  { re: /\bruntime\s+(?:verified|validated|proven)\b/i, why: "asserts runtime verification" },
  { re: /\b(?:proven|demonstrated|measured|reliable)\s+uplift\b/i, why: "asserts uplift" },
  { re: /\bstatistically\s+significant\b/i, why: "asserts statistical significance" },
  { re: /\bproduction[- ]proven\b/i, why: "asserts field evidence" },
  { re: /\bcross[- ]model\s+verified\b/i, why: "asserts independent corroboration" },
  { re: /\b(?:claude|anthropic|openai|google|microsoft|vercel|promptfoo|every|jakub|emil)\s+(?:approved|certified|endorsed)\b/i, why: "asserts vendor endorsement" },
  { re: /\bvalidated\s+by\s+(?:claude|anthropic|openai|google|microsoft|vercel|promptfoo|every)\b/i, why: "asserts external validation" },
  { re: /\bofficially\s+endorsed\b/i, why: "asserts endorsement" },
];
const NEGATION = /(never|not\b|no\b|cannot|can't|without|forbidden|forbid|refus|prohibit|must not|may not|do not|don't|neither|nor\b|≠|instead of|rather than|allowed claim|not allowed|is not|are not|unless|would (?:need|require)|only when|only after|requires)/i;
/** A claim is flagged only when the surrounding line does not negate, forbid or define it. */
export function scanClaims(text, file = "") {
  const out = [];
  const lines = String(text).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const c of INFLATED_CLAIMS) {
      const m = c.re.exec(line);
      if (!m) continue;
      if (NEGATION.test(line)) continue;               // "never claim proven uplift" is the rule, not the violation
      if (/^\s*(?:[-*]|\d+\.)?\s*`[^`]*`\s*$/.test(line)) continue; // a quoted token on its own line is a listed term
      out.push({ file, line: i + 1, text: line.trim().slice(0, 160), match: m[0], why: c.why });
    }
  }
  return out;
}
const CLAIM_SCAN_ROOTS = ["skills", "agents", "docs", "README.md", "STRATEGY.md", ".claude-plugin", ".codex-plugin", ".cursor-plugin", ".compound-design", "src/app", "compound-design/releases", "compound-design/research", "compound-design/FINDING-CONTRACT.md", "compound-design/DISCOVERABILITY-CONTRACT.md"];
function cmdClaims(args) {
  const findings = [];
  for (const r of CLAIM_SCAN_ROOTS) {
    const p = path.join(REPO, r);
    if (!exists(p)) continue;
    const files = fs.statSync(p).isDirectory() ? walk(p) : [p];
    for (const f of files) if (/\.(md|json|ya?ml|tsx?|css)$/.test(f)) findings.push(...scanClaims(read(f), rel(f)));
  }
  if (args.includes("--json")) log(JSON.stringify(findings, null, 2));
  else for (const f of findings) log(`${f.file}:${f.line}  ${f.why}\n    ${f.text}`);
  if (findings.length) fail(`${findings.length} inflated claim(s) on active surfaces`);
  log(`claims ok: no inflated claim on ${CLAIM_SCAN_ROOTS.length} active surfaces (isolated words like "E2", "validated" or "proven" are not flagged; only claims are)`);
  return findings;
}

// ---------------------------------------------------------------- contract suite
const SUITE_PATH = path.join(REPO, "compound-design/quality/evals/v0.3-contract-suite.json");
const ARTIFACT_ROOT_BLOCK_START = "<!-- cd-artifact-root:start -->";
// Legacy v0.2 runtime identifiers. `resource-lab` was the legacy agent name; the active skill
// `cd-resource-lab` keeps its id, so the lookbehind stops it matching itself.
const LEGACY_IDS = [/\bjakub\b/i, /\bemi\b/i, /(?<!cd-)\bresource-lab\b/];

export function checkSkill(id, suite) {
  const file = path.join(REPO, "skills", id, "SKILL.md");
  const problems = [];
  if (!exists(file)) return [`${id}: skills/${id}/SKILL.md missing`];
  const text = read(file);
  const { frontmatter, body } = parseFrontmatter(text);
  if (!frontmatter) return [`${id}: no YAML frontmatter`];
  if (frontmatter.name !== id) problems.push(`${id}: frontmatter name is "${frontmatter.name}", must equal the directory name`);
  if (!frontmatter.description || String(frontmatter.description).length < 40) problems.push(`${id}: description missing or too short to route on`);
  for (const s of suite.groups["v0.3-skill"].requiredSections) if (!new RegExp(`^##\\s+${s}\\s*$`, "m").test(body)) problems.push(`${id}: required section "## ${s}" missing`);
  if (suite.artifactWriters.includes(id) && !text.includes(ARTIFACT_ROOT_BLOCK_START)) problems.push(`${id}: writes artifacts but carries no artifact-root resolution block`);
  if (!suite.artifactWriters.includes(id) && text.includes(ARTIFACT_ROOT_BLOCK_START)) problems.push(`${id}: carries the artifact-root block but is not declared an artifact writer`);
  if (suite.findingEmitters.includes(id) && !body.includes("FINDING-CONTRACT.md")) problems.push(`${id}: emits findings but does not reference the shared finding contract`);
  for (const re of LEGACY_IDS) if (re.test(body.replace(/## Provenance[\s\S]*$/, ""))) problems.push(`${id}: legacy identifier ${re} on an active surface outside provenance`);
  if (/compound-design\/vendor\//.test(body)) problems.push(`${id}: runtime dependency on a vendored upstream checkout`);
  const claims = scanClaims(text, `skills/${id}/SKILL.md`);
  for (const c of claims) problems.push(`${id}: inflated claim at line ${c.line} — ${c.why}`);
  for (const m of body.matchAll(/`(skills\/[a-z0-9-]+\/[A-Za-z.-]+|references\/[a-z0-9.-]+\.md)`/g)) {
    const p = m[1].startsWith("references/") ? path.join(REPO, "skills", id, m[1]) : path.join(REPO, m[1]);
    if (!exists(p)) problems.push(`${id}: broken reference ${m[1]}`);
  }
  return problems;
}

export function checkAgent(id, suite) {
  const file = path.join(REPO, "agents", `${id}.md`);
  const problems = [];
  if (!exists(file)) return [`${id}: agents/${id}.md missing`];
  const text = read(file);
  const { frontmatter, body } = parseFrontmatter(text);
  if (!frontmatter) return [`${id}: no YAML frontmatter`];
  if (frontmatter.name !== id) problems.push(`${id}: frontmatter name is "${frontmatter.name}", must equal the file name`);
  const desc = String(frontmatter.description ?? "");
  if (desc.length < 40) problems.push(`${id}: description missing or too short to route on`);
  if (!/dispatch when/i.test(desc)) problems.push(`${id}: description states no trigger ("Dispatch when …")`);
  if (!/do not dispatch/i.test(desc)) problems.push(`${id}: description states no non-trigger ("Do not dispatch when …")`);
  if (!frontmatter.tools) problems.push(`${id}: no tool policy in frontmatter`);
  for (const s of suite.groups["v0.3-agent"].requiredSections) if (!new RegExp(`^##\\s+${s}\\s*$`, "m").test(body)) problems.push(`${id}: required section "## ${s}" missing`);
  const refs = [...body.matchAll(/`skills\/([a-z0-9-]+)\/SKILL\.md`/g)].map((m) => m[1]);
  if (!refs.length) problems.push(`${id}: references no skill — an agent must point at the procedure it runs`);
  for (const r of refs) if (!exists(path.join(REPO, "skills", r, "SKILL.md"))) problems.push(`${id}: references a skill that does not exist: ${r}`);
  // no duplicated procedure: an agent must not restate the steps its skill owns
  const lines = text.split("\n").length;
  if (lines > suite.groups["v0.3-agent"].maxLines) problems.push(`${id}: ${lines} lines exceeds the ${suite.groups["v0.3-agent"].maxLines}-line limit — an agent that long is restating its skill`);
  const numbered = (body.match(/^\s*\d+\.\s+\*\*/gm) ?? []).length;
  if (numbered >= 3) problems.push(`${id}: contains a ${numbered}-step numbered procedure — the skill owns the procedure, the agent points at it`);
  for (const re of LEGACY_IDS) if (re.test(body.replace(/## Provenance[\s\S]*$/, ""))) problems.push(`${id}: legacy identifier ${re} on an active surface outside provenance`);
  if (/compound-design\/vendor\//.test(text)) problems.push(`${id}: hidden runtime dependency on a vendored upstream checkout`);
  for (const c of scanClaims(text, `agents/${id}.md`)) problems.push(`${id}: inflated claim at line ${c.line} — ${c.why}`);
  return problems;
}

export function checkCarriedOver(id, suite) {
  const file = path.join(REPO, "skills", id, "SKILL.md");
  if (!exists(file)) return [`${id}: skills/${id}/SKILL.md missing`];
  const { frontmatter } = parseFrontmatter(read(file));
  const problems = [];
  if (!frontmatter || frontmatter.name !== id) problems.push(`${id}: frontmatter name must equal the directory name`);
  for (const must of suite.groups["carried-over-skill"].must[id] ?? []) if (!read(file).includes(must)) problems.push(`${id}: missing carried-over assertion "${must}"`);
  return problems;
}

/** The discoverability contract is proved, not asserted: a planted learning must surface for a later, different context. */
export function checkDiscoverability(suite) {
  const problems = [];
  const fixtures = path.join(REPO, suite.discovery.fixtures);
  if (!exists(fixtures)) return [`discovery fixtures missing: ${suite.discovery.fixtures}`];
  const solutions = loadSolutions(fixtures);
  if (!solutions.length) return [`discovery fixtures contain no solution documents`];
  for (const s of solutions) {
    const fm = s.frontmatter;
    if (!fm) { problems.push(`${rel(s.file)}: no frontmatter`); continue; }
    for (const k of suite.discovery.requiredFrontmatter) if (!(k in fm)) problems.push(`${rel(s.file)}: frontmatter key "${k}" missing`);
  }
  for (const c of suite.discovery.cases) {
    const hits = discover(c.context, solutions, {});
    const ids = hits.map((h) => h.id);
    if (c.expect_id && !ids.includes(c.expect_id)) problems.push(`discovery "${c.name}": expected ${c.expect_id} for a later unrelated context, got [${ids.join(", ") || "none"}]`);
    if (c.expect_none && ids.length) problems.push(`discovery "${c.name}": expected no match, got [${ids.join(", ")}]`);
    if (c.expect_absent) for (const a of c.expect_absent) if (ids.includes(a)) problems.push(`discovery "${c.name}": ${a} must not match (it is superseded or irrelevant)`);
    if (hits.length > DISCOVERY.maxResults) problems.push(`discovery "${c.name}": returned ${hits.length} results, bound is ${DISCOVERY.maxResults}`);
  }
  return problems;
}

function loadSuite() { if (!exists(SUITE_PATH)) fail(`contract suite missing: ${rel(SUITE_PATH)}`); return JSON.parse(read(SUITE_PATH)); }
function cmdContracts(args) {
  const suite = loadSuite();
  const groups = [];
  const run = (name, ids, fn) => { const problems = []; for (const id of ids) problems.push(...fn(id, suite)); groups.push({ group: name, resources: ids.length, problems }); return problems; };
  run("v0.3-skill", suite.groups["v0.3-skill"].resources, checkSkill);
  run("carried-over-skill", suite.groups["carried-over-skill"].resources, checkCarriedOver);
  run("v0.3-agent", suite.groups["v0.3-agent"].resources, checkAgent);
  const disc = checkDiscoverability(suite);
  groups.push({ group: "discoverability", resources: suite.discovery.cases.length, problems: disc });
  const failed = groups.filter((g) => g.problems.length);
  const total = groups.reduce((a, g) => a + g.resources, 0);
  const artifact = { suite: suite.version, ran_at: new Date().toISOString().slice(0, 10), evidence_level: failed.length ? "E0" : "E1",
    note: "Deterministic contract evidence only. Passing proves the resources declare and satisfy their contracts; it proves nothing about runtime effectiveness, which remains not measured.",
    checked: total, groups: groups.map((g) => ({ group: g.group, resources: g.resources, passed: g.problems.length === 0, problems: g.problems })) };
  const out = args.find((a) => a.startsWith("--out="))?.split("=")[1] ?? path.join(REPO, "compound-design/quality/releases/v0.3-contract-eval.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(artifact, null, 2) + "\n");
  for (const g of groups) log(`${g.problems.length ? "FAIL" : "ok  "} ${g.group} (${g.resources})${g.problems.length ? "\n - " + g.problems.join("\n - ") : ""}`);
  log(`contracts → ${rel(out)} (${total} checks, ${failed.length ? "FAILED" : "passed"})`);
  if (failed.length) fail(`${failed.length} contract group(s) failed`);
  return artifact;
}

// ---------------------------------------------------------------- plugin validation
const HOST_MANIFESTS = [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json", ".cursor-plugin/marketplace.json"];
const ACTIVE_SURFACES = ["skills", "agents", ".claude-plugin", ".codex-plugin", ".cursor-plugin", ".compound-design", "docs", "README.md", "src/app"];
export function validatePlugin() {
  const problems = [];
  const suite = loadSuite();
  const manifests = {};
  for (const m of HOST_MANIFESTS) {
    const p = path.join(REPO, m);
    if (!exists(p)) { problems.push(`manifest missing: ${m}`); continue; }
    try { manifests[m] = JSON.parse(read(p)); } catch (e) { problems.push(`${m}: invalid JSON — ${e.message}`); }
  }
  const version = manifests[".claude-plugin/plugin.json"]?.version;
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version ?? "")) problems.push(`.claude-plugin/plugin.json: version "${version}" is not semver`);
  for (const [m, j] of Object.entries(manifests)) {
    if (!j || m.endsWith("marketplace.json")) continue;
    if (j.name !== "compound-design") problems.push(`${m}: name must be compound-design`);
    if (j.version !== version) problems.push(`${m}: version ${j.version} differs from the Claude manifest (${version})`);
  }
  for (const m of [".claude-plugin/marketplace.json", ".cursor-plugin/marketplace.json"]) {
    const j = manifests[m]; if (!j) continue;
    if (!Array.isArray(j.plugins) || !j.plugins.length) problems.push(`${m}: no plugins listed`);
    for (const p of j.plugins ?? []) if (p.name !== "compound-design") problems.push(`${m}: lists an unknown plugin "${p.name}"`);
  }
  const codexSkills = manifests[".codex-plugin/plugin.json"]?.skills;
  if (codexSkills !== "./skills/") problems.push(`.codex-plugin/plugin.json: skills must point at the canonical "./skills/", got ${JSON.stringify(codexSkills)}`);

  // discovery + duplicate ids + missing files
  const skillDirs = exists(path.join(REPO, "skills")) ? fs.readdirSync(path.join(REPO, "skills"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  const agentFiles = exists(path.join(REPO, "agents")) ? fs.readdirSync(path.join(REPO, "agents")).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")) : [];
  const declaredSkills = [...suite.groups["v0.3-skill"].resources, ...suite.groups["carried-over-skill"].resources];
  const declaredAgents = suite.groups["v0.3-agent"].resources;
  for (const s of skillDirs) { if (!exists(path.join(REPO, "skills", s, "SKILL.md"))) problems.push(`skills/${s}: no SKILL.md`); if (!declaredSkills.includes(s)) problems.push(`skills/${s} is on disk but not in the contract suite`); }
  for (const s of declaredSkills) if (!skillDirs.includes(s)) problems.push(`${s} is declared but not on disk`);
  for (const a of agentFiles) if (!declaredAgents.includes(a)) problems.push(`agents/${a}.md is on disk but not in the contract suite`);
  for (const a of declaredAgents) if (!agentFiles.includes(a)) problems.push(`agent ${a} is declared but not on disk`);
  const ids = [...skillDirs, ...agentFiles];
  for (const id of new Set(ids)) if (ids.filter((x) => x === id).length > 1) problems.push(`duplicate resource id across skills and agents: ${id}`);
  const names = new Set();
  for (const s of skillDirs) { const fm = parseFrontmatter(read(path.join(REPO, "skills", s, "SKILL.md"))).frontmatter; if (fm?.name) { if (names.has(fm.name)) problems.push(`duplicate frontmatter name: ${fm.name}`); names.add(fm.name); } }

  // no legacy identifier on any active surface (frozen evidence, provenance and history are exempt by construction)
  for (const surface of ACTIVE_SURFACES) {
    const p = path.join(REPO, surface); if (!exists(p)) continue;
    const files = fs.statSync(p).isDirectory() ? walk(p) : [p];
    for (const f of files) {
      if (!/\.(md|json|ya?ml|tsx?|css)$/.test(f)) continue;
      const body = read(f).replace(/## Provenance[\s\S]*$/, "").replace(/^.*(SOURCES\.md|NOTICE|MIGRATION|legacy|Krehel|Kowalski).*$/gm, "");
      for (const re of LEGACY_IDS) if (re.test(body)) problems.push(`legacy identifier ${re} on active surface ${rel(f)}`);
    }
  }
  // the plugin must be installable without any upstream checkout
  for (const f of [...walk(path.join(REPO, "skills")), ...walk(path.join(REPO, "agents"))]) if (/compound-design\/vendor\//.test(read(f))) problems.push(`${rel(f)}: runtime dependency on a vendored upstream checkout`);
  return { problems, version, skills: skillDirs.length, agents: agentFiles.length };
}
function cmdPlugin(args) {
  const r = validatePlugin();
  if (args.includes("--json")) log(JSON.stringify(r, null, 2));
  else { for (const p of r.problems) log(`  ! ${p}`); log(`plugin ${r.problems.length ? "FAILED" : "ok"}: version ${r.version}, ${r.skills} skills, ${r.agents} agents, ${HOST_MANIFESTS.length} host manifests`); }
  if (r.problems.length) fail(`${r.problems.length} plugin problem(s)`);
  return r;
}

// ---------------------------------------------------------------- registry (schema subset + rules)
export function validateAgainstSchema(value, schema, root = schema, at = "") {
  const errs = [];
  const t = (v) => Array.isArray(v) ? "array" : v === null ? "null" : typeof v;
  if (schema.const !== undefined && value !== schema.const) errs.push(`${at || "/"}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${at || "/"}: must be one of ${schema.enum.join(", ")}`);
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.includes(t(value)) && !(types.includes("number") && t(value) === "number")) errs.push(`${at || "/"}: expected ${types.join("|")}, got ${t(value)}`);
  }
  if (typeof value === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errs.push(`${at}: does not match ${schema.pattern}`);
    if (schema.minLength && value.length < schema.minLength) errs.push(`${at}: shorter than ${schema.minLength}`);
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errs.push(`${at}: below ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errs.push(`${at}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) errs.push(`${at}: needs at least ${schema.minItems} item(s)`);
    if (schema.items) value.forEach((v, i) => errs.push(...validateAgainstSchema(v, schema.items, root, `${at}[${i}]`)));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const r of schema.required ?? []) if (!(r in value)) errs.push(`${at}: required property "${r}" missing`);
    for (const [k, v] of Object.entries(value)) {
      const sub = schema.properties?.[k];
      if (!sub) { if (schema.additionalProperties === false) errs.push(`${at}: unknown property "${k}"`); continue; }
      errs.push(...validateAgainstSchema(v, sub, root, `${at}.${k}`));
    }
  }
  if (schema.anyOf) { const ok = schema.anyOf.some((s) => validateAgainstSchema(value, s, root, at).length === 0); if (!ok) errs.push(`${at}: matches none of the allowed shapes`); }
  return errs;
}
function cmdRegistry(args) {
  const regPath = path.join(REPO, "compound-design/registry/resource-registry.json");
  const schemaPath = path.join(REPO, "compound-design/registry/resource.schema.json");
  const registry = JSON.parse(read(regPath));
  const schema = JSON.parse(read(schemaPath));
  const problems = validateAgainstSchema(registry, schema);
  const suite = loadSuite();
  const declared = new Set([...suite.groups["v0.3-skill"].resources, ...suite.groups["carried-over-skill"].resources, ...suite.groups["v0.3-agent"].resources]);
  const active = registry.resources.filter((r) => (r.status ?? "active") === "active");
  for (const r of active) if (!declared.has(r.id)) problems.push(`registry: active resource "${r.id}" is not in the contract suite`);
  for (const d of declared) if (!active.some((r) => r.id === d)) problems.push(`registry: "${d}" is in the contract suite but not an active registry resource`);
  for (const r of registry.resources) {
    if ((r.status ?? "active") === "superseded" && !r.supersededBy) problems.push(`registry: ${r.id} is superseded but names no successor`);
    if (r.cel !== "E0" && r.cel !== "E1" && (r.status ?? "active") === "active") problems.push(`registry: ${r.id} claims ${r.cel}; no active resource may exceed E1 in this release`);
    for (const c of scanClaims(JSON.stringify(r), "registry")) problems.push(`registry: ${r.id} inflated claim — ${c.why}`);
  }
  if (args.includes("--json")) log(JSON.stringify({ problems, resources: registry.resources.length, active: active.length }, null, 2));
  else { for (const p of problems) log(`  ! ${p}`); log(`registry ${problems.length ? "FAILED" : "ok"}: ${registry.resources.length} resources (${active.length} active), release ${registry.release}`); }
  if (problems.length) fail(`${problems.length} registry problem(s)`);
  return { problems };
}

// ---------------------------------------------------------------- setup-check
function cmdSetupCheck(args) {
  const cfg = resolveConfig();
  const has = (cmd) => spawnSync(cmd, ["--version"], { encoding: "utf8" }).status === 0;
  const gitRoot = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: REPO, encoding: "utf8" });
  const gitignore = exists(path.join(REPO, ".gitignore")) ? read(path.join(REPO, ".gitignore")) : "";
  const localFile = path.join(REPO, CONFIG_DIR, "config.local.yaml");
  const report = {
    repository: gitRoot.status === 0 ? gitRoot.stdout.trim() : null,
    plugin_version: exists(path.join(REPO, ".claude-plugin/plugin.json")) ? JSON.parse(read(path.join(REPO, ".claude-plugin/plugin.json"))).version : null,
    artifact_root: { value: cfg.docsRoot.value, source: cfg.sources.docs_root, valid: cfg.docsRoot.valid, reason: cfg.docsRoot.reason, exists: cfg.docsRoot.absolute ? exists(cfg.docsRoot.absolute) : false },
    config: {
      "config.yaml": exists(path.join(REPO, CONFIG_DIR, "config.yaml")) ? "present" : "absent",
      "config.example.yaml": exists(path.join(REPO, CONFIG_DIR, "config.example.yaml")) ? "present" : "absent",
      "config.local.yaml": exists(localFile) ? (/\.compound-design\/\*\.local\.yaml/.test(gitignore) ? "present, gitignored" : "present, NOT gitignored") : "absent",
    },
    resolved: cfg.resolved, sources: cfg.sources,
    artifact_directories: Object.fromEntries(["frames", "plans", "solutions", "handoffs"].map((d) => [d, cfg.docsRoot.absolute ? (exists(path.join(cfg.docsRoot.absolute, d)) ? "present" : "created on first write") : "unknown"])),
    capabilities: {
      git: { available: has("git"), unlocks: "change detection, handoff file state, provenance" },
      node: { available: true, version: process.version, unlocks: "every deterministic check in this tooling" },
      browser: { available: Boolean(process.env.PLAYWRIGHT_BROWSERS_PATH) || exists("/opt/pw-browsers"), unlocks: "rendered verification in cd-verify and cd-interface-review; without it, rendered claims stay not-verified" },
    },
    problems: cfg.problems,
    project_issues: cfg.problems.length + (exists(localFile) && !/\.compound-design\/\*\.local\.yaml/.test(gitignore) ? 1 : 0) + (exists(path.join(REPO, CONFIG_DIR, "config.yaml")) ? 0 : 1),
    note: "Diagnosis only. This check writes nothing and calls no model. cd-setup offers each repo-local fix; nothing is applied without approval.",
  };
  if (args.includes("--json")) { log(JSON.stringify(report, null, 2)); return report; }
  log(`repository     ${report.repository ?? "not a git repository"}`);
  log(`plugin         ${report.plugin_version ?? "unknown"}`);
  log(`artifact root  ${report.artifact_root.value} (${report.artifact_root.source})${report.artifact_root.valid ? "" : " — INVALID: " + report.artifact_root.reason}`);
  for (const [k, v] of Object.entries(report.config)) log(`${k.padEnd(22)} ${v}`);
  for (const [k, v] of Object.entries(report.capabilities)) log(`${k.padEnd(22)} ${v.available ? "available" : "missing"} — ${v.unlocks}`);
  for (const p of report.problems) log(`  ! ${p}`);
  log(`project issues ${report.project_issues}`);
  return report;
}

// ---------------------------------------------------------------- self-test
function cmdSelfTest() {
  const results = [];
  const t = (name, cond, why = "") => results.push({ name, ok: !!cond, why });
  const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "cd-selftest-"));

  // configuration: precedence, fall-through, fail-closed, path safety
  { const d = tmp(); spawnSync("git", ["init", "-q", d]); fs.mkdirSync(path.join(d, CONFIG_DIR), { recursive: true }); fs.mkdirSync(path.join(d, "docs"));
    fs.writeFileSync(path.join(d, CONFIG_DIR, "config.yaml"), "default_review_mode: report-only\ndocs_root: docs\n");
    fs.writeFileSync(path.join(d, CONFIG_DIR, "config.local.yaml"), "default_review_mode: apply-local\n");
    let c = resolveConfig(d);
    t("config: local layer overrides repo layer", c.resolved.default_review_mode === "apply-local", c.resolved.default_review_mode);
    fs.writeFileSync(path.join(d, CONFIG_DIR, "config.local.yaml"), "default_review_mode: nonsense\n");
    c = resolveConfig(d);
    t("config: invalid value falls through to the next layer", c.resolved.default_review_mode === "report-only" && c.problems.some((p) => /invalid value/.test(p)), c.resolved.default_review_mode);
    fs.writeFileSync(path.join(d, CONFIG_DIR, "config.local.yaml"), "docs_root: elsewhere\n");
    c = resolveConfig(d);
    t("config: docs_root in the local layer is ignored", c.resolved.docs_root === "docs" && c.problems.some((p) => /read only from config\.yaml/.test(p)), c.resolved.docs_root);
    fs.rmSync(path.join(d, CONFIG_DIR, "config.local.yaml"));
    fs.writeFileSync(path.join(d, CONFIG_DIR, "config.yaml"), "docs_root: ../escape\n");
    c = resolveConfig(d);
    t("config: docs_root fails closed and never falls back to docs", !c.valid && c.problems.some((p) => /docs_root invalid/.test(p)));
    for (const [val, why] of [["../escape", "traversal"], ["/etc", "absolute"], [".", "repository root"], [".git/hooks", "under .git"], ["", "empty"]])
      t(`config: docs_root rejects ${why}`, validateRepoRelativeDir(val, d).ok === false, val);
    t("config: a plain repo-relative directory is accepted", validateRepoRelativeDir("docs/artifacts", d).ok === true);
    fs.symlinkSync(os.tmpdir(), path.join(d, "outside"));
    t("config: docs_root rejects a symlink escaping the repository", validateRepoRelativeDir("outside", d).ok === false);
    fs.rmSync(d, { recursive: true, force: true }); }

  // contextual claim guard
  t("claims: flags an inflated uplift claim", scanClaims("The rewrite delivered proven uplift over the baseline.").length === 1);
  t("claims: flags vendor endorsement", scanClaims("This resource is Anthropic approved.").length === 1);
  t("claims: flags runtime verification", scanClaims("Behaviour is runtime verified across hosts.").length === 1);
  t("claims: does NOT flag the isolated word E2", scanClaims("The E2 pilot is pre-registered and not executed.").length === 0);
  t("claims: does NOT flag the isolated word validated", scanClaims("Nothing here is validated; runtime uplift stays not measured.").length === 0);
  t("claims: does NOT flag a negated claim", scanClaims("Never write proven uplift without an artifact.").length === 0);
  t("claims: does NOT flag a forbidden-terms list entry", scanClaims("- `runtime verified`").length === 0);
  t("claims: does NOT flag the CEL ladder definition", scanClaims("Allowed claim: demonstrated uplift in tested scope").length === 0);

  // discovery
  { const sols = [
      { file: "a.md", frontmatter: { id: "CD-SOL-1", title: "Silent failure when the form posts without a CSRF token", areas: ["forms"], concepts: ["csrf"], signals: ["InvalidAuthenticityToken"], status: "active", date: "2026-01-01" } },
      { file: "b.md", frontmatter: { id: "CD-SOL-2", title: "Old routing note", areas: ["routing"], concepts: ["router"], signals: ["useRouter"], status: "superseded", date: "2026-02-01" } },
      { file: "c.md", frontmatter: { id: "CD-SOL-3", title: "Unrelated build cache note", areas: ["build"], concepts: ["cache"], signals: ["turbo"], status: "active", date: "2026-03-01" } },
    ];
    let r = discover("the checkout page throws InvalidAuthenticityToken after deploy", sols);
    t("discovery: a signal surfaces the learning in a different later context", r[0]?.id === "CD-SOL-1", JSON.stringify(r.map((x) => x.id)));
    r = discover("we are adding a new form to the settings page and worry about csrf", sols);
    t("discovery: concept plus area surfaces the learning", r.some((x) => x.id === "CD-SOL-1"), JSON.stringify(r.map((x) => x.id)));
    r = discover("useRouter navigation question", sols);
    t("discovery: superseded documents never surface", !r.some((x) => x.id === "CD-SOL-2"));
    r = discover("completely unrelated question about invoicing", sols);
    t("discovery: weak matches are dropped rather than padded", r.length === 0, JSON.stringify(r.map((x) => x.id)));
    t("discovery: results are bounded", discover("csrf forms build cache turbo InvalidAuthenticityToken", sols).length <= DISCOVERY.maxResults); }

  // frontmatter parsing
  { const { frontmatter } = parseFrontmatter("---\nname: x\nareas: [a, b]\nsignals:\n  - \"lit: eral\"\ntools: Read, Grep\n---\nbody\n");
    t("frontmatter: inline arrays parse", Array.isArray(frontmatter.areas) && frontmatter.areas.length === 2);
    t("frontmatter: block arrays parse with colons inside quotes", frontmatter.signals?.[0] === "lit: eral", JSON.stringify(frontmatter.signals)); }

  // schema validator catches the class of bug that let publicName through unnoticed
  { const schema = { type: "object", required: ["id"], properties: { id: { type: "string" } }, additionalProperties: false };
    t("schema: unknown property rejected", validateAgainstSchema({ id: "a", extra: 1 }, schema).some((e) => /unknown property/.test(e)));
    t("schema: required property enforced", validateAgainstSchema({}, schema).some((e) => /required property/.test(e)));
    t("schema: a valid object passes", validateAgainstSchema({ id: "a" }, schema).length === 0); }

  // resource contract checks reject their mutations
  { const suite = loadSuite();
    t("contracts: every declared skill passes", suite.groups["v0.3-skill"].resources.every((id) => checkSkill(id, suite).length === 0),
      suite.groups["v0.3-skill"].resources.flatMap((id) => checkSkill(id, suite)).join("; "));
    t("contracts: every declared agent passes", suite.groups["v0.3-agent"].resources.every((id) => checkAgent(id, suite).length === 0),
      suite.groups["v0.3-agent"].resources.flatMap((id) => checkAgent(id, suite)).join("; "));
    const f = path.join(REPO, "agents/interface-reviewer.md"); const orig = read(f);
    try {
      fs.writeFileSync(f, orig.replace(/`skills\/cd-interface-review\/SKILL\.md`/, "the review procedure"));
      t("contracts: an agent with no skill reference is rejected", checkAgent("interface-reviewer", suite).some((p) => /references no skill/.test(p)));
      fs.writeFileSync(f, orig.replace("## Procedure", "## Procedure\n\n1. **Step one** do it.\n2. **Step two** do it.\n3. **Step three** do it.\n"));
      t("contracts: an agent restating a procedure is rejected", checkAgent("interface-reviewer", suite).some((p) => /numbered procedure/.test(p)));
      fs.writeFileSync(f, orig.replace(/^tools:.*$/m, ""));
      t("contracts: an agent with no tool policy is rejected", checkAgent("interface-reviewer", suite).some((p) => /tool policy/.test(p)));
      fs.writeFileSync(f, orig.replace(/Do not dispatch when [^.]+\./, ""));
      t("contracts: an agent with no non-trigger is rejected", checkAgent("interface-reviewer", suite).some((p) => /non-trigger/.test(p)));
      fs.writeFileSync(f, orig.replace("## Tool policy", "## Tool policy\n\nReads `compound-design/vendor/jakub-skills/` at runtime.\n"));
      t("contracts: a hidden upstream runtime dependency is rejected", checkAgent("interface-reviewer", suite).some((p) => /vendored upstream/.test(p)));
    } finally { fs.writeFileSync(f, orig); }
    const s = path.join(REPO, "skills/cd-frame/SKILL.md"); const sorig = read(s);
    try {
      fs.writeFileSync(s, sorig.replace("## Write authority", "## Ownership"));
      t("contracts: a skill missing a required section is rejected", checkSkill("cd-frame", suite).some((p) => /required section/.test(p)));
      fs.writeFileSync(s, sorig.replace(ARTIFACT_ROOT_BLOCK_START, "<!-- removed -->"));
      t("contracts: an artifact writer without the root block is rejected", checkSkill("cd-frame", suite).some((p) => /artifact-root resolution block/.test(p)));
      fs.writeFileSync(s, sorig.replace("## Forbidden", "This produced proven uplift.\n\n## Forbidden"));
      t("contracts: an inflated claim inside a skill is rejected", checkSkill("cd-frame", suite).some((p) => /inflated claim/.test(p)));
    } finally { fs.writeFileSync(s, sorig); } }

  // plugin gates
  t("plugin: the package validates", validatePlugin().problems.length === 0, validatePlugin().problems.join("; "));

  const passed = results.filter((r) => r.ok).length;
  for (const r of results) log(`${r.ok ? "ok  " : "FAIL"} ${r.name}${!r.ok && r.why ? " — " + String(r.why).slice(0, 160) : ""}`);
  log(`cd self-test: ${passed}/${results.length} checks passed`);
  fs.writeFileSync(path.join(REPO, "compound-design/quality/releases/v0.3-selftest.json"), JSON.stringify({ ran_at: new Date().toISOString().slice(0, 10), passed, total: results.length, results }, null, 2) + "\n");
  if (passed !== results.length) process.exit(1);
}

// ---------------------------------------------------------------- main
const HELP = `Compound Design tooling — deterministic, zero-model, zero-network

  cd setup-check [--json]        repository health, resolved artifact root, optional capabilities
  cd config [--json]             resolve and validate configuration (docs_root fails closed)
  cd discover --context "<text>" bounded deterministic search of the durable learning store
  cd contracts [--out=<file>]    resource contract suite for skills, agents and discoverability
  cd plugin [--json]             manifests, component discovery, duplicate ids, legacy leaks, self-containment
  cd registry [--json]           registry against its schema and the evidence rules
  cd claims [--json]             contextual claim guard (claims, not isolated words)
  cd selftest                    mutation tests for every gate above
  cd all                         registry, contracts, plugin, claims
`;
function main() {
  const [cmd = "help", ...args] = process.argv.slice(2);
  try {
    switch (cmd) {
      case "help": log(HELP); break;
      case "setup-check": cmdSetupCheck(args); break;
      case "config": cmdConfig(args); break;
      case "discover": cmdDiscover(args); break;
      case "contracts": cmdContracts(args); break;
      case "plugin": cmdPlugin(args); break;
      case "registry": cmdRegistry(args); break;
      case "claims": cmdClaims(args); break;
      case "selftest": cmdSelfTest(args); break;
      case "all": cmdRegistry([]); cmdContracts([]); cmdPlugin([]); cmdClaims([]); break;
      default: console.error(`unknown command: ${cmd}\n${HELP}`); process.exit(1);
    }
  } catch (e) {
    if (e.isGate) { console.error(`cd ${cmd}: ${e.message}`); process.exit(1); }
    throw e;
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
