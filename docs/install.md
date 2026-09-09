# Install

Compound Design ships as one plugin containing 15 skills and 6 specialist agents. The installed plugin is self-contained: it clones nothing, downloads nothing at runtime, and needs no upstream checkout.

## Claude Code

```text
/plugin marketplace add DaniloAmaralUX/compoundmetrics
/plugin install compound-design@compound-design
```

Restart or reload, then run `/cd-setup` in any project.

## Codex

Compound Design is not in Codex's built-in marketplace. Add it as a custom marketplace, then install:

```bash
codex plugin marketplace add DaniloAmaralUX/compoundmetrics
codex plugin add compound-design@compound-design
```

Restart Codex. In Codex, skills are invoked with a dollar prefix — `$cd-setup`, `$cd-frame`.

## Cursor

In Cursor Agent chat:

```text
/add-plugin compound-design
```

Or add the repository as a plugin marketplace and install `compound-design` from it.

## First run

```text
cd-setup
```

Setup diagnoses the repository and offers each repo-local fix. It never edits a configuration file you already own, never creates `config.local.yaml`, never installs tools, and never touches your global host configuration. Missing optional tools are reported as capabilities with what each unlocks — a missing browser means rendered checks report `not-verified`, not that anything failed.

A first pass through the loop:

```text
cd-frame     make the invite flow understandable when it fails
cd-model
cd-build
cd-verify
cd-polish
cd-compound
```

Do not run all six for a small change. Frame and Model exist for work whose shape is not obvious; a one-line fix goes straight to Build, and Compound writes nothing when nothing was learned.

## Configuration

`.compound-design/config.yaml` holds team defaults and is committed. `.compound-design/config.local.yaml` overrides it per checkout and is gitignored. `.compound-design/config.example.yaml` is generated, tracked, and documents every key.

| Key | Default | Consumers |
| --- | --- | --- |
| `docs_root` | `docs` | every artifact-writing skill |
| `strategy_path` | `STRATEGY.md` | `cd-strategy`, `cd-frame`, `cd-model` |
| `evidence_root` | `compound-design` | `cd-quality-gate`, `cd-resource-lab` |
| `default_review_mode` | `report-only` | `cd-verify`, `cd-interface-review`, `cd-motion-review` |
| `runtime_policy` | `zero-cost` | `cd-quality-gate`, `cd-resource-lab` |
| `provenance_policy` | `strict` | `cd-quality-gate`, `cd-resource-lab` |

Ordinary keys resolve local → repository → skill default; the first active value wins and an invalid one falls through. `docs_root` is different: it is read only from the committed file, and an unusable value **stops the run** instead of falling back, because silently writing to `docs/` would put artifacts in the location you configured away from.

Check what resolved, and where from:

```bash
node compound-design/tools/cd.mjs config
```

## Upgrade

Refresh the marketplace before updating, then re-run `cd-setup` so the committed example is refreshed and any retired key is reported. Upgrading never rewrites your `config.yaml`.

## Uninstall

Remove the plugin through the host. Artifacts under `docs/` and your `.compound-design/` configuration are yours and stay.
