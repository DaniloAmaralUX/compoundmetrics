# Frozen rubric — Compound Design Audit

`compound-design-audit.json` is derived mechanically from `scripts/build-audit.mjs` and cross-checked against the `[data-audit-check]` inputs of `audit.html`, both read from `DaniloAmaralUX/compound-labs-design` at `364430b9d553c6b9f87e4ff3cbc0f31eaa5d1a33` — the commit serving https://compound-labs-design.vercel.app/audit on 2026-09-09 (production deployment `dpl_y6YbQ7RJcAVeF1fjESkj6axyCYWJ`, page version marker v3.6.0).

The item count (54) and the nine categories were read from source, not assumed. `RUBRIC-MANIFEST.json` carries the SHA-256 of the frozen JSON and of `audit.html`; `audit.html.frozen` is the byte-for-byte page. Nothing in this directory changes after `frozen_at`. If the upstream audit changes later, a new freeze gets a new manifest; results are always reported against the manifest they were scored with.

This is the **Visual / UX audit instrument (A)**. The **Source / Craft instrument (B)** is the `cl-audit` command of the plugin in the same repository (`compound-labs-design/commands/cl-audit.md` → `references/audit-playbook.md`, "8 categorias"); it is applied only where the exact source of a captured version is available, never inferred from a screenshot.
