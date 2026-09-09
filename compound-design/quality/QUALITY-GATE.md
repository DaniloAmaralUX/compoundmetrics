# Compound Design Quality Gate

This directory defines how Compound Design decides whether a skill, agent, plugin, MCP integration or reusable AI resource is good enough to keep and promote.

The rule is simple:

> Do not promote a resource because it looks intelligent. Promote it because evidence shows it improves the work.

## Evaluation stack

### Skills

Use two complementary layers:

1. **Anthropic skill-creator style evals** for explicit prompts, expected outputs and verifiable expectations.
2. **Promptfoo** for routing, A/B comparisons, repeated runs, cost/latency and trace assertions.

The canonical skill eval file for `cd-quality-gate` lives at:

`/.claude/skills/cd-quality-gate/evals/evals.json`

### Agents

Evaluate the whole agent, not only its final prose.

Measure:

- correct specialist selection;
- relevant files/resources inspected;
- quality of the final recommendation;
- false positives / unnecessary intervention;
- tool trajectory;
- repeatability;
- latency/cost/tool-call overhead;
- human preference for subjective craft work.

Initial agent targets:

- `jakub`
- `emi`
- `cd`

### Plugins and MCP

A valid manifest and functioning tools are smoke tests, not proof of usefulness.

Evaluate realistic end-to-end tasks that require the plugin/MCP to help an agent complete work. Inspect tool selection, arguments, ordering, failures and recovery.

For MCP implementations, use the official MCP Inspector for protocol-level inspection, then task-level evals for effectiveness.

## The seven checks

1. **Static validity** — structure, scope, instructions, manifest/frontmatter, permissions, provenance and licensing.
2. **Routing** — invokes when appropriate and stays quiet when irrelevant.
3. **Outcome uplift** — same task, same model, same files, same permissions; compare candidate vs baseline.
4. **Reliability** — repeat runs and record pass rate/variance.
5. **Efficiency** — tokens, latency, tool calls, errors and cost when available.
6. **Trajectory** — inspect the work path, not only the answer.
7. **Human craft review** — required where quality depends on UX, visual, writing, motion or interaction judgment.

## Baselines

Use the most honest baseline for the question:

- new skill → same task without the skill;
- improved skill → previous best version;
- specialist agent → same task with a general agent or no specialist;
- plugin/MCP → same workflow without the integration or with the previous implementation.

Do not change multiple variables at once if the goal is to attribute improvement to one resource.

## Evidence model

For each run capture as much as the harness exposes:

```json
{
  "resource": "jakub",
  "version": "v0.1",
  "task": "interface-review-001",
  "condition": "with_resource",
  "expectations_passed": 7,
  "expectations_total": 8,
  "pass_rate": 0.875,
  "total_tokens": null,
  "duration_ms": null,
  "tool_calls": null,
  "errors": 0,
  "human_score": null,
  "notes": []
}
```

Use `null` when a metric was not measured. Never fabricate missing telemetry.

## Promotion states

- `DRAFT` — designed, not meaningfully evaluated.
- `NEEDS_WORK` — known material failure.
- `CANDIDATE` — promising evidence, still incomplete.
- `CD_APPROVED` — sufficient evidence for the evaluated scope.
- `DEPRECATED` — superseded by a better proven version.

`CD_APPROVED` is scoped, not universal. An agent proven for web dashboard review is not automatically proven for mobile apps or brand design.

## Starter thresholds

These are initial calibration rules, not permanent scientific constants.

Approval requires:

- 100% of critical deterministic expectations;
- zero unresolved critical/P1 failures;
- no obvious systematic routing failure;
- stable repeated runs for the primary task;
- measurable benefit over baseline, or equal quality with a meaningful efficiency gain;
- correct attribution/licensing/security boundaries;
- human approval for subjective craft where applicable.

Do not hide a critical defect inside an average score.

## Regression rule

Whenever a real project reveals a reproducible failure:

`Failure → minimal reproduction → new eval → fix → rerun existing suite → promote only if no regression`

This is the most important Compound behavior in the quality system. Production learning becomes future protection.

## First evaluation plan

### jakub

Primary claim: improves interface review quality and gives concrete fixes without redesigning for novelty.

Test:

- dashboard hierarchy/layout review;
- typography/color/accessibility issue detection;
- unrelated backend task (negative routing);
- repeated review consistency;
- human comparison: baseline vs `jakub`.

### emi

Primary claim: improves motion and interaction decisions while exercising restraint.

Test:

- identify animation opportunities;
- identify places that should not animate;
- diagnose interruption/exit/reduced-motion problems;
- unrelated data-model task (negative routing);
- human comparison of interaction recommendations.

### cd

Primary claim: orchestrates the right specialist and converts project learning into reusable assets without forcing every task through every stage.

Test:

- UI quality task → routes to `jakub`;
- motion task → routes to `emi`;
- system-modeling task → handles directly;
- tiny isolated task → does not over-orchestrate;
- completed feature → identifies only proven reusable candidates.

## Tooling

- Anthropic `skill-creator`: eval schema and with-skill/without-skill or old/new comparison pattern.
- Promptfoo: skill invocation checks, A/B evals, repeated runs, cost/latency assertions and trace/trajectory assertions.
- MCP Inspector: protocol-level inspection of MCP servers/tools.
- Human review: final craft judgment where automated assertions are insufficient.

The quality gate itself is also subject to this process. Its own evals live next to its `SKILL.md`.
