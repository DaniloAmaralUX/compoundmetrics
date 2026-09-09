# Compound Design — case-study film · NARRATION

**No synthetic voice. To be recorded by the author or used as on-screen text only.**

No music. The film has no soundtrack; it renders silent. If the author records this script, the audio is dropped in as author-provided audio and the timings below are the sync points. Nothing in this script is generated speech.

Every spoken line is a §26 key phrase (verbatim) or, in brackets, an optional author line drawn from the PRD's Act structure (§4) — those are marked *[optional]* and may be cut without breaking sync. Numbers are never spoken as literals: where a value is read, the script gives the data key and the author reads the value that appears on screen.

Timecodes are for the master (108 s, 30 fps). Vertical and teaser sync points follow.

---

## Master · 108 s

| TC | Frame | Line | Key | Note |
| --- | --- | --- | --- | --- |
| 00:00.3 | 9 | I built *{tools.stated_count_in_brief}* tools with AI this year. | T.hook.1 | read the numeral shown on screen; it is the brief's count |
| 00:03.0 | 90 | They did not become a portfolio. | T.hook.2 | |
| 00:05.2 | 156 | They became a system. | T.hook.3 | caption `candidates / verified` is on screen; not spoken |
| 00:07.4 | 222 | Different products. | T.pattern.1 | over nav match cuts |
| 00:09.0 | 270 | Same mistakes. | T.pattern.2 | |
| 00:11.0 | 330 | Different products. | T.pattern.3 | over hero match cuts |
| 00:12.6 | 378 | Same decisions. | T.pattern.4 | |
| 00:14.6 | 438 | Different products. | T.pattern.5 | over primary-action cuts |
| 00:15.6 | 468 | Same knowledge. | T.pattern.6 | |
| 00:16.5 | 495 | The output was compounding. | T.problem.1 | contact grid |
| 00:17.3 | 519 | The knowledge wasn't. | T.problem.2 | |
| 00:18.6 | 558 | I stopped keeping good decisions in my head. | T.turn.1 | V11 hero, finding card |
| 00:22.0 | 660 | I started encoding them. | T.turn.2 | resource page |
| 00:25.4 | 762 | *[optional]* Failure became a rule. The rule went back into the check. | Act 3/4 | matches E51 → E52 → E53 on screen; no numbers |
| 00:29.2 | 876 | What if the atomic unit was not only UI? | T.atomic.1 | component push-ins |
| 00:34.0 | 1020 | What if knowledge itself was composable? | T.atomic.2 | AtomicLayer stack |
| 00:37.0 | 1110 | *[optional]* Useful knowledge became reusable capability. | Act 4 | created edges draw |
| 00:40.8 | 1224 | Products generate knowledge. | T.compound.1 | transfer V05 → V08 |
| 00:45.3 | 1359 | Knowledge becomes capability. | T.compound.2 | identical page proof |
| 00:49.8 | 1494 | Capability improves the next product. | T.compound.3 | Lifeline fan |
| 00:52.6 | 1578 | *[optional]* The tools stopped being isolated projects. | Act 5 | `L.graph.counts` on screen; do not read the numbers |
| 00:54.3 | 1629 | The system does not only build interfaces. | T.audit.1 | the /audit page of V01 |
| 00:58.2 | 1746 | It inspects what it built. | T.audit.2 | ScoreReveal ×3; scores are seen, not read |
| 01:03.2 | 1896 | *[optional]* Same tool, one day later. | — | biggest_improvement pair; only if `design-scores.delta.biggest_improvement.same_tool` is true — the author checks the JSON before recording |
| 01:05.6 | 1968 | *[optional]* And where it went backwards. | — | biggest_regression pair |
| 01:10.4 | 2112 | It does not only fix failures. | T.audit.3 | The Lab |
| 01:12.0 | 2160 | It decides which failures deserve to become knowledge. | T.audit.4 | |
| 01:14.2 | 2226 | *[optional]* Failures stopped being dead ends. | Act 7 | yield ladder builds; numbers are seen, not read |
| 01:19.3 | 2379 | *[optional]* Finding. Correction. Durable learning. Resource candidate. Future capability. | Act 7 | one word per node of chain 0 as it lights |
| 01:24.8 | 2544 | *[optional]* The *{tools.stated_count_in_brief}* tools became the learning history of one system. | Act 8 | same numeral as the hook; the caption already qualified it |
| 01:27.0 | 2610 | *[optional]* Compound Design. | L.entry_title[V11] | say the name as it appears at the centroid |
| 01:33.5 | 2805 | *[optional]* Frame. Model. Build. Verify. Polish. Compound. | L.rail.final | one word per rail item, 5 f apart — read slowly, ~0.5 s each |
| 01:37.4 | 2922 | I thought I was building products with AI. | T.finale.1 | |
| 01:41.2 | 3036 | I was actually building a way to build. | T.finale.2 | |
| 01:44.7 | 3141 | Build the application. | T.finale.3 | |
| 01:46.0 | 3180 | Improve the system that builds the next one. | T.finale.4 | fade to black at 01:47.2 |

Total spoken (mandatory lines only): 27 lines, ~55 s of speech across 108 s. Leave the silences; the match cuts and the rail carry the rest.

---

## Vertical · 54 s

Mandatory lines only; every sync point is the shot start in `SHOT-MANIFEST.json` (`composition: "vertical"`).

| TC | Line | Key |
| --- | --- | --- |
| 00:00.3 | I built *{tools.stated_count_in_brief}* tools with AI this year. | T.hook.1 |
| 00:02.2 | They became a system. | T.hook.3 |
| 00:03.8 | Different products. Same mistakes. | T.pattern.1/2 |
| 00:06.5 | Different products. Same decisions. | T.pattern.3/4 |
| 00:08.0 | The output was compounding. The knowledge wasn't. | T.problem.1/2 |
| 00:09.3 | I stopped keeping good decisions in my head. | T.turn.1 |
| 00:12.0 | I started encoding them. | T.turn.2 |
| 00:14.7 | What if the atomic unit was not only UI? | T.atomic.1 |
| 00:17.6 | What if knowledge itself was composable? | T.atomic.2 |
| 00:20.5 | Products generate knowledge. Knowledge becomes capability. | T.compound.1/2 |
| 00:23.9 | Capability improves the next product. | T.compound.3 |
| 00:27.3 | The system does not only build interfaces. | T.audit.1 |
| 00:30.3 | It inspects what it built. | T.audit.2 |
| 00:35.4 | It does not only fix failures. | T.audit.3 |
| 00:36.9 | It decides which failures deserve to become knowledge. | T.audit.4 |
| 00:48.9 | I thought I was building products with AI. | T.finale.1 |
| 00:51.5 | I was actually building a way to build. | T.finale.2 |
| 00:53.0 | Build the application. Improve the system that builds the next one. | T.finale.3/4 |

---

## Teaser · 15 s

The teaser is intended as **on-screen text only** (silent autoplay). If voiced:

| TC | Line | Key |
| --- | --- | --- |
| 00:00.3 | I built *{tools.stated_count_in_brief}* tools with AI this year. | T.hook.1 |
| 00:01.6 | Different products. Same mistakes. | T.pattern.1/2 |
| 00:04.6 | Different products. Same decisions. | T.pattern.3/4 |
| 00:06.7 | It inspects what it built. | T.audit.2 |
| 00:09.2 | Products generate knowledge. Knowledge becomes capability. Capability improves the next product. | T.compound.1/2/3 |
| 00:12.2 | I was actually building a way to build. | T.finale.2 |

---

## Recording notes

- Record at 48 kHz mono, room-tone 2 s at head and tail; deliver as `case-study/video/public/narration-master.wav` (and `-vertical`, `-teaser` if voiced). `Root.tsx` adds an `<Audio>` only when the file exists (`staticFile` guarded by the manifest); the default render stays silent.
- Never read the §31 example numbers. Every numeral spoken is the value rendered from the data file at that timecode; if the author re-runs the benchmark, re-record only the lines whose value changed.
- The count in `T.hook.1` is the brief's stated count (`tools.stated_count_in_brief`). The on-screen caption `candidates: {tools.tool_candidates}, verified: {tools.verified_by_repository}` is deliberately not spoken; it stays visible long enough (2.2 s) to be read.
- No music, no stingers, no sound design. Silence between lines is part of the cut.
