#!/usr/bin/env bash
# Render every output in order and log wall time + size (PRD §34).
cd "$(dirname "$0")/.."
LOG=out/render.log
: > "$LOG"
run() {
  local name=$1; shift
  local t0=$SECONDS
  echo "== $name start $(date -u +%H:%M:%S)" >> "$LOG"
  "$@" >> out/render-$name.txt 2>&1
  local rc=$?
  echo "== $name rc=$rc took $((SECONDS - t0))s" >> "$LOG"
}
run master npm run -s render:master -- --concurrency=2
run vertical npm run -s render:vertical -- --concurrency=2
run teaser npm run -s render:teaser -- --concurrency=2
run cover npm run -s still:cover
run contact npm run -s still:contact
run map npm run -s still:map
echo "== all done" >> "$LOG"
ls -la out/*.mp4 out/*.png >> "$LOG"
