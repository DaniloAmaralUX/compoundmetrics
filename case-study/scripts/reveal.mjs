// Freeze the blinded judgments, THEN reveal the label→milestone mapping (PRD §14 steps 7–8).
// Input: case-study/design-benchmark/results/blind/<LABEL>.json (written from the judges' output)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const ROOT = "/home/user/compoundmetrics";
const BD = path.join(ROOT, "case-study/design-benchmark");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const pub = JSON.parse(fs.readFileSync(path.join(BD, "RANDOMIZATION.json"), "utf8"));
const blindDir = path.join(BD, "results/blind");
const frozen = {};
for (const label of pub.labels) { const p = path.join(blindDir, label + ".json"); if (!fs.existsSync(p)) throw new Error("missing " + p); frozen[label] = sha(p); }
pub.judgment_frozen = { at: new Date().toISOString(), sha256: frozen };
// only now read the mapping
const map = JSON.parse(fs.readFileSync(path.join(BD, "RANDOMIZATION.mapping.json"), "utf8")).mapping;
pub.mapping = map; pub.mapping_revealed = true; pub.revealed_at = new Date().toISOString();
for (const [label, v] of Object.entries(map)) { const j = JSON.parse(fs.readFileSync(path.join(blindDir, label + ".json"), "utf8")); j.milestone = v; j.blind_label = label; j.frozen_sha256 = frozen[label]; fs.mkdirSync(path.join(BD, "results", v), { recursive: true }); fs.writeFileSync(path.join(BD, "results", v, "judgment.json"), JSON.stringify(j, null, 1)); }
fs.writeFileSync(path.join(BD, "RANDOMIZATION.json"), JSON.stringify(pub, null, 1));
console.log("frozen + revealed:", Object.entries(map).map(([l, v]) => `${l}=${v}`).join(" "));
