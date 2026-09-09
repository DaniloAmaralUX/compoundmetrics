---
name: cd-setup
description: "Check that Compound Design can run in this repository and offer to create or repair its repo-local configuration. Run once after installing the plugin, and again after upgrading it."
argument-hint: ""
disable-model-invocation: true
---

# Setup

**Can Compound Design run here, and where will it write?**

A health check and a configuration helper. It diagnoses, it offers, and it never changes a file the user owns without being told to.

## When to use

- Immediately after installing or upgrading the plugin, in any project.
- When a skill reports that configuration is missing or invalid.
- To find out where artifacts will be written before running anything that writes.

## When not to use

- To install tools. Setup reports optional capabilities; it does not bulk-install anything.
- To change project configuration on someone's behalf without asking.

## Scope

Owns: repository detection, capability diagnosis, resolved artifact root, and offers to create `.compound-design/config.yaml`, refresh the committed example, and gitignore local overrides.

Does not own: writing product code, editing an existing valid `config.yaml`, touching global host configuration, or installing dependencies.

## Inputs

The repository root (`git rev-parse --show-toplevel`). The deterministic checker `node compound-design/tools/cd.mjs setup-check --json`, which runs no model. The plugin version from its manifest when the host exposes it.

## Procedure

**Phase 1 — diagnose.** Run the checker and show its report: repository root, plugin version, resolved artifact root and which layer supplied it, config files present, gitignore state of `*.local.yaml`, artifact directories, optional capabilities (git, browser, accessibility tooling) with what each unlocks. A missing optional capability is a capability, not a failure. A missing `config.yaml` is an absence, not a problem.

**Phase 2 — offer.** For each finding that has a repo-local fix, ask, and apply only on approval:

| Finding | Offer |
| --- | --- |
| `.compound-design/config.yaml` missing | create it from the example, every key commented out |
| `.compound-design/config.example.yaml` missing or outdated | refresh the committed example |
| `config.local.yaml` exists but is not gitignored | add `.compound-design/*.local.yaml` to `.gitignore` |
| `docs_root` invalid | show the value, the rule it breaks, and the corrected line — the user edits it |
| artifact directories missing | create them on first write instead, not here |

An existing valid `config.yaml` is never rewritten, never reformatted, and never has keys added to it. `config.local.yaml` is never created by setup — it belongs to whoever owns that checkout.

**Phase 3 — summarise.** State what was checked, what was created, what was declined, where artifacts will be written, and the first useful command.

## Write authority

May create `.compound-design/config.yaml` when absent **and approved**; may write `.compound-design/config.example.yaml`, which is generated and tracked; may append one line to `.gitignore` when approved. Nothing else. Never edits an existing `config.yaml`, never creates or reads `config.local.yaml` values into another file, never touches global host configuration outside the repository, never commits or pushes.

## Artifact rule

- **lightweight** — a healthy repository: report and stop.
- **bounded** — the diagnosis and the offers in the response.
- **durable** — only the two configuration files above, and only when approved.

## Output contract

```
REPOSITORY   <root, or "no writable checkout">
PLUGIN       <version, or "unknown">
ARTIFACT ROOT <resolved path · which layer supplied it · valid | invalid + reason>
CONFIG       <config.yaml: present | absent> <config.example.yaml: current | refreshed> <local override: gitignored | not gitignored | absent>
CAPABILITIES <capability → available | missing → what it unlocks>
OFFERED      <offer → accepted | declined>
WRITTEN      <path → what changed>
NEXT         <the first command that makes sense here>
```

## Forbidden

Editing an existing valid configuration file. Creating `config.local.yaml`. Bulk-installing tools. Writing outside the repository. Changing global host configuration. Reporting a check as run when the checker did not run. Applying any offer that was not approved. Treating a missing optional capability as a failure.

## Missing dependency

Not a git repository: report it and skip every repo-local write. No writable checkout: run Phase 1 only and say Phase 2 was skipped. Checker script missing: report which checks could not run instead of guessing their result. `docs_root` invalid: report it and stop offering artifact-writing next steps until it is fixed.

## Completion

Done when the diagnosis was shown, every offer was either applied on approval or recorded as declined, the resolved artifact root is stated, and no user-owned file was changed without approval.

## Provenance

The diagnose → offer → summarise shape, "optional tools are capabilities not failures", and never auto-configuring a user-owned file are adapted from Every's Compound Engineering `ce-setup` (MIT, `b36047e1`). The checker and the configuration surface are Compound Design's.
