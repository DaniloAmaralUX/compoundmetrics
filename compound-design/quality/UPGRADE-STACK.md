# Compound Design Resource Upgrade Stack — v0.1

The Compound Design quality system does not depend on one judge. Different tools inspect different layers, while `cd-resource-lab` composes their evidence into a version decision.

## Evidence layers

### 1. Static skill architecture

Use Anthropic's skill-creator methodology and skill-review patterns as a reference for:

- skill structure and frontmatter;
- trigger/description quality;
- progressive disclosure;
- clear scope and non-goals;
- testable output contracts;
- benchmark-ready eval definitions.

This is architecture evidence, not proof that the resource improves outcomes.

### 2. Executable agent/skill evals

Use Promptfoo as an independent executable harness when available for:

- positive and negative routing;
- candidate vs baseline comparisons;
- repeated runs and variance;
- model grading for non-deterministic qualities;
- latency, token/cost and tool-call evidence;
- trace/trajectory inspection.

Prefer deterministic assertions before model graders.

### 3. MCP / tool protocol quality

Use MCP Inspector or equivalent protocol-level tooling for MCP resources:

- tool discovery;
- schemas and arguments;
- resource access;
- auth/transport behavior;
- tool-call failures;
- realistic multi-tool tasks.

A server is not good because it exposes many tools. It is good when an agent can complete representative tasks reliably with them.

### 4. Deploy/runtime verification

For web-facing resources, verify the integration in the real application environment:

- build succeeds;
- route responds;
- expected content/functionality exists;
- runtime errors are absent;
- protected previews remain private/noindex when required;
- browser and accessibility checks are run when the environment exposes them.

Deployment availability is application evidence; it does not replace skill/agent outcome evals.

### 5. Human craft review

Keep a human in the loop for qualities such as:

- visual hierarchy;
- interaction feel;
- motion restraint;
- writing quality;
- product judgment;
- whether the output is merely correct or genuinely good.

The candidate resource must not be its own only subjective judge.

## Compound Design composition layer

`cd-resource-lab` owns the upgrade cycle:

`failure → reproducible eval → baseline → minimal change → repeated rerun → score delta → version decision`

`cd-quality-gate` owns promotion:

`DRAFT → NEEDS_WORK / CANDIDATE → CD_APPROVED → DEPRECATED`

The 0–10 score comes from `CD-RESOURCE-SCORE.md`. Every score must state whether it is `readiness` or `verified`.

## Independence rule

External tools are evidence providers, not certification badges.

Using a model, evaluator, vendor methodology, benchmark harness or hosting platform does not imply endorsement by that company. Public claims must describe exactly what was measured.

## Version evidence package

Each release should eventually contain:

- `vX.Y-scores.json`;
- human-readable audit report;
- eval suite version;
- baseline identifier;
- model/runtime metadata;
- repeated-run results;
- regressions added;
- trajectory evidence when applicable;
- efficiency delta when measured;
- deployment/browser evidence for web resources;
- explicit remaining uncertainty.

The goal is not to make every score approach 10. The goal is to make every new version demonstrably better than the previous best version in its defined job.
