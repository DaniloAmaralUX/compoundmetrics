import type { Metadata } from "next";
import {
  Cta,
  CtaRow,
  Defs,
  PageIntro,
  SectionIntro,
  SourceList,
} from "@/components/editorial";
import { Inline } from "@/components/Markdown";
import { Term } from "@/components/Term";
import {
  atomic,
  benchmark,
  benchmarkCategories,
  boundary,
  chronology,
  film,
  findings,
  knownUnknowns,
  learningYield,
  milestones,
  milestonesMeta,
  tools,
  transferGraph,
} from "@/content/case-study";
import type { CaseTool } from "@/content/case-study";
import styles from "./case-study.module.css";

export const metadata: Metadata = {
  title: "Case Study",
  description:
    "The material proof page of the Compound Design case study: the tools, the chronology, the design milestones, the audit score against a frozen ruler, and what remains unknown.",
};

const pct = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : `${n}%`;
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const confClass = (c: CaseTool["confidence"]) =>
  c === "high"
    ? styles.confHigh
    : c === "medium"
      ? styles.confMedium
      : styles.confLow;

function ToolRow({ t, verified }: { t: CaseTool; verified: boolean }) {
  return (
    <li className={styles.tool}>
      <span className={styles.toolDate}>{t.firstKnown}</span>
      <div className={styles.toolMain}>
        <span className={styles.toolName}>{t.name}</span>
        <span className={styles.toolSub}>
          {t.purpose}
          {t.family && t.family !== "UNKNOWN" ? ` · ${t.family}` : ""}
          {verified && t.repo ? ` · ${t.repo}` : ""}
        </span>
      </div>
      <div className={styles.toolMeta}>
        <span className={`${styles.conf} ${confClass(t.confidence)}`}>
          {t.confidence}
        </span>
        <span>{verified ? `captured: ${t.captured}` : "not captured"}</span>
        {verified && (t.resourcesCreated > 0 || t.resourcesReused > 0) && (
          <span>
            {t.resourcesCreated} created · {t.resourcesReused} reused
          </span>
        )}
      </div>
    </li>
  );
}

function NotYet({
  what,
  source,
  label = "Not yet computed",
}: {
  what: string;
  source: { path: string; note?: string };
  label?: string;
}) {
  return (
    <div className={styles.notYet}>
      <strong>{label}.</strong>
      <span className="muted">{what}</span>
      <span className="small faint">
        Will be read from <code>{source.path}</code>
        {source.note ? ` — ${source.note}` : ""}. Until that file exists, this
        section says so instead of estimating.
      </span>
    </div>
  );
}

export default function CaseStudyPage() {
  const story = [
    `I built ${tools.stated} tools with AI.`,
    "Those tools started teaching one another.",
    "Failures became rules.",
    "Rules became resources.",
    "Resources became skills, agents, evals and systems.",
    "The system began evaluating its own output.",
    "And the next product no longer started from zero.",
  ];
  const d = benchmark.delta;
  const unknowns = [
    ...chronology.uncertainties.map((u) => ({
      what: u,
      source: chronology.source,
      markdown: true,
    })),
    ...knownUnknowns.map((k) => ({ ...k, markdown: false })),
  ];

  return (
    <>
      <PageIntro
        eyebrow="Case study"
        title="The story, and then the record."
        lead="The story is the author's. Everything after it is read from the repository at build time — the tools that can be found, the milestones that can be rebuilt, the score against a frozen ruler, and the limits that were declared before the work began."
        aside={
          <>
            <span className="label">What you should be able to say</span>
            <span className="small muted">
              “I can tell which line of the story the record supports, and which
              it does not yet.”
            </span>
          </>
        }
      />

      <section className="container section" aria-labelledby="story-title">
        <SectionIntro
          id="story-title"
          eyebrow="Story"
          title="Seven lines, as the author tells it."
        />
        <ol className={styles.story} aria-label="The story in seven lines">
          {story.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <div className={styles.storyNums}>
          <div>
            <span className={styles.bigNum}>{tools.stated}</span>
            <span className="small muted">stated by the author</span>
          </div>
          <div>
            <span className={styles.bigNum}>{tools.candidates}</span>
            <span className="small muted">candidates found</span>
          </div>
          <div>
            <span className={styles.bigNum}>{tools.verifiedByRepository}</span>
            <span className="small muted">verified by repository</span>
          </div>
        </div>
        <div className={styles.storyCaption}>
          <span className="small muted">
            {tools.stated} — stated by the author; candidates found:{" "}
            {tools.candidates}, verified by repository:{" "}
            {tools.verifiedByRepository}.
          </span>
          <span className="small faint">{tools.reconciliation}</span>
        </div>
      </section>

      <section className="container section" aria-labelledby="tools-title">
        <SectionIntro
          id="tools-title"
          eyebrow="Tools"
          title="Every candidate, with how sure the record is."
          lead={`Read from the Vercel project list, deployment metadata, git history and fetchable page content. A tool is verified when a readable repository confirms it; inferred when only a project name and a date support it. Client work appears as a count, never as a name.`}
        />
        <div className={styles.toolGroups}>
          <div className={styles.toolGroup}>
            <div className={styles.toolGroupHead}>
              <span className="label">Verified · {tools.verified.length}</span>
              <span className="h3">
                A readable repository confirms the tool.
              </span>
              <span className="small muted">
                Captured means a design milestone was rebuilt from its exact
                commit and rendered below.
              </span>
            </div>
            <ul className={styles.toolList} aria-label="Verified tools">
              {tools.verified.map((t) => (
                <ToolRow key={t.id} t={t} verified />
              ))}
            </ul>
          </div>
          <div className={styles.toolGroup}>
            <div className={styles.toolGroupHead}>
              <span className="label">Inferred · {tools.inferred.length}</span>
              <span className="h3">
                A project name and a date, nothing readable behind them.
              </span>
              <span className="small muted">
                Counted as candidates only. None is captured; the author decides
                whether each one counts as a tool.
              </span>
            </div>
            <ul className={styles.toolList} aria-label="Inferred tools">
              {tools.inferred.map((t) => (
                <ToolRow key={t.id} t={t} verified={false} />
              ))}
            </ul>
          </div>
          <div className={styles.toolGroup}>
            <div className={styles.toolGroupHead}>
              <span className="label">Client · {tools.client.count}</span>
              <span className="h3">
                Present in the count, withheld by name.
              </span>
              <span className="small muted">
                Marked privacy: review-required in the manifest. Nothing about
                them is shown until that review happens.
              </span>
            </div>
            <div>
              <div className={styles.anon}>
                <div>
                  <span className={styles.bigNum}>{tools.client.count}</span>
                  <span className="small muted">client tools, anonymised</span>
                </div>
                <div>
                  <span
                    className={`mono ${styles.bigNum}`}
                    style={{ fontSize: "var(--t-h3)" }}
                  >
                    {tools.client.byConfidence.high} ·{" "}
                    {tools.client.byConfidence.medium} ·{" "}
                    {tools.client.byConfidence.low}
                  </span>
                  <span className="small muted">
                    high · medium · low confidence
                  </span>
                </div>
                <div>
                  <span
                    className={`mono ${styles.bigNum}`}
                    style={{ fontSize: "var(--t-h3)" }}
                  >
                    {tools.client.firstKnown ?? "—"} →{" "}
                    {tools.client.lastKnown ?? "—"}
                  </span>
                  <span className="small muted">first and last known date</span>
                </div>
              </div>
              <p className={`small faint ${styles.anonNote}`}>
                Excluded from the candidate count:{" "}
                {tools.excluded
                  .map((e) => `${e.project} (${e.why})`)
                  .join("; ")}
                .
              </p>
            </div>
          </div>
        </div>
        <div className={styles.sources}>
          <SourceList sources={[tools.source]} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="chronology-title">
        <SectionIntro
          id="chronology-title"
          eyebrow="Chronology"
          title="Verified dates only."
          lead={chronology.intro}
        />
        <ul
          className={styles.counts}
          aria-label="What the brief says versus what the metadata supports"
        >
          {chronology.counts.map((c) => (
            <li key={c.what}>
              <span className={styles.num}>
                <Inline text={c.count} />
              </span>
              <span className="small">{c.what}</span>
              <span className="small faint">
                <Inline text={c.basis} />
              </span>
            </li>
          ))}
        </ul>
        <p
          className={`body muted ${styles.tableNote}`}
          style={{ marginBottom: 40 }}
        >
          <Inline text={chronology.countsNote} />
        </p>
        <ol className={styles.timeline} aria-label="Timeline">
          {chronology.timeline.map((row, i) => (
            <li key={i}>
              <span>
                <Inline text={row.date} />
              </span>
              <span>
                <Inline text={row.evidence} />
              </span>
              <span>
                <Inline text={row.event} />
              </span>
            </li>
          ))}
        </ol>
        <span className="label" style={{ display: "block", marginTop: 48 }}>
          Relationships the sources support
        </span>
        {chronology.relationshipsIntro && (
          <p className={`small muted ${styles.tableNote}`}>
            <Inline text={chronology.relationshipsIntro} />
          </p>
        )}
        <ul className={styles.relations} style={{ marginTop: 16 }}>
          {chronology.relationships.map((r, i) => (
            <li key={i}>
              <Inline text={r} />
            </li>
          ))}
        </ul>
        <p className={`small faint ${styles.tableNote}`}>
          <Inline text={chronology.relationshipsNote} />
        </p>
        <div className={styles.sources}>
          <SourceList sources={[chronology.source]} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="milestones-title">
        <SectionIntro
          id="milestones-title"
          eyebrow="Design milestones"
          title={`${milestonesMeta.count} design states from ${milestonesMeta.toolsCaptured} tools.`}
          lead={milestonesMeta.principle}
          wide
        />
        <ol className={styles.milestones} aria-label="Design milestones">
          {milestones.map((m) => (
            <li key={m.id} className={styles.milestone}>
              <div className={styles.milestoneText}>
                <div className={styles.milestoneId}>
                  <span className={styles.num}>{m.id}</span>
                  <span className="mono small muted">{m.build}</span>
                </div>
                <span className={styles.milestoneName}>{m.name}</span>
                <dl className={styles.milestoneFacts}>
                  <dt>Tool</dt>
                  <dd>{m.toolNames.join(" · ")}</dd>
                  <dt>Dates</dt>
                  <dd className={styles.num}>{m.dateRange}</dd>
                  <dt>Commit</dt>
                  <dd>
                    <a
                      href={`https://github.com/${m.repo}/commit/${m.sha}`}
                      rel="noopener"
                    >
                      <code>{m.shaShort}</code>
                    </a>{" "}
                    <span className="muted">{m.repo}</span>
                  </dd>
                  <dt>Where</dt>
                  <dd>
                    {m.url ? (
                      <a href={m.url} rel="noopener">
                        {m.url}
                      </a>
                    ) : null}
                    {m.urlNote && (
                      <span className="muted">
                        {m.url ? ` — ${m.urlNote}` : m.urlNote}
                      </span>
                    )}
                  </dd>
                  {m.equivalentDeployments.length > 0 && (
                    <>
                      <dt>Also</dt>
                      <dd className="muted">
                        {m.equivalentDeployments.length} equivalent deployment
                        {m.equivalentDeployments.length === 1 ? "" : "s"},
                        counted once
                      </dd>
                    </>
                  )}
                  <dt>Confidence</dt>
                  <dd>{m.confidence}</dd>
                </dl>
                <p className="small muted" style={{ textWrap: "pretty" }}>
                  {m.whyDistinct}
                </p>
              </div>
              <div className={styles.shots}>
                <figure>
                  {m.desktop ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static export; intrinsic size given, lazy
                    <img
                      className={styles.shot}
                      src={m.desktop.src}
                      width={m.desktop.width}
                      height={m.desktop.height}
                      loading="lazy"
                      decoding="async"
                      alt={`Entry screen of ${m.name}`}
                    />
                  ) : (
                    <div className={styles.shotMissing}>
                      desktop entry screen not captured
                    </div>
                  )}
                  <figcaption>
                    entry · desktop
                    {m.desktop
                      ? ` · ${m.desktop.width}×${m.desktop.height}`
                      : ""}
                  </figcaption>
                </figure>
                <figure>
                  {m.mobile ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static export; intrinsic size given, lazy
                    <img
                      className={styles.shot}
                      src={m.mobile.src}
                      width={m.mobile.width}
                      height={m.mobile.height}
                      loading="lazy"
                      decoding="async"
                      alt={`Entry screen of ${m.name}`}
                    />
                  ) : (
                    <div className={styles.shotMissing}>
                      mobile entry screen not captured
                    </div>
                  )}
                  <figcaption>
                    entry · mobile
                    {m.mobile ? ` · ${m.mobile.width}×${m.mobile.height}` : ""}
                  </figcaption>
                </figure>
              </div>
            </li>
          ))}
        </ol>
        <ul
          className={styles.milestoneNotes}
          aria-label="Merge evaluation notes"
        >
          <li>
            <strong
              className="mono"
              style={{ fontWeight: 500, color: "var(--ink)" }}
            >
              Merge rule
            </strong>{" "}
            — {milestonesMeta.mergeRule}. {milestonesMeta.mergePairs.length}{" "}
            pairs evaluated,{" "}
            {milestonesMeta.mergePairs.filter((p) => p.merged).length} merged.
          </li>
          {milestonesMeta.mergeNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
          <li>{milestonesMeta.captureMethod}.</li>
        </ul>
        <div className={styles.sources}>
          <SourceList sources={[milestonesMeta.source]} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="score-title">
        <SectionIntro
          id="score-title"
          eyebrow="Score benchmark"
          title={benchmark.label}
          lead={`${benchmark.meaning}. Score is never shown without coverage: a high score over a small share of the ruler is a small claim.`}
          wide
        />
        <div className={styles.formula}>
          <div>
            <span className="label">Score</span>
            <code>{benchmark.formula.score}</code>
          </div>
          <div>
            <span className="label">Coverage</span>
            <code>{benchmark.formula.coverage}</code>
          </div>
          <div>
            <span className="label">N/A items</span>
            <code>{benchmark.formula.na}</code>
          </div>
          <div>
            <span className="label">Ruler</span>
            <span className="small">
              {benchmark.rubricName} {benchmark.rubricVersion} —{" "}
              {benchmark.rubricItems} items, frozen at{" "}
              <code>{benchmark.rubricSha7}</code> of {benchmark.rubricRepo}
            </span>
          </div>
          <div>
            <span className="label">Judgment items</span>
            <span className="small">
              {benchmark.judgmentMerged
                ? "merged into the score from the blinded pass"
                : "not yet merged — every score below is deterministic-only; judgment items count as not verified"}
            </span>
          </div>
        </div>
        <div
          className={styles.tableWrap}
          tabIndex={0}
          role="region"
          aria-label={`${benchmark.label} per milestone; scrolls horizontally`}
        >
          <table className={styles.table}>
            <caption className="sr">
              {benchmark.label} per milestone, with coverage and per-category
              score
            </caption>
            <thead>
              <tr>
                <th scope="col">Milestone</th>
                <th scope="col" className={styles.scoreCell}>
                  Score · coverage
                </th>
                <th scope="col">Counts ({benchmark.countKeys.join(" / ")})</th>
                {benchmarkCategories.map((c) => (
                  <th scope="col" key={c.id}>
                    <span className={styles.catHead}>
                      <span>{c.id}</span>
                      <span>{c.title}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benchmark.rows.map((r) => (
                <tr key={r.id}>
                  <th
                    scope="row"
                    style={{
                      whiteSpace: "normal",
                      textTransform: "none",
                      letterSpacing: 0,
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--t-small)",
                      color: "var(--ink)",
                      minWidth: 180,
                    }}
                  >
                    <span className={`mono ${styles.num}`}>{r.id}</span>{" "}
                    <span className="muted">{r.name}</span>
                  </th>
                  <td className={styles.scoreCell}>
                    <span className={styles.scoreLine}>
                      <strong>{pct(r.score)}</strong>
                      <span className="muted">cov {pct(r.coverage)}</span>
                    </span>
                    <span
                      className={styles.bar}
                      style={{
                        ["--w" as string]: `${r.score}%`,
                        ["--c" as string]: `${r.coverage}%`,
                      }}
                      aria-hidden="true"
                    >
                      <i />
                      <b />
                    </span>
                  </td>
                  <td className={styles.num}>
                    {benchmark.countKeys
                      .map((k) => r.counts[k] ?? 0)
                      .join(" / ")}
                  </td>
                  {benchmarkCategories.map((c) => {
                    const cell = r.categories[c.id];
                    return (
                      <td key={c.id} className={styles.cat}>
                        <span className={styles.num}>
                          {pct(cell?.score ?? null)}
                        </span>
                        <span className="faint">
                          cov {pct(cell?.coverage ?? 0)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.legend} aria-hidden="true">
          <span>
            <i /> score
          </span>
          <span>
            <i className={styles.cov} /> coverage
          </span>
        </div>
        {benchmark.averageAll !== null && (
          <p className={`small muted ${styles.tableNote}`}>
            Average score across all milestones {pct(benchmark.averageAll)};
            across independent designs {pct(benchmark.averageIndependent)}.{" "}
            {benchmark.averageNote}
          </p>
        )}
        <div className={styles.sources}>
          <SourceList sources={benchmark.sources} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="delta-title">
        <SectionIntro
          id="delta-title"
          eyebrow="Delta"
          title="What moved between consecutive milestones, and what never did."
          lead="Each pair is V(n) against V(n−1) on the same ruler. Items are named by the ruler's own ids."
        />
        <div className={styles.delta}>
          {d.biggest_improvement && (
            <div className={styles.deltaCell}>
              <span className="label">Biggest improvement</span>
              <div className={styles.deltaBig}>
                <span className={`${styles.num} ${styles.up}`}>
                  {signed(d.biggest_improvement.score_delta)}
                </span>
                <span className="muted">
                  {d.biggest_improvement.from} → {d.biggest_improvement.to} ·
                  coverage {signed(d.biggest_improvement.coverage_delta)}
                  {d.biggest_improvement.same_tool ? " · same tool" : ""}
                </span>
              </div>
              <span className="small muted">
                Failures removed:{" "}
                {d.biggest_improvement.removed_failures.length}. Items that
                improved:
              </span>
              <ul className={styles.chips} aria-label="Items that improved">
                {d.biggest_improvement.improved.length ? (
                  d.biggest_improvement.improved.map((i) => (
                    <li key={i}>{i}</li>
                  ))
                ) : (
                  <li>none</li>
                )}
              </ul>
            </div>
          )}
          {d.biggest_regression && (
            <div className={styles.deltaCell}>
              <span className="label">Biggest regression</span>
              <div className={styles.deltaBig}>
                <span className={`${styles.num} ${styles.down}`}>
                  {signed(d.biggest_regression.score_delta)}
                </span>
                <span className="muted">
                  {d.biggest_regression.from} → {d.biggest_regression.to} ·
                  coverage {signed(d.biggest_regression.coverage_delta)}
                  {d.biggest_regression.same_tool ? " · same tool" : ""}
                </span>
              </div>
              <span className="small muted">
                New failures: {d.biggest_regression.new_failures.length}. Items
                that regressed:
              </span>
              <ul className={styles.chips} aria-label="Items that regressed">
                {d.biggest_regression.regressed.length ? (
                  d.biggest_regression.regressed.map((i) => (
                    <li key={i}>{i}</li>
                  ))
                ) : (
                  <li>none</li>
                )}
              </ul>
            </div>
          )}
          <div className={styles.deltaCell}>
            <span className="label">Most persistent failures</span>
            <ul
              className={styles.persist}
              aria-label="Most persistent failures"
            >
              {d.most_persistent_failures.map((f) => (
                <li key={f.id}>
                  <span>
                    {f.id}
                    <span
                      className={styles.bar}
                      style={{
                        ["--w" as string]: `${(f.fails / f.of) * 100}%`,
                      }}
                      aria-hidden="true"
                    >
                      <i />
                    </span>
                  </span>
                  <span>
                    {f.fails} of {f.of}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.deltaCell}>
            <span className="label">Across the whole run</span>
            <Defs
              items={[
                [
                  "First vs last",
                  d.first_vs_last
                    ? `${d.first_vs_last.from} → ${d.first_vs_last.to}: ${signed(d.first_vs_last.score_delta)} score`
                    : "—",
                ],
                [
                  "Category improved most",
                  d.category_improved_most
                    ? `${d.category_improved_most.category}: ${pct(d.category_improved_most.first)} → ${pct(d.category_improved_most.last)} (${d.category_improved_most.delta === null ? "—" : signed(d.category_improved_most.delta)})`
                    : "—",
                ],
                [
                  "Category improved least",
                  d.category_improved_least
                    ? `${d.category_improved_least.category}: ${pct(d.category_improved_least.first)} → ${pct(d.category_improved_least.last)} (${d.category_improved_least.delta === null ? "—" : signed(d.category_improved_least.delta)})`
                    : "—",
                ],
                ["Pairs compared", String(d.pairs.length)],
              ]}
            />
            <span className="small faint">
              A regression on the ruler is a fact about the ruler and the
              surface it saw, not a verdict on the design as a whole; the ruler
              is one frozen audit, and coverage says how much of it applied.
            </span>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="findings-title">
        <SectionIntro
          id="findings-title"
          eyebrow="Findings"
          title={`${findings.count} failures, each with its evidence.`}
          lead="A FAIL is only recorded with the measurement that produced it and the rule it was measured against. Counts by category, then a sample spanning the milestones."
        />
        <ul className={styles.findCats} aria-label="Findings by category">
          {findings.byCategory.map((c) => (
            <li key={c.id}>
              <span
                className={`${styles.num}`}
                style={{
                  fontSize: "var(--t-h2)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {c.count}
              </span>
              <span className="small">{c.title}</span>
              <span className="small faint mono">{c.id}</span>
            </li>
          ))}
        </ul>
        <span className="label">
          {findings.examples.length} of {findings.count}
        </span>
        <ol
          className={styles.findings}
          style={{ marginTop: 12 }}
          aria-label="Example findings"
        >
          {findings.examples.map((f) => (
            <li key={f.id} className={styles.finding}>
              <span>{f.milestone}</span>
              <div className={styles.findingBody}>
                <span className={styles.findingItem}>
                  <span className={styles.warm}>{f.state}</span>
                  <span>{f.item}</span>
                  <span className="muted">
                    {f.surface} · {f.viewport}
                    {f.impact ? ` · impact ${f.impact}` : ""}
                  </span>
                </span>
                <span className={styles.findingEvidence}>{f.evidence}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.sources}>
          <SourceList sources={[findings.source]} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="yield-title">
        <SectionIntro
          id="yield-title"
          eyebrow="Learning yield"
          title="How many failures became something reusable."
          lead="Findings are the raw material. The yield is the share that became a durable learning, then a resource candidate, then a resource that a later tool actually reused."
        />
        {learningYield.computed ? (
          <>
            {learningYield.states.length > 0 && (
              <div className={styles.states}>
                {learningYield.states.map(([state, n]) => (
                  <div key={state}>
                    <span className={styles.bigNum}>{n}</span>
                    <span className="small muted">{state}</span>
                  </div>
                ))}
              </div>
            )}
            <div
              className={styles.tableWrap}
              tabIndex={0}
              role="region"
              aria-label="Learning yield per tool; scrolls horizontally"
            >
              <table className={styles.table}>
                <caption className="sr">Learning yield per tool</caption>
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col" className={styles.numRight}>
                      Findings
                    </th>
                    <th scope="col" className={styles.numRight}>
                      Meaningful
                    </th>
                    <th scope="col" className={styles.numRight}>
                      Durable learnings
                    </th>
                    <th scope="col" className={styles.numRight}>
                      Resource candidates
                    </th>
                    <th scope="col" className={styles.numRight}>
                      Promoted
                    </th>
                    <th scope="col" className={styles.numRight}>
                      Later reused
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {learningYield.perTool.map((t) => (
                    <tr key={t.tool_id}>
                      <td>{t.name}</td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.findings_total}
                      </td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.meaningful_findings}
                      </td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.durable_learnings}
                      </td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.resource_candidates}
                      </td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.resources_promoted}
                      </td>
                      <td className={`${styles.num} ${styles.numRight}`}>
                        {t.resources_later_reused}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`small faint ${styles.tableNote}`}>
              {learningYield.items} items in the yield record.
            </p>
          </>
        ) : (
          <NotYet
            what="Per tool: findings, meaningful findings, durable learnings, resource candidates, resources promoted, resources later reused — and the count of items in each learning state."
            source={learningYield.source}
          />
        )}
      </section>

      <section className="container section" aria-labelledby="transfer-title">
        <SectionIntro
          id="transfer-title"
          eyebrow="Resource transfer graph"
          title="Which tool taught which, with the evidence for each edge."
          lead="An edge is verified only when repository content — a commit, a file, an attribution — names the transfer. Everything else stays unverified even when it is likely."
        />
        {transferGraph.computed ? (
          <>
            <div className={styles.states}>
              <div>
                <span className={styles.bigNum}>{transferGraph.nodes}</span>
                <span className="small muted">nodes</span>
              </div>
              <div>
                <span className={styles.bigNum}>
                  {transferGraph.edges.length}
                </span>
                <span className="small muted">edges</span>
              </div>
              <div>
                <span className={styles.bigNum}>
                  {transferGraph.verifiedCount}
                </span>
                <span className="small muted">verified edges</span>
              </div>
              <div>
                <span className={styles.bigNum}>
                  {transferGraph.edges.length - transferGraph.verifiedCount}
                </span>
                <span className="small muted">
                  not verified, with the reason
                </span>
              </div>
            </div>
            <div className={styles.typeRows}>
              <div>
                <span className="label">Edge types</span>
                <ul className={styles.chips} aria-label="Edge types">
                  {transferGraph.edgeTypes.map(([t, n]) => (
                    <li key={t}>
                      {t} · {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="label">Node types</span>
                <ul className={styles.chips} aria-label="Node types">
                  {transferGraph.nodeTypes.map(([t, n]) => (
                    <li key={t}>
                      {t} · {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {transferGraph.chains.length > 0 && (
              <>
                <span
                  className="label"
                  style={{ display: "block", marginTop: 40 }}
                >
                  End-to-end chains · {transferGraph.chains.length}
                </span>
                <ol className={styles.chains} aria-label="End-to-end chains">
                  {transferGraph.chains.map((c) => (
                    <li key={c.name}>
                      <div className={styles.edgeMain}>
                        <span>{c.name}</span>
                        {c.note && (
                          <span className="small muted">{c.note}</span>
                        )}
                      </div>
                      <span
                        className={
                          c.fullyVerified ? styles.verified : styles.unverified
                        }
                      >
                        {c.fullyVerified ? "fully verified" : "partly verified"}{" "}
                        · {c.edges} edges
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <details className={styles.details}>
              <summary>
                <span>Every edge, with its evidence</span>
                <span className="mono small muted">
                  {transferGraph.edges.length} edges ·{" "}
                  {transferGraph.verifiedCount} verified
                </span>
              </summary>
              <ul className={styles.edges} aria-label="Transfer edges">
                {transferGraph.edges.map((e) => (
                  <li key={e.id} className={styles.edge}>
                    <div className={styles.edgeMain}>
                      <span>
                        <span className="mono small muted">{e.id} · </span>
                        {e.fromLabel}
                        <span className={styles.edgeArrow} aria-label="to">
                          →
                        </span>
                        {e.toLabel}
                        <span className="mono small muted"> · {e.type}</span>
                      </span>
                      <span className="small muted">{e.evidence}</span>
                      {e.note && <span className="small faint">{e.note}</span>}
                    </div>
                    <span
                      className={
                        e.verified ? styles.verified : styles.unverified
                      }
                    >
                      {e.verified ? "verified" : "not verified"}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            {transferGraph.noneVerified.length > 0 && (
              <>
                <span
                  className="label"
                  style={{ display: "block", marginTop: 40 }}
                >
                  Checked and not supported ·{" "}
                  {transferGraph.noneVerified.length}
                </span>
                <ul
                  className={styles.edges}
                  style={{ marginTop: 12 }}
                  aria-label="Claims checked and not supported"
                >
                  {transferGraph.noneVerified.map((n, i) => (
                    <li key={i} className={styles.edge}>
                      <div className={styles.edgeMain}>
                        <span>{n.claim}</span>
                        <span className="small muted">{n.why}</span>
                      </div>
                      <span className={styles.unverified}>
                        {n.withheld
                          ? "not verified · withheld"
                          : "not verified"}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className={styles.sources}>
              <SourceList sources={[transferGraph.source]} label="Read from" />
            </div>
          </>
        ) : (
          <NotYet
            label="N/A — no edges recorded yet"
            what="Nodes are tools and resources; edges carry a type, the evidence that supports them, and a verified flag that only repository content can set."
            source={transferGraph.source}
          />
        )}
      </section>

      <section className="container section" aria-labelledby="atomic-title">
        <SectionIntro
          id="atomic-title"
          eyebrow="Atomic AI Design"
          title="Six layers, from a single rule to the feedback that makes the next one."
          lead="The theory the case study proposes, stated in the formulation it recommends. It is a lens on the record above, not a result of it."
        />
        <div className={styles.atomic}>
          <div className="stack">
            <blockquote className={styles.formulation}>
              {atomic.formulation}
            </blockquote>
            {atomic.lede ? (
              <p className="body muted">{atomic.lede}</p>
            ) : (
              <p className="small faint">
                The theory document (<code>{atomic.source.path}</code>) has not
                been written yet; the formulation above is the one the case
                study recommends, and the layers below are its skeleton.
              </p>
            )}
            {atomic.figure ? (
              <figure className={styles.figure}>
                {/* eslint-disable-next-line @next/next/no-img-element -- an SVG figure in a static export */}
                <img
                  src={atomic.figure}
                  alt="Atomic AI Design: six layers — atomic, molecular, organism, system, product, feedback — drawn as a loop in which feedback returns to the atomic layer"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="small faint">
                  Figure from {atomic.source.path.replace(/\.md$/, ".svg")}.
                </figcaption>
              </figure>
            ) : null}
          </div>
          <ol className={styles.layers} aria-label="The six layers">
            {atomic.layers.map((l) => (
              <li key={l.id}>
                <strong>{l.name}</strong>
                <span>{l.what}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section" aria-labelledby="work-title">
        <SectionIntro
          id="work-title"
          eyebrow="Work system"
          title="What the learning turned into."
          lead="The resources the framework currently carries, read from the registry. Each one has a job, a routing boundary, a construction score where audited, and the evidence it still owes."
        />
        <div className={styles.work}>
          <div>
            <span className={styles.bigNum}>{boundary.counts.skills}</span>
            <span className="small muted">active skills</span>
          </div>
          <div>
            <span className={styles.bigNum}>{boundary.counts.agents}</span>
            <span className="small muted">active agents</span>
          </div>
          <div>
            <span className={styles.bigNum}>
              {boundary.counts.supersededResources}
            </span>
            <span className="small muted">superseded, kept for provenance</span>
          </div>
        </div>
        <CtaRow>
          <Cta href="/resources">What capability has been encoded</Cta>
          <Cta href="/how-it-works">How the loop keeps it</Cta>
        </CtaRow>
      </section>

      <section className="container section" aria-labelledby="evidence-title">
        <SectionIntro
          id="evidence-title"
          eyebrow="Evidence"
          title="The boundary this page does not move."
        />
        <div className={styles.evidence}>
          <div>
            <p className={styles.rule}>{boundary.rule}</p>
            <Defs
              items={[
                ["Release", `v${boundary.release} — ${boundary.releaseStage}`],
                ["Stable evidence baseline", `v${boundary.stableBaseline}`],
                [
                  "Evidence level",
                  <>
                    {boundary.cel} maximum, for every active resource —{" "}
                    <Term id="cel">what the levels mean</Term>
                  </>,
                ],
                ["Controlled runtime", boundary.runtimeStatus],
                ["Runtime uplift", boundary.runtimeUplift],
                [
                  "Paid experimental calls",
                  `${boundary.paidCalls} — and this work adds ${boundary.addedPaidCalls}`,
                ],
              ]}
            />
            <div style={{ marginTop: 32 }}>
              <CtaRow>
                <Cta href="/evidence">
                  What has and hasn&apos;t been demonstrated
                </Cta>
              </CtaRow>
            </div>
          </div>
          <SourceList sources={boundary.sources} label="Read from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="unknowns-title">
        <SectionIntro
          id="unknowns-title"
          eyebrow="Known unknowns"
          title="Declared before the work, kept after it."
          lead="The limits of the record, written where the reader can see them. None of these is fixed by reading the page more charitably."
        />
        <ol className={styles.unknowns} aria-label="Known unknowns">
          {unknowns.map((u, i) => (
            <li key={i}>
              <div className={styles.unknownBody}>
                <span>{u.markdown ? <Inline text={u.what} /> : u.what}</span>
                <span className="small faint">
                  <code>{u.source.path}</code>
                  {u.source.note ? ` — ${u.source.note}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section" aria-labelledby="film-title">
        <SectionIntro
          id="film-title"
          eyebrow="Film"
          title="The evolution, cut to length."
          lead="A Remotion composition over the same milestone captures shown above. Rendered locally; the site build never renders it."
        />
        <div className={styles.film}>
          {film.present ? (
            <video
              className={styles.video}
              controls
              preload="none"
              poster={film.poster ?? undefined}
              aria-label="Compound Design — the evolution film"
            >
              <source src={film.src} type="video/mp4" />
              {film.captions && (
                <track
                  kind="captions"
                  src={film.captions}
                  srcLang="en"
                  label="English"
                />
              )}
              {film.fallback}
            </video>
          ) : (
            <>
              {film.poster && (
                <figure className={styles.figure} style={{ maxWidth: 960 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- poster frame in a static export */}
                  <img
                    src={film.poster}
                    alt={film.posterAlt}
                    loading="lazy"
                    decoding="async"
                    width={film.posterWidth ?? undefined}
                    height={film.posterHeight ?? undefined}
                  />
                  <figcaption className="small faint">
                    Poster frame. The player appears here once the master render
                    is present at {film.src}.
                  </figcaption>
                </figure>
              )}
              <p className="body muted">{film.fallback}</p>
            </>
          )}
          <div className={styles.filmMeta}>
            <span className="small muted">
              Master: <code>{film.src}</code> —{" "}
              {film.present
                ? "present in this export"
                : "absent from this export"}
              .
            </span>
            {film.storyboard.present ? (
              <a
                className="small"
                href={film.storyboard.href}
                rel="noopener"
                style={{
                  textDecoration: "underline",
                  textUnderlineOffset: "0.2em",
                }}
              >
                Storyboard
              </a>
            ) : (
              <span className="small faint">
                Storyboard: not yet published (
                <code>{film.storyboard.path}</code>).
              </span>
            )}
          </div>
          <SourceList sources={[film.renderer]} label="Rendered by" />
        </div>
      </section>
    </>
  );
}
