// The Artifact host wraps the page in its own <html>/<head>/<body>; it wants
// the page content, not a document. This turns Vite's dist/index.html into
// dist/artifact.html: <title>, the font links, the built stylesheet and
// module script, and the root element — nothing else.
import fs from "node:fs"
const html = fs.readFileSync("dist/index.html", "utf8")
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? ""
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? ""
const keep = [...head.matchAll(/<(?:title|link|script)\b[^>]*?(?:\/>|>[\s\S]*?<\/(?:title|script)>|>)/g)]
  .map((m) => m[0])
  .filter((tag) => !/rel="icon"/.test(tag) && !/name="viewport"/.test(tag))
const out = `${keep.join("\n")}\n${body.trim()}\n`
fs.writeFileSync("dist/artifact.html", out)
console.log(`dist/artifact.html (${out.length} bytes)`)
