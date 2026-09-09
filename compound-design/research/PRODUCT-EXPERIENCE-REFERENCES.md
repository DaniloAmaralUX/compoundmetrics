# Product Experience — design references

Studied: 2026-09-09 · read-only clones under `.research/` (gitignored) · no model runtime, no subagents, no paid calls.

Both repositories were read at a pinned commit. Nothing below is inferred from memory of the deployed sites; every observation names the file it was read from. The purpose was to extract **discipline, rhythm, restraint and composition**, not identity. The acceptance question at the end of this phase is: *if these references disappeared tomorrow, would the site still clearly look like Compound Design?*

## Sources

| Source | Identity | License | Conclusion |
| --- | --- | --- | --- |
| `https://github.com/evilrabbit/main` | branch `main`, commit `c71d5bc226c0a8b9b18644c34b9b3428f9c1725f`, `package.json` name `dotcom`, private | **No LICENSE file at the pinned commit.** `package.json` declares no `license` field. | All rights reserved by default. **Principles only. No code, markup, CSS or assets copied.** |
| `https://github.com/evilrabbit/lifeline` | branch `main`, commit `8ddbb3d3ad0ac6ec5bbe8efda1c051d93d04a63a`, shadcn registry | **MIT — Copyright (c) 2026 Evil Rabbit** (`LICENSE`) | Adaptation permitted with attribution. **The interaction model is adapted; the implementation is not imported** (see below). |

The `main` repository's `README.md` states it is automatically synced from v0.dev deployments. That does not change what was studied — the shipped site's structure, type and rhythm are all in `app/page.tsx` and `app/globals.css` — but it is recorded because the direction asked for the architecture of the design, and here that architecture is a set of choices expressed inside a generated scaffold rather than a hand-built system.

## evilrabbit/main — what was observed

Files read: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/site-nav.tsx`, `components/site-footer.tsx`, `app/lifeline/page.tsx`.

| Dimension | Observation (file) | Decision for Compound Design |
| --- | --- | --- |
| Page width | One column, `max-w-[700px]`, `px-4` (`app/page.tsx`) | **ADOPT the principle**: a narrow reading measure for prose. We use a wider editorial grid for demonstrations, but text never exceeds ~72ch. |
| Typography | One family (Inter on the home page; Geist reserved for the timeline), one size (`text-sm`, monospace on the home page), hierarchy carried by **weight and colour** rather than size (`font-bold` headings at body size; white vs `#666`) | **ADAPT**: Compound keeps a real type scale because it has to teach, but the lesson stands — two text colours and weight do most of the work. Geist Sans/Mono, already ours, stay. |
| Colour | Black ground, white text, `#666` secondary, `#333` hairlines. Nothing else on the home page. | **ADOPT the restraint**: dark ground, two greys, hairlines. Compound adds exactly one accent (`#d7ff57`, already in its favicon) reserved for "what compounds". |
| Rhythm | Sections separated by `mb-12`/`mb-16`/`mb-24` and a single `<hr>`; no boxes, no cards, no backgrounds | **ADOPT**: whitespace, not borders, creates hierarchy. Cards are the exception, never the default. |
| Lists | Rows `flex justify-between items-baseline border-b border-[#333] pb-4` — label left, meta right, hairline below | **ADOPT the pattern** for resource and concept indexes, in our own CSS. |
| Hover | A 1px underline grows from 0 to 100% width in 0.3s, only under `(hover: hover) and (pointer: fine)` (`.expertise-item::after`) | **ADAPT**: the same discipline (hover means something only where hover exists), implemented independently. |
| Entrance | `fadeIn` 0.5s with staggered delays `0.1–0.6s`; media rendered lazily through an `IntersectionObserver` | **ADAPT**: a single quiet entrance, and lazy rendering only where it prevents cost. No per-section choreography. |
| Media | `rounded-lg outline outline-1 outline-[#333]`; video `autoPlay loop muted playsInline` | Not applicable — this site ships no raster media. SVG only. |
| Navigation | `fixed inset-x-0 top-0`, `h-16`, `max-w-5xl`, `backdrop-blur-xl`, hairline; logo left, one external link right (`site-nav.tsx`) | **ADOPT the restraint, reject the fixedness**: Compound has seven destinations, so a sticky-but-minimal header with a text nav, not a two-item chrome. |
| Footer | `h-16`, hairline, theme switcher left, `© year` right | **ADAPT**: hairline, two-column, quiet. No theme switcher this phase. |
| Theme | `next-themes`, class strategy, light + dark | **REJECT for this phase**: dark is Compound's ground; a toggle is a separate decision. |
| Stack | Next 14, Tailwind 3, 57 shadcn/Radix components, `@emotion/react` for one `<Global>` style block, `vue-router` listed as a dependency | **REJECT entirely**: we keep Next 16 + CSS modules with four runtime dependencies. |

## evilrabbit/lifeline — what was observed

Files read: `README.md`, `LICENSE`, `registry.json`, `components/lifeline/{types.ts, lifeline.tsx, lifeline-desktop.tsx, lifeline-vertical.tsx, lifeline-marker.tsx, lifeline-layout.ts, use-lifeline-scroll.ts, use-lifeline-intro.ts, lifeline-intro-timing.ts}`, `app/globals.css`.

| Mechanism | Observation | Decision |
| --- | --- | --- |
| One rail | A single dashed hairline (`border-t border-dashed`) at a fixed `--lifeline-rail` offset; markers are columns hung from it with a 10px tick | **ADAPT** for `/project`: one rail, ticks, columns. |
| Two layouts, one data model | `lifeline.tsx` switches on a `matchMedia` breakpoint between a horizontal, scroll-scrubbed desktop track and a vertical `grid-cols-[2.5rem_1rem_1fr]` mobile list | **ADAPT**: the same switch, our own CSS. The vertical layout is the mobile timeline. |
| Scrub | Desktop wheel/scroll is translated into a horizontal `transform` on the track (`use-lifeline-scroll.ts`); `mode="embed"` hands scrolling back to the page at either end | **SIMPLIFY**: Compound's timeline has six stages, not forty years. Six markers fit one row without any scrub; the selected stage opens in a panel below (tabs, arrow keys), and on mobile the same DOM reorders into a vertical rail with the panel under its marker. The embed hand-back problem does not arise. |
| Intro | The rail draws with `transform: scaleX(var(--lifeline-intro-progress))` over ~3.2s with a smoothstep-eased power curve; markers fade in on a delay computed from their offset along the track (`use-lifeline-intro.ts`, `lifeline-intro-timing.ts`); **skipped entirely under `prefers-reduced-motion`** | **ADAPT the idea, not the code**: a CSS-only rail draw of ~1.2s with per-stage delays, disabled by `prefers-reduced-motion`. No calibrated easing power — six stages do not need it. |
| Marker anatomy | Age (11px) above year (15px, tabular) above events (14px/1.55), all `text-zinc-500` until the column is hovered, when it darkens | **ADAPT**: version above name above facts; the hover-darken is the same discipline as the home page's underline. |
| Photos, hover media, lightbox, fireworks, people | Present and central to Lifeline | **REJECT**: this timeline carries no media and no easter eggs. |
| Stack | Next 16, Tailwind 4, `@base-ui/react`, `shadcn`, `lucide-react`, `next-themes` | **REJECT**: nothing is installed. |

### Attribution

No file from `lifeline` is copied. The **interaction model** — one rail, horizontal on desktop and vertical on mobile, a rail that draws in on first view, markers that settle from muted to full as they are reached — is adapted from Evil Rabbit's Lifeline (MIT, © 2026 Evil Rabbit, `8ddbb3d`). That adaptation is recorded in `NOTICE` and `compound-design/SOURCES.md`. Should any code fragment be derived later, the MIT notice travels with it.

## Principles carried forward

1. **Two text colours and weight do the hierarchy.** Size changes are for the reader's benefit at section boundaries, not decoration.
2. **Whitespace is the border.** A box is a decision, never a default.
3. **One accent, one meaning.** The lime mark appears when something compounds and nowhere else.
4. **Hover only where hover exists.** Fine-pointer affordances are wrapped in `(hover: hover) and (pointer: fine)`.
5. **Motion is progression.** A rail draws because time passes; a learning slides because it changes form. Nothing bounces. `prefers-reduced-motion` ends every animation in its settled state.
6. **Lists, not grids of cards.** Rows with a hairline below — label left, meta right.
7. **A narrow measure for prose, a wide stage for demonstrations.**

## What is deliberately not copied

- Identity: the rabbit, Inter, the monospace home page, the black/white/#666 palette as a signature. Compound keeps its own ground, its lime mark and Geist.
- Stack: neither repository's dependency tree; no Tailwind, no shadcn, no Radix, no base-ui, no emotion, no lucide.
- Content architecture: a personal portfolio and a life timeline are different products from a work system that must teach.

## Dependency decisions this phase

Before adding a dependency the direction requires three answers. None was added:

| Candidate | Why this? | Why not the existing stack? | Cost | Decision |
| --- | --- | --- | --- | --- |
| Popover / dialog library | Inline term education | Native `popover` attribute and `<dialog>` cover open, dismiss, focus and Escape | Bundle + API surface | **Not added** |
| Search library | Field Guide queries | ~60 entries; normalized-token overlap over authored aliases is deterministic and sufficient | Index + runtime | **Not added** |
| Animation library | Transformations | CSS keyframes and transitions, gated by reduced-motion | Runtime | **Not added** |
| Timeline component | `/project` | Adapted in CSS modules; see above | Its stack | **Not added** |

## Evidence boundary

Studying these sites produced no evidence about Compound Design. Nothing here changes any resource's CEL or CDQI. Evil Rabbit provides reference material and, for Lifeline, an MIT-licensed interaction model; he does not validate, endorse or certify Compound Design.

## Adversarial review before preview (2026-09-09)

Each line below is an attempt to prove the product experience fails one of the direction's tests, run against the built site (`npm run site:check`, screenshots at 1440 and 390, and a cold read of every route). Verdicts are the reviewer's; where a finding was material it was fixed before this record was written.

| Attempt to prove | Verdict | Evidence / what changed |
| --- | --- | --- |
| Home is still too technical | Not upheld | Above the fold: the two canonical lines, the definition, the thesis, then the seven-form transformation. Version, level and counts first appear in the fifth section, after the built-well ≠ proven-useful boundary has been shown. |
| Terms appear before mental models | Not upheld, one exception accepted | CDQI and CEL are named only after the boundary; the Lab names its four terms only after the sequence completes; the Field Guide opens with a question, not a list. The footer states version and level on every page — a disclosure, deliberately constant. |
| The loop looks like a generic process diagram | Not upheld | Six human questions in a numbered grid with a full-width "Repeat" closing row; the numbers encode a real sequence. No chevrons, no icons. |
| The Lab is decorative | Not upheld | Real state: the specimen changes when a correction is applied; IR-04's verification state flips from `not-verified` to `observed` only when the visitor submits the form; the compound step gives the four findings four different outcomes, two of which are "nothing survives". |
| Project is marketing | Not upheld | Status block read from the registry, an E2 status line quoted from the frozen environment, six stages each with "what remains unknown" and the document it was derived from. |
| Resources are overwhelming | Partially upheld, accepted | Twenty-one rows in six groups, one sentence each, public name first. The detail page hides the full procedure behind a disclosure. Fewer rows would mean hiding resources that exist. |
| Evidence exaggerates maturity | Not upheld | E1 is marked as the current maximum with "cannot say: proven to improve outcomes"; E2–E4 are marked "not reached"; seven things that are never evidence are listed; every resource shows its evidence debt. |
| The Field Guide is just a glossary | Not upheld | Search in the reader's words (English and Portuguese) with deterministic matching; each concept opens with a plain sentence, why it exists and an analogy, then "see it in practice" with a route, and only then the technical definition behind a disclosure. |
| Visual language is too close to Evil Rabbit | Not upheld | Shared: Geist and a dark ground, both already Compound's. Different: a wide editorial grid rather than a 700 px monospace column; a display face at up to 84 px; a lime accent with one meaning; a light specimen panel; rows with hairlines. Remove the reference and the site still reads as Compound. |
| Visual language is generic | Partially upheld, accepted | Near-black with one acid accent is a known default. Mitigations: the accent is semantic, not decorative; a second material (paper) exists; typography and whitespace carry the hierarchy; the transformation rail, the ≠ boundary and the specimen are this subject's own devices. The ground and the lime were constraints of the existing identity, not choices made here. |
| Navigation is too dense | Not upheld | Seven destinations; collapses to a disclosure menu under 820 px; internal architecture (registry, ledger, evals) is not in it. |
| Mobile is inferior | Not upheld | Five widths checked without horizontal overflow; the timeline becomes a vertical rail with the panel under its marker; the Lab stacks specimen over stepper. |
| Motion is decorative | Upheld once, fixed | The hero rail pulse looped forever. It now travels twice and rests at the end — it says "this direction" and stops. All other motion is a transformation (rail draw, marker settle, sequence lighting) and ends in its settled state under reduced motion. |
| Content state is duplicated | Not upheld | Version, level, baseline, runtime status and counts are read from the registry and release artifacts in `src/content/current-state.ts`; a gate fails the build if `src/app` or `src/components` restate one — and it caught one real instance (`EvidenceBadge` comparing against a literal) before this record. |
| Current evidence can drift between routes | Not upheld | Same source for Home, Project, Evidence, Resources and the footer. |
| Provenance is hidden | Not upheld | Every resource page carries "Built within Compound Design. Informed by …", the skill's own provenance section, the superseded resource it replaced, and the rule that no upstream author endorses it. NOTICE is linked from every footer. |
| Everything became cards | Not upheld | Rows and hairlines throughout. Raised surfaces: the Lab specimen and the term popover, each for a reason. |
| The site became heavier without becoming clearer | Not upheld | Static export, 92 pages; five client islands (header, term popover, timeline, Lab, search); 784 KB of JavaScript chunks in total across the export; the Field Guide index page is the largest HTML at 116 KB because the search index ships inline. |

Two false signals were found in the checks themselves and recorded in the ledger (`CD-20260909-013`) and as a durable learning (`docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md`), which `cd discover` surfaces for a different later context.

### Identity question

*If the Evil Rabbit reference disappeared tomorrow, would this still clearly look like Compound Design?* Yes. The mark, the lime that appears only where something compounds, the transformation rail, the ≠ boundary and the light specimen are Compound's; none of them is in the reference.
