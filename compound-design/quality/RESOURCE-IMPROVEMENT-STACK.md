# Compound Design — Resource Improvement Stack

## Principle

A Compound Design resource is never considered valuable because its prompt looks good. It earns trust through repeated evidence.

Every skill, agent, plugin, MCP or reusable AI resource must have a version and an evidence level.

## Improvement stack

### 1. Anthropic Skill Reviewer — structural quality

Source: `anthropics/claude-plugins-official/plugins/plugin-dev/agents/skill-reviewer.md`

Use immediately after creating or modifying a skill.

Checks:

- frontmatter and required metadata;
- trigger-description quality;
- triggering specificity;
- progressive disclosure;
- SKILL.md organization;
- references/examples/scripts;
- broken references;
- skill-development best practices.

Important: treat this as a static/design review, not proof of outcome quality. The official reviewer has had a reported failure mode where it can review without reading files, so Compound Design must require evidence that the reviewer actually inspected the resource.

### 2. Anthropic Skill Creator — iterative skill improvement

Source: `anthropics/claude-plugins-official/plugins/skill-creator`

This is the primary upstream resource for improving Compound Design skills.

Capabilities we want to reuse:

- create and modify skills;
- generate eval prompts;
- run `with_skill` vs `without_skill` comparisons;
- quantitative grading;
- human qualitative review;
- blind A/B comparator;
- analyzer for why one version won;
- benchmark aggregation and variance analysis;
- description optimization for better triggering;
- repeat-and-improve loop.

Compound Design should not rebuild this machinery without a reason. Our authored layer adds Design Engineering rubrics and promotion rules.

### 3. Promptfoo — skill competition and automatic optimization

Use Promptfoo as the independent harness for comparing versions.

Key capabilities:

- Agent Skills testing;
- `skill-used` / `not-skill-used` routing assertions;
- correctness assertions;
- cost and latency measurement;
- repeated runs;
- side-by-side version comparison;
- `promptfoo optimize` to propose improved prompt candidates from observed failures;
- validation split to reduce overfitting;
- trace/trajectory evaluation;
- red-team skill bundle when a resource has security implications.

This is the first external quality layer for CD resources.

### 4. OpenAI Evals + Optimize — cross-model validation

Use OpenAI's prompt/eval tooling as a separate model family rather than asking Claude to grade Claude only.

Use for:

- side-by-side prompt versions;
- linked eval runs;
- pass/fail datasets;
- Optimize suggestions for unclear or contradictory instructions;
- independent grader runs when appropriate.

A cross-model judge does not make a result objectively true, but it reduces same-model self-preference.

### 5. Braintrust — external experiment and regression layer

Braintrust can act as an external experiment system when Compound Design becomes more mature.

Useful capabilities:

- datasets built from real failures;
- prompt/agent experiments;
- trace-level scoring;
- comparison between experiments;
- automatic suggestions through Loop;
- production failures promoted into permanent eval cases;
- CI quality thresholds that can block regressions.

This is a strong candidate for the public statement that a CD resource has been evaluated outside our own repository.

### 6. Vercel Eve — optional runtime eval layer

Eve is useful if Compound Design agents later become durable production agents. It supports agents-as-files, skills, subagents, human approvals and evals.

Do not introduce it into V1 unless the runtime needs it. It is a future integration, not a current dependency.

## Evidence levels

Every resource exposes one of these labels:

### DRAFT
Resource exists. No meaningful eval evidence yet.

### INTERNALLY TESTED
Passed deterministic checks and repeated Compound Design evals.

### CROSS-MODEL VERIFIED
Also evaluated by a separate model family or independent grader configuration.

### EXTERNAL EVAL VERIFIED
Passed an external evaluation platform such as Promptfoo or Braintrust with a stored result artifact.

### CD STABLE
Has survived real use, regression testing, repeated evaluation and at least one external verification layer.

Never display `VERIFIED`, `PROVEN` or `STABLE` without a stored evidence artifact.

## Version model

Treat resources more like software releases than static prompts.

Example:

```text
cd-craft 0.1
Draft adaptation of Jakub + Emi knowledge.

cd-craft 0.2
Trigger description improved after routing eval.

cd-craft 0.3
Design review rubric improved after Supernova Admin failures.

cd-craft 1.0
Repeated eval pass + cross-model verification + real-project evidence.
```

Use semantic versioning:

- PATCH — wording, examples or small rubric fixes without intended behavioral change;
- MINOR — new capability, rule, reference or evaluator while preserving purpose;
- MAJOR — resource changes purpose, contract, routing boundaries or output schema.

## Resource release record

Each released version should store:

```yaml
resource: cd-craft
version: 0.3.0
status: CROSS-MODEL VERIFIED
source_commit: <sha>
upstream:
  - jakubkrehel/skills@<sha>
  - emilkowalski/skills@<sha>
evaluators:
  - cd-quality-gate
  - anthropic-skill-creator
  - promptfoo
  - openai-evals
runs: 3
baseline_score: null
resource_score: null
cost_delta: null
latency_delta: null
human_review: pending
evidence:
  - evals/results/<artifact>
```

Do not invent scores. Null means not yet measured.

## Compound Design improvement loop

```text
REAL USE
  ↓
FAILURE / WEAK OUTPUT
  ↓
CAPTURE AS EVAL CASE
  ↓
SKILL REVIEWER
  ↓
SKILL CREATOR ITERATION
  ↓
PROMPTFOO A/B + ROUTING + REPEATS
  ↓
CROSS-MODEL EVAL
  ↓
HUMAN DESIGN REVIEW
  ↓
VERSION BUMP
  ↓
PROMOTE OR REJECT
  ↓
NEXT REAL USE
```

This loop is itself part of the Compound stage: work improves the system that performs future work.
