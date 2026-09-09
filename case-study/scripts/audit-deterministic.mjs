// Deterministic checks of the frozen Compound Design Audit (ITEM-CLASSIFICATION.json, mode=deterministic).
// Every rule here is the one pre-declared in the classification; nothing is scored that the rule does not decide.
// Output: case-study/design-benchmark/results/<V>/deterministic.json  (per surface × item: state, measured, expected, evidence)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { serveMilestone } from "./lib/serve.mjs";

const ROOT = "/home/user/compoundmetrics";
const require = createRequire(path.join(ROOT, "compound-design/quality/e2/package.json"));
const { chromium } = require("playwright-core");
const AXE = require.resolve("axe-core/axe.min.js");
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const MS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));
const CLS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/design-benchmark/rubric/ITEM-CLASSIFICATION.json"), "utf8"));
const RULE = Object.fromEntries(CLS.items.map((i) => [i.id, i.rule]));
const only = process.argv.slice(2);

const DOM_JS = (isMobile) => {
  const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0; };
  const all = [...document.querySelectorAll("body *")].filter(vis).slice(0, 5000);
  const hasText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const text = all.filter(hasText);
  const R = {};
  // headings
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(vis);
  const levels = hs.map((h) => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++;
  const h1 = hs.filter((h) => h.tagName === "H1"); const h2 = hs.filter((h) => h.tagName === "H2");
  const fs1 = h1[0] ? parseFloat(getComputedStyle(h1[0]).fontSize) : null; const fs2 = h2[0] ? parseFloat(getComputedStyle(h2[0]).fontSize) : null;
  R.headings = { h1_count: h1.length, heading_count: hs.length, level_skips: skips, h1_px: fs1, h2_px: fs2, h1_weight: h1[0] ? getComputedStyle(h1[0]).fontWeight : null, h2_weight: h2[0] ? getComputedStyle(h2[0]).fontWeight : null, sequence: levels.slice(0, 40) };
  // type scale / families / weights
  const sizes = new Map(), fams = new Map(), weights = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const el of text) { const s = getComputedStyle(el); bump(sizes, Math.round(parseFloat(s.fontSize) * 2) / 2); bump(fams, s.fontFamily.split(",")[0].replace(/["']/g, "").trim()); bump(weights, s.fontWeight); }
  const sorted = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  R.type = { distinct_sizes: sizes.size, sizes: sorted(sizes), families: sorted(fams), weights: sorted(weights) };
  // spacing
  let sp = 0, sp4 = 0; const off = new Map();
  for (const el of all) { const s = getComputedStyle(el); for (const p of ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginBottom", "rowGap", "columnGap"]) { const v = Math.round(parseFloat(s[p])); if (!v || v < 0 || isNaN(v)) continue; sp++; if (v % 4 === 0) sp4++; else bump(off, v); } }
  R.spacing = { values: sp, multiples_of_4: sp4, pct: sp ? Math.round((sp4 / sp) * 1000) / 10 : null, off_grid_top: sorted(off).slice(0, 8) };
  // shadows / radius / motion
  const shadows = new Map(), radii = new Map(), durs = [];
  for (const el of all) { const s = getComputedStyle(el); if (s.boxShadow && s.boxShadow !== "none") bump(shadows, s.boxShadow); const br = s.borderRadius; if (br && br !== "0px" && !/50%|9999|1e\+/.test(br)) bump(radii, br);
    const props = s.transitionProperty; if (props && props !== "all" && props !== "none" || (props === "all" && s.transitionDuration !== "0s")) { for (const d of s.transitionDuration.split(",")) { const ms = parseFloat(d) * (d.trim().endsWith("ms") ? 1 : 1000); if (ms > 0) durs.push(ms); } }
    if (s.animationName && s.animationName !== "none") for (const d of s.animationDuration.split(",")) { const ms = parseFloat(d) * (d.trim().endsWith("ms") ? 1 : 1000); if (ms > 0) durs.push(ms); } }
  R.shadows = { distinct: shadows.size, values: sorted(shadows).slice(0, 6).map(([k, v]) => [k.slice(0, 60), v]) };
  R.radii = { distinct: radii.size, values: sorted(radii).slice(0, 8) };
  R.motion = { declared: durs.length, le300: durs.filter((d) => d <= 300).length, gt300: sorted(new Map(durs.filter((d) => d > 300).map((d) => [d, 1]))).slice(0, 8).map((x) => x[0]) };
  // keyboard
  const inter = all.filter((el) => el.matches("a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[tabindex]"));
  const notFocusable = inter.filter((el) => el.getAttribute("tabindex") === "-1" && !el.closest("[aria-hidden=true]")).length;
  const positiveTab = inter.filter((el) => +el.getAttribute("tabindex") > 0).length;
  const roleNoTab = all.filter((el) => (el.getAttribute("role") === "button" || el.getAttribute("role") === "link") && !el.matches("a,button") && !(+el.getAttribute("tabindex") >= 0)).length;
  const hrefless = [...document.querySelectorAll("a:not([href])")].filter(vis).length;
  R.keyboard = { interactive: inter.length, tabindex_minus1: notFocusable, positive_tabindex: positiveTab, role_without_tabindex: roleNoTab, anchors_without_href: hrefless };
  // targets (mobile)
  if (isMobile) { const t = inter.map((el) => { const r = el.getBoundingClientRect(); const inline = el.tagName === "A" && el.parentElement && /P|LI|SPAN|TD|DD/.test(el.parentElement.tagName); return { w: Math.round(r.width), h: Math.round(r.height), inline, tag: el.tagName, txt: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30) }; });
    const ok = t.filter((x) => (x.w >= 44 && x.h >= 44) || (x.inline && x.h >= 24)); R.targets = { total: t.length, ok: ok.length, pct: t.length ? Math.round((ok.length / t.length) * 1000) / 10 : null, worst: t.filter((x) => !((x.w >= 44 && x.h >= 44) || (x.inline && x.h >= 24))).slice(0, 8) }; }
  // semantics / nav / breadcrumbs / chunks
  const navs = [...document.querySelectorAll("nav, header nav, [role=navigation]")].filter(vis);
  const primaryNav = navs[0] || document.querySelector("header") || null;
  const navLinks = primaryNav ? [...primaryNav.querySelectorAll("a")].filter(vis) : [];
  const current = navLinks.filter((a) => a.hasAttribute("aria-current") || /\b(active|current|selected)\b/i.test(a.className) || (a.getAttribute("href") && new URL(a.href).pathname === location.pathname));
  const styledCurrent = navLinks.filter((a) => { if (!a.getAttribute("href")) return false; if (new URL(a.href).pathname !== location.pathname) return false; const s = getComputedStyle(a); const sib = navLinks.find((b) => b !== a); if (!sib) return false; const t = getComputedStyle(sib); return s.color !== t.color || s.fontWeight !== t.fontWeight || s.textDecorationLine !== t.textDecorationLine || s.borderBottomWidth !== t.borderBottomWidth || s.backgroundColor !== t.backgroundColor; });
  R.nav = { has_main: !!document.querySelector("main,[role=main]"), has_nav: navs.length > 0, has_header: !!document.querySelector("header"), nav_text: primaryNav ? primaryNav.innerText.replace(/\s+/g, " ").trim().slice(0, 300) : null, nav_items: navLinks.length, current_marked: current.filter((a) => a.hasAttribute("aria-current") || /\b(active|current|selected)\b/i.test(a.className)).length, current_styled: styledCurrent.length, path: location.pathname, depth: location.pathname.split("/").filter(Boolean).length,
    breadcrumb: !!document.querySelector("nav[aria-label*=read i], .breadcrumb, [class*=breadcrumb], ol[class*=crumb]"), parent_link: [...document.querySelectorAll("main a, article a")].some((a) => { const p = location.pathname.replace(/\.html$/, "").split("/").filter(Boolean); if (p.length < 2) return false; const parent = "/" + p.slice(0, -1).join("/"); const h = a.getAttribute("href") || ""; return h.replace(/\.html$/, "") === parent || h.replace(/\.html$/, "") === parent + "/"; }),
    big_lists: [...document.querySelectorAll("ul,ol")].filter(vis).filter((l) => l.children.length > 9 && [...l.children].every((li) => li.querySelector("a"))).map((l) => l.children.length).slice(0, 5) };
  // links in text
  const inText = [...document.querySelectorAll("p a, li a, dd a, td a")].filter(vis);
  const styled = inText.filter((a) => { const s = getComputedStyle(a); return s.textDecorationLine.includes("underline") || s.borderBottomWidth !== "0px" || (a.parentElement && getComputedStyle(a.parentElement).fontWeight !== s.fontWeight); });
  R.links = { in_text: inText.length, distinguished_not_only_color: styled.length };
  // forms
  const inputs = [...document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea")].filter(vis);
  const labelled = inputs.filter((i) => { const id = i.id; const lab = (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || i.closest("label"); if (!lab) return false; const s = getComputedStyle(lab); const r = lab.getBoundingClientRect(); return r.width > 1 && r.height > 1 && s.clipPath !== "inset(50%)" && s.position !== "absolute" || r.width > 20; });
  const typed = inputs.filter((i) => /mail|phone|tel|fone|celular|cpf|cep|number|numero|idade/i.test((i.name || "") + (i.id || "") + (i.placeholder || "") + (i.getAttribute("aria-label") || "")));
  const typedOk = typed.filter((i) => ["email", "tel", "number"].includes(i.type) || i.getAttribute("inputmode") || i.getAttribute("autocomplete"));
  const small = inputs.filter((i) => parseFloat(getComputedStyle(i).fontSize) < 16).map((i) => ({ name: i.name || i.id || i.type, px: parseFloat(getComputedStyle(i).fontSize) }));
  R.forms = { inputs: inputs.length, visibly_labelled: labelled.length, typed_candidates: typed.length, typed_ok: typedOk.length, below_16px: small, has_search: !!document.querySelector("input[type=search], [role=search], input[placeholder*=earch i], input[placeholder*=usca i], button[aria-label*=earch i]") };
  // meta / css
  const meta = document.querySelector("meta[name=viewport]")?.content || null;
  let cssText = ""; for (const s of document.styleSheets) { try { for (const r of s.cssRules) cssText += r.cssText + "\n"; } catch {} }
  R.css = { viewport_meta: meta, reduced_motion_query: /prefers-reduced-motion/.test(cssText), css_chars: cssText.length, has_animation: /animation|transition/.test(cssText) };
  return R;
};

async function axeRun(page, rules) { await page.addScriptTag({ path: AXE }); return page.evaluate(async (rules) => { const r = await axe.run(document, { runOnly: { type: "rule", values: rules } }); return { violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map((n) => ({ target: n.target.join(" "), html: n.html.slice(0, 120), summary: n.failureSummary?.slice(0, 200) })) })), incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })) }; }, rules); }

async function focusCheck(page) {
  const res = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab"); await page.waitForTimeout(80);
    const r = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const s = getComputedStyle(el); const focused = { o: s.outlineStyle + " " + s.outlineWidth + " " + s.outlineColor, bs: s.boxShadow, bg: s.backgroundColor, c: s.color, td: s.textDecorationLine, bc: s.borderColor };
      el.blur(); const t = getComputedStyle(el); const blurred = { o: t.outlineStyle + " " + t.outlineWidth + " " + t.outlineColor, bs: t.boxShadow, bg: t.backgroundColor, c: t.color, td: t.textDecorationLine, bc: t.borderColor }; el.focus({ preventScroll: true });
      const changed = JSON.stringify(focused) !== JSON.stringify(blurred) || (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0);
      return { tag: el.tagName, text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30), changed, outline: focused.o }; });
    if (!r) break; res.push(r);
  }
  return res;
}

function decide(R, ax, focus, zoom, surface, vpName, mobileR) {
  const out = {}; const set = (id, state, measured, evidence) => (out[id] = { state, measured, expected: RULE[id], evidence });
  const H = R.headings;
  if (H.heading_count === 0) set("hierarquia/headings", "N/A", H, "no headings on surface"); else set("hierarquia/headings", H.h1_count === 1 && H.level_skips === 0 && (H.h2_px == null || H.h1_px >= 1.5 * H.h2_px || H.h1_weight !== H.h2_weight) ? "PASS" : "FAIL", { h1_count: H.h1_count, level_skips: H.level_skips, h1_px: H.h1_px, h2_px: H.h2_px }, `h1 count ${H.h1_count}, level skips ${H.level_skips}, h1 ${H.h1_px}px vs h2 ${H.h2_px}px`);
  set("hierarquia/escala-tipo", R.type.distinct_sizes <= 10 ? "PASS" : "FAIL", R.type.distinct_sizes, `distinct computed font sizes: ${R.type.sizes.map((x) => x[0]).join(", ")}`);
  set("estilo/espaco-base", R.spacing.pct == null ? "N/A" : R.spacing.pct >= 90 ? "PASS" : "FAIL", R.spacing.pct, `${R.spacing.multiples_of_4}/${R.spacing.values} spacing values are multiples of 4; off-grid: ${R.spacing.off_grid_top.map((x) => x[0] + "px×" + x[1]).join(", ")}`);
  set("estilo/elevacao", R.shadows.distinct === 0 ? "N/A" : R.shadows.distinct <= 3 ? "PASS" : "FAIL", R.shadows.distinct, `distinct box-shadow values: ${R.shadows.distinct}`);
  const famN = R.type.families.filter((f) => !/emoji|symbol|icon|monospace$/i.test(f[0])).length;
  set("estilo/tipo-sistema", famN <= 2 && R.type.weights.length <= 4 ? "PASS" : "FAIL", { families: R.type.families.map((f) => f[0]), weights: R.type.weights.map((w) => w[0]) }, `${famN} families (${R.type.families.map((f) => f[0]).join(" / ")}), ${R.type.weights.length} weights (${R.type.weights.map((w) => w[0]).join(", ")})`);
  set("estilo/radius", R.radii.distinct === 0 ? "N/A" : R.radii.distinct <= 4 ? "PASS" : "FAIL", R.radii.distinct, `distinct radii: ${R.radii.values.map((x) => x[0]).join(", ")}`);
  const M = R.motion; set("estilo/motion", M.declared === 0 ? "N/A" : M.le300 / M.declared >= 0.9 ? "PASS" : "FAIL", { declared: M.declared, le300: M.le300 }, `${M.le300}/${M.declared} declared durations ≤ 300 ms; > 300: ${M.gt300.join(", ")}`);
  const K = R.keyboard; set("acessibilidade/teclado", K.interactive === 0 ? "N/A" : K.tabindex_minus1 === 0 && K.positive_tabindex === 0 && K.role_without_tabindex === 0 && K.anchors_without_href === 0 ? "PASS" : "FAIL", K, `interactive ${K.interactive}; tabindex=-1 ${K.tabindex_minus1}; positive tabindex ${K.positive_tabindex}; role without tabindex ${K.role_without_tabindex}; <a> without href ${K.anchors_without_href}`);
  if (focus.length === 0) set("acessibilidade/foco", "N/A", 0, "no focusable element reached by Tab"); else set("acessibilidade/foco", focus.every((f) => f.changed) ? "PASS" : "FAIL", focus.filter((f) => f.changed).length + "/" + focus.length, focus.filter((f) => !f.changed).map((f) => `${f.tag} "${f.text}" outline=${f.outline}`).join("; ") || "all sampled elements show a focus change");
  const cc = ax.violations.find((v) => v.id === "color-contrast"); set("acessibilidade/contraste", cc ? "FAIL" : "PASS", cc ? cc.nodes : 0, cc ? cc.sample.map((s) => s.target + ": " + s.summary).join(" | ") : `axe color-contrast: 0 violations (${ax.incomplete.find((v) => v.id === "color-contrast")?.nodes || 0} needs-review)`);
  if (mobileR) { const T = mobileR.targets; set("acessibilidade/alvos", T.total === 0 ? "N/A" : T.pct >= 90 ? "PASS" : "FAIL", T.pct, `${T.ok}/${T.total} targets meet the rule at 390×844; worst: ${T.worst.map((w) => `${w.tag} "${w.txt}" ${w.w}×${w.h}`).join("; ")}`); }
  const aa = ax.violations.filter((v) => ["image-alt", "button-name", "link-name", "svg-img-alt", "input-image-alt", "aria-command-name"].includes(v.id)); set("acessibilidade/alt-aria", aa.length ? "FAIL" : "PASS", aa.reduce((a, v) => a + v.nodes, 0), aa.length ? aa.map((v) => `${v.id}×${v.nodes}: ${v.sample.map((s) => s.html).join(" | ")}`).join("; ") : "axe image-alt / button-name / link-name / svg-img-alt: 0 violations");
  const sem = ax.violations.filter((v) => /^landmark|^list|^listitem|heading-order|region|page-has-heading-one|bypass/.test(v.id)); const N = R.nav; set("acessibilidade/semantica", N.has_main && (N.has_nav || N.has_header) && H.heading_count > 0 && sem.length === 0 ? "PASS" : "FAIL", { main: N.has_main, nav: N.has_nav, header: N.has_header, headings: H.heading_count, axe: sem.map((v) => v.id + "×" + v.nodes) }, `main=${N.has_main} nav=${N.has_nav} header=${N.has_header} headings=${H.heading_count}; axe: ${sem.map((v) => v.id + "×" + v.nodes).join(", ") || "none"}`);
  set("acessibilidade/reduced-motion", !R.css.has_animation && M.declared === 0 ? "N/A" : R.css.reduced_motion_query ? "PASS" : "FAIL", R.css.reduced_motion_query, `prefers-reduced-motion query in loaded CSS: ${R.css.reduced_motion_query}; animations/transitions declared: ${M.declared}`);
  const vm = R.css.viewport_meta || ""; const blocked = /maximum-scale\s*=\s*(1(\.\d+)?|0\.)/.test(vm) || /user-scalable\s*=\s*(no|0)/.test(vm); set("acessibilidade/zoom", !blocked && zoom.overflow <= 2 ? "PASS" : "FAIL", { viewport_meta: vm, overflow_px_at_zoom2: zoom.overflow }, `viewport meta "${vm}"; horizontal overflow at CSS zoom 2: ${zoom.overflow}px`);
  if (surface !== "ENTRY") set("navegacao/onde-estou", N.nav_items === 0 ? "N/A" : N.current_marked + N.current_styled > 0 ? "PASS" : "FAIL", { marked: N.current_marked, styled: N.current_styled }, `nav items ${N.nav_items}; aria-current/active class ${N.current_marked}; styled difference for current route ${N.current_styled}`);
  if (N.depth >= 3) set("navegacao/breadcrumbs", N.breadcrumb || N.parent_link ? "PASS" : "FAIL", { breadcrumb: N.breadcrumb, parent_link: N.parent_link }, `path depth ${N.depth}; breadcrumb ${N.breadcrumb}; visible parent link ${N.parent_link}`);
  const lt = ax.violations.find((v) => v.id === "link-in-text-block"); set("navegacao/links", R.links.in_text === 0 ? "N/A" : !lt && R.links.distinguished_not_only_color === R.links.in_text ? "PASS" : "FAIL", { in_text: R.links.in_text, distinguished: R.links.distinguished_not_only_color, axe: lt ? lt.nodes : 0 }, `${R.links.distinguished_not_only_color}/${R.links.in_text} in-text links distinguished by more than colour; axe link-in-text-block ${lt ? lt.nodes : 0}`);
  set("carga/chunks", N.nav_items <= 9 && N.big_lists.length === 0 ? "PASS" : "FAIL", { nav_items: N.nav_items, big_lists: N.big_lists }, `primary nav ${N.nav_items} items; ungrouped link lists > 9: ${N.big_lists.join(", ") || "none"}`);
  const F = R.forms; const lab = ax.violations.find((v) => v.id === "label"); set("formularios/labels", F.inputs === 0 ? "N/A" : !lab && F.visibly_labelled === F.inputs ? "PASS" : "FAIL", { inputs: F.inputs, visibly_labelled: F.visibly_labelled, axe_label: lab ? lab.nodes : 0 }, `${F.visibly_labelled}/${F.inputs} inputs with a visible label; axe label violations ${lab ? lab.nodes : 0}`);
  set("formularios/tipos-campo", F.typed_candidates === 0 ? "N/A" : F.typed_ok === F.typed_candidates ? "PASS" : "FAIL", { candidates: F.typed_candidates, ok: F.typed_ok }, `${F.typed_ok}/${F.typed_candidates} email/tel/number-like fields carry a matching type, inputmode or autocomplete`);
  if (mobileR) { const MF = mobileR.forms; set("formularios/input-16px", MF.inputs === 0 ? "N/A" : MF.below_16px.length === 0 ? "PASS" : "FAIL", MF.below_16px, MF.below_16px.length ? `inputs below 16px at 390: ${MF.below_16px.map((x) => x.name + "=" + x.px + "px").join(", ")}` : `${MF.inputs} inputs all ≥ 16px at 390×844`); }
  return out;
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
for (const m of MS.milestones) {
  if (only.length && !only.includes(m.id)) continue;
  const srv = await serveMilestone(path.join(ROOT, ".research/builds", m.build), m);
  const result = { milestone: m.id, build: m.build, source_sha: m.source_sha, run_at: new Date().toISOString(), classification_sha256: null, surfaces: {}, site_level: {}, raw: {} };
  const navTexts = {};
  for (const [surface, route] of Object.entries(m.surfaces)) {
    if (!route || surface === "MOBILE_ENTRY") continue;
    try {
      const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
      const mp = await mctx.newPage(); await mp.goto(srv.url + route, { waitUntil: "load", timeout: 60000 }); await mp.waitForTimeout(1500);
      const mobileR = await mp.evaluate(DOM_JS, true); await mctx.close();
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
      const page = await ctx.newPage(); await page.goto(srv.url + route, { waitUntil: "load", timeout: 60000 }); await page.waitForTimeout(2000);
      const R = await page.evaluate(DOM_JS, false);
      const ax = await axeRun(page, ["color-contrast", "image-alt", "button-name", "link-name", "svg-img-alt", "input-image-alt", "aria-command-name", "label", "landmark-one-main", "landmark-no-duplicate-banner", "landmark-no-duplicate-contentinfo", "landmark-unique", "list", "listitem", "heading-order", "page-has-heading-one", "link-in-text-block", "bypass"]);
      const zoom = await page.evaluate(async () => { document.documentElement.style.zoom = "2"; await new Promise((r) => setTimeout(r, 400)); const o = document.documentElement.scrollWidth - document.documentElement.clientWidth; document.documentElement.style.zoom = ""; return { overflow: Math.max(0, Math.round(o)) }; });
      await page.reload({ waitUntil: "load" }); await page.waitForTimeout(1200);
      const focus = await focusCheck(page);
      result.surfaces[surface] = decide(R, ax, focus, zoom, surface, "desktop", mobileR);
      result.raw[surface] = { desktop: R, mobile: { targets: mobileR.targets, forms: mobileR.forms, nav: mobileR.nav }, axe: ax, focus, zoom };
      navTexts[surface] = R.nav.nav_text;
      await ctx.close();
    } catch (e) { result.surfaces[surface] = { _error: e.message.split("\n")[0] }; }
  }
  const texts = Object.values(navTexts).filter((t) => t != null);
  const surfacesN = Object.keys(result.surfaces).length;
  result.site_level["navegacao/menu-previsivel"] = surfacesN < 2 ? { state: "N/A", measured: surfacesN, expected: RULE["navegacao/menu-previsivel"], evidence: "single captured surface / single page" } : { state: new Set(texts).size === 1 ? "PASS" : "FAIL", measured: new Set(texts).size, expected: RULE["navegacao/menu-previsivel"], evidence: `distinct primary-nav texts across ${texts.length} surfaces: ${new Set(texts).size}` };
  if (!Object.values(result.surfaces).some((s) => s["navegacao/breadcrumbs"])) result.site_level["navegacao/breadcrumbs"] = { state: "N/A", measured: null, expected: RULE["navegacao/breadcrumbs"], evidence: "no captured surface deeper than two levels" };
  await srv.close();
  const dir = path.join(ROOT, "case-study/design-benchmark/results", m.id); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "deterministic.json"), JSON.stringify(result, null, 1));
  const tally = {}; for (const s of Object.values(result.surfaces)) for (const [k, v] of Object.entries(s)) if (v.state) tally[v.state] = (tally[v.state] || 0) + 1;
  console.log(m.id, JSON.stringify(tally));
}
await browser.close();
