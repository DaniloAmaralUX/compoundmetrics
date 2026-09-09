import type { Metadata } from "next";
import { Cta, CtaRow, PageIntro, SectionIntro } from "@/components/editorial";
import { Chain, DurabilityTest, LearningTransformation, NotEverythingCompounds } from "@/components/teach";
import { Term } from "@/components/Term";
import { signupExample } from "@/content/examples";
import styles from "./how.module.css";

export const metadata: Metadata = {
  title: "How it Works",
  description: "How project work becomes reusable capability: one concrete example, followed step by step as the knowledge changes form.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title="A team is building a signup experience."
        lead={signupExample.setting}
        aside={
          <>
            <span className="label">What you should be able to say</span>
            <span className="small muted">“I understand how project work becomes reusable capability.”</span>
          </>
        }
      />

      <section className="container" aria-labelledby="example-title">
        <h2 id="example-title" className="sr">
          {signupExample.title}
        </h2>
        <LearningTransformation example={signupExample} />
      </section>

      <section className="container section" aria-labelledby="where-title">
        <SectionIntro id="where-title" eyebrow="Where the learning goes" title="Knowledge changes form on its way to the next project." lead="Every arrow is a decision someone has to make. The system provides the forms and the tests; it does not decide for you what deserves to survive." />
        <div className={styles.chainWrap}>
          <Chain items={["Work", "Observation", "Solution", "Learning Ledger", "Rule · Pattern · Skill · Agent · Eval", "Future work"]} highlight={[3, 4]} />
        </div>
        <div className={styles.split}>
          <div className={styles.splitMain}>
            <NotEverythingCompounds />
          </div>
          <div className={styles.splitAside}>
            <span className="label">The durability test</span>
            <DurabilityTest />
            <p className="small muted">
              Effort spent and the size of the change confer no eligibility. A learning that is already recoverable from the code is not written down again.
            </p>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="names-title">
        <SectionIntro id="names-title" eyebrow="Now the names" title="You have already seen these three things work." />
        <div className={styles.names}>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="durable-learning">Durable learning</Term>
            </span>
            <span className="muted">The sentence that survived the signup form — written once, only because it passed the test.</span>
          </div>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="learning-ledger">Learning Ledger</Term>
            </span>
            <span className="muted">Where the observation and its correction were recorded, in a fixed shape, before anyone decided whether it was durable.</span>
          </div>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="discoverability">Discoverability</Term>
            </span>
            <span className="muted">How the next project found it — through the literal signals that recurred, not through anyone remembering it existed.</span>
          </div>
        </div>
        <div className={styles.ctas}>
          <CtaRow>
            <Cta href="/lab">Now watch it happen</Cta>
            <Cta href="/resources">See what has been encoded so far</Cta>
          </CtaRow>
        </div>
      </section>
    </>
  );
}
