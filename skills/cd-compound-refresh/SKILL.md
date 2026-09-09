---
name: cd-compound-refresh
description: "Audit the durable learning store against the current codebase and apply one outcome per document — keep, update, consolidate, replace or delete. Use when learnings may be stale, overlapping, superseded or undiscoverable; this is how bad knowledge gets removed."
argument-hint: "[optional scope hint: area, filename or keyword]"
---

# Compound Refresh

**Is what we wrote down still true, still distinct, and still findable?**

A store that only grows stops being an asset. This is the skill that deletes.

## When to use

- The learning store has grown and nobody trusts all of it.
- The codebase moved and documents may describe behaviour that no longer exists.
- Discovery is returning noise, or returning nothing where a learning exists.
- After a release that changed an area several learnings describe.

## When not to use

- Capturing a new learning — that is `cd-compound`.
- Improving a Compound Design resource — that is `cd-resource-lab`.
- General refactoring or code review. This skill never changes product code.

## Scope

Owns: accuracy, distinctness and discoverability of documents under `<root>/solutions/`, and the maintenance action applied to each.

Does not own: product code, skills, agents, runbooks or instruction files. When a learning contradicts guidance, the contradiction is **reported**, never silently corrected in the guidance.

## Inputs

Every active document under `<root>/solutions/`, excluding `README.md`. The current codebase. `docs/CONCEPTS.md` when present. An optional scope hint; a hint matching nothing never widens the scope.

## Procedure

1. **Choose the lens, and say which.** *Accuracy* is the default: is each document still true and still distinct. *Worth* — is this knowledge already stated by the code, its tests or the project's instructions — runs **only** when the user asked for a cleanup and confirmed it, because it can delete accurate documents. State the reading back and confirm before investigating.
2. **Check each document against the code.** Paths, symbols, config keys, behaviour. Record what witnesses each claim.
3. **Check the set**, not only the documents: overlap, supersession, contradiction. A contradiction actively misleads, so it outranks individual staleness.
4. **Check discoverability.** Missing or generic frontmatter per `compound-design/DISCOVERABILITY-CONTRACT.md`; `signals` that appear nowhere in the codebase any more; `status: superseded` still competing in results.
5. **Assign exactly one outcome per document.**
   - **Keep** — true, distinct, discoverable. Unverifiable is not the same as false.
   - **Update** — the mechanism holds, the details drifted.
   - **Consolidate** — two or more documents are one learning; merge and keep one `id`, marking the others `superseded`.
   - **Replace** — the mechanism itself is wrong; rewrite it, `supersedes` the old `id`.
   - **Delete** — it never earned durability, or the worth lens confirmed the code already states it. Every deletion quotes the file that makes the document redundant.
6. **Apply the outcomes.** Version history is the archive: there is no in-place archive folder and nothing is moved to one.
7. **Report every document**, including the ones kept.

## Write authority

May update, merge and delete files under `<root>/solutions/`, and update `docs/CONCEPTS.md` when vocabulary changed. **Deletion requires** either an explicit confirmation for this run or a quoted file that states the same knowledge. Never edits product code, skills, agents, runbooks, instruction files or evidence artifacts. Never commits or pushes.

<!-- cd-artifact-root:start -->
**Resolve the artifact root `<root>` before composing any artifact path.**

- **Read** `docs_root` from `<repo-root>/.compound-design/config.yaml` only (`<repo-root>` = `git rev-parse --show-toplevel`). Never from `config.local.yaml`. Unset → `<root>` is `docs`.
- **Validate** a set value: a repo-relative directory whose real, symlink-resolved path stays inside the repository and is neither the repository root nor under `.git/`. Otherwise stop with an error naming `docs_root` and its value — never fall back to `docs`.
- **Use** `<root>` as the sole artifact location: create it if absent, compose each path as `<root>/<subdir>`, and never also read or write `docs` when a root is configured.
<!-- cd-artifact-root:end -->

## Artifact rule

- **lightweight** — an empty or already-healthy store: report it and stop.
- **bounded** — the per-document report in the response.
- **durable** — the corrected store itself. No separate report file.

## Output contract

```
LENS         <accuracy | accuracy + worth (confirmed by the user)>
SCOPE        <documents examined, and the hint if one was given>
PER DOCUMENT <id · outcome · why · what witnesses it>
DELETED      <id · the quoted file that makes it redundant>
CONTRADICTIONS <learning vs guidance, reported not corrected>
DISCOVERY    <documents whose frontmatter or signals were repaired>
STORE        <documents before → after>
```

## Forbidden

Deleting an accurate document under the accuracy lens. Deleting anything without a quoted witness or an explicit confirmation. Editing a skill, runbook or instruction file. Changing product code. Assigning more than one outcome to a document. Treating "cannot verify" as "false". Archiving in place.

## Missing dependency

No store: say so and stop; an empty store is a valid state. No confirmation available for a deletion: downgrade it to a recommendation and continue. A failed write: record the document as *recommended* rather than applied, and continue the pass.

## Completion

Done when every document in scope has exactly one applied or recommended outcome with its evidence, deletions are justified by a quote or a confirmation, contradictions are reported, and the store's before/after count is stated.

## Provenance

The five outcomes, the accuracy/worth split, "version history is the archive", and the refusal to edit the guidance layer being audited are adapted from Every's Compound Engineering `ce-compound-refresh` (MIT, `b36047e1`). The discoverability pass is Compound Design's.
