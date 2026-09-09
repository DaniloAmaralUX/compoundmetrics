---
name: cd-compound
description: "Capture the one learning from a piece of work that a future person or agent would otherwise have to rediscover, and write it where the next Frame or Model will find it. Use at the end of work that taught something; most work teaches nothing durable, and that is a valid result."
argument-hint: "[what the work taught, if you already know]"
---

# Compound

**What deserves to survive this project?**

The loop only compounds if something survives it. It stops compounding the moment everything survives it.

## When to use

- At the end of a piece of work that produced a non-obvious correction, constraint or mechanism.
- After a failure that was reproduced and understood.
- When a reviewer or a human corrected the agent for a reason that will recur.

## When not to use

- The work went as expected. Say so and write nothing.
- The learning is already stated in the code, its tests, its types or the project's instructions. A document that repeats them is drift waiting to happen.
- Session trivia, personal preference, or a restatement of what the framework already says.

## Scope

Owns: judging durability, writing **one** learning per run under `<root>/solutions/`, and proposing — never performing — a promotion to a rule, pattern, skill, agent or eval.

Does not own: maintaining the store over time (`cd-compound-refresh`), changing a resource (`cd-resource-lab`), or deciding evidence levels (`cd-quality-gate`).

## Inputs

What happened in the work: the correction, the failure, the surprise. The diff. The Verify report. The existing store, so an existing document is updated rather than duplicated.

## Procedure

1. **Apply the durability test.** Ask literally:

   > If this learning disappeared, would a future human or agent likely repeat the mistake, incur meaningful risk, or redo substantial investigation?

   If no, stop and say nothing was durable. Effort spent and diff size do **not** establish durability.

2. **Check recoverability.** If a test, a type, a comment or the project's instructions already state it, the answer is no. Say where it already lives.
3. **Search the store** for the same area or failure class. An existing document is updated in place; a near-duplicate is consolidated, not appended.
4. **Write one learning.** One per run. Two learnings mean the more durable one wins and the other is named in the response.
5. **Make it discoverable.** Write the frontmatter defined in `compound-design/DISCOVERABILITY-CONTRACT.md` — `id`, `title`, `date`, `areas`, `concepts`, `applies_to`, `signals`, `supersedes`, `status`. `signals` carries the literal strings that will recur: the error text, the symbol, the config key, the filename. Generic signals make a learning undiscoverable, which makes writing it pointless.
6. **State it as mechanism, not narrative**: what was expected, what happened, why, and what to do next time.
7. **Verify it is findable.** Run `node compound-design/tools/cd.mjs discover --context "<a sentence someone would write when hitting this again>"` and confirm the new learning is returned. If it is not, the frontmatter is wrong — fix it before finishing.
8. **Propose promotion, do not perform it.** A learning may deserve to become a rule, a pattern, a skill change, an agent change or an eval case. Name the candidate and the evidence it would need. Promotion is decided by `cd-resource-lab` and gated by `cd-quality-gate`.
9. **Redact.** No credentials, secrets, personal data, client-confidential material or proprietary source.

## Write authority

May create or update exactly one file under `<root>/solutions/`, and may append one entry to `compound-design/learning/LEDGER.md` when the learning concerns a Compound Design resource itself. Never edits source code, skills, agents, the registry, evidence artifacts or another skill's document. Never commits or pushes.

<!-- cd-artifact-root:start -->
**Resolve the artifact root `<root>` before composing any artifact path.**

- **Read** `docs_root` from `<repo-root>/.compound-design/config.yaml` only (`<repo-root>` = `git rev-parse --show-toplevel`). Never from `config.local.yaml`. Unset → `<root>` is `docs`.
- **Validate** a set value: a repo-relative directory whose real, symlink-resolved path stays inside the repository and is neither the repository root nor under `.git/`. Otherwise stop with an error naming `docs_root` and its value — never fall back to `docs`.
- **Use** `<root>` as the sole artifact location: create it if absent, compose each path as `<root>/<subdir>`, and never also read or write `docs` when a root is configured.
<!-- cd-artifact-root:end -->

## Artifact rule

- **lightweight** — nothing was durable. Say so. This is the most common correct outcome.
- **bounded** — the learning is real but local to this repository's current state; state it in the response and let the work carry it.
- **durable** — write `<root>/solutions/YYYY-MM-DD-<slug>.md` when the durability test passes and the knowledge is not recoverable from the code.

## Output contract

```
DURABLE?      <yes | no — and the durability test answered explicitly>
RECOVERABLE?  <where it already lives, if it does>
LEARNING      <expected → observed → why → what to do next time>
SCOPE         <where it applies, and where it does not>
ARTIFACT      <path written or updated, or "none">
DISCOVERABLE  <the context sentence tried, and whether discovery returned this learning>
PROMOTION     <candidate rule/pattern/skill/agent/eval and the evidence it would need, or "none">
LEDGER        <entry id when the learning concerns a Compound Design resource, or "n/a">
```

## Forbidden

Writing more than one learning per run. Writing a learning that the code already states. Writing a solution file without the discoverability frontmatter, or with generic signals. Treating effort or diff size as durability. Performing a promotion. Claiming a learning generalises beyond what was seen. Storing secrets, personal data or client-confidential material. Editing a resource because of a learning.

## Missing dependency

No store directory: create `<root>/solutions/` on first durable write. No Verify report: judge from the work itself and say so. Unresolvable `docs_root`: stop with the error rather than writing anywhere.

## Completion

Done when the durability test is answered explicitly, at most one learning was written and — if written — proved discoverable by a real query, any promotion is a proposal with its evidence requirement named, and nothing sensitive was recorded.

## Provenance

The durability test, "one learning per run", and the rule that effort does not establish eligibility are adapted from Every's Compound Engineering `ce-compound` (MIT, `b36047e1`). The promotion gate, the ledger link and the evidence discipline are Compound Design's.
