#!/usr/bin/env node
// Copies the case study's static assets into public/case-study/ so the /case-study route can serve
// them from the export. Deterministic, dependency-free; writes a file only when its bytes differ.
//
//   - entry screenshots of every design milestone named in case-study/history/DESIGN-MILESTONES.json
//     (case-study/archive/<V>/surfaces/ENTRY-{desktop,mobile}-first-screen.png → <V>-entry-{desktop,mobile}.png)
//   - the Atomic AI Design figure (case-study/theory/atomic-ai-design.svg), when it exists
//   - the film master, its captions track and cover still (case-study/video/out/), when rendered
//
// A missing source is reported, never fatal: the page renders what exists and says what does not.
//
//   node scripts/build-case-study-assets.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const OUT = path.join(ROOT, "public/case-study");
const MILESTONES = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));

fs.mkdirSync(OUT, { recursive: true });

let copied = 0;
let unchanged = 0;
const missing = [];

function copy(from, to) {
  const src = path.join(ROOT, from);
  const dst = path.join(OUT, to);
  if (!fs.existsSync(src)) {
    missing.push(from);
    return;
  }
  const bytes = fs.readFileSync(src);
  if (fs.existsSync(dst) && bytes.equals(fs.readFileSync(dst))) {
    unchanged += 1;
    return;
  }
  fs.writeFileSync(dst, bytes);
  copied += 1;
}

for (const m of MILESTONES.milestones) {
  copy(`case-study/archive/${m.id}/surfaces/ENTRY-desktop-first-screen.png`, `${m.id}-entry-desktop.png`);
  copy(`case-study/archive/${m.id}/surfaces/ENTRY-mobile-first-screen.png`, `${m.id}-entry-mobile.png`);
}
copy("case-study/theory/atomic-ai-design.svg", "atomic-ai-design.svg");
copy("case-study/video/out/compound-design-master.mp4", "compound-design-master.mp4");
copy("case-study/video/out/compound-design-master.vtt", "compound-design-master.vtt");
copy("case-study/video/out/compound-design-cover.png", "compound-design-cover.png");

console.log(`case-study assets → public/case-study (${copied} written, ${unchanged} unchanged${missing.length ? `, ${missing.length} source(s) absent` : ""})`);
for (const m of missing) console.log(`  absent: ${m}`);
