# Migration — v0.2.1 → v0.3.0-alpha.1

Personal names are gone from the executable architecture. Provenance is not.

## Supersession

| v0.2 runtime id | v0.3 replacement | Public name | Change |
| --- | --- | --- | --- |
| `jakub` (agent) | `cd-interface-review` (skill) + `interface-reviewer` (agent) | Interface Review | rewritten from scratch as a Compound Design resource; no runtime dependency on any upstream checkout |
| `emi` (agent) | `cd-motion-review` (skill) + `motion-reviewer` (agent) | Motion Review | rewritten from scratch; same |
| `cd` (orchestrator) | `compound-design` (agent) | Design Guide | rewritten as a thin router over the six loop skills |
| `resource-lab` (agent, never registered) | `learning-curator` (agent) | Learning Curator | the v0.2 agent file existed outside the registry; the replacement is registered |

A rewritten resource does not inherit evidence. Each replacement entered the registry at `E0` and reached `E1` only by passing the v0.3 deterministic contract suite.

## Where legacy identifiers may still appear

Permitted, because these are history rather than an active surface:

- `compound-design/quality/e2/legacy-resources/` — pinned v0.2 resources under pre-registered benchmark test, with `RESOURCE-MANIFEST.json` proving byte-equivalence to commit `5fc74f1`.
- `compound-design/quality/evals/v0.2-contract-suite.json` and `compound-design/quality/releases/v0.2-contract-eval.json` — frozen evidence recording the paths those resources had when the suite ran. Neither is re-executed.
- `compound-design/registry/resource-registry.json` — as `status: superseded` entries that keep their historical evidence level and name their successor.
- `NOTICE`, `compound-design/SOURCES.md`, `compound-design/research/` — provenance and licence obligations.
- This document, the learning ledger, and git history.

Forbidden everywhere else, and enforced by `npm run cd:plugin`: skills, agents, host manifests, configuration, the site, the README, install documentation, active registry entries, and command names.

## What moved

| From | To | Why |
| --- | --- | --- |
| `.claude/skills/cd-quality-gate`, `cd-resource-lab`, `cd-ai-interaction-review` | `skills/` | canonical plugin location read by every host |
| `.claude/agents/*.md` | `compound-design/quality/e2/legacy-resources/v0.2/agents/` | superseded resources, retained as frozen benchmark inputs |
| `compound-design/quality/CD-QUALITY-INDEX.md`, `CD-EVIDENCE-LEVELS.md` (as benchmark inputs) | pinned copies under `legacy-resources/v0.2/quality/` | they are transitive runtime inputs of a resource under test; the live documents may now evolve without silently changing the benchmark |
| `compound-design/quality/scripts/run-contract-evals.mjs` | `run-contract-evals-v0.2.mjs` | retired as frozen evidence; the active suite is `cd.mjs contracts` |

`.claude/` now holds only `launch.json`. There is no mirrored copy of any skill or agent: `skills/` and `agents/` are the single canonical implementation, which is what removes the divergent-copy problem rather than automating it.

## Migration procedure used

**Copy → byte-equivalence verification → switch**, not move-and-hope. `RESOURCE-MANIFEST.json` records, for every pinned input, its SHA-256, the path it had at the baseline commit and the SHA-256 of that baseline blob. `npm run e2 -- verify-legacy` re-derives every baseline blob from git rather than trusting the manifest, and `npm run e2 -- self-test` runs it alongside a mutation that edits a snapshot and must be rejected.

A task-set digest proves the tasks did not change. It proves nothing about the resource. Both were checked separately: task digests are unchanged (`jakub 864a379d4a1c`, `qg cb752312fb06`) and all seven pinned inputs are byte-equivalent to `5fc74f1`.

## For anyone using v0.2

Invoke the public names, which did not change: Interface Review, Motion Review, AI Interaction Review, Quality Gate, Resource Lab. The internal identifiers behind the first two are new, and the resources behind them were rewritten — treat their output as a new resource's output, not as a continuation.
