#!/usr/bin/env bash
# Render one still per shot (mid-point) of a composition for visual review.
set -e
COMP=${1:-master}
ID=${2:-CompoundEvolution}
cd "$(dirname "$0")/.."
node -e '
const sb=require("./src/data/json/storyboard.json");
for(const s of sb.shots.filter(s=>s.composition===process.argv[1])) console.log(s.id, Math.floor((s.start+s.end)/2));
' "$COMP" | while read id f; do
  npx remotion still src/index.ts "$ID" "out/review/$COMP-$id-$f.png" --frame="$f" --scale=0.5 --log=error 2>&1 | grep -v "Memory\|docker\|inadvertently\|lower amount" || true
done
ls out/review | grep "^$COMP" | wc -l
