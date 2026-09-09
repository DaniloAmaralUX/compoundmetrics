#!/usr/bin/env node
/*
 * Compound Design — E2 benchmark harness (zero-cost by default).
 *
 * Every subcommand except `paid-runtime` is deterministic and never calls a model.
 * `paid-runtime` aborts unless E2_PAID_RUNTIME_CONFIRMED === "YES".
 *
 * Evidence boundary: nothing produced here raises CEL. Synthetic fixtures used by
 * `self-test` and `dry-run` are labelled SYNTHETIC and are never model output.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const E2 = path.resolve(HERE, "..");
const REPO = path.resolve(E2, "../../..");
const require = createRequire(import.meta.url);

// ---------------------------------------------------------------- constants
const PAID_FLAG = "E2_PAID_RUNTIME_CONFIRMED";
const BLOCK_MESSAGE = "Blocked: E2 model runtime requires explicit paid-runtime authorization.";

export const UPSTREAM = {
  jakub: {
    repo: "https://github.com/jakubkrehel/skills",
    sha: "267330e1adfc66a718fb65fa6918c1f06d0a689e",
    dir: path.join(REPO, "compound-design/vendor/jakub-skills"),
    license: "LICENSE",
  },
  // reference-only pins (not cloned by this harness)
  emil: { repo: "https://github.com/emilkowalski/skills", sha: "d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7" },
  every: { repo: "https://github.com/EveryInc/compound-engineering-plugin", sha: "b36047e1b4b2123df2f3529bf04b5f2a7c5f84e4" },
};

export const SUITES = {
  jakub: {
    id: "interface-review",
    tasks: path.join(E2, "tasks/jakub-tests.yaml"),
    fixtures: path.join(E2, "tasks/fixtures/jakub"),
    conditions: ["A", "B", "C", "D"],
    dSubset: ["J01", "J02", "J05"], // pre-registered diagnostic lane, fixed before any output
    minHoldoutShare: 0.3,
  },
  qg: {
    id: "quality-gate",
    tasks: path.join(E2, "tasks/cd-quality-gate-tests.yaml"),
    fixtures: path.join(E2, "tasks/fixtures/qg"),
    conditions: ["A", "C"],
    dSubset: [],
    minHoldoutShare: 0.3,
  },
};

export const ALLOWED_PROVENANCE = new Set([
  "fixture-fact", "wcag-normative", "computed-contrast", "axe", "playwright", "product-requirement", "policy-rule",
]);
export const LEAK_PATTERNS = [
  /holdout/i, /root cause/i, /\bcompound\b/i, /\bjakub\b/i, /\bemi\b/i, /cd-[a-z-]+/i, /\bupstream\b/i,
  /treat (it|this) as/i, /this is (a|an) (test|eval)/i, /quality gate/i, /resource lab/i,
];
// Identifiers redacted from blinded payloads (format fingerprints cannot be removed — declared limitation).
export const REDACT_PATTERNS = [
  /jakub krehel/gi, /\bjakub\b/gi, /compound design/gi, /\bcompound\b/gi, /better-(interface|ui|layout|typography|colors|accessibility|writing)/gi,
  /\binterfaces:[a-z-]+/gi, /\bemi\b/gi, /\bcd-[a-z-]+/gi, /\bupstream\b/gi, /emil kowalski/gi, /supernova/gi,
];
const MODEL_PROVIDER_PATTERNS = [/anthropic:/i, /openai:/i, /azure:?/i, /vertex:/i, /bedrock:/i, /claude-agent-sdk/i, /claude-code/i, /ollama:/i, /google:/i, /mistral:/i];
const MODEL_GRADED_ASSERTS = new Set(["llm-rubric", "model-graded-closedqa", "model-graded-factuality", "factuality", "similar", "g-eval", "select-best", "answer-relevance", "context-recall", "context-relevance", "context-faithfulness", "pi", "agent-rubric", "search-rubric", "max-score", "moderation"]);

// Pricing snapshot used ONLY for the future-cost estimate (USD per 1M tokens, first-party API, cached 2026-06-24).
const PRICES = {
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-opus-5": { input: 5, output: 25 },
  "claude-haiku-4-5": { input: 1, output: 5 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
};
// Per-run token assumptions — estimates only, to be replaced by measured smoke telemetry.
const RUN_ASSUMPTIONS = { A: { input: 6000, output: 1500 }, B: { input: 30000, output: 2000 }, C: { input: 20000, output: 2000 }, D: { input: 12000, output: 2000 }, judge: { input: 4000, output: 800 } };

// ---------------------------------------------------------------- utils
const log = (...a) => console.log(...a);
const fail = (msg) => { const e = new Error(msg); e.isGate = true; throw e; };
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const readText = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);
const rel = (p) => path.relative(REPO, p) || ".";
function yaml() {
  try { return require(path.join(E2, "node_modules/js-yaml")); }
  catch { fail("js-yaml not available: run `npm run e2:install` first (installs the pinned harness under compound-design/quality/e2)."); }
}
function loadYaml(p) { return yaml().load(readText(p)); }
function dumpYaml(obj) { return yaml().dump(obj, { lineWidth: 120, noRefs: true }); }
function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (ent.name === "node_modules" || ent.name === ".git") continue; walk(p, out); }
    else out.push(p);
  }
  return out;
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name), d = path.join(dst, ent.name);
    if (ent.name === ".git" || ent.name === "node_modules") continue;
    if (ent.isDirectory()) copyDir(s, d); else { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); }
  }
}
function git(args, cwd = REPO, opts = {}) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", ...opts });
  if (r.status !== 0 && !opts.allowFail) fail(`git ${args.join(" ")} failed: ${(r.stderr || r.stdout || "").trim()}`);
  return (r.stdout || "").trim();
}
function seededRandom(seed) {
  let s = (typeof seed === "number" ? seed : parseInt(sha256(String(seed)).slice(0, 8), 16)) >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/** Environment handed to any spawned tool: strips every credential-looking variable. */
function scrubbedEnv(extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/(API[_-]?KEY|AUTH[_-]?TOKEN|SECRET|PASSWORD|CREDENTIAL|^ANTHROPIC_|^OPENAI_|^AZURE_|^AWS_|^GOOGLE_|^CLAUDE_CODE_)/i.test(k)) continue;
    env[k] = v;
  }
  return { ...env, PROMPTFOO_DISABLE_TELEMETRY: "1", PROMPTFOO_DISABLE_UPDATE: "1", PROMPTFOO_DISABLE_SHARING: "1", PROMPTFOO_DISABLE_REMOTE_GENERATION: "true", PROMPTFOO_SELF_HOSTED: "1", PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1", ...extra };
}

// ---------------------------------------------------------------- contrast (WCAG 2.x relative luminance)
export function contrastRatio(hexA, hexB) {
  const lum = (hex) => {
    const h = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [l1, l2] = [lum(hexA), lum(hexB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
function checkContrastVerify(verify) {
  const m = /^contrast\((#[0-9a-f]{6}),(#[0-9a-f]{6})\)\s*(<|>=)\s*([\d.]+)$/i.exec(verify.trim());
  if (!m) return null;
  const ratio = contrastRatio(m[1], m[2]);
  const ok = m[3] === "<" ? ratio < Number(m[4]) : ratio >= Number(m[4]);
  return { ratio: Number(ratio.toFixed(2)), ok };
}

// ---------------------------------------------------------------- tasks
export function loadSuite(key, override) {
  const suite = SUITES[key];
  const tests = override ?? loadYaml(suite.tasks);
  if (!Array.isArray(tests) || tests.length === 0) fail(`${key}: task file must be a non-empty list`);
  return tests.map((t) => ({ ...t, metadata: t.metadata ?? {} }));
}

export function validateTasks(key, tests) {
  const suite = SUITES[key];
  const errors = [];
  const ids = new Set();
  const total = tests.length;
  let holdouts = 0;
  for (const t of tests) {
    const m = t.metadata;
    const tag = `[${key}:${m.id ?? "?"}]`;
    if (!m.id) errors.push(`${tag} metadata.id missing`);
    if (ids.has(m.id)) errors.push(`${tag} duplicate id`);
    ids.add(m.id);
    if (m.suite !== suite.id) errors.push(`${tag} metadata.suite must be ${suite.id}`);
    if (typeof m.holdout !== "boolean") errors.push(`${tag} metadata.holdout must be boolean`);
    if (m.holdout) holdouts += 1;
    const prompt = String(t.vars?.request ?? "");
    if (!prompt.trim()) errors.push(`${tag} vars.request missing`);
    for (const re of LEAK_PATTERNS) if (re.test(prompt)) errors.push(`${tag} prompt language leak: ${re}`);
    for (const f of m.workspace_files ?? []) if (!exists(path.join(suite.fixtures, f))) errors.push(`${tag} workspace file missing in fixtures: ${f}`);
    for (const f of m.absent_files ?? []) if (exists(path.join(suite.fixtures, f))) errors.push(`${tag} absent_files entry exists in fixtures: ${f}`);
    if (key === "jakub") {
      if (typeof m.d_subset !== "boolean") errors.push(`${tag} metadata.d_subset must be boolean`);
      if (!Array.isArray(m.expected) || m.expected.length === 0) errors.push(`${tag} expected[] missing`);
      for (const e of m.expected ?? []) {
        const et = `${tag} expected ${e.id ?? "?"}`;
        if (!e.id || !e.issue) errors.push(`${et} needs id and issue`);
        if (e.class !== "deterministic") errors.push(`${et} class must be deterministic (semantic items belong in pending_human)`);
        if (!Array.isArray(e.provenance) || e.provenance.length === 0) errors.push(`${et} provenance missing`);
        for (const p of e.provenance ?? []) if (!ALLOWED_PROVENANCE.has(p)) errors.push(`${et} provenance not allowed: ${p}`);
        if (typeof e.critical !== "boolean") errors.push(`${et} critical must be boolean`);
        if (!["strict", "arguable"].includes(e.strength)) errors.push(`${et} strength must be strict|arguable`);
        if (!e.verify) errors.push(`${et} verify missing`);
        const c = e.verify ? checkContrastVerify(String(e.verify)) : null;
        if (c && !c.ok) errors.push(`${et} contrast claim does not hold (ratio ${c.ratio})`);
        if (c && !(e.provenance ?? []).includes("computed-contrast")) errors.push(`${et} contrast verify requires provenance computed-contrast`);
      }
      for (const d of m.decoys ?? []) {
        const dt = `${tag} decoy ${d.id ?? "?"}`;
        if (!d.id || !d.claim) errors.push(`${dt} needs id and claim`);
        if (d.status === "unresolved") continue;
        if (!d.why_not_issue || !d.verify) errors.push(`${dt} needs why_not_issue and verify (or status: unresolved)`);
      }
      for (const h of m.pending_human ?? []) {
        if (!h.id || !h.hypothesis) errors.push(`${tag} pending_human item needs id and hypothesis`);
        if (h.status !== "PENDING HUMAN AUTHORING") errors.push(`${tag} pending_human ${h.id} status must be PENDING HUMAN AUTHORING`);
      }
    }
    if (key === "qg") {
      const d = m.expected_decision;
      if (!d || !d.status || !Array.isArray(d.must_identify)) errors.push(`${tag} expected_decision{status, must_identify[]} missing`);
      if (!Array.isArray(m.acceptable_equivalents) || m.acceptable_equivalents.length === 0) errors.push(`${tag} acceptable_equivalents missing`);
      if (!Array.isArray(m.forbidden_claims) || m.forbidden_claims.length === 0) errors.push(`${tag} forbidden_claims missing`);
      if (m.ground_truth_class !== "deterministic") errors.push(`${tag} ground_truth_class must be deterministic`);
      for (const p of m.provenance ?? []) if (!ALLOWED_PROVENANCE.has(p)) errors.push(`${tag} provenance not allowed: ${p}`);
      if (!m.provenance?.length) errors.push(`${tag} provenance missing`);
    }
    for (const a of t.assert ?? []) if (MODEL_GRADED_ASSERTS.has(a.type)) errors.push(`${tag} model-graded assertion not allowed in the frozen task file: ${a.type}`);
  }
  const share = holdouts / total;
  if (share < suite.minHoldoutShare) errors.push(`[${key}] holdout share ${(share * 100).toFixed(0)}% < ${suite.minHoldoutShare * 100}% (${holdouts}/${total})`);
  if (key === "jakub") {
    const d = tests.filter((t) => t.metadata.d_subset).map((t) => t.metadata.id);
    if (d.length !== suite.dSubset.length || d.some((id) => !suite.dSubset.includes(id))) errors.push(`[jakub] d_subset must be exactly ${suite.dSubset.join(",")} (found ${d.join(",") || "none"})`);
    for (const t of tests) if (t.metadata.d_subset && t.metadata.holdout) errors.push(`[jakub:${t.metadata.id}] d_subset tasks must not be holdouts`);
  }
  return { errors, total, holdouts, share };
}

// ---------------------------------------------------------------- upstream
export function verifyUpstream(dir = UPSTREAM.jakub.dir, pin = UPSTREAM.jakub) {
  if (!exists(path.join(dir, ".git"))) fail(`upstream missing: ${rel(dir)} (run \`e2 fetch-upstream\`)`);
  const head = git(["rev-parse", "HEAD"], dir);
  if (head !== pin.sha) fail(`upstream SHA mismatch in ${rel(dir)}: HEAD ${head} != pinned ${pin.sha}`);
  if (!exists(path.join(dir, pin.license ?? "LICENSE"))) fail(`upstream LICENSE missing in ${rel(dir)}`);
  return { dir, sha: head, license_sha256: sha256(fs.readFileSync(path.join(dir, pin.license ?? "LICENSE"))) };
}
function cmdFetchUpstream(args) {
  const offline = args.includes("--offline");
  const pin = UPSTREAM.jakub;
  if (!exists(path.join(pin.dir, ".git"))) {
    fs.mkdirSync(path.dirname(pin.dir), { recursive: true });
    log(`cloning ${pin.repo} → ${rel(pin.dir)} (pinned ${pin.sha.slice(0, 12)})`);
    git(["clone", "--quiet", pin.repo, pin.dir]);
  }
  git(["fetch", "--quiet", "origin"], pin.dir, { allowFail: true });
  git(["checkout", "--quiet", "--detach", pin.sha], pin.dir);
  const v = verifyUpstream(pin.dir, pin);
  let remoteHead = null, drift = null;
  if (!offline) {
    const out = git(["ls-remote", pin.repo, "HEAD"], REPO, { allowFail: true });
    remoteHead = out.split(/\s+/)[0] || null;
    drift = remoteHead ? remoteHead !== pin.sha : null;
  }
  const record = { repo: pin.repo, pinned_sha: pin.sha, checked_out_sha: v.sha, license_sha256: v.license_sha256, remote_head: remoteHead, drift, verified_at: new Date().toISOString(), pin_policy: "pins never change automatically; drift is recorded only" };
  fs.writeFileSync(path.join(path.dirname(pin.dir), "jakub-skills.pin.json"), JSON.stringify(record, null, 2) + "\n");
  log(`upstream ok: ${v.sha.slice(0, 12)} license ${v.license_sha256.slice(0, 12)} drift=${drift === null ? "not checked" : drift}`);
  if (drift) log("DRIFT: upstream HEAD moved. Pin NOT changed. Record the delta in SOURCE-PARITY before any decision.");
  return record;
}

// ---------------------------------------------------------------- workspaces
const WORKSPACE_FORBIDDEN_NAMES = [/(^|\/)tasks\//, /(^|\/)rubrics\//, /tests\.ya?ml$/, /tasks\.json$/, /ground-truth\//, /results\//];
const WORKSPACE_FORBIDDEN_CONTENT = [/expected_decision/, /\bexpected:\s*$/m, /\bdecoys\b/, /pending_human/, /acceptable_equivalents/, /forbidden_claims/, /must_identify/];
export function scanWorkspace(dir) {
  const problems = [];
  for (const f of walk(dir)) {
    const r = path.relative(dir, f);
    if (WORKSPACE_FORBIDDEN_NAMES.some((re) => re.test(r))) problems.push(`forbidden path in workspace: ${r}`);
    let text = "";
    try { text = readText(f); } catch { continue; }
    for (const re of WORKSPACE_FORBIDDEN_CONTENT) if (re.test(text)) problems.push(`ground-truth marker ${re} found in workspace file ${r}`);
  }
  return problems;
}
function workspaceRoot() { return path.join(E2, ".workspaces"); }
function cmdWorkspaces(args) {
  const allowMissingVendor = args.includes("--allow-missing-vendor");
  const root = workspaceRoot();
  fs.rmSync(root, { recursive: true, force: true });
  const manifest = { generated_at: new Date().toISOString(), note: "Disposable, gitignored. Each condition sees only fixtures plus its own resource files. No task file, rubric or ground truth is ever copied here.", suites: {} };
  let vendor = null;
  try { vendor = verifyUpstream(); } catch (e) { if (!allowMissingVendor) throw e; log(`warning: ${e.message} — conditions B/C will be marked unavailable`); }
  for (const [key, suite] of Object.entries(SUITES)) {
    const tests = loadSuite(key);
    manifest.suites[key] = {};
    for (const cond of suite.conditions) {
      const ws = path.join(root, key, cond);
      copyDir(suite.fixtures, ws);
      const extras = [];
      if (key === "jakub" && (cond === "C" || cond === "D")) {
        const src = path.join(REPO, ".claude/agents/jakub.md"), dst = path.join(ws, ".claude/agents/jakub.md");
        fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); extras.push(".claude/agents/jakub.md");
      }
      if (key === "jakub" && cond === "C" && vendor) {
        copyDir(vendor.dir, path.join(ws, "compound-design/vendor/jakub-skills")); extras.push("compound-design/vendor/jakub-skills/** (pinned upstream, exact path the agent expects)");
      }
      if (key === "qg" && cond === "C") {
        for (const f of [".claude/skills/cd-quality-gate/SKILL.md", "compound-design/quality/CD-QUALITY-INDEX.md", "compound-design/quality/CD-EVIDENCE-LEVELS.md"]) {
          const dst = path.join(ws, f); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(path.join(REPO, f), dst); extras.push(f);
        }
      }
      // every task's workspace_files must exist and absent_files must not
      for (const t of tests) {
        for (const f of t.metadata.workspace_files ?? []) if (!exists(path.join(ws, f))) fail(`[${key}:${cond}] missing workspace file ${f}`);
        for (const f of t.metadata.absent_files ?? []) if (exists(path.join(ws, f))) fail(`[${key}:${cond}] file must be absent: ${f}`);
      }
      const problems = scanWorkspace(ws);
      if (problems.length) fail(`[${key}:${cond}] workspace gate failed:\n - ${problems.join("\n - ")}`);
      const files = walk(ws).map((f) => ({ path: path.relative(ws, f), sha256: sha256(fs.readFileSync(f)) }));
      manifest.suites[key][cond] = { path: rel(ws), extras, files: files.length, unavailable: key === "jakub" && (cond === "B" || cond === "C") && !vendor ? "vendor not fetched" : undefined };
      log(`workspace ${key}/${cond}: ${files.length} files${extras.length ? " + " + extras.join(", ") : ""}`);
    }
  }
  fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  log(`workspaces ok → ${rel(root)}`);
  return manifest;
}

// ---------------------------------------------------------------- fixtures (Playwright + axe, local browser, no network)
function findChromium() {
  if (process.env.E2_CHROMIUM_PATH && exists(process.env.E2_CHROMIUM_PATH)) return process.env.E2_CHROMIUM_PATH;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(os.homedir(), ".cache/ms-playwright")].filter(Boolean);
  for (const r of roots) {
    if (!exists(r)) continue;
    for (const d of fs.readdirSync(r).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const c of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
        const p = path.join(r, d, c); if (exists(p)) return p;
      }
    }
  }
  return null;
}
const AXE_SCRIPT = () => readText(path.join(E2, "node_modules/axe-core/axe.min.js"));
async function observeFixture(htmlPath) {
  const { chromium } = require(path.join(E2, "node_modules/playwright-core"));
  const executablePath = findChromium();
  if (!executablePath) return null;
  const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
  const observations = { file: path.basename(htmlPath), generated_by: "e2 fixtures (playwright-core + axe-core, local, no network)", observations: [] };
  try {
    const url = "file://" + htmlPath;
    // 320px reflow
    let page = await browser.newPage({ viewport: { width: 320, height: 800 } });
    await page.goto(url);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) observations.observations.push({ id: "playwright:overflow-320", detail: "horizontal overflow at 320 CSS px" });
    await page.close();
    page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url);
    // click handlers that are not keyboard focusable
    const unfocusable = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("[onclick]")) {
        const native = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName) || el.hasAttribute("href");
        if (!native && el.tabIndex < 0) out.push(el.className ? "." + String(el.className).trim().split(/\s+/)[0] : el.tagName.toLowerCase());
      }
      return [...new Set(out)];
    });
    for (const sel of unfocusable) observations.observations.push({ id: `playwright:unfocusable:${sel}`, detail: `element with onclick not in tab order: ${sel}` });
    // focus indicator on the first native focusable control
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return { none: true };
      const cs = getComputedStyle(el);
      const visible = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      return { tag: el.tagName.toLowerCase(), visible };
    });
    if (!focus.none && !focus.visible) observations.observations.push({ id: "playwright:no-focus-indicator", detail: `focused <${focus.tag}> has no visible outline or box-shadow` });
    // axe
    await page.addScriptTag({ content: AXE_SCRIPT() });
    const axe = await page.evaluate(async () => { const r = await window.axe.run(document, { resultTypes: ["violations"] }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })); });
    for (const v of axe) observations.observations.push({ id: `axe:${v.id}`, impact: v.impact, nodes: v.nodes, detail: v.help });
    observations.axe_version = require(path.join(E2, "node_modules/axe-core/package.json")).version;
    observations.playwright_core_version = require(path.join(E2, "node_modules/playwright-core/package.json")).version;
    await page.close();
  } finally { await browser.close(); }
  return observations;
}
function groundTruthDir() { const d = path.join(E2, "tasks/ground-truth"); fs.mkdirSync(d, { recursive: true }); return d; }
async function cmdFixtures(args) {
  const check = args.includes("--check");
  const tests = loadSuite("jakub");
  let ran = 0, skipped = 0;
  for (const t of tests) {
    for (const f of t.metadata.workspace_files ?? []) {
      if (!f.endsWith(".html")) continue;
      const html = path.join(SUITES.jakub.fixtures, f);
      const outPath = path.join(groundTruthDir(), `${t.metadata.id}.observations.json`);
      const obs = await observeFixture(html);
      if (!obs) { skipped += 1; log(`fixtures: no local Chromium found (set E2_CHROMIUM_PATH or PLAYWRIGHT_BROWSERS_PATH); using committed ${rel(outPath)}`); continue; }
      const json = JSON.stringify(obs, null, 2) + "\n";
      if (check && exists(outPath)) {
        const prev = JSON.parse(readText(outPath)); const a = prev.observations.map((o) => o.id).sort().join(","), b = obs.observations.map((o) => o.id).sort().join(",");
        if (a !== b) fail(`fixtures --check: observations changed for ${t.metadata.id}\n committed: ${a}\n fresh:     ${b}`);
      }
      fs.writeFileSync(outPath, json); ran += 1;
      log(`fixtures ${t.metadata.id}: ${obs.observations.map((o) => o.id).join(", ")}`);
    }
  }
  // cross-check expected items with axe/playwright provenance against observations
  const errors = [];
  for (const t of tests) {
    const outPath = path.join(groundTruthDir(), `${t.metadata.id}.observations.json`);
    const ids = exists(outPath) ? new Set(JSON.parse(readText(outPath)).observations.map((o) => o.id)) : null;
    for (const e of t.metadata.expected ?? []) {
      const v = String(e.verify ?? "");
      if (!/^(axe|playwright):/.test(v)) continue;
      if (!ids) { errors.push(`[${t.metadata.id}] ${e.id} needs observations file ${rel(outPath)} (run e2 fixtures with a local Chromium)`); continue; }
      const hit = [...ids].some((id) => id === v || id.startsWith(v + ":") || id.startsWith(v));
      if (!hit) errors.push(`[${t.metadata.id}] ${e.id} verify '${v}' not present in observations (${[...ids].join(", ")})`);
    }
  }
  if (errors.length) fail(`fixtures cross-check failed:\n - ${errors.join("\n - ")}`);
  log(`fixtures ok: ${ran} rendered, ${skipped} skipped (committed observations reused); deterministic ground truth cross-check passed`);
}

// ---------------------------------------------------------------- freeze
function harnessVersions() {
  const lock = JSON.parse(readText(path.join(E2, "package-lock.json")));
  const v = (n) => lock.packages?.[`node_modules/${n}`]?.version ?? "not installed";
  return { node: process.version, promptfoo: v("promptfoo"), "playwright-core": v("playwright-core"), "axe-core": v("axe-core"), "@anthropic-ai/claude-agent-sdk": lock.packages?.["node_modules/@anthropic-ai/claude-agent-sdk"]?.version ?? "optional, not required for zero-cost mode" };
}
function taskSetDigest(key) {
  const suite = SUITES[key];
  const files = [suite.tasks, ...walk(suite.fixtures)].sort();
  const h = crypto.createHash("sha256");
  for (const f of files) { h.update(path.relative(E2, f)); h.update(fs.readFileSync(f)); }
  return h.digest("hex");
}
function cmdFreeze() {
  // git state is captured BEFORE any file is written so that freeze is idempotent on a clean tree
  const repoState = { sha: git(["rev-parse", "HEAD"]), branch: git(["rev-parse", "--abbrev-ref", "HEAD"]), dirty: git(["status", "--porcelain"]).length > 0 };
  const tasksOut = { task_set_version: "1.0.0", rule: "Task sets are versioned. Any change after model outputs exist requires a new version and a fresh holdout.", suites: {} };
  for (const [key, suite] of Object.entries(SUITES)) {
    const tests = loadSuite(key);
    const v = validateTasks(key, tests);
    if (v.errors.length) fail(`cannot freeze ${key}:\n - ${v.errors.join("\n - ")}`);
    const gt = { deterministic: 0, pending_human: 0, decoys: 0 };
    for (const t of tests) { gt.deterministic += (t.metadata.expected ?? []).length + (t.metadata.expected_decision ? 1 : 0); gt.pending_human += (t.metadata.pending_human ?? []).length; gt.decoys += (t.metadata.decoys ?? []).length; }
    tasksOut.suites[key] = {
      id: suite.id, sha256: taskSetDigest(key), total: v.total, holdouts: v.holdouts, holdout_share: Number(v.share.toFixed(3)), conditions: suite.conditions,
      d_subset: suite.dSubset, ground_truth_counts: gt,
      tasks: tests.map((t) => ({ id: t.metadata.id, kind: t.metadata.kind, holdout: t.metadata.holdout, d_subset: !!t.metadata.d_subset, expected: (t.metadata.expected ?? []).map((e) => e.id), critical: (t.metadata.expected ?? []).filter((e) => e.critical).map((e) => e.id), pending_human: (t.metadata.pending_human ?? []).map((h) => h.id) })),
    };
  }
  fs.writeFileSync(path.join(E2, "tasks/tasks.json"), JSON.stringify(tasksOut, null, 2) + "\n");
  let upstream = { status: "not fetched (run e2 fetch-upstream)", pinned_sha: UPSTREAM.jakub.sha };
  const pinFile = path.join(path.dirname(UPSTREAM.jakub.dir), "jakub-skills.pin.json");
  if (exists(pinFile)) upstream = JSON.parse(readText(pinFile));
  const env = {
    frozen_at: new Date().toISOString(),
    status: "E2 PRE-REGISTERED · ZERO-COST PREPARATION · PRIMARY RUBRIC FROZEN · RUNTIME NOT EXECUTED · COST BLOCKED · CEL E1",
    repo: repoState,
    harness: harnessVersions(),
    upstream: { jakub: upstream, emil_reference: UPSTREAM.emil, every_reference: UPSTREAM.every },
    model: { tested: "NOT PINNED — chosen only at paid-runtime with explicit authorization", judge: "NOT PINNED", rule: "same vendor / different model ≠ independent model family" },
    runtime: { executed: false, paid_model_calls: 0, tool_permissions: ["Read", "Grep", "Glob"], max_turns: 12, max_budget_usd_per_run: 1.0, repeat: 3, cache: false },
    task_sets: Object.fromEntries(Object.entries(tasksOut.suites).map(([k, s]) => [k, { sha256: s.sha256, total: s.total, holdouts: s.holdouts }])),
    rubric: { primary: "BENCHMARK-PROTOCOL.md 7-dimension rubric (frozen: weights, thresholds, success rules unchanged)", diagnostic: "10-dimension secondary rubric (no score, no weights)" },
  };
  fs.writeFileSync(path.join(E2, "environment.json"), JSON.stringify(env, null, 2) + "\n");
  log(`freeze ok → tasks/tasks.json, environment.json (repo ${env.repo.sha.slice(0, 12)}${env.repo.dirty ? " dirty" : ""})`);
  return { tasksOut, env };
}

// ---------------------------------------------------------------- validate
function scanLoadableConfigs() {
  const problems = [];
  const loadable = fs.readdirSync(E2).filter((f) => /^promptfoo.*\.ya?ml$/.test(f)).map((f) => path.join(E2, f));
  for (const f of loadable) {
    const text = readText(f);
    for (const re of MODEL_PROVIDER_PATTERNS) if (re.test(text)) problems.push(`${rel(f)} references a model provider (${re}) — loadable configs must be exec-only`);
    const cfg = loadYaml(f);
    const providers = Array.isArray(cfg.providers) ? cfg.providers : [];
    for (const p of providers) { const id = typeof p === "string" ? p : p.id; if (!String(id).startsWith("exec:")) problems.push(`${rel(f)} provider '${id}' is not an exec: provider`); }
    const walkAsserts = (tests) => { for (const t of tests ?? []) for (const a of t.assert ?? []) if (MODEL_GRADED_ASSERTS.has(a.type)) problems.push(`${rel(f)} uses model-graded assertion ${a.type}`); };
    walkAsserts(Array.isArray(cfg.tests) ? cfg.tests.filter((t) => typeof t === "object") : []);
    for (const a of cfg.defaultTest?.assert ?? []) if (MODEL_GRADED_ASSERTS.has(a.type)) problems.push(`${rel(f)} defaultTest uses model-graded assertion ${a.type}`);
  }
  // task files themselves are loaded by the dry-run config; their asserts must be deterministic
  for (const key of Object.keys(SUITES)) for (const t of loadSuite(key)) for (const a of t.assert ?? []) if (MODEL_GRADED_ASSERTS.has(a.type)) problems.push(`${rel(SUITES[key].tasks)} [${t.metadata.id}] model-graded assertion ${a.type}`);
  return problems;
}
function scanRuntimeTemplates() {
  const problems = [];
  const dir = path.join(E2, "runtime-templates");
  const tmpls = exists(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".tmpl")) : [];
  if (tmpls.length === 0) problems.push("runtime-templates/*.tmpl missing");
  for (const f of tmpls) {
    const text = readText(path.join(dir, f));
    if (!/apiKeyRequired:\s*true/.test(text)) problems.push(`${f}: apiKeyRequired must be true (never borrow a local Claude Code session)`);
    if (/apiKeyRequired:\s*false/.test(text)) problems.push(`${f}: apiKeyRequired: false is forbidden`);
    for (const ph of ["{{MODEL}}", "{{JUDGE_MODEL}}"]) if (!text.includes(ph)) problems.push(`${f}: placeholder ${ph} missing`);
    if (!/evaluateOptions:\s*\n\s+repeat:\s*3/.test(text)) problems.push(`${f}: evaluateOptions.repeat: 3 required`);
    if (/persist_session:\s*true/.test(text)) problems.push(`${f}: persist_session must be false`);
  }
  return problems;
}
function scanCiWorkflows() {
  const problems = [];
  const dir = path.join(REPO, ".github/workflows");
  for (const f of exists(dir) ? fs.readdirSync(dir) : []) {
    const text = readText(path.join(dir, f));
    if (/paid-runtime|DANGEROUS-PAID/.test(text)) problems.push(`${f}: CI must never invoke paid-runtime`);
    if (new RegExp(PAID_FLAG).test(text)) problems.push(`${f}: CI must not set ${PAID_FLAG}`);
    if (/\bclaude\s+-p\b|claude-agent-sdk|anthropic:|openai:/.test(text)) problems.push(`${f}: CI references a model runtime`);
    for (const line of text.split("\n")) if (/promptfoo\s+eval/.test(line) && !/dryrun|dry-run/.test(line)) problems.push(`${f}: promptfoo eval outside dry-run: ${line.trim()}`);
  }
  return problems;
}
function renderTemplate(text, vars) { return text.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => { if (!(k in vars)) fail(`template placeholder ${k} has no value`); return vars[k]; }); }
function templateVars(overrides = {}) {
  const ws = workspaceRoot();
  return {
    MODEL: "MODEL-NOT-PINNED", JUDGE_MODEL: "JUDGE-NOT-PINNED",
    VENDOR_ABS: UPSTREAM.jakub.dir,
    WS_JAKUB_A: path.join(ws, "jakub/A"), WS_JAKUB_B: path.join(ws, "jakub/B"), WS_JAKUB_C: path.join(ws, "jakub/C"), WS_JAKUB_D: path.join(ws, "jakub/D"),
    WS_QG_A: path.join(ws, "qg/A"), WS_QG_C: path.join(ws, "qg/C"),
    TASKS_JAKUB: path.join(E2, "tasks/jakub-tests.yaml"), TASKS_QG: path.join(E2, "tasks/cd-quality-gate-tests.yaml"),
    RUBRIC_PRIMARY: path.join(E2, "rubrics/primary-7.md"),
    RESULTS_DIR: path.join(E2, "results"),
    ...overrides,
  };
}
function promptfooBin() { const p = path.join(E2, "node_modules/.bin/promptfoo"); return exists(p) ? p : null; }
function runPromptfoo(args, extraEnv = {}) {
  const bin = promptfooBin();
  if (!bin) fail("promptfoo not installed: run `npm run e2:install`");
  const r = spawnSync(bin, args, { cwd: E2, encoding: "utf8", env: scrubbedEnv(extraEnv), stdio: ["ignore", "pipe", "pipe"] });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}
function cmdValidate(args) {
  const report = { validated_at: new Date().toISOString(), gates: [] };
  const gate = (name, problems) => { report.gates.push({ name, ok: problems.length === 0, problems }); log(`${problems.length === 0 ? "ok  " : "FAIL"} ${name}${problems.length ? "\n - " + problems.join("\n - ") : ""}`); };
  for (const key of Object.keys(SUITES)) { const v = validateTasks(key, loadSuite(key)); gate(`tasks:${key} (${v.total} tasks, ${v.holdouts} holdout = ${(v.share * 100).toFixed(0)}%)`, v.errors); }
  gate("loadable promptfoo configs are exec-only and deterministic", scanLoadableConfigs());
  gate("runtime templates guarded", scanRuntimeTemplates());
  gate("CI workflows are zero-model-cost", scanCiWorkflows());
  // promptfoo schema validation of the dry-run config and of rendered runtime templates (no provider is contacted)
  if (promptfooBin() && !args.includes("--skip-promptfoo")) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "e2-validate-"));
    const rendered = [];
    for (const f of fs.readdirSync(path.join(E2, "runtime-templates")).filter((f) => f.endsWith(".tmpl"))) {
      const out = path.join(tmp, f.replace(/\.tmpl$/, "")); fs.writeFileSync(out, renderTemplate(readText(path.join(E2, "runtime-templates", f)), templateVars())); rendered.push(out);
    }
    const r = runPromptfoo(["validate", "-c", path.join(E2, "promptfoo-dryrun.yaml"), ...rendered]);
    const text = (r.stdout + "\n" + r.stderr).trim();
    gate(`promptfoo validate (schema only; rendered templates in ${tmp})`, r.status === 0 ? [] : [text.split("\n").slice(-15).join("\n")]);
    if (r.status === 0) fs.rmSync(tmp, { recursive: true, force: true });
  } else gate("promptfoo validate", promptfooBin() ? [] : ["skipped: promptfoo not installed (npm run e2:install)"]);
  fs.writeFileSync(path.join(E2, "validate-report.json"), JSON.stringify(report, null, 2) + "\n");
  const failed = report.gates.filter((g) => !g.ok);
  if (failed.length) fail(`validate: ${failed.length} gate(s) failed`);
  log("validate ok");
  return report;
}

// ---------------------------------------------------------------- results parsing (promptfoo output → runs)
export function extractResults(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results?.results)) return data.results.results;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.outputs)) return data.outputs;
  fail("unrecognized results file shape");
}
function conditionOf(label) { const m = /^([ABCD])(?:-|$)/.exec(String(label ?? "")); return m ? m[1] : null; }
export function classifyRun(r, i, suiteKey) {
  const label = r.provider?.label ?? r.provider?.id ?? "";
  const cond = conditionOf(label);
  const meta = r.response?.metadata ?? r.metadata ?? {};
  const output = r.response?.output ?? r.output ?? "";
  const text = typeof output === "string" ? output : JSON.stringify(output ?? "");
  const testMeta = r.testCase?.metadata ?? r.metadata_test ?? {};
  const taskId = testMeta.id ?? r.vars?.task_id ?? `T${i}`;
  const toolCalls = meta.toolCalls ?? [];
  const skillCalls = (meta.skillCalls ?? []).map((s) => (typeof s === "string" ? s : s.name ?? s.skill ?? "")).concat(toolCalls.filter((t) => t.name === "Skill").map((t) => String(t.input?.skill ?? t.input?.name ?? "")));
  const vendorReads = toolCalls.filter((t) => /^(Read|Grep|Glob)$/.test(t.name) && /vendor\/jakub-skills/.test(JSON.stringify(t.input ?? {}))).length;
  const agent = r.provider?.config?.agent ?? meta.agent ?? null;
  const run = { run_id: r.id ?? `${label}#${taskId}#${i}`, index: i, condition: cond, label, task_id: taskId, holdout: !!testMeta.holdout, status: "scored", flags: [], reason: null, vendor_reads: vendorReads, skill_calls: skillCalls, turns: meta.num_turns ?? meta.turns ?? null, tokens: r.response?.tokenUsage ?? r.tokenUsage ?? null, latency_ms: r.latencyMs ?? null, output_sha256: sha256(text), output_chars: text.length, synthetic: /SYNTHETIC — NOT MODEL OUTPUT/.test(text) || /^exec:/.test(String(r.provider?.id ?? "")) };
  // promptfoo puts failed deterministic assertions into `error` too (failureReason 1 = ASSERT, 2 = ERROR). A failed gate is not a provider error.
  const assertFailed = r.failureReason === 1 || (Boolean(r.error) && /returned false|Expected output|assert/i.test(String(r.error)) && Boolean(text.trim()));
  run.gate_pass = typeof r.success === "boolean" ? r.success : null;
  const providerError = r.failureReason === 2 || Boolean(meta.apiErrorStatus) || (meta.assistantErrors?.length ?? 0) > 0 || !text.trim() || (Boolean(r.error) && !assertFailed);
  if (providerError) { run.status = "error"; run.reason = meta.apiErrorStatus ? `api error ${meta.apiErrorStatus}` : (meta.assistantErrors?.length ? "assistant error" : (!text.trim() ? "empty output" : String(r.error).split("\n")[0].slice(0, 160))); return run; }
  const truncated = meta.stop_reason === "max_tokens" || r.response?.finishReason === "length" || meta.truncated === true || (meta.max_turns_reached === true);
  if (truncated) run.flags.push("truncated");
  const hasRouteMeta = Boolean(meta.toolCalls || meta.skillCalls || agent);
  let valid = true, why = null;
  if (cond === "A") { if (skillCalls.length || agent) { valid = false; why = "A must run without any skill or agent"; } }
  else if (cond === "B") { if (!skillCalls.some((s) => /better-|interfaces:/.test(s))) { valid = false; why = hasRouteMeta ? "B produced no upstream skill invocation" : "no route metadata"; } }
  else if (cond === "C") {
    if (suiteKey === "qg") { if (!skillCalls.some((s) => /cd-quality-gate/.test(s))) { valid = false; why = hasRouteMeta ? "C did not invoke cd-quality-gate" : "no route metadata"; } }
    else if (agent !== "jakub") { valid = false; why = agent ? `C agent is ${agent}` : "C has no agent evidence"; }
  } else if (cond === "D") { if (agent !== "jakub") { valid = false; why = "D has no agent evidence"; } else if (vendorReads > 0) { valid = false; why = "D read vendor files (contaminated prompt-only lane)"; } }
  else { valid = false; why = `unknown condition label '${label}'`; }
  if (!valid) { run.status = "route_invalid"; run.reason = why; return run; }
  if (truncated) run.status = "truncated"; // still scored on emitted output
  return run;
}
function cmdRoutes(args) {
  const [input] = args.filter((a) => !a.startsWith("--"));
  if (!input) fail("usage: e2 routes <results.json> [--suite jakub|qg] [--out routes.json]");
  const suiteKey = (args.find((a) => a.startsWith("--suite=")) ?? "--suite=jakub").split("=")[1];
  const data = JSON.parse(readText(input));
  const runs = extractResults(data).map((r, i) => classifyRun(r, i, suiteKey));
  const counts = {};
  for (const r of runs) { counts[r.condition ?? "?"] ??= { scored: 0, truncated: 0, route_invalid: 0, error: 0 }; counts[r.condition ?? "?"][r.status] += 1; }
  const out = { source: rel(path.resolve(input)), suite: suiteKey, classified_at: new Date().toISOString(), rule: "scored and truncated runs are both scored on emitted output; only error and route_invalid are excluded from means and are reported separately", counts, runs };
  const outPath = (args.find((a) => a.startsWith("--out=")) ?? `--out=${path.join(path.dirname(path.resolve(input)), "routes.json")}`).split("=")[1];
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  log(`routes → ${rel(outPath)}`); for (const [c, n] of Object.entries(counts)) log(`  ${c}: ${JSON.stringify(n)}`);
  return out;
}

// ---------------------------------------------------------------- blind / unblind
export function redact(text) { let n = 0; let out = text; for (const re of REDACT_PATTERNS) out = out.replace(re, () => { n += 1; return "[REDACTED-ID]"; }); return { text: out, redactions: n }; }
export function buildBlind(routes, outputsById, seed = 20260909) {
  const labels = [...new Set(routes.runs.map((r) => r.label).filter(Boolean))];
  const scored = routes.runs.filter((r) => r.status === "scored" || r.status === "truncated");
  const rnd = seededRandom(seed);
  const payload = [], key = {};
  for (const r of shuffle(scored, rnd)) {
    let bid; do { bid = "R-" + Math.floor(rnd() * 0xffff).toString(16).padStart(4, "0"); } while (key[bid]);
    const raw = outputsById.get(r.run_id) ?? "";
    for (const l of labels) if (raw.includes(l)) fail(`blind gate: run ${r.run_id} output contains condition label '${l}' — refuse to build payload`);
    const { text, redactions } = redact(raw);
    for (const re of [/\b[ABCD]-(base|upstream|compound|prompt)/i, /condition\s*[:=]\s*[ABCD]\b/i]) if (re.test(text)) fail(`blind gate: run ${r.run_id} output still carries a condition marker after redaction`);
    payload.push({ blind_id: bid, task_id: r.task_id, holdout: r.holdout, truncated: r.status === "truncated", output: text, redactions });
    key[bid] = { run_id: r.run_id, condition: r.condition, label: r.label };
  }
  return { payload: { note: "BLIND PAYLOAD — no condition, resource, agent, skill or upstream identity. Format fingerprints are a declared limitation.", seed, items: payload }, key: { note: "UNBLIND KEY — keep separate from the payload until all scores are recorded.", seed, map: key } };
}
function cmdBlind(args) {
  const [routesPath, resultsPath] = args.filter((a) => !a.startsWith("--"));
  if (!routesPath || !resultsPath) fail("usage: e2 blind <routes.json> <results.json> [--seed=N] [--out=dir]");
  const seed = Number((args.find((a) => a.startsWith("--seed=")) ?? "--seed=20260909").split("=")[1]);
  const routes = JSON.parse(readText(routesPath));
  const results = extractResults(JSON.parse(readText(resultsPath)));
  const outputs = new Map(results.map((r, i) => { const run = classifyRun(r, i, routes.suite); const o = r.response?.output ?? r.output ?? ""; return [run.run_id, typeof o === "string" ? o : JSON.stringify(o)]; }));
  const { payload, key } = buildBlind(routes, outputs, seed);
  const dir = (args.find((a) => a.startsWith("--out=")) ?? `--out=${path.join(path.dirname(path.resolve(routesPath)), "blind")}`).split("=")[1];
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "payload.json"), JSON.stringify(payload, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "unblind-key.json"), JSON.stringify(key, null, 2) + "\n");
  const csv = ["blind_id,task_id,holdout,truncated,correct_detection_30,precision_20,prioritization_15,actionability_15,boundary_10,verification_5,concision_5,primary_total_100,better_decision_yn,found_what_matters_yn,invented_problem_yn,missed_obvious_yn,stuck_to_rubric_yn,simpler_baseline_equal_yn,critical_issue_missed_ids,artificial_finding_ids,qualitative_comment"];
  for (const p of payload.items) csv.push(`${p.blind_id},${p.task_id},${p.holdout},${p.truncated},,,,,,,,,,,,,,,,,`);
  fs.writeFileSync(path.join(dir, "human-score-sheet.csv"), csv.join("\n") + "\n");
  log(`blind → ${rel(dir)}: ${payload.items.length} outputs, redactions ${payload.items.reduce((a, p) => a + p.redactions, 0)}; key kept in unblind-key.json`);
}
function cmdUnblind(args) {
  const [keyPath, scoresPath] = args.filter((a) => !a.startsWith("--"));
  if (!keyPath || !scoresPath) fail("usage: e2 unblind <unblind-key.json> <scores.json|csv>");
  const key = JSON.parse(readText(keyPath)).map;
  let rows;
  if (scoresPath.endsWith(".csv")) { const [head, ...lines] = readText(scoresPath).trim().split("\n"); const cols = head.split(","); rows = lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [cols[i], v]))); }
  else rows = JSON.parse(readText(scoresPath));
  const merged = rows.map((row) => ({ ...row, ...(key[row.blind_id] ?? { condition: null, run_id: null, unmatched: true }) }));
  const out = path.join(path.dirname(path.resolve(scoresPath)), "scores.unblinded.json");
  fs.writeFileSync(out, JSON.stringify(merged, null, 2) + "\n");
  log(`unblind → ${rel(out)} (${merged.filter((m) => m.unmatched).length} unmatched)`);
}

// ---------------------------------------------------------------- aggregate (EXPLORATORY / DESCRIPTIVE only)
const ALLOWED_EXCLUSIONS = new Set(["error", "route_invalid"]);
function mean(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null; }
function bootstrapCI(diffs, rnd, iters = 2000, level = 0.9) {
  if (diffs.length < 2) return null;
  const means = [];
  for (let i = 0; i < iters; i++) { const s = []; for (let j = 0; j < diffs.length; j++) s.push(diffs[Math.floor(rnd() * diffs.length)]); means.push(mean(s)); }
  means.sort((a, b) => a - b);
  const lo = means[Math.floor(((1 - level) / 2) * iters)], hi = means[Math.floor((1 - (1 - level) / 2) * iters) - 1];
  return { level, low: Number(lo.toFixed(2)), high: Number(hi.toFixed(2)), classification: "EXPLORATORY / DESCRIPTIVE — not a significance claim" };
}
export function aggregate(routes, scores = null, opts = {}) {
  for (const x of opts.exclude ?? []) if (!ALLOWED_EXCLUSIONS.has(x)) fail(`aggregate refuses to exclude '${x}': only error and route_invalid may be excluded; truncated runs are always scored on emitted output`);
  const conds = [...new Set(routes.runs.map((r) => r.condition))].filter(Boolean).sort();
  const summary = { aggregated_at: new Date().toISOString(), classification: "EXPLORATORY / DESCRIPTIVE", interpretation_priority: ["paired task differences", "blind Human Craft Review", "effect magnitude", "critical issue recall", "routing failures", "cost/efficiency", "exploratory statistics"], counts: {}, scores: "not measured", decision_rules: [] };
  for (const c of conds) summary.counts[c] = { scored: 0, truncated: 0, route_invalid: 0, error: 0 };
  for (const r of routes.runs) summary.counts[r.condition][r.status] += 1;
  if (!scores) { summary.decision_rules = DECISION_RULES.map((d) => ({ ...d, result: "NOT EVALUABLE — not measured" })); return summary; }
  // scores: [{run_id, primary_total_100, critical_detected?, critical_total?}]
  const byRun = new Map(scores.map((s) => [s.run_id, s]));
  const perTask = {}; // task -> cond -> [scores]
  for (const r of routes.runs) {
    if (!(r.status === "scored" || r.status === "truncated")) continue;
    const s = byRun.get(r.run_id); if (!s || s.primary_total_100 == null) continue;
    (perTask[r.task_id] ??= {})[r.condition] ??= []; perTask[r.task_id][r.condition].push(Number(s.primary_total_100));
  }
  const condMeans = {}; for (const c of conds) { const all = Object.values(perTask).flatMap((t) => t[c] ?? []); condMeans[c] = { n: all.length, mean: all.length ? Number(mean(all).toFixed(2)) : null, min: all.length ? Math.min(...all) : null, max: all.length ? Math.max(...all) : null }; }
  const rnd = seededRandom(opts.seed ?? 20260909);
  const paired = {};
  for (const [x, y] of [["C", "A"], ["C", "B"], ["D", "C"], ["B", "A"]]) {
    const diffs = [], rows = [];
    for (const [task, m] of Object.entries(perTask)) { if (m[x]?.length && m[y]?.length) { const d = mean(m[x]) - mean(m[y]); diffs.push(d); rows.push({ task, [x]: Number(mean(m[x]).toFixed(1)), [y]: Number(mean(m[y]).toFixed(1)), diff: Number(d.toFixed(1)) }); } }
    if (!diffs.length) continue;
    paired[`${x}-${y}`] = { tasks: diffs.length, mean_diff: Number(mean(diffs).toFixed(2)), min: Number(Math.min(...diffs).toFixed(1)), max: Number(Math.max(...diffs).toFixed(1)), wins: diffs.filter((d) => d > 0).length, losses: diffs.filter((d) => d < 0).length, ties: diffs.filter((d) => d === 0).length, bootstrap_ci: bootstrapCI(diffs, rnd), per_task: rows };
  }
  summary.scores = { condition_means: condMeans, paired };
  summary.decision_rules = evaluateDecisionRules(summary, routes);
  return summary;
}
const DECISION_RULES = [
  { id: 1, rule: "C − A mean < +5 → Compound does not beat base (protocol rule 1)" },
  { id: 2, rule: "C − B in (−2, +2) and C input tokens ≥ 0.85 × B → tie without efficiency → simplify/remove wrapper" },
  { id: 3, rule: "C > B on ≤ 3 of 9 tasks (sign count) → no paired advantage" },
  { id: 4, rule: "bootstrap 90% CI of (C − B) contains −2 and upper bound < +5 → no reliable difference → upstream default" },
  { id: 5, rule: "critical expected issue with C recall < B recall on ≥ 2 tasks" },
  { id: 6, rule: "C route_invalid + error > 5 of 27 runs → wrapper operationally fragile" },
  { id: 7, rule: "vendor_reads = 0 in ≥ 50% of C runs while C ≥ B → value lives in the prompt; compare with D" },
  { id: 8, rule: "judge×human agreement < 80% on C but ≥ 90% on B → judge captured by C's format → result void" },
  { id: 9, rule: "C fails ≥ 2 of 6 near-miss runs where A/B pass → new systematic routing failure" },
  { id: 10, rule: "Quality Gate: A decision correctness ≥ 90% and C − A < 10, or C hallucinated-evidence count > A → base model suffices / remove" },
];
function evaluateDecisionRules(summary, routes) {
  const p = summary.scores?.paired ?? {};
  const na = (d) => ({ ...d, result: "NOT EVALUABLE — not measured" });
  return DECISION_RULES.map((d) => {
    if (d.id === 1 && p["C-A"]) return { ...d, result: p["C-A"].mean_diff < 5 ? "TRIGGERED" : "NOT TRIGGERED", value: p["C-A"].mean_diff };
    if (d.id === 3 && p["C-B"]) return { ...d, result: p["C-B"].wins <= 3 ? "TRIGGERED" : "NOT TRIGGERED", value: `${p["C-B"].wins} wins / ${p["C-B"].tasks} tasks` };
    if (d.id === 4 && p["C-B"]?.bootstrap_ci) { const ci = p["C-B"].bootstrap_ci; return { ...d, result: ci.low <= -2 && ci.high < 5 ? "TRIGGERED" : "NOT TRIGGERED", value: `[${ci.low}, ${ci.high}]` }; }
    if (d.id === 6) { const c = summary.counts.C; if (!c) return na(d); const bad = c.route_invalid + c.error; const total = Object.values(c).reduce((a, b) => a + b, 0); return { ...d, result: bad > 5 ? "TRIGGERED" : "NOT TRIGGERED", value: `${bad}/${total}` }; }
    if (d.id === 7) { const cr = routes.runs.filter((r) => r.condition === "C" && (r.status === "scored" || r.status === "truncated")); if (!cr.length) return na(d); const zero = cr.filter((r) => r.vendor_reads === 0).length; return { ...d, result: zero / cr.length >= 0.5 ? "TRIGGERED (compare with D)" : "NOT TRIGGERED", value: `${zero}/${cr.length} runs without vendor reads` }; }
    return na(d);
  });
}
function decisionSkeleton(summary) {
  const lines = ["# DECISION — draft skeleton (human-written decision required)", "", "Status: RUNTIME NOT EXECUTED unless a results file with real model output was aggregated.", "", "Classification of every statistic below: EXPLORATORY / DESCRIPTIVE. Thresholds are pre-registered decision rules, not significance claims.", "", "## Counts", "", "| Condition | scored | truncated (scored) | route_invalid (excluded) | error (excluded) |", "|---|---:|---:|---:|---:|"];
  for (const [c, n] of Object.entries(summary.counts)) lines.push(`| ${c} | ${n.scored} | ${n.truncated} | ${n.route_invalid} | ${n.error} |`);
  lines.push("", "## Primary rubric (7 dimensions, frozen) — condition means", "");
  if (summary.scores === "not measured") lines.push("not measured");
  else { lines.push("| Condition | n | mean | min | max |", "|---|---:|---:|---:|---:|"); for (const [c, m] of Object.entries(summary.scores.condition_means)) lines.push(`| ${c} | ${m.n} | ${m.mean ?? "—"} | ${m.min ?? "—"} | ${m.max ?? "—"} |`); lines.push("", "## Paired task differences", ""); for (const [k, v] of Object.entries(summary.scores.paired)) lines.push(`- ${k}: mean ${v.mean_diff} (min ${v.min}, max ${v.max}); wins ${v.wins} / losses ${v.losses} / ties ${v.ties}; bootstrap 90% CI [${v.bootstrap_ci?.low ?? "—"}, ${v.bootstrap_ci?.high ?? "—"}] (${v.bootstrap_ci?.classification ?? "n/a"})`); }
  lines.push("", "## Pre-registered decision rules", "", "| # | Rule | Result | Value |", "|---|---|---|---|");
  for (const d of summary.decision_rules) lines.push(`| ${d.id} | ${d.rule} | ${d.result} | ${d.value ?? ""} |`);
  lines.push("", "## Blind Human Craft Review", "", "<human writes here — see HUMAN-CRAFT-REVIEW.md; record judge×human divergence>", "", "## Decision", "", "<human writes here: E1 stays E1 | E2 in tested scope | simplify/remove wrapper | candidate experiment>", "", "## Unresolved uncertainty", "", "<human writes here>", "");
  return lines.join("\n");
}
function cmdAggregate(args) {
  const [routesPath] = args.filter((a) => !a.startsWith("--"));
  if (!routesPath) fail("usage: e2 aggregate <routes.json> [--scores=scores.unblinded.json] [--exclude=error,route_invalid]");
  const routes = JSON.parse(readText(routesPath));
  const scoresArg = args.find((a) => a.startsWith("--scores="));
  const scores = scoresArg ? JSON.parse(readText(scoresArg.split("=")[1])) : null;
  const exclude = (args.find((a) => a.startsWith("--exclude=")) ?? "--exclude=error,route_invalid").split("=")[1].split(",").filter(Boolean);
  const summary = aggregate(routes, scores, { exclude });
  const dir = path.dirname(path.resolve(routesPath));
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "DECISION.draft.md"), decisionSkeleton(summary));
  log(`aggregate → ${rel(dir)}/summary.json, DECISION.draft.md (scores: ${scores ? "present" : "not measured"})`);
}

// ---------------------------------------------------------------- plan-runs (future cost, never executed)
function cmdPlanRuns(args) {
  const tasksJson = path.join(E2, "tasks/tasks.json");
  if (!exists(tasksJson)) fail("run `e2 freeze` first");
  const t = JSON.parse(readText(tasksJson));
  const j = t.suites.jakub, q = t.suites.qg, reps = 3;
  const blocks = [
    { block: "Interface Review A/B/C", agent_runs: j.total * 3 * reps, judge_outputs: j.total * 3 * reps, conditions: { A: j.total * reps, B: j.total * reps, C: j.total * reps } },
    { block: "Condition D (diagnostic subset)", agent_runs: j.d_subset.length * reps, judge_outputs: j.d_subset.length * reps, conditions: { D: j.d_subset.length * reps } },
    { block: "Quality Gate A/C", agent_runs: q.total * 2 * reps, judge_outputs: q.total * 2 * reps, conditions: { A: q.total * reps, C: q.total * reps } },
    { block: "Smoke (1 task per condition) + negative control", agent_runs: 4 + 2 + 1, judge_outputs: 0, conditions: { A: 2, B: 1, C: 3, D: 1 } },
    { block: "Judge calibration on synthetic known-negatives (empty / off-topic / confident-wrong) per suite", agent_runs: 0, judge_outputs: 6, conditions: {} },
  ];
  const totalAgent = blocks.reduce((a, b) => a + b.agent_runs, 0), totalJudge = blocks.reduce((a, b) => a + b.judge_outputs, 0);
  const cost = (tested, judge, judgeCallsPerOutput) => {
    let usd = 0;
    for (const b of blocks) for (const [c, n] of Object.entries(b.conditions)) { const a = RUN_ASSUMPTIONS[c]; usd += n * (a.input * PRICES[tested].input + a.output * PRICES[tested].output) / 1e6; }
    usd += totalJudge * judgeCallsPerOutput * (RUN_ASSUMPTIONS.judge.input * PRICES[judge].input + RUN_ASSUMPTIONS.judge.output * PRICES[judge].output) / 1e6;
    return Number(usd.toFixed(2));
  };
  const scenarios = [
    { tested: "claude-sonnet-5", judge: "claude-opus-5", note: "same vendor, different model — NOT an independent model family (E3 needs cross-model)" },
    { tested: "claude-opus-5", judge: "claude-sonnet-5", note: "judge less capable than tested model" },
    { tested: "claude-sonnet-4-6", judge: "claude-opus-5", note: "original config default; previous generation" },
  ].map((s) => ({ ...s, usd_judge_grouped: cost(s.tested, s.judge, 1), usd_judge_per_dimension: cost(s.tested, s.judge, 7) }));
  const out = { computed_at: new Date().toISOString(), executed: false, paid_model_calls: 0, repeat: reps, blocks, total_agent_runs: totalAgent, total_judge_outputs: totalJudge, judge_calls: { grouped: totalJudge, per_dimension: totalJudge * 7 }, assumptions: { tokens_per_run: RUN_ASSUMPTIONS, prices_usd_per_mtok: PRICES, price_snapshot: "first-party API, cached 2026-06-24", note: "Estimates only. Replace with measured smoke telemetry before a full run. Batch API (−50%) applies to judge calls, not to Agent SDK runs." }, scenarios, blocked_command: `${PAID_FLAG}=YES npm run e2:runtime:DANGEROUS-PAID -- --suite jakub --model <id> --judge <id> --execute` };
  fs.writeFileSync(path.join(E2, "plan-runs.json"), JSON.stringify(out, null, 2) + "\n");
  log(`plan-runs (NOT executed): ${totalAgent} agent runs, ${totalJudge} judged outputs (${totalJudge} grouped / ${totalJudge * 7} per-dimension judge calls)`);
  for (const s of scenarios) log(`  tested ${s.tested} / judge ${s.judge}: ≈ $${s.usd_judge_grouped} (grouped judge) … $${s.usd_judge_per_dimension} (per-dimension judge) — ${s.note}`);
  log(`  blocked command: ${out.blocked_command}`);
  return out;
}

// ---------------------------------------------------------------- paid-runtime (guarded)
function cmdPaidRuntime(args) {
  if (process.env[PAID_FLAG] !== "YES") { console.error(BLOCK_MESSAGE); console.error(`Set ${PAID_FLAG}=YES only with explicit budget authorization. Nothing was rendered or executed.`); process.exit(2); }
  const get = (k) => (args.find((a) => a.startsWith(`--${k}=`)) ?? "").split("=")[1] || (args[args.indexOf(`--${k}`) + 1]);
  const suite = get("suite"), model = get("model"), judge = get("judge");
  if (!suite || !model || !judge) fail("usage: paid-runtime --suite jakub|qg --model <id> --judge <id> [--execute]");
  if (model === judge) fail("judge model must differ from the tested model");
  if (!(suite in SUITES)) fail(`unknown suite ${suite}`);
  verifyUpstream();
  if (!exists(path.join(workspaceRoot(), "manifest.json"))) fail("run `e2 workspaces` first");
  const tmplPath = path.join(E2, "runtime-templates", suite === "jakub" ? "promptfoo-jakub.yaml.tmpl" : "promptfoo-quality-gate.yaml.tmpl");
  const outDir = path.join(E2, "results/runtime"); fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const cfgPath = path.join(outDir, `${suite}-${stamp}.yaml`);
  fs.writeFileSync(cfgPath, renderTemplate(readText(tmplPath), templateVars({ MODEL: model, JUDGE_MODEL: judge, RESULTS_DIR: outDir })));
  const cmd = [promptfooBin() ?? "promptfoo", "eval", "-c", cfgPath, "--no-cache", "-o", path.join(outDir, `${suite}-${stamp}.results.json`)];
  log(`rendered ${rel(cfgPath)}\ncommand: ${cmd.join(" ")}`);
  if (!args.includes("--execute")) { log("not executed (add --execute). Paid model calls so far: 0"); return; }
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd: E2, stdio: "inherit", env: { ...process.env, PROMPTFOO_DISABLE_TELEMETRY: "1", PROMPTFOO_DISABLE_UPDATE: "1", PROMPTFOO_DISABLE_SHARING: "1" } });
  process.exit(r.status ?? 1);
}

// ---------------------------------------------------------------- dry-run (exec provider only)
function cmdDryRun() {
  const cfg = path.join(E2, "promptfoo-dryrun.yaml");
  const problems = scanLoadableConfigs(); if (problems.length) fail(`dry-run refused:\n - ${problems.join("\n - ")}`);
  const outDir = path.join(E2, "results/dry-run"); fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "results.json");
  const r = runPromptfoo(["eval", "-c", cfg, "--no-cache", "--no-progress-bar", "-o", out], { PROMPTFOO_CACHE_ENABLED: "false" });
  if (!exists(out)) fail(`dry-run produced no results file (exit ${r.status}):\n${(r.stderr || r.stdout).split("\n").slice(-25).join("\n")}`);
  const data = JSON.parse(readText(out));
  const results = extractResults(data);
  for (const x of results) if (!String(x.provider?.id ?? "").startsWith("exec:")) fail(`dry-run gate: non-exec provider in results: ${x.provider?.id}`);
  const routes = cmdRoutes([out, "--suite=jakub", `--out=${path.join(outDir, "routes.json")}`]);
  cmdBlind([path.join(outDir, "routes.json"), out, `--out=${path.join(outDir, "blind")}`]);
  cmdAggregate([path.join(outDir, "routes.json")]);
  fs.writeFileSync(path.join(outDir, "README.md"), "# DRY RUN — SYNTHETIC — NOT MODEL OUTPUT\n\nProduced by `e2 dry-run` with the deterministic `exec:` echo provider. Proves harness wiring only (config → results → routes → blind → aggregate). Contains no model output, no scores, no evidence. CEL unchanged.\n");
  log(`dry-run ok: ${results.length} synthetic rows (promptfoo exit ${r.status}); providers all exec:`);
  return routes;
}
function cmdEchoProvider(args) {
  // exec provider: argv = prompt, optionsJson, contextJson
  const [prompt, optionsJson, contextJson] = args;
  let opts = {}, ctx = {};
  try { opts = JSON.parse(optionsJson ?? "{}"); } catch { /* ignore */ }
  try { ctx = JSON.parse(contextJson ?? "{}"); } catch { /* ignore */ }
  // The echo never prints the condition: blinded payloads must not carry condition markers (the blind gate rejects them).
  void opts;
  const id = ctx.vars?.task_id ?? ctx.test?.metadata?.id ?? "?";
  process.stdout.write(`SYNTHETIC — NOT MODEL OUTPUT\n[dry-run echo] task=${id} prompt_sha256=${sha256(String(prompt ?? "")).slice(0, 12)} prompt_chars=${String(prompt ?? "").length}\nThis text exists only to exercise the harness pipeline. It is not a review, not a decision and not evidence.\n`);
}

// ---------------------------------------------------------------- self-test (mutations must be rejected or classified)
async function cmdSelfTest() {
  const results = [];
  const expectFail = (name, fn, re) => { try { fn(); results.push({ name, ok: false, why: "no error raised" }); } catch (e) { const ok = !re || re.test(e.message); results.push({ name, ok, why: ok ? e.message.split("\n")[0].slice(0, 120) : `unexpected: ${e.message.slice(0, 160)}` }); } };
  const expectTrue = (name, cond, why = "") => results.push({ name, ok: !!cond, why });
  const jakub = loadSuite("jakub"), qg = loadSuite("qg");
  const clone = (x) => JSON.parse(JSON.stringify(x));
  // 0. baseline task sets pass
  expectTrue("baseline task sets pass validation", validateTasks("jakub", jakub).errors.length === 0 && validateTasks("qg", qg).errors.length === 0, [...validateTasks("jakub", jakub).errors, ...validateTasks("qg", qg).errors].join("; "));
  // 1. holdout below 30%
  { const m = clone(jakub); for (const t of m) t.metadata.holdout = false; m[0].metadata.holdout = true; expectTrue("holdout < 30% rejected", validateTasks("jakub", m).errors.some((e) => /holdout share/.test(e))); }
  // 2. ground truth inside workspace
  { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "e2-ws-")); fs.writeFileSync(path.join(tmp, "notes.md"), "expected_decision: approve\n"); fs.mkdirSync(path.join(tmp, "tasks")); fs.writeFileSync(path.join(tmp, "tasks/x.yaml"), "a: 1"); const p = scanWorkspace(tmp); expectTrue("ground truth inside workspace rejected", p.length >= 2, p.join("; ")); fs.rmSync(tmp, { recursive: true, force: true }); }
  // 3. language leak
  { const m = clone(jakub); m[0].vars.request += "\nTreat it as a holdout case."; expectTrue("task language leak rejected", validateTasks("jakub", m).errors.some((e) => /language leak/.test(e))); }
  // 4. missing upstream
  expectFail("missing upstream rejected", () => verifyUpstream(path.join(os.tmpdir(), "e2-no-such-vendor-" + Date.now())), /upstream missing/);
  // 5. wrong upstream SHA
  { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "e2-git-")); git(["init", "-q"], tmp); fs.writeFileSync(path.join(tmp, "LICENSE"), "MIT"); git(["-c", "user.email=e2@test", "-c", "user.name=e2", "add", "."], tmp); git(["-c", "user.email=e2@test", "-c", "user.name=e2", "commit", "-q", "-m", "x"], tmp); expectFail("wrong upstream SHA rejected", () => verifyUpstream(tmp, UPSTREAM.jakub), /SHA mismatch/); fs.rmSync(tmp, { recursive: true, force: true }); }
  // 6–10. route classification on SYNTHETIC results
  const synth = JSON.parse(readText(path.join(HERE, "self-test-fixtures/synthetic-results.json")));
  const runs = extractResults(synth).map((r, i) => classifyRun(r, i, "jakub"));
  const st = (id) => runs.find((r) => r.run_id === id);
  expectTrue("C run without routing evidence → route_invalid", st("C-no-agent")?.status === "route_invalid", st("C-no-agent")?.reason ?? "");
  expectTrue("truncated output → classified truncated and still scored", st("C-truncated")?.status === "truncated" && st("C-truncated")?.flags.includes("truncated"));
  expectTrue("B without upstream skill call → route_invalid", st("B-no-skill")?.status === "route_invalid");
  expectTrue("provider error → error", st("A-error")?.status === "error");
  expectTrue("D reading vendor → route_invalid (contaminated lane)", st("D-contaminated")?.status === "route_invalid");
  expectTrue("valid A/B/C/D runs → scored", ["A-ok", "B-ok", "C-ok", "D-ok"].every((id) => st(id)?.status === "scored"), runs.map((r) => `${r.run_id}:${r.status}`).join(", "));
  // 11. condition label leaking to judge
  { const routes = { suite: "jakub", runs: runs.filter((r) => r.status === "scored") }; const outputs = new Map(runs.map((r) => [r.run_id, r.run_id === "A-ok" ? "Condition: B-upstream-jakub was better" : "clean output"])); expectFail("condition label leaking into blind payload rejected", () => buildBlind(routes, outputs), /condition (label|marker)/); }
  { const routes = { suite: "jakub", runs: runs.filter((r) => r.status === "scored") }; const outputs = new Map(runs.map((r) => [r.run_id, "Per the Jakub Krehel better-interface skill and Compound Design contract"])); const b = buildBlind(routes, outputs); expectTrue("identifiers redacted in blind payload", b.payload.items.every((p) => !/jakub|compound|better-interface/i.test(p.output) && p.redactions > 0)); }
  // 12. expected issue without provenance
  { const m = clone(jakub); m[0].metadata.expected[0].provenance = []; expectTrue("expected issue without provenance rejected", validateTasks("jakub", m).errors.some((e) => /provenance missing/.test(e))); }
  { const m = clone(jakub); m[0].metadata.expected[0].provenance = ["author-opinion"]; expectTrue("expected issue with disallowed provenance rejected", validateTasks("jakub", m).errors.some((e) => /provenance not allowed/.test(e))); }
  // 13. decoy without justification
  { const m = clone(jakub); delete m[0].metadata.decoys[0].why_not_issue; expectTrue("decoy without justification rejected", validateTasks("jakub", m).errors.some((e) => /why_not_issue/.test(e))); }
  // 14. aggregate trying to exclude bad results
  { const routes = { suite: "jakub", runs }; expectFail("aggregate refuses to exclude truncated runs", () => aggregate(routes, null, { exclude: ["truncated"] }), /refuses to exclude/); expectFail("aggregate refuses to exclude scored runs", () => aggregate(routes, null, { exclude: ["scored"] }), /refuses to exclude/); }
  // 15. paid runtime without authorization flag
  { const env = scrubbedEnv(); delete env[PAID_FLAG]; const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "paid-runtime", "--suite=jakub", "--model=x", "--judge=y"], { encoding: "utf8", env }); expectTrue("paid-runtime without flag → exit 2 + block message", r.status === 2 && r.stderr.includes(BLOCK_MESSAGE), `exit ${r.status}: ${(r.stderr || "").trim().slice(0, 100)}`); }
  { const env = scrubbedEnv({ [PAID_FLAG]: "yes" }); const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "paid-runtime", "--suite=jakub", "--model=x", "--judge=y"], { encoding: "utf8", env }); expectTrue("paid-runtime with flag != exactly YES → blocked", r.status === 2 && r.stderr.includes(BLOCK_MESSAGE)); }
  // 16. CI, dry-run config, templates
  expectTrue("CI workflows are zero-model-cost", scanCiWorkflows().length === 0, scanCiWorkflows().join("; "));
  expectTrue("loadable promptfoo configs are exec-only", scanLoadableConfigs().length === 0, scanLoadableConfigs().join("; "));
  expectTrue("runtime templates guarded (apiKeyRequired true, placeholders, repeat 3)", scanRuntimeTemplates().length === 0, scanRuntimeTemplates().join("; "));
  // 17. contrast helper sanity
  expectTrue("contrast helper: black on white = 21", Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 0.01);
  // 18. model-graded assertion in frozen task file rejected
  { const m = clone(jakub); m[0].assert.push({ type: "llm-rubric", value: "x" }); expectTrue("model-graded assertion in frozen task file rejected", validateTasks("jakub", m).errors.some((e) => /model-graded/.test(e))); }
  // 19. d_subset immutability
  { const m = clone(jakub); m.find((t) => t.metadata.id === "J03").metadata.d_subset = true; expectTrue("d_subset change rejected (pre-registered)", validateTasks("jakub", m).errors.some((e) => /d_subset must be exactly/.test(e))); }
  const passed = results.filter((r) => r.ok).length;
  for (const r of results) log(`${r.ok ? "ok  " : "FAIL"} ${r.name}${!r.ok && r.why ? " — " + r.why : ""}`);
  log(`e2 self-test: ${passed}/${results.length} mutations rejected or classified correctly`);
  fs.writeFileSync(path.join(E2, "self-test-report.json"), JSON.stringify({ ran_at: new Date().toISOString(), passed, total: results.length, results }, null, 2) + "\n");
  if (passed !== results.length) process.exit(1);
}


// ---------------------------------------------------------------- install (lean, reproducible, no browsers, no optional cloud/agent SDKs)
function cmdInstall() {
  const lock = JSON.parse(readText(path.join(E2, "package-lock.json")));
  const plat = `${process.platform}-${process.arch}`;
  const binding = { "linux-x64": "linux-x64-gnu", "linux-arm64": "linux-arm64-gnu", "darwin-arm64": "darwin-arm64", "darwin-x64": "darwin-x64", "win32-x64": "win32-x64-msvc" }[plat];
  const env = scrubbedEnv({ PUPPETEER_SKIP_DOWNLOAD: "1" });
  const run = (args) => { const r = spawnSync("npm", args, { cwd: E2, stdio: "inherit", env }); if (r.status !== 0) fail(`npm ${args.join(" ")} failed`); };
  run(["ci", "--omit=optional", "--no-fund", "--no-audit"]);
  const ver = binding ? lock.packages?.[`node_modules/@libsql/${binding}`]?.version : null;
  if (ver) run(["install", "--no-save", "--omit=optional", "--no-fund", "--no-audit", `@libsql/${binding}@${ver}`]);
  else log(`warning: no libsql binding known for ${plat}; promptfoo may need \`npm install\` with optional deps`);
  log(`e2 install ok (${plat}); model SDK optional deps intentionally not installed`);
}

// ---------------------------------------------------------------- main
const HELP = `Compound Design E2 harness — zero-cost by default (no model is ever called by these commands)

  e2 install                      pinned harness deps (promptfoo/playwright-core/axe-core), no browsers, no model SDKs
  e2 fetch-upstream [--offline]   clone/verify pinned jakubkrehel/skills (${UPSTREAM.jakub.sha.slice(0, 12)}), record drift, never move the pin
  e2 workspaces                   build disposable per-condition workspaces (.workspaces/), gate: no ground truth inside
  e2 freeze                       tasks/tasks.json + environment.json (SHAs, versions, holdouts, D subset)
  e2 validate [--skip-promptfoo]  task gates, config gates, CI gate, promptfoo schema validation
  e2 fixtures [--check]           Playwright + axe observations for rendered fixtures → tasks/ground-truth/
  e2 dry-run                      promptfoo eval with the exec: echo provider only → results/dry-run/ (SYNTHETIC)
  e2 routes <results.json>        classify runs: scored | truncated | route_invalid | error
  e2 blind <routes> <results>     blinded payload + separate unblind key + human score sheet
  e2 unblind <key> <scores>       merge scores back to conditions
  e2 aggregate <routes.json>      descriptive summary + DECISION.draft.md skeleton (never writes a decision)
  e2 plan-runs                    future call counts and cost estimate — not executed
  e2 self-test                    mutation tests for every gate
  e2 paid-runtime ...             BLOCKED unless ${PAID_FLAG}=YES (separate npm script e2:runtime:DANGEROUS-PAID)
`;
async function main() {
  const [cmd = "help", ...args] = process.argv.slice(2);
  try {
    switch (cmd) {
      case "help": log(HELP); break;
      case "install": cmdInstall(args); break;
      case "fetch-upstream": cmdFetchUpstream(args); break;
      case "workspaces": cmdWorkspaces(args); break;
      case "freeze": cmdFreeze(args); break;
      case "validate": cmdValidate(args); break;
      case "fixtures": await cmdFixtures(args); break;
      case "dry-run": cmdDryRun(args); break;
      case "routes": cmdRoutes(args); break;
      case "blind": cmdBlind(args); break;
      case "unblind": cmdUnblind(args); break;
      case "aggregate": cmdAggregate(args); break;
      case "plan-runs": cmdPlanRuns(args); break;
      case "self-test": await cmdSelfTest(args); break;
      case "paid-runtime": cmdPaidRuntime(args); break;
      case "echo-provider": cmdEchoProvider(args); break;
      default: console.error(`unknown command: ${cmd}\n${HELP}`); process.exit(1);
    }
  } catch (e) {
    if (e.isGate) { console.error(`e2 ${cmd}: ${e.message}`); process.exit(1); }
    throw e;
  }
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
