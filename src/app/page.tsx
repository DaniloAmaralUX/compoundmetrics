import type { Metadata } from "next";
import { canonical, navigation } from "@/content/navigation";
import { cdqi, cel } from "@/content/evidence";
import { CurrentStateBlock } from "@/components/CurrentState";
import { Cta, CtaRow, EvidenceBoundary, Row, Rows, SectionIntro } from "@/components/editorial";
import { ProcessFlow, Transformation, WhatCompounds } from "@/components/teach";
import { Term } from "@/components/Term";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "Compound Design" },
  description: `${canonical.definition} ${canonical.thesis}`,
};

export default function HomePage() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <span className="label">Design engineering · humans + AI agents</span>
        <h1 className="display">
          {canonical.headline[0]}
          <br />
          {canonical.headline[1]}
        </h1>
        <p className={`lead ${styles.heroLead}`}>
          {canonical.definition} {canonical.thesis} The judgment spent on one project should not vanish with the transcript; it should be waiting, in a form the next project can use, when
          the next project starts.
        </p>
      </section>

      <section className={`container ${styles.demo}`} aria-labelledby="transformation-title">
        <h2 id="transformation-title" className="sr">
          How one project improves the next
        </h2>
        <Transformation />
        <p className={`small muted ${styles.demoNote}`}>
          Nothing here is a document you read at the end. Each form is produced by a stage of the work, and the last one is where the next project begins.
        </p>
      </section>

      <section className="container section" aria-labelledby="compounds-title">
        <SectionIntro id="compounds-title" eyebrow="What actually compounds?" title="Not effort. Not documents. Judgment, in a form that can be used again." lead="Most of what happens in a project is not worth keeping. The little that is has to change form to survive." />
        <WhatCompounds />
      </section>

      <section className="container section" aria-labelledby="loop-title">
        <SectionIntro
          id="loop-title"
          eyebrow="The loop"
          title="Six questions, in order, then again with more than you started with."
          lead="Craft is not a stage. It is a quality of the answers, expressed through Model, Verify and Polish and through the specialists they call — only when the work has a question that needs them."
        />
        <ProcessFlow />
      </section>

      <section className="container section" aria-labelledby="evidence-title">
        <SectionIntro id="evidence-title" eyebrow="The critical idea" title="A thing can be well built and still unproven. Usually, it is." />
        <div className={styles.boundary}>
          <EvidenceBoundary left="Built well" right="Proven useful" leftNote="Is the resource bounded, grounded, actionable, testable, maintainable?" rightNote="Does it make the work better than without it — measured, repeated, against a baseline?" />
        </div>
        <div className={styles.names}>
          <div className={styles.name}>
            <span className="label">The first question has a name</span>
            <span className={styles.nameBig}>
              <Term id="cdqi">{cdqi.name}</Term>
            </span>
            <span className="muted">{cdqi.question}</span>
            <span className="small faint">{cdqi.range}, judged and written down. Never inferred from a good output.</span>
          </div>
          <div className={styles.name}>
            <span className="label">So does the second</span>
            <span className={styles.nameBig}>
              <Term id="cel">{cel.name}</Term>
            </span>
            <span className="muted">{cel.question}</span>
            <span className="small faint">{cel.range}, moved only by new evidence. Never by construction, praise or popularity.</span>
          </div>
        </div>
        <p className={`body muted ${styles.evidenceNote}`}>
          They are never merged into one number. That is the rule the whole system is built to keep — and the reason this site can tell you, plainly, what has and has not been shown.
        </p>
      </section>

      <section className="container section" aria-labelledby="status-title">
        <SectionIntro id="status-title" eyebrow="Where the project stands" title="An experiment that says what it knows and what it does not." />
        <CurrentStateBlock />
      </section>

      <section className="container section" aria-labelledby="next-title">
        <SectionIntro id="next-title" eyebrow="Where to go next" title="See it, then understand it, then name it." lead="Each page is built for one thing you should be able to say afterwards." />
        <Rows>
          {navigation
            .filter((n) => n.href !== "/")
            .map((n) => (
              <Row key={n.href} href={n.href} title={n.label} sub={`“${n.outcome}”`} meta={<span>{n.href}</span>} />
            ))}
        </Rows>
        <div className={styles.finalCta}>
          <CtaRow>
            <Cta href="/lab">Watch Compound happen</Cta>
            <Cta href="/how-it-works">Understand the mechanism</Cta>
          </CtaRow>
        </div>
      </section>
    </>
  );
}
