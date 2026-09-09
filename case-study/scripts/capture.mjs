// Deterministic capture archive for every design milestone (PRD §8).
// For each milestone: serve the locally built exact commit, render each representative surface
// at 1440×900 and 390×844, save full-page PNGs, a sections.json of camera targets, interaction
// states, visual fingerprints and a metadata.json with SHA-256 for every artifact.
// Zero model runtime. Usage: node case-study/scripts/capture.mjs [V01 V02 ...]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { serveMilestone } from "./lib/serve.mjs";

const ROOT = "/home/user/compoundmetrics";
const require = createRequire(path.join(ROOT, "compound-design/quality/e2/package.json"));
const { chromium } = require("playwright-core");
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const MILESTONES = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));
const TOOLS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/TOOLS-MANIFEST.json"), "utf8"));
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const only = process.argv.slice(2);
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "root";

const SECTIONS_JS = () => {
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x + scrollX), y: Math.round(r.y + scrollY), width: Math.round(r.width), height: Math.round(r.height) }; };
  const out = {};
  const header = document.querySelector("header, [role=banner]"); if (header) out.nav = box(header);
  const nav = document.querySelector("nav, [role=navigation]"); if (nav && !out.nav) out.nav = box(nav);
  const main = document.querySelector("main, [role=main]") || document.body;
  const kids = [...main.children].filter((k) => k.getBoundingClientRect().height > 40);
  if (kids[0]) out.hero = box(kids[0]);
  kids.slice(0, 12).forEach((k, i) => { const id = k.id || k.getAttribute("aria-label") || k.tagName.toLowerCase() + "-" + i; out["section:" + id] = box(k); });
  const footer = document.querySelector("footer, [role=contentinfo]"); if (footer) out.footer = box(footer);
  const form = document.querySelector("form"); if (form) out.form = box(form);
  const h1 = document.querySelector("h1"); if (h1) out.h1 = box(h1);
  const cta = document.querySelector("main a[class*=cta], main a[class*=button], main button, a[href*=signup], a[href*=start]"); if (cta) out.primary_action = box(cta);
  out._page = { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight };
  return out;
};

const FINGERPRINT_JS = () => {
  const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0; };
  const els = [...document.querySelectorAll("body *")].filter(vis).slice(0, 4000);
  const fams = new Map(), sizes = new Map(), weights = new Map(), colors = new Map(), bgs = new Map(), radii = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const el of els) {
    const s = getComputedStyle(el);
    if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      bump(fams, s.fontFamily.split(",")[0].replace(/["']/g, "").trim()); bump(sizes, Math.round(parseFloat(s.fontSize))); bump(weights, s.fontWeight); bump(colors, s.color);
    }
    if (s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)") bump(bgs, s.backgroundColor);
    if (s.borderRadius && s.borderRadius !== "0px") bump(radii, s.borderRadius);
  }
  const top = (m, n = 8) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k}×${v}`);
  const main = document.querySelector("main") || document.body;
  const order = [...main.children].map((k) => k.tagName.toLowerCase() + (k.id ? "#" + k.id : "") + (k.className && typeof k.className === "string" ? "." + k.className.split(/\s+/)[0] : "")).slice(0, 20);
  const landmarks = [...document.querySelectorAll("header,nav,main,aside,footer,section,article,form")].map((e) => e.tagName.toLowerCase());
  const heads = [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName.toLowerCase() + ":" + h.textContent.trim().slice(0, 40));
  const navLinks = [...document.querySelectorAll("header a, nav a")].map((a) => a.textContent.trim()).filter(Boolean).slice(0, 20);
  return { font_families: top(fams), font_sizes: top(sizes, 14), font_weights: top(weights), text_colors: top(colors), background_colors: top(bgs), radii: top(radii), section_order: order, landmarks, headings: heads, nav_links: navLinks, title: document.title, stylesheet_hrefs: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href) };
};

async function ahash(browser, pngBuffer) {
  const page = await browser.newPage();
  const dataUrl = "data:image/png;base64," + pngBuffer.toString("base64");
  const hex = await page.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement("canvas"); c.width = 16; c.height = 16; const ctx = c.getContext("2d");
    // top of the page only (first 900 css px band scaled), so long pages hash the same region
    const band = Math.min(img.naturalHeight, Math.round(img.naturalWidth * 900 / 1440));
    ctx.drawImage(img, 0, 0, img.naturalWidth, band, 0, 0, 16, 16);
    const d = ctx.getImageData(0, 0, 16, 16).data; const g = []; for (let i = 0; i < d.length; i += 4) g.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    const mean = g.reduce((a, b) => a + b, 0) / g.length; let bits = ""; for (const v of g) bits += v > mean ? "1" : "0";
    return BigInt("0b" + bits).toString(16).padStart(64, "0");
  }, dataUrl);
  await page.close(); return hex;
}

async function settle(page) { try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {} await page.waitForTimeout(1500); await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 400)); window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300)); }); }

async function captureMilestone(browser, m) {
  const buildDir = path.join(ROOT, ".research/builds", m.build);
  const outDir = path.join(ROOT, "case-study/archive", m.id);
  fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(path.join(outDir, "states"), { recursive: true }); fs.mkdirSync(path.join(outDir, "surfaces"), { recursive: true });
  const srv = await serveMilestone(buildDir, m);
  const files = {}, sections = {}, fingerprints = {}, notes = [];
  const save = (rel, buf) => { fs.writeFileSync(path.join(outDir, rel), buf); files[rel] = { sha256: sha256(buf), bytes: buf.length }; };
  const surfaces = Object.entries(m.surfaces).filter(([k, v]) => v && k !== "MOBILE_ENTRY");
  let entryDesktopPng = null;
  for (const [surface, route] of surfaces) {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: "reduce", isMobile: vpName === "mobile", hasTouch: vpName === "mobile", locale: "pt-BR", timezoneId: "UTC", colorScheme: "dark" });
      const page = await ctx.newPage(); const failed = [];
      page.on("requestfailed", (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText || "")) failed.push(r.url()); });
      const resp = await page.goto(srv.url + route, { waitUntil: "load", timeout: 60000 });
      if (!resp || resp.status() >= 400) { notes.push(`${surface} ${vpName}: HTTP ${resp?.status()} for ${route}`); await ctx.close(); continue; }
      await settle(page);
      const png = await page.screenshot({ fullPage: true, animations: "disabled", caret: "hide" });
      const rel = `surfaces/${surface}-${vpName}.png`; save(rel, png);
      if (surface === "ENTRY") { save(vpName === "desktop" ? "desktop-full.png" : "mobile-full.png", png); if (vpName === "desktop") entryDesktopPng = png; }
      const sec = await page.evaluate(SECTIONS_JS); sections[`${surface}:${vpName}`] = { route, viewport: vp, ...sec };
      if (vpName === "desktop") fingerprints[surface] = await page.evaluate(FINGERPRINT_JS);
      // viewport-only hero shot (first screen) for the film
      save(`surfaces/${surface}-${vpName}-first-screen.png`, await page.screenshot({ fullPage: false, animations: "disabled", caret: "hide" }));
      // states
      try {
        if (vpName === "desktop") {
          await page.keyboard.press("Tab"); await page.waitForTimeout(200);
          save(`states/${surface}-focus-first.png`, await page.screenshot({ animations: "disabled" }));
          const link = page.locator("main a, main button").first(); if (await link.count()) { await link.hover({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(250); save(`states/${surface}-hover-first.png`, await page.screenshot({ animations: "disabled" })); }
          const submit = page.locator("form button[type=submit], form input[type=submit], form button").first();
          if (await submit.count()) { await submit.scrollIntoViewIfNeeded().catch(() => {}); await submit.click({ timeout: 2000, force: true }).catch(() => {}); await page.waitForTimeout(600); save(`states/${surface}-form-submit-empty.png`, await page.screenshot({ animations: "disabled" })); }
        } else {
          const toggle = page.locator("header button, nav button, button[aria-expanded], button[aria-label*=menu i], button[aria-label*=Menu]").first();
          if (await toggle.count()) { await toggle.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(500); save(`states/${surface}-mobile-nav-open.png`, await page.screenshot({ animations: "disabled" })); }
        }
      } catch (e) { notes.push(`${surface} ${vpName} state capture: ${e.message.split("\n")[0]}`); }
      if (failed.length) notes.push(`${surface} ${vpName}: ${failed.length} failed requests (${failed.slice(0, 3).join(", ")})`);
      await ctx.close();
    }
  }
  // css hash: fetch stylesheets referenced by ENTRY
  let cssHash = null;
  try { const hrefs = fingerprints.ENTRY?.stylesheet_hrefs || []; let css = ""; for (const h of hrefs) css += await (await fetch(h)).text(); if (css) cssHash = sha256(css); } catch {}
  const ah = entryDesktopPng ? await ahash(browser, entryDesktopPng) : null;
  const fp = fingerprints.ENTRY || {};
  const domSig = sha256(JSON.stringify({ l: fp.landmarks, o: fp.section_order, n: fp.nav_links }));
  const typo = sha256(JSON.stringify({ f: fp.font_families, s: fp.font_sizes, w: fp.font_weights }));
  const color = sha256(JSON.stringify({ t: fp.text_colors, b: fp.background_colors }));
  await srv.close();
  fs.writeFileSync(path.join(outDir, "sections.json"), JSON.stringify(sections, null, 1));
  files["sections.json"] = { sha256: sha256(fs.readFileSync(path.join(outDir, "sections.json"))), bytes: fs.statSync(path.join(outDir, "sections.json")).size };
  const tools = m.tool_ids.map((id) => TOOLS.tools.find((t) => t.id === id)?.name);
  const meta = {
    milestone: m.id, build: m.build, name: m.name, tool_ids: m.tool_ids, tools, repository: m.repo, source_sha: m.source_sha,
    representative_url: m.representative_url, equivalent_deployments: m.equivalent_deployments, date_range: m.date_range,
    captured_at: new Date().toISOString(), capture_method: `exact commit built locally (${m.serve === "static" ? "static export served by scripts/lib/serve.mjs" : "next start"}); playwright-core ${require("playwright-core/package.json").version}; Chromium ${await browser.version()}; reducedMotion=reduce, animations=disabled, deviceScaleFactor=1, colorScheme=dark`,
    build_adjustments: ["M04", "M11"].includes(m.build) ? ["next.config.ts: typescript.ignoreBuildErrors=true (type errors in the unrelated video/ package; no UI source touched)"] : [],
    viewports: VIEWPORTS, surfaces: m.surfaces,
    visual_fingerprint: { ahash16_entry_top_band: ah, dom_signature: domSig, css_sha256: cssHash, typography: typo, color: color, section_order: fp.section_order, nav_links: fp.nav_links, landmarks: fp.landmarks },
    fingerprint_detail: fingerprints, notes, files,
  };
  fs.writeFileSync(path.join(outDir, "metadata.json"), JSON.stringify(meta, null, 1));
  console.log(`${m.id} ${m.build}: ${Object.keys(files).length} files, ahash ${ah}, notes ${notes.length}`);
  for (const n of notes) console.log("   -", n);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
for (const m of MILESTONES.milestones) { if (only.length && !only.includes(m.id)) continue; try { await captureMilestone(browser, m); } catch (e) { console.log(`${m.id} FAILED: ${e.message}`); } }
await browser.close();
