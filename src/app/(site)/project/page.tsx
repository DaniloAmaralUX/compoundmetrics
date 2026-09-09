import type { Metadata } from "next";
import { CurrentStateBlock } from "@/components/CurrentState";
import { Cta, CtaRow, PageIntro, SectionIntro } from "@/components/editorial";
import { Timeline } from "@/components/Timeline";
import { Term } from "@/components/Term";
import { e2Status } from "@/content/current-state";
import { projectIntro, projectStages } from "@/content/project";
import styles from "./project.module.css";

export const metadata: Metadata = {
  title: "Project",
  description: "What Compound Design is, why it exists, where it stands, what it has demonstrated, what it has not, and what comes next.",
};

export default function ProjectPage() {
  return (
    <>
      <PageIntro eyebrow="The project" title={projectIntro.headline} lead={projectIntro.body} />

      <section className="container section" aria-labelledby="status-title">
        <SectionIntro id="status-title" eyebrow="Where it stands" title="The record, not the pitch." lead="Every value below is read from the repository at build time. If the registry changes, this page changes; nothing here is typed by hand." />
        <CurrentStateBlock variant="full" />
        <p className={`mono small muted ${styles.status}`}>{e2Status}</p>
      </section>

      <section className="container section" aria-labelledby="timeline-title">
        <SectionIntro
          id="timeline-title"
          eyebrow="How it got here"
          title="Versions are earned, not scheduled."
          lead="Each stage answers a question the previous one raised. Dates are not the axis — a version exists only when the system changed enough to deserve one, and each stage records what it learned and what it still does not know."
        />
        <Timeline stages={projectStages} />
      </section>

      <section className="container section" aria-labelledby="read-title">
        <SectionIntro id="read-title" eyebrow="How to read this" title="Two numbers, never one." />
        <div className={styles.read}>
          <p className="body">
            A stage can build a great deal and prove nothing. That is not a contradiction here; it is the normal case, and the vocabulary exists to keep it visible. Construction quality is{" "}
            <Term id="cdqi">CDQI</Term>. Evidence maturity is <Term id="cel">CEL</Term>. The gap between what a resource is built to do and what has been shown is its{" "}
            <Term id="evidence-debt">evidence debt</Term>, and it is written down per resource.
          </p>
          <p className="body muted">
            The project succeeds if it can discover it is wrong. The next stage is designed so that the baseline can win, and so that a resource which adds nothing over the open-source work it
            learned from is removed rather than defended.
          </p>
          <CtaRow>
            <Cta href="/evidence">What has and hasn&apos;t been demonstrated</Cta>
            <Cta href="/resources">What capability has been encoded</Cta>
          </CtaRow>
        </div>
      </section>
    </>
  );
}
