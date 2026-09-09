# Development

## Local install for dogfooding

The repository is the plugin. To run the skills against this repository itself:

```text
/plugin marketplace add /absolute/path/to/compoundmetrics
/plugin install compound-design@compound-design
```

There is no mirrored copy under `.claude/`. `skills/` and `agents/` at the repository root are the single canonical implementation, and every supported host reads them through its own manifest. That is why there is no sync step and no chance of two versions of a skill drifting apart.

## Checks

All deterministic, offline, and free of model calls.

```bash
npm run cd:lint        # registry rules + mutation self-test
npm run cd:registry    # registry against its JSON Schema and the evidence rules
npm run cd:evals       # resource contract suite (skills, agents, discoverability)
npm run cd:plugin      # manifests, component discovery, duplicate ids, legacy leaks, self-containment
npm run cd:claims      # contextual claim guard
npm run cd:selftest    # mutation tests for every gate above
npm run cd:all         # all of it
```

The official validator is worth running locally as an independent check:

```bash
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict skills
claude plugin validate --strict agents
```

Never run `claude plugin eval` here: it spends model budget. The benchmark harness under `compound-design/quality/e2/` is separately guarded and refuses to start without explicit authorisation.

## Adding a skill

1. Establish that a procedure has a consumer. A skill without one is maintenance and routing noise; record it in `compound-design/research/DEFERRED-CAPABILITIES.md` instead.
2. Write `skills/<id>/SKILL.md` with every section the contract suite requires: when to use, when not to use, scope, inputs, procedure, write authority, artifact rule, output contract, forbidden, missing dependency, completion, provenance.
3. If it writes artifacts, include the artifact-root resolution block verbatim. If it emits findings, reference `compound-design/FINDING-CONTRACT.md`.
4. Register it in `compound-design/registry/resource-registry.json` at **`cel: "E0"`** with `cdqi: null`.
5. Add it to `compound-design/quality/evals/v0.3-contract-suite.json`.
6. Run `npm run cd:all`. Only after the suite passes may its evidence level move to `E1`, in a separate commit that records the artifact.

## Adding an agent

Same discipline, plus: the description must state both a trigger and a non-trigger, the frontmatter must declare a tool policy, the body must reference the skill it runs, and it must not restate that skill's procedure. The contract suite enforces all of it, including a line limit — an agent long enough to contain a procedure is one.

## Evidence rules

- A new resource starts at `E0`.
- `E1` requires the deterministic contract suite to pass, with the artifact recorded.
- Nothing in this release exceeds `E1`.
- `cdqi` stays `null` until a construction audit is written down.
- Plugin version and evidence level are independent: a version bump never moves a CEL.

## Frozen evidence

`compound-design/quality/e2/` is a pre-registered benchmark. Its task sets, fixtures, ground truth, rubrics and holdouts are frozen, and the resources it tests are pinned snapshots under `legacy-resources/v0.2/` with a manifest proving byte-equivalence to the commit they were taken from. Do not edit anything there to match a newer architecture; `npm run e2 -- verify-legacy` and `npm run e2 -- self-test` will catch it if you do.
