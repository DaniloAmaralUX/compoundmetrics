import type { Metadata } from "next";
import { Cta, CtaRow, EvidenceBadge, PageIntro, Row, Rows } from "@/components/editorial";
import { Term } from "@/components/Term";
import { currentState, v } from "@/content/current-state";
import { kindLabel, loopOrder, resourceGroups, resourcesInGroup } from "@/content/resources";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Resources",
  description: "The capability Compound Design has encoded: the work system, what surrounds it, the specialists, the quality and learning procedures, and the agents.",
};

export default function ResourcesPage() {
  const s = currentState;
  return (
    <>
      <PageIntro
        eyebrow="Resources"
        title="What capability has been encoded."
        lead="Every resource is a procedure or a specialist with a declared contract, a public name, an evidence level and a record of what it still owes. Public names first; technical identifiers stay in the margin."
        aside={
          <>
            <span className="label">In this release</span>
            <span className="small muted">
              {s.counts.skills} skills · {s.counts.agents} agents · {v(s.currentVersion)}
            </span>
            <span className="small muted">
              Every active resource holds <Term id="cel">{s.currentCEL}</Term>. Construction scores exist only where a construction audit was written.
            </span>
          </>
        }
      />

      <section className="container" aria-label="The loop, in order">
        <div className={styles.loopStrip}>
          <span className="label">The loop, in order</span>
          <div className={styles.loopChain}>
            {loopOrder.map((id, i) => (
              <span key={id}>
                <a href={`#${id}`} className={styles.loopLink}>
                  {id.replace("cd-", "")}
                </a>
                {i < loopOrder.length - 1 && <i aria-hidden="true">→</i>}
              </span>
            ))}
            <span className={styles.loopRepeat}>↻</span>
          </div>
        </div>
      </section>

      {resourceGroups.map((g) => {
        const list = resourcesInGroup(g.id);
        if (!list.length) return null;
        return (
          <section key={g.id} className={`container ${styles.group}`} aria-labelledby={`group-${g.id}`}>
            <div className={styles.groupHead}>
              <h2 id={`group-${g.id}`} className="h2">
                {g.name}
              </h2>
              <p className="lead">{g.lede}</p>
            </div>
            <Rows>
              {list.map((r) => (
                <div key={r.id} id={r.id} className={styles.anchor}>
                  <Row
                    href={`/resources/${r.id}`}
                    title={r.publicName}
                    sub={r.oneSentence}
                    meta={
                      <>
                        <span className="faint">{kindLabel[r.kind].toLowerCase()}</span>
                        <EvidenceBadge cel={r.cel} cdqi={r.cdqi} />
                      </>
                    }
                  />
                </div>
              ))}
            </Rows>
          </section>
        );
      })}

      <section className="container section" aria-label="Next">
        <div className={styles.foot}>
          <p className="body muted">
            Three words that mean different things here: a <Term id="skill">skill</Term> is a procedure, an <Term id="agent">agent</Term> is a specialist dispatched into its own context, and
            a <Term id="resource">resource</Term> is anything a procedure uses. An agent never restates its skill; it points at it, and a deterministic test makes sure.
          </p>
          <CtaRow>
            <Cta href="/evidence">What each resource still owes</Cta>
            <Cta href="/how-it-works">How a resource comes to exist</Cta>
          </CtaRow>
        </div>
      </section>
    </>
  );
}
