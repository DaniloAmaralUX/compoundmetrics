# Discoverability contract

Writing a learning down is half a mechanism. The loop only compounds if a **later** run, in a different context, finds it without being told it exists.

This contract defines the shape a durable learning must have and the deterministic way it is retrieved. It is testable without a model, and it is tested: `cd contracts` includes a discovery case that plants a solution written for one context and proves it surfaces for a different, later context.

Version `1.0.0`. Consumed by `cd-compound` (writer), `cd-frame` and `cd-model` (readers), `cd-compound-refresh` (maintainer).

## 1. Every durable learning is addressable

A file under `<root>/solutions/` is discoverable only if it carries this frontmatter. `cd-compound` writes it; `cd contracts` rejects a solution file without it.

```yaml
---
id: CD-SOL-YYYYMMDD-NN        # stable, never reused
title: <one line, the mechanism, not the story>
date: YYYY-MM-DD
areas: [<surface or subsystem>, ...]      # where it was learned, e.g. forms, routing, build
concepts: [<noun>, ...]                   # vocabulary a future reader would search for
applies_to: <one line: the situation this recurs in>
signals: [<literal string>, ...]          # phrases, symbols, filenames or errors that indicate the situation
supersedes: <id or null>
status: active | superseded
---
```

`signals` is what makes discovery work across contexts. A learning about a form field that failed silently is not found by searching "form"; it is found by the symbol, the error text or the API name that will appear again.

## 2. Discovery is deterministic and bounded

`node compound-design/tools/cd.mjs discover --context "<text>" [--area <a>] [--json]` scans the frontmatter of every active solution under the resolved artifact root and returns ranked matches. No model is involved.

Scoring, in order of weight:

| Match | Weight |
| --- | --- |
| a `signals` entry appears literally in the context | 5 |
| a `concepts` entry appears as a whole word | 3 |
| an `areas` entry appears as a whole word, or matches `--area` | 2 |
| a title word (four letters or more, not a stop word) appears | 1 |

Bounds: at most **7** results; anything scoring below **3** is dropped; `status: superseded` is excluded; ties break by most recent date. A bounded result set is the point — a reader that receives forty learnings reads none of them.

## 3. Readers must call it

`cd-frame` and `cd-model` run discovery before they ask the user anything, and report the result explicitly — including when there is nothing:

```
PRIOR LEARNING  <id · title · why it applies here>   |   none found
```

A learning that surfaces becomes a constraint in the frame or the model, with its `id` named as the source. Silently absorbing it is not allowed: the reader has to be able to see which prior run is speaking.

## 4. Writers must make it findable

`cd-compound` fills `signals` with the literal strings that will recur — an error message, a symbol, a config key, a filename — not with paraphrase. A learning whose `signals` are generic ("bug", "state") is undiscoverable in practice and fails its own contract.

## 5. Maintenance keeps it honest

`cd-compound-refresh` re-checks frontmatter on every pass: `superseded` documents are excluded from discovery, and a document whose `signals` no longer appear anywhere in the codebase is a candidate for Update or Delete. Discoverability decays; the refresh pass is what stops it.

## 6. The property being built

```
PROJECT A → problem discovered → solution verified → durable learning captured (addressable)
                                                              ↓
PROJECT B → cd-frame / cd-model run discovery → the learning surfaces → the mistake is avoided earlier
```

**This is a technical property, not an evidence claim.** The deterministic test proves the mechanism retrieves the learning. It does not show that anyone made a better decision because of it; that would need runtime evidence which has not been collected. Runtime uplift remains `not measured`.
