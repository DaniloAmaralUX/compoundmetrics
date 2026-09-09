# Frame — Compound Design Product Experience

Date: 2026-09-09 · produced with `cd-frame` on this repository · durable because the shape of the public product is a decision a later run would otherwise rediscover.

```
PROBLEM        The public surface of Compound Design is one long page that describes the
               framework with the framework's own vocabulary. A newcomer meets CEL, CDQI,
               contract suites and evidence ceilings before meeting the idea. The engine —
               work system, learning system, plugin, evidence system — is built; nothing on
               the site lets a visitor see it happen. The page also hard-codes factual state
               (version, CEL, counts) in JSX, so every route added from here would restate
               it and drift.

USER           Three readers. A newcomer who wants to know what Compound Design is in two
               minutes. A practitioner (design engineer working with agents) who wants to
               find and use the capability. A skeptical engineer who wants to know exactly
               what has and has not been demonstrated.

OUTCOME        Each reader can answer their question without learning vocabulary first:
               Home → "I understand the idea." How it Works → "I understand the mechanism."
               Lab → "I saw Compound happen." Project → "I understand what this experiment
               is and where it stands." Resources → "I understand what capability has been
               encoded." Evidence → "I understand what has and hasn't been demonstrated."
               Field Guide → "I can explain the vocabulary."

CONSTRAINTS    Static export on Next 16 with CSS modules and four runtime dependencies;
               no model runtime, no paid calls, no subagents; every factual value comes
               from the registry and release artifacts; `noindex` stays; nothing under
               skills/, agents/, the registry semantics, CEL/CDQI definitions or frozen E2
               evidence changes; provenance visible but never dominant; no personal
               upstream name as a resource name; evilrabbit/main is unlicensed (principles
               only), lifeline is MIT (adapt with attribution).

NON-GOALS      A redesign of the framework. New skills. E2 execution. A theme toggle.
               SEO. Production merge. Parity with any reference site's feature set.

PRIOR LEARNING CD-20260909-012 · a guard must distinguish stating a rule from breaking it ·
               applies to the literal-drift and claim gates this phase adds to the site.
               CD-20260909-011 · word bans make evidence documents unwritable · the Field
               Guide must be able to define E2 and "proven" without tripping the claim guard.

AI FIT         Not in play. The site contains no user-facing AI; the Lab is deterministic
               and labelled as such.

RISKS          Teaching in the wrong order (terms before mental models). A Lab that is
               decorative rather than demonstrative. Cards everywhere. Motion that
               performs instead of explains. Visual language that borrows an identity.
               State duplicated across routes.

OPEN DECISIONS None for this pass. Public launch / SEO release is a separate, later
               decision by the author.

SUCCESS        The seven route outcomes above, each checkable by reading the route cold.
               No factual literal outside src/content. All routes pass the deterministic
               site checks at 1440/1280/820/390/320. The identity question answers YES.

NEXT           cd-model → docs/plans/2026-09-09-product-experience-ia.md
```
