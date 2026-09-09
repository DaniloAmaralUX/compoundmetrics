#!/usr/bin/env bash
# Builds each design milestone at its exact commit into .research/builds/<id> (gitignored).
# Every capture in the archive is tied to a commit, never to a live URL (the sandbox cannot reach *.vercel.app).
set -u
ROOT=/home/user/compoundmetrics
H=$ROOT/.research/history
B=$ROOT/.research/builds
LOG=$B/build.log
mkdir -p "$B"; : > "$LOG"
say(){ echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$LOG"; }

build_next(){ # id repo sha
  local id=$1 repo=$2 sha=$3 dir=$B/$1
  say "== $id  $repo @ $sha"
  if [ -d "$dir" ]; then say "$id exists, skipping checkout"; else
    git -C "$H/$repo" worktree add --detach "$dir" "$sha" >>"$LOG" 2>&1 || { say "$id WORKTREE FAILED"; return 1; }
  fi
  cd "$dir" || return 1
  if [ -f package-lock.json ]; then (npm ci --ignore-scripts --no-audit --no-fund >>"$LOG" 2>&1 || npm install --ignore-scripts --no-audit --no-fund >>"$LOG" 2>&1) || { say "$id INSTALL FAILED"; return 1; }
  else npm install --ignore-scripts --no-audit --no-fund >>"$LOG" 2>&1 || { say "$id INSTALL FAILED"; return 1; }; fi
  NEXT_TELEMETRY_DISABLED=1 npx next build >>"$LOG" 2>&1 && say "$id BUILD OK" || say "$id BUILD FAILED"
}

# M01: static site, no build — export the tree at the deployed commit
say "== M01 compound-labs-design @ 364430b (static)"
mkdir -p "$B/M01" && git -C /home/user/compound-labs-design archive 364430b9d553c6b9f87e4ff3cbc0f31eaa5d1a33 | tar -x -C "$B/M01" && say "M01 EXPORT OK"

build_next M10 compoundmetrics-local 18ffcf22c99a9797e739827e00adac5a6a102e99
build_next M12 compoundmetrics-local a7f8319859263924a90d2f293be5cfd3c1c9cbab
build_next M13 compoundmetrics-local 921d751aff5df8e14d998f993e2d171db842719d
build_next M07 studio-ds 54fcaf0e4cb86a989e2eeb2b1452eb9b7b5d3038
build_next M09 processo 28e53d1ab20b46b2ace378c0c67234e8a34bc151
build_next M06 supernova-catalogo 7af65530482bc304c54e14b6b84b03c75c97807b
build_next M03 studio-dev-ui 781d086
build_next M04 studio-dev-ui d0e89313d04246196db5352d240070a091e0b549
build_next M11 studio-dev-ui 231889f0098213a96ccc069ba5557a18cc9f0cfb
build_next M08 geistlabsds da0840cde632a6e2fc99a23371097d828211eba2
say "ALL DONE"
