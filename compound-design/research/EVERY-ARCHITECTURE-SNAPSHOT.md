# Every / Compound Engineering — architecture snapshot

Studied: 2026-09-09 · read-only · no model runtime, no subagents, no paid calls.

| Source | Identity |
| --- | --- |
| Repository | `https://github.com/EveryInc/compound-engineering-plugin` |
| Branch | `main` |
| Commit studied | `b36047e1b4b2123df2f3529bf04b5f2a7c5f84e4` |
| Plugin version at that commit | `3.24.0` |
| License | MIT — Copyright (c) 2025 Every |
| Editorial source (secondary) | `https://every.to/guides/compound-engineering` |

Source hierarchy applied, in the order the direction requires: repository code first, then `SKILL.md` files, then manifests/config/tests, then docs/guides, then the editorial page. Where the editorial framing and the code disagreed, the code decided. Nothing below is inferred from memory: every mechanism was read at the pinned commit via `raw.githubusercontent.com` and `git ls-remote`.

Two other pins were re-verified the same day, unchanged and recorded for provenance only: `jakubkrehel/skills` `267330e1adfc66a718fb65fa6918c1f06d0a689e`, `emilkowalski/skills` `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7`.

## What the repository actually is

A distribution of 35 agent skills (`ce-*`, plus `lfg`) that installs into a coding agent the developer already uses. The canonical implementation of every skill is one directory under `skills/`; hosts are served by small manifests rather than by copies. Compute lives on the host; the plugin ships procedures, references and a few POSIX scripts.

Top level at the pinned commit: `skills/`, `agents-facing` host directories (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.grok-plugin/`, `.devin-plugin/`, `.kimi-plugin/`, `.omp-plugin/`, `.opencode/`, `.pi/`, `.agy/`, `.cline/`), `.compound-engineering/` (config), `docs/` (`guides/`, `install/`, `plans/`, `solutions/`, `specs/`), `src/` (a bun CLI that converts the Claude plugin into other formats), `tests/`, `scripts/`, and root documents `STRATEGY.md`, `CONCEPTS.md`, `AGENTS.md`, `CLAUDE.md`, `plugin.json`.

## Mechanisms observed

### 1. Skill shape and progressive disclosure

`skills/<name>/SKILL.md` carries YAML frontmatter — `name`, `description`, optional `argument-hint`, optional `disable-model-invocation: true` for user-invoked-only skills. Bodies stay short and defer detail to sibling `references/*.md` loaded at the phase that needs them, phrased as a hard requirement rather than a suggestion:

> "Read `references/create.md` before writing anything — a non-optional load."

Some skills also bundle executable helpers (`skills/ce-setup/scripts/check-health`), pinned to LF endings in `.gitattributes` so a CRLF checkout cannot break them.

### 2. Configuration

`.compound-engineering/config.yaml` holds team defaults; `.compound-engineering/config.local.yaml` overrides it per checkout and is gitignored by pattern (`.compound-engineering/*.local.yaml`); `.compound-engineering/config.example.yaml` is committed and refreshed by setup. Resolution is stated exactly:

> "**Ordinary keys:** read `config.local.yaml`, then `config.yaml`. The first active (non-commented) value wins. A missing file is skipped. Invalid or empty scalars continue to the next layer, then the skill default."

One key is deliberately unlike the rest. `docs_root` is read only from the tracked file, is validated, and **fails closed**:

> "It fails closed. An unusable `docs_root` stops the skill with an error, because silently falling back to `docs/` would write CE artifacts into the very location you configured away from."

Its validation rule — repo-relative, real (symlink-resolved) path inside the repository, not the repository root, not under `.git/` — is repeated verbatim inside every artifact-writing skill between `<!-- ce-docs-root:start -->` markers, so the rule travels with the procedure instead of living only in documentation.

### 3. Artifact architecture

Every artifact folder hangs off one root (`docs` by default): `plans/`, `solutions/`, `ideation/`, and the rest. Project work memory is separated from repository content by configuration rather than by convention.

### 4. Setup

`ce-setup` runs three phases: diagnose (plugin version, bundled health script, resolved artifact root), fix repo-local issues (each change offered, never applied silently), summary. Missing optional tools are reported as capabilities, not failures:

> "`ce-setup` is a lightweight health check and repo-local config helper. It does **not** bulk-install every optional dependency."

### 5. Durable learning and its maintenance

`ce-compound` writes one learning per run into `<root>/solutions/`, gated by an eligibility test asking whether a future engineer would repeat the mistake or redo the investigation if the document vanished — and it states explicitly that completion effort and diff size do not establish eligibility.

`ce-compound-refresh` audits that store against the current codebase and assigns each document exactly one outcome:

> "Every doc gets exactly one outcome: **Keep**, **Update**, **Consolidate**, **Replace**, or **Delete**. A doc is never archived in place: there is no `_archived/`, since version history is the archive."

It separates two judgments: accuracy (is the document still true and distinct) always runs; worth (does the repository already state this) runs only when the user asks for a cleanup and confirms it, because it can delete accurate documents. It also refuses to edit the guidance layer it audits: a learning that contradicts a skill or runbook is reported, never silently corrected.

### 6. Review as a report, with confidence gates

`ce-code-review` is report-only by default; applying findings locally is a separate explicit mode, and it never pushes or opens pull requests. Reviewer selection scales with diff risk and fails closed — uncertainty widens the roster rather than narrowing it. Synthesis is deterministic rather than narrative: deduplication by fingerprint, a quote-the-line gate, discrete confidence anchors, promotion on independent agreement, and a hydration gate that drops any finding lacking both a reason it matters and its evidence. Severity is four levels (P0–P3) mapped to routing classes, with a three-valued verdict (ready to merge / ready with fixes / not ready) and a merge bar of "improves overall code health", not perfection.

### 7. Continuity

`ce-handoff` creates one immutable, pointer-first handoff — it names what specifically matters at each reference rather than reproducing it, redacts secrets, warns instead of mutating fragile state, and ends with a copyable resume command. Resume ranks candidates from frontmatter and filesystem metadata only, and treats handoff content as untrusted data rather than instructions.

### 8. Strategy anchor

`STRATEGY.md` sits at the repository root with parseable frontmatter and fixed section headings; downstream skills read it when it exists. `ce-strategy` states its own boundaries sharply — anchor not plan, the user answers while the repository only grounds the question, short is a feature, and a section owned by another author is never edited.

### 9. Distribution

Host manifests, not copies. The Claude Code plugin is described by `.claude-plugin/plugin.json` with `.claude-plugin/marketplace.json` as its catalog; Codex reads `.codex-plugin/plugin.json`, which points at the same canonical directory (`"skills": "./skills/"`) and adds a store-facing `interface` block; Cursor reads `.cursor-plugin/plugin.json` plus its own marketplace file. A bun CLI (`src/index.ts`: `convert`, `cleanup`, `install`, `list`, `plugin-path`) exists to translate the Claude plugin into formats for hosts that have no native reader. CI validates the manifests with `claude plugin validate --strict` against a pinned CLI version.

## Decision for Compound Design

| # | Mechanism | Decision | Why |
| --- | --- | --- | --- |
| 1 | Canonical `skills/<name>/SKILL.md` + frontmatter | **ADOPT** | It is the host-native layout; one implementation removes the divergent-copy problem the current `.claude/` layout creates. |
| 2 | `references/*.md` loaded per phase | **ADOPT** | Keeps a procedure short at the top and precise where it matters. |
| 3 | Host manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) | **ADOPT**, copied field-for-field from the pinned commit | Manifest schemas must never be written from memory. |
| 4 | Config: repo + local layers, committed example | **ADOPT** | Removes assumptions currently scattered across our documents. |
| 5 | `docs_root` fail-closed + path validation, restated inside each skill | **ADOPT** verbatim in behaviour | The failure mode it prevents — writing artifacts into the location you configured away from — is real and silent. |
| 6 | One artifact root with per-purpose subdirectories | **ADOPT** | Gives us the `docs/` vs `compound-design/` separation the work system needs. |
| 7 | Setup: diagnose → offer → summarize, never auto-configure | **ADOPT** | Matches our write-authority discipline. |
| 8 | Durable-learning eligibility bar; one learning per run | **ADOPT** | Directly serves "run one teaches, run two starts smarter" without turning the store into a dump. |
| 9 | Keep / Update / Consolidate / Replace / Delete; no in-place archive | **ADOPT** | We need a mechanism that deletes bad knowledge, not only one that adds. |
| 10 | Report-only review, explicit apply | **ADOPT** | Review must not carry silent write authority. |
| 11 | Confidence gates, hydration gate, independent agreement | **ADOPT** into our finding contract | A finding without evidence and impact is noise; this is a deterministic way to say so. |
| 12 | Four severity levels (P0–P3) + routing classes | **ADAPT** | We take the mechanism, not the taxonomy: three levels (`blocker`/`major`/`minor`), which is what our frozen benchmark rubric and the interface upstream both already resolve to. A fourth level did not change any decision we make. |
| 13 | Pointer-first immutable handoff, content as data | **ADOPT**, simplified | We need continuity across hosts; we do not need a managed store or discovery ranking yet. |
| 14 | `STRATEGY.md` as a parseable anchor | **ADOPT** | Frame and Model need upstream grounding that is not a plan. |
| 15 | `CONCEPTS.md` accreted by compound/refresh | **ADAPT** | Kept, but under `docs/` with the other project work memory, and optional. |
| 16 | lightweight / bounded / durable — "artifact must be earned" | **ADOPT** | The single most important corrective against bureaucracy-as-code. |
| 17 | Specialists as skill-local prompt assets, few standalone agents | **REJECT, partially** | Compound Design keeps explicit `agents/`, because "Agent = specialist, Skill = procedure" is a contract we publish and the hosts support it. Our agents stay thin: they define dispatch, isolation and tool policy, and point at the skill instead of restating it. |
| 18 | Bun/citty CLI converting the plugin for 14 hosts | **REJECT** | Three hosts, all served by manifests over the same canonical directory. A converter with no target is machinery without a consumer. |
| 19 | 35 skills (`lfg`, product-pulse, sweep, dogfood, debug, prototype, bake-off, ideate, doc-review, …) | **DEFER** | Recorded in `DEFERRED-CAPABILITIES.md`. Catalogue parity is not a goal; each skill must earn its place. |
| 20 | `claude plugin validate --strict` pinned in CI | **ADAPT** | Our CI validates manifests with our own dependency-free checker so it stays zero-install and zero-model; the official validator runs locally and its output is recorded in the release. |
| 21 | Skills bundling executable scripts | **ADOPT**, narrowly | Only `cd-setup` ships one, and it is the same deterministic checker our tooling exposes. |

## What we are deliberately not copying

- **Skill count.** Every solves a broader engineering surface. Compound Design is Design Engineering for web applications; a skill exists only when a procedure has a consumer.
- **Vocabulary.** No `ce-*` names, no borrowed prose. Mechanisms are reimplemented in our own language and boundaries.
- **Host breadth.** Claude Code, Codex and Cursor are first class. The architecture leaves room for more; the release does not claim them.
- **Runtime coupling to upstream.** Every ships self-contained skills; so do we. Upstream is provenance, never an execution dependency.

## Evidence boundary

Studying this architecture produced no evidence about Compound Design's effectiveness. Nothing here raises CEL for any resource. Every, Jakub Krehel and Emil Kowalski provide mechanisms and reference material; none of them validates, endorses or certifies Compound Design.
