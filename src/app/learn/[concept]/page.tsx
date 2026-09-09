import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta, CtaRow, Defs, PageIntro, Row, Rows } from "@/components/editorial";
import { conceptById, conceptGroups, concepts } from "@/content/concepts";
import { resources } from "@/content/resources";
import type { Concept, ConceptGroup } from "@/content/types";
import styles from "./concept.module.css";

const REPO = "https://github.com/DaniloAmaralUX/compoundmetrics/blob/main";

export function generateStaticParams() {
  return concepts.map((c) => ({ concept: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const c = conceptById((await params).concept);
  if (!c) return {};
  return { title: c.title, description: c.oneSentence };
}

/** Where a reader sees this concept at work on the site, by group. */
const seeIt: Record<ConceptGroup, { href: string; label: string }> = {
  foundations: { href: "/resources", label: "See the resources it describes" },
  evidence: { href: "/evidence", label: "See it on the Evidence page" },
  learning: { href: "/lab", label: "Watch it happen in the Lab" },
  benchmark: { href: "/project", label: "See the experiment on the Project page" },
  harness: { href: "/project", label: "See the experiment on the Project page" },
  measurement: { href: "/project", label: "See how results would be read" },
  tooling: { href: "/project", label: "See where it sits in the project" },
};

export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) {
  const c = conceptById((await params).concept);
  if (!c) notFound();
  const group = conceptGroups.find((g) => g.id === c.group)!;
  const related = c.related.map((id) => conceptById(id)).filter((x): x is Concept => Boolean(x));
  const usedBy = resources.filter((r) => r.concepts.includes(c.id));
  return (
    <>
      <PageIntro
        eyebrow={`Field Guide · ${group.name}`}
        title={c.title}
        lead={c.oneSentence}
        aside={
          <>
            <span className="label">Current status</span>
            <span className="small muted">{c.status}</span>
          </>
        }
      />

      <div className={`container ${styles.layout}`}>
        <article className={styles.main}>
          <section className={styles.simple} aria-label="Plain language">
            <p className={styles.plain}>{c.plain}</p>
            <div className={styles.pair}>
              <div className={styles.cell}>
                <span className="label">Why it exists</span>
                <p>{c.why}</p>
              </div>
              <div className={styles.cell}>
                <span className="label">An analogy</span>
                <p className={styles.analogy}>{c.analogy}</p>
              </div>
            </div>
            <div className={styles.cell}>
              <span className="label">See it in practice</span>
              <p>{c.inPractice}</p>
              <Link href={seeIt[c.group].href} className={styles.inlineLink}>
                {seeIt[c.group].label} →
              </Link>
            </div>
            <div className={styles.cell}>
              <span className="label">In Compound Design</span>
              <p>{c.inCompound}</p>
            </div>
            <div className={styles.cell}>
              <span className="label">What fails without it</span>
              <p className={styles.fails}>{c.failsWithout}</p>
            </div>
          </section>

          <details className={styles.technical}>
            <summary className={styles.summary}>
              <span>Technical definition</span>
              <span className="small faint">The precise version, with its source</span>
            </summary>
            <div className={styles.technicalBody}>
              <p>{c.technical}</p>
              <Defs
                items={[
                  ["Source", <a key="src" className={`mono ${styles.inlineLink}`} href={`${REPO}/${c.source.path}`} rel="noopener">{c.source.path}</a>],
                  ...(c.source.note ? ([["Where", c.source.note]] as Array<[string, string]>) : []),
                  ["Status", c.status],
                  ["Also called", c.aliases.join(" · ")],
                ]}
              />
            </div>
          </details>
        </article>

        <aside className={styles.side}>
          {related.length > 0 && (
            <div className={styles.sideBlock}>
              <span className="label">Related concepts</span>
              <Rows>
                {related.map((r) => (
                  <Row key={r.id} href={`/learn/${r.id}`} title={r.title} />
                ))}
              </Rows>
            </div>
          )}
          {usedBy.length > 0 && (
            <div className={styles.sideBlock}>
              <span className="label">Resources that lean on it</span>
              <Rows>
                {usedBy.map((r) => (
                  <Row key={r.id} href={`/resources/${r.id}`} title={r.publicName} />
                ))}
              </Rows>
            </div>
          )}
          <div className={styles.sideBlock}>
            <span className="label">This group</span>
            <p className="small muted">{group.lede}</p>
            <Link href={`/learn#${group.id}`} className={`small ${styles.inlineLink}`}>
              All {group.name.toLowerCase()} terms →
            </Link>
          </div>
        </aside>
      </div>

      <section className="container section" aria-label="Next">
        <CtaRow>
          <Cta href="/learn">Back to the Field Guide</Cta>
        </CtaRow>
      </section>
    </>
  );
}
