#!/usr/bin/env node
// Deterministic checks on the exported site. No model, no network beyond localhost.
//
//   npm run site:check          # everything below
//   npm run site:check -- --static   # only the checks that need no browser (CI)
//
// Static (dependency-free):
//   - every route the content model promises exists in out/
//   - every internal href in the export resolves to a file
//   - every page keeps robots noindex (deliberate while in preview)
//   - no factual literal (version, level, status) outside src/content
//   - generated content is fresh
// Browser (playwright-core + axe-core from the pinned E2 harness, local Chromium):
//   - no horizontal overflow and no failed request at 1440 / 1280 / 820 / 390 / 320
//   - no axe violation of impact serious or critical outside the Lab's deliberately defective specimen
//   - keyboard: skip link is first, primary nav reachable, a term popover opens and closes with Escape,
//     the Lab stepper and findings are operable
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const OUT = path.join(ROOT, "out");
const E2 = path.join(ROOT, "compound-design/quality/e2");
const STATIC_ONLY = process.argv.includes("--static");
const require = createRequire(import.meta.url);

let failures = 0;
const ok = (msg) => console.log(`ok   ${msg}`);
const fail = (msg) => {
  failures += 1;
  console.log(`FAIL ${msg}`);
};

if (!fs.existsSync(path.join(OUT, "index.html"))) {
  console.error("out/ is missing — run `npm run build` first");
  process.exit(2);
}

// ------------------------------------------------------------------ routes
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "compound-design/registry/resource-registry.json"), "utf8"));
const conceptIds = [...fs.readdirSync(path.join(ROOT, "src/content")).filter((f) => f.startsWith("concepts-")).flatMap((f) => [...fs.readFileSync(path.join(ROOT, "src/content", f), "utf8").matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]))];
const routes = [
  "/",
  "/how-it-works",
  "/lab",
  "/project",
  "/resources",
  "/evidence",
  "/learn",
  "/case-study",
  ...registry.resources.filter((r) => r.status === "active").map((r) => `/resources/${r.id}`),
  ...conceptIds.map((id) => `/learn/${id}`),
];
const fileFor = (route) => {
  if (route === "/") return path.join(OUT, "index.html");
  const p = path.join(OUT, route.replace(/^\//, ""));
  if (fs.existsSync(p + ".html")) return p + ".html";
  if (fs.existsSync(path.join(p, "index.html"))) return path.join(p, "index.html");
  return null;
};
let missing = 0;
for (const r of routes) if (!fileFor(r)) { missing += 1; fail(`route not exported: ${r}`); }
if (!missing) ok(`${routes.length} routes exported (${conceptIds.length} concepts, ${registry.resources.filter((r) => r.status === "active").length} resources)`);

// ------------------------------------------------------------------ links + noindex
const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmlFiles.push(p);
  }
})(OUT);
let broken = 0;
let noindexMissing = 0;
const seen = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  if (!/name="robots"[^>]*content="noindex,\s*nofollow"/.test(html) && !/content="noindex, nofollow"[^>]*name="robots"/.test(html)) {
    noindexMissing += 1;
    fail(`noindex missing on ${path.relative(OUT, f)}`);
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    const target = clean.startsWith("/_next/") || /\.\w+$/.test(clean) ? path.join(OUT, clean) : fileFor(clean);
    if (!target || !fs.existsSync(target)) {
      broken += 1;
      fail(`broken internal link ${href} in ${path.relative(OUT, f)}`);
    }
  }
}
if (!broken) ok(`${seen.size} distinct internal links resolve across ${htmlFiles.length} pages`);
if (!noindexMissing) ok(`robots noindex present on all ${htmlFiles.length} pages (deliberate while in preview)`);

// ------------------------------------------------------------------ literal drift
const LITERALS = [registry.release, registry.evidencePolicy.stableEvidenceBaseline, /\bE[0-4]\b/, "not measured", "not executed", /\b(15|21|24)\s+(skills|resources)\b/, /\b6\s+agents\b/];
let drift = 0;
(function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (p === path.join(ROOT, "src/content")) continue;
      scan(p);
    } else if (/\.(tsx|ts|css)$/.test(e.name)) {
      const text = fs.readFileSync(p, "utf8");
      text.split("\n").forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may name the rule
        for (const lit of LITERALS) {
          const hit = typeof lit === "string" ? line.includes(lit) : lit.test(line);
          if (hit) {
            // Allow the level to be referenced only through a content import or a Term id.
            if (/\bid="(cel|cdqi|e[0-4])"|Term id=|conceptById\(|href=\{?`?\/learn\/e[0-4]/.test(line)) continue;
            drift += 1;
            fail(`factual literal outside src/content: ${path.relative(ROOT, p)}:${i + 1}  ${line.trim().slice(0, 100)}`);
          }
        }
      });
    }
  }
})(path.join(ROOT, "src"));
if (!drift) ok("no factual literal (version, level, runtime status, counts) outside src/content");

// ------------------------------------------------------------------ generated content
try {
  execFileSync(process.execPath, [path.join(ROOT, "scripts/build-content.mjs"), "--check"], { stdio: "pipe" });
  ok("generated content is fresh");
} catch (e) {
  fail(`generated content stale: ${String(e.stdout || e.message).trim()}`);
}

if (STATIC_ONLY) {
  console.log(failures ? `site-check (static): ${failures} failure(s)` : "site-check (static): all checks passed");
  process.exit(failures ? 1 : 0);
}

// ------------------------------------------------------------------ browser checks
function findChromium() {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers", path.join(process.env.HOME || "", ".cache/ms-playwright")].filter(Boolean);
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    for (const d of fs.readdirSync(r).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const bin of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
        const p = path.join(r, d, bin);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
}
const executablePath = findChromium();
const pwPath = path.join(E2, "node_modules/playwright-core");
if (!executablePath || !fs.existsSync(pwPath)) {
  console.log("skip browser checks: local Chromium or playwright-core not available (run `npm run e2:install`)");
  console.log(failures ? `site-check: ${failures} failure(s)` : "site-check: static checks passed; browser checks skipped");
  process.exit(failures ? 1 : 0);
}
const { chromium } = require(pwPath);
const axeSource = fs.readFileSync(path.join(E2, "node_modules/axe-core/axe.min.js"), "utf8");

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  let f = p === "/" ? path.join(OUT, "index.html") : path.join(OUT, p);
  if (fs.existsSync(f + ".html")) f = f + ".html";
  else if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("content-type", types[path.extname(f)] || "application/octet-stream");
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

const VIEWPORTS = [1440, 1280, 820, 390, 320];
const sample = ["/", "/how-it-works", "/lab", "/project", "/resources", "/resources/cd-interface-review", "/evidence", "/learn", "/learn/holdout", "/case-study"];
for (const route of sample) {
  let clean = true;
  for (const w of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const bad = [];
    page.on("requestfailed", (r) => {
      const why = r.failure()?.errorText || "";
      if (why.includes("ERR_ABORTED")) return; // a Link prefetch cancelled by navigation or close, not a broken asset
      bad.push(`requestfailed ${r.url()} (${why})`);
    });
    page.on("response", (r) => { if (r.status() >= 400) bad.push(`HTTP ${r.status()} ${r.url()}`); });
    page.on("pageerror", (e) => bad.push(`pageerror ${e.message}`));
    await page.goto(base + route, { waitUntil: "networkidle" });
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (m.sw > m.cw + 1) { clean = false; fail(`horizontal overflow ${route} @${w}: scrollWidth ${m.sw} > ${m.cw}`); }
    if (bad.length) { clean = false; fail(`${route} @${w}: ${bad.slice(0, 3).join(" | ")}`); }
    await page.close();
  }
  if (clean) ok(`${route}: no overflow, no failed request at ${VIEWPORTS.join("/")}`);
}

// axe on each sample route at desktop, excluding the Lab's specimen (its defects are the lesson)
let axeTotal = 0;
for (const route of sample) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600); // entrance animations (timeline rail, marker settle) end; axe measures the page at rest
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const r = await window.axe.run({ exclude: [["[data-lab-fixture]"]] }, { resultTypes: ["violations"] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
  });
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const minor = violations.filter((v) => !(v.impact === "serious" || v.impact === "critical"));
  axeTotal += violations.length;
  if (serious.length) fail(`axe ${route}: ${serious.map((v) => `${v.id}(${v.impact}×${v.nodes})`).join(", ")}`);
  else ok(`axe ${route}: 0 serious/critical${minor.length ? `; ${minor.length} moderate/minor noted: ${minor.map((v) => v.id).join(", ")}` : ""}`);
  await page.close();
}

// keyboard
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute("href") }));
  if (first.href === "#content") ok("keyboard: skip link is the first tab stop"); else fail(`keyboard: first tab stop is ${JSON.stringify(first)}`);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const nav = await page.evaluate(() => document.activeElement?.closest("nav")?.getAttribute("aria-label"));
  if (nav === "Primary") ok("keyboard: primary navigation reachable"); else fail(`keyboard: expected primary nav, got ${nav}`);
  // a term popover
  const term = page.locator("button[aria-expanded]").first();
  await term.focus();
  await page.keyboard.press("Enter");
  const opened = await page.evaluate(() => document.querySelector("[role=dialog]") !== null);
  await page.keyboard.press("Escape");
  const closed = await page.evaluate(() => document.querySelector("[role=dialog]") === null);
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded") === "false");
  if (opened && closed && focusBack) ok("keyboard: term popover opens on Enter, closes on Escape, focus returns"); else fail(`keyboard: popover opened=${opened} closed=${closed} focusBack=${focusBack}`);
  await page.close();
}
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/lab", { waitUntil: "networkidle" });
  const tab = page.locator("[role=tab]").first();
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  const sel = await page.evaluate(() => document.activeElement?.getAttribute("aria-selected"));
  const name = await page.evaluate(() => document.activeElement?.textContent?.includes("Verify"));
  if (sel === "true" && name) ok("keyboard: Lab stepper moves with arrow keys"); else fail(`keyboard: Lab stepper aria-selected=${sel} verify=${name}`);
  const finding = page.locator("button[aria-pressed]").first();
  await finding.focus();
  await page.keyboard.press("Enter");
  const pressed = await page.evaluate(() => document.activeElement?.getAttribute("aria-pressed"));
  const contract = await page.evaluate(() => document.querySelector("dl[aria-label^='Finding']") !== null);
  if (pressed === "true" && contract) ok("keyboard: Lab finding selectable, contract rendered"); else fail(`keyboard: finding pressed=${pressed} contract=${contract}`);
  await page.close();
}
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/project", { waitUntil: "networkidle" });
  const tabs = await page.locator("[role=tab]").count();
  const selectedName = await page.evaluate(() => document.querySelector("[role=tab][aria-selected=true]")?.textContent);
  if (tabs === 6 && /Work system/.test(selectedName || "")) ok("timeline: six markers, current stage selected by default"); else fail(`timeline: tabs=${tabs} selected=${selectedName}`);
  await page.close();
}
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/learn", { waitUntil: "networkidle" });
  await page.fill("input[type=search]", "teste que não foi visto");
  const first = await page.evaluate(() => document.querySelector("[aria-label='Search results'] a")?.getAttribute("href"));
  if (first === "/learn/holdout") ok("search: “teste que não foi visto” → Holdout"); else fail(`search: got ${first}`);
  await page.fill("input[type=search]", "esconder qual versão foi usada");
  const second = await page.evaluate(() => document.querySelector("[aria-label='Search results'] a")?.getAttribute("href"));
  if (second === "/learn/blinding") ok("search: “esconder qual versão foi usada” → Blinding"); else fail(`search: got ${second}`);
  await page.fill("input[type=search]", "como saber se funciona");
  const third = await page.evaluate(() => [...document.querySelectorAll("[aria-label='Search results'] a")].slice(0, 3).map((a) => a.getAttribute("href")));
  if (third.includes("/learn/cel")) ok(`search: “como saber se funciona” → ${third.join(", ")}`); else fail(`search: got ${third.join(", ")}`);
  await page.close();
}

await browser.close();
server.close();
console.log(failures ? `site-check: ${failures} failure(s)` : `site-check: all checks passed (${axeTotal} axe findings total, none serious/critical)`);
process.exit(failures ? 1 : 0);
