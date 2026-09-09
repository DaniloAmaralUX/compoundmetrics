#!/usr/bin/env node
// Write out/compound-design-master.vtt from the NARRATION.md master table (mandatory lines only;
// the *[optional]* author lines are not on-screen text). {tools.stated_count_in_brief} is
// substituted from src/data/json/tools.json, so the caption reads the same numeral as the film.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const video = path.resolve(here, "..");
const narration = fs.readFileSync(path.join(video, "NARRATION.md"), "utf8");
const tools = JSON.parse(fs.readFileSync(path.join(video, "src/data/json/tools.json"), "utf8"));
const storyboard = JSON.parse(fs.readFileSync(path.join(video, "src/data/json/storyboard.json"), "utf8"));
const fps = storyboard.fps;
const total = storyboard.compositions.master.durationInFrames / fps;

const section = narration.split("## Master")[1].split("## Vertical")[0];
const cues = [];
for (const line of section.split("\n")) {
  const m = line.match(/^\|\s*(\d\d):(\d\d\.\d)\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*([^|]*?)\s*\|/);
  if (!m) continue;
  const [, mm, ss, , text] = m;
  if (text.includes("[optional]")) continue;
  const t = Number(mm) * 60 + Number(ss);
  const clean = text
    .replace(/\*\{tools\.stated_count_in_brief\}\*/g, String(tools.stated_count_in_brief))
    .replace(/\{tools\.stated_count_in_brief\}/g, String(tools.stated_count_in_brief))
    .replace(/\*/g, "");
  cues.push({ t, text: clean });
}
const fmt = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${sec.toFixed(3).padStart(6, "0")}`;
};
let out = "WEBVTT\nKind: captions\nLanguage: en\nNOTE Compound Design case-study film · on-screen text only · no voice, no music\n\n";
cues.forEach((c, i) => {
  const next = cues[i + 1]?.t ?? total;
  const end = Math.min(next - 0.05, c.t + 3.5, total - 0.8);
  out += `${i + 1}\n${fmt(c.t)} --> ${fmt(Math.max(end, c.t + 0.5))}\n${c.text}\n\n`;
});
fs.mkdirSync(path.join(video, "out"), { recursive: true });
fs.writeFileSync(path.join(video, "out", "compound-design-master.vtt"), out);
console.log(`wrote out/compound-design-master.vtt (${cues.length} cues)`);
