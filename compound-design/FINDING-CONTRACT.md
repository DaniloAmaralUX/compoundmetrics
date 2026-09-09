# Finding contract

One shape for every Compound Design review. `cd-verify`, `cd-interface-review`, `cd-motion-review` and `cd-ai-interaction-review` all emit it, so a reviewer's output can be read, compared, filtered and acted on without learning four formats.

Version: `1.0.0`. A change to the fields, the severity ladder or the gates is a major change to every skill that emits it.

## Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable within a run: `<skill-short>-<nn>`, e.g. `IR-03`. |
| `scope` | string | What was examined — file, component, route, flow, state. |
| `severity` | `blocker` \| `major` \| `minor` | Consequence, defined below. |
| `confidence` | `high` \| `medium` \| `low` | How strongly the evidence supports the claim. |
| `evidence` | string | The specific thing observed: a line, an attribute, a computed value, a rendered behaviour. Quote or name it. |
| `impact` | string | What it costs the user or the system. One sentence, concrete. |
| `recommendation` | string | The change, concrete enough to apply: element plus what it becomes. |
| `verification_state` | `observed` \| `inferred` \| `not-verified` | How the finding was established. |
| `source` | string | What grounds it: a normative rule, a project requirement, a design-system contract, a measurement, or `judgment`. |

## Severity

- **`blocker`** — prevents task completion, loses or corrupts data, makes the interface unusable for a group of users, or lets an irreversible action run without control.
- **`major`** — the task is completable but materially harmed: comprehension, efficiency, consistency, recoverability or trust pays for it.
- **`minor`** — polish with no material task impact.

Three levels, not four. The frozen benchmark rubric and the interface heuristics both resolve to a three-level ordinal, and a fourth level never changed a decision in practice. Severity is never inflated to make a review look important; it is never averaged down either — one finding at `blocker` outranks any number of `minor` ones.

## Verification state

- **`observed`** — established from the artifact itself or from a run: the attribute is in the file, the tool reported it, the page did it.
- **`inferred`** — follows from something observed plus a rule stated in `source`.
- **`not-verified`** — plausible but not checked; it would need a render, a run or data the reviewer did not have.

A claim that could only be established by running something that was not run is `not-verified`. Presenting it as `observed` is a fabricated verification and is the most serious review defect there is.

## Gates

Applied in order, before anything is reported. Each gate that drops a finding is counted in the summary so the reader knows what was filtered.

1. **Hydration.** A finding without non-empty `evidence` *and* non-empty `impact` is malformed. Drop it. "It could be better" is not a finding.
2. **Confidence.** `low` confidence never appears in the findings list; it goes to a separate `unconfirmed` list, or is dropped. A `blocker` requires `high` confidence — if the evidence is not that strong, it is not a blocker yet.
3. **Consolidation.** One root cause is one finding. List every affected location inside it. Never emit one finding per instance of the same defect.
4. **Materiality.** A finding whose `impact` is only "differs from my taste" is dropped. Preference is not a defect.
5. **Scope.** A finding outside the review's declared scope is named once and routed, not developed.

## Output

```
FINDINGS (n)
  <id> · <severity> · <confidence> · <verification_state>
  scope: <scope>
  evidence: <what was observed>
  impact: <what it costs>
  fix: <concrete change>
  source: <rule, requirement, measurement or judgment>

UNCONFIRMED (n)      — low-confidence items, never counted as findings
NOT VERIFIED (n)     — what a run or render would be needed to check
OUT OF SCOPE (n)     — named and routed, not developed
FILTERED (n)         — dropped by gate, with the gate named
```

A review with no findings says so plainly and states what it covered. An empty review is a valid result.

## Forbidden

- Taste-only findings presented as defects.
- Claims about behaviour that was not observed, presented as `observed`.
- An exhaustive cosmetic inventory that buries the material findings.
- Inventing a severity, a metric, a measurement or a standard reference that was not applied.
- Reporting the same root cause many times to increase the count.

## Consumers

`cd-verify` (correctness, behaviour, states, accessibility), `cd-interface-review` (interface craft), `cd-motion-review` (motion and interaction), `cd-ai-interaction-review` (user-facing AI). Each adds its own domain checks; none redefines these fields, this ladder or these gates.

## Provenance

The hydration gate, the confidence gate and consolidation-by-root-cause are mechanisms adapted from Every's Compound Engineering review architecture (MIT, `b36047e1`), and the observed/inferred/not-verified split reflects the "a check you cannot run is not verified" discipline in the interface-review sources recorded in `SOURCES.md`. The field set, the three-level ladder and the output shape are Compound Design's. No upstream author endorses this contract.
