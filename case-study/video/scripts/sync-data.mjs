#!/usr/bin/env node
// Sync the film's data and assets from the case-study benchmark output.
// The film never types a number: every JSON under src/data/json/ is a copy of,
// or a pure derivation from, the files listed here. Re-run after every benchmark run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const video = path.resolve(here, "..");
const repo = path.resolve(video, "..", "..");
const cs = path.join(repo, "case-study");
const jsonDir = path.join(video, "src", "data", "json");
const publicDir = path.join(video, "public");
fs.mkdirSync(jsonDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (name, data) => {
  fs.writeFileSync(path.join(jsonDir, name), JSON.stringify(data, null, 1) + "\n");
  console.log(`wrote src/data/json/${name}`);
};

// 1. Straight copies (PRD §32, STORYBOARD §8)
const copies = [
  ["tools.json", path.join(cs, "history", "TOOLS-MANIFEST.json")],
  ["milestones.json", path.join(cs, "history", "DESIGN-MILESTONES.json")],
  ["design-scores.json", path.join(cs, "design-benchmark", "SUMMARY.json")],
  ["transfer-graph.json", path.join(cs, "knowledge", "TRANSFER-GRAPH.json")],
  ["learning-yield.json", path.join(cs, "design-benchmark", "reports", "learning-yield.json")],
];
for (const [name, src] of copies) {
  if (!fs.existsSync(src)) throw new Error(`missing source ${src}`);
  writeJson(name, readJson(src));
}

// 2. Sections (camera targets) for every milestone, keyed by id
const milestones = readJson(path.join(cs, "history", "DESIGN-MILESTONES.json"));
const sections = {};
for (const m of milestones.milestones) {
  sections[m.id] = readJson(path.join(cs, "archive", m.id, "sections.json"));
}
writeJson("sections.json", sections);

// 3. Storyboard derived from SHOT-MANIFEST.json (+ the STORYBOARD.md §2/§6 tables,
//    which are not in the manifest: shot kind, constellation layout and edge schedule)
const manifest = readJson(path.join(cs, "video", "SHOT-MANIFEST.json"));
const FPS = 30;

// STORYBOARD.md §2–§4: what each shot renders. Keys are shot ids.
const KIND = {
  "MS-01": "hook-statement", "MS-02": "hook-nodes", "MS-03": "hook-system",
  "MS-04": "cuts", "MS-05": "cuts", "MS-06": "cuts", "MS-07": "grid",
  "MS-08": "finding", "MS-09": "resource", "MS-10": "loop",
  "MS-11": "component-pushes", "MS-12": "atomic-layer", "MS-13": "created",
  "MS-14": "transfer", "MS-15": "identical", "MS-16": "fan",
  "MS-17": "instrument", "MS-18": "scores", "MS-19": "deltas", "MS-20": "trend",
  "MS-21": "yield-counters", "MS-22": "yield-ladder", "MS-23": "chain",
  "MS-24": "converge", "MS-25": "skills", "MS-26": "rail-morph",
  "MS-27": "mosaic", "MS-28": "statement", "MS-29": "evidence",
  "VT-01": "hook-statement", "VT-02": "hook-system", "VT-03": "cuts", "VT-04": "cuts",
  "VT-05": "finding", "VT-06": "loop", "VT-07": "component-pushes", "VT-08": "atomic-layer",
  "VT-09": "transfer", "VT-10": "fan", "VT-11": "instrument", "VT-12": "scores", "VT-13": "deltas",
  "VT-14": "yield-counters", "VT-15": "yield-ladder", "VT-16": "converge", "VT-17": "rail-morph",
  "VT-18": "mosaic", "VT-19": "evidence",
  "TZ-01": "hook-statement", "TZ-02": "cuts", "TZ-03": "cuts", "TZ-04": "scores",
  "TZ-05": "converge", "TZ-06": "statement",
};

// STORYBOARD.md §6 — constellation placement per shot and the edges that become
// visible at that shot (cumulative). Selectors: an edge id, a prefix ("E80-*"),
// a type ("type:created") or "*all-verified". Only verified edges ever resolve.
const CONSTELLATION = {
  "MS-01": { place: "hidden", edges: [] },
  "MS-02": { place: "field", edges: [] },
  "MS-03": { place: "field", edges: [], ghost: true },
  "MS-04": { place: "parked", edges: [] },
  "MS-05": { place: "parked", edges: [] },
  "MS-06": { place: "parked", edges: [] },
  "MS-07": { place: "parked", edges: [] },
  "MS-08": { place: "docked", edges: ["E49", "E50"] },
  "MS-09": { place: "docked", edges: ["E51", "E52"] },
  "MS-10": { place: "docked", edges: ["E53", "E54"] },
  "MS-11": { place: "docked", edges: [] },
  "MS-12": { place: "docked", edges: [] },
  "MS-13": { place: "grow", edges: ["type:created"] },
  "MS-14": { place: "parked", edges: ["E23", "E31", "E32", "E33", "E34", "E35", "E36", "E37"] },
  "MS-15": { place: "parked", edges: ["E19", "E17", "E20", "E38", "E39", "E40", "E78"] },
  "MS-16": { place: "parked", edges: ["E56", "E57", "E58", "E59", "E60", "E61", "type:informed", "E11", "E12", "E21", "E22", "E84", "E85"] },
  "MS-17": { place: "parked", edges: ["E02", "E07", "E04", "E08"] },
  "MS-18": { place: "parked", edges: [] },
  "MS-19": { place: "parked", edges: ["E79", "E80-*"] },
  "MS-20": { place: "parked", edges: [] },
  "MS-21": { place: "docked", edges: ["E41", "E42", "E44", "E45", "E50"], pulse: "type:failure" },
  "MS-22": { place: "docked", edges: [] },
  "MS-23": { place: "docked", edges: ["E43", "type:promoted", "type:superseded"] },
  "MS-24": { place: "behind", edges: ["*all-verified"], converge: true, centroidLabel: true },
  "MS-25": { place: "behind", edges: ["*all-verified"], converge: true },
  "MS-26": { place: "behind", edges: ["*all-verified"], converge: true },
  "MS-27": { place: "dim", edges: ["*all-verified"], converge: true },
  "MS-28": { place: "full", edges: ["*all-verified"], converge: true },
  "MS-29": { place: "full", edges: ["*all-verified"], converge: true },
  "VT-01": { place: "hidden", edges: [] },
  "VT-02": { place: "lower", edges: [], ghost: true },
  "VT-03": { place: "lower", edges: [] },
  "VT-04": { place: "lower", edges: [] },
  "VT-05": { place: "lower", edges: ["E49", "E50"] },
  "VT-06": { place: "lower", edges: ["E51", "E52", "E53", "E54"] },
  "VT-07": { place: "lower", edges: [] },
  "VT-08": { place: "lower", edges: ["type:created"] },
  "VT-09": { place: "lower", edges: ["E23", "E31", "E32", "E33", "E34", "E35", "E36", "E37", "E19", "E17", "E20"] },
  "VT-10": { place: "lower", edges: ["E56", "E57", "E58", "E59", "E60", "E61", "type:informed", "E11", "E12", "E21", "E22", "E84", "E85"] },
  "VT-11": { place: "lower", edges: ["E02", "E07", "E04", "E08"] },
  "VT-12": { place: "lower", edges: [] },
  "VT-13": { place: "lower", edges: ["E79", "E80-*"] },
  "VT-14": { place: "lower", edges: ["E41", "E42", "E44", "E45"], pulse: "type:failure" },
  "VT-15": { place: "lower", edges: ["E43", "type:promoted", "type:superseded"] },
  "VT-16": { place: "behind", edges: ["*all-verified"], converge: true, centroidLabel: true },
  "VT-17": { place: "behind", edges: ["*all-verified"], converge: true },
  "VT-18": { place: "dim", edges: ["*all-verified"], converge: true },
  "VT-19": { place: "full", edges: ["*all-verified"], converge: true },
  "TZ-01": { place: "hidden", edges: [] },
  "TZ-02": { place: "parked", edges: [] },
  "TZ-03": { place: "parked", edges: [] },
  "TZ-04": { place: "parked", edges: ["E02", "E07", "E04", "E08"] },
  "TZ-05": { place: "behind", edges: ["*all-verified"], converge: true, centroidLabel: true },
  "TZ-06": { place: "full", edges: ["*all-verified"], converge: true },
};

const shots = manifest.map((s) => {
  if (!KIND[s.id]) throw new Error(`no kind for ${s.id}`);
  if (!CONSTELLATION[s.id]) throw new Error(`no constellation entry for ${s.id}`);
  return {
    id: s.id,
    composition: s.composition,
    scene: s.scene,
    kind: KIND[s.id],
    start: Math.round(s.start_s * FPS),
    end: Math.round(s.end_s * FPS),
    sources: s.sources.map((x) => ({
      milestone: x.milestone,
      src: x.file.replace(/^case-study\//, ""),
      section_key: x.section_key,
    })),
    text_keys: s.text_keys,
    data_keys: s.data_keys,
    memory_rail: s.memory_rail,
    constellation_edges: s.constellation_edges,
    constellation: CONSTELLATION[s.id],
  };
});

// Validate: files exist, section keys resolve, timeline is contiguous per composition
const referenced = new Set();
for (const s of manifest) {
  for (const x of s.sources) {
    const abs = path.join(repo, x.file);
    if (!fs.existsSync(abs)) throw new Error(`${s.id}: missing ${x.file}`);
    referenced.add(x.file);
    const [surface, key] = x.section_key.split("/", 2);
    const sec = sections[x.milestone]?.[surface];
    const rest = x.section_key.slice(surface.length + 1);
    if (!sec || !sec[rest]) throw new Error(`${s.id}: ${x.milestone} ${x.section_key} does not resolve`);
    if (!sec[rest].width) throw new Error(`${s.id}: ${x.section_key} has no width`);
    void key;
  }
}
const compositions = {};
for (const comp of ["master", "vertical", "teaser"]) {
  const list = shots.filter((s) => s.composition === comp);
  for (let i = 1; i < list.length; i++) {
    if (list[i].start !== list[i - 1].end) throw new Error(`${comp}: gap between ${list[i - 1].id} and ${list[i].id}`);
  }
  compositions[comp] = { fps: FPS, durationInFrames: list[list.length - 1].end };
}

writeJson("storyboard.json", { generated_at: new Date().toISOString(), fps: FPS, compositions, shots });

// 4. Assets → public/ (only what the manifest references, plus the theory diagram)
let bytes = 0;
for (const rel of referenced) {
  const dest = path.join(publicDir, rel.replace(/^case-study\//, ""));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(repo, rel), dest);
  bytes += fs.statSync(dest).size;
}
for (const svg of ["atomic-ai-design.svg", "atomic-ai-design-vertical.svg"]) {
  const dest = path.join(publicDir, "theory", svg);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(cs, "theory", svg), dest);
  bytes += fs.statSync(dest).size;
}
console.log(`copied ${referenced.size} screenshots + 2 svg → public/ (${(bytes / 1e6).toFixed(1)} MB)`);
