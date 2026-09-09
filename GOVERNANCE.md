# Governance

Compound Metrics is governed as an evidence-first Design Engineering project.

## Decision principles

1. **Evidence before claims.** Construction quality and demonstrated outcome quality are separate concerns.
2. **Smallest sufficient change.** Prefer improving or removing a resource over expanding the catalog without evidence.
3. **No false certification.** Do not imply endorsement or certification by OpenAI, Anthropic, Vercel, Microsoft, Google or any upstream author.
4. **Provenance is preserved.** Public naming can be authorial; internal source attribution and license obligations remain explicit.
5. **Version changes are earned.** A behavioral version changes only after a reproduced failure, measured improvement, efficiency gain with preserved quality, or a stronger boundary against a known failure class.
6. **Human judgment remains authoritative** for craft, high-consequence decisions and ambiguous evidence.

## Evidence model

- **CDQI** measures construction quality.
- **CEL** measures evidence maturity.
- **E0**: inspection only.
- **E1**: deterministic contract/regression evidence.
- **E2**: controlled runtime comparison with relevant baselines and repeated runs.
- **E3**: independent corroboration in the tested scope.
- **E4**: field evidence over time.

A high CDQI score never upgrades CEL by itself.

## Resource lifecycle

`Observe → Reproduce → Add eval → Baseline → Minimal change → Re-run → Falsify → Promote / Reject / Simplify`

A resource may be deleted when a simpler path is equal or better.

## Change control

Changes that affect claims, evidence levels, scoring, routing, provenance or resource behavior should include:

- the reason for change;
- the affected resource/version;
- evidence added or removed;
- regression implications;
- whether CEL changes;
- rollback path when relevant.

## Public communication

The project may describe itself as an applied experiment or framework. It must not describe runtime uplift as proven while current evidence remains E1.
