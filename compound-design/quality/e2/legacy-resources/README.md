# Legacy resources — frozen evidence

`LEGACY EVIDENCE. DO NOT EDIT.`

These are pinned snapshots of the Compound Design resources as they existed at release **v0.2.1**, kept because the pre-registered E2 pilot was registered against them. A benchmark must keep testing the version it was registered against, so the harness reads the resources under test from here rather than from the live plugin.

Legacy internal identifiers (`jakub`, `emi`, `cd`, `resource-lab`) appear inside these files. That is deliberate and permitted: this directory is frozen experimental evidence and git history, not an active surface. The active runtime of v0.3.0-alpha.1 contains none of those identifiers — see `compound-design/releases/MIGRATION-v0.2-to-v0.3.md`.

## Contents

| Path | What it is | Under E2 test |
| --- | --- | --- |
| `v0.2/RESOURCE-MANIFEST.json` | SHA-256 of every pinned input + byte-equivalence proof against the baseline commit | — |
| `v0.2/agents/jakub.md` | Interface Review resource, v0.2.0 | yes — condition C of the interface-review suite |
| `v0.2/skills/cd-quality-gate/SKILL.md` | Quality Gate resource, v0.2.0 | yes — condition C of the quality-gate suite |
| `v0.2/quality/CD-QUALITY-INDEX.md` | transitive input: the Quality Gate resource instructs the model to read it | yes |
| `v0.2/quality/CD-EVIDENCE-LEVELS.md` | transitive input: the Quality Gate resource instructs the model to read it | yes |
| `v0.2/agents/emi.md` | Motion Review resource, v0.2.0 | no |
| `v0.2/agents/cd.md` | Orchestrator resource, v0.2.0 | no |
| `v0.2/agents/resource-lab.md` | Resource Lab agent, v0.2.0 | no |

## Equivalence, and what proves it

A task-set digest proves the **tasks** did not change. It proves nothing about the **resource**. Resource equivalence is proved by `RESOURCE-MANIFEST.json`, which records, for every pinned input including the transitive documents the resource reads at runtime: its SHA-256, the path it had at the baseline commit `5fc74f1`, and the SHA-256 of that baseline blob.

The migration was performed as **copy → byte-equivalence verification → switch**. `e2 verify-legacy` re-derives every baseline blob from git rather than trusting the manifest, and `e2 self-test` runs it plus a mutation that edits a snapshot and must be rejected. `e2 freeze` refuses to write `environment.json` if any input drifts.

Task sets, fixtures, ground truth, rubrics, holdouts and decision rules were not touched by the move: their digests in `tasks/tasks.json` are unchanged (`jakub 864a379d4a1c`, `qg cb752312fb06`).

## Rules

- Never edit these files. A change to a resource belongs in `skills/` or `agents/` at the repository root.
- Never point an active plugin surface at this directory.
- The v0.2 contract suite (`compound-design/quality/evals/v0.2-contract-suite.json`) and its result artifact (`compound-design/quality/releases/v0.2-contract-eval.json`) record the paths these files had at the time they ran. Both stay byte-identical and are not re-executed; the active resources are re-verified by the v0.3 contract suite instead.
