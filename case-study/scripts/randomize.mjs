// Blinded judgment material (PRD §14): copy surface screenshots into anonymised, randomly ordered
// folders DESIGN-A…; save the seed and the order. The mapping is written to a separate file that
// is not read until results/<V>/judgment.json is frozen (aggregate.mjs checks the hash order).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const ROOT = "/home/user/compoundmetrics";
const MS = JSON.parse(fs.readFileSync(path.join(ROOT, "case-study/history/DESIGN-MILESTONES.json"), "utf8"));
const seed = process.argv[2] || crypto.randomBytes(8).toString("hex");
// deterministic PRNG from seed (mulberry32 over sha256 of seed)
let s = parseInt(crypto.createHash("sha256").update(seed).digest("hex").slice(0, 8), 16);
const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ids = MS.milestones.filter((m) => fs.existsSync(path.join(ROOT, "case-study/archive", m.id, "metadata.json"))).map((m) => m.id);
const order = [...ids]; for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
const labels = order.map((_, i) => "DESIGN-" + String.fromCharCode(65 + i));
const blindDir = path.join(ROOT, "case-study/design-benchmark/screens/blind"); fs.rmSync(blindDir, { recursive: true, force: true });
const mapping = {};
order.forEach((id, i) => {
  const label = labels[i]; mapping[label] = id; const dst = path.join(blindDir, label); fs.mkdirSync(dst, { recursive: true });
  const src = path.join(ROOT, "case-study/archive", id);
  for (const f of fs.readdirSync(path.join(src, "surfaces"))) fs.copyFileSync(path.join(src, "surfaces", f), path.join(dst, f));
  for (const f of fs.readdirSync(path.join(src, "states"))) fs.copyFileSync(path.join(src, "states", f), path.join(dst, "state-" + f));
});
const pub = { seed, generated_at: new Date().toISOString(), labels, count: labels.length, note: "Order and labels are public. The label→milestone mapping lives in RANDOMIZATION.mapping.json and is revealed only after judgment.json files are frozen (their SHA-256 is recorded in RANDOMIZATION.json by aggregate.mjs before reveal).", judgment_frozen: null, mapping_revealed: false };
fs.writeFileSync(path.join(ROOT, "case-study/design-benchmark/RANDOMIZATION.json"), JSON.stringify(pub, null, 1));
fs.writeFileSync(path.join(ROOT, "case-study/design-benchmark/RANDOMIZATION.mapping.json"), JSON.stringify({ seed, mapping }, null, 1));
console.log("seed", seed, "labels", labels.join(" "));
