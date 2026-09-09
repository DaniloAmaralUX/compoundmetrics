# Concepts

Shared vocabulary for this project. A glossary, not a specification. It accretes as `cd-compound` and `cd-compound-refresh` process learnings; direct edits are fine.

### Skill
A procedure — how a piece of work is done. User-invoked, orchestrates, and pulls in its own reference files as it needs them. Lives at `skills/<id>/SKILL.md`.

### Agent
A specialist dispatched into its own isolated context to perform scoped work and return a result, rather than to converse. Thin by contract: it defines dispatch, isolation and tool policy, and points at the skill that owns the procedure.

### Resource
Any tool or asset a procedure uses. Every skill and agent is a resource; so is a registry, a contract or a checker. Resources are registered and carry an evidence level.

### Artifact
A file Compound Design writes as a product of doing work: a frame, a plan, a solution, a handoff. Distinct from the framework's own infrastructure. An artifact must be earned — most runs produce none.

### Durable learning
Knowledge that would otherwise be rediscovered. Written to `docs/solutions/` by `cd-compound`, one per run, only when it passes the durability test and is not already recoverable from the code.

### Discoverability
The property that a learning surfaces for a later, different context without anyone knowing it exists. Made concrete by frontmatter signals and a bounded deterministic search, and tested without a model.

### Finding
One defect reported by a review, in the shape defined by the finding contract: evidence, impact, severity, confidence and verification state. A finding without evidence and impact is malformed and is dropped.

### CDQI
Construction quality of a resource, 0–10. How well it is built. Never evidence of effectiveness. `null` until a construction audit exists.

### CEL
Compound Evidence Level, E0–E4. How strongly a resource's effectiveness has been demonstrated. E0 inspection, E1 deterministic contracts, E2 controlled runtime, E3 independent, E4 field.

### Evidence debt
The explicit gap between what a resource is built to do and what has been shown. Recorded per resource so unmeasured capability is never narrated as impact.

### Candidate release
A release that changes architecture or behaviour without new evidence. It never replaces the stable evidence baseline.

### Superseded resource
A resource replaced by another. It keeps its historical evidence and its identifier in frozen evidence and provenance, and disappears from every active surface.
