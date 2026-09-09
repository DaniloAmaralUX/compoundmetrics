#!/usr/bin/env node
// screen-sync: mantém a seção "## Código (fonte da verdade)" de cada docs/screens/**/screen.md
// gerada a partir dos arquivos listados em `source_of_truth` no frontmatter.
//   node scripts/screen-sync.mjs          regenera
//   node scripts/screen-sync.mjs --check  falha (exit 1) se houver drift ou seção obrigatória ausente
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.join(REPO, "docs", "screens");
const START = "<!-- code:start -->";
const END = "<!-- code:end -->";
const REQUIRED = [
  "Identidade", "Fórmula de design", "Estrutura", "Copy (PT-BR)", "Estados", "Fluxos",
  "Movimento", "Acessibilidade", "Evidência", "Desvios conhecidos", "Código (fonte da verdade)",
];
const LANG = { ".tsx": "tsx", ".ts": "ts", ".css": "css", ".mjs": "js", ".js": "js", ".json": "json", ".md": "md" };

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : d.name === "screen.md" ? [p] : [];
  });
}

function frontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) return null;
  const out = {};
  let key = null;
  for (const raw of m[1].split("\n")) {
    const list = /^\s+-\s+(.*)$/.exec(raw);
    if (list && key) { (out[key] ||= []).push(list[1].trim()); continue; }
    const kv = /^([A-Za-z_]+):\s*(.*)$/.exec(raw);
    if (kv) { key = kv[1]; out[key] = kv[2].trim() === "" ? [] : kv[2].trim(); }
  }
  return out;
}

function render(files) {
  const parts = [];
  for (const rel of files) {
    const abs = path.join(REPO, rel);
    if (!fs.existsSync(abs)) { parts.push(`_\`${rel}\` ainda não existe — a fórmula acima aguarda o build._`); continue; }
    const lang = LANG[path.extname(rel)] ?? "";
    parts.push(`### \`${rel}\`\n\n\`\`\`${lang}\n${fs.readFileSync(abs, "utf8").replace(/\s+$/, "")}\n\`\`\``);
  }
  return parts.length ? parts.join("\n\n") : "_Nenhum arquivo em `source_of_truth`._";
}

const check = process.argv.includes("--check");
const problems = [];
let touched = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(REPO, file);
  const text = fs.readFileSync(file, "utf8");
  const fm = frontmatter(text);
  if (!fm) { problems.push(`${rel}: sem frontmatter`); continue; }
  for (const k of ["id", "title", "reference", "route", "verification", "date"]) if (!fm[k]) problems.push(`${rel}: frontmatter sem "${k}"`);
  if (fm.verification && !["observed", "inferred", "not-verified"].includes(fm.verification)) problems.push(`${rel}: verification "${fm.verification}" inválido`);
  for (const s of REQUIRED) if (!new RegExp(`^## ${s.replace(/[()]/g, "\\$&")}\\s*$`, "m").test(text)) problems.push(`${rel}: seção obrigatória "## ${s}" ausente`);
  const a = text.indexOf(START), b = text.indexOf(END);
  if (a < 0 || b < 0 || b < a) { problems.push(`${rel}: marcadores ${START} / ${END} ausentes ou invertidos`); continue; }
  const files = Array.isArray(fm.source_of_truth) ? fm.source_of_truth : [];
  const next = `${text.slice(0, a + START.length)}\n${render(files)}\n${text.slice(b)}`;
  if (next !== text) {
    if (check) problems.push(`${rel}: seção de código fora de sincronia com source_of_truth — rode npm run screens:sync`);
    else { fs.writeFileSync(file, next); touched++; }
  }
}
if (problems.length) { for (const p of problems) console.error(`  ! ${p}`); process.exit(1); }
console.log(check ? `screens ok: ${walk(ROOT).length} screen.md em sincronia` : `screens sync: ${touched} arquivo(s) atualizado(s), ${walk(ROOT).length} no total`);
