import type { Metadata } from "next";
import { FieldGuideSearch } from "@/components/FieldGuideSearch";
import { Row, Rows } from "@/components/editorial";
import { conceptGroups, conceptsInGroup, concepts, searchIndex, startingPoints } from "@/content/concepts";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "Field Guide",
  description: "The Compound Design Field Guide: every term the project uses, explained in plain language first and technically after.",
};

export default function FieldGuidePage() {
  const starting = startingPoints.map((id) => searchIndex.find((e) => e.id === id)!).filter(Boolean);
  return (
    <>
      <header className={`container ${styles.intro}`}>
        <span className="label">Compound Design Field Guide · {concepts.length} concepts</span>
        <FieldGuideSearch index={searchIndex} starting={starting} />
      </header>

      <section className="container section" aria-labelledby="all-title">
        <div className={styles.allHead}>
          <h2 id="all-title" className="h2">
            Every term, by what it is for.
          </h2>
          <p className="lead">Each one opens with a plain sentence and an analogy. The technical definition comes after, once you have a reason to want it.</p>
        </div>
        <div className={styles.groups}>
          {conceptGroups.map((g) => {
            const list = conceptsInGroup(g.id);
            if (!list.length) return null;
            return (
              <div key={g.id} className={styles.group} id={g.id}>
                <div className={styles.groupHead}>
                  <h3 className="h3">{g.name}</h3>
                  <span className="muted small">{g.lede}</span>
                </div>
                <Rows>
                  {list.map((c) => (
                    <Row key={c.id} href={`/learn/${c.id}`} title={c.title} sub={c.oneSentence} />
                  ))}
                </Rows>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
