---
id: CD-SOL-20260220-03
title: Build cache misses on CI when the lockfile is regenerated in the same job
date: 2026-02-20
areas: [build, ci]
concepts: [cache, lockfile]
applies_to: Any pipeline that installs dependencies and then regenerates the lockfile before the cached step.
signals: ["turbo", "cache miss", "lockfile changed"]
supersedes: null
status: active
---

FIXTURE — not a real learning.

Expected: the cached build step is reused between runs. Observed: every run rebuilt from scratch, because regenerating the lockfile inside the job changed the cache key after it was computed.

Next time: compute the cache key from a lockfile the job does not write.
