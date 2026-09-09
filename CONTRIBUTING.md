# Contributing

Compound Metrics is evidence-first. Contributions are evaluated by whether they improve the system, not by how much content they add.

## Before changing a resource

Document:

1. the reproduced problem or missing capability;
2. the affected resource and version;
3. the hypothesis;
4. the eval or regression that should fail before the change;
5. the smallest proposed change;
6. the evidence required to accept or reject it.

## Required rules

- Do not increase CEL from prose review alone.
- Do not invent runtime uplift, external validation or vendor certification.
- Preserve provenance for upstream-informed work.
- Prefer direct upstream use when a Compound layer adds no measurable routing, integration, evidence or learning value.
- Keep holdouts separate from the examples used to design the fix.
- A P1/critical failure blocks promotion regardless of CDQI.

## Pull request structure

A meaningful change should explain:

- What changed?
- Why did it change?
- What failed before?
- What evidence exists after?
- Did CDQI change?
- Did CEL change? Why?
- What remains unproven?
- What is the rollback/simplification path?

## Versioning

Version changes are behavioral, not cosmetic. A version bump is justified by at least one of:

- a reproduced failure fixed;
- measured outcome improvement;
- efficiency improvement while preserving quality;
- a stronger boundary against a known failure class.

If none apply, improve documentation without changing the behavior version.
