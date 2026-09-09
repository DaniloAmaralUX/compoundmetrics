# Architecture

## Four systems in one repository

| System | Where | What it is |
| --- | --- | --- |
| Work system | `skills/`, `agents/` | The loop and the specialists that run it |
| Durable learning system | `docs/solutions/`, `cd-compound`, `cd-compound-refresh`, the discoverability contract | What survives a project, and how it stays findable and true |
| Plugin system | `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.compound-design/` | How the work system reaches a host |
| Evidence system | `compound-design/` | What may be claimed about any of the above |

They are separate on purpose. The work system can change without touching the evidence system; the evidence system can refuse a claim the work system wants to make.

## Canonical implementation

`skills/<id>/SKILL.md` is the only implementation of a skill. `agents/<id>.md` is the only implementation of an agent. Every supported host reads those directories through its own manifest, so there is no generated mirror, no sync step and no way for two copies to drift.

An agent is a thin dispatch definition: specialism, trigger, non-trigger, tool policy, the skill it runs, what it returns, and its boundaries. It never contains the procedure. `npm run cd:evals` fails an agent that grows one.

## Artifacts

Two trees that are easy to confuse and must not be merged:

- **`docs/`** — project work memory, produced *by using* Compound Design: `frames/`, `plans/`, `solutions/`, `handoffs/`. Relocatable with `docs_root`.
- **`compound-design/`** — the framework's own infrastructure: `quality/`, `registry/`, `learning/`, `research/`, `releases/`, `tools/`. Not relocatable, because it is the thing being evidenced rather than a product of it.

## Learning ledger and solutions

They answer different questions.

| | `docs/solutions/` | `compound-design/learning/LEDGER.md` |
| --- | --- | --- |
| Question | How did we solve a durable project problem? | What failure or observation happened to a Compound Design resource, and what did the human correct? |
| Written by | `cd-compound` | `cd-compound` when the learning is about a resource, and `cd-resource-lab` |
| Consumed by | `cd-frame`, `cd-model` via discovery | `cd-resource-lab`, `cd-quality-gate` |
| Becomes | a constraint in future work | a candidate eval, rule or resource change |

```
WORK → OBSERVATION → SOLUTION → LEDGER → RULE / PATTERN / SKILL / AGENT / EVAL → FUTURE WORK
```

Not every solution becomes a rule. Not every failure becomes a skill. Not every learning deserves promotion. Each arrow is a gate, and `cd-quality-gate` owns the last one.

## Finding contract

`cd-verify`, `cd-interface-review`, `cd-motion-review` and `cd-ai-interaction-review` emit one shape, defined in `compound-design/FINDING-CONTRACT.md`: fields, a three-level severity ladder, an observed / inferred / not-verified distinction, and gates that drop findings without evidence and impact. One shape means the four can be merged, filtered and acted on together.

## Configuration

Two layers and a generated example, resolved local → repository → default. `docs_root` is read only from the committed file and fails closed. Path validation rejects absolute paths, upward traversal, symlinks escaping the repository, the repository root itself and anything under `.git/`. The resolver is `compound-design/tools/cd.mjs config`, and its rules are unit-tested rather than described.

## Evidence

`CDQI` is construction, `CEL` is evidence, and the two never borrow from each other. A resource enters the registry at `E0` and reaches `E1` by passing the deterministic contract suite. `E2` requires controlled runtime comparison, which has not been run. The registry is validated against its JSON Schema, and a contextual claim guard scans active surfaces for inflated claims — the guard matches claims like "proven uplift" or "runtime verified", not the isolated words "E2", "validated" or "proven", so the evidence documents can still describe what those terms mean.

## Zero-cost by construction

No check in this repository calls a model. CI runs the registry, the contract suite, the plugin validation, the claim guard, the self-tests, typecheck, lint, build, and the benchmark harness's deterministic gates. The benchmark's runtime command aborts unless `E2_PAID_RUNTIME_CONFIRMED=YES`, and CI is tested for the absence of that flag, of model providers and of the host CLI.
