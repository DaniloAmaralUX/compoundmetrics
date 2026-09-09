#!/usr/bin/env node
// Rule (STORYBOARD §0.1, PRD §32): no numeral that describes the data is typed into a scene or
// component. Frame timings and sizes (props, style values, interpolate ranges) are allowed.
// This check looks only at what can reach the screen as text: string / template literals and
// JSX text nodes in src/scenes and src/components. Any 2+ digit numeral there that is not a
// CSS length (px/em/%/deg/s) or a colour is reported.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "src");
const files = ["scenes", "components"].flatMap((d) => fs.readdirSync(path.join(root, d)).map((f) => path.join(root, d, f)));
let bad = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    const texts = [];
    for (const m of line.matchAll(/`([^`]*)`|"([^"]*)"|'([^']*)'/g)) texts.push(m[1] ?? m[2] ?? m[3]);
    for (const m of line.matchAll(/>([^<>{}]*[0-9]{2,}[^<>{}]*)</g)) texts.push(m[1]);
    for (const t of texts) {
      const cleaned = t.replace(/\$\{[^}]*\}/g, "").replace(/rgba?\([^)]*\)/g, "").replace(/#[0-9a-f]{3,8}/gi, "");
      for (const n of cleaned.matchAll(/[0-9]{2,}(\.[0-9]+)?\s*(px|em|%|deg|s|f)?/g)) {
        if (n[2]) continue;
        console.log(`${path.relative(root, f)}:${i + 1}: "${t.trim()}"`);
        bad++;
      }
    }
  });
}
console.log(bad ? `FAIL: ${bad} numeral(s) typed into on-screen text` : "OK: no numeral typed into on-screen text in scenes/components");
process.exit(bad ? 1 : 0);
