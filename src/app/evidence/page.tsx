import type { Metadata } from "next";
import Link from "next/link";
import { Cta, CtaRow, Defs, EvidenceBadge, EvidenceBoundary, PageIntro, Row, Rows, SectionIntro, SourceList } from "@/components/editorial";
import { Term } from "@/components/Term";
import { currentState, v } from "@/content/current-state";
import { cdqi, cel, evidenceLevels, invariants, notEvidence } from "@/content/evidence";
import { resources } from "@/content/resources";
import styles from "./evidence.module.css";

export const metadata: Metadata = {
  title: "Evidence",
  description: "What has and has not been demonstrated: construction quality versus evidence maturity, the evidence ladder, and the current state of every resource.",
};

export default function EvidencePage() {
  const s = currentState;
  const current = evidenceLevels.findIndex((l) => l.id === s.currentCEL);
  const audited = resources.filter((r) => r.cdqi !== null).sort((a, b) => (b.cdqi ?? 0) - (a.cdqi ?? 0));
  const example = audited[0];
  return (
    <>
      <PageIntro
        eyebrow="Evidence"
        title="Not everything that is built is proven."
        lead="This page exists so that a skeptical reader can tell, without trusting anyone, what has been demonstrated about Compound Design and what has only been built. Two measures, kept apart on purpose."
        aside={
          <>
            <span className="label">What you should be able to say</span>
            <span className="small muted">“I understand exactly what has and has not been demonstrated.”</span>
          </>
        }
      />

      <section className="container" aria-labelledby="two-title">
        <h2 id="two-title" className="sr">
          Construction quality versus evidence maturity
        </h2>
        <div className={styles.boundaryWrap}>
          <EvidenceBoundary left={cdqi.name} right={cel.name} leftNote={`${cdqi.longName} · ${cdqi.range} · ${cdqi.question}`} rightNote={`${cel.longName} · ${cel.range} · ${cel.question}`} />
        </div>
        <div className={styles.two}>
          <div className={styles.col}>
            <span className="label">Construction · what is judged</span>
            <p className="body muted">{cdqi.meaning}</p>
            <ol className={styles.dims} aria-label="CDQI dimensions and weights">
              {cdqi.dimensions.map(([name, weight, q]) => (
                <li key={name}>
                  <div className={styles.dimHead}>
                    <span>{name}</span>
                    <span className="mono muted">{weight}%</span>
                  </div>
                  <span className={styles.dimBar} style={{ ["--w" as string]: `${(weight / 15) * 100}%` }} aria-hidden="true" />
                  <span className="small faint">{q}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.col}>
            <span className="label">Evidence · what has been shown</span>
            <p className="body muted">{cel.meaning}</p>
            <ol className={styles.ladder} aria-label="Evidence levels">
              {evidenceLevels.map((l, i) => (
                <li key={l.id} className={i === current ? styles.ladderCurrent : i > current ? styles.ladderFuture : ""}>
                  <span className={`mono ${styles.ladderId}`}>{l.id}</span>
                  <span className={styles.ladderName}>{l.name}</span>
                  <span className="small muted">{i === current ? "current maximum" : i < current ? "passed" : "not reached"}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="possible-title">
        <SectionIntro id="possible-title" eyebrow="The case the vocabulary exists for" title="High construction quality and low evidence, at the same time. This is the normal case." />
        {example && (
          <div className={styles.example}>
            <div className={styles.exampleBig}>
              <span className="label">A real entry from the registry</span>
              <span className={styles.exampleName}>{example.publicName}</span>
              <div className={styles.exampleNums}>
                <span>
                  <span className="label">{cdqi.name}</span>
                  <span className={`mono ${styles.exampleNum}`}>{example.cdqi?.toFixed(2)}</span>
                  <span className="small muted">{cdqi.interpretation.find(([range]) => range.startsWith("8.0"))?.[1]}</span>
                </span>
                <span>
                  <span className="label">{cel.name}</span>
                  <span className={`mono ${styles.exampleNum}`}>{example.cel}</span>
                  <span className="small muted">{evidenceLevels.find((l) => l.id === example.cel)?.name.toLowerCase()}</span>
                </span>
              </div>
            </div>
            <div className={styles.exampleRead}>
              <span className={styles.translation}>Well built. Not yet proven useful.</span>
              <p className="body muted">
                The construction audit judged its contract, routing, grounding, instructions, output, evalability and provenance and wrote the number down. The evidence level records that its
                contracts hold under deterministic checks — and that it has never been run against a baseline. Neither number is allowed to borrow from the other.
              </p>
              <Link href={`/resources/${example.id}`} className={styles.exampleLink}>
                Inspect {example.publicName} →
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="container section" aria-labelledby="ladder-title">
        <SectionIntro id="ladder-title" eyebrow="The evidence ladder" title="Each rung says what you may claim, what you may not, and what moves you up." lead="Claim classes are quoted from the framework's own definition. The current maximum is marked." />
        <ol className={styles.levels}>
          {evidenceLevels.map((l, i) => (
            <li key={l.id} className={`${styles.level} ${i === current ? styles.levelCurrent : ""} ${i > current ? styles.levelFuture : ""}`}>
              <div className={styles.levelHead}>
                <span className={`mono ${styles.levelId}`}>{l.id}</span>
                <div className={styles.levelTitle}>
                  <span className="h3">{l.name}</span>
                  <span className="muted">{l.meaning}</span>
                </div>
                <span className={styles.levelStatus}>{i === current ? "current maximum" : i < current ? "passed" : "not reached"}</span>
              </div>
              <div className={styles.levelBody}>
                <div className={styles.levelCell}>
                  <span className="label">What does this mean</span>
                  <ul>
                    {l.evidence.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.levelCell}>
                  <span className="label">Can say</span>
                  <span className={`mono ${styles.claim}`}>{l.canSay}</span>
                </div>
                <div className={styles.levelCell}>
                  <span className="label">Cannot say</span>
                  <span className={styles.cannot}>{l.cannotSay}</span>
                </div>
                <div className={styles.levelCell}>
                  <span className="label">What moves forward</span>
                  <span>{l.movesForward}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section" aria-labelledby="state-title">
        <SectionIntro id="state-title" eyebrow="Current evidence state" title="Disclosure, not dashboard." />
        <div className={styles.disclosure}>
          <Defs
            items={[
              ["Release", `${v(s.currentVersion)} — ${s.releaseTheme}, ${s.releaseStage}`],
              ["Stable evidence baseline", v(s.stableBaseline)],
              ["Evidence level", `${s.currentCEL} — ${evidenceLevels[current].name.toLowerCase()}, for every active resource`],
              ["Controlled runtime", s.runtimeStatus],
              ["Runtime uplift", s.runtimeUplift],
              ["Paid experimental calls", String(s.paidRuntimeCalls)],
              ["Latest evidence artifact", `${s.latestEvidence.what} (${s.latestEvidence.date})`],
              ["Next evidence target", s.nextEvidenceTarget.what],
            ]}
          />
          <SourceList sources={s.sources} label="Derived from" />
        </div>
      </section>

      <section className="container section" aria-labelledby="not-title">
        <SectionIntro id="not-title" eyebrow="What does not count" title="Seven things that are never evidence here." lead="Quoted from the evidence-debt rules. They are the ways a project usually talks itself into a claim." />
        <div className={styles.notGrid}>
          <ul className={styles.notList}>
            {notEvidence.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <ul className={styles.invariants} aria-label="Invariants">
            {invariants.map(([a, b]) => (
              <li key={a}>
                <span>{a}</span>
                <span className={styles.neq} aria-label="is not">
                  ≠
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section" aria-labelledby="per-title">
        <SectionIntro id="per-title" eyebrow="Per resource" title="Every active resource, its level, its construction score, and what it still owes." lead={<>A dash means construction has not been audited; it is never assumed. The list of what remains unproven is each resource&apos;s <Term id="evidence-debt">evidence debt</Term>.</>} />
        <Rows>
          {resources.map((r) => (
            <Row key={r.id} href={`/resources/${r.id}`} title={r.publicName} sub={r.evidenceDebt.length ? `Owes: ${r.evidenceDebt.join(" · ")}` : "No evidence debt recorded"} meta={<EvidenceBadge cel={r.cel} cdqi={r.cdqi} />} />
          ))}
        </Rows>
        <div className={styles.ctas}>
          <CtaRow>
            <Cta href="/project">Where the next evidence comes from</Cta>
            <Cta href="/learn/cel">Learn the vocabulary</Cta>
          </CtaRow>
        </div>
      </section>
    </>
  );
}
