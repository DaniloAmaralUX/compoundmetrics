import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const suitePath = path.join(root, "compound-design/quality/evals/v0.2-contract-suite.json");
const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"));
const assertions = [];

function checkFile(entry, group) {
  const full = path.join(root, entry.path);
  const exists = fs.existsSync(full);
  assertions.push({group, path: entry.path, check: "file_exists", pass: exists});
  if (!exists) return;
  const text = fs.readFileSync(full, "utf8");
  for (const needle of entry.must ?? []) {
    assertions.push({group, path: entry.path, check: `contains:${needle}`, pass: text.includes(needle)});
  }
  for (const forbidden of suite.forbidden_anywhere ?? []) {
    assertions.push({group, path: entry.path, check: `forbids:${forbidden}`, pass: !text.includes(forbidden)});
  }
}

for (const entry of suite.resources) checkFile(entry, "resource");
for (const entry of suite.global) checkFile(entry, "global");

const passed = assertions.filter(a => a.pass).length;
const failed = assertions.length - passed;
const result = {
  suite: suite.version,
  evidence_level: failed === 0 ? "E1" : "E0",
  passed,
  failed,
  assertions
};

const out = path.join(root, "compound-design/quality/releases/v0.2-contract-eval.json");
fs.writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({suite: result.suite, evidence_level: result.evidence_level, passed, failed}));
if (failed) process.exit(1);
