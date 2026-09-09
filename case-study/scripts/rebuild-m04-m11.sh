#!/usr/bin/env bash
# Second attempt for M04 / M11 (studio-dev-ui): the first build failed only in the
# post-compile TypeScript pass, on files under video/ (a Remotion side-package whose
# dependencies are not part of the app install) and one <video loading> prop type.
# Build-time adjustment (recorded in metadata.json, does not touch any UI source):
#   next.config.ts += typescript: { ignoreBuildErrors: true }
set -u
B=/home/user/compoundmetrics/.research/builds; LOG=$B/build.log
say(){ echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$LOG"; }
# wait for the first builder to finish
while pgrep -f build-milestones.sh >/dev/null; do sleep 5; done
for id in M04 M11; do
  cd "$B/$id" || continue
  say "== $id rebuild (typescript.ignoreBuildErrors)"
  grep -q ignoreBuildErrors next.config.ts || sed -i 's|^  output: "export",|  output: "export",\n  typescript: { ignoreBuildErrors: true },|' next.config.ts
  NEXT_TELEMETRY_DISABLED=1 npx next build >>"$LOG" 2>&1 && say "$id BUILD OK (adjusted)" || say "$id BUILD FAILED (adjusted)"
done
say "REBUILD DONE"
