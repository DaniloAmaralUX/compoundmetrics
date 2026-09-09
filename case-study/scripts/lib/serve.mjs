// Serves a built milestone locally. Static export dirs get a tiny file server that
// resolves /x → x.html → x/index.html (the same rule a static host applies); non-export
// Next builds are started with `next start`. Zero dependencies beyond node + the build.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".mp4": "video/mp4", ".ico": "image/x-icon", ".webm": "video/webm" };

export function freePort() {
  return new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
}

export function serveStatic(root, port) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const cands = [p, p + ".html", path.join(p, "index.html")];
    for (const c of cands) {
      const f = path.join(root, c);
      if (!f.startsWith(root)) continue;
      if (fs.existsSync(f) && fs.statSync(f).isFile()) {
        res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
        fs.createReadStream(f).pipe(res); return;
      }
    }
    const nf = path.join(root, "404.html");
    res.writeHead(404, { "content-type": "text/html" });
    if (fs.existsSync(nf)) fs.createReadStream(nf).pipe(res); else res.end("not found");
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) })));
}

export async function serveNext(dir, port) {
  const child = spawn("npx", ["next", "start", "-p", String(port), "-H", "127.0.0.1"], { cwd: dir, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"] });
  let log = ""; child.stdout.on("data", (d) => (log += d)); child.stderr.on("data", (d) => (log += d));
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try { const r = await fetch(url + "/", { redirect: "manual" }); if (r.status < 500) break; } catch {}
    if (child.exitCode !== null) throw new Error("next start exited: " + log);
  }
  return { url, close: () => new Promise((r) => { child.on("exit", r); child.kill("SIGTERM"); setTimeout(() => child.kill("SIGKILL"), 3000); }) };
}

export async function serveMilestone(buildDir, m) {
  const port = await freePort();
  if (m.serve === "static") return serveStatic(path.resolve(buildDir, m.root || "."), port);
  return serveNext(buildDir, port);
}
